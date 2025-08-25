var html5QrCode;
var currentCameraIndex = 0;  // Index camera hiện tại
var devices = [];  // Danh sách các camera
var isScannerRunning = false;  // Biến theo dõi trạng thái quét
var currentCamera;
var typeQR;
var checkTab = false;
var dataCheckPermission;
var listLotProduct = $('#lot-warranty-detail');
$(".start").off("click").click(function () {
    const dataId = $(this).data("id");
    $("#result-form").addClass("d-none");
    if(HOMEOSAPP.checkTabHistory == 1){
        typeQR = HOMEOSAPP.checkTabHistory;
    } else if(HOMEOSAPP.checkTabHistory == 2 || HOMEOSAPP.checkTabHistory == 3){
        typeQR = 2;
    }
    if (dataId == 3) {
        const lotNumber = $("#lot-number").val();
        const classProduct = $("#classProduct").val().trim();
        const classProductNumber = $("#classProductNumber").val().trim();

        if (lotNumber === "0") {
            return toastr.error("Vui lòng chọn lô trước khi quét");
        }
        if (!classProduct) {
            return toastr.error("Vui lòng nhập Lớp sản phẩm!");
        }
        if (!classProductNumber || isNaN(classProductNumber) || Number(classProductNumber) <= 0) {
            return toastr.error("Vui lòng nhập số lượng cần quét hợp lệ (lớn hơn 0)!");
        }
    }

    if(dataId == 4){
        const type = $("#NoteExport").val();
        const priceRaw = $("#priceInput").val();
        const price = priceRaw.replace(/\D/g, ""); // chỉ lấy số
        const desc = $("#descExport").val().trim();

        if (type === "0") {
            toastr.error("Vui lòng chọn hình thức xuất bán!");
            return false;
        }

        if (!price) {
            toastr.error("Vui lòng nhập giá tiền!");
            return false;
        }

        if (!desc) {
            toastr.error("Vui lòng nhập ghi chú! Ví dụ: Sản phẩm được bán qua Shopee");
            return false;
        }
        typeQR = 4;
    }
    if(typeof window.ScanQR == "function"){
        ScanQRcodeByZalo();
    } else {
        startQRcode();
    }
});

$("#toggle-camera").off("click").click(function () {
    if (currentCameraIndex == devices.length) {
        currentCamera = 0
    } else {
        currentCameraIndex = (currentCameraIndex + 1) % devices.length; // Chuyển qua camera tiếp theo
    }
    if (currentCamera == "user") {
        startScan(devices[currentCameraIndex].id, 'environment'); // Bắt đầu quét với camera mới
    } else {
        startScan(devices[currentCameraIndex].id, 'user');
    }
});

$("#close-scanner").off("click").click(function () {
    if (isScannerRunning) {
        html5QrCode.stop().then(ignore => {
            isScannerRunning = false;  // Đánh dấu scanner đã dừng
            $('#qr-popup').hide() // Đóng popup
        }).catch(err => {
            console.error("Lỗi khi dừng quét QR: ", err);
        });
    } else {
        $('#qr-popup').hide() // Nếu không có quét đang chạy, chỉ đóng popup
    }
});

async function startScan(cameraId, cam) {
    currentCamera = cam;
    html5QrCode = new Html5Qrcode("qr-reader");
    html5QrCode.start(
        cameraId,
        {
            fps: 30,    // Số khung hình trên giây
            qrbox: { width: 250, height: 250 },  // Kích thước khung quét QR
            aspectRatio: 1.7, // Đặt tỉ lệ khung hình
            videoConstraints: {
                // width: { ideal: 3840 }, // Độ phân giải video 4k
                // height: { ideal: 2160 },
                width: { ideal: 1920 }, // Độ phân giải video 1080p
                height: { ideal: 1080 },
                // width: { ideal: 2560 }, // Độ phân giải video 2k 
                // height: { ideal: 1440 },
                facingMode: { exact: cam },
                advanced: [{ zoom: 2 }]
            }
        },
        onScanSuccess,
        onScanFailure
    ).then(() => {
        isScannerRunning = true;  // Đánh dấu scanner đang chạy
        setTimeout(() => {
            if (typeQR == 1) {
                $('#qr-shaded-region').css('border-width', '35vh 10vh');
                // $('#qr-shaded-region').attr('style', 'border-width: 35vh 10vh !important;');
            } else {
                $('#qr-shaded-region').css('border-width', '36vh 13vh');
                // $('#qr-shaded-region').attr('style', 'border-width: 40vh 15vh !important;');
            }
        }, 100);
    }).catch(err => {
        console.error("Lỗi khi khởi động camera: ", err);
    });

}

function startQRcode() {
    $("#result-form-total, #result-form-title").addClass("d-none");
    $("#result-form-loading, #result-form-stationID, #result-form-stationName").removeClass("d-none");
    $("#qr-popup").show();

    // Lấy danh sách camera và bắt đầu quét
    Html5Qrcode.getCameras().then(_devices => {
        devices = _devices; // Lưu lại danh sách camera
        if (devices && devices.length) {
            if (devices.length == 1) {
                startScan(devices[currentCameraIndex].id, "user");  // Bắt đầu quét với camera đầu tiên
            } else {
                startScan(devices[currentCameraIndex].id, "environment");
            }
        } else {
            console.error("Không tìm thấy thiết bị camera nào.");
        }
    }).catch(err => {
        console.error("Lỗi khi lấy danh sách camera: ", err);
    });
}

function getDataMDQRcode(QRcode) {

    // const url = "https://DEV.HOMEOS.vn/service/service.svc/";
    const url = "https://central.homeos.vn/service_XD/service.svc/";

    return new Promise((resolve, reject) => {
        $.ajax({
            url: url + "ApiServicePublic/" + "GetDataQRcode" + "/" + "QRCODEINPUT=" + QRcode,
            type: "GET",
            dataType: "jsonp",
            contentType: "application/json; charset=utf-8",
            success: function (msg) {
                try {
                    let state = JSON.parse(msg);
                    resolve(state); // Trả về dữ liệu khi thành công
                } catch (error) {
                    reject(error); // Bắt lỗi nếu JSON parse thất bại
                }
            },
            complete: function (data) {
                // Có thể thêm xử lý khi request hoàn thành ở đây nếu cần
            },
            error: function (e, t, x) {
                // document.getElementById("result-form").classList.remove("d-none");
                // document.getElementById("footer-instruct-scanQR").classList.remove("d-none");
                // toastr.error("Vui lòng quét đúng mã QR của trạm mưa");
                document.getElementById("result-form").classList.remove("d-none");
                // document.getElementById("footer-instruct-scanQR").classList.remove("d-none");
                document.getElementById("result-form-total").classList.remove("d-none");
                document.getElementById("result-condition").classList.add("d-none");
                document.getElementById("result-form-loading").classList.add("d-none");
                document.getElementById("result-form-title").classList.remove("d-none");
                document.getElementById("result-form-stationID").classList.add("d-none");
                document.getElementById("result-form-stationName").classList.add("d-none");
                document.getElementById("result-truycap").classList.add("d-none");
                toastr.error("Vui lòng quét đúng mã QR!");
            },
        });
    });
}

