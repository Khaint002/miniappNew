var ws = null;
var wss = null;
var timeoutHandle;
var intervalId = null;
var relayTimeouts = {};
var cabinetID;
var isActive = false;
HOMEOSAPP.itemlinkQR;

var ctx_U = document.getElementById("chartVoltage").getContext("2d");
var ctx_I = document.getElementById("chartCurrent").getContext("2d");
var ctx_P = document.getElementById("chartPower").getContext("2d");
var ctx_E = document.getElementById("chartEnergy").getContext("2d");

var ChartU, ChartI, ChartP, ChartE;
// xác định thiết bị cần truy cập
async function accessDevice() {
    $('#qr-popup').hide();
    const inputValue = HOMEOSAPP.CodeCondition;

    if (inputValue == null || inputValue == "") {
        toastr.error("Vui lòng nhập mã QRcode!");
    } else {
        let dataWarranty = [];
        const dataQRcode = await HOMEOSAPP.getDM(
            "https://central.homeos.vn/service_XD/service.svc",
            "DM_QRCODE",
            "1=1"
        );
        const matchedItem = dataQRcode.data.find(
            (item) =>
                item.QR_CODE.slice(-inputValue.length).replace(/\./g, "") ===
                inputValue.replace(/\./g, "")
        );
        if (matchedItem != undefined) {
            dataWarranty.push(matchedItem);
        }
        if (dataWarranty.length == 1) {
            if (HOMEOSAPP.CodeCondition) {
                $("#loading-popup").show();
                let checkQRcode = dataWarranty[0].QR_CODE.split(",");
                const dataQRCondition = await HOMEOSAPP.getDataMDQRcode(
                    dataWarranty[0].QR_CODE.replaceAll(",", "$")
                );

                localStorage.setItem("itemCondition", JSON.stringify(dataQRCondition));
                document.getElementById("header-conditionName").textContent =
                    dataQRCondition[0].PRODUCT_NAME + "[" + checkQRcode[3] + "]";

                getWebSocket("homeos.vn:447");
            }
        } else {
            toastr.error("Sản phẩm không tồn tại hoặc chưa được thêm vào hệ thống");
        }
    }
}

// truy cập websocket

getWebSocket = async function (value) {
    try {
        const dataItemCabinet = JSON.parse(localStorage.getItem("itemCondition"));
        const qrCodeParts = dataItemCabinet[0].QR_CODE.split(",");
        cabinetID = qrCodeParts[3];
        const relayCount = parseInt(qrCodeParts[2]); // "3K" or "6K"

        const dataDevice = await HOMEOSAPP.getDM(
            "https://central.homeos.vn/service_XD/service.svc",
            "ZALO_LINKED_QRCODE",
            "ACTIVE = 1 AND QRCODE_ID = " + dataItemCabinet[0].PR_KEY
        );
        HOMEOSAPP.itemlinkQR = dataDevice.data;
        // Set header
        document.getElementById(
            "header-conditionName"
        ).textContent = `${dataDevice.data[0].NAME_DEVICE} [${cabinetID}]`;

        let localDataRaw = JSON.parse(localStorage.getItem("dataCondition")) || [];
        
        const datacontrol = localDataRaw.find(item => item.CodeCondition == cabinetID) || null;
        // Render UI components
        await renderReray(dataItemCabinet[0].QR_CODE, datacontrol);
        await createElectricityMeter(
            dataItemCabinet[0].QR_CODE,
            dataDevice.data[0].NAME_CHANNEL,
            cabinetID,
            datacontrol
        );
        runLed7(dataItemCabinet[0].QR_CODE);

        // --- WebSocket 1 ---
        ws = new WebSocket(`wss://${value}/findme`);
        ws.onopen = () => {
            ws.send(`Website/${cabinetID}/00d37cb1-eee8-42ce-9564-91687f9de0dd`);
        };

        ws.onmessage = (data) =>
            handleWSMessage(data, cabinetID, relayCount, qrCodeParts);

        // --- WebSocket 2 ---
        wss = new WebSocket(`wss://${value}/controller`);
        wss.onopen = () => {
            wss.send(`Website/${cabinetID}/00d37cb1-eee8-42ce-9564-91687f9de0dd`);
        };

        // Send refresh command after short delay
        setTimeout(() => {
            const cmd = [{ CHIP_ID: cabinetID, COMMAND: "REFRESH;" }];
            wss.send(JSON.stringify(cmd));
        }, 1000);

        // Final UI updates
        $("#loading-popup").hide();
        saveCondition(JSON.parse(localStorage.getItem("itemCondition")), datacontrol);
    } catch (e) {
        console.error("Error in getWebSocket:", e);
        // alert(`Máy chủ ${$("#txtDNSServer").val()} hiện đang tắt.!`);
    }
};
var isCollecting = false;
var collectedLines = [];
function handleWSMessage(data, cabinetID, relayCount, qrCodeParts) {
    const txt = data.data;
    const checkValue = txt.split(":");

    if (checkValue[0] === cabinetID) {
        clearTimeout(timeoutHandle);
        timeoutHandle = setTimeout(noDataReceived, 120000);

        if (txt.includes("LR SCHEDULE;")) {
            isCollecting = true;
            collectedLines = []; // bắt đầu mới
            return;
        }

        if (txt.includes("Command: LR SCHEDULE, process: Done")) {
            isCollecting = false;

            // xử lý kết quả:
            const result = collectedLines.join("\n").trim();

            collectedLines = [];
            return;
        }

        if (isCollecting) {

            collectedLines.push(txt);
        }

        // if (txt.includes("Command: REFRESH") && txt.includes("process: Done")) {
        //     $("#btn-online").prop("disabled", false);
        //     document.getElementById("btn-online").innerHTML = `
        //     <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" class="bi bi-plugin" viewBox="0 0 16 16">
        //         <path fill-rule="evenodd" d="M1 8a7 7 0 1 1 2.898 5.673c-.167-.121-.216-.406-.002-.62l1.8-1.8a3.5 3.5 0 0 0 4.572-.328l1.414-1.415a.5.5 0 0 0 0-.707l-.707-.707 1.559-1.563a.5.5 0 1 0-.708-.706l-1.559 1.562-1.414-1.414 1.56-1.562a.5.5 0 1 0-.707-.706l-1.56 1.56-.707-.706a.5.5 0 0 0-.707 0L5.318 5.975a3.5 3.5 0 0 0-.328 4.571l-1.8 1.8c-.58.58-.62 1.6.121 2.137A8 8 0 1 0 0 8a.5.5 0 0 0 1 0" />
        //     </svg>
        // `;
        // }
        // Update power indicator
        updateIndicator("#power", "#d41c1f");

        // Reset device lists
        $("#cboDeviceServer").empty();
        $("#listDevice").empty();

        if (txt !== "NOT FOUND") {
            if (txt.slice(cabinetID.length + 1, cabinetID.length + 4) === "T:2") {
                if (intervalId) {
                    clearInterval(intervalId);
                    intervalId = null;
                }
                const temp = txt.split(",");
                document.getElementById("setDateTimeCondition").textContent =
                    temp[0].substring(cabinetID.length + 3);
                document.getElementById("statusCabinet").textContent = "Online";
                updateIndicator("#online", "#ceac30");

                // Process relay state
                if (temp[temp.length - 1].startsWith("RL")) {
                    const number = parseInt(temp[temp.length - 1].substring(3));
                    const binaryArray = number
                        .toString(2)
                        .padStart(relayCount, "0")
                        .split("")
                        .reverse();

                    binaryArray.forEach((bit, i) => {
                        const color = bit === "1" ? "#08ed0a" : "#000000";
                        updateIndicator(`#Relay_${i + 1}`, color);

                        const icon = document.getElementById(`icon-Relay_${i + 1}`);
                        resetIcon(icon, `Relay_${i + 1}`);
                    });
                } else if (temp[temp.length - 1].startsWith("E:")) {
                    updateDataLed(txt, "testResizableArray");
                }
            }
        } else {
            $("#cboDeviceServer").append(
                $("<option>", {
                    value: txt,
                    text: txt,
                })
            );
            $("#btnAccessDevice").prop("disabled", true);
        }
    }
}

