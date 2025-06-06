var html5QrCode;
var currentCameraIndex = 0;  // Index camera hiện tại
var devices = [];  // Danh sách các camera
var isScannerRunning = false;  // Biến theo dõi trạng thái quét
var currentCamera;

$(".start").click(function () {
    const dataId = $(this).data("id");
    $("#result-form").addClass("d-none");
    console.log(dataId);
    typeQR = dataId;

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

    startQRcode();
});

$("#toggle-camera").click(function () {
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

$("#close-scanner").click(function () {
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
    // Hiển thị kết quả trên trang chính
    //$("#result").text("Kết quả quét: " + decodedText);

    html5QrCode.stop().then(ignore => {
        isScannerRunning = false;  // Đánh dấu scanner đã dừng
        document.getElementById("result-form").classList.remove("d-none");
        // document.getElementById("footer-instruct-scanQR").classList.remove("d-none");
    }).catch(err => {
        console.error("Lỗi khi dừng camera sau khi quét thành công: ", err);
    });
    let data;
    let domain;
    let workstation;
    let checkQRcode = decodedText.split(',');
    if (typeQR == 2 || typeQR == 3) {
        data = await getDataMDQRcode(decodedText.replaceAll(',', '$'));
        if (data.length > 0 && checkQRcode.length == 3) {
            if (checkTab) {
                if (data[0].LOT_ID == 0) {
                    const dataQRCODE = await getDM("https://central.homeos.vn/service_XD/service.svc", "DM_QRCODE", "LOT_ID='" + $('#lot-number').val() + "' AND LOT_CLASS='" + $('#classProduct').val() + "'")
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
                scanAgain();
            } else {
                document.getElementById("result-product").classList.remove("d-none");
                document.getElementById("result-form-loading").classList.add("d-none");
                document.getElementById("result-form").classList.remove("d-none");
                // document.getElementById("footer-instruct-scanQR").classList.remove("d-none");
                document.getElementById("result-product-truycap").disabled = false;
                document.getElementById("result-form-productName").value = checkQRcode[1];
                document.getElementById("result-form-productCode").value = checkQRcode[2].substring(1);
                document.getElementById("header-productName").textContent = checkQRcode[1] + " - " + checkQRcode[2].substring(1);
                changeDataWarranty(data);
            }

        } if (checkQRcode.length == 4) {
            data = await getDataMDQRcode(decodedText.replaceAll(',', '$'));
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
                console.log(willInsertData);

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
                            document.getElementById("header-conditionName").textContent = data[0].PRODUCT_NAME + "[" + checkQRcode[3] + "]";
                            data = await getDataMDQRcode(decodedText.replaceAll(',', '$'));
                            localStorage.setItem("itemCondition", JSON.stringify(data));
                        }
                    } catch (e) { }
                }).catch(err => {
                    console.error('Error:', err);
                });
            } else {
                console.log(data);
                document.getElementById("result-condition").classList.remove("d-none");
                document.getElementById("result-form-loading").classList.add("d-none");
                document.getElementById("result-form").classList.remove("d-none");
                // document.getElementById("footer-instruct-scanQR").classList.remove("d-none");
                document.getElementById("result-condition-truycap").disabled = false;
                document.getElementById("result-form-conditionName").value = checkQRcode[1];
                document.getElementById("result-form-conditionCode").value = checkQRcode[3];
                document.getElementById("header-conditionName").textContent = data[0].PRODUCT_NAME + "[" + checkQRcode[3] + "]";
                localStorage.setItem("itemCondition", JSON.stringify(data));
            }
        } else {
            if (typeQR == 3 && checkQRcode[0].substring(0, 3) == "T20") {
                const dataQRCODE = await getDM("https://central.homeos.vn/service_XD/service.svc", "DM_QRCODE", "LOT_ID='" + $('#lot-number').val() + "' AND LOT_CLASS='" + $('#classProduct').val() + "'")
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
                            const dataEdit = await getDataMDQRcode(decodedText.replaceAll(',', '$'));
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
                console.log();
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
                                document.getElementById("header-productName").textContent = checkQRcode[1] + " - " + checkQRcode[2].substring(1);
                                data = await getDataMDQRcode(decodedText.replaceAll(',', '$'));
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
                                changeDataWarranty(data);
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
$("#upload-qr").click(function () {
    $("#file-input").click();  // Mở hộp thoại chọn file
});

// Khi chọn file hình ảnh từ input
$("#file-input").change(function (event) {
    var file = event.target.files[0];  // Đảm bảo lấy file đúng
    if (file) {
        // Dừng quét camera trước khi quét file
        console.log('test');
        
        if (isScannerRunning) {
            html5QrCode.stop().then(function () {
                isScannerRunning = false;  // Đánh dấu scanner đã dừng
                var reader = new FileReader();
                reader.onload = function (e) {
                    var img = new Image();
                    img.onload = function () {
                        console.log('oke');
                        
                        // Quét QR từ hình ảnh đã tải lên
                        html5QrCode.scanFile(file).then(async decodedText => {  // Sửa tại đây
                            console.log(decodedText);
                            document.getElementById("result-form").classList.remove("d-none");
                            // document.getElementById("footer-instruct-scanQR").classList.remove("d-none");
                            let data;
                            let domain;
                            let workstation;
                            let checkQRcode = decodedText.split(',');
                            console.log(1);
                            
                            // if(checkQRcode[0].substring(0, 3) == "T20"){
                            if (typeQR == 2 || typeQR == 3) {
                                console.log(2);
                                data = await getDataMDQRcode(decodedText.replaceAll(',', '$'));
                                console.log(data);

                                if (data.length > 0) {
                                    if (checkTab) {
                                        if (data[0].LOT_ID == 0) {
                                            const dataQRCODE = await getDM("https://central.homeos.vn/service_XD/service.svc", "DM_QRCODE", "LOT_ID='" + $('#lot-number').val() + "' AND LOT_CLASS='" + $('#classProduct').val() + "'")
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
                                        // document.getElementById("footer-instruct-scanQR").classList.remove("d-none");
                                        document.getElementById("result-product-truycap").disabled = false;
                                        document.getElementById("result-form-productName").value = checkQRcode[1];
                                        document.getElementById("result-form-productCode").value = checkQRcode[2].substring(1);
                                        document.getElementById("header-productName").textContent = checkQRcode[1] + " - " + checkQRcode[2].substring(1);
                                        changeDataWarranty(data);
                                    }

                                } if (checkQRcode.length == 4) {
                                    data = await getDataMDQRcode(decodedText.replaceAll(',', '$'));
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
                                        console.log(willInsertData);

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
                                                    document.getElementById("header-conditionName").textContent = data[0].PRODUCT_NAME + "[" + checkQRcode[3] + "]";
                                                    data = await getDataMDQRcode(decodedText.replaceAll(',', '$'));
                                                    localStorage.setItem("itemCondition", JSON.stringify(data));
                                                }
                                            } catch (e) { }
                                        }).catch(err => {
                                            console.error('Error:', err);
                                        });
                                    } else {
                                        console.log(data);
                                        document.getElementById("result-condition").classList.remove("d-none");
                                        document.getElementById("result-form-loading").classList.add("d-none");
                                        document.getElementById("result-form").classList.remove("d-none");
                                        // document.getElementById("footer-instruct-scanQR").classList.remove("d-none");
                                        document.getElementById("result-condition-truycap").disabled = false;
                                        document.getElementById("result-form-conditionName").value = checkQRcode[1];
                                        document.getElementById("result-form-conditionCode").value = checkQRcode[3];
                                        document.getElementById("header-conditionName").textContent = data[0].PRODUCT_NAME + "[" + checkQRcode[3] + "]";
                                        localStorage.setItem("itemCondition", JSON.stringify(data));
                                    }
                                } else {
                                    if (typeQR == 3 && checkQRcode[0].substring(0, 3) == "T20") {
                                        console.log(1);

                                        const dataQRCODE = await getDM("https://central.homeos.vn/service_XD/service.svc", "DM_QRCODE", "LOT_ID='" + $('#lot-number').val() + "' AND LOT_CLASS='" + $('#classProduct').val() + "'")
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
                                                    const dataEdit = await getDataMDQRcode(decodedText.replaceAll(',', '$'));
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
                                            console.log(2);

                                        } else {
                                            toastr.error("Lớp đã quét đủ vui lòng nhập lớp mới!");
                                            scanAgain();
                                            console.log(1);
                                        }
                                    } else {
                                        const dataLot = await getDM("https://central.homeos.vn/service_XD/service.svc", "WARRANTY_LOT", "1=1")
                                        console.log(dataLot);
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
                                                        document.getElementById("header-productName").textContent = checkQRcode[1] + " - " + checkQRcode[2].substring(1);
                                                        data = await getDataMDQRcode(decodedText.replaceAll(',', '$'));
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
                                                        changeDataWarranty(data);
                                                    }
                                                } catch (e) { }
                                            }).catch(err => {
                                                console.error('Error:', err);
                                            });
                                            console.log(2);

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
                                console.log(3);

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
        console.log(HOMEOSAPP.listDomain);
        
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

$("#truycap").click(function () {
    getInputValue()
});

async function getInputValue(checkW) {
    var inputValue = document.getElementById("device_name").value;
    if(checkW){
        console.log(checkW);
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
        HOMEOSAPP.loadPage("https://miniapp-new.vercel.app/src/pages/KTTV/kttv.html");
    }
}

$("#result-scanagain").click(function () {
    document.getElementById("result-form-total").classList.add("d-none");
    document.getElementById("result-form-loading").classList.remove("d-none");
    document.getElementById("result-form-title").classList.add("d-none");
    document.getElementById("result-form-stationID").classList.remove("d-none");
    document.getElementById("result-form-stationName").classList.remove("d-none");
    document.getElementById("result-truycap").classList.remove("d-none");
    scanAgain();
});

function scanAgain() {
    console.log("scan2");
    // document.getElementById("footer-instruct-scanQR").classList.add("d-none");
    document.getElementById("result-form").classList.add("d-none");
    document.getElementById("file-input").value = '';
    startQRcode();
}

$("#result-truycap").click(function () {
    document.getElementById("result-truycap").disabled = true;
    $("#loading-popup").show();
    HOMEOSAPP.loadPage("https://miniapp-new.vercel.app/src/pages/KTTV/kttv.html");
});

$("#PickApp-button-pick").click(function () {
    HOMEOSAPP.goBack();
});

$("#tab-scan-qr").click(function (event) {
    if(window.workstationID && window.workstationID != "done"){
        openTab(event, 'tab1');
        getInputValue(window.workstationID);
        window.workstationID = "done";
    } else {
        openTab(event, 'tab1')
    }
    
});
$("#tab-text").click(function (event) {
    openTab(event, 'tab2')
});
$("#tab-scan-qr").click();