// Hàm xử lý khi quét thành công
async function onScanSuccess(decodedText, decodedResult) {
    ['result-form-total', 'result-product', 'result-condition'].forEach(id => document.getElementById(id).classList.add('d-none'));
    if (isScannerRunning) {
        html5QrCode.stop().then(ignore => {
            isScannerRunning = false;  // Đánh dấu scanner đã dừng
            document.getElementById("result-form").classList.remove("d-none");
        }).catch(err => {
            console.error("Lỗi khi dừng camera sau khi quét thành công: ", err);
        });
    } else {
        $("#qr-popup").show();
        document.getElementById("result-form").classList.remove("d-none");
    }
    const urlPattern = /^https?:\/\/[^\s/$.?#].[^\s]*$/i;
    let data;
    let domain;
    let workstation;
    let checkQRcode;

    if (urlPattern.test(decodedText)) {
        const urlObj = new URL(decodedText)
        const param = new URLSearchParams(urlObj.search);
        const paramObject = {};
        param.forEach((value, key) => {
            paramObject[key] = value;
        });
        console.log(paramObject);
        
        if(paramObject.CK){
            const dataQRcode = await HOMEOSAPP.getDM(
                "https://central.homeos.vn/service_XD/service.svc",
                "DM_QRCODE",
                "CK_CODE='"+paramObject.CK+"'"
            );
            console.log(dataQRcode);
            decodedText = dataQRcode.data[0].QR_CODE
            checkQRcode = dataQRcode.data[0].QR_CODE.split(',');
        } 
        // else if(paramObject.CID){
        //     decodedText = QRcode
        //     const workstationID = url.searchParams.get("workstationID");
        //     const QRcode = url.searchParams.get("QRcode");
        //     decodedText = QRcode
        //     console.log(decodedText);
        //     checkQRcode = QRcode.split(',');
        // }
        
    } else {
        checkQRcode = decodedText.split(',');
    }

    if (typeQR == 2 || typeQR == 3 ) {
        data = await getDataMDQRcode(decodedText.replaceAll(',', '$'));
        dataCheckPermission = data;
        if (data.length > 0 && checkQRcode.length == 3) {
            if (checkTab) {
                if (data[0].LOT_ID == 0) {
                    const dataQRCODE = await HOMEOSAPP.getDM("https://central.homeos.vn/service_XD/service.svc", "DM_QRCODE", "LOT_ID='" + $('#lot-number').val() + "' AND LOT_CLASS='" + $('#classProduct').val() + "'")
                    if (dataQRCODE.data.length < $('#classProductNumber').val()) {
                        const willInsertData = {
                            PR_KEY: data[0].PR_KEY,
                            CK_CODE: data[0].CK_CODE,
                            QR_CODE: decodedText,
                            MA_SAN_PHAM: checkQRcode[1],
                            LOT_ID: $('#lot-number').val(),
                            LOT_CLASS: $('#classProduct').val(),
                            DATE_CREATE: new Date(),
                            ACTIVATE_WARRANTY: new Date('1999-01-01 07:00:00.000'),
                            USER_ID: UserID,
                            DATASTATE: "EDIT",
                        };
                        HOMEOSAPP.add('DM_QRCODE', willInsertData);
                        toastr.success("Quét QR và lưu thông tin thành công!");
                    } else {
                        toastr.error("Lớp đã quét đủ vui lòng nhập lớp mới!");
                    }
                } else {
                    if (data[0].LOT_ID == $('#lot-number').val()) {
                        toastr.error("Sản phẩm đã tồn tại trong lô này!");
                    } else {
                        toastr.error("Sản phẩm đã thuộc 1 lô khác, vui lòng kiểm tra lại!");
                    }
                }
                scanAgain();
            } else {
                document.getElementById("result-product").classList.remove("d-none");
                document.getElementById("result-form-loading").classList.add("d-none");
                document.getElementById("result-form").classList.remove("d-none");
                document.getElementById("result-product-truycap").disabled = false;
                document.getElementById("result-form-productName").value = checkQRcode[1];
                document.getElementById("result-form-productCode").value = checkQRcode[2].substring(1);
            }
        } else if (checkQRcode.length == 4) {
            data = await HOMEOSAPP.getDataMDQRcode(decodedText.replaceAll(',', '$'));
            // const checkValue = dataLot.data.some(item => item.LOT_NUMBER == decodedText);
            if (data.length == 0) {
                const willInsertData = {
                    QR_CODE: decodedText,
                    MA_SAN_PHAM: checkQRcode[1],
                    DATE_CREATE: new Date(),
                    ACTIVATE_WARRANTY: new Date('1999-01-01 07:00:00.000'),
                    USER_ID: UserID,
                    DATASTATE: "ADD",
                };

                HOMEOSAPP.add('DM_QRCODE', willInsertData).then(async data => {
                    try {
                        toastr.success("Quét QR và lưu thông tin thành công!");
                        if (checkTab) {
                            scanAgain();
                        } else {
                            document.getElementById("result-condition").classList.remove("d-none");
                            document.getElementById("result-form-loading").classList.add("d-none");
                            document.getElementById("result-form").classList.remove("d-none");
                            // document.getElementById("footer-instruct-scanQR").classList.remove("d-none");
                            document.getElementById("result-condition-truycap").disabled = false;
                            document.getElementById("result-form-conditionName").value = checkQRcode[1];
                            document.getElementById("result-form-conditionCode").value = checkQRcode[3];
                            data = await HOMEOSAPP.getDataMDQRcode(decodedText.replaceAll(',', '$'));
                            localStorage.setItem("itemCondition", JSON.stringify(data));
                        }
                    } catch (e) { }
                }).catch(err => {
                    console.error('Error:', err);
                });
            } else {
                document.getElementById("result-condition").classList.remove("d-none");
                document.getElementById("result-form-loading").classList.add("d-none");
                document.getElementById("result-form").classList.remove("d-none");
                document.getElementById("result-condition-truycap").disabled = false;
                document.getElementById("result-form-conditionName").value = checkQRcode[1];
                document.getElementById("result-form-conditionCode").value = checkQRcode[3];
                localStorage.setItem("itemCondition", JSON.stringify(data));
            }
        } else {
            if (typeQR == 3 && checkQRcode[0].substring(0, 3) == "T20") {
                const dataQRCODE = await HOMEOSAPP.getDM("https://central.homeos.vn/service_XD/service.svc", "DM_QRCODE", "LOT_ID='" + $('#lot-number').val() + "' AND LOT_CLASS='" + $('#classProduct').val() + "'")
                if (dataQRCODE.data.length < $('#classProductNumber').val()) {
                    const willInsertData = {
                        QR_CODE: decodedText,
                        MA_SAN_PHAM: checkQRcode[1],
                        LOT_ID: $('#lot-number').val(),
                        LOT_CLASS: $('#classProduct').val(),
                        DATE_CREATE: new Date(),
                        ACTIVATE_WARRANTY: new Date('1999-01-01 07:00:00.000'),
                        USER_ID: UserID,
                        DATASTATE: "ADD",
                    };
                    await HOMEOSAPP.add('DM_QRCODE', willInsertData).then(async data => {
                        try {
                            toastr.success("Quét QR và lưu thông tin thành công!");
                            const dataEdit = await HOMEOSAPP.getDataMDQRcode(decodedText.replaceAll(',', '$'));
                            const willInsert = {
                                TYPE: "ADD",
                                ERROR_NAME: "Hoàn thành sản phẩm",
                                DESCRIPTION: "Nhập sản phẩm vào hệ thống",
                                DATE_CREATE: new Date(),
                                ERROR_STATUS: 0,
                                QRCODE_ID: dataEdit[0].PR_KEY,
                                USER_ID: UserID,
                                DATASTATE: "ADD",
                            };
                            await HOMEOSAPP.add('WARRANTY_ERROR', willInsert)
                            scanAgain();
                        } catch (e) { }
                    }).catch(err => {
                        console.error('Error:', err);
                    });

                } else {
                    toastr.error("Lớp đã quét đủ vui lòng nhập lớp mới!");
                    scanAgain();
                }
            } else {
                const dataLot = await HOMEOSAPP.getDM("https://central.homeos.vn/service_XD/service.svc", "WARRANTY_LOT", "1=1");
                const checkValue = dataLot.data.some(item => item.LOT_NUMBER == decodedText);
                if (checkValue) {
                    console.log(decodedText);
                } else if (checkQRcode[0].substring(0, 3) == "T20") {
                    const willInsertData = {
                        QR_CODE: decodedText,
                        MA_SAN_PHAM: checkQRcode[1],
                        DATE_CREATE: new Date(),
                        ACTIVATE_WARRANTY: new Date('1999-01-01 07:00:00.000'),
                        USER_ID: UserID,
                        DATASTATE: "ADD",
                    };
                    HOMEOSAPP.add('DM_QRCODE', willInsertData).then(async data => {
                        try {
                            toastr.success("Quét QR và lưu thông tin thành công!");
                            if (checkTab) {
                                scanAgain();
                            } else {
                                document.getElementById("result-product").classList.remove("d-none");
                                document.getElementById("result-form-loading").classList.add("d-none");
                                document.getElementById("result-form").classList.remove("d-none");
                                // document.getElementById("footer-instruct-scanQR").classList.remove("d-none");
                                document.getElementById("result-product-truycap").disabled = false;
                                document.getElementById("result-form-productName").value = checkQRcode[1];
                                document.getElementById("result-form-productCode").value = checkQRcode[2].substring(1);
                                data = await HOMEOSAPP.getDataMDQRcode(decodedText.replaceAll(',', '$'));
                                const willInsertData = {
                                    TYPE: "ADD",
                                    ERROR_NAME: "Hoàn thành sản phẩm",
                                    DESCRIPTION: "Nhập sản phẩm vào hệ thống",
                                    DATE_CREATE: new Date(),
                                    ERROR_STATUS: 0,
                                    QRCODE_ID: data[0].PR_KEY,
                                    USER_ID: UserID,
                                    DATASTATE: "ADD",
                                };
                                await HOMEOSAPP.add('WARRANTY_ERROR', willInsertData)
                            }
                        } catch (e) { }
                    }).catch(err => {
                        console.error('Error:', err);
                    });
                } else {
                    document.getElementById("result-form").classList.remove("d-none");
                    // document.getElementById("footer-instruct-scanQR").classList.remove("d-none");
                    document.getElementById("result-form-total").classList.remove("d-none");
                    document.getElementById("result-condition").classList.add("d-none");
                    document.getElementById("result-form-loading").classList.add("d-none");
                    document.getElementById("result-form-title").classList.remove("d-none");
                    document.getElementById("result-form-stationID").classList.add("d-none");
                    document.getElementById("result-form-stationName").classList.add("d-none");
                    document.getElementById("result-truycap").classList.add("d-none");
                    toastr.error("Vui lòng quét đúng mã QR!");
                }
            }
        }
    } else if(typeQR == 4){
        data = await getDataMDQRcode(decodedText.replaceAll(',', '$'));
        dataCheckPermission = data;
        console.log(data);
        
        if (data.length > 0 && checkQRcode.length == 3) {
            if (checkTab) {
                if (data[0].LOT_ID == 0) {
                    const dataWarrantyError = await HOMEOSAPP.getDM("https://central.homeos.vn/service_XD/service.svc", "WARRANTY_ERROR", "QRCODE_ID='" + data[0].PR_KEY + "'");
                    const hasExport = dataWarrantyError.data.some(item => item.ERROR_NAME === 'Xuất bán sản phẩm');
                    const type = $("#NoteExport").val();
                    const priceRaw = $("#priceInput").val();
                    const price = priceRaw.replace(/\D/g, ""); // chỉ lấy số
                    if (!hasExport) {
                        const willInsert = {
                            TYPE: "ADD",
                            ERROR_NAME: "Xuất bán sản phẩm",
                            DESCRIPTION: type,
                            DATE_CREATE: new Date(),
                            ERROR_STATUS: 0,
                            QRCODE_ID: data[0].PR_KEY,
                            PRICE_PRODUCT: price,
                            NOTE: $("#descExport").val(),
                            USER_ID: UserID,
                            DATASTATE: "ADD",
                        };
                        await HOMEOSAPP.add('WARRANTY_ERROR', willInsert)
                        toastr.success("Xác nhận xuất bán thành công!");
                        $("#close-scanner").click();
                    } else {
                        toastr.error("Sản phẩm đã được xuất bán!");
                    }
                } else {
                    if (data[0].LOT_ID == $('#lot-number').val()) {
                        toastr.error("Sản phẩm đã tồn tại trong lô này!");
                    } else {
                        toastr.error("Sản phẩm đã thuộc 1 lô khác, vui lòng kiểm tra lại!");
                    }
                }
            } else {
                document.getElementById("result-product").classList.remove("d-none");
                document.getElementById("result-form-loading").classList.add("d-none");
                document.getElementById("result-form").classList.remove("d-none");
                document.getElementById("result-product-truycap").disabled = false;
                document.getElementById("result-form-productName").value = checkQRcode[1];
                document.getElementById("result-form-productCode").value = checkQRcode[2].substring(1);
            }
        }
    } else {
        if (decodedText.length > 6) {
            var resultArray = decodedText.split("$");
            data = await HOMEOSAPP.getNewData(
                localStorage.getItem("MATRAM"),
                "WORKSTATION_ID='" + resultArray[1] + "'",
                resultArray[0]
            );
            localStorage.setItem("URL", resultArray[0]);
            workstation = resultArray[1];
            document.getElementById("result-form-total").classList.remove("d-none");
            document.getElementById("result-condition").classList.add("d-none");
            document.getElementById("result-form-loading").classList.add("d-none");
            document.getElementById("result-form").classList.remove("d-none");
            // document.getElementById("footer-instruct-scanQR").classList.remove("d-none");
        } else if (decodedText.length == 6) {
            domain = await getDomain(decodedText, 'domain');
            const url = "https://" + domain + "/service/service.svc/"
            data = await HOMEOSAPP.getNewData(
                localStorage.getItem("MATRAM"),
                "WORKSTATION_ID='" + decodedText + "'",
                url
            );
            localStorage.setItem("URL", url);
            workstation = decodedText;
            document.getElementById("result-form-total").classList.remove("d-none");
            document.getElementById("result-condition").classList.add("d-none");
            document.getElementById("result-form-loading").classList.add("d-none");
            document.getElementById("result-form").classList.remove("d-none");
            // document.getElementById("footer-instruct-scanQR").classList.remove("d-none");
        } else {
            document.getElementById("result-form-total").classList.remove("d-none");
            document.getElementById("result-condition").classList.add("d-none");
            document.getElementById("result-form-loading").classList.add("d-none");
            document.getElementById("result-form-title").classList.remove("d-none");
            document.getElementById("result-form-stationID").classList.add("d-none");
            document.getElementById("result-form-stationName").classList.add("d-none");
            document.getElementById("result-truycap").classList.add("d-none");
            toastr.error("Vui lòng quét đúng mã QR!");
        }

        if (data.data != []) {
            document.getElementById("result-truycap").disabled = false;
            matram = workstation;
            const value = await getDomain(workstation);
            document.getElementById("result-form-stationID").value = workstation;
            document.getElementById("result-form-stationName").value = value[0].WORKSTATION_NAME;
            document.getElementById("footer-stationName").textContent = workstation + " - " + value[0].WORKSTATION_NAME;
            checkCam = true;
            localStorage.setItem("MATRAM", workstation);
            toastr.success("Quét QR thành công");
        } else {
            document.getElementById("result-form-total").classList.remove("d-none");
            document.getElementById("result-condition").classList.add("d-none");
            document.getElementById("result-form-loading").classList.add("d-none");
            document.getElementById("result-form-title").classList.remove("d-none");
            document.getElementById("result-form-stationID").classList.add("d-none");
            document.getElementById("result-form-stationName").classList.add("d-none");
            document.getElementById("result-truycap").classList.add("d-none");
            toastr.error("Vui lòng quét đúng mã QR!");
        }
    }
}

// Hàm xử lý khi quét thất bại
function onScanFailure(error) {
    // Xử lý lỗi (nếu cần)
}

// Khi nhấn nút upload QR từ hình ảnh
$("#upload-qr").off("click").click(function () {
    $("#file-input").click();  // Mở hộp thoại chọn file
});

// Khi chọn file hình ảnh từ input
$("#file-input").change(function (event) {
    var file = event.target.files[0];  // Đảm bảo lấy file đúng
    if (file) {
        // Dừng quét camera trước khi quét file
        if (isScannerRunning) {
            html5QrCode.stop().then(function () {
                isScannerRunning = false;  // Đánh dấu scanner đã dừng
                var reader = new FileReader();
                reader.onload = function (e) {
                    var img = new Image();
                    img.onload = function () {
                        // Quét QR từ hình ảnh đã tải lên
                        html5QrCode.scanFile(file).then(async decodedText => {  // Sửa tại đây
                            document.getElementById("result-form").classList.remove("d-none");
                            const urlPattern = /^https?:\/\/[^\s/$.?#].[^\s]*$/i;
                            let data;
                            let domain;
                            let workstation;
                            let checkQRcode;
                            
                            if (urlPattern.test(decodedText)) {
                                const url = new URL(decodedText);
                                const workstationID = url.searchParams.get("workstationID");
                                const QRcode = url.searchParams.get("QRcode");
                                decodedText = QRcode
                                console.log(decodedText);
                                checkQRcode = QRcode.split(',');
                                console.log(checkQRcode);
                                
                            } else {
                                checkQRcode = decodedText.split(',');
                            }
                            
                            // document.getElementById("footer-instruct-scanQR").classList.remove("d-none");
                            

                            // if(checkQRcode[0].substring(0, 3) == "T20"){
                            if (typeQR == 2 || typeQR == 3) {
                                data = await HOMEOSAPP.getDataMDQRcode(decodedText.replaceAll(',', '$'));

                                if (checkQRcode.length == 3 && checkTab) {
                                    if (checkTab) {
                                        if (data[0].LOT_ID == 0) {
                                            const dataQRCODE = await HOMEOSAPP.getDM("https://central.homeos.vn/service_XD/service.svc", "DM_QRCODE", "LOT_ID='" + $('#lot-number').val() + "' AND LOT_CLASS='" + $('#classProduct').val() + "'")
                                            if (dataQRCODE.data.length < $('#classProductNumber').val()) {
                                                const willInsertData = {
                                                    PR_KEY: data[0].PR_KEY,
                                                    QR_CODE: decodedText,
                                                    MA_SAN_PHAM: checkQRcode[1],
                                                    LOT_ID: $('#lot-number').val(),
                                                    LOT_CLASS: $('#classProduct').val(),
                                                    DATE_CREATE: new Date(),
                                                    ACTIVATE_WARRANTY: new Date('1999-01-01 07:00:00.000'),
                                                    USER_ID: UserID,
                                                    DATASTATE: "EDIT",
                                                };
                                                HOMEOSAPP.add('DM_QRCODE', willInsertData);
                                                toastr.success("Quét QR và lưu thông tin thành công!");
                                            } else {
                                                toastr.error("Lớp đã quét đủ vui lòng nhập lớp mới!");
                                            }
                                        } else {
                                            if (data[0].LOT_ID == $('#lot-number').val()) {
                                                toastr.error("Sản phẩm đã tồn tại trong lô này!");
                                            } else {
                                                toastr.error("Sản phẩm đã thuộc 1 lô khác, vui lòng kiểm tra lại!");
                                            }
                                        }
                                        scanAgain()
                                    } else {
                                        document.getElementById("result-product").classList.remove("d-none");
                                        document.getElementById("result-form-loading").classList.add("d-none");
                                        document.getElementById("result-form").classList.remove("d-none");
                                        document.getElementById("result-product-truycap").disabled = false;
                                        document.getElementById("result-form-productName").value = checkQRcode[1];
                                        document.getElementById("result-form-productCode").value = checkQRcode[2].substring(1);
                                    }

                                } else if (checkQRcode.length == 4) {
                                    data = await HOMEOSAPP.getDataMDQRcode(decodedText.replaceAll(',', '$'));
                                    // const checkValue = dataLot.data.some(item => item.LOT_NUMBER == decodedText);
                                    if (data.length == 0) {
                                        const willInsertData = {
                                            QR_CODE: decodedText,
                                            MA_SAN_PHAM: checkQRcode[1],
                                            DATE_CREATE: new Date(),
                                            ACTIVATE_WARRANTY: new Date('1999-01-01 07:00:00.000'),
                                            USER_ID: UserID,
                                            DATASTATE: "ADD",
                                        };

                                        HOMEOSAPP.add('DM_QRCODE', willInsertData).then(async data => {
                                            try {
                                                toastr.success("Quét QR và lưu thông tin thành công!");
                                                if (checkTab) {
                                                    scanAgain();
                                                } else {
                                                    document.getElementById("result-condition").classList.remove("d-none");
                                                    document.getElementById("result-form-loading").classList.add("d-none");
                                                    document.getElementById("result-form").classList.remove("d-none");
                                                    // document.getElementById("footer-instruct-scanQR").classList.remove("d-none");
                                                    document.getElementById("result-condition-truycap").disabled = false;
                                                    document.getElementById("result-form-conditionName").value = checkQRcode[1];
                                                    document.getElementById("result-form-conditionCode").value = checkQRcode[3];
                                                    data = await HOMEOSAPP.getDataMDQRcode(decodedText.replaceAll(',', '$'));
                                                    localStorage.setItem("itemCondition", JSON.stringify(data));
                                                }
                                            } catch (e) { }
                                        }).catch(err => {
                                            console.error('Error:', err);
                                        });
                                    } else {
                                        document.getElementById("result-condition").classList.remove("d-none");
                                        document.getElementById("result-form-loading").classList.add("d-none");
                                        document.getElementById("result-form").classList.remove("d-none");
                                        // document.getElementById("footer-instruct-scanQR").classList.remove("d-none");
                                        document.getElementById("result-condition-truycap").disabled = false;
                                        document.getElementById("result-form-conditionName").value = checkQRcode[1];
                                        document.getElementById("result-form-conditionCode").value = checkQRcode[3];
                                        localStorage.setItem("itemCondition", JSON.stringify(data));
                                    }
                                } else {
                                    console.log(checkQRcode);
                                    if (typeQR == 3 && checkQRcode[0].substring(0, 3) == "T20") {
                                        const dataQRCODE = await HOMEOSAPP.getDM("https://central.homeos.vn/service_XD/service.svc", "DM_QRCODE", "LOT_ID='" + $('#lot-number').val() + "' AND LOT_CLASS='" + $('#classProduct').val() + "'")
                                        if (dataQRCODE.data.length < $('#classProductNumber').val()) {
                                            const willInsertData = {
                                                QR_CODE: decodedText,
                                                MA_SAN_PHAM: checkQRcode[1],
                                                LOT_ID: $('#lot-number').val(),
                                                LOT_CLASS: $('#classProduct').val(),
                                                DATE_CREATE: new Date(),
                                                ACTIVATE_WARRANTY: new Date('1999-01-01 07:00:00.000'),
                                                USER_ID: UserID,
                                                DATASTATE: "ADD",
                                            };
                                            await HOMEOSAPP.add('DM_QRCODE', willInsertData).then(async data => {
                                                try {
                                                    toastr.success("Quét QR và lưu thông tin thành công!");
                                                    const dataEdit = await HOMEOSAPP.getDataMDQRcode(decodedText.replaceAll(',', '$'));
                                                    const willInsert = {
                                                        TYPE: "ADD",
                                                        ERROR_NAME: "Hoàn thành sản phẩm",
                                                        DESCRIPTION: "Nhập sản phẩm vào hệ thống",
                                                        DATE_CREATE: new Date(),
                                                        ERROR_STATUS: 0,
                                                        QRCODE_ID: dataEdit[0].PR_KEY,
                                                        USER_ID: UserID,
                                                        DATASTATE: "ADD",
                                                    };
                                                    await HOMEOSAPP.add('WARRANTY_ERROR', willInsert)
                                                    scanAgain();
                                                } catch (e) { }
                                            }).catch(err => {
                                                console.error('Error:', err);
                                            });

                                        } else {
                                            toastr.error("Lớp đã quét đủ vui lòng nhập lớp mới!");
                                            scanAgain();
                                        }
                                    } else {
                                        const dataLot = await HOMEOSAPP.getDM("https://central.homeos.vn/service_XD/service.svc", "WARRANTY_LOT", "1=1")
                                        const checkValue = dataLot.data.some(item => item.LOT_NUMBER == decodedText);
                                        if (checkValue) {
                                            console.log(decodedText);
                                        } else if (checkQRcode[0].substring(0, 3) == "T20") {
                                            const willInsertData = {
                                                QR_CODE: decodedText,
                                                MA_SAN_PHAM: checkQRcode[1],
                                                DATE_CREATE: new Date(),
                                                ACTIVATE_WARRANTY: new Date('1999-01-01 07:00:00.000'),
                                                USER_ID: UserID,
                                                DATASTATE: "ADD",
                                            };
                                            HOMEOSAPP.add('DM_QRCODE', willInsertData).then(async data => {
                                                try {
                                                    toastr.success("Quét QR và lưu thông tin thành công!");
                                                    if (checkTab) {
                                                        scanAgain();
                                                    } else {
                                                        document.getElementById("result-product").classList.remove("d-none");
                                                        document.getElementById("result-form-loading").classList.add("d-none");
                                                        document.getElementById("result-form").classList.remove("d-none");
                                                        // document.getElementById("footer-instruct-scanQR").classList.remove("d-none");
                                                        document.getElementById("result-product-truycap").disabled = false;
                                                        document.getElementById("result-form-productName").value = checkQRcode[1];
                                                        document.getElementById("result-form-productCode").value = checkQRcode[2].substring(1);
                                                        data = await HOMEOSAPP.getDataMDQRcode(decodedText.replaceAll(',', '$'));
                                                        const willInsertData = {
                                                            TYPE: "ADD",
                                                            ERROR_NAME: "Hoàn thành sản phẩm",
                                                            DESCRIPTION: "Nhập sản phẩm vào hệ thống",
                                                            DATE_CREATE: new Date(),
                                                            ERROR_STATUS: 0,
                                                            QRCODE_ID: data[0].PR_KEY,
                                                            USER_ID: UserID,
                                                            DATASTATE: "ADD",
                                                        };
                                                        await HOMEOSAPP.add('WARRANTY_ERROR', willInsertData)
                                                    }
                                                } catch (e) { }
                                            }).catch(err => {
                                                console.error('Error:', err);
                                            });

                                        } else {
                                            document.getElementById("result-form").classList.remove("d-none");
                                            // document.getElementById("footer-instruct-scanQR").classList.remove("d-none");
                                            document.getElementById("result-form-total").classList.remove("d-none");
                                            document.getElementById("result-condition").classList.add("d-none");
                                            document.getElementById("result-form-loading").classList.add("d-none");
                                            document.getElementById("result-form-title").classList.remove("d-none");
                                            document.getElementById("result-form-stationID").classList.add("d-none");
                                            document.getElementById("result-form-stationName").classList.add("d-none");
                                            document.getElementById("result-truycap").classList.add("d-none");
                                            toastr.error("Vui lòng quét đúng mã QR!");
                                        }
                                    }

                                }
                            } else {

                                if (decodedText.length > 6) {
                                    var resultArray = decodedText.split("$");
                                    data = await HOMEOSAPP.getNewData(
                                        localStorage.getItem("MATRAM"),
                                        "WORKSTATION_ID='" + resultArray[1] + "'",
                                        resultArray[0]
                                    );
                                    localStorage.setItem("URL", resultArray[0]);
                                    workstation = resultArray[1];
                                    document.getElementById("result-form-total").classList.remove("d-none");
                                    document.getElementById("result-condition").classList.add("d-none");
                                    document.getElementById("result-form-loading").classList.add("d-none");
                                    document.getElementById("result-form").classList.remove("d-none");
                                    // document.getElementById("footer-instruct-scanQR").classList.remove("d-none");
                                } else if (decodedText.length == 6) {
                                    domain = await getDomain(decodedText, 'domain');
                                    const url = "https://" + domain + "/service/service.svc/"
                                    data = await HOMEOSAPP.getNewData(
                                        localStorage.getItem("MATRAM"),
                                        "WORKSTATION_ID='" + decodedText + "'",
                                        url
                                    );
                                    localStorage.setItem("URL", url);
                                    workstation = decodedText;
                                    document.getElementById("result-form-total").classList.remove("d-none");
                                    document.getElementById("result-condition").classList.add("d-none");
                                    document.getElementById("result-form-loading").classList.add("d-none");
                                    document.getElementById("result-form").classList.remove("d-none");
                                    // document.getElementById("footer-instruct-scanQR").classList.remove("d-none");
                                } else {
                                    document.getElementById("result-form-total").classList.remove("d-none");
                                    document.getElementById("result-condition").classList.add("d-none");
                                    document.getElementById("result-form-loading").classList.add("d-none");
                                    toastr.error("Vui lòng quét đúng mã QR!");
                                }


                                if (data != []) {

                                    document.getElementById("result-truycap").disabled = false;
                                    matram = workstation
                                    const value = await getDomain(workstation);
                                    document.getElementById("result-form-stationID").value = workstation;
                                    document.getElementById("result-form-stationName").value = value[0].WORKSTATION_NAME;
                                    document.getElementById("footer-stationName").textContent = workstation + " - " + value[0].WORKSTATION_NAME;
                                    checkCam = true;
                                    toastr.success("Quét QR thành công");
                                    localStorage.setItem("MATRAM", workstation);
                                }
                            }
                        }).catch(err => {
                            document.getElementById("result-form").classList.remove("d-none");
                            // document.getElementById("footer-instruct-scanQR").classList.remove("d-none");
                            document.getElementById("result-form-total").classList.remove("d-none");
                            document.getElementById("result-condition").classList.add("d-none");
                            document.getElementById("result-form-loading").classList.add("d-none");
                            document.getElementById("result-form-title").classList.remove("d-none");
                            document.getElementById("result-form-stationID").classList.add("d-none");
                            document.getElementById("result-form-stationName").classList.add("d-none");
                            document.getElementById("result-truycap").classList.add("d-none");
                            toastr.error("Vui lòng quét đúng mã QR!");
                        });
                    };
                    img.src = e.target.result;
                };
                reader.readAsDataURL(file);  // Đọc hình ảnh từ file
            }).catch(err => {
                console.error("Lỗi khi dừng camera: ", err);
            });
        } else {
            // Nếu không có scanner đang chạy, quét trực tiếp từ hình ảnh
            var reader = new FileReader();
            reader.onload = function (e) {
                var img = new Image();
                img.onload = function () {
                    html5QrCode.scanFile(file).then(decodedText => {
                        $("#result").text("Kết quả quét: " + decodedText); // Hiển thị kết quả
                    }).catch(err => {
                        $("#result").text("Không thể quét QR từ hình ảnh.");
                        console.error("Lỗi khi quét hình ảnh QR: ", err);
                    });
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);  // Đọc hình ảnh từ file
        }
    }
});

async function getDomain(workstationID, type) {
    return new Promise(async (resolve, reject) => {
        // var listDomain = ["thoitiet.ifee.edu.vn", "namdinh.homeos.vn", "kttvthaibinh.com.vn", "cctl-dongthap.homeos.vn", "angiang.homeos.vn", "pctthn.homeos.vn", "thanthongnhat.homeos.vn", "ninhbinh.homeos.vn"]
        var domain;
        var data;
        for (let i = 0; i < listDomain.length; i++) {
            data = await getDataStation(workstationID, listDomain[i]);

            if (data.length == 0 || data.length == undefined || data == null || data == '' || data == []) {
                domain = '';
            } else {
                domain = listDomain[i]
                break;
            }
        }
        if (type == "domain") {
            resolve(domain);
        } else {
            resolve(data);
        }
    });
}

async function getDomain(workstationID, type) {
    return new Promise(async (resolve, reject) => {
        // var listDomain = ["thoitiet.ifee.edu.vn", "namdinh.homeos.vn", "kttvthaibinh.com.vn", "cctl-dongthap.homeos.vn", "angiang.homeos.vn", "pctthn.homeos.vn", "thanthongnhat.homeos.vn", "ninhbinh.homeos.vn"]
        var domain;
        var data;
        
        for (let i = 0; i < HOMEOSAPP.listDomain.length; i++) {
            data = await getDataStation(workstationID, HOMEOSAPP.listDomain[i]);

            if (data.length == 0 || data.length == undefined || data == null || data == '' || data == []) {
                domain = '';
            } else {
                domain = HOMEOSAPP.listDomain[i]
                break;
            }
        }
        if (type == "domain") {
            resolve(domain);
        } else {
            resolve(data);
        }
    });
}

function getDataStation(workstationID, domain) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: `https://${domain}/Service/Service.svc/ApiServicePublic/GetDataWorkStation/WORKSTATION_ID='${workstationID}'`,
            type: "GET",
            dataType: "jsonp",
            contentType: "application/json; charset=utf-8",
            success: function (msg) {
                try {
                    const data = JSON.parse(msg);
                    if (Array.isArray(data) && data.length > 0) {
                        const item = {
                            CodeWorkStation: workstationID,
                            NameWorkStation: data[0].WORKSTATION_NAME,
                            domain: domain,
                            date: getCurrentTime(),
                            workstationType: data[0].TEMPLATE_TOOLTIP
                        };
                        HOMEOSAPP.itemHistory = item;
                        localStorage.setItem('itemHistory', JSON.stringify(item));
                    }
                    resolve(data);
                } catch (err) {
                    reject("Lỗi phân tích dữ liệu JSON: " + err);
                }
            },
            error: function (xhr, status, error) {
                reject(`Lỗi khi gọi API: ${status} - ${error}`);
            }
        });
    });
}