function updateIndicator(selector, color) {
    $(selector).css({
        background: color,
        "box-shadow": `0px 0px 30px 5px ${color}`,
    });
}

async function saveCondition(data, control) {
    const DataQRcode = data[0].QR_CODE.split(",");
    const typeMatch = data[0].QR_CODE.match(/(\d+)K-(\d+)TB/i);
    const numberOfRelays = typeMatch ? parseInt(typeMatch[1]) : 0; // fallback mặc định 8 nếu lỗi
    const numberOfMeters = typeMatch ? parseInt(typeMatch[2]) : 0;

    const dataDevice = await HOMEOSAPP.getDM(
        "https://central.homeos.vn/service_XD/service.svc",
        "ZALO_LINKED_QRCODE",
        "ACTIVE = 1 AND QRCODE_ID = " + data[0].PR_KEY + ""
    );
    
    let itemW = {
        CodeCondition: DataQRcode[3],
        NameCondition: dataDevice.data[0].NAME_DEVICE,
        imgCondition: data[0].PRODUCT_IMG,
        date: HOMEOSAPP.getCurrentTime(),
        domainCondition: "homeos.vn:447",
        name_channel: dataDevice.data[0].NAME_CHANNEL,
        relayNames: control?.relayNames ? control.relayNames : Array.from({ length: numberOfRelays }, (_, i) => `K${i + 1}`),
        meterNames: control?.meterNames ? control.meterNames : Array.from({ length: numberOfMeters }, (_, i) =>  dataDevice.data[0].NAME_CHANNEL + " " + (i + 1))
    };

    waranntyItems = JSON.parse(localStorage.getItem("dataCondition"));

    if (waranntyItems) {
        waranntyItems = waranntyItems.filter(
            (item) => item.CodeCondition !== itemW.CodeCondition
        );
        waranntyItems.unshift(itemW);
        if (waranntyItems.length > 20) {
            waranntyItems.shift();
        }
    } else {
        waranntyItems = [];
        waranntyItems.push(itemW);
    }

    localStorage.setItem("dataCondition", JSON.stringify(waranntyItems));
}


function updateRelayNamesFromInput(dataInput) {
    // Bước 1: Lấy dataCondition từ localStorage
    const localDataRaw = localStorage.getItem("dataCondition");
    let dataCondition = localDataRaw ? JSON.parse(localDataRaw) : [];

    // Bước 2: Duyệt từng phần tử trong dataInput
    dataInput.forEach(item => {
        const qrParts = item.QR_CODE.split(",");
        const codeCondition = qrParts[3]; // Lấy CodeCondition (vị trí 3)
        const relayInfo = qrParts[2];     // Ví dụ "6K-3TB"

        // Tách số relay từ phần đầu tiên (ví dụ "6K" => 6)
        const relayCountMatch = relayInfo.match(/^(\d+)K/);
        const relayCount = relayCountMatch ? parseInt(relayCountMatch[1]) : 8; // fallback nếu sai định dạng

        // Tìm xem tủ đã có trong danh sách chưa
        const existingIndex = dataCondition.findIndex(d => d.CodeCondition === codeCondition);

        if (existingIndex === -1) {
            // Chưa có → thêm mới
            dataCondition.push({
                CodeCondition: codeCondition,
                NameCondition: item.PRODUCT_NAME,
                imgCondition: item.PRODUCT_IMG,
                date: new Date().toLocaleString("vi-VN"),
                domainCondition: "",     // tùy bạn có muốn lấy thêm từ item không
                name_channel: "",
                relayNames: Array.from({ length: relayCount }, (_, i) => `K${i + 1}`)
            });
        } else {
            // Đã có → kiểm tra có relayNames chưa
            if (!dataCondition[existingIndex].relayNames) {
                dataCondition[existingIndex].relayNames = Array.from({ length: relayCount }, (_, i) => `K${i + 1}`);
            }
        }
    });

    // Bước 3: Ghi lại vào localStorage
    localStorage.setItem("dataCondition", JSON.stringify(dataCondition));
}

