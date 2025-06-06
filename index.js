var HOMEOSAPP = {};
HOMEOSAPP.application = "";
HOMEOSAPP.listDomain = [];
HOMEOSAPP.checkTabHistory = 0;
HOMEOSAPP.UserID = localStorage.getItem("userID");
var typeQR;
var checkReport = '';
let historyStack = ['pickApp'];
var UserID = localStorage.getItem("userID");
var DataUser = JSON.parse(localStorage.getItem("userInfo"));
let screens = document.querySelectorAll('.app > div[id]');

setTimeout(() => {
    document.getElementById("LoadScreen").classList.add("d-none");
    document.getElementById("LogoLoadScreen").classList.add("hidden");
    // document.getElementById("pickApp").classList.remove("hidden");
    // document.getElementById("guarantee").classList.remove("hidden");
    historyItems = JSON.parse(localStorage.getItem('dataHistory'));
    if (!historyItems){
        historyItems = [{
                "CodeWorkStation": "025001",
                "NameWorkStation": "Kẻng Mỏ",
                "domain": "sonlahpc.hymetco.com",
                "date": "22/05/2025 10:18:18",
                "workstationType": "NMLLTD"
            },
            {
                "CodeWorkStation": "025002",
                "NameWorkStation": "Nậm Mu",
                "domain": "sonlahpc.hymetco.com",
                "date": "22/05/2025 14:29:47",
                "workstationType": "NMLLTD"
            }
        ];
    }
    
    if(window.workstationID){
        HOMEOSAPP.application = "KTTV";
        HOMEOSAPP.checkTabHistory = 1;
        $("#content-block").load("https://son-la-hpc.vercel.app/pages/ScanQR/scanQR.html");
    } else {
        localStorage.setItem('dataHistory', JSON.stringify(historyItems));
        $("#content-block").load("https://son-la-hpc.vercel.app/pages/menu/menu.html");
    }
}, 2000);

HOMEOSAPP.handleUser = async function (type) {
    if (UserID) {
        try {
            if (DataUser && DataUser.id === UserID) {
                if(type == "home"){
                    document.getElementById("PickApp-button-login").classList.add("d-none");
                    document.getElementById("LogoPickScreen").style.paddingTop = "10vh";
                } else {
                    $(".userName").text(DataUser.name);
                    $(".userAvt").attr("src", DataUser.avatar);
                }
                const dataUserResponse = await HOMEOSAPP.getDM("https://central.homeos.vn/service_XD/service.svc", "WARRANTY_USER", "USER_ID='" + UserID + "'");
                console.log(dataUserResponse.data);
                if (dataUserResponse.data.length == 0) {
                    const willInsertData = {
                        USER_ID: DataUser.id,
                        USER_NAME: DataUser.name,
                        USER_ROLE: "GUEST",
                        DATE_CREATE: new Date(),
                        DATASTATE: "ADD",
                    };
                    add('WARRANTY_USER', willInsertData);
                    localStorage.setItem('RoleUser', "GUEST");
                } else {
                    console.log(dataUserResponse);
                    localStorage.setItem('RoleUser', dataUserResponse.data[0].USER_ROLE);
                }
            } else if (DataUser != undefined) {
                const dataUserResponse = await getDM("https://central.homeos.vn/service_XD/service.svc", "WARRANTY_USER", "USER_ID='" + UserID + "'");
                console.log(dataUserResponse.data);
                if (dataUserResponse.data.length == 0) {
                    const willInsertData = {
                        USER_ID: DataUser.id,
                        USER_NAME: DataUser.name,
                        USER_ROLE: "GUEST",
                        DATE_CREATE: new Date(),
                        DATASTATE: "ADD",
                    };
                    add('WARRANTY_USER', willInsertData);
                }
            } else {
                localStorage.setItem('RoleUser', 'GUEST');
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    } else {
        // localStorage.setItem('RoleUser', 'GUEST');
        document.getElementById("QUYEN").classList.add("d-none");
        document.getElementById("LogoPickScreen").style.paddingTop = "10vh";
    }
    WarrantyCheckUser(localStorage.getItem("RoleUser"));
}

let observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
            let target = mutation.target;
            let isHidden = target.classList.contains('hidden');
            let id = target.id;

            if (!isHidden && id && !historyStack.includes(id) && id != 'LoadScreen') {
                historyStack.push(id);
            }
        }
    });
});

screens.forEach(screen => observer.observe(screen, { attributes: true }));

if (typeof HomeOS !== 'undefined') {
    HomeOS.goBack = function () {
        if (historyStack.length <= 1) {
            return;
        }
        let currentScreen = historyStack.pop();
        document.getElementById(currentScreen).classList.add('hidden');
        let prevScreen = historyStack[historyStack.length - 1];
        document.getElementById(prevScreen).classList.remove('hidden');
    };
}

