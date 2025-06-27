var historyListDetail = $('#history-detail');
var historyListCategoryDetail = $('#list-history-detail');
var historyListCategoryAdd = $('#list-history-add');
var checkTabHistory;
var intervalId;
var checkMap = true;
var store = {};
async function pickApp(type) {
    showAddWorkStationButton();
    HOMEOSAPP.handleUser("scan");
    switch (type) {
        case 'KTTV':
            HOMEOSAPP.application = "KTTV";
            checkTabHistory = 1;
            showHistory();
            break;

        case 'HISTORY':
            showHistory();
            break;

        case 'WARRANTY':
            HOMEOSAPP.application = "WARRANTY";
            checkTabHistory = 2;
            addItemWarranty('warranty');
            break;

        case 'CONTROL':
            HOMEOSAPP.application = "CONTROL";
            checkTabHistory = 2;
            addItemWarranty('condition');
            // runLed7();
            break;
    }
    HOMEOSAPP.addMenuElement();
}

function showAddWorkStationButton() {
    const buttonHTML = $(
        '<div style="margin-top: 10px; display: flex; justify-content: center; align-items: center;">' +
        '<button id="addWorkStation" style="width: 200px; height: 200px; border-radius: 50%; border: 1px dashed #fff; background-color: #1E2833; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #fff; font-size: 14px; text-align: center;">' +
        '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" style="color: #fff; margin-bottom: 8px;" fill="currentColor" class="bi bi-plus" viewBox="0 0 16 16">' +
        '<path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>' +
        '</svg>' +
        'Thêm mới' +
        '</button>' +
        '</div>'
    );
    buttonHTML.on('click', function () {
        if (HOMEOSAPP.checkTabHistory == 1) {
            HOMEOSAPP.stopInterval();
            HOMEOSAPP.loadPage("https://central.homeos.vn/singlepage/workstation/src/pages/ScanQR/scanQR.html");
        } else if (HOMEOSAPP.checkTabHistory == 2) {
            HOMEOSAPP.loadPage("https://central.homeos.vn/singlepage/workstation/src/pages/ScanQR/scanQR.html");
        } else if (HOMEOSAPP.checkTabHistory == 3) {
            HOMEOSAPP.checkTabMenu = "DetailDevice";
            HOMEOSAPP.loadPage("https://central.homeos.vn/singlepage/workstation/src/pages/ScanQR/scanQR.html");
        }
    });
    historyListDetail.append(buttonHTML); // Giả sử bạn có một div với id "addWorkStationContainer" để chứa nút này
}

// App history 

var ZONE_PROPERTY = 'RD';
var ZONE_UNIT = ' mm';
var ZONE_PROPERTY_NNS = 'RT';
var ZONE_UNIT_NNS = ' °C';
var ZONE_PROPERTY_TD = 'RN';
var ZONE_UNIT_TD = ' cm';
var ZONE_PROPERTY_SL = 'RD';
var ZONE_UNIT_SL = ' mm';

function getColorByTimeDiff(dateStr) {
    const now = new Date();
    const providedTime = new Date(dateStr);
    const minutesDiff = (now - providedTime) / (1000 * 60);
    return minutesDiff < 15 ? "#28a745" : "#da4a58";
}

function OpenAddCategory() {
    $(".history-avt").addClass("d-none");
    document.getElementById("category-back").classList.remove("d-none");
    localStorage.setItem('listItemCategory', JSON.stringify([]));
    historyListCategoryAdd.empty()
    showHistoryCategory();
    document.getElementById("list-category").classList.add("d-none");
    document.getElementById("save-category").classList.remove("d-none");
}

function addItemHistory(item, type) {
    // Tạo phần tử nội dung chính
    if (type) {
        const element = $(
            '<div class="iconApp">' +
            '<div id="App' + item.CodeWorkStation + '" class="icon" style="background-color: #28a745 !important;">' +
            getIconWorkstation(item.workstationType) +
            '</div>' +
            '<div class="info-box-content" style="padding-right: 0">' +
            '<div class="d-flex justify-content-between">' +
            '<span class="app-text">' + item.CodeWorkStation + '</span>' +
            '<span class="app-text" style="padding-right: 0">' + item.date + '</span>' +
            '</div>' +
            '<span class="app-text-number" style="padding-right: 0">' + item.NameWorkStation + '</span>' +
            '</div>' +
            '</div>'
        );
        // Tạo phần tử bao bọc với nút X
        const totalElement = $(
            '<div style="padding-bottom: 13px; position: relative;" class="history-item" data-code="' + item.CodeWorkStation + '">' +
            '</div>'
        );

        // Thêm phần tử chính vào phần tử bao bọc
        totalElement.append(element);
        // Gắn sự kiện click cho phần tử chính
        element.on('click', function () {
            handleItemCategoryClick(item);
        });
        if (type == 'category') {
            historyListCategoryDetail.append(totalElement);
        } else {
            historyListCategoryAdd.append(totalElement);
        }
    } else {
        const element = $(
            '<div class="iconApp">' +
            '<div id="App' + item.CodeWorkStation + '" class="icon" style="background-color: #28a745 !important; display: block">' +
            '<div id="Value' + item.CodeWorkStation + '" style="background-color: #1052e7; width: 70px; height: 20px;font-size: 12px;color: #fff; border-radius: 4px 4px 0 0;">-</div>' +
            getIconWorkstation(item.workstationType) +
            '</div>' +
            '<div class="info-box-content" style="padding-right: 0">' +
            '<div class="d-flex justify-content-between">' +
            '<span class="app-text">' + item.CodeWorkStation + '</span>' +
            '<span class="app-text" style="padding-right: 0">' + item.date + '</span>' +
            '</div>' +
            '<span class="app-text-number" style="padding-right: 0">' + item.NameWorkStation + '</span>' +
            '</div>' +
            '</div>'
        );
        // Tạo phần tử bao bọc với nút X
        const totalElement = $(
            '<div style="padding-bottom: 13px; position: relative;" class="history-item" data-code="' + item.CodeWorkStation + '">' +
            '<div class="close-icon">' +
            '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16">' +
            '<path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>' +
            '</svg>' +
            '</div>' +
            '</div>'
        );

        // Thêm phần tử chính vào phần tử bao bọc
        totalElement.append(element);

        // Gắn sự kiện click cho nút X
        totalElement.find('.close-icon').on('click', function (e) {
            e.stopPropagation(); // Ngăn chặn sự kiện click lan đến phần tử chính

            // Hiển thị popup xác nhận
            const confirmDelete = confirm(`Bạn có chắc chắn muốn xóa trạm "${item.NameWorkStation} [${item.CodeWorkStation}]" không?`);
            if (confirmDelete) {
                totalElement.remove(); // Xóa phần tử nếu người dùng chọn "Có"
                historyItems = historyItems.filter(i => i.CodeWorkStation !== item.CodeWorkStation);
                localStorage.setItem('dataHistory', JSON.stringify(historyItems));
                toastr.success(`Trạm "${item.CodeWorkStation}" đã bị xóa!`);
                if (historyItems.length == 0) {
                    showAddWorkStationButton(); // Ẩn nút nếu có ít nhất 1 phần tử
                }
            }
        });

        // Gắn sự kiện click cho phần tử chính
        element.on('click', function () {
            handleItemClick(item);
        });

        // Thêm phần tử vào danh sách lịch sử

        historyListDetail.append(totalElement);
    }

}

function handleItemClick(item) {
    HOMEOSAPP.itemHistory = item;
    HOMEOSAPP.stopInterval();
    localStorage.setItem("URL", "https://" + item.domain + "/Service/Service.svc");
    localStorage.setItem("MATRAM", item.CodeWorkStation);
    const itemHistory = { 'CodeWorkStation': item.CodeWorkStation, 'NameWorkStation': item.NameWorkStation, 'domain': item.domain, 'date': HOMEOSAPP.getCurrentTime(), 'workstationType': item.workstationType }
    localStorage.setItem('itemHistory', JSON.stringify(itemHistory));
    $("#loading-popup").show();
    HOMEOSAPP.loadPage("https://central.homeos.vn/singlepage/workstation/src/pages/KTTV/kttv.html");
}

HOMEOSAPP.stopInterval = function() {
    // Xóa interval nếu đang chạy
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
    }
}

async function startInterval() {
    if (intervalId) return;

    for (let i = historyItems.length - 1; i >= 0; i--) {
        const station = historyItems[i];
        const data = await HOMEOSAPP.getNewData(
            station.CodeWorkStation,
            `WORKSTATION_ID='${station.CodeWorkStation}'`,
            `https://${station.domain}/Service/Service.svc`
        );
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0]; // Ví dụ: "2025-06-04"
        data.D = data.D.filter(item => {
            if (item.ZONE_PROPERTY === 'RD') {
                const itemDateStr = item.DATE_CREATE.split('T')[0];
                return itemDateStr === todayStr; // Giữ lại nếu là hôm nay
            }
            return true; // Giữ lại tất cả item khác RD
        });
        if (data.D && data.D.length > 0) {
            const lastItem = data.D[data.D.length - 1];
            historyItems[i].key = lastItem.PR_KEY;
        }
        processAndUpdate(data);
        await updateWorkstationUI(station, data);
    }

    intervalId = setInterval(async () => {
        rotateProperties();

        for (let i = historyItems.length - 1; i >= 0; i--) {
            const station = historyItems[i];
            const data = await HOMEOSAPP.getNewData(
                station.CodeWorkStation,
                `WORKSTATION_ID='${station.CodeWorkStation}'`,
                `https://${station.domain}/Service/Service.svc`,
                station.key
            );
            if (data.D && data.D.length > 0) {
                const lastItem = data.D[data.D.length - 1];
                historyItems[i].key = lastItem.PR_KEY;
            }
            if(data.D && data.D.length > 0){
                processAndUpdate(data);
                await updateWorkstationUI(station, data);
            }
        }
    }, 10000);
    $("#history-value").removeClass("d-none");
    $("#history-loading").addClass("d-none");
}