var renderReray = async function (data, control) {
    return new Promise((resolve) => {
        const typeMatch = data.match(/(\d+)K-(\d+)TB/i);
        const numberOfRelays = typeMatch ? parseInt(typeMatch[1]) : 0;
        if (numberOfRelays == 0) {
            $("#schedule-condition").addClass("d-none");
            $("#schedule-condition").removeClass("d-flex");
        }
        renderCheckboxes("sltDeviceForSchedule", numberOfRelays);
        const container = document.getElementById("relay-container");
        container.innerHTML = "";

        for (let i = 1; i <= numberOfRelays; i++) {
            let textButton;
            if(control?.relayNames){
                textButton = control.relayNames[i-1];
            } else {
                textButton = "K"+i;
            }
            const relayDiv = `
                <div class="col-4 mb-2 d-flex flex-column align-items-center">
                    <div class="mb-1" id="Relay_${i}"
                        class="bs-icon-xl bs-icon-circle d-flex flex-shrink-0 justify-content-center align-items-center d-inline-block bs-icon xl pb-2"
                        style="background: #000000;box-shadow: 0px 0px 30px 5px #000000;border: 1px solid;width: 70px;height: 70px;border-radius: 50%;">
                        <button id="btn-Relay_${i}" class="btn btn-primary buttonClickWater p-0 m-0"
                            onclick="onOffRelay('Relay_${i}', '#08ed0a')" type="button"
                            style="background-color: initial;border: none;font-size: 40px; outline: none; box-shadow: none;">
                            <svg id="icon-Relay_${i}" class="bi bi-power" xmlns="http://www.w3.org/2000/svg"
                                width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M7.5 1v7h1V1z"></path>
                                <path
                                    d="M3 8.812a4.999 4.999 0 0 1 2.578-4.375l-.485-.874A6 6 0 1 0 11 3.616l-.501.865A5 5 0 1 1 3 8.812">
                                </path>
                            </svg>
                        </button>
                    </div>
                    <div id="Edit_Relay_${i}">
                        <span class="editable-label p-2" data-id="Relay_${i}" style="height: 25px;">${textButton}</span>
                    </div>
                </div>
            `;
            container.insertAdjacentHTML("beforeend", relayDiv);
        }
        document.querySelectorAll('.editable-label').forEach((span, index) => {
            attachEditHandler(span, control);
        });
        // Hoàn thành render
        resolve();
    });
};

function renderCheckboxes(containerId, count) {
    const container = document.getElementById(containerId);
    container.innerHTML = ""; // Clear old content

    // Tính số cột Bootstrap hợp lý
    let colClass = "col-2"; // default fallback
    if (count <= 12) {
        const colSize = Math.floor(12 / count);
        colClass = `col-${colSize}`;
    } else {
        // Nếu quá 12 checkbox → dùng col-2 hoặc col-3 cho đẹp
        colClass = "col-2";
    }

    // Sinh các checkbox
    for (let i = 1; i <= count; i++) {
        const colDiv = document.createElement("div");
        colDiv.className = `${colClass} form-group content-detail`;

        const label = document.createElement("label");
        label.className = "form-label content-label";
        label.setAttribute("for", `checkboxK${i}`);
        label.innerText = `K${i}:`;

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = `checkboxK${i}`;
        checkbox.placeholder = "Nhập tên lịch...";
        checkbox.setAttribute("data-relayId", i);

        colDiv.appendChild(label);
        colDiv.appendChild(checkbox);

        container.appendChild(colDiv);
    }
}

var noDataReceived = function () {
    $("#online").css("background", "#000000");
    $("#online").css("box-shadow", "0px 0px 30px 5px #000000");
    document.getElementById("statusCabinet").textContent = "Offline";
    intervalId = setInterval(() => {
        onClose();
        getWebSocket("homeos.vn:447");
    }, 10000);
};