async function getListDomain() {
    const datatest = await HOMEOSAPP.getDM("https://central.homeos.vn/service_XD/service.svc", 'WARRANTY_SERVICE', "1=1");
    console.log(datatest.data);
    for (let i = datatest.data.length - 1; i >= 0; i--) {
        if(datatest.data[i].DOMAIN == "sonla.homeos.vn"){
            datatest.data[i].DOMAIN = "sonlahpc.hymetco.com"
            HOMEOSAPP.listDomain.push(datatest.data[i].DOMAIN);
        } else {
            HOMEOSAPP.listDomain.push(datatest.data[i].DOMAIN);
        }
    }
}

getListDomain();


HOMEOSAPP.getCurrentTime = function(time) {
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

HOMEOSAPP.getDataChart = function(typeTime, start, end, type, zone, url) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: url + "/ApiServicePublic/" + "GetDataFilterLogzone" + "/" + "TYPE_TIME='" + typeTime + "',START_DATE='" + start + "',END_DATE='" + end + "',TYPE_VALUE='" + type + "',ZONE_ADDRESS='" + zone + "'",
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
                toastr.error("Lấy dữ liệu bị lỗi vui lòng thử lại sau!");
            },
        });
    });
}

HOMEOSAPP.getDataReport = function(active, url) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: url + "/ApiServicePublic/" + "GetDataReport" +"/" + "ACTIVE="+active,
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
                toastr.error("Lấy dữ liệu bị lỗi vui lòng thử lại sau!");
            },
        });
    });
}



function roundToTwoDecimals(num) {
    if (Number.isInteger(num)) {
        return num; // Nếu là số nguyên thì trả về nguyên gốc
    }
    return Math.round(num * 100) / 100; // Làm tròn đến 2 chữ số thập phân
}

var chartConfigs = [
    { id: "lineBarChart", varName: "lineBarChart", zone: "RD", label: "Lượng mưa (mm)", unit: "mm", type: "bar", color: "rgba(75, 192, 192, 0.5)", border: "rgba(75, 192, 192, 1)", divideBy10: true },
    { id: "ChartRT", varName: "ChartRT", zone: "RT", label: "Nhiệt độ (°C)", unit: "°C", type: "line", color: "rgb(173 14 14)", border: "rgb(173 14 14)", divideBy10: true, tension: 0.4 },
    { id: "ChartRH", varName: "ChartRH", zone: "RH", label: "Độ ẩm (%)", unit: "%", type: "line", color: "rgb(13,154,154, 0.5)", border: "rgb(13,154,154)", divideBy10: true, fill: true, tension: 0.4, min: 0, max: 100 },
    { id: "ChartRP", varName: "ChartRP", zone: "RP", label: "Áp suất (hPa)", unit: "hPa", type: "line", color: "rgb(40, 167, 69)", border: "rgb(40, 167, 69)", divideBy10: true, dashed: true },
    { id: "ChartRN", varName: "ChartRN", zone: "RN", label: "Mực nước (cm)", unit: "cm", type: "line", color: "rgb(0,95,95, 0.5)", border: "rgb(13,154,154)", divideBy10: false, fill: true, tension: 0.4 },
    { id: "ChartSS", varName: "ChartSS", zone: "SS", label: "Độ mặn (ppt)", unit: "ppt", type: "line", color: "rgb(40, 167, 69)", border: "rgb(40, 167, 69)", divideBy10: true, tension: 0.4 },
    { id: "ChartEC", varName: "ChartEC", zone: "EC", label: "Độ dẫn điện (μs/cm)", unit: "μs/cm", type: "line", color: "rgb(0,95,95)", border: "rgb(13,154,154)", divideBy10: true, tension: 0.4 },
    { id: "ChartTN", varName: "ChartTN", zone: "TN", label: "dung tích (tr.m³)", unit: "tr.m³", type: "line", color: "rgb(0,95,95)", border: "rgb(13,154,154)", divideBy10: true, tension: 0.4 },
    { id: "ChartQV", varName: "ChartQV", zone: "QV", label: "Lưu lượng đến (m³/S)", unit: "m³/S", type: "line", color: "rgb(0,95,95)", border: "rgb(13,154,154)", divideBy10: true, tension: 0.4 },
    { id: "ChartQR", varName: "ChartQR", zone: "QR", label: "Lưu lượng xả (m³/S)", unit: "m³/S", type: "line", color: "rgb(0,95,95)", border: "rgb(13,154,154)", divideBy10: true, tension: 0.4 },
    { id: "ChartQN", varName: "ChartQN", zone: "QN", label: "Lưu lượng nước (m³/S)", unit: "m³/S", type: "line", color: "rgb(0,95,95)", border: "rgb(13,154,154)", divideBy10: true, tension: 0.4 },
    { id: "ChartVN", varName: "ChartVN", zone: "VN", label: "Tốc độ dòng chảy (m/S)", unit: "m/S", type: "line", color: "rgb(0,95,95)", border: "rgb(13,154,154)", divideBy10: true, tension: 0.4 },
    { id: "ChartRN72H", varName: "ChartRN72H", zone: "AA", label: "Mực nước (cm)", unit: "cm", type: "line", color: "rgb(0,95,95, 0.5)", border: "rgb(13,154,154)", divideBy10: true, tension: 0.4 }
];

