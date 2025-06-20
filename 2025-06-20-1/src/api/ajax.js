HOMEOSAPP.getDataMDQRcode = function(QRcode) {
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

HOMEOSAPP.getDataChartCondition = function(startDate, endDate, ZONE_ID, ZONE_ADDRESS, DEVICE_ID){

    // const url = "https://DEV.HOMEOS.vn/service/service.svc/";
    const url = "https://central.homeos.vn/service_XD/service.svc/";

    return new Promise((resolve, reject) => {
        $.ajax({
            url: url + "ApiServicePublic/" + "GetdataChart/STARTDATE='" + startDate + "',ENDDATE='" + endDate + "',ZONE_ID=" + ZONE_ID + ",ZONE_ADDRESS=" + ZONE_ADDRESS + ",DEVICE_ID=" + DEVICE_ID ,
            type: "GET",
            dataType: "jsonp",
            contentType: "application/json; charset=utf-8",
            success: function (msg) {
                try {
                    let state = JSON.parse(msg);
                    console.log("dữ liệu", state);

                    resolve(state); // Trả về dữ liệu khi thành công
                } catch (error) {
                    reject(error); // Bắt lỗi nếu JSON parse thất bại
                }
            },
            complete: function (data) {
                // Có thể thêm xử lý khi request hoàn thành ở đây nếu cần
            },
            error: function (e, t, x) {

            },
        });
    });
}