$("#online")
    .off("click")
    .click(function () {
        const icon = document.getElementById("btn-online");
        // $("#online").css("background", "#ceac30");
        // $("#online").css("box-shadow", "0px 0px 30px 5px" + "#ceac30");
        $("#btn-online").prop("disabled", true);
        icon.innerHTML = `
        <svg id="load-online" class="bi bi-power" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z"/>
            <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466"/>
        </svg>
    `;
        $("#load-online").addClass("spin-loading");
        setTimeout(() => {
            if ($("#online").css("background-color") == "rgb(206, 172, 48)") {
                $("#online").css("background", "#ceac30");
                $("#online").css("box-shadow", "0px 0px 30px 5px" + "#ceac30");
            }
            $("#btn-online").prop("disabled", false);
            icon.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" class="bi bi-plugin" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M1 8a7 7 0 1 1 2.898 5.673c-.167-.121-.216-.406-.002-.62l1.8-1.8a3.5 3.5 0 0 0 4.572-.328l1.414-1.415a.5.5 0 0 0 0-.707l-.707-.707 1.559-1.563a.5.5 0 1 0-.708-.706l-1.559 1.562-1.414-1.414 1.56-1.562a.5.5 0 1 0-.707-.706l-1.56 1.56-.707-.706a.5.5 0 0 0-.707 0L5.318 5.975a3.5 3.5 0 0 0-.328 4.571l-1.8 1.8c-.58.58-.62 1.6.121 2.137A8 8 0 1 0 0 8a.5.5 0 0 0 1 0" />
            </svg>
        `;
        }, 5000);
        let cmd = [{ CHIP_ID: cabinetID, COMMAND: "REFRESH;" }];
        wss.send(JSON.stringify(cmd));
    });

function formatCustomDate(date) {
    const pad = (num) => num.toString().padStart(2, "0");

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hour = pad(date.getHours());
    const minute = pad(date.getMinutes());
    const second = pad(date.getSeconds());

    return `${year}-${month}-${day}T${hour}$${minute}$${second}`;
}

$("#share-control").off("click").click(function () {
    // Hiển thị popup với hiệu ứng modal
    const dataItemLink = HOMEOSAPP.itemlinkQR;
    
    HOMEOSAPP.loadPage("share-popup");

    // Xóa nội dung mã QR cũ
    $('#qrcode').empty();

    // Dữ liệu để tạo mã QR

    const dataItemCabinet = JSON.parse(localStorage.getItem("itemCondition"));
    const text = dataItemCabinet[0].QR_CODE;
    document.getElementById("text-content-QRcode").textContent = dataItemLink[0].NAME_DEVICE + " - " + dataItemLink[0].WORKSTATION_ID;
    // Tạo mã QR
    QRCode.toCanvas(text, { width: 200 }, function (error, canvas) {
        if (error) {
            console.error("Lỗi khi tạo mã QR:", error);
            alert('Lỗi khi tạo mã QR!');
            return;
        }

        // Thêm canvas QR vào DOM
        $('#qrcode').append(canvas);

        // Tạo ảnh ẩn từ canvas (tùy chọn)
        const image = canvas.toDataURL('image/png');
        const img = $('<img>')
            .attr('src', image)
            .css({ display: 'none' }) // Ẩn ảnh đi
            .attr('id', 'hidden-image');
        $('#qrcode').append(img);
    });
});


$("#schedule-condition")
    .off("click")
    .click(function () {
        HOMEOSAPP.loadPage("schedule-condition-popup");
    });
$("#error-condition")
    .off("click")
    .click(function () {
        HOMEOSAPP.loadPage("error-condition-popup");
    });

$("#export-condition")
    .off("click")
    .click(function () {
        checkReport = "condition";
        HOMEOSAPP.renderOptions();
        $("#filter-kttv").addClass("d-none");
        $("#filter-condition").removeClass("d-none");
        HOMEOSAPP.loadPage("export-condition-popup");
    });


$("#settingAlert").on("click", function () {
    isActive = !isActive;
    if (isActive) {
        $("#view-EMS").addClass("d-none");
        $("#view-OEE").removeClass("d-none");
        $("#alertIcon")
            .attr("class", "bi bi-check-circle")
            .html(`
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM6.354 11.354l-3.182-3.182a.5.5 0 1 1 .708-.708l2.474 2.474 5.292-5.292a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0z"/>
            `);
        $("#alertText").text("Đã bật");
    } else {
        $("#view-EMS").removeClass("d-none");
        $("#view-OEE").addClass("d-none");
        $("#alertIcon")
            .attr("class", "bi bi-exclamation-circle")
            .html(`
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z" />
            `);
        $("#alertText").text("OEE");
    }

    // Gọi hàm xử lý logic nếu cần
    customToggleFunction(isActive);
});

function customToggleFunction(status) {
    console.log("Trạng thái:", status ? "Đã bật" : "Tắt");
    // Thêm xử lý tùy theo trạng thái
}

$("#BackSchedule")
    .off("click")
    .click(function () {
        HOMEOSAPP.goBack();
    });

// $("#BackExportCondition")
//     .off("click")
//     .click(function () {
//         HOMEOSAPP.goBack();
//     });

onOffRelay = function (id, color) {
    const icon = document.getElementById("icon-" + id);
    let checkID = parseInt(id.substring(6));
    if ($("#" + id).css("background-color") == "rgb(0, 0, 0)") {
        $("#" + id).css("background", "#ceac30");
        $("#" + id).css("box-shadow", "0px 0px 30px 5px" + "#ceac30");
        $("#btn-" + id).prop("disabled", true);
        icon.innerHTML = `
            <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z"/>
            <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466"/>
        `;
        $("#icon-" + id).addClass("spin-loading");
        let cmd = [
            { CHIP_ID: cabinetID, COMMAND: "CALL BATCH LGS_ON_" + checkID + ";" },
        ];
        wss.send(JSON.stringify(cmd));
        relayTimeouts[id] = setTimeout(() => {
            if ($("#" + id).css("background-color") == "rgb(206, 172, 48)") {
                $("#" + id).css("background", "#000000");
                $("#" + id).css("box-shadow", "0px 0px 30px 5px #000000");
                $("#btn-" + id).prop("disabled", false);
            }
            resetIcon(icon);
        }, 5000);
    } else {
        $("#" + id).css("background", "#ceac30");
        $("#" + id).css("box-shadow", "0px 0px 30px 5px" + "#ceac30");
        $("#btn-" + id).prop("disabled", true);
        icon.innerHTML = `
            <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z"/>
            <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466"/>
        `;
        $("#icon-" + id).addClass("spin-loading");
        // let cmd = [{ CHIP_ID: '12929152', COMMAND: 'SEND CAN(17 0 0 0 41 '+ (checkID+6) +');' }];
        let cmd = [
            { CHIP_ID: cabinetID, COMMAND: "CALL BATCH LGS_OFF_" + checkID + ";" },
        ];
        wss.send(JSON.stringify(cmd));
        // ws.send('12929152:SEND CAN(17 0 0 0 41 '+ (checkID+6) +');')
        relayTimeouts[id] = setTimeout(() => {
            if ($("#" + id).css("background-color") == "rgb(206, 172, 48)") {
                $("#" + id).css("background", "#08ed0a");
                $("#" + id).css("box-shadow", "0px 0px 30px 5px" + "#08ed0a");
                $("#btn-" + id).prop("disabled", false);
            }
            resetIcon(icon);
        }, 5000);
    }
};

function resetIcon(icon, id) {
    icon.innerHTML = `
        <path d="M7.5 1v7h1V1z"></path>
        <path d="M3 8.812a4.999 4.999 0 0 1 2.578-4.375l-.485-.874A6 6 0 1 0 11 3.616l-.501.865A5 5 0 1 1 3 8.812"></path>
    `;
    $("#btn-" + id).prop("disabled", false);
    icon.classList.remove("spin-loading");
}

var updateDataLed = function (dataString, idPrefix) {
    // Xóa dòng trắng và tách thành từng dòng
    const lines = dataString.trim().split("\n");

    lines.forEach(function (line) {
        const dataObj = {};
        line.split(",").forEach(function (item) {
            const parts = item.split(":");
            if (parts.length === 2) {
                dataObj[parts[0]] = parts[1];
            }
        });

        // Bỏ qua nếu không có ID hoặc NO
        if (!dataObj["ID"] || !dataObj["NO"]) return;

        // Tính toán lại chỉ số thiết bị toàn cục (global)
        const localId = parseInt(dataObj["ID"]);
        const nodeOffset = (parseInt(dataObj["NO"]) - 31) * 3;
        const globalId = nodeOffset + localId;

        // Format các giá trị số
        const valueU = formatNumber(Number(dataObj["U"] || 0));
        const valueP = formatNumber(Number(dataObj["P"] || 0));
        const valueI = formatNumber(Number(dataObj["I"] || 0));
        const valueE = formatNumber(Number(dataObj["E"] || 0));

        // Cập nhật từng màn hình LED tương ứng
        const keys = [valueU, valueP, valueI, valueE];

        keys.forEach(function (value, index) {
            const fullId =
                index === 0
                    ? `#${idPrefix}${globalId}`
                    : `#${idPrefix}${globalId}-${index}`;
            $(fullId).sevenSegArray({ value: value });
        });
    });
};