function rotateProperties() {
    const props = [
        { prop: 'RD', unit: ' mm' },
        { prop: 'RT', unit: ' °C' },
        { prop: 'RH', unit: ' %' },
        { prop: 'RP', unit: ' hPa' }
    ];
    const index = props.findIndex(p => p.prop === ZONE_PROPERTY);
    const next = props[(index + 1) % props.length];
    ZONE_PROPERTY = next.prop;
    ZONE_UNIT = next.unit;

    const nnsProps = [
        { prop: 'RT', unit: ' °C' },
        { prop: 'RN', unit: ' cm' },
        { prop: 'SS', unit: ' ppt' },
        { prop: 'EC', unit: ' μs/cm' }
    ];
    const nnsIndex = nnsProps.findIndex(p => p.prop === ZONE_PROPERTY_NNS);
    const nextNNS = nnsProps[(nnsIndex + 1) % nnsProps.length];
    ZONE_PROPERTY_NNS = nextNNS.prop;
    ZONE_UNIT_NNS = nextNNS.unit;

    const TDProps = [
        { prop: 'RN', unit: ' m' },
        { prop: 'TN', unit: ' tr.m³' },
        { prop: 'QV', unit: ' m³/s' },
        { prop: 'QR', unit: ' m³/s' }
    ];

    const TDIndex = TDProps.findIndex(p => p.prop === ZONE_PROPERTY_TD);
    const nextTD = TDProps[(TDIndex + 1) % TDProps.length];
    ZONE_PROPERTY_TD = nextTD.prop;
    ZONE_UNIT_TD = nextTD.unit;

    const SLProps = [
        { prop: 'RD', unit: ' mm' },
        { prop: 'RN', unit: ' m' },
        { prop: 'QN', unit: ' m³/s' },
        { prop: 'VN', unit: ' m/s' }
    ];

    const SLIndex = SLProps.findIndex(p => p.prop === ZONE_PROPERTY_SL);
    const nextSL = SLProps[(SLIndex + 1) % SLProps.length];
    ZONE_PROPERTY_SL = nextSL.prop;
    ZONE_UNIT_SL = nextSL.unit;
}

async function updateWorkstationUI(station, data) {
    const filteredItems = data.D.filter(item => item.ZONE_ADDRESS === station.CodeWorkStation);
    const elementValue = document.getElementById('Value' + station.CodeWorkStation);
    const button = document.getElementById('App' + station.CodeWorkStation);

    if (filteredItems.length === 0) {
        if (button) button.style.backgroundColor = "#da4a58";
        return;
    }
    
    let prop = 'RD';
    if (station.workstationType === "NAAM") prop = ZONE_PROPERTY;
    else if (station.workstationType === "N") prop = 'RN';
    else if (["M", "MS", "MSL"].includes(station.workstationType)) prop = 'RD';
    else if (station.workstationType === "NNS") prop = ZONE_PROPERTY_NNS;
    else if (station.workstationType === "TD") prop = ZONE_PROPERTY_TD;
    else if (station.workstationType === "NMLLTD") prop = ZONE_PROPERTY_SL;

    const dataRD = filteredItems.find(item => item.ZONE_PROPERTY === prop);
    elementValue.textContent = dataRD ? getDisplayValue(dataRD, station.workstationType) : '_';
    if(station.workstationType === "NNS"){
        dataRD
    }
    if(prop == 'RD' && !dataRD){
        elementValue.textContent = "0mm";
    }
    try {
        const dataRA = filteredItems.find(item => item.ZONE_PROPERTY === 'RA');
        if (dataRA) {
            const color = getColorByTimeDiff(dataRA.DATE_CREATE);
            if (button) button.style.backgroundColor = color;
        } else {
            if (button) button.style.backgroundColor = "#da4a58";
        }
    } catch (e) {
        if (button) button.style.backgroundColor = "#da4a58";
    }
}