var charts = {};

HOMEOSAPP.createChartData = function(data, type, typeData) {
    // Destroy old charts
    chartConfigs.forEach(cfg => {
        if (charts[cfg.varName]) {
            if(cfg.id == "ChartRN72H") {
            
            } else {
                charts[cfg.varName].destroy();
            }
        }
    });

    // Xử lý dữ liệu
    var datasets = {};
    var labels = {};

    chartConfigs.forEach(cfg => {
        datasets[cfg.zone] = [];
        labels[cfg.zone] = [];
    });

    $.each(data, function (i, item) {
        let zone = item.ZONE_PROPERTY;
        let config = chartConfigs.find(c => c.zone === zone);
        if (!config) return;

        if (zone === 'RD' || item.AverageValue !== 0) {
            let value;
            console.log(zone);
            
            if(zone == 'SS'){
                value = config.divideBy10 ? item.AverageValue / 10000 : item.AverageValue;
            } else if(zone == 'EC'){
                value = config.divideBy10 ? item.AverageValue / 1000 : item.AverageValue;
            } else if(zone == 'QN' || zone == 'VN') {
                value = config.divideBy10 ? item.AverageValue : item.AverageValue;
            } else {
                value = config.divideBy10 ? item.AverageValue / 10 : item.AverageValue;
            }
            value = roundToTwoDecimals(value).toFixed(2);
            labels[zone].push(item.Label);
            datasets[zone].push(value);
        }
    });

    let labelSuffix = typeData === "NGAY" ? "giờ" : "";

    chartConfigs.forEach(cfg => {
        if(cfg.id == "ChartRN72H") {
                        
        } else {
            console.log(cfg.id);
            let ctx = document.getElementById(cfg.id).getContext('2d');
            let dataSet = [{
                type: cfg.type,
                label: cfg.label,
                data: datasets[cfg.zone],
                backgroundColor: cfg.color,
                borderColor: cfg.border,
                borderWidth: 1,
                fill: cfg.fill ? 'start' : false,
                tension: cfg.tension || 0,
                borderDash: cfg.dashed ? [5, 5] : undefined
            }];

            charts[cfg.varName] = new Chart(ctx, HOMEOSAPP.createChart("bar", labels[cfg.zone], [], cfg.unit, "", dataSet, labelSuffix, cfg.min, cfg.max));
        }
    });

    $("#loading-spinner").addClass("d-none");
}

// hàm để tạo chart
HOMEOSAPP.createChart = function (type, Label, Data, Unit, LabelData, dataSet, labelNgay, Min, Max) {
    return {
        type: type, // Loại biểu đồ
        data: {
            labels: Label,
            datasets: dataSet
        },
        options: {
            responsive: true,
            maintainAspectRatio: true, // Không giữ tỷ lệ khung hình
            responsive: true,
            scales: {
                y: {  // Sử dụng 'y' thay vì 'yAxes'
                    beginAtZero: false,
                    ticks: {
                        callback: function (value, index, values) {
                            return roundToTwoDecimals(value) + ' ' + Unit;  // Thêm đơn vị Volts vào mỗi giá trị trục y
                        }
                    },
                    min: Min ?? undefined,
                    max: Max ?? undefined,
                }
            },
            interaction: {
                mode: 'nearest', // hoặc 'index'
                axis: 'x',       // hoặc 'y', hoặc 'xy'
                intersect: false // Đảm bảo tooltip hiển thị ngay cả khi không chạm chính xác
            },
            plugins: {
                tooltip: { // Sử dụng 'plugins.tooltip' thay vì 'tooltips'
                    callbacks: {
                        title: function (tooltipItems) {
                            const index = tooltipItems[0].dataIndex; // Lấy index của điểm dữ liệu
                            return Label[index] + " " + labelNgay; // Thay "labelNgay" bằng array chứa thời gian
                        },
                        label: function (tooltipItem) {
                            let label = tooltipItem.dataset.label || ''; // Lấy label từ dataset
                            if (label) {
                                label += ': ';
                            }
                            label += tooltipItem.raw + ' ' + Unit; // Sử dụng tooltipItem.raw để lấy giá trị y
                            return label;
                        }
                    }
                }
            }
        }
    }
}

HOMEOSAPP.formatDateTime = function(date) {
    const now = new Date(date);

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    const formattedDatetime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    return formattedDatetime
}




$("#share-workStation").click(function () {
    const item = JSON.parse(localStorage.getItem("itemHistory"));
    window.shareWorkStation("Trạm quan trắc "+ item.NameWorkStation, 'https://central.homeos.vn/images/MiniAppLoadingScreen.png', item.CodeWorkStation);
});