function formatNumber(num) {
    const integerPartLength = Math.floor(num).toString().length;

    let decimalPlaces = 3; // Mặc định
    if (integerPartLength === 3) {
        decimalPlaces = 2;
    } else if (integerPartLength === 2) {
        decimalPlaces = 3;
    } else if (integerPartLength === 1) {
        decimalPlaces = 3;
    } else {
        decimalPlaces = 1;
    }

    return Number(num.toFixed(decimalPlaces));
}

function runLed7(data) {
    (function ($) {
        var numberSegments = [
            0x3f, 0x06, 0x5b, 0x4f, 0x66, 0x6d, 0x7d, 0x07, 0x7f, 0x6f,
        ]; //http://en.wikipedia.org/wiki/Seven-segment_display

        // Default CSS styles. If you don't specify your own CSS or discrete color options, this is what gets used.
        //
        $(
            "<style type='text/css'>" +
            ".sevenSeg-svg {fill: #320000; overflow: hidden; stroke-width: 0; height: 100%; width: 100%; background-color: Black}" +
            ".sevenSeg-segOn {fill: Red}" +
            "</style>"
        ).prependTo("head");

        $.widget("bw.sevenSeg", {
            options: {
                /**
                        This option controls the display value on the 7seg.  Set this to the numeric digit you
                        want displayed.
                        */
                value: null,

                /**
                        Override the default segment on color (Red).  
                        Note: You can alternatively define a CSS style for the class.sevenSeg-segOn that specifies a 'fill' color.
                        */
                colorOn: null,

                /**
                        Override the default segment off color (#320000).  
                        Note: You can alternatively define a CSS style for the class .sevenSeg-svg that specifies a 'fill' color.
                        */
                colorOff: null,

                /**
                        Override the default background color of the display (Black).  
                        Note: You can alternatively define a CSS style for the class .sevenSeg-svg that specifies a 'background-color' color.
                        */
                colorBackground: null,

                /**
                        This option allows skewing the segments to create a slant effect.
                        Note: Setting "transform: skew()" in CSS is problematic for SVG. Would be nice to have, but browser support just 
                        isn't there yet. So, setting the slant must be done through options.
                        */
                slant: 0,

                /**
                        This flag controls the appearance of the decimal point 'dot' in the display.
                        The default is to display it (true), but you can set to false to omit it.
                        */
                decimalPoint: true,
            },

            /**
                  Widget factory creation handler.
                  */
            _create: function () {
                this.jqSvgElement = $("<svg/>", {
                    class: this.widgetName + "-svg",
                    viewBox: "0 0 57 80",
                    version: "1.1",
                    xmlns: "http://www.w3.org/2000/svg",
                    "xmlns:xlink": "http://www.w3.org/1999/xlink",
                }).css({
                    fill: this.options.colorOff,
                    "background-color": this.options.colorBackground,
                });

                $("<defs/>")
                    .append(
                        $("<polyline/>", {
                            id: "h-seg",
                            points: "11 0, 37 0, 42 5, 37 10, 11 10, 6 5",
                        })
                    )
                    .append(
                        $("<polyline/>", {
                            id: "v-seg",
                            points: "0 11, 5 6, 10 11, 10 34, 5 39, 0 39",
                        })
                    )
                    .appendTo(this.jqSvgElement);

                this.jqSegments = $("<g/>", { class: this.widgetName + "-segGroup" })
                    .append($("<use/>", { "xlink:href": "#h-seg", x: "0", y: "0" })) //Segment A
                    .append(
                        $("<use/>", {
                            "xlink:href": "#v-seg",
                            x: "-48",
                            y: "0",
                            transform: "scale(-1,1)",
                        })
                    ) //Segment B
                    .append(
                        $("<use/>", {
                            "xlink:href": "#v-seg",
                            x: "-48",
                            y: "-80",
                            transform: "scale(-1,-1)",
                        })
                    ) //Segment C
                    .append($("<use/>", { "xlink:href": "#h-seg", x: "0", y: "70" })) //Segment D
                    .append(
                        $("<use/>", {
                            "xlink:href": "#v-seg",
                            x: "0",
                            y: "-80",
                            transform: "scale(1,-1)",
                        })
                    ) //Segment E
                    .append($("<use/>", { "xlink:href": "#v-seg", x: "0", y: "0" })) //Segment F
                    .append($("<use/>", { "xlink:href": "#h-seg", x: "0", y: "35" })) //Segment G
                    .appendTo(this.jqSvgElement);

                if (this.options.slant) {
                    this.jqSegments.attr(
                        "transform",
                        "skewX(" + -this.options.slant + ")"
                    );
                }

                if (this.options.decimalPoint) {
                    $("<circle/>", { cx: "52", cy: "75", r: "5" }).appendTo(
                        this.jqSvgElement
                    );
                }

                this.jqSvgElement.appendTo(this.element);
                this.element.append(this.jqSvgElement);

                // http://stackoverflow.com/a/13654655/390906
                //
                this.element.html(this.element.html());
                this.jqSvgElement = this.element.find("svg");
                this.jqSegments = this.jqSvgElement.find(
                    "." + this.widgetName + "-segGroup"
                );

                if (this.options.value) {
                    this.displayValue(this.options.value);
                }
            },

            _destroy: function () {
                this.jqSvgElement.remove();
            },

            _setOption: function (key, value) {
                this.options[key] = value;

                switch (key) {
                    case "value":
                        this.displayValue(value);
                        break;
                }
            },

            /**
                  This is the method to set the digit displayed.
                  @param value The numeric digit to display.  Call with null to blank out the display.
                  @param bDecimalPoint Set to true or false to drive the illumination state of the decimal point
                  (does not apply if decimal point display is disabled)
                  */
            displayValue: function (value, bDecimalPoint) {
                var self = this;
                if (value >= numberSegments.length) return;
                self.options.value = value;
                var segments = self._getSegments(value);
                self.jqSegments.children().each(function (index, element) {
                    self._setSvgElementFill($(element), segments & (1 << index));
                });

                self._setSvgElementFill(
                    self.jqSvgElement.find("circle"),
                    bDecimalPoint
                );
            },

            /**
                  Return the bitfield mask for the segments to illuminate for the argumen numeric digit value.    
                  */
            _getSegments: function (value) {
                if (value === "-") return 0x40;
                return numberSegments[value];
            },

            _setSvgElementFill: function (jqElement, bOn) {
                // jQuery addClass/removeClass doesn't work with svg <use> elements. So we have to do it the old way.
                //
                jqElement.attr("class", bOn && this.widgetName + "-segOn");

                // Set the fill style if options.colorOn is defined. This overrides CSS definitions.
                //
                jqElement.css("fill", (bOn && this.options.colorOn) || "");
            },
        });

        // Plugin Knockout binding handler for sevenSeg if KO is defined.
        //
        if (typeof ko !== "undefined" && ko.bindingHandlers) {
            ko.bindingHandlers.sevenSeg = {
                init: function (element, valueAccessor) {
                    $(element).sevenSeg(ko.toJS(valueAccessor()));
                },
                update: function (element, valueAccessor) {
                    $(element).sevenSeg("option", ko.toJS(valueAccessor()));
                },
            };
        }

        /**
            This widget creates a group comprised of any number of discrete sevenSegs.
            */
        $.widget("bw.sevenSegArray", {
            options: {
                /**
                        This option controls the display value on the 7seg array.  Set this to the numeric value you
                        want displayed.
                        */
                value: null,

                /**
                        Defines the number of digits that comprise the array.
                        */
                digits: 2,

                /**
                        If you want to also specify control options for the internally created sevenSeg widgets, this is where you do it
                        Simply pass an object with any sevenSeg options you want as property/value pairs.
                        For example { colorOn: "Lime", colorOff: "#003200" }
                        */
                segmentOptions: null,
            },

            /**
                  Widget factory creation handler.
                  */
            _create: function () {
                this.aJqDigits = [];
                var sDigitWidth = 100 / this.options.digits + "%";
                for (var iDigit = 0; iDigit < this.options.digits; ++iDigit) {
                    this.aJqDigits[iDigit] = $("<div/>", {
                        style: "display: inline-block; height: 100%;",
                    })
                        .css("width", sDigitWidth)
                        .sevenSeg(this.options.segmentOptions)
                        .appendTo(this.element);
                }
                this.aJqDigits.reverse();
                if (this.options.value) {
                    this.displayValue(this.options.value);
                }
            },

            _destroy: function () {
                $.each(this.aJqDigits, function (index, jqDigit) {
                    jqDigit.sevenSeg("destroy");
                    jqDigit.remove();
                });
            },

            _setOption: function (key, value) {
                this.options[key] = value;

                switch (key) {
                    case "value":
                        this.displayValue(value);
                        break;

                    // TODO BW : Add other options.
                }
            },

            /**
                  Set the value of the digits to display.  You simply call this with a number and the respective
                  digits will be set.  Whatever digits that fit will be displayed, any additional will just be omitted.
                  @param value The numeric value to display.  Call with null to blank out the display.
                  */
            displayValue: function (value) {
                var self = this;
                var sValue = value.toString();
                var iDecimalIdx = sValue.indexOf(".");
                var iDigitIdx = sValue.length - 1;
                $.each(self.aJqDigits, function (index, jqDigit) {
                    var bDecimal = iDecimalIdx >= 0 && iDigitIdx === iDecimalIdx;
                    if (bDecimal) {
                        --iDigitIdx;
                    }

                    var sDigitValue = sValue[iDigitIdx];
                    jqDigit.sevenSeg("displayValue", sDigitValue, bDecimal);

                    --iDigitIdx;
                });
            },
        });

        // Plugin Knockout binding handler for sevenSegArray if KO is defined.
        //
        if (ko && ko.bindingHandlers) {
            ko.bindingHandlers.sevenSegArray = {
                init: function (
                    element,
                    valueAccessor,
                    allBindingsAccessor,
                    viewModel,
                    bindingContext
                ) {
                    $(element).sevenSegArray(ko.toJS(valueAccessor()));
                },
                update: function (
                    element,
                    valueAccessor,
                    allBindingsAccessor,
                    viewModel,
                    bindingContext
                ) {
                    $(element).sevenSegArray("option", ko.toJS(valueAccessor()));
                },
            };
        }
    })(jQuery);

    const typeMatch = data.match(/(\d+)K-(\d+)TB/i);
    const numberOfMeters = typeMatch ? parseInt(typeMatch[2]) : 0;
    for (let i = 1; i <= numberOfMeters; i++) {
        initLedDisplay("testResizableArray" + i);
    }

    // initLedDisplay('testResizableArray2');
    // initLedDisplay('testResizableArray3');
    // initLedDisplay('testResizableArray4');
    // initLedDisplay('testResizableArray5');
    // initLedDisplay('testResizableArray6');
}

