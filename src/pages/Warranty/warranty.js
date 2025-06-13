var listWarrantyHistory = $('#history-warranty-detail');

async function accessDeviceWarranty() {
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
        const matchedItem = dataQRcode.data.find(
            (item) =>
                item.QR_CODE.slice(-inputValue.length).replace(/\./g, "") ===
                inputValue.replace(/\./g, "")
        );
        if (matchedItem != undefined) {
            dataWarranty.push(matchedItem);
        }
        if (dataWarranty.length == 1) {
            if (HOMEOSAPP.CodeWarranty) {
                $("#loading-popup").show();
                let checkQRcode = dataWarranty[0].QR_CODE.split(',');
                const dataQRProduct = await HOMEOSAPP.getDataMDQRcode(dataWarranty[0].QR_CODE.replaceAll(',', '$'));
                document.getElementById("result-product").classList.remove("d-none");
                document.getElementById("result-form-loading").classList.add("d-none");
                document.getElementById("result-form").classList.remove("d-none");
                // document.getElementById("footer-instruct-scanQR").classList.remove("d-none");
                document.getElementById("result-product-truycap").disabled = false;
                document.getElementById("result-form-productName").value = checkQRcode[1];
                document.getElementById("result-form-productCode").value = checkQRcode[2].substring(1);
                document.getElementById("header-productName").textContent = checkQRcode[1] + " - " + checkQRcode[2].substring(1);
                changeDataWarranty(dataQRProduct);
                DetailProduct();
            }
        } else {
            toastr.error("Sản phẩm không tồn tại hoặc chưa được thêm vào hệ thống");
        }
    }
}

function changeDataWarranty(data) {
    let DataQRcode = data[0].QR_CODE.split(',');
    localStorage.setItem("productWarranty", JSON.stringify(data));
    const dataWarranty = JSON.parse(localStorage.getItem("productWarranty"));
    console.log(dataWarranty);
    document.getElementById('productName').textContent = "Tên sản phẩm: " + data[0].PRODUCT_NAME;
    document.getElementById('productCode').textContent = "Mã định danh: " + data[0].PRODUCT_CODE;
    document.getElementById('productSeri').textContent = "Số seri: " + DataQRcode[2].substring(1);
    document.getElementById("deviceImg").src = data[0].PRODUCT_IMG;
    if (data[0].ACTIVATE_WARRANTY == "1999-01-01T00:00:00") {
        document.getElementById('warrantyActive').textContent = "Chưa kích hoạt";
        document.getElementById('warrantyTimeActive').textContent = " ";
        const WarrantyAct = DataQRcode[0].substring(1, 5) + "-" + DataQRcode[0].substring(5, 7) + "-" + DataQRcode[0].substring(7, 9);
        const time = calculateWarrantyRemaining(data[0].DATE_CREATE, Number(data[0].TIME_WARRANTY));
        console.log(WarrantyAct, data);
        document.getElementById('warrantyTime').textContent = time;
        document.getElementById('result-product-warranty').classList.remove("d-none");
    } else {
        document.getElementById('warrantyActive').textContent = "Đã kích hoạt";
        const now = new Date(data[0].ACTIVATE_WARRANTY);

        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        document.getElementById('warrantyTimeActive').textContent = `${year}-${month}-${day}`;
        document.getElementById('result-product-warranty').classList.add("d-none");
        const WarrantyAct = DataQRcode[0].substring(1, 5) + "-" + DataQRcode[0].substring(5, 7) + "-" + DataQRcode[0].substring(7, 9);
        const time = calculateWarrantyRemaining(data[0].DATE_CREATE, Number(data[0].TIME_WARRANTY));
        document.getElementById('warrantyTime').textContent = time;
    }
    // const item = { 'CodeWorkStation': workstationID, 'NameWorkStation': state[0].WORKSTATION_NAME, 'domain': domain, 'date': getCurrentTime(), 'workstationType': state[0].TEMPLATE_TOOLTIP }
    // localStorage.setItem('itemHistory', JSON.stringify(item));
    saveWarranty(data);
    addItemHistoryWarranty(data[0].PR_KEY, data);
}

function calculateWarrantyRemaining(startDate, timeWarranty) {
    const warrantyPeriodMonths = timeWarranty; // Thời gian bảo hành là 12 tháng

    // Chuyển ngày bắt đầu bảo hành sang đối tượng Date
    const startDateObj = new Date(startDate);
    // Ngày kết thúc bảo hành
    const warrantyEndDate = new Date(startDateObj);
    warrantyEndDate.setMonth(warrantyEndDate.getMonth() + warrantyPeriodMonths);

    console.log(warrantyEndDate);

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
    console.log(data);
    const DataQRcode = data[0].QR_CODE.split(',');
    const itemW = {
        'CodeWarranty': DataQRcode[2].substring(1),
        'NameWarranty': data[0].PRODUCT_NAME,
        'imgWarranty': data[0].PRODUCT_IMG,
        'date': HOMEOSAPP.getCurrentTime()
    }

    waranntyItems = JSON.parse(localStorage.getItem('dataWarranty'));
    console.log(waranntyItems, itemW.CodeWarranty);

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
                    '<h4 style="margin: 0;">' +
                    '<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" style="color: #cd5757;" fill="currentColor" class="bi bi-exclamation-triangle" viewBox="0 0 16 16">' +
                    '<path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.15.15 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.2.2 0 0 1-.054.06.1.1 0 0 1-.066.017H1.146a.1.1 0 0 1-.066-.017.2.2 0 0 1-.054-.06.18.18 0 0 1 .002-.183L7.884 2.073a.15.15 0 0 1 .054-.057m1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767z"/>' +
                    '<path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z"/>' +
                    '</svg>' +
                    ' Bảo hành' +
                    '</h4>' +
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
                element += '<li class="parent-item">' +
                    '<button class="toggle-button">' +
                    '<div>' +
                    '<h4 style="margin: 0;">' +
                    '<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" style="color: #27c527;" fill="currentColor" class="bi bi-check-circle" viewBox="0 0 16 16">' +
                    '<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>' +
                    '<path d="m10.97 4.97-.02.022-3.473 4.425-2.093-2.094a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05"/>' +
                    '</svg>' +
                    ' ' + dataWarranty[i].ERROR_NAME +
                    '</h4>' +
                    '<p style="margin: 1px 0 0 0; font-size: 14px; font-weight: 300;">Sản phẩm thuộc: ' + data_lot.data[0].LOT_NUMBER + '</p>' +
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
    document.getElementById("tab-0").classList.remove("active");
    document.getElementById("tab-1").classList.add("active");
    document.getElementById("btn-tab1").classList.add("menuWarranty");
    $('#qr-popup').hide()
    document.getElementById("menu-warranty").classList.remove("d-none");
    $('#loading-popup').hide()
    console.log('hide');
}
accessDeviceWarranty();