function getCurrentTime(time) {
    // Tạo đối tượng Date mới để lấy thời gian hiện tại
    let now;
    if (time) {
        now = new Date(time);
    } else {
        now = new Date();
    }

    const ngay = now.getDate(); // Ngày (1-31)
    const thang = now.getMonth() + 1; // Tháng (0-11) nên cần +1
    const nam = now.getFullYear(); // Năm (4 chữ số)
    // Lấy giờ, phút, giây
    const hours = now.getHours();   // Giờ (0-23)
    const minutes = now.getMinutes(); // Phút (0-59)
    const seconds = now.getSeconds(); // Giây (0-59)

    // Định dạng giờ thành dạng HH:MM:SS
    const chuoiNgay = `${ngay.toString().padStart(2, '0')}/${thang.toString().padStart(2, '0')}/${nam}`;
    const currentTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    // Hiển thị giờ hiện tại
    if (time) {
        document.getElementById("lateDateTime").textContent = chuoiNgay + " " + currentTime;
    }
    return chuoiNgay + " " + currentTime;
}

function openTab(evt, tabName) {
    $('.tab-content').removeClass('active');
    $('.tablinks').removeClass('active');
    $('#' + tabName).addClass('active');
    $(evt.currentTarget).addClass('active');
}

$("#truycap").off("click").click(function () {
    if(HOMEOSAPP.checkTabHistory == 1){
        getInputValue()
    } else if(HOMEOSAPP.checkTabHistory == 2){
        checkDevice();
    } else if(HOMEOSAPP.checkTabHistory == 3){
        checkDevice();
    }
});