async function createElectricityMeter(data, name, cabinetID, control) {
    return new Promise((resolve) => {
        const typeMatch = data.match(/(\d+)K-(\d+)TB/i);
        const numberOfMeters = typeMatch ? parseInt(typeMatch[2]) : 0;
        // Container chứa các ElectricityMeter
        const container = document.getElementById("meter-container");
        container.innerHTML = ""; // Xóa các meter cũ nếu có
        let device = 31;
        // Tạo các ElectricityMeter tương ứng
        for (let i = 1; i <= numberOfMeters; i++) {
            let nameMeter = name + " " + i;
            if(control?.meterNames){
                nameMeter = control.meterNames[i-1];
            }
            const meterHTML = `
                <div class="w-100 p-2 mt-4" style="border: 1px solid;cursor: pointer;">
                    <div>
                        <p class="m-0">
                            <span class="editable-meter-label p-2" data-id="Meter_${i}" style="font-size: 20px; cursor: pointer;">${nameMeter}</span>
                        </p>
                    </div>
                    <div id="ElectricityMeter-${i}" class="d-flex">
                        <div class="w-50">
                            <div class="d-flex py-4">
                                <div id="testResizableDiv${i}" class="w-75">
                                    <div id="testResizableArray${i}" class="float-end"></div>
                                </div>
                                <span class="pt-2 px-2" style="font-size: 20px;color: #149aa4;"><strong>V</strong></span>
                            </div>
                            <div class="d-flex py-4">
                                <div id="testResizableDiv${i}-1" class="w-75">
                                    <div id="testResizableArray${i}-1" class="float-end"></div>
                                </div>
                                <span class="pt-2 px-2" style="font-size: 20px;color: #e97540;"><strong>W</strong></span>
                            </div>
                        </div>
                        <div class="w-50">
                            <div class="d-flex py-4">
                                <div id="testResizableDiv${i}-2">
                                    <div id="testResizableArray${i}-2"></div>
                                </div>
                                <span class="pt-2 px-2" style="font-size: 20px;color: #f2f442;"><strong>A</strong></span>
                            </div>
                            <div class="d-flex py-4">
                                <div id="testResizableDiv${i}-3">
                                    <div id="testResizableArray${i}-3"></div>
                                </div>
                                <span class="pt-2 px-2" style="font-size: 20px;color: #1a8f93;"><strong>Kwh</strong></span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            let device = 31 + Math.floor((i - 1) / 3);
            let a = ((i - 1) % 3) + 1;
            container.insertAdjacentHTML("beforeend", meterHTML);
            $(`#ElectricityMeter-${i}`)
                .off("click")
                .click(async function () {
                    $("#title-condition-popup").text(`Biểu đồ điện năng ${name} ${i}`);
                    HOMEOSAPP.loadPage("chartCondition-popup");

                    const now = new Date();
                    const formattedNow = formatCustomDate(now);
                    const oneHourAgo = new Date(now.getTime() - 3 * 60 * 60 * 1000);
                    const formattedOneHourAgo = formatCustomDate(oneHourAgo);

                    const data = await HOMEOSAPP.getDataChartCondition(
                        formattedOneHourAgo,
                        formattedNow,
                        a,
                        cabinetID,
                        device
                    );

                    createChartDataCondition(data);
                });
        }
        document.querySelectorAll('.editable-meter-label').forEach((span, index) => {
            attachEditHandler(span, control);
        }); // control có thể là object bạn quản lý tên meter

        // Hoàn thành render
        resolve();
    });
}

