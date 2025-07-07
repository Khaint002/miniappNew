var html5QrCode;
var currentCameraIndex = 0;  // Index camera hiện tại
var devices = [];  // Danh sách các camera
var isScannerRunning = false;  // Biến theo dõi trạng thái quét
var currentCamera;
var listWarrantyHistory = $('#history-warranty-detail');

async function accessDeviceWarranty() {
    $('#qr-popup').hide();
    if(HOMEOSAPP.LeverPermission == 1){
        $("#isPermission").removeClass("d-none");
        $("#notPermission").addClass("d-none");
        if(window.followOA){
            window.followOA("oa1Widget", "Quan tâm để nhận các thông báo đến từ hệ thống!", "#343a40");
        }
    } else if(HOMEOSAPP.LeverPermission != 0) {
        $("#warranty-permission").addClass("d-none");
        if(HOMEOSAPP.LeverPermission == 3){
            $("#share-warranty").addClass("d-none");
            $("#errorWarranty").addClass("d-none");
        }
    } else {
        if(window.followOA){
            window.followOA("oaWidget", "Quan tâm để nhận các thông báo đến từ hệ thống!", "#343a40");
        }
    }
    if(HOMEOSAPP.checkTabWarranty == 1){
        $('#btn-tab1').click();
    } else if(HOMEOSAPP.checkTabWarranty == 2){
        $('#warranty-permission').click();
    }
    const inputValue = HOMEOSAPP.CodeWarranty;
    
    if (inputValue == null || inputValue == "") {
        toastr.error("Vui lòng nhập mã QRcode!");
    } else {
        let dataWarranty = [];
        const dataQRcode = await HOMEOSAPP.getDM(
            "https://central.homeos.vn/service_XD/service.svc",
            "DM_QRCODE",
            "1=1"
        );
        const inputClean = inputValue.replace(/[^\d]/g, "");

        const matchedItem = dataQRcode.data.find(item =>
            item.QR_CODE.split(",").pop().replace(/[^\d]/g, "").endsWith(inputClean) &&
            inputClean.length >= 6
        );

        if (matchedItem != undefined) {
            dataWarranty.push(matchedItem);
        }
        if (dataWarranty.length == 1) {
            if (HOMEOSAPP.CodeWarranty) {
                $("#loading-popup").show();
                let checkQRcode = dataWarranty[0].QR_CODE.split(',');
                const dataQRProduct = await HOMEOSAPP.getDataMDQRcode(dataWarranty[0].QR_CODE.replaceAll(',', '$'));
                console.log(dataQRProduct);
                
                document.getElementById("result-product").classList.remove("d-none");
                document.getElementById("result-form-loading").classList.add("d-none");
                document.getElementById("result-form").classList.remove("d-none");
                // document.getElementById("footer-instruct-scanQR").classList.remove("d-none");
                document.getElementById("result-product-truycap").disabled = false;
                document.getElementById("result-form-productName").value = checkQRcode[1];
                document.getElementById("result-form-productCode").value = checkQRcode[2].substring(1);
                if(checkQRcode.length == 4){
                    document.getElementById("header-productName").textContent = checkQRcode[1] + " - " + checkQRcode[3];
                } else {
                    document.getElementById("header-productName").textContent = checkQRcode[1] + " - " + checkQRcode[2].substring(1);
                }
                
                changeDataWarranty(dataQRProduct);
                DetailProduct();
            }
        } else {
            toastr.error("Sản phẩm không tồn tại hoặc chưa được thêm vào hệ thống");
        }
    }
}