async function showHistory(type) {
    const historySetting = document.getElementById("history-setting");
    const historyHomePage = document.getElementById("history-homePage");
    const historySelect = document.getElementById("historySelect");

    if (type === "ADD") {
        historySetting.classList.remove("d-none");
        historyHomePage.classList.add("d-none");
        OpenAddCategory();
        return;
    }

    historyItems = JSON.parse(localStorage.getItem('dataHistory')) || [];
    DataCategory = JSON.parse(localStorage.getItem('dataCategory')) || [];

    for (const item of historyItems) {
        if (item.domain === "sonla.homeos.vn") {
            item.domain = "sonlahpc.hymetco.com";
        }
    }
    
    // Cập nhật lại localStorage với dữ liệu đã sửa
    localStorage.setItem('dataHistory', JSON.stringify(historyItems));
    historyItems = JSON.parse(localStorage.getItem('dataHistory')) || [];
    const arrayCategory = ["ADD"];

    // Tạo danh sách tên danh mục không trùng
    DataCategory.forEach(cat => {
        if (!arrayCategory.includes(cat.NameCategory)) {
            arrayCategory.push(cat.NameCategory);
        }
    });

    if (type) {
        const categoryMatched = DataCategory.find(cat => cat.NameCategory === type);

        if (type !== "ALL" && !categoryMatched) {
            historyItems = historyItems.filter(item => item.workstationType === type);
        } else if (categoryMatched && categoryMatched.itemCategory?.length) {
            historyItems = categoryMatched.itemCategory
                .map(catItem => historyItems.find(h => h.CodeWorkStation === catItem.CodeWorkStation))
                .filter(Boolean);
        }
    }

    if (!historyItems || historyItems.length === 0) {
        $("#history-value").removeClass("d-none");
        $("#history-loading").addClass("d-none");
        return;
    };

    // Làm sạch và hiển thị danh sách
    historyListDetail.empty();
    locations = [];
    for (const item of historyItems) {
        addItemHistory(item);
        const dataWorkstation = await HOMEOSAPP.getDM(
            "https://" + item.domain + "/service/service.svc",
            "DM_WORKSTATION",
            "WORKSTATION_ID = '" + item.CodeWorkStation + "'",
            "NotCentral"
        );
        if(dataWorkstation.StateId == "NOT_EXIST_SESSION"){
            showHistory();
        }
        addDataLocation(dataWorkstation.data[0], dataWorkstation.dataSet.DM_TOOLTIP_TEMPLATE, item);
        if (!arrayCategory.includes(item.workstationType)) {
            arrayCategory.push(item.workstationType);
        }

        await delay(10); // đợi 100ms trước khi xử lý item tiếp theo
    }
    addMarkers(locations, "mappingWorkstation");
    arrayCategory.push("ALL");

    // Chỉ tạo select nếu chưa có type (tức là lần đầu vào)
    if (!type) {
        historySelect.innerHTML = "";
        arrayCategory.slice().reverse().forEach(cat => {
            const option = document.createElement("option");

            switch (cat) {
                case "NAAM":
                    option.value = cat;
                    option.text = "Trạm Mưa, nhiệt, ẩm, áp";
                    break;
                case "N":
                    option.value = cat;
                    option.text = "Trạm mực nước";
                    break;
                case "M":
                    option.value = cat;
                    option.text = "Trạm Mưa";
                    break;
                case "MSL":
                    option.value = cat;
                    option.text = "Trạm Mưa Sơn La";
                    break;
                case "MS":
                    option.value = cat;
                    option.text = "Trạm Mưa, sóng";
                    break;
                case "NNS":
                    option.value = cat;
                    option.text = "Trạm mặn, nhiệt, mực nước";
                    break;
                case "TD":
                    option.value = cat;
                    option.text = "Hồ chứa";
                    break;
                case "NMLLTD":
                    option.value = cat;
                    option.text = "Trạm Nước, mưa, lưu lượng, tốc độ";
                    break;
                case "ALL":
                    option.value = cat;
                    option.text = "Tất cả trạm";
                    break;
                case "ADD":
                    option.value = cat;
                    option.text = " + Thêm danh mục mới";
                    option.className = "custom-option";
                    break;
                default:
                    option.value = cat;
                    option.text = cat;
                    break;
            }

            historySelect.appendChild(option);
        });
    }

    startInterval();
}


    
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getIconWorkstation(type) {
    switch (type) {
        case "NAAM":
            return '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" style="color: #fff;" fill="currentColor" viewBox="0 0 640 512"><path d="M294.2 1.2c5.1 2.1 8.7 6.7 9.6 12.1l10.4 62.4c-23.3 10.8-42.9 28.4-56 50.3c-14.6-9-31.8-14.1-50.2-14.1c-53 0-96 43-96 96c0 35.5 19.3 66.6 48 83.2c.8 31.8 13.2 60.7 33.1 82.7l-56 39.2c-4.5 3.2-10.3 3.8-15.4 1.6s-8.7-6.7-9.6-12.1L98.1 317.9 13.4 303.8c-5.4-.9-10-4.5-12.1-9.6s-1.5-10.9 1.6-15.4L52.5 208 2.9 137.2c-3.2-4.5-3.8-10.3-1.6-15.4s6.7-8.7 12.1-9.6L98.1 98.1l14.1-84.7c.9-5.4 4.5-10 9.6-12.1s10.9-1.5 15.4 1.6L208 52.5 278.8 2.9c4.5-3.2 10.3-3.8 15.4-1.6zM208 144c13.8 0 26.7 4.4 37.1 11.9c-1.2 4.1-2.2 8.3-3 12.6c-37.9 14.6-67.2 46.6-77.8 86.4C151.8 243.1 144 226.5 144 208c0-35.3 28.7-64 64-64zm69.4 276c11 7.4 14 22.3 6.7 33.3l-32 48c-7.4 11-22.3 14-33.3 6.7s-14-22.3-6.7-33.3l32-48c7.4-11 22.3-14 33.3-6.7zm96 0c11 7.4 14 22.3 6.7 33.3l-32 48c-7.4 11-22.3 14-33.3 6.7s-14-22.3-6.7-33.3l32-48c7.4-11 22.3-14 33.3-6.7zm96 0c11 7.4 14 22.3 6.7 33.3l-32 48c-7.4 11-22.3 14-33.3 6.7s-14-22.3-6.7-33.3l32-48c7.4-11 22.3-14 33.3-6.7zm96 0c11 7.4 14 22.3 6.7 33.3l-32 48c-7.4 11-22.3 14-33.3 6.7s-14-22.3-6.7-33.3l32-48c7.4-11 22.3-14 33.3-6.7zm74.5-116.1c0 44.2-35.8 80-80 80l-271.9 0c-53 0-96-43-96-96c0-47.6 34.6-87 80-94.6l0-1.3c0-53 43-96 96-96c34.9 0 65.4 18.6 82.2 46.4c13-9.1 28.8-14.4 45.8-14.4c44.2 0 80 35.8 80 80c0 5.9-.6 11.7-1.9 17.2c37.4 6.7 65.8 39.4 65.8 78.7z"/></svg>';
        case "N":
            return '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" style="color: #fff;" fill="currentColor" class="bi bi-moisture" viewBox="0 0 16 16"><path d="M13.5 0a.5.5 0 0 0 0 1H15v2.75h-.5a.5.5 0 0 0 0 1h.5V7.5h-1.5a.5.5 0 0 0 0 1H15v2.75h-.5a.5.5 0 0 0 0 1h.5V15h-1.5a.5.5 0 0 0 0 1h2a.5.5 0 0 0 .5-.5V.5a.5.5 0 0 0-.5-.5zM7 1.5l.364-.343a.5.5 0 0 0-.728 0l-.002.002-.006.007-.022.023-.08.088a29 29 0 0 0-1.274 1.517c-.769.983-1.714 2.325-2.385 3.727C2.368 7.564 2 8.682 2 9.733 2 12.614 4.212 15 7 15s5-2.386 5-5.267c0-1.05-.368-2.169-.867-3.212-.671-1.402-1.616-2.744-2.385-3.727a29 29 0 0 0-1.354-1.605l-.022-.023-.006-.007-.002-.001zm0 0-.364-.343zm-.016.766L7 2.247l.016.019c.24.274.572.667.944 1.144.611.781 1.32 1.776 1.901 2.827H4.14c.58-1.051 1.29-2.046 1.9-2.827.373-.477.706-.87.945-1.144zM3 9.733c0-.755.244-1.612.638-2.496h6.724c.395.884.638 1.741.638 2.496C11 12.117 9.182 14 7 14s-4-1.883-4-4.267"/></svg>';
        case "M":
            return '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" style="color: #fff;" fill="currentColor" class="bi bi-cloud-lightning-rain" viewBox="0 0 16 16"><path d="M2.658 11.026a.5.5 0 0 1 .316.632l-.5 1.5a.5.5 0 1 1-.948-.316l.5-1.5a.5.5 0 0 1 .632-.316m9.5 0a.5.5 0 0 1 .316.632l-.5 1.5a.5.5 0 1 1-.948-.316l.5-1.5a.5.5 0 0 1 .632-.316m-7.5 1.5a.5.5 0 0 1 .316.632l-.5 1.5a.5.5 0 1 1-.948-.316l.5-1.5a.5.5 0 0 1 .632-.316m9.5 0a.5.5 0 0 1 .316.632l-.5 1.5a.5.5 0 1 1-.948-.316l.5-1.5a.5.5 0 0 1 .632-.316m-.753-8.499a5.001 5.001 0 0 0-9.499-1.004A3.5 3.5 0 1 0 3.5 10H13a3 3 0 0 0 .405-5.973M8.5 1a4 4 0 0 1 3.976 3.555.5.5 0 0 0 .5.445H13a2 2 0 0 1 0 4H3.5a2.5 2.5 0 1 1 .605-4.926.5.5 0 0 0 .596-.329A4 4 0 0 1 8.5 1M7.053 11.276A.5.5 0 0 1 7.5 11h1a.5.5 0 0 1 .474.658l-.28.842H9.5a.5.5 0 0 1 .39.812l-2 2.5a.5.5 0 0 1-.875-.433L7.36 14H6.5a.5.5 0 0 1-.447-.724z"/></svg>';
        case "NNS":
            return '<svg xmlns="http://www.w3.org/2000/svg" width="38" height="48" style="color: #fff;" fill="currentColor" class="bi bi-droplet-half" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M7.21.8C7.69.295 8 0 8 0q.164.544.371 1.038c.812 1.946 2.073 3.35 3.197 4.6C12.878 7.096 14 8.345 14 10a6 6 0 0 1-12 0C2 6.668 5.58 2.517 7.21.8m.413 1.021A31 31 0 0 0 5.794 3.99c-.726.95-1.436 2.008-1.96 3.07C3.304 8.133 3 9.138 3 10c0 0 2.5 1.5 5 .5s5-.5 5-.5c0-1.201-.796-2.157-2.181-3.7l-.03-.032C9.75 5.11 8.5 3.72 7.623 1.82z"/><path fill-rule="evenodd" d="M4.553 7.776c.82-1.641 1.717-2.753 2.093-3.13l.708.708c-.29.29-1.128 1.311-1.907 2.87z"/></svg>';
        default:
            return '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" style="color: #fff;" fill="currentColor" class="bi bi-cloud" viewBox="0 0 16 16"><path d="M4.406 3.342A5.53 5.53 0 0 1 8 2c2.69 0 4.923 2 5.166 4.579C14.758 6.804 16 8.137 16 9.773 16 11.569 14.502 13 12.687 13H3.781C1.708 13 0 11.366 0 9.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383m.653.757c-.757.653-1.153 1.44-1.153 2.056v.448l-.445.049C2.064 6.805 1 7.952 1 9.318 1 10.785 2.23 12 3.781 12h8.906C13.98 12 15 10.988 15 9.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 4.825 10.328 3 8 3a4.53 4.53 0 0 0-2.941 1.1z"/></svg>';
    }
}

function getDisplayValue(item, type) {
    switch (type) {
        case "NAAM":
            return item.ZONE_VALUE / 10 + ZONE_UNIT;
        case "N":
            return item.ZONE_VALUE + " cm";
        case "M":
        case "MS":
        case "MSL":
            return item.ZONE_VALUE / 10 + " mm";
        case "NNS":
            if (ZONE_PROPERTY_NNS === "SS") {
                return (item.ZONE_VALUE / 10000).toFixed(2) + ZONE_UNIT_NNS;
            } else if (ZONE_PROPERTY_NNS === "EC") {
                return (item.ZONE_VALUE / 1000).toFixed(2) + ZONE_UNIT_NNS;
            } else if(ZONE_PROPERTY_NNS === "RN") {
                return item.ZONE_VALUE + ZONE_UNIT_NNS;
            } else {
                return item.ZONE_VALUE / 10 + ZONE_UNIT_NNS;
            }
        case "TD":
            if(ZONE_PROPERTY_TD === "RN") {
                return item.ZONE_VALUE /100 + ' m';
            } else {
                return item.ZONE_VALUE / 100 + ZONE_UNIT_TD;
            }
        case "NMLLTD":
            if(ZONE_PROPERTY_SL === "RD") {
                return item.ZONE_VALUE / 10 + ZONE_UNIT_SL;
            } else {
                return item.ZONE_VALUE / 100 + ZONE_UNIT_SL;
            }
        default:
            return "-";
    }
}

$("#tab-historys").off("click").click(function (event) {
    openTabHistory(event, 'tabHistory')
    $("#tabIndicator").css("left", "0%");
});
$("#tab-map").off("click").click(function (event) {
    openTabHistory(event, 'tabMap');
    $("#tabIndicator").css("left", "50%");
});

var currentTab = 'tabHistory'; // tab đang hiển thị hiện tại

function openTabHistory(evt, nextTabId) {
    if (currentTab === nextTabId) return;

    const $current = $('#' + currentTab);
    const $next = $('#' + nextTabId);
    const direction = (nextTabId === 'tabMap') ? 'left' : 'right';

    $('.tab-content-history').removeClass('active slide-out-left slide-out-right');
    $('.tablinkHistory').removeClass('active');

    // Thêm animation trượt ra
    $current.addClass(direction === 'left' ? 'slide-out-left' : 'slide-out-right');

    // Lắng nghe khi kết thúc animation rồi co lại width
    $current.one('transitionend', () => {
        // $current.css('width', '0');
    });

    // Hiện tab mới
    // $next.css('width', '100%').removeClass('d-none');
    setTimeout(() => {
        $next.addClass('active');
        $(evt.currentTarget).addClass('active');
        currentTab = nextTabId;
            
        if (typeof map !== 'undefined' && map && checkMap) {
            map.invalidateSize();
            
            checkMap = false;
        }
    }, 50);
}


function checkHeight() {
    const vh = $(window).height();
    $('#history-detail').height(vh - 160);
    $('#total-history-loading').height(vh - 180);
    $('#tabWrapper').height(vh - 130);
    $('#tabMap').height(vh - 130);
    $('#list-history-detail').height(vh - 530);
    $('#history-setting-detail').css('max-height', vh - 200);
}