function initLedDisplay(baseId) {
    const ledConfigs = [
        {
            suffix: "", // Ví dụ: testResizableArray3
            digits: 5,
            colorOff: "#041d1e",
            colorOn: "#0fb4c0",
        },
        {
            suffix: "-1", // testResizableArray3-1
            digits: 5,
            colorOff: "#180c07",
            colorOn: "#e97540",
        },
        {
            suffix: "-2", // testResizableArray3-2
            digits: 5,
            colorOff: "#1a1a07",
            colorOn: "#f2f442",
        },
        {
            suffix: "-3", // testResizableArray3-3
            digits: 5,
            colorOff: "#041d1e",
            colorOn: "#0fb4c0",
        },
    ];

    ledConfigs.forEach(function (config) {
        const ledSelector = `#${baseId}${config.suffix}`;
        const divSelector = `#${baseId.replace("Array", "Div")}${config.suffix}`;

        $(ledSelector).sevenSegArray({
            digits: config.digits,
            segmentOptions: {
                colorOff: config.colorOff,
                colorOn: config.colorOn,
            },
        });

        $(divSelector).resizable({ aspectRatio: true });
    });
}

var onClose = function () {
    console.log("CLOSED: websocket");
    if (ws != null) {
        ws.close(1000, "Đóng kết nối bình thường");
        wss.close(1000, "Đóng kết nối bình thường");
    }
    ws = null;
    wss = null;
};

$(".WarrantyScanNext")
    .off("click")
    .click(function () {
        HOMEOSAPP.handleControlApp();
    });
createChartDataCondition = function (data) {
    // Destroy charts if exist
    [ChartU, ChartI, ChartP, ChartE].forEach((chart) => {
        if (chart) chart.destroy();
    });

    // Prepare labels and datasets
    let labels = data.map((item) =>
        new Date(item.DATE_CREATE).toLocaleTimeString()
    );
    let dataU = data.map((item) => parseFloat(item.U).toFixed(2));
    let dataI = data.map((item) => parseFloat(item.I).toFixed(2));
    let dataP = data.map((item) => parseFloat(item.P).toFixed(2));
    let dataE = data.map((item) => parseFloat(item.E).toFixed(3));

    // Helper to create dataset
    const createDataSet = (label, data, color) => ({
        type: "line",
        label,
        data,
        backgroundColor: color,
        borderColor: color,
        borderWidth: 1,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 5,
    });

    // Helper to create chart
    const createChartForCtx = (ctx, labelY, unit, dataSet) => {
        return new Chart(
            ctx,
            HOMEOSAPP.createChart(
                "line",
                labels,
                [],
                unit,
                "",
                [dataSet],
                "Thời gian"
            )
        );
    };

    // Create charts
    ChartU = createChartForCtx(
        ctx_U,
        "U-Điện áp (V)",
        "V",
        createDataSet("U-Điện áp (V)", dataU, "rgba(75,192,192)")
    );
    ChartI = createChartForCtx(
        ctx_I,
        "I-Dòng điện (A)",
        "A",
        createDataSet("I-Dòng điện (A)", dataI, "rgba(255,99,132)")
    );
    ChartP = createChartForCtx(
        ctx_P,
        "P-Công suất (W)",
        "W",
        createDataSet("P-Công suất (W)", dataP, "rgba(54,162,235)")
    );
    ChartE = createChartForCtx(
        ctx_E,
        "E-Điện năng tiêu thụ (kWh)",
        "kWh",
        createDataSet("E-Điện năng tiêu thụ (kWh)", dataE, "rgba(255,206,86)")
    );

    // Hide spinner (nếu cần)
    // document.getElementById("loading-spinner").classList.add("d-none");
};