async function checkDevice(type) {
    var inputValue;
    if(type == 'QRcodeControl'){
        inputValue = document.getElementById("result-form-conditionCode").value;
    } else if(type == 'QRcodeWarranty'){
        inputValue = document.getElementById("result-form-productCode").value;
    } else {
        inputValue = document.getElementById("device_name").value;
    }
    
    if (inputValue == null || inputValue == "") {
        toastr.error("Vui lòng nhập mã thiết bị!");
    } else {
        let dataDevice = [];
        const dataQRcode = await HOMEOSAPP.getDM("https://central.homeos.vn/service_XD/service.svc", "DM_QRCODE", "1=1")
        // const inputClean = inputValue.replace(/[^\d]/g, "");

        // const matchedItem = dataQRcode.data.find(item =>
        //     item.QR_CODE.split(",").pop().replace(/[^\d]/g, "").endsWith(inputClean) &&
        //     inputClean.length >= 6
        // );

        // Tách tiền tố và phần số
        const inputPrefix = inputValue.trim().charAt(0).toUpperCase();        
        const inputDigits = inputValue.trim().slice(1).replace(/\D/g, "");

        const matchedItem = dataQRcode.data.find(item => {
            // Luôn lấy phần cuối trong QR code
            const lastPart = item.QR_CODE.split(",").pop().trim(); // VD: S202508.0010
            const lastPrefix = lastPart.charAt(0).toUpperCase();  
            const lastDigits = lastPart.slice(1).replace(/\D/g, "");

            // Kiểm tra
            return (
                lastPrefix === inputPrefix &&        // Bắt buộc giống S/T
                inputDigits.length >= 6 &&           // đủ độ dài
                lastDigits.endsWith(inputDigits)     // cho phép nhập rút gọn
            );
        });
        console.log(matchedItem);
        
        if (matchedItem != undefined) {
            dataDevice.push(matchedItem);
        }
        if (dataDevice.length == 1) {
            if(HOMEOSAPP.checkTabHistory == 2){
                $("#loading-popup").show();
                let checkQRcode = dataDevice[0].QR_CODE.split(',');
                HOMEOSAPP.CodeCondition = checkQRcode[3];
                HOMEOSAPP.loadPage("https://central.homeos.vn/singlepage/workstation/src/pages/Control/control.html");
            } else if(HOMEOSAPP.checkTabHistory == 3){
                let checkQRcode = dataDevice[0].QR_CODE.split(',');
                
                const isAllowed = await HOMEOSAPP.checkPermissionDevice(dataDevice[0]);
                if (!isAllowed) return;
                $("#loading-popup").show();
                if(checkQRcode.length == 4){
                    HOMEOSAPP.CodeWarranty = checkQRcode[3];
                } else {
                    HOMEOSAPP.CodeWarranty = checkQRcode[2];
                }
                HOMEOSAPP.loadPage("https://central.homeos.vn/singlepage/workstation/src/pages/Warranty/warranty.html");
            }
        } else {
            toastr.error("Sản phẩm không tồn tại hoặc chưa được thêm vào hệ thống")
        }
    }
}