$(window).on('resize', checkHeight);
//-------------------------------------------------------------------------------

var map = null;
var markerMap = new Map();
// ✅ Hàm thêm các marker từ danh sách
function addMarkers(locations, mapContainerId) {
    checkMap = true;
    if (map) {
        map.remove(); // Xóa bản đồ cũ
    }
    const bounds = L.latLngBounds(
        L.latLng(6.2, 100.1),  // Góc dưới trái
        L.latLng(26.3, 110.6)  // Góc trên phải
    );
    map = L.map(mapContainerId, {
        maxBounds: bounds,
        maxBoundsViscosity: 1.0,
        minZoom: 6,
        maxZoom: 19,
    }).setView([16.0, 106.0], 6);

    map.on('moveend', function () {
        if (!bounds.contains(map.getCenter())) {
            map.panInsideBounds(bounds, { animate: true });
        }
    });
    const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    // const tiles = L.tileLayer('http://somebits.com:8001/rivers/{z}/{x}/{y}.json', {
        maxZoom: 19
    }).addTo(map);

    locations.forEach(loc => {
        let typeName = '';
        if(loc.type == "N"){
            typeName = 'N';
        } else if(loc.type == "M" || loc.type == "MS"){
            typeName = 'R';
        }
        const customHTML = `
            <div class="marker-wrapper marker-${loc.code}">
                <div class="marker-label marker-label-${loc.code}" style="font-size: 13px;"></div>
                <svg class="marker-pin" viewBox="0 0 24 24">
                    <path d="M12 0C8.1 0 5 3.1 5 7c0 5.3 7 13 7 13s7-7.7 7-13c0-3.9-3.1-7-7-7z" fill="#4285f4" stroke="rgb(66, 133, 244)" stroke-width="2"/>
                    <circle cx="12" cy="8.5" r="3.5" fill="white"/>
                </svg>
                <div class="mePin-wrapper">
                    <div class="mePin-child">
                        <b>${typeName}</b>
                        <svg id="mePin" xmlns="http://www.w3.org/2000/svg" width="33.3" height="32.4" viewBox="0 0 43.3 42.4">
                            <path class="ring_outer mePin bounceInDown" fill="#dc3545" d="M28.6 23c6.1 1.4 10.4 4.4 10.4 8 0 4.7-7.7 8.6-17.3 8.6-9.6 0-17.4-3.9-17.4-8.6 0-3.5 4.2-6.5 10.3-7.9.7-.1-.4-1.5-1.3-1.3C5.5 23.4 0 27.2 0 31.7c0 6 9.7 10.7 21.7 10.7s21.6-4.8 21.6-10.7c0-4.6-5.7-8.4-13.7-10-.8-.2-1.8 1.2-1 1.4z"></path>
                            <path class="ring_inner" fill="#dc3545" d="M27 25.8c2 .7 3.3 1.8 3.3 3 0 2.2-3.7 3.9-8.3 3.9-4.6 0-8.3-1.7-8.3-3.8 0-1 .8-1.9 2.2-2.6.6-.3-.3-2-1-1.6-2.8 1-4.6 2.7-4.6 4.6 0 3.2 5.1 5.7 11.4 5.7 6.2 0 11.3-2.5 11.3-5.7 0-2-2.1-3.9-5.4-5-.7-.1-1.2 1.3-.7 1.5z"></path>
                        </svg>
                    </div>
                </div>
            </div>
        `;

        const icon = L.divIcon({
            className: `custom-marker custom-${loc.code}`,
            html: customHTML,
            iconSize: [40, 40],
            iconAnchor: [20, 40],
            popupAnchor: [0, -40]
        });

        const marker = L.marker(loc.coords, { icon, customData: loc }).addTo(map);
        marker.options.customData = {
            type: loc.type, // Loại của trạm (NAAM, N, M, v.v.)
            name: loc.name,
            code: loc.code,
            item: loc.item,
            coords: loc.coords
        };
        marker.on('click', function (e) {
            map.setView(loc.coords, 8); // Hoặc dùng map.flyTo(...) nếu muốn hiệu ứng mượt
        });
        marker.bindPopup(loc.popup);
        markerMap.set(loc.code, marker);
    });

    setTimeout(() => {
        map.invalidateSize();
        // $("#tabMap").css('width', '0');
    }, 10);
}
// setInterval(() => {
        
//     }, 4000);
function getFieldsByType(type) {
    switch (type) {
        case "NAAM":
            return ['RD', 'RT', 'RH', 'RP'];
        case "N":
            return ['RN'];
        case "MSL":
        case "M":
        case "MS":
            return ['RD'];
        case "NNS":
            return ['RT', 'RN', 'SS', 'EC'];
        case "TD":
            return ['RN', 'TN', 'QV', 'QR'];
        case "NMLLTD":
            return ['RN', 'RD', 'QN', 'VN'];
        default:
            return [];
    }
}

// Dữ liệu mẫu cho các yếu tố
var defaultValues = {
    RD: '0mm',   // Lượng mưa
    RT: '0°C',   // Nhiệt độ
    RH: '0%',    // Độ ẩm
    RP: '0hPa',  // Áp suất
    RN: '0mm',   // Mưa
    SS: '0w',    // Ánh sáng/Năng lượng
    EC: '0mS/cm', // Độ dẫn điện
    TN: 'tr.m³',
    QV: 'm³/s', 
    QR: 'm³/s', 
    QN: 'm³/s', 
    VN: 'm/s', 
};