async function changeDataWarranty(data) {
    const item = data[0];
    const qrParts = item.QR_CODE.split(',');
    
    // Lưu vào localStorage
    localStorage.setItem("productWarranty", JSON.stringify(data));
    
    // Đổ dữ liệu cơ bản
    document.getElementById('productName').textContent = "Tên sản phẩm: " + item.PRODUCT_NAME;
    document.getElementById('productCode').textContent = "Mã định danh: " + item.PRODUCT_CODE;
    
    document.getElementById("deviceImg").src = item.PRODUCT_IMG;
    // Hiển thị số seri
    const seri = (qrParts.length === 4) ? qrParts[3] : qrParts[2].substring(1);
    document.getElementById('productSeri').textContent = "Số seri: " + seri;
    if (seri) {
        document.getElementById('productCodeInput').value = seri;
        document.getElementById('productCodeInput').setAttribute("readonly", true);
    }
    let userLogin = JSON.parse(localStorage.getItem('UserLogin'));
    if(!userLogin){
        await HOMEOSAPP.handleLogin();
        userLogin = JSON.parse(localStorage.getItem('UserLogin'));
    }
    if (userLogin.USER_PHONE_NUM != null){
        console.log(userLogin.USER_PHONE_NUM);
        
        document.getElementById('phoneNumberInput').value = userLogin.USER_PHONE_NUM;
        document.getElementById('phoneNumberInput').setAttribute("readonly", true);
    } else if(window.getPhoneNum){
        const tokenPhone = await window.getPhoneNum();
        const token = await window.getUserAccessToken();
        dataPhone = await HOMEOSAPP.getPhoneNumberByUserZalo("https://central.homeos.vn/service_XD/service.svc", token, tokenPhone);
        document.getElementById('phoneNumberInput').value = dataPhone;
        document.getElementById('phoneNumberInput').setAttribute("readonly", true);
    }
    // Tính ngày bắt đầu bảo hành từ QR
    const warrantyStart = qrParts[0].substring(1, 5) + "-" + qrParts[0].substring(5, 7) + "-" + qrParts[0].substring(7, 9);
    
    // Tính thời gian còn lại
    const timeLeft = calculateWarrantyRemaining(item.DATE_CREATE, Number(item.TIME_WARRANTY));
    document.getElementById('warrantyTime').textContent = timeLeft;

    const isNotActivated = item.ACTIVATE_WARRANTY === "1999-01-01T00:00:00";

    if (isNotActivated) {
        document.getElementById('warrantyActive').textContent = "Chưa kích hoạt";
        document.getElementById('warrantyTimeActive').textContent = "";
        // document.getElementById('result-product-warranty').classList.remove("d-none");
    } else {
        const activatedDate = new Date(item.ACTIVATE_WARRANTY);
        const formattedDate = activatedDate.toISOString().split('T')[0]; // yyyy-mm-dd
        document.getElementById('warrantyActive').textContent = "Đã kích hoạt";
        document.getElementById('warrantyTimeActive').textContent = formattedDate;
        // document.getElementById('result-product-warranty').classList.add("d-none");
    }

    // Ghi log + lịch sử
    saveWarranty(data);
    addItemHistoryWarranty(item.PR_KEY, data);
}


function calculateWarrantyRemaining(startDate, timeWarranty) {
    const warrantyPeriodMonths = timeWarranty; // Thời gian bảo hành là 12 tháng

    // Chuyển ngày bắt đầu bảo hành sang đối tượng Date
    const startDateObj = new Date(startDate);
    // Ngày kết thúc bảo hành
    const warrantyEndDate = new Date(startDateObj);
    warrantyEndDate.setMonth(warrantyEndDate.getMonth() + warrantyPeriodMonths);

    // Ngày hiện tại
    const currentDate = new Date();

    // Tính thời gian còn lại
    if (currentDate > warrantyEndDate) {
        return "Thời gian bảo hành đã hết.";
    } else {
        // Tính tổng số tháng còn lại
        let totalMonthsRemaining =
            (warrantyEndDate.getFullYear() - currentDate.getFullYear()) * 12 +
            (warrantyEndDate.getMonth() - currentDate.getMonth());

        // Tính số ngày còn lại
        let daysRemaining = warrantyEndDate.getDate() - currentDate.getDate();

        // Điều chỉnh nếu số ngày âm
        if (daysRemaining < 0) {
            // Lấy số ngày của tháng trước
            const lastMonth = new Date(warrantyEndDate.getFullYear(), warrantyEndDate.getMonth(), 0);
            daysRemaining += lastMonth.getDate();
            totalMonthsRemaining -= 1;
        }
        // ${daysRemaining} ngày.
        return `Còn lại: ${totalMonthsRemaining} tháng`;
    }
}