async function getInputValue(checkW) {
    var inputValue = document.getElementById("device_name").value;
    if(checkW){
        $("#loading-popup").show();
        CheckWorkStation(checkW);
    } else {
        if (inputValue == null || inputValue == "") {
            toastr.error("Vui lòng nhập mã trạm!");
        } else {
            $("#loading-popup").show()
            CheckWorkStation(inputValue)
        }
    }
}

async function CheckWorkStation(workstationID) {
    // var listDomain = ["thoitiet.ifee.edu.vn", "namdinh.homeos.vn", "kttvthaibinh.com.vn", "cctl-dongthap.homeos.vn", "angiang.homeos.vn", "pctthn.homeos.vn", "thanthongnhat.homeos.vn", "ninhbinh.homeos.vn"]
    var domain;
    var data;
    for (let i = 0; i < HOMEOSAPP.listDomain.length; i++) {
        data = await getDataStation(workstationID, HOMEOSAPP.listDomain[i]);

        if (data.length == 0 || data.length == undefined || data == null || data == '' || data == []) {
            domain = '';
        } else {
            domain = HOMEOSAPP.listDomain[i];
            break;
        }
    }
    if (domain == '') {
        toastr.error("Mã trạm không tồn tại");
        $('#loading-popup').hide()
    } else {
        localStorage.setItem("URL", "https://" + domain + "/Service/Service.svc");
        //$("#result").text("Kết quả quét: " + data[0].WORKSTATION_ID +"- Trạm:"+ data[0].WORKSTATION_NAME);
        // document.getElementById("footer-stationName").textContent = data[0].WORKSTATION_ID + " - " + data[0].WORKSTATION_NAME;
        localStorage.setItem("MATRAM", data[0].WORKSTATION_ID);
        toastr.success("Truy cập thành công!");
        HOMEOSAPP.loadPage("https://central.homeos.vn/singlepage/workstation/src/pages/KTTV/kttv.html");
    }
}

$("#result-scanagain").off("click").click(function () {
    document.getElementById("result-form-total").classList.add("d-none");
    document.getElementById("result-form-loading").classList.remove("d-none");
    document.getElementById("result-form-title").classList.add("d-none");
    document.getElementById("result-form-stationID").classList.remove("d-none");
    document.getElementById("result-form-stationName").classList.remove("d-none");
    document.getElementById("result-truycap").classList.remove("d-none");
    
    scanAgain();
});

$("#result-product-scanagain").off("click").click(function () {
    document.getElementById("result-form-total").classList.add("d-none");
    document.getElementById("result-form-loading").classList.remove("d-none");
    document.getElementById("result-form-title").classList.add("d-none");
    document.getElementById("result-form-stationID").classList.remove("d-none");
    document.getElementById("result-form-stationName").classList.remove("d-none");
    document.getElementById("result-truycap").classList.remove("d-none");
    
    scanAgain();
});



$("#BackPermission").off("click").click(function () {
    $("#qr-popup").show();
    $("#permission-popup").hide();
});

function scanAgain() {
    // document.getElementById("footer-instruct-scanQR").classList.add("d-none");
    document.getElementById("result-form").classList.add("d-none");
    document.getElementById("file-input").value = '';
    if(typeof window.ScanQR == "function"){
        ScanQRcodeByZalo();
    } else {
        startQRcode();
    }
}

async function ScanQRcodeByZalo() {
    const testDataScan = await window.ScanQR();
    if(testDataScan){
        onScanSuccess(testDataScan);
    }
}

async function addItemLotproduct() {
    const data = await HOMEOSAPP.getDM("https://central.homeos.vn/service_XD/service.svc", 'WARRANTY_LOT', "DELIVERY_DATE='1999-01-01 00:00:00.000'");
    listLotProduct.empty();
    data.data.forEach(item => {
        let element = '';
        const [dateALL, timeALL] = item.DATE_CREATE.split('T');
        element += '<div class="col-12" style="padding: 5px 10px;">' +
            '<div id="PickApp-button-mua" class="iconApp">' +
            '<div class="info-box-content">' +
            '<div class="d-flex justify-content-between">' +
            '<span class="app-text-number">' + item.LOT_NUMBER + '</span>' +
            '</div>' +
            '<span class="app-text">' + dateALL + ' ' + timeALL + '</span>' +
            '</div>' +
            '<button class="icon QRlot-button" style="background-color: #17a2b8; margin-right: 10px; box-shadow: 0 0 1px rgba(0, 0, 0, .125), 0 1px 3px rgba(0, 0, 0, .2); border: none; ">' +
            '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" style="color: #fff" fill="currentColor" class="bi bi-qr-code" viewBox="0 0 16 16">' +
            '<path d="M2 2h2v2H2z"/>' +
            '<path d="M6 0v6H0V0zM5 1H1v4h4zM4 12H2v2h2z"/>' +
            '<path d="M6 10v6H0v-6zm-5 1v4h4v-4zm11-9h2v2h-2z"/>' +
            '<path d="M10 0v6h6V0zm5 1v4h-4V1zM8 1V0h1v2H8v2H7V1zm0 5V4h1v2zM6 8V7h1V6h1v2h1V7h5v1h-4v1H7V8zm0 0v1H2V8H1v1H0V7h3v1zm10 1h-1V7h1zm-1 0h-1v2h2v-1h-1zm-4 0h2v1h-1v1h-1zm2 3v-1h-1v1h-1v1H9v1h3v-2zm0 0h3v1h-2v1h-1zm-4-1v1h1v-2H7v1z"/>' +
            '<path d="M7 12h1v3h4v1H7zm9 2v2h-3v-1h2v-1z"/>' +
            '</svg>' +
            '</button>' +
            '<button class="icon print-button" style="background-color: #17a2b8; box-shadow: 0 0 1px rgba(0, 0, 0, .125), 0 1px 3px rgba(0, 0, 0, .2); border: none; ">' +
            '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" style="color: #fff" fill="currentColor" class="bi bi-printer" viewBox="0 0 16 16">' +
            '<path d="M2.5 8a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1"/>' +
            '<path d="M5 1a2 2 0 0 0-2 2v2H2a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h1v1a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-1h1a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-1V3a2 2 0 0 0-2-2zM4 3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2H4zm1 5a2 2 0 0 0-2 2v1H2a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v-1a2 2 0 0 0-2-2zm7 2v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1"/>' +
            '</svg>' +
            '</button>' +
            '</div>' +
            '</div>'

        const $element = $(element);

        $element.find('.print-button').on('click', function (e) {
            e.preventDefault();
            generateVoucher(item);
        });

        $element.find('.QRlot-button').on('click', function (e) {
            e.preventDefault();
            generateLotQRCodes(item);
        });
        listLotProduct.append($element);
    });
}

async function generateLotQRCodes(item) {
    const newTab = window.open('', '_blank');
    if (!newTab || newTab.closed || typeof newTab.closed == 'undefined') {
        alert('Tab mới không thể mở. Vui lòng kiểm tra cài đặt popup của trình duyệt.');
        return;
    }

    let htmlContent = `
        <html>
        <head>
            <style>
                body {
                    text-align: center;
                    padding: 5px;
                }
                p{

                }
            </style>
        </head>
        <body>
            <div class="qr-grid">
                <h4>Khi nhận hàng sử dụng zalo miniapp</h4>
                <h4>HomeOS IoT Smart để xác nhận</h4>
    `;

    try {
        // Tạo QR code dưới dạng canvas
        const canvas = document.createElement('canvas');
        await QRCode.toCanvas(canvas, item.LOT_NUMBER, { width: 300 });

        // Chuyển canvas thành ảnh base64
        const image = canvas.toDataURL('image/png');

        // Thêm thẻ <img> chứa ảnh QR vào htmlContent
        htmlContent += `<img src="${image}" alt="QR Code">
            <p>${item.LOT_NUMBER}</p>
        `;

        // Chèn nội dung HTML vào tab mới
        newTab.document.write(htmlContent);
        newTab.document.close();

        // Thêm script để in sau khi nội dung được tải
        const script = newTab.document.createElement("script");
        script.textContent = "window.onload = function() { window.print(); }";
        newTab.document.body.appendChild(script);
    } catch (error) {
        console.error("Lỗi khi tạo mã QR:", error);
        alert('Lỗi khi tạo mã QR!');
    }
}

async function generateVoucher(item) {
    const data = await HOMEOSAPP.getDM("https://central.homeos.vn/service_XD/service.svc", "DM_QRCODE", "LOT_ID='" + item.PR_KEY + "'")
    let uniqueClasses = [...new Set(data.data.map(item => item.LOT_CLASS))];
    uniqueClasses.sort();

    const groupedData = uniqueClasses.map(cls => {
        return {
            LOT_CLASS: cls,
            items: data.data.filter(item => item.LOT_CLASS === cls)
        };
    });
    const newTab = window.open('', '_blank');
    if (!newTab || newTab.closed || typeof newTab.closed == 'undefined') {
        alert('Tab mới không thể mở. Vui lòng kiểm tra cài đặt popup của trình duyệt.');
        return;
    }
    let htmlContent = `
        <html>
        <head>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
            <style>
                body {
                    font-family: 'Times New Roman', Times, serif;
                }
                .header-logo {
                    width: 80px;
                }
                .table-bordered td, .table-bordered th {
                    vertical-align: middle;
                }
                .text-small {
                    font-size: 0.85rem;
                }
                .text-start {
                    font-size: 13px;
                }
            </style>
        </head>
        <body>
            <div class="my-4">
                <div class="row">
                    <div class="col-8 text-center">
                        <img src="https://homeos.com.vn/storage/photos/logo_1611367959_1716866836.webp" style="width: 150px;" alt="Logo" class="header-logo">
                        <p class="mt-2">
                            <strong>CÔNG TY CỔ PHẦN CÔNG NGHỆ HOMEOS VIỆT NAM</strong><br>
                            Địa chỉ: Số 24, Ngõ 22, Đường Kim Giang, Q. Thanh Xuân, TP Hà Nội
                        </p>
                    </div>
                    <div class="col-4 text-center" style="margin-top: 30px;">
                        <p class="text-small"><b>Mẫu số 02 - VT</b></p>
                        <p class="text-small">(Ban hành theo Thông tư số: 200/2014/TT-BTC ngày 22/12/2014 của Bộ Tài Chính)</p>
                    </div>
                </div>

                <div class="text-center my-4">
                    <h4><strong>PHIẾU XUẤT KHO</strong></h4>
                    <p class="text-small m-0"><b>(Kiêm bảo hành)</b></p>
                    <p class="m-0"><strong>Số phiếu: `+ item.LOT_NUMBER + `</strong></p>
                    <p class="m-0"><b><i>Ngày ... tháng ... năm 2025</i></b></p>
                </div>

                <p class="m-0" style="font-size: 14px;">- Họ và tên người nhận hàng: CÔNG TY TNHH ĐIỆN CÔNG NGHIỆP KHỞI MINH</p>
                <p class="m-0" style="font-size: 14px;">- Lý do xuất kho: Xuất bán</p>
                <p class="m-0" style="font-size: 14px;">- Xuất tại địa điểm: J04 - L02, An Phú Shop Villa, Dương Kinh, Hà Đông, Hà Nội.</p>

                <table class="table table-bordered text-center mt-2">
                    <thead>
                        <tr style="font-size: 14px;">
                            <th>STT</th>
                            <th>DANH MỤC HÀNG HÓA</th>
                            <th>ĐVT</th>
                            <th>SL</th>
                            <th style="width: 30px;">GHI CHÚ</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td colspan="5" style="text-align: start;"><b>Thiết bị rơ le an toàn phao nước</b></td>
                        </tr>
    `;
    for (let i = 0; i < groupedData.length; i++) {
        let danhMuc = '';
        let number = 0;
        groupedData[i].items.forEach(element => {
            number++;
            const checkQRcode = element.QR_CODE.split(',');

            if (number == groupedData[i].items.length) {
                danhMuc += checkQRcode[2].substring(3).replace(/\./g, "");
            } else {
                danhMuc += checkQRcode[2].substring(3).replace(/\./g, "") + ', ';
            }
        });
        htmlContent += `
        <tr>
            <td style="font-size: 15px;">`+ groupedData[i].LOT_CLASS + `</td>
            <td class="text-start">
                `+ danhMuc + `
            </td>
            <td style="font-size: 15px;">Bộ</td>
            <td style="font-size: 15px;">`+ groupedData[i].items.length + `</td>
            <td></td>
        </tr>
        `

    }
    htmlContent += `
        </tbody>
        </table>
        <p style="font-size: 14px;">Số chứng từ gốc kèm theo:.....................................................................................</p>
        <div class="row text-center" style="font-size: 14px;">
            <div class="col-3">
                <b>Người lập phiếu</b>
            </div>
            <div class="col-3">
                <b>Người nhận hàng</b>
            </div>
            <div class="col-3">
                <b>Thủ kho</b>
            </div>
            <div class="col-3">
                <b>Kế toán</b>
            </div>
        </div>
    `


    // Chèn nội dung HTML vào tab mới
    newTab.document.write(htmlContent);
    newTab.document.close();

    const script = newTab.document.createElement("script");
    script.textContent = "window.onload = function() { window.print(); }";
    const script1 = newTab.document.createElement("script");
    script1.src = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js";
    newTab.document.body.appendChild(script1);
    newTab.document.body.appendChild(script);
}

function formatVND(value) {
    if (!value) return "";
    return new Intl.NumberFormat('vi-VN').format(value) + " ₫";
}

function unformatVND(value) {
    return value.replace(/\D/g, "");
}

$("#result-truycap").off("click").click(function () {
    document.getElementById("result-truycap").disabled = true;
    $("#loading-popup").show();
    HOMEOSAPP.loadPage("https://central.homeos.vn/singlepage/workstation/src/pages/KTTV/kttv.html");
});

$("#result-condition-truycap").click(function () {
    document.getElementById("result-condition-truycap").disabled = true;
    $("#loading-popup").show();
    checkDevice("QRcodeControl")
});