function generatePopupHTML(name, code, type, item, coords) {
    const fields = getFieldsByType(type);

    let dynamicRows = '';
    
    fields.forEach(field => {
        let label = '';
        switch (field) {
            case 'RD': label = 'Lượng mưa'; break;
            case 'RT': label = 'Nhiệt độ'; break;
            case 'RH': label = 'Độ ẩm'; break;
            case 'RP': label = 'Áp suất khí quyển'; break;
            case 'RN': label = 'Mực nước'; break;
            case 'SS': label = 'Độ mặn'; break;
            case 'EC': label = 'Độ dẫn điện'; break;
            case 'TN': label = 'Dung tích'; break;
            case 'QV': label = 'Lưu lượng đến'; break;
            case 'QR': label = 'Lưu lượng xả'; break;
            case 'QN': label = 'Lưu lượng nước'; break;
            case 'VN': label = 'Tốc độ dòng chảy'; break;
        }

        dynamicRows += `
            <tr style="height:22px">
                <td><b>${label}: <span id="popup-${code}-${field}">0</span></b></td>
            </tr>
        `;
    });
    const itemStr = JSON.stringify(item).replace(/"/g, '&quot;');
    const itemcoords = JSON.stringify(coords).replace(/"/g, '&quot;');
    return `
        <table style="width:300px;">
            <tbody>
                <tr style="height:25px">
                    <td>
                        <h4 style="clear:both;border-bottom:solid 1px #ccc;max-width:300px;word-break:break-word;">
                            ${name}-${code}
                        </h4>
                    </td>
                </tr>
                ${dynamicRows}
                <tr style="height:22px;border-top:solid 1px #ccc">
                    <td>Năng lượng: <span id="popup-${code}-Energy">0v</span></td>
                </tr>
                <tr style="height:22px;max-width:300px;word-break:break-word;">
                    <td>Hoạt động cuối lúc: <span id="popup-${code}-LastTime">@LASTTIME</span></td>
                </tr>
                <tr style="height:22px">
                    <td>
                        <div class="d-flex justify-content-center">
                            <div class="w-50" style="padding-right: 5px">
                                <button id="tooltip" class="btn btn-warning w-100" style="margin-top: 20px; background-color: #f39c12;border: solid 1px #f39c12; width: 75%; height: 35px; color: #fff; padding: 3px 10px;" onclick="handleItemClick(${itemStr});">Xem chi tiết</button>
                            </div>
                            <div class="w-50" style="padding-left: 5px">
                                <button class="btn btn-warning w-100" style="margin-top: 20px; background-color:rgb(35, 113, 168);border: solid 1px rgb(35, 113, 168); width: 75%; height: 35px; color: #fff; padding: 3px 10px;" onclick="ClickGGMap(${itemcoords});">Vị trí</button>
                            </div>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    `;
}

function generatePopupValueHTML(loc) {
    let extraContent = '';
    let lastTimeRain = '';
    let rainValue = 0;
    if(loc.lastTimeRD){
        lastTimeRain = "("+loc.lastTimeRD.split(" ")[1]+")";
    }
    const getOldData = getDataByCode(loc.code)
    if(getOldData.RD){
        rainValue = parseValue(getOldData.RD);
    }
    switch (loc.type) {
        case "NAAM":
            extraContent = `
                <tr><td>Lượng mưa (00h): ${loc.RD ?? rainValue} mm ${lastTimeRain}</td></tr>
                <tr><td><b>Nhiệt độ: ${WarningTemperature(loc.RT) ?? 0} °C</b></td></tr>
                <tr><td><b>Độ ẩm: ${WarningHumidity(loc.RH) ?? 0} %</b></td></tr>
                <tr><td><b>Áp suất khí quyển: ${loc.RP ?? 0} hPa</b></td></tr>
            `;
            break;
        case "N":
            extraContent = `
                <tr><td>Mực nước: ${loc.RN ?? 0} cm</td></tr>
            `;
            break;
        case "MSL":
        case "M":
        case "MS":
            extraContent = `
                <tr><td>Lượng mưa (00h): ${loc.RD ?? 0} mm ${lastTimeRain}</td></tr>
            `;
            break;
        case "NNS":
            extraContent = `
                <tr><td>Mực nước: ${loc.RN ?? 0} cm</td></tr>
                <tr><td><b>Nhiệt độ: ${WarningTemperature(loc.RT)} °C</b></td></tr>
                <tr><td><b>Độ mặn: ${loc.SS ?? 0} ppt</b></td></tr>
                <tr><td><b>Độ dẫn điện: ${loc.EC ?? 0} μs/cm</b></td></tr>
            `;
            break;
        case "TD":
            extraContent = `
                <tr><td>Mực nước: ${loc.RN ?? 0} m</td></tr>
                <tr><td><b>Dung tích: ${loc.TN ?? 0} tr.m³</b></td></tr>
                <tr><td><b>Lưu lượng đến: ${loc.QV ?? 0} m³/s</b></td></tr>
                <tr><td><b>Lưu lượng xả: ${loc.QR ?? 0} m³/s</b></td></tr>
            `;
            break;
        case "NMLLTD":
            extraContent = `
                <tr><td>Mực nước: ${loc.RN ?? 0} m</td></tr>
                <tr><td><b>Lượng mưa: ${loc.RD ?? rainValue} mm ${lastTimeRain}</b></td></tr>
                <tr><td><b>Lưu lượng nước: ${loc.QN ?? 0} m³/s</b></td></tr>
                <tr><td><b>Tốc độ dòng chảy: ${loc.VN ?? 0} m/s</b></td></tr>
            `;
            break;
        default:
            extraContent = `<tr><td>Không có dữ liệu</td></tr>`;
    }
    const itemStr = JSON.stringify(loc.item).replace(/"/g, '&quot;');
    const itemcoords = JSON.stringify(loc.coords).replace(/"/g, '&quot;');
    return `
        <table style="width:300px;">
            <tbody>
                <tr style="height:25px">
                    <td>
                        <h4 style="clear:both;border-bottom:solid 1px #ccc;max-width:300px;word-break:break-word;color:#0078A8">
                            ${loc.name}
                        </h4>
                    </td>
                </tr>
                ${extraContent}
                <tr style="height:22px;border-top:solid 1px #ccc">
                    <td>Năng lượng: <span id="popup-${loc.code}-Energy">${WarningEnergy(loc.RA)} v</span></td>
                </tr>
                <tr style="height:22px;max-width:300px;word-break:break-word;">
                    <td>Hoạt động cuối lúc: <span id="popup-${loc.code}-LastTime">${HOMEOSAPP.formatDateTime(loc.lastTime)}</span></td>
                </tr>
                <tr style="height:22px">
                    <td>
                        <div class="d-flex justify-content-center">
                            <div class="w-50" style="padding-right: 5px">
                                <button id="tooltip" class="btn btn-warning w-100" style="margin-top: 20px; background-color: #f39c12;border: solid 1px #f39c12; width: 75%; height: 35px; color: #fff; padding: 3px 10px;" onclick="handleItemClick(${itemStr});">Xem chi tiết</button>
                            </div>
                            <div class="w-50" style="padding-left: 5px">
                                <button class="btn btn-warning w-100" style="margin-top: 20px; background-color:rgb(35, 113, 168);border: solid 1px rgb(35, 113, 168); width: 75%; height: 35px; color: #fff; padding: 3px 10px;" onclick="ClickGGMap(${itemcoords});">Vị trí</button>
                            </div>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    `;
}

function ClickGGMap(coords) {
    window.location.href = "https://www.google.com/maps/place/"+ coords[0] +","+ coords[1]
}

async function addDataLocation(item, tooltip, itemW) {
    const itemLocation = {
        name: item.WORKSTATION_NAME+'-'+item.WORKSTATION_ID,
        coords: [item.LONGITUDE, item.LATITUDE],
        type: item.TEMPLATE_TOOLTIP,
        code: item.WORKSTATION_ID,
        item: itemW,
        popup: generatePopupHTML(item.WORKSTATION_NAME, item.WORKSTATION_ID, item.TEMPLATE_TOOLTIP, itemW, [item.LONGITUDE, item.LATITUDE])
    }
    locations.push(itemLocation);
}

function updatePopupData(code, newZoneData) {
    const marker = markerMap.get(code);
    if (!marker) return;

    const oldData = marker.options.customData || {};
    const mergedData = { ...oldData };
    
    const newTimeFormatted = newZoneData.lastTime;
    const isNewTime = newTimeFormatted !== oldData.lastTime;

    if (isNewTime) {
        const markerElement = document.querySelector(`.marker-${code}`);
        if (markerElement) {
            markerElement.classList.add('bounce-animation');
            setTimeout(() => {
                markerElement.classList.remove('bounce-animation');
            }, 5000);
        }
    }
    
    // 🎯 Chỉ update những field phù hợp với type
    switch (oldData.type) {
        case "NAAM":
            mergedData.RD = parseValue(newZoneData.RD); // Lượng mưa (nếu có)
            if(newZoneData.RD){
                mergedData.lastTimeRD = HOMEOSAPP.formatDateTime(newZoneData.lastTimeRD);
                $(".marker-label-"+code).html(WarningRain(parseValue(newZoneData.RD)))
                $(".marker-"+code+" .marker-pin circle").attr("fill", "red");
                $(".marker-"+code+" .mePin-wrapper .mePin-child b").css("color", "red");
            }
            mergedData.RT = parseValue(newZoneData.RT); // Nhiệt độ
            mergedData.RH = parseValue(newZoneData.RH); // Độ ẩm
            mergedData.RP = parseValue(newZoneData.RP); // Áp suất
            break;
        case "N":
            $(".marker-label-"+code).text(newZoneData.RN)
            mergedData.RN = parseValue(newZoneData.RN); // Lượng mưa
            break;
        case "MSL":
        case "M":
        case "MS":
            if(newZoneData.RD){
                mergedData.lastTimeRD = HOMEOSAPP.formatDateTime(newZoneData.lastTimeRD);
                $(".marker-label-"+code).html(WarningRain(parseValue(newZoneData.RD)))
                $(".marker-"+code+" .marker-pin circle").attr("fill", "red");
                // $(".marker-"+code+" .mePin-wrapper .mePin-child b").css("color", "red");
            }
            mergedData.RD = parseValue(newZoneData.RD); // Lượng mưa
            break;
        case "NNS":
            mergedData.RT = parseValue(newZoneData.RT);
            mergedData.RN = parseValue(newZoneData.RN);
            mergedData.SS = parseValue(newZoneData.SS);
            mergedData.EC = parseValue(newZoneData.EC);
            break;
        case "TD":
            if(newZoneData.QV){
                $(".marker-label-"+code).html(WarningQN(parseValue(newZoneData.QV)/100, "m³/s"));
                $(".marker-"+code+" .marker-pin rect").attr("fill", "#6c3483");
                $(".marker-"+code+" .marker-pin rect").attr("stroke", "#6c3483");
            }
            mergedData.RN = parseValue(newZoneData.RN)/100;
            mergedData.TN = parseValue(newZoneData.TN)/100;
            mergedData.QV = parseValue(newZoneData.QV)/100;
            mergedData.QR = parseValue(newZoneData.QR)/100;
            break;
        case "NMLLTD":
            if(newZoneData.RD){
                mergedData.lastTimeRD = HOMEOSAPP.formatDateTime(newZoneData.lastTimeRD);
            }
            if(newZoneData.QN){
                $(".marker-label-"+code).html(WarningQN(parseValue(newZoneData.QN)/100, "m³/s"))
                $(".marker-"+code+" .marker-pin polygon").attr("fill", "red");
                $(".marker-"+code+" .marker-pin polygon").attr("stroke", "red");
                $(".marker-"+code+" .mePin-wrapper .mePin-child b").css("color", "red");
            }
            mergedData.RN = parseValue(newZoneData.RN)/100;
            mergedData.RD = parseValue(newZoneData.RD);
            mergedData.QN = parseValue(newZoneData.QN)/100;
            mergedData.VN = parseValue(newZoneData.VN)/100;
            break;
        default:
            console.warn(`Không biết cách update cho type: ${oldData.type}`);
    }
    mergedData.RA = parseValue(newZoneData.RA);
    mergedData.lastTime = newZoneData.lastTime; // Cập nhật thời gian hiện tại
    saveDataByCode(code, newZoneData);
    
    const updatedHTML = generatePopupValueHTML(mergedData);
    marker.setPopupContent(updatedHTML);

    // Update lại dữ liệu trong marker
    marker.options.customData = mergedData;
}

// Hàm phụ: bỏ đơn vị (°C, %, hPa, mm...) để lấy số
function parseValue(str) {
    if (typeof str !== "string") return str;
    return parseFloat(str.replace(/[^\d.-]/g, ''));
}

function saveDataByCode(code, newData) {
if (!store[code]) {
    // Nếu chưa có dữ liệu, lưu luôn newData
    store[code] = { ...newData };
} else {
    // Nếu đã có dữ liệu, cập nhật giữ nguyên trường không thay đổi
    store[code] = updateData(store[code], newData);
}
}

// Hàm updateData từ trên, giữ nguyên dữ liệu cũ nếu mới không có
function updateData(oldData, newData) {
const updatedData = { ...oldData };
for (const key in newData) {
    if (newData[key] !== undefined && newData[key] !== null && newData[key] !== '') {
    updatedData[key] = newData[key];
    }
}
return updatedData;
}

// Hàm lấy dữ liệu theo code
function getDataByCode(code) {
return store[code] || null;
}

function processAndUpdate(data) {
    const items = data.D;
    const grouped = {};
    let dateTimeRA;
    let dateTimeRD;
    // Gom nhóm theo code
    items.forEach(item => {
        const code = item.ZONE_ADDRESS;
        if(item.ZONE_PROPERTY == 'RA'){
            dateTimeRA = item.DATE_CREATE;
        }
        if(item.ZONE_PROPERTY == 'RD'){
            dateTimeRD = item.DATE_CREATE;
        }
        if (!grouped[code]) grouped[code] = {};

        // Gán dữ liệu theo field
        grouped[code][item.ZONE_PROPERTY] = item.ZONE_VALUE;
    });

    // Update dữ liệu
    for (const code in grouped) {
        const item = grouped[code];

        const formattedData = {};

        // Format từng giá trị theo kiểu đẹp
        if (item.RA != null) formattedData.RA = (item.RA / 10) + "v";  // ắc quy
        if (item.RD != null) formattedData.RD = (item.RD / 10) + "mm";  // Lượng mưa
        if (item.RD != null) formattedData.lastTimeRD = dateTimeRD;  // Thời gian mưa
        if (item.RT != null) formattedData.RT = (item.RT / 10) + "°C";  // Nhiệt độ
        if (item.RH != null) formattedData.RH = (item.RH / 10) + "%";   // Độ ẩm
        if (item.RP != null) formattedData.RP = (item.RP / 10) + "hPa"; // Áp suất
        if (item.RN != null) formattedData.RN = (item.RN) + "cm"; // Mực nước
        if (item.SS != null) formattedData.SS = (item.SS / 10000).toFixed(2) + "ppt"; // Độ mặn
        if (item.EC != null) formattedData.EC = (item.EC / 1000).toFixed(2) + "μs/cm"; // Độ dẫn điện
        if (item.TN != null) formattedData.TN = (item.TN).toFixed(2) + "tr.m³"; // dung tích hồ chứa
        if (item.QV != null) formattedData.QV = (item.QV).toFixed(2) + "m³/s"; // Lưu lượng đến
        if (item.QR != null) formattedData.QR = (item.QR).toFixed(2) + "m³/s"; // Lưu lượng xả
        if (item.QN != null) formattedData.QN = (item.QN).toFixed(2) + "m³/s"; // Lưu lượng nước
        if (item.VN != null) formattedData.VN = (item.VN).toFixed(2) + "m/s"; // tốc độ dòng chảy

        formattedData.lastTime = dateTimeRA;
        
        updatePopupData(code, formattedData);
    }
}

// Gọi hàm

function WarningRain(value) {
    var energy = "<b><font>" + value + "</font></b>";
    if (value >= 0 && value < 5) energy = "<b><font color='#1a6985'>" + value + "mm</font></b>";
    if (value >= 5 && value < 10) energy = "<b><font color='#0f3c4c'>" + value + "mm</font></b>";
    if (value >= 10 && value < 20) energy = "<b><font color='#0084FF'>" + value + "mm</font></b>";
    if (value >= 20 && value < 50) energy = "<b><font color='#6766ff'>" + value + "mm</font></b>";
    if (value >= 50 && value < 100) energy = "<b><font color='#cc6600'>" + value + "mm</font></b>";
    if (value >= 100 && value < 150) energy = "<b><font color='#006600'>" + value + "mm</font></b>";
    if (value >= 150 && value < 200) energy = "<b><font color='#00FFFF'>" + value + "mm</font></b>";
    if (value >= 200 && value < 300) energy = "<b><font color='#99004d'>" + value + "mm</font></b>";
    if (value >= 300 && value < 400) energy = "<b><font color='#7b7b7b'>" + value + "mm</font></b>";
    if (value >= 400) energy = "<b><font color='#A00BA0'>" + value + "mm</font></b>";
    
    return energy;
}
function WarningWaterLevel(value, unit) {
    var energy = "<b><font>" + value + "</font></b>";
    if (value >= 0 && value < 5) energy = "<b><font color='#1a6985'>" + value + ""+unit+"</font></b>";
    if (value >= 5 && value < 10) energy = "<b><font color='#0f3c4c'>" + value + ""+unit+"</font></b>";
    if (value >= 10 && value < 20) energy = "<b><font color='#0084FF'>" + value + ""+unit+"</font></b>";
    if (value >= 20 && value < 50) energy = "<b><font color='#6766ff'>" + value + ""+unit+"</font></b>";
    if (value >= 50 && value < 100) energy = "<b><font color='#cc6600'>" + value + ""+unit+"</font></b>";
    if (value >= 100 && value < 150) energy = "<b><font color='#006600'>" + value + ""+unit+"</font></b>";
    if (value >= 150 && value < 200) energy = "<b><font color='#00FFFF'>" + value + ""+unit+"</font></b>";
    if (value >= 200 && value < 300) energy = "<b><font color='#1a6985'>" + value + ""+unit+"</font></b>";
    if (value >= 300 && value < 400) energy = "<b><font color='#0f3c4c'>" + value + ""+unit+"</font></b>";
    if (value >= 400) energy = "<b><font color='#A00BA0'>" + value + ""+unit+"</font></b>";
    
    return energy;
}
function WarningQN(value, unit) {
    var energy = "<b><font>" + value + "</font></b>";
    if (value >= 0 && value < 100) energy = "<b><font color='#1a6985'>" + value + ""+unit+"</font></b>";
    if (value >= 100 && value < 300) energy = "<b><font color='#0f3c4c'>" + value + ""+unit+"</font></b>";
    if (value >= 300 && value < 600) energy = "<b><font color='#0084FF'>" + value + ""+unit+"</font></b>";
    if (value >= 600 && value < 1000) energy = "<b><font color='#6766ff'>" + value + ""+unit+"</font></b>";
    if (value >= 1000 && value < 1500) energy = "<b><font color='#cc6600'>" + value + ""+unit+"</font></b>";
    if (value >= 1500 && value < 2000) energy = "<b><font color='#006600'>" + value + ""+unit+"</font></b>";
    if (value >= 2000 && value < 2500) energy = "<b><font color='#00FFFF'>" + value + ""+unit+"</font></b>";
    if (value >= 2500 && value < 3000) energy = "<b><font color='#1a6985'>" + value + ""+unit+"</font></b>";
    if (value >= 3000 && value < 3500) energy = "<b><font color='#0f3c4c'>" + value + ""+unit+"</font></b>";
    if (value >= 3500) energy = "<b><font color='#A00BA0'>" + value + ""+unit+"</font></b>";
    
    return energy;
}
function WarningTemperature(value) {
    var energy = '0';
    if (value > 27.0 && value <= 30.0) energy = "<b><font color='green'>" + value + "</font></b>";
    if (value > 30.0 && value <= 36.0) energy = "<b><font color='orange'>" + value + "</font></b>";
    if (value >= 11.0 && value <= 27) energy = "<b><font color='blue'>" + value + "</font></b>";
    if (value > 36) energy = "<b><font color='red'>" + value + "</font></b>";
    if (value < 11.0) energy = "<b><font color='yellow'>" + value + "</font></b>";
    return energy;
}
function WarningHumidity(value) {
    var energy = '';
    if (value >= 55.0 && value <= 65.0) energy = "<b><font color='green'>" + value + "</font></b>";
    if (value > 65.0 && value <= 80.0) energy = "<b><font color='orange'>" + value + "</font></b>";
    if (value > 80.0) energy = "<b><font color='red'>" + value + "</font></b>";
    if (value < 55.0) energy = "<b><font color='yellow'>" + value + "</font></b>";
    return energy;
}
function WarningEnergy(value) {
    var energy = "<b><font>" + value + "</font></b>";
    if (value >= 11.5 && value <= 15.0) energy = "<b><font color='green'>" + value + "</font></b>";
    if (value >= 11.0 && value < 11.5) energy = "<b><font color='orange'>" + value + "</font></b>";
    if (value < 11.0) energy = "<b><font color='red'>" + value + "</font></b>";
    return energy;
}

// QR code 
$("#PickApp-button-scanQR").off("click").click(function () {
    HOMEOSAPP.checkTabMenu = "DetailDevice";
    HOMEOSAPP.loadPage("https://central.homeos.vn/singlepage/workstation/src/pages/ScanQR/scanQR.html");
    if (HOMEOSAPP.checkTabHistory == 1) {
        HOMEOSAPP.stopInterval();
    }
});
// danh mục
var listCategory = $('#history-setting-detail');

document.getElementById("historySelect").addEventListener("change", function () {
    const selectedValue = this.value; // Lấy giá trị đã chọn
    const selectedText = this.options[this.selectedIndex].text; // Lấy văn bản đã chọn
    showHistory(selectedValue);
});

function showCategory(type) {
    DataCategory = JSON.parse(localStorage.getItem('dataCategory'));
    if (DataCategory) {
        if (DataCategory.length > 0) {
            document.getElementById("btnAddCategory").classList.remove("d-none");
            listCategory.empty();
            for (let i = DataCategory.length - 1; i >= 0; i--) {
                addItemCategory(DataCategory[i], 'category');
            }
        }
    }
}

function addItemCategory(item, type) {
    let element = ''
    for (let i = 0; i < item.itemCategory.length; i++) {
        element += '<li>' +
            '<div style="position: relative;" class="history-item" data-code="' + item.itemCategory[i].CodeWorkStation + '">' +
            '<div class="iconApp">' +
            '<div id="App' + item.itemCategory[i].CodeWorkStation + '" class="icon" style="background-color: #28a745 !important;">' +
            getIconWorkstation(item.itemCategory[i].workstationType) +
            '</div>' +
            '<div class="info-box-content" style="padding-right: 0">' +
            '<div class="d-flex justify-content-between">' +
            '<span class="app-text">' + item.itemCategory[i].CodeWorkStation + '</span>' +
            '<span class="app-text" style="padding-right: 0">' + item.itemCategory[i].date + '</span>' +
            '</div>' +
            '<span class="app-text-number" style="padding-right: 0">' + item.itemCategory[i].NameWorkStation + '</span>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</li>'
    }

    element += '<li>' +
        '<div  style="width: 100%;">' +
        '<button class="btnRemoveCategory btn btn-danger" style="width: 100%; height: 35px; color: #fff; padding: 3px 10px;">Xoá danh mục</button>' +
        '</div>' +
        '</li>'
    // Tạo phần tử bao bọc với nút X
    const totalElement = $(
        '<li class="parent-item">' +
        '<button class="toggle-button">' +
        '<div>' +
        '<h4 style="margin: 0;">' + item.NameCategory + '</h4>' +
        '<p style="margin: 10px 0 0 0; font-size: 14px; font-weight: 300;">Danh mục có ' + item.itemCategory.length + ' trạm</p>' +
        '</div>' +
        '<span class="arrow-icon">▶</span>' +
        '</button>' +
        '<ul class="child-list">' +
        element +
        '</ul>' +
        '</li>'
    );

    // Thêm phần tử chính vào phần tử bao bọc
    // totalElement.append(element);

    // Gắn sự kiện click cho nút X
    // totalElement.find('.close-icon').on('click', function (e) {
    //     e.stopPropagation(); // Ngăn chặn sự kiện click lan đến phần tử chính

    //     // Hiển thị popup xác nhận
    //     const confirmDelete = confirm(`Bạn có chắc chắn muốn xóa danh mục "${item.NameCategory}" không?`);
    //     if (confirmDelete) {
    //         totalElement.remove(); // Xóa phần tử nếu người dùng chọn "Có"
    //         DataCategory = DataCategory.filter(i => i.NameCategory !== item.NameCategory);
    //         localStorage.setItem('dataCategory', JSON.stringify(DataCategory));
    //         toastr.success(`Danh mục "${item.NameCategory}" đã bị xóa!`);
    //         if (DataCategory.length == 0) {
    //             showAddCategoryButton();
    //         }
    //     }
    // }); 

    totalElement.find('.toggle-button').on('click', function (e) {
        e.preventDefault(); // Ngăn chặn hành động mặc định của thẻ <a>

        // Lấy danh sách con gần nhất (nếu có)
        const childList = $(this).siblings(".child-list");

        // Toggle hiển thị/ẩn danh sách con
        childList.slideToggle(200);

        // Xoay icon mũi tên
        const arrowIcon = $(this).find(".arrow-icon");
        arrowIcon.toggleClass("expanded");

        if (arrowIcon.hasClass("expanded")) {
            arrowIcon.css("transform", "rotate(90deg)");
        } else {
            arrowIcon.css("transform", "rotate(0deg)");
        }
    });

    totalElement.find('.btnRemoveCategory').on('click', function (e) {
        e.preventDefault(); // Ngăn chặn hành động mặc định của thẻ <a>
        const confirmDelete = confirm(`Bạn có chắc chắn muốn xóa danh mục "${item.NameCategory}" không?`);
        if (confirmDelete) {
            totalElement.remove(); // Xóa phần tử nếu người dùng chọn "Có"
            DataCategory = DataCategory.filter(i => i.NameCategory !== item.NameCategory);
            localStorage.setItem('dataCategory', JSON.stringify(DataCategory));
            toastr.success(`Danh mục "${item.NameCategory}" đã bị xóa!`);
            if (DataCategory.length == 0) {
                showAddCategoryButton();
            }
        }
    });

    // Gắn sự kiện click cho phần tử chính
    // element.on('click', function () {
    //     // handleItemClick(item);
    // });

    // Thêm phần tử vào danh sách lịch sử

    listCategory.append(totalElement);
}

// menu
var menuToggle = $(".menuToggle");
var sidebar = $(".sidebar");

// Toggle the sidebar visibility
menuToggle.on("click", (e) => {
    e.stopPropagation(); // Ngăn chặn sự kiện click lan ra ngoài
    sidebar.toggleClass("open");
    $(".overlay").toggleClass("show");
});

// Detect clicks outside the sidebar
$(document).on("click", (e) => {
    if (sidebar.hasClass("open") && !$(e.target).closest(".sidebar").length) {
        sidebar.removeClass("open");
        $(".overlay").toggleClass("show");
    }
});

// Handle menu item clicks
var menuItems = document.querySelectorAll(".menu-item, .submenu li");
menuItems.forEach((item) => {
    item.addEventListener("click", async (e) => {
        e.stopPropagation(); // Prevent the click from propagating to the document
        // Detect which menu item was clicked
        const menuText = item.innerText.trim(); // Get the text of the menu item

        if (menuText == "Giải pháp thông minh") {
            HOMEOSAPP.stopInterval();
            HOMEOSAPP.goBack();
        } else if (menuText == "Quản lý danh mục") {
            document.getElementById("history-setting").classList.remove("d-none");
            document.getElementById("history-homePage").classList.add("d-none");
            document.getElementById("list-category").classList.remove("d-none");
            document.getElementById("save-category").classList.add("d-none");
            $(".history-avt").removeClass("d-none");
            document.getElementById("category-back").classList.add("d-none");
            showCategory()
            // document.querySelector(".tablink-history").off("click").click();
        } else if (menuText == "Truy cập Trạm") {
            document.getElementById("history-setting").classList.add("d-none");
            document.getElementById("history-homePage").classList.remove("d-none");
            localStorage.setItem('listItemCategory', JSON.stringify([]));
            showHistory()
        } else if (menuText == "Thông tin công ty") {
            window.location.href = "https://homeos.com.vn/";
        } else if (menuText == "Thông tin sản phẩm") {
            HOMEOSAPP.checkTabMenu = "DetailDevice";
            HOMEOSAPP.loadPage("https://central.homeos.vn/singlepage/workstation/src/pages/ScanQR/scanQR.html");
        } else if (menuText == "Quét lô sản phẩm") {
            HOMEOSAPP.checkTabMenu = "ScanLotDevice";
            HOMEOSAPP.loadPage("https://central.homeos.vn/singlepage/workstation/src/pages/ScanQR/scanQR.html");
        } else if (menuText == "Quản lý và xuất lô hàng") {
            HOMEOSAPP.checkTabMenu = "ManageDevice";
            HOMEOSAPP.loadPage("https://central.homeos.vn/singlepage/workstation/src/pages/ScanQR/scanQR.html");
        }
        // Close the sidebar after selection (optional)
        sidebar.removeClass("open");
        $(".overlay").toggleClass("show");
    });
});
// danh mục
$("#addCategory").off("click").click(function () {
    OpenAddCategory()
});

function showHistoryCategory(type) {
    historyItems = JSON.parse(localStorage.getItem('dataHistory'));
    CategoryItems = JSON.parse(localStorage.getItem('listItemCategory'));
    if (type) {
        historyItems = historyItems.filter(item =>
            item.CodeWorkStation.includes(type) ||
            item.NameWorkStation.toLowerCase().includes(type)
        );
    }
    if (CategoryItems) {
        for (let i = 0; i < CategoryItems.length; i++) {
            historyItems = historyItems.filter(item => item.CodeWorkStation != CategoryItems[i].CodeWorkStation);
        }
    }
    if (historyItems) {
        historyListCategoryDetail.empty();
        for (let i = historyItems.length - 1; i >= 0; i--) {
            addItemHistory(historyItems[i], 'category');
        }
    }
}

function handleItemCategoryClick(item) {
    const itemHistory = { 'CodeWorkStation': item.CodeWorkStation, 'NameWorkStation': item.NameWorkStation, 'domain': item.domain, 'date': HOMEOSAPP.getCurrentTime(), 'workstationType': item.workstationType }
    CategoryItems = JSON.parse(localStorage.getItem('listItemCategory'));
    let filterItem = []
    if (CategoryItems) {
        filterItem = CategoryItems.filter(itemdetail => itemdetail.CodeWorkStation === item.CodeWorkStation);
    }
    if (filterItem.length > 0) {
        CategoryItems = CategoryItems.filter(itemdetail => itemdetail.CodeWorkStation !== item.CodeWorkStation);
        localStorage.setItem('listItemCategory', JSON.stringify(CategoryItems));

        historyListCategoryAdd.empty();
        for (let i = CategoryItems.length - 1; i >= 0; i--) {
            addItemHistory(CategoryItems[i], 'add');
        }
    } else {
        if (CategoryItems) {
            CategoryItems = CategoryItems.filter(itemdetail => itemdetail.CodeWorkStation !== item.CodeWorkStation);
            CategoryItems.push(itemHistory);
            if (CategoryItems.length > 20) {
                CategoryItems.shift();
            }
        } else {
            CategoryItems = [];
            CategoryItems.push(itemHistory);
        }
        localStorage.setItem('listItemCategory', JSON.stringify(CategoryItems));

        if (CategoryItems && CategoryItems.length > 0) {
            historyListCategoryAdd.empty();
            for (let i = CategoryItems.length - 1; i >= 0; i--) {
                addItemHistory(CategoryItems[i], 'add');
            }
        }
    }
    showHistoryCategory()
}

$("#saveCategory").off("click").click(function () {
    saveCategory()
});

function saveCategory() {
    const inputValue = $('#name-category').val();
    if (inputValue) {
        const item = JSON.parse(localStorage.getItem('listItemCategory'));
        let itemCategory = { 'NameCategory': inputValue, 'itemCategory': item }
        DataCategory = JSON.parse(localStorage.getItem('dataCategory'));
        if (DataCategory) {
            const checkInput = DataCategory.filter(item => item.NameCategory === inputValue);
            if (checkInput.length > 0) {
                const confirmEDIT = confirm(`Danh mục "${inputValue}" đã tồn tại, xác nhận có muốn thêm những trạm đã chọn chưa nằm trong danh mục hay không?`);
                if (confirmEDIT) {
                    itemCategory.itemCategory.forEach(item2 => {
                        const exists = checkInput[0].itemCategory.some(item1 => item1.CodeWorkStation === item2.CodeWorkStation);
                        if (!exists) {
                            checkInput[0].itemCategory.push(item2);
                        }
                    });
                    DataCategory = DataCategory.filter(item => item.NameCategory !== inputValue);
                    DataCategory.push(checkInput[0]);
                    localStorage.setItem('dataCategory', JSON.stringify(DataCategory));
                    document.getElementById("list-category").classList.remove("d-none");
                    document.getElementById("save-category").classList.add("d-none");
                    $('#name-category').val('');
                    $('#search-category').val('');
                    localStorage.setItem('listItemCategory', JSON.stringify([]));
                    historyListCategoryAdd.empty();
                    showCategory()
                }
            } else if (item.length == 0) {
                toastr.error("Vui lòng chọn trạm để thêm vào danh mục!");
            } else {
                if (DataCategory) {
                    DataCategory.push(itemCategory);
                    if (DataCategory.length > 20) {
                        DataCategory.shift();
                    }
                } else {
                    DataCategory = [];
                    DataCategory.push(itemCategory);
                }
                localStorage.setItem('dataCategory', JSON.stringify(DataCategory));
                document.getElementById("list-category").classList.remove("d-none");
                document.getElementById("save-category").classList.add("d-none");
                $('#name-category').val('');
                $('#search-category').val('');
                localStorage.setItem('listItemCategory', JSON.stringify([]));
                historyListCategoryAdd.empty();
                showCategory()
            }
        } else {
            DataCategory = [];
            DataCategory.push(itemCategory);
            localStorage.setItem('dataCategory', JSON.stringify(DataCategory));
            document.getElementById("list-category").classList.remove("d-none");
            document.getElementById("save-category").classList.add("d-none");
            $('#name-category').val('');
            $('#search-category').val('');
            localStorage.setItem('listItemCategory', JSON.stringify([]));
            historyListCategoryAdd.empty();
            showCategory()
        }

    } else {
        toastr.error("Vui lòng nhập tên danh mục!");
    }
}

$("#btnAddCategory").off("click").click(function () {
    OpenAddCategory()
});

function showAddCategoryButton() {
    const buttonHTML = $(
        '<div class="col-12" style="margin-top: 10px; display: flex; justify-content: center; align-items: center;">' +
        '<button id="addCategory" style="width: 200px; height: 200px; border-radius: 50%; border: 1px dashed #fff; background-color: #1E2833; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #fff; font-size: 14px; text-align: center;">' +
        '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" style="color: #fff; margin-bottom: 8px;" fill="currentColor" class="bi bi-plus" viewBox="0 0 16 16">' +
        '<path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>' +
        '</svg>' +
        'Tạo mới danh mục trạm.' +
        '</button>' +
        '</div>'
    );
    document.getElementById("btnAddCategory").classList.add("d-none");
    buttonHTML.on('click', function () {

        OpenAddCategory();
    });
    listCategory.append(buttonHTML);
}

$('#search-category').on('change', function () {
    const searchValue = $(this).val().toLowerCase();
    showHistoryCategory(searchValue)
});

$("#backCategory").off("click").click(function () {
    $(".history-avt").removeClass("d-none");
    document.getElementById("category-back").classList.add("d-none");
    document.getElementById("list-category").classList.remove("d-none");
    document.getElementById("save-category").classList.add("d-none");
    document.getElementById("detail-category").classList.add("d-none");
    showCategory();
    historyListCategoryAdd.empty();
});

//history control
function addItemWarranty() {
    if (HOMEOSAPP.application == 'CONTROL') {
        let ConditionItems = JSON.parse(localStorage.getItem('dataCondition'));
        if (ConditionItems && ConditionItems.length > 0) {
            historyListDetail.empty()
            ConditionItems.forEach(item => {

                const element = $(
                    '<div class="iconApp">' +
                    '<div id="App' + item.CodeCondition + '" class="icon" style="background-color: #28a745 !important; display: block">' +
                    '<img style="width: 70px; height: 70px; object-fit: cover; border-radius: .25rem; margin: 0;" src="' + item.imgCondition + '" alt="">' +
                    '</div>' +
                    '<div class="info-box-content" style="padding-right: 0">' +
                    '<div class="d-flex justify-content-between">' +
                    '<span class="app-text">' + item.CodeCondition + '</span>' +
                    '<span class="app-text" style="padding-right: 0">' + item.date.substring(0, 11) + '</span>' +
                    '</div>' +
                    '<span class="app-text-number" style="padding-right: 0">' + item.NameCondition + '</span>' +
                    '</div>' +
                    '</div>'
                );
                // Tạo phần tử bao bọc với nút X
                const totalElement = $(
                    '<div style="padding-bottom: 13px; position: relative;" class="history-item" data-code="' + item.CodeCondition + '">' +
                    '<div class="close-icon">' +
                    '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16">' +
                    '<path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>' +
                    '</svg>' +
                    '</div>' +
                    '</div>'
                );

                // Thêm phần tử chính vào phần tử bao bọc
                totalElement.append(element);

                // Gắn sự kiện click cho nút X
                totalElement.find('.close-icon').on('click', function (e) {
                    e.stopPropagation(); // Ngăn chặn sự kiện click lan đến phần tử chính

                    // Hiển thị popup xác nhận
                    const confirmDelete = confirm(`Bạn có chắc chắn muốn xóa tủ điều khiển "${item.NameCondition}" khỏi phần lịch sử?`);
                    if (confirmDelete) {
                        totalElement.remove(); // Xóa phần tử nếu người dùng chọn "Có"
                        ConditionItems = ConditionItems.filter(i => i.CodeCondition !== item.CodeCondition);
                        localStorage.setItem('dataCondition', JSON.stringify(ConditionItems));
                        toastr.success(`tủ "${item.CodeCondition}" đã bị xóa!`);
                        if (ConditionItems.length == 0) {
                            showAddWorkStationButton(); // Ẩn nút nếu có ít nhất 1 phần tử
                        }
                    }
                });

                // Gắn sự kiện click cho phần tử chính
                element.on('click', function () {
                    HOMEOSAPP.CodeCondition = item.CodeCondition;
                    $("#loading-popup").show();
                    HOMEOSAPP.loadPage("https://central.homeos.vn/singlepage/workstation/src/pages/Control/control.html");
                });

                // Thêm phần tử vào danh sách lịch sử

                historyListDetail.append(totalElement);
            });
        }
    } else {
        warrantyItems = JSON.parse(localStorage.getItem('dataWarranty'));
        if (warrantyItems && warrantyItems.length > 0) {
            historyListDetail.empty()
            warrantyItems.forEach(item => {
                const element = $(
                    '<div class="iconApp">' +
                    '<div id="App' + item.CodeWarranty + '" class="icon" style="background-color: #28a745 !important; display: block">' +
                    '<img style="width: 70px; height: 70px; object-fit: cover; border-radius: .25rem; margin: 0;" src="' + item.imgWarranty + '" alt="">' +
                    '</div>' +
                    '<div class="info-box-content" style="padding-right: 0">' +
                    '<div class="d-flex justify-content-between">' +
                    '<span class="app-text">' + item.CodeWarranty + '</span>' +
                    '<span class="app-text" style="padding-right: 0">' + item.date.substring(0, 11) + '</span>' +
                    '</div>' +
                    '<span class="app-text-number" style="padding-right: 0">' + item.NameWarranty + '</span>' +
                    '</div>' +
                    '</div>'
                );
                // Tạo phần tử bao bọc với nút X
                const totalElement = $(
                    '<div style="padding-bottom: 13px; position: relative;" class="history-item" data-code="' + item.CodeWarranty + '">' +
                    '<div class="close-icon">' +
                    '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16">' +
                    '<path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>' +
                    '</svg>' +
                    '</div>' +
                    '</div>'
                );

                // Thêm phần tử chính vào phần tử bao bọc
                totalElement.append(element);

                // Gắn sự kiện click cho nút X
                totalElement.find('.close-icon').on('click', function (e) {
                    e.stopPropagation(); // Ngăn chặn sự kiện click lan đến phần tử chính

                    // Hiển thị popup xác nhận
                    const confirmDelete = confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${item.NameWarranty} [${item.CodeWarranty}]" khỏi phần lịch sử?`);
                    if (confirmDelete) {
                        totalElement.remove(); // Xóa phần tử nếu người dùng chọn "Có"
                        warrantyItems = warrantyItems.filter(i => i.CodeWarranty !== item.CodeWarranty);
                        localStorage.setItem('dataWarranty', JSON.stringify(warrantyItems));
                        toastr.success(`Trạm "${item.CodeWarranty}" đã bị xóa!`);
                        if (warrantyItems.length == 0) {
                            showAddWorkStationButton(); // Ẩn nút nếu có ít nhất 1 phần tử
                        }
                    }
                });

                // Gắn sự kiện click cho phần tử chính
                element.on('click', function () {
                    HOMEOSAPP.CodeWarranty = item.CodeWarranty;
                    HOMEOSAPP.loadPage("https://central.homeos.vn/singlepage/workstation/src/pages/Warranty/warranty.html");
                });

                // Thêm phần tử vào danh sách lịch sử

                historyListDetail.append(totalElement);
            });
        }
    }
    $("#history-value").removeClass("d-none");
    $("#history-loading").addClass("d-none");
}


checkHeight();
pickApp(HOMEOSAPP.application);