function saveWarranty(data) {
    const DataQRcode = data[0].QR_CODE.split(',');
    let codeDevice;
    if(DataQRcode.length == 4){
        codeDevice = DataQRcode[3];
    } else {
        codeDevice = DataQRcode[2];
    }
    const itemW = {
        'CodeWarranty': codeDevice,
        'NameWarranty': data[0].PRODUCT_NAME,
        'imgWarranty': data[0].PRODUCT_IMG,
        'date': HOMEOSAPP.getCurrentTime()
    }

    waranntyItems = JSON.parse(localStorage.getItem('dataWarranty'));

    if (waranntyItems) {
        waranntyItems = waranntyItems.filter(item => item.CodeWarranty !== itemW.CodeWarranty);
        waranntyItems.unshift(itemW);
        if (waranntyItems.length > 20) {
            waranntyItems.shift();
        }
    } else {
        waranntyItems = [];
        waranntyItems.push(itemW);
    }

    localStorage.setItem('dataWarranty', JSON.stringify(waranntyItems));
}

async function addItemHistoryWarranty(QRID, dataQR) {
    const data = await HOMEOSAPP.getDM("https://central.homeos.vn/service_XD/service.svc", 'WARRANTY_ERROR', "QRCODE_ID='" + QRID + "'");
    const data_lot = await HOMEOSAPP.getDM("https://central.homeos.vn/service_XD/service.svc", 'WARRANTY_LOT', "PR_KEY='" + dataQR[0].LOT_ID + "'");
    let dataWarranty = data.data.filter(item => item.GROUP_ID === 0);
    let dataWarrantyGroup = data.data.filter(item => item.GROUP_ID !== 0);
    if (localStorage.getItem('RoleUser') == "GUEST") {
        dataWarranty = data.data.filter(item => item.TYPE !== "ADD");
    }
    if (dataWarranty.length > 0) {
        listWarrantyHistory.empty();
        for (let i = 0; i < dataWarranty.length; i++) {
            let element = '';
            const CheckGroupWarranty = dataWarrantyGroup.filter(item => item.GROUP_ID == dataWarranty[i].PR_KEY);
            let itemElement = '';
            const [dateALL, timeALL] = dataWarranty[i].DATE_CREATE.split('T');
            if (CheckGroupWarranty.length > 0) {
                for (let i = 0; i < CheckGroupWarranty.length; i++) {
                    const [date, time] = CheckGroupWarranty[i].DATE_CREATE.split('T');
                    let nameClass;
                    if (CheckGroupWarranty[i].ERROR_STATUS == 1) {
                        nameClass = 'badge-warning';
                    } else if (CheckGroupWarranty[i].ERROR_STATUS == 2) {
                        nameClass = 'badge-danger';
                    } else if (CheckGroupWarranty[i].ERROR_STATUS == 3) {
                        nameClass = 'badge-success';
                    }
                    itemElement += '<div class="vertical-timeline-item vertical-timeline-element">' +
                        '<div>' +
                        '<span class="vertical-timeline-element-icon bounce-in">' +
                        '<i class="badge badge-dot badge-dot-xl ' + nameClass + '"> </i>' +
                        '</span>' +
                        '<div class="vertical-timeline-element-content bounce-in">' +
                        '<h4 class="timeline-title">' + CheckGroupWarranty[i].ERROR_NAME + '</h4>' +
                        '<p>' + CheckGroupWarranty[i].DESCRIPTION + '</p>' +
                        '<span class="vertical-timeline-element-date">' + date + '</span>' +
                        '<span class="vertical-timeline-element-dateTime">' + time + '</span>' +
                        '</div>' +
                        '</div>' +
                        '</div>'
                }
            }

            if (dataWarranty[i].TYPE == "ERROR") {
                element += '<li class="parent-item">' +
                    '<button class="toggle-button">' +
                    '<div>' +
                    '<h5 style="margin: 0;">' +
                    '<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" style="color: #cd5757;" fill="currentColor" class="bi bi-exclamation-triangle" viewBox="0 0 16 16">' +
                    '<path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.15.15 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.2.2 0 0 1-.054.06.1.1 0 0 1-.066.017H1.146a.1.1 0 0 1-.066-.017.2.2 0 0 1-.054-.06.18.18 0 0 1 .002-.183L7.884 2.073a.15.15 0 0 1 .054-.057m1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767z"/>' +
                    '<path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z"/>' +
                    '</svg>' +
                    ' Bảo hành' +
                    '</h5>' +
                    '<p style="margin: 1px 0 0 0; font-size: 14px; font-weight: 300;">' + dataWarranty[i].ERROR_NAME + '</p>' +
                    '<p style="margin: 1px 0 0 0; font-size: 14px; font-weight: 300;">' + dateALL + ' ' + timeALL + '</p>' +
                    '</div>' +
                    '<span class="arrow-icon expanded" style="transform: rotate(90deg);">▶</span>' +
                    '</button>' +
                    '<ul class="child-list" style="display: none;">' +
                    '<div class="vertical-timeline vertical-timeline--animate vertical-timeline--one-column">' +
                    '<div class="vertical-timeline-item vertical-timeline-element">' +
                    '<div>' +
                    '<span class="vertical-timeline-element-icon bounce-in">' +
                    '<i class="badge badge-dot badge-dot-xl badge-warning"> </i>' +
                    '</span>' +
                    '<div class="vertical-timeline-element-content bounce-in">' +
                    '<h4 class="timeline-title">Báo lỗi sản phẩm</h4>' +
                    '<p>' + dataWarranty[i].DESCRIPTION + '</p>' +
                    '<span class="vertical-timeline-element-date">' + dateALL + '</span>' +
                    '<span class="vertical-timeline-element-dateTime">' + timeALL + '</span>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    itemElement +
                    '</div>' +
                    '</ul>' +
                    '</li>'
            } else {
                let textLotProduct = '';
                let textDesc = '';
                if (dataWarranty[i].TYPE == "ACTIVATE"){
                    textDesc ='<p style="margin: 1px 0 0 0; font-size: 14px; font-weight: 300;">' + dataWarranty[i].DESCRIPTION + '</p>'
                }
                if (data_lot?.data?.[0]?.LOT_NUMBER) {
                    textLotProduct = '<p style="margin: 1px 0 0 0; font-size: 14px; font-weight: 300;">Sản phẩm thuộc: ' + data_lot.data[0].LOT_NUMBER + '</p>';
                }
                element += '<li class="parent-item">' +
                    '<button class="toggle-button">' +
                    '<div>' +
                    '<h5 style="margin: 0;">' +
                    '<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" style="color: #27c527;" fill="currentColor" class="bi bi-check-circle" viewBox="0 0 16 16">' +
                    '<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>' +
                    '<path d="m10.97 4.97-.02.022-3.473 4.425-2.093-2.094a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05"/>' +
                    '</svg>' +
                    ' ' + dataWarranty[i].ERROR_NAME +
                    '</h5>' +
                    textDesc +
                    textLotProduct +
                    '<p style="margin: 1px 0 0 0; font-size: 14px; font-weight: 300;">' + dateALL + ' ' + timeALL + '</p>' +
                    '</div>' +
                    '</button>' +
                    '</li>'
            }
            const $element = $(element);

            $element.find('.toggle-button').on('click', function (e) {
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

            listWarrantyHistory.append($element);
        }
    }
}

function DetailProduct() {
    // document.getElementById("footer-instruct-scanQR").classList.add("d-none");
    document.getElementById("result-form").classList.add("d-none");
    document.getElementById("result-product").classList.add("d-none");
    $('#qr-popup').hide()
    document.getElementById("menu-warranty").classList.remove("d-none");
    $('#loading-popup').hide()
}

$('.bottom-navigation button').off("click").click(function () {
    value = $(this).data('tab');
    $('.bottom-navigation button').removeClass('menuWarranty');
    $(this).addClass('menuWarranty');
    $('.tab-content').removeClass('active');
    $('#tab-' + value).addClass('active');
});

$("#errorWarranty").off("click").click(function () {
    HOMEOSAPP.loadPage('error-popup');
});

$("#BackWarranty").off("click").click(function () {
    HOMEOSAPP.goBack();
    $("#errorInput").val("");
    $("#errorType").val("");
    $("#errorDesc").val("");
});

$("#submitError").click(function () {
    // Lấy giá trị từ các trường
    const errorInput = $("#errorInput").val();
    const errorType = $("#errorType").val();
    const errorDesc = $("#errorDesc").val();
    const dataWarranty = JSON.parse(localStorage.getItem("productWarranty"));
    const willInsertData = {
        TYPE: 'ERROR',
        ERROR_TYPE: errorType,
        ERROR_NAME: errorInput,
        DESCRIPTION: errorDesc,
        DATE_CREATE: new Date(),
        ERROR_STATUS: 1,
        QRCODE_ID: dataWarranty[0].PR_KEY,
        USER_ID: UserID,
        DATASTATE: "ADD",
    };
    HOMEOSAPP.add('WARRANTY_ERROR', willInsertData).then(async data => {
        try {
            toastr.success("Báo lỗi thành công!");
            addItemHistoryWarranty(dataWarranty[0].PR_KEY, dataWarranty);
            $("#BackWarranty").click();
        } catch (e) { }
    }).catch(err => {
        console.error('Error:', err);
    });
});

$('#result-product-warranty').click(function () {
    const dataWarranty = JSON.parse(localStorage.getItem("productWarranty"));
    const DataQRcode = dataWarranty[0].QR_CODE.split(',');
    const confirmActivate = confirm(`Xác nhận kích hoạt bảo hành của sản phẩm "${dataWarranty[0].PRODUCT_NAME}-${DataQRcode[2].substring(1)}" không?`);
    if (confirmActivate) {
        const willInsertData = {
            PR_KEY: dataWarranty[0].PR_KEY,
            QR_CODE: dataWarranty[0].QR_CODE,
            MA_SAN_PHAM: dataWarranty[0].MA_SAN_PHAM,
            DATE_CREATE: dataWarranty[0].DATE_CREATE,
            ACTIVATE_WARRANTY: new Date(),
            USER_ID: dataWarranty[0].USER_ID,
            DATASTATE: "EDIT",
        };
        
        HOMEOSAPP.add('DM_QRCODE', willInsertData).then(async data => {
            try {
                toastr.success("Kích hoạt bảo hành của sản phẩm thành công!");
                const InsertData = {
                    TYPE: "ACTIVATE",
                    ERROR_NAME: "Kích hoạt bảo hành",
                    DESCRIPTION: DataUser.name + " đã kích hoạt bảo hành sản phẩm",
                    DATE_CREATE: new Date(),
                    ERROR_STATUS: 0,
                    QRCODE_ID: dataWarranty[0].PR_KEY,
                    USER_ID: UserID,
                    DATASTATE: "ADD",
                };
                HOMEOSAPP.add('WARRANTY_ERROR', InsertData)

                data = await HOMEOSAPP.getDataMDQRcode(dataWarranty[0].QR_CODE.replaceAll(',', '$'));
                changeDataWarranty(data);
            } catch (e) { }
        }).catch(err => {
            console.error('Error:', err);
        });
    }
});

$(".WarrantyScanNext").off("click").click(function () {
    HOMEOSAPP.handleWarrantyApp();
});



// Gán sự kiện cho nút
document.getElementById("btnPermission").addEventListener("click", function () {
    const phoneInput = document.getElementById("phoneNumberInput");
    const phoneValue = phoneInput.value.trim();
    const productInput = document.getElementById("productCodeInput");
    const productValue = productInput.value.trim();
    if (!phoneValue) {
        alert("Vui lòng nhập số điện thoại.");
        phoneInput.focus();
        return;
    }

    // Nếu đã có dữ liệu, thực hiện xử lý tại đây
    savePermission(phoneValue, productValue); // gọi hàm xử lý
});

async function savePermission(phoneNumber, productValue) {
    try{
        const dataWarranty = JSON.parse(localStorage.getItem("productWarranty"));
        const DataUser = JSON.parse(localStorage.getItem("userInfo"));
        var P_KEY = HOMEOSAPP.sha1Encode(productValue + phoneNumber + "@1B2c3D4e5F6g7H8").toString()
        
        const InsertData = {
            PR_KEY_QRCODE: dataWarranty[0].PR_KEY,
            Z_USER_ID: DataUser.id,
            USER_PHONE_NUMBER: phoneNumber,
            P_KEY: P_KEY,
            DATE_CREATE: new Date(),
            OWNER_SHIP_LEVEL: 1,
            ACTIVE: 1,
            DATASTATE: "ADD",
        };

        await HOMEOSAPP.add('ZALO_OWNER_SHIP_DEVICE', InsertData);

        // Chỉ chạy sau khi add ZALO_OWNER_SHIP_DEVICE xong
        const willInsertData = {
            PR_KEY: dataWarranty[0].PR_KEY,
            QR_CODE: dataWarranty[0].QR_CODE,
            CK_CODE: dataWarranty[0].CK_CODE,
            MA_SAN_PHAM: dataWarranty[0].MA_SAN_PHAM,
            DATE_CREATE: dataWarranty[0].DATE_CREATE,
            ACTIVATE_WARRANTY: new Date(),
            USER_ID: dataWarranty[0].USER_ID,
            DATASTATE: "EDIT",
        };

        HOMEOSAPP.add('DM_QRCODE', willInsertData).then(async data => {
            try {
                toastr.success("Xác nhận chủ sở hữu và Kích hoạt bảo hành của sản phẩm thành công!");
                const InsertData = {
                    TYPE: "ACTIVATE",
                    ERROR_NAME: "Kích hoạt bảo hành và chủ sở hữu",
                    DESCRIPTION: DataUser.name + " đã kích hoạt",
                    DATE_CREATE: new Date(),
                    ERROR_STATUS: 0,
                    QRCODE_ID: dataWarranty[0].PR_KEY,
                    USER_ID: UserID,
                    DATASTATE: "ADD",
                };
                HOMEOSAPP.add('WARRANTY_ERROR', InsertData)

                data = await HOMEOSAPP.getDataMDQRcode(dataWarranty[0].QR_CODE.replaceAll(',', '$'));
                changeDataWarranty(data);
                $('#btn-tab1').click();
                $("#isPermission").removeClass("d-none");
                $("#notPermission").addClass("d-none");
            } catch (e) { }
        }).catch(err => {
            console.error('Error:', err);
        });
    } catch (e) {
        console.error("Error during activation:", e);
    }
}

$("#share-warranty").off("click").click(function () {
    // Hiển thị popup với hiệu ứng modal
    $("#tab-permission-admin").click();
    const dataWarranty = JSON.parse(localStorage.getItem("productWarranty"));
    console.log(dataWarranty);
    let textAdmin;
    let textGuest;
    HOMEOSAPP.loadPage("share-warranty-popup");

    // Xóa nội dung mã QR cũ
    $('#qrcode').empty();

    const qrParts = dataWarranty[0].QR_CODE.split(',');
    let codeProduct;
    if(qrParts.length == 4){
        codeProduct = qrParts[3];
    } else {
        codeProduct = qrParts[2].substring(1)
    }
    if(dataWarranty[0].CK_CODE != ''){
        textAdmin = "https://zalo.me/s/4560528012046048397/?Q=ADMIN&CK="+dataWarranty[0].CK_CODE;
        textGuest = "https://zalo.me/s/4560528012046048397/?Q=GUEST&CK="+dataWarranty[0].CK_CODE;
    }
    
    console.log(textAdmin);
    
    document.getElementById("text-content-warranty").textContent = dataWarranty[0].PRODUCT_CODE + " - " + codeProduct;
    // Tạo mã QR
    HOMEOSAPP.generateQRCode(textAdmin, "qrcode-admin");
    HOMEOSAPP.generateQRCode(textGuest, "qrcode-guest");
});

$("#tab-permission-admin").off("click").click(function (event) {
    openTab(event, 'tab-admin')
    $("#tabIndicator-warranty").css("left", "0%");
});

$("#tab-permission-guest").off("click").click(function (event) {
    openTab(event, 'tab-guest')
    $("#tabIndicator-warranty").css("left", "50%");
});

$("#BackShareWarranty").off("click").click(function () {
    const modal = document.getElementById("share-warranty-popup");
    modal.classList.add("closing");
    setTimeout(() => {
        modal.classList.remove("closing");
        HOMEOSAPP.goBack();
        $('#btn-tab1').click();
    }, 300);
});

function openTab(evt, tabName) {
    $('.tab-content').removeClass('active');
    $('.tablinks').removeClass('active');
    $('#' + tabName).addClass('active');
    $(evt.currentTarget).addClass('active');
}

$("#share-warranty-admin").off("click").click(function () {
    const dataWarranty = JSON.parse(localStorage.getItem("productWarranty"));
    console.log(dataWarranty);
    
    if(window.shareWorkStation){
        window.shareWorkStation("Sản phẩm "+ dataWarranty[0].PRODUCT_NAME, dataWarranty[0].PRODUCT_IMG, "Q=ADMIN&CK="+dataWarranty[0].CK_CODE);
    }
});

$("#share-warranty-guest").off("click").click(function () {
    const dataWarranty = JSON.parse(localStorage.getItem("productWarranty"));
    if(window.shareWorkStation){
        window.shareWorkStation("Sản phẩm "+ dataWarranty[0].PRODUCT_NAME, dataWarranty[0].PRODUCT_IMG, "Q=GUEST&CK="+dataWarranty[0].CK_CODE);
    }
});

accessDeviceWarranty();