$("#result-product-truycap").click(async function () {
    document.getElementById("result-product-truycap").disabled = true;
    const isAllowed = await HOMEOSAPP.checkPermissionDevice(dataCheckPermission[0]);
    if (!isAllowed) return;
    $("#loading-popup").show();
    checkDevice("QRcodeWarranty");
    HOMEOSAPP.checkTabWarranty = 1;
});

$("#warranty-permission").off("click").click(function () {
    document.getElementById("result-product-truycap").disabled = true;
    $("#loading-popup").show();
    checkDevice("QRcodeWarranty");
    HOMEOSAPP.checkTabWarranty = 2;
});

$("#PickApp-button-pick").off("click").click(function () {
    if(HOMEOSAPP.checkTabHistory == 2){
        HOMEOSAPP.handleControlApp("OUT");
    } else if(HOMEOSAPP.checkTabHistory == 3){
        HOMEOSAPP.handleWarrantyApp("OUT");
    } else {
        HOMEOSAPP.goBack();
    }
});

$("#tab-scan-qr").off("click").click(async function (event) {
    ['ScanQRcode', 'ScanAllQRcode', 'lotProduct'].forEach(id => document.getElementById(id).classList.add('d-none'));

    if(HOMEOSAPP.checkTabHistory == 1){
        $("#ScanQRcode").removeClass("d-none");
        if(HOMEOSAPP.workstationID && HOMEOSAPP.workstationID != "done"){
            openTab(event, 'tab1');
            getInputValue(HOMEOSAPP.workstationID);
            HOMEOSAPP.workstationID = "done";
        } else {
            openTab(event, 'tab1')
        }
    } else if(HOMEOSAPP.checkTabHistory == 2){
        $("#ScanQRcode").removeClass("d-none");
        document.getElementById("nameTabScan").textContent = "Thiết bị cần xem";
        document.getElementById("nameTabInput").textContent = "Mã thiết bị:";
        if(HOMEOSAPP.controlID && HOMEOSAPP.controlID != "done"){
            openTab(event, 'tab1');
            HOMEOSAPP.CodeCondition = HOMEOSAPP.controlID;
            HOMEOSAPP.loadPage("https://central.homeos.vn/singlepage/workstation/src/pages/Control/control.html");
            HOMEOSAPP.controlID = "done";
        } else {
            openTab(event, 'tab1')
        }
    } else if(HOMEOSAPP.checkTabHistory == 3){
        if(window.paramObjects.CK && window.paramObjects.CK != "done"){
            const dataQRcode = await HOMEOSAPP.getDM(
                "https://central.homeos.vn/service_XD/service.svc",
                "DM_QRCODE",
                "CK_CODE='"+window.paramObjects.CK+"'"
            );
            const lastPart = dataQRcode.data[0].QR_CODE.split(',').pop();
            console.log(window.paramObjects);
            
            const result = lastPart.replace('.', '');
            openTab(event, 'tab1');
            const isAllowed = await HOMEOSAPP.checkPermissionDevice(dataQRcode.data[0]);
            if (!isAllowed) return;
            HOMEOSAPP.CodeWarranty = result;
            HOMEOSAPP.loadPage("https://central.homeos.vn/singlepage/workstation/src/pages/Warranty/warranty.html");
            window.paramObjects.CK = "done";
            
        } else {
            switch (HOMEOSAPP.checkTabMenu) {
                case "DetailDevice":
                    $("#ScanQRcode").removeClass("d-none");
                    document.getElementById("nameTabScan").textContent = "Thiết bị cần xem";
                    document.getElementById("nameTabInput").textContent = "Mã thiết bị:";
                    openTab(event, 'tab1')
                    break;
                case "ScanLotDevice":
                    $("#ScanAllQRcode").removeClass("d-none");
                    $('#lot-number').empty();
                    const Data = await HOMEOSAPP.getDM("https://central.homeos.vn/service_XD/service.svc", 'WARRANTY_LOT', "DELIVERY_DATE='1999-01-01 00:00:00.000'");
                    const newOption = $('<option>', {
                        value: '0', // Giá trị của option
                        text: 'Chọn lô sản phẩm' // Nội dung hiển thị
                    });
                    // Thêm vào select
                    $('#lot-number').append(newOption);
                    Data.data.forEach(item => {
                        const newOption = $('<option>', {
                            value: item.PR_KEY, // Giá trị của option
                            text: item.LOT_NAME // Nội dung hiển thị
                        });
                        // Thêm vào select
                        $('#lot-number').append(newOption);
                    });
                    checkTab = true;
                    break;
                case "ManageDevice":
                    $("#lotProduct").removeClass("d-none");
                    addItemLotproduct();
                    break;
                default:
                    break;
            }
        }
        
    }
    $("#tabIndicator-Scan").css("left", "0%");
});

$("#tab-text").off("click").click(function (event) {
    openTab(event, 'tab2')
    $("#tabIndicator-Scan").css("left", "50%");
});

$("#tab-scan-export").off("click").click(function (event) {
    openTab(event, 'tabExport')
    $("#tabIndicator-export").css("left", "0%");
});

$("#tab-export-lot").off("click").click(function (event) {
    openTab(event, 'tabExportLot')
    $("#tabIndicator-export").css("left", "50%");
});

$(".money-input").off("input").on("input", function () {
    const numeric = unformatVND($(this).val());
    $(this).val(formatVND(numeric));
});

$(".money-input").off("focus").on("focus", function () {
    const numeric = unformatVND($(this).val());
    $(this).val(numeric);
});

$(".money-input").off("blur").on("blur", function () {
    const numeric = unformatVND($(this).val());
    if (numeric) {
        $(this).val(formatVND(numeric));
    }
});

$('#addLotProduct').off('click').on('click', async function () {
    $('#screen-addLot').addClass('active');

    $('#Prdouct-lot').empty();
    const Data = await HOMEOSAPP.getDM("https://central.homeos.vn/service_XD/service.svc", 'DM_PRODUCT', "ACTIVE=1");
    const newOption = $('<option>', {
        value: '0', // Giá trị của option
        text: 'Chọn sản phẩm cần tạo lô' // Nội dung hiển thị
    });
    // Thêm vào select
    $('#Prdouct-lot').append(newOption);
    Data.data.forEach(item => {
        const newOption = $('<option>', {
            value: item.PR_KEY, // Giá trị của option
            text: item.PRODUCT_NAME // Nội dung hiển thị
        });
        // Thêm vào select
        $('#Prdouct-lot').append(newOption);
    });
});

// Đóng màn mới khi nhấn nút X
$('#close-screen-addLot').off('click').on('click', function () {
    $('#screen-addLot').removeClass('active');
    
    // Sau khi ẩn, reset vị trí để chuẩn bị cho lần mở tiếp theo
    setTimeout(() => {
        $('#screen-addLot').removeClass('slide-out');
    }, 400);
});

$('#save-lotProduct').off('click').on('click', function () {
    const productSelect = document.getElementById("Prdouct-lot");
    const codeLotInput = document.getElementById("codeLot");
    const nameLotInput = document.getElementById("nameLot");

    const selectedProduct = productSelect.value.trim();
    const codeLot = codeLotInput.value.trim();
    const nameLot = nameLotInput.value.trim();

    // Kiểm tra sản phẩm
    if (selectedProduct === "0") {
      toastr.error("Vui lòng chọn sản phẩm cần tạo lô.");
      productSelect.focus();
      return;
    }

    // Kiểm tra mã lô sản phẩm
    if (codeLot === "") {
      toastr.error("Vui lòng nhập mã lô sản phẩm.");
      codeLotInput.focus();
      return;
    }

    // Kiểm tra tên lô sản phẩm
    if (nameLot === "") {
      toastr.error("Vui lòng nhập tên lô sản phẩm.");
      nameLotInput.focus();
      return;
    }

    console.log("Dữ liệu hợp lệ:", {
      productId: selectedProduct,
      codeLot,
      nameLot
    });

    const willInsertData = {
        PRODUCT_ID: selectedProduct,
        LOT_NUMBER: codeLot,
        LOT_NAME: nameLot,
        DATE_CREATE: new Date(Date.now() + 7 * 60 * 60 * 1000),
        USER_ID: UserID,
        DELIVERY_DATE: "1999-01-01 00:00:00.000",
        DATASTATE: "ADD",
    };
    HOMEOSAPP.add('WARRANTY_LOT', willInsertData).then(async data => {
        try {
            toastr.success("Thêm Lô hàng thành công.");
            $('#close-screen-addLot').click();
        } catch (e) { }
    }).catch(err => {
        console.error('Error:', err);
    });

    
});

$("#tab-scan-qr").click();