$("#submitCalendar")
    .off("click")
    .on("click", () => {
        let scheduleName = $("#txtScheduleName").val();
        let startTime = $("#startTime").val();
        let relayList = Array.from(
            document.querySelectorAll("#sltDeviceForSchedule input")
        ).filter((item) => item.checked);
        let state = $("#radioOn").prop("checked");
        let command = "";

        // validate
        let regex = /^[A-Za-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/;
        if (!regex.test(scheduleName)) {
            toastr.error("Tên kịch bản không hợp lệ!");
            return;
        }
        if (startTime.length == 0) {
            toastr.error("Chưa chọn thời điểm!");
            return;
        }
        if (relayList.length == 0) {
            toastr.error("Không có relay nào được áp dụng!");
            return;
        }

        if (
            relayList.length ==
            document.querySelectorAll("#sltDeviceForSchedule input").length
        ) {
            command += `CALL BATCH ${state ? "LGS_ON_ALL" : "LGS_OFF_ALL"
                }, DELAY 200,`;
        } else {
            relayList.forEach((relay) => {
                let batchName = `${state ? "LGS_ON_" : "LGS_OFF_"}${relay.getAttribute(
                    "data-relayId"
                )}`;
                command += `CALL BATCH ${batchName}, DELAY 200,`;
            });
        }
        command = GenerateCreateScheduleString(scheduleName, startTime, command);
        // gửi lệnh xuống thiết bị
        let cmd = [{ CHIP_ID: cabinetID, COMMAND: command }];
        wss.send(JSON.stringify(cmd));
        toastr.success("Lập lịch thành công!");
    });

var GenerateCreateScheduleString = function (batchName, startTime, cmd) {
    let res =
        "CREATE(SL,<BATCH_NAME>,<START_TIME>, <END_TIME>,1,<COMMAND_STRING>);\r\n";
    res = res.replace(/<BATCH_NAME>/g, batchName);
    res = res.replace(/<START_TIME>/g, startTime + ":00");
    res = res.replace(/<END_TIME>/g, startTime + ":05");
    res = res.replace(/<COMMAND_STRING>/g, cmd);
    return res;
};

$("#BackCondition")
    .off("click")
    .click(function () {
        HOMEOSAPP.goBack();
    });

$("#tab-schedule")
    .off("click")
    .click(function (event) {
        HOMEOSAPP.openTabSchedule(event, "tabSchedule");
        $("#tabIndicator-schedule").css("left", "0%");
    });
$("#tab-list-schedule")
    .off("click")
    .click(function (event) {
        HOMEOSAPP.openTabSchedule(event, "tabListSchedule");
        $("#tabIndicator-schedule").css("left", "50%");
    });

function getDataSchedule() { }

function makeEditable(span, control) {
    const currentText = span.textContent.trim();
    const dataId = span.dataset.id; // ví dụ: Relay_1 hoặc Meter_2
    const parent = span.parentElement;

    // Tạo ô input
    const input = document.createElement("input");
    input.type = "text";
    input.value = currentText;
    input.style.cssText = `
        width: 120px;
        height: 30px;
        background-color: #000;
        color: #fff;
        border: 1px solid #fff;
        border-radius: 8px;
        padding: 4px 8px;
        display: inline-block;
    `;

    // Thay thế span bằng input
    parent.innerHTML = '';
    parent.appendChild(input);
    input.focus();

    // Hàm lưu lại nội dung và cập nhật control
    function save() {
        const newValue = input.value.trim() || currentText;

        // Xác định loại: Relay hay Meter
        const match = dataId.match(/^Relay_(\d+)$|^Meter_(\d+)$/);
        const relayIndex = match && match[1] ? parseInt(match[1], 10) - 1 : null;
        const meterIndex = match && match[2] ? parseInt(match[2], 10) - 1 : null;

        if (relayIndex !== null) {
            if (!Array.isArray(control.relayNames)) control.relayNames = [];
            control.relayNames[relayIndex] = newValue;
        } else if (meterIndex !== null) {
            if (!Array.isArray(control.meterNames)) control.meterNames = [];
            control.meterNames[meterIndex] = newValue;
        }

        // Cập nhật localStorage nếu đang lưu dataCondition
        const allControls = JSON.parse(localStorage.getItem("dataCondition") || "[]");
        const indexInLocal = allControls.findIndex(c => c.CodeCondition === control.CodeCondition);
        if (indexInLocal !== -1) {
            allControls[indexInLocal] = control;
            localStorage.setItem("dataCondition", JSON.stringify(allControls));
        }
        let newSpan = document.createElement("span");
        if (relayIndex !== null) {
            newSpan.className = "editable-label p-2";
            newSpan.dataset.id = dataId;
            newSpan.style.cssText = "height: 25px; cursor: pointer;";
            newSpan.textContent = newValue;
        } else if (meterIndex !== null) {
            newSpan.className = "editable-meter-label p-2";
            newSpan.dataset.id = dataId;
            newSpan.style.cssText = "font-size: 20px; cursor: pointer;";
            newSpan.textContent = newValue;
        }
        // Tạo lại span mới
        
        

        // Gắn lại sự kiện chỉnh sửa
        parent.innerHTML = '';
        parent.appendChild(newSpan);
        attachEditHandler(newSpan, control);
    }

    input.addEventListener("blur", save);
    input.addEventListener("keydown", e => {
        if (e.key === "Enter") input.blur();
    });
}


function attachEditHandler(span, control) {
    span.addEventListener("click", function () {
        makeEditable(this, control);
    });
}

// Gắn handler cho tất cả editable span

accessDevice();
