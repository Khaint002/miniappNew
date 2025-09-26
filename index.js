var HOMEOSAPP = {};
HOMEOSAPP.application = "";
var typeQR;
HOMEOSAPP.listDomain = [];
HOMEOSAPP.checkTabHistory = 0;
HOMEOSAPP.checkTabWarranty = 1;
HOMEOSAPP.LeverPermission = 0;
HOMEOSAPP.UserID = localStorage.getItem("userID");
HOMEOSAPP.apps = [
    { MENU_ID: "KTTV", MENU_NAME: "Môi trường", MENU_VERSION: "v1.1.5", MENU_BGCOLOR: "#17a2b8", MENU_ICON: "bi-cloud-sun", MENU_SHARE_OWNER: "WID=", MENU_SHARE_ADMIN: null, MENU_SHARE_GUEST: null, MENU_TYPE: "LOAD", MENU_LINK: "https://miniapp-new.vercel.app/src/pages/History/history.html", DESCRIPTION: "Khí tượng thuỷ văn", VISIBLE: true },
    { MENU_ID: "IOT", MENU_NAME: "Web OS", MENU_VERSION: "v4.56 Pro", MENU_BGCOLOR: "#da4a58", MENU_ICON: "bi-pc-display-horizontal", MENU_SHARE_OWNER: null, MENU_SHARE_ADMIN: null, MENU_SHARE_GUEST: null, MENU_TYPE: "LOCATION", MENU_LINK: "http://devices.homeos.vn/", DESCRIPTION: "IIoT", VISIBLE: true },
    { MENU_ID: "WARRANTY", MENU_NAME: "Bảo hành", MENU_VERSION: "v1.0.5", MENU_BGCOLOR: "#e29038", MENU_ICON: "bi-tools", MENU_SHARE_OWNER: "Q=OWNER&CK=", MENU_SHARE_ADMIN: "Q=ADMIN&CK=", MENU_SHARE_GUEST: "Q=GUEST&CK=", MENU_TYPE: "LOAD", MENU_LINK: "https://miniapp-new.vercel.app/src/pages/History/history.html", DESCRIPTION: "Bảo hành sản phẩm", VISIBLE: true },
    { MENU_ID: "CONTROL", MENU_NAME: "Điều khiển", MENU_VERSION: "v1.0.4", MENU_BGCOLOR: "#17a2b8", MENU_ICON: "bi-toggles", MENU_SHARE_OWNER: "CID=", MENU_SHARE_ADMIN: null, MENU_SHARE_GUEST: null, MENU_TYPE: "LOAD", MENU_LINK: "https://miniapp-new.vercel.app/src/pages/History/history.html", DESCRIPTION: "Giám sát năng lượng", VISIBLE: true },
    { MENU_ID: "SCHEDULE", MENU_NAME: "Lịch công tác", MENU_VERSION: "v1.0.1", MENU_BGCOLOR: "#da4a58", MENU_ICON: "bi-pc-display-horizontal", MENU_SHARE_OWNER: null, MENU_SHARE_ADMIN: null, MENU_SHARE_GUEST: null, MENU_TYPE: "LOCATION", MENU_LINK: "https://central.homeos.vn/singlepage/PetrolimexHRM/", DESCRIPTION: "Xem lịch làm việc", VISIBLE: true },
    { MENU_ID: "WAREHOUSE", MENU_NAME: "Kho Hàng", MENU_VERSION: "v1.0.1", MENU_BGCOLOR: "#42a130", MENU_ICON: "bi-box-seam", MENU_SHARE_OWNER: null, MENU_SHARE_ADMIN: null, MENU_SHARE_GUEST: null, MENU_TYPE: "LOADMY", MENU_LINK: "https://miniapp-new.vercel.app/src/pages/WareHouse/wareHouse.html", DESCRIPTION: "Quản lý kho", VISIBLE: true },
    { MENU_ID: "DEN", MENU_NAME: "Đèn", MENU_VERSION: "v6.10.24", MENU_BGCOLOR: "#28a745", MENU_ICON: "bi-lightbulb-fill", MENU_SHARE_OWNER: null, MENU_SHARE_ADMIN: null, MENU_SHARE_GUEST: null, MENU_TYPE: null, MENU_LINK: null, DESCRIPTION: "Chiếu sáng thông minh", VISIBLE: false }
];
HOMEOSAPP.objApp = {};
var URL_CREDENTIALS_CONFIG = {
    "https://cctl-dongthap.homeos.vn/service/service.svc": { user: "admin", passKey: "123" },
    "https://pctthn.homeos.vn/service/service.svc": { user: "admin", passKey: "123" },
    "https://thanthongnhat.homeos.vn/service/service.svc": { user: "admin", passKey: "1" },
    default: { user: "dev", passKey: "1" }
};
HOMEOSAPP.linkbase = 'https://central.homeos.vn/service_XD/service.svc';
var checkReport = '';
let historyStack = ['pickApp'];
var UserID = localStorage.getItem("userID");
var DataUser = JSON.parse(localStorage.getItem("userInfo"));
let screens = document.querySelectorAll('.app > div[id]');
localStorage.setItem('historyStack', JSON.stringify([]));

HOMEOSAPP.loadPage = function (url) {
    let historyStack = JSON.parse(localStorage.getItem('historyStack')) || [];
    if (!historyStack.includes(url)) {
        historyStack.push(url);
    } else {
        historyStack.splice(historyStack.indexOf(url), 1);
        historyStack.push(url);
    }
    localStorage.setItem('historyStack', JSON.stringify(historyStack));

    if (url.startsWith("http")) {
        $("#content-block").load(url);
    } else {
        $("#"+url).show();
    }
}

HOMEOSAPP.goBack = function () {
    let historyStack = JSON.parse(localStorage.getItem('historyStack')) || [];
    let preUrl;
    if (historyStack[historyStack.length - 1].startsWith("http")) {
        if (historyStack.length > 1) {
            historyStack.pop();
            preUrl = historyStack[historyStack.length - 1];
            localStorage.setItem('historyStack', JSON.stringify(historyStack));
            $("#content-block").load(preUrl);
        }
    } else if(historyStack.length > 1) {
        preUrl = historyStack[historyStack.length - 1];
        $("#"+preUrl).hide();
        historyStack.pop();
        localStorage.setItem('historyStack', JSON.stringify(historyStack));
    }
}

async function getDynamicCredentials(url) {
    // Luôn chuyển url về chữ thường để khớp với key trong config
    const config = URL_CREDENTIALS_CONFIG[url.toLowerCase()] || URL_CREDENTIALS_CONFIG.default;
    const password = HOMEOSAPP.sha1Encode(config.passKey + "@1B2c3D4e5F6g7H8").toString();
    
    const dataUser = await checkRoleUser(config.user, password, url + '/');

    if (!dataUser || dataUser.length === 0) {
        throw new Error(`Authentication failed for user '${config.user}' at ${url}`);
    }

    return {
        Uid: dataUser[0].StateName,
        Sid: dataUser[0].StateId
    };
}

HOMEOSAPP.getDM = async function (url, table_name, c, check) {
    try {
        // Khai báo thông tin đăng nhập mặc định
        let credentials = {
            Uid: 'admin',
            Sid: 'cb880c13-5465-4a1d-a598-28e06be43982'
        };

        // Nếu là gọi API không tập trung, lấy thông tin đăng nhập động
        if (check === "NotCentral") {
            credentials = await getDynamicCredentials(url); // <-- GỌI HÀM POMOCNICZY
        }

        // Chuẩn bị dữ liệu gửi đi
        const requestData = {
            ...credentials,
            tablename: table_name,
            c: c,
            other: '',
            cmd: ''
        };

        // Gọi API và await kết quả trực tiếp
        const rawResponse = await $.ajax({
            url: url + "/getDm",
            dataType: "jsonp",
            data: requestData,
            contentType: "application/json; charset=utf-8",
        });

        const state = JSON.parse(rawResponse);

        // Xử lý logic đặc biệt khi session không tồn tại
        if (state.StateId === "NOT_EXIST_SESSION") {
            const targetUrl = url + "/";
            const dataSS = JSON.parse(localStorage.getItem('dataSession')) || [];
            const updatedDataSS = dataSS.filter(item => item.url !== targetUrl);
            localStorage.setItem('dataSession', JSON.stringify(updatedDataSS));
        }

        return state;

    } catch (error) {
        // Xử lý tập trung mọi lỗi có thể xảy ra
        HomeOS.Service.SetActionControl(true);
        HomeOS.Service.ShowLabel('Lỗi dữ liệu');
        console.error("Error in HOMEOSAPP.getDM:", error);
        throw error; // Ném lỗi ra để hàm gọi nó biết và xử lý nếu cần
    }
};

function updateUserInfoUI(userData) {
    // Dùng querySelectorAll để cập nhật tất cả các element cùng lúc nếu có
    document.querySelectorAll(".userName").forEach(el => el.textContent = userData.name);
    document.querySelectorAll(".userAvt").forEach(el => el.src = userData.avatar);
}

/**
 * Tạo một bản ghi WARRANTY_USER mới trong cơ sở dữ liệu.
 */
async function createNewWarrantyUser(platformUser) {
    const newUserPayload = {
        USER_ID: platformUser.id,
        USER_NAME: platformUser.name,
        USER_ROLE: "GUEST",
        DATE_CREATE: new Date(),
        DATASTATE: "ADD",
    };
    await HOMEOSAPP.add('WARRANTY_USER', newUserPayload);
    localStorage.setItem('RoleUser', "GUEST");
    return newUserPayload; // Trả về để có thể dùng ngay
}

/**
 * Cập nhật số điện thoại cho người dùng đã tồn tại.
 */
async function updateUserPhoneNumber(dbUser) {
    let phoneNumber = null;
    if (window.getPhoneNum) {
        try {
            const tokenPhone = await window.getPhoneNum();
            const token = await window.getUserAccessToken();
            const dataPhone = await HOMEOSAPP.getPhoneNumberByUserZalo("https://central.homeos.vn/service_XD/service.svc", token, tokenPhone);
            phoneNumber = formatPhoneNumber(dataPhone);
        } catch (phoneError) {
            console.error("Could not retrieve phone number:", phoneError);
            return dbUser; // Trả về user cũ nếu không lấy được SĐT
        }
    }

    const updatedUserPayload = {
        ...dbUser, // Sao chép tất cả thuộc tính của user cũ
        USER_PHONE_NUM: phoneNumber,
        DATASTATE: "EDIT",
    };
    
    await HOMEOSAPP.add('WARRANTY_USER', updatedUserPayload);
    return updatedUserPayload;
}

HOMEOSAPP.handleUser = async function (type) {
    // --- Guard Clauses: Xử lý các trường hợp đơn giản và thoát sớm ---

    // 1. Nếu không có UserID, ẩn các element liên quan và thoát
    if (!UserID) {
        document.getElementById("QUYEN")?.classList.add("d-none");
        return;
    }

    // 2. Nếu không có dữ liệu người dùng từ nền tảng (Zalo), coi như GUEST và thoát
    if (!DataUser || DataUser.id !== UserID) {
        localStorage.setItem('RoleUser', 'GUEST');
        console.warn("No valid DataUser or ID mismatch, setting role to GUEST.");
        return;
    }

    // --- Logic chính: Bắt đầu xử lý khi đã có UserID và DataUser hợp lệ ---
    try {
        // Chỉ gọi API một lần duy nhất
        const dbUserResponse = await HOMEOSAPP.getDM("https://central.homeos.vn/service_XD/service.svc", "WARRANTY_USER", `USER_ID='${UserID}'`);
        let userInDb = dbUserResponse.data[0];

        if (!userInDb) {
            // Trường hợp người dùng chưa tồn tại trong DB của chúng ta
            userInDb = await createNewWarrantyUser(DataUser);
        } else if (!userInDb.USER_PHONE_NUM) {
            // Trường hợp người dùng đã tồn tại nhưng thiếu SĐT
            userInDb = await updateUserPhoneNumber(userInDb);
        }
        
        // Sau tất cả các bước xử lý, lưu thông tin cuối cùng vào localStorage
        localStorage.setItem('RoleUser', userInDb.USER_ROLE);
        // Lưu object hoàn chỉnh thay vì data[0] có thể không an toàn
        localStorage.setItem('UserLogin', JSON.stringify(userInDb)); 

        // --- Cập nhật giao diện (UI) ---
        if (type === "home") {
            document.getElementById("PickApp-button-login")?.classList.add("d-none");
            const logo = document.getElementById("LogoPickScreen");
            if (logo) logo.style.paddingTop = "4vh";
        } else {
            updateUserInfoUI(DataUser); // Cập nhật avatar và tên
        }

    } catch (error) {
        console.error("Error handling user data:", error);
        // Có thể set vai trò GUEST ở đây nếu có lỗi xảy ra
        localStorage.setItem('RoleUser', 'GUEST');
    }
};

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

HOMEOSAPP.add = async function (table, data, URL, check) {
    try {
        let credentials = { Uid: 'admin', Sid: 'cb880c13-5465-4a1d-a598-28e06be43982' };
        let targetUrl = 'https://central.homeos.vn/service_XD/service.svc';

        if (check === "NotCentral") {
            targetUrl = URL;
            credentials = await getDynamicCredentials(targetUrl); // <-- GỌI HÀM POMOCNICZY
        }

        const requestData = { ...credentials, tablename: table, jd: JSON.stringify(data), ex: '' };

        const rawResponse = await $.ajax({
            url: targetUrl + "/ExecuteData",
            dataType: "jsonp",
            data: requestData,
            contentType: "application/json; charset=utf-8",
        });

        return JSON.parse(rawResponse);

    } catch (error) {
        console.error("Error in HOMEOSAPP.add:", error);
        // Có thể thêm các xử lý lỗi chung ở đây nếu cần
        throw error;
    }
};


/**
 * HÀM `WorkstationStatistics` ĐÃ ĐƯỢC TỐI ƯU
 */
HOMEOSAPP.WorkstationStatistics = async function(url, c, check) {
    try {
        let credentials = { Uid: 'admin', Sid: 'cb880c13-5465-4a1d-a598-28e06be43982' };

        if (check === "NotCentral") {
            credentials = await getDynamicCredentials(url); // <-- GỌI HÀM POMOCNICZY
        }

        const maTram = localStorage.getItem("MATRAM");
        const requestData = { ...credentials, c: c };

        const rawResponse = await $.ajax({
            url: url + "/WorkstationStatistics",
            dataType: "jsonp",
            data: requestData,
            contentType: "application/json; charset=utf-8",
        });

        const state = JSON.parse(rawResponse);

        // Thêm kiểm tra an toàn để tránh lỗi khi API trả về cấu trúc không mong muốn
        if (!state || !state.DATA) {
            console.warn("WorkstationStatistics: Response did not contain a 'DATA' property.");
            return null; // Hoặc trả về mảng rỗng [] tùy theo logic của bạn
        }
        
        const key = "DN" + maTram + "3";
        const result = state.DATA.find(obj => obj.hasOwnProperty(key));

        // Trả về dữ liệu nếu tìm thấy, ngược lại trả về null/undefined
        return result ? result[key] : null;

    } catch (error) {
        HomeOS.Service.SetActionControl(true);
        HomeOS.Service.ShowLabel('Lỗi dữ liệu');
        console.error("Error in HOMEOSAPP.WorkstationStatistics:", error);
        throw error;
    }
};

HOMEOSAPP.getNewData = function (workstation, c, url, key) {
    return new Promise((resolve, reject) => {
        let urlK;
        if(key){
            urlK = url + "/GetNewData?w=" + workstation +"&k="+key;
        } else {
            urlK = url + "/GetNewData?w=" + workstation;
        }
        $.ajax({
            url: urlK,
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
                document.getElementById("result-form-total").classList.remove("d-none");
                document.getElementById("result-condition").classList.add("d-none");
                document.getElementById("result-form-loading").classList.add("d-none");
                document.getElementById("result-form").classList.remove("d-none");
                document.getElementById("footer-instruct-scanQR").classList.remove("d-none");
                document.getElementById("result-form-title").classList.remove("d-none");
                document.getElementById("result-form-stationID").classList.add("d-none");
                document.getElementById("result-form-stationName").classList.add("d-none");
                document.getElementById("result-truycap").classList.add("d-none");
                //toastr.error("Vui lòng quét đúng mã QR!");
            },
        });
    });
}

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

HOMEOSAPP.getApiServicePublic = function(url, ApiName, param) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: url + "/ApiServicePublic/" + ApiName + "/" + param,
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

HOMEOSAPP.getPhoneNumberByUserZalo = async function(url, token, code) {
    let user_id_getDm = 'admin';
    let Sid_getDM = 'cb880c13-5465-4a1d-a598-28e06be43982';
    const d = {
        // Uid: 'vannt',
        // Sid: 'b99213e4-a8a5-45f4-bb5c-cf03ae90d8d7',
        Uid: user_id_getDm,
        Sid: Sid_getDM,
        userAccessToken: token,
        userCode: code
    };
    
    return new Promise((resolve, reject) => {
        $.ajax({
            url: url+"/GetZaloUserPhoneNumber?callback=?",
            type: "GET",
            dataType: "jsonp",
            data: d,
            contentType: "application/json; charset=utf-8",
            success: function (msg) {
                try {
                    let state = JSON.parse(msg);
                    console.log(state.data.number);
                    resolve(state.data.number);  // Trả về dữ liệu khi thành công
                } catch (error) {
                    reject(error);  // Bắt lỗi nếu JSON parse thất bại
                }
            },
            complete: function (data) {
                // Có thể thêm xử lý khi request hoàn thành ở đây nếu cần
            },
            error: function (e, t, x) {
                HomeOS.Service.SetActionControl(true);
                HomeOS.Service.ShowLabel('Lỗi dữ liệu');
                reject(e);  // Trả về lỗi nếu thất bại
            }
        });
    });
}

HOMEOSAPP.getDataReport = function(active, url) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: url + "/ApiServicePublic/" + "GetDataReport/ACTIVE="+active,
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

function checkRoleUser(user_id, password, url, check) {
    let sessionItems = JSON.parse(localStorage.getItem('dataSession')) || [];

    if (check === "Export") {
        sessionItems = sessionItems.filter(item => item.url !== url);
        localStorage.setItem('dataSession', JSON.stringify(sessionItems));
    }
    // Tìm session trùng với URL
    const existingSession = sessionItems.find(item => item.url === url);

    if (existingSession) {
        // Nếu đã có session → trả về luôn
        return Promise.resolve([{
            StateName: user_id,
            StateId: existingSession.sid // giả sử bạn lưu `sid` ở đây
        }]);
    }

    // Nếu chưa có session, gọi API
    const d = {
        Uid: user_id,
        p: password,
        ip: '0.0.0.0',
        a: '6fba9a59-46f1-42e6-baea-b2479fa1eb3b'
    };

    return new Promise((resolve, reject) => {
        $.ajax({
            url: url + "GetSessionId?callback=?",
            type: "GET",
            dataType: "jsonp",
            data: d,
            contentType: "application/json; charset=utf-8",
            success: function (msg) {
                try {
                    const state = JSON.parse(msg);
                    const newSession = {
                        url: url,
                        sid: state[0]?.StateId || '', // lưu sid nếu có
                        name: state[0]?.StateName || user_id
                    };
                    // Cập nhật localStorage
                    sessionItems.push(newSession);
                    localStorage.setItem('dataSession', JSON.stringify(sessionItems));
                    resolve(state);
                } catch (error) {
                    reject(error);
                }
            },
            error: function (e, t, x) {
                reject(e);
            }
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
    { id: "ChartRN", varName: "ChartRN", zone: "RN", label: "Mực nước (m)", unit: "m", type: "line", color: "rgb(0,95,95, 0.5)", border: "rgb(13,154,154)", divideBy10: true, fill: true, tension: 0.4 },
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
            if(zone == 'SS'){
                value = config.divideBy10 ? item.AverageValue / 10000 : item.AverageValue;
            } else if(zone == 'EC'){
                value = config.divideBy10 ? item.AverageValue / 1000 : item.AverageValue;
            } else if(zone == 'QN' || zone == 'VN' || zone == 'RN') {
                value = config.divideBy10 ? item.AverageValue / 100 : item.AverageValue;
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

HOMEOSAPP.formatDateTime = function(dateInput, format = "YYYY-MM-DD HH:mm:ss") {
    const date = (dateInput instanceof Date) ? dateInput : new Date(dateInput);

    if (isNaN(date.getTime())) {
        console.error("❌ Không thể parse ngày:", dateInput);
        return ""; // hoặc return format mặc định
    }
    const pad = (n) => n.toString().padStart(2, '0');

    const tokens = {
        YYYY: date.getFullYear(),
        MM: pad(date.getMonth() + 1),
        DD: pad(date.getDate()),
        HH: pad(date.getHours()),
        mm: pad(date.getMinutes()),
        ss: pad(date.getSeconds())
    };

    return format.replace(/YYYY|MM|DD|HH|mm|ss/g, (token) => tokens[token]);
}

HOMEOSAPP.handleControlApp = function(check) {
    HOMEOSAPP.showElement("LoadScreen", "LogoLoadScreen");
    
    if(check == 'IN'){
        HOMEOSAPP.loadPage("https://miniapp-new.vercel.app/src/pages/History/history.html");
        setTimeout(() => {
            HOMEOSAPP.hideElement("LoadScreen", "LogoLoadScreen");
            
            $('#nameHistory').removeClass("d-none");
            $('#nameHistory').addClass("d-flex");
            $('#listTabMap').addClass("d-none");
            $('#NameHistoryPage').text("Tủ điều khiển:");
            $('#descHistoryPage').text("Lịch sử tủ đã truy cập:");
            $('#historySelect').addClass("d-none");
            $('#footerHistoryPage').text("chọn tủ đã truy cập hoặc thêm mới");
            
            $('.workstation_access').addClass("d-none");
            $('.workstation_category').addClass("d-none");
            $('.warranty_scansQRcode').addClass("d-none");
            $('.warranty_lot').addClass("d-none");
            $('.warranty_scanQRcode').addClass("d-none");

            // historyListDetail.empty();
            // showAddWorkStationButton();
            HOMEOSAPP.checkTabHistory = 2;
            // showHistory();
            // pickApp('MUA');
        }, 2000);
    } else {
        HOMEOSAPP.goBack();
        setTimeout(() => {
            HOMEOSAPP.hideElement("LoadScreen", "LogoLoadScreen");
            

            $('#nameHistory').removeClass("d-none");
            $('#nameHistory').addClass("d-flex");
            $('#listTabMap').addClass("d-none");
            $('#NameHistoryPage').text("Tủ điều khiển:");
            $('#descHistoryPage').text("Lịch sử tủ đã truy cập:");
            $('#historySelect').addClass("d-none");
            $('#footerHistoryPage').text("chọn tủ đã truy cập hoặc thêm mới");
            
            $('.workstation_access').addClass("d-none");
            $('.workstation_category').addClass("d-none");
            $('.warranty_scansQRcode').addClass("d-none");
            $('.warranty_lot').addClass("d-none");
            $('.warranty_scanQRcode').addClass("d-none");

            // historyListDetail.empty();
            // showAddWorkStationButton();
            HOMEOSAPP.checkTabHistory = 2;
            // showHistory();
            // pickApp('MUA');
        }, 200);
    }
}

HOMEOSAPP.callBackExport = function (link) {
    
}

HOMEOSAPP.addMenuElement = function () {

}

HOMEOSAPP.handleWarrantyApp = async function(check) {
    checkApp = 'GUA';
    HOMEOSAPP.showElement("LoadScreen", "LogoLoadScreen");
    if(check == 'IN'){
        HOMEOSAPP.loadPage("https://miniapp-new.vercel.app/src/pages/History/history.html");
        setTimeout(() => {
            HOMEOSAPP.checkTabHistory = 3;
            HOMEOSAPP.hideElement("LoadScreen", "LogoLoadScreen");

            $('#nameHistory').removeClass("d-none");
            $('#nameHistory').addClass("d-flex");
            $('#listTabMap').addClass("d-none");
            $('#NameHistoryPage').text("Sản phẩm:");
            $('#descHistoryPage').text("Lịch sử sản phẩm đã xem:");
            $('#historySelect').addClass("d-none");
            
            $('.workstation_access').addClass("d-none");
            $('.workstation_category').addClass("d-none");
            $('.warranty_scansQRcode').removeClass("d-none");
            $('.warranty_lot').removeClass("d-none");
            $('.warranty_scanQRcode').removeClass("d-none");
        }, 2000);
    } else {
        HOMEOSAPP.goBack();
        setTimeout(() => {
            HOMEOSAPP.checkTabHistory = 3;
            HOMEOSAPP.hideElement("LoadScreen", "LogoLoadScreen");
            $('#nameHistory').removeClass("d-none");
            $('#nameHistory').addClass("d-flex");
            $('#listTabMap').addClass("d-none");
            $('#NameHistoryPage').text("Sản phẩm:");
            $('#descHistoryPage').text("Lịch sử sản phẩm đã xem:");
            $('#historySelect').addClass("d-none");
            
            $('.workstation_access').addClass("d-none");
            $('.workstation_category').addClass("d-none");
            $('.warranty_scansQRcode').removeClass("d-none");
            $('.warranty_lot').removeClass("d-none");
            $('.warranty_scanQRcode').removeClass("d-none");
        }, 200);
    }
}

HOMEOSAPP.handleAppView = function (mode, check = 'IN') {
    
    const config = {
        KTTV: {
            checkTabHistory: 1,
            name: "Quan trắc:",
            desc: "", // KTTV không có dòng này
            footer: "thêm mới mã trạm hoặc chọn trạm đã lưu",
            show: ['.workstation_access', '.workstation_category'],
            hide: ['.warranty_scansQRcode', '.warranty_lot', '.warranty_scanQRcode'],
        },
        CONTROL: {
            checkTabHistory: 2,
            name: "Tủ điều khiển:",
            desc: "Lịch sử tủ đã truy cập:",
            footer: "chọn tủ đã truy cập hoặc thêm mới",
            show: [],
            hide: ['.workstation_access', '.workstation_category', '.warranty_scansQRcode', '.warranty_lot', '.warranty_scanQRcode'],
        },
        WARRANTY: {
            checkTabHistory: 3,
            name: "Sản phẩm:",
            desc: "Lịch sử sản phẩm đã xem:",
            footer: "",
            show: ['.warranty_scansQRcode', '.warranty_lot', '.warranty_scanQRcode'],
            hide: ['.workstation_access', '.workstation_category'],
        },
    };

    const app = config[mode];
    if (!app) return;

    HOMEOSAPP.showElement("LoadScreen", "LogoLoadScreen");

    const render = () => {
        HOMEOSAPP.checkTabHistory = app.checkTabHistory;
        HOMEOSAPP.hideElement("LoadScreen", "LogoLoadScreen");
        if(mode != 'KTTV'){
            $('#nameHistory').removeClass("d-none").addClass("d-flex");
            $('#listTabMap').addClass("d-none");
            $('#historySelect').addClass("d-none");
        }
        $('#NameHistoryPage').text(app.name);
        if (app.desc !== undefined) $('#descHistoryPage').text(app.desc);
        
        $('#footerHistoryPage').text(app.footer || '');

        // Toggle visibility
        app.show.forEach(cls => $(cls).removeClass("d-none"));
        app.hide.forEach(cls => $(cls).addClass("d-none"));
    };

    if (check === 'IN') {
        HOMEOSAPP.loadPage("https://miniapp-new.vercel.app/src/pages/History/history.html");
        setTimeout(render, 2000);
    } else {
        HOMEOSAPP.goBack();
        setTimeout(render, 200);
    }
};


var reportOptions = [
    { value: "CHANGE", text: "Tuỳ ý" },
    { value: "MONTH1", text: "Tháng 1" },
    { value: "MONTH2", text: "Tháng 2" },
    { value: "MONTH3", text: "Tháng 3" },
    { value: "MONTH4", text: "Tháng 4" },
    { value: "MONTH5", text: "Tháng 5" },
    { value: "MONTH6", text: "Tháng 6" },
    { value: "MONTH7", text: "Tháng 7" },
    { value: "MONTH8", text: "Tháng 8" },
    { value: "MONTH9", text: "Tháng 9" },
    { value: "MONTH10", text: "Tháng 10" },
    { value: "MONTH11", text: "Tháng 11" },
    { value: "MONTH12", text: "Tháng 12" },
    { value: "QUY1", text: "Quý 1" },
    { value: "QUY2", text: "Quý 2" },
    { value: "QUY3", text: "Quý 3" },
    { value: "QUY4", text: "Quý 4" },
    { value: "MOMTHSTART", text: "6 tháng đầu năm" },
    { value: "MOMTHEND", text: "6 tháng cuối năm" },
    { value: "MOMTH9START", text: "9 tháng đầu năm" },
    { value: "YEAR", text: "Cả năm" },
];

// Hàm khởi tạo các option trong select
HOMEOSAPP.renderOptions = function() {
    const $select = $("#dateTimeReport");
    $select.empty(); // Xóa tất cả option hiện có

    reportOptions.forEach(opt => {
        const $option = $("<option></option>")
            .val(opt.value)
            .text(opt.text);
        $select.append($option);
    });
}

HOMEOSAPP.getReportRange = function(value) {
    const year = new Date().getFullYear();
    let startDate, endDate;

    const date = (m, d) => new Date(year, m - 1, d);

    switch (value) {
        case "CHANGE":
            startDate = null;
            endDate = null;
            break;
        case "MONTH1":
        case "MONTH2":
        case "MONTH3":
        case "MONTH4":
        case "MONTH5":
        case "MONTH6":
        case "MONTH7":
        case "MONTH8":
        case "MONTH9":
        case "MONTH10":
        case "MONTH11":
        case "MONTH12":
            const month = parseInt(value.replace("MONTH", ""));
            startDate = date(month, 1);
            endDate = new Date(year, month, 0); // ngày cuối cùng của tháng
            break;
        case "QUY1":
            startDate = date(1, 1);
            endDate = date(3, 31);
            break;
        case "QUY2":
            startDate = date(4, 1);
            endDate = date(6, 30);
            break;
        case "QUY3":
            startDate = date(7, 1);
            endDate = date(9, 30);
            break;
        case "QUY4":
            startDate = date(10, 1);
            endDate = date(12, 31);
            break;
        case "MOMTHSTART":
            startDate = date(1, 1);
            endDate = date(6, 30);
            break;
        case "MOMTHEND":
            startDate = date(7, 1);
            endDate = date(12, 31);
            break;
        case "MOMTH9START":
            startDate = date(1, 1);
            endDate = date(9, 30);
            break;
        case "YEAR":
            startDate = date(1, 1);
            endDate = date(12, 31);
            break;
        default:
            startDate = null;
            endDate = null;
    }

    return { startDate, endDate };
}
function formatDate(date) {
    if (!date) return '';
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
}
document.getElementById("dateTimeReport").addEventListener("change", function () {
    const selectedValue = this.value;
    const { startDate, endDate } = HOMEOSAPP.getReportRange(selectedValue);

    // Đổ vào input
    document.getElementById("startDate").value = formatDate(startDate);
    document.getElementById("endDate").value = formatDate(endDate);
});

function DateFormatServerToLocal(input, format) {
    if (!input) return '';

    let dateObj;

    // Nếu là Date object
    if (input instanceof Date) {
        dateObj = input;
    }
    // Nếu là chuỗi, cố gắng parse thành Date
    else if (typeof input === 'string') {
        dateObj = new Date(input);

        // Nếu parse fail (Invalid Date), trả về rỗng
        if (isNaN(dateObj.getTime())) return '';
    } else {
        return '';
    }

    // Lấy từng phần của ngày/giờ
    let dd = String(dateObj.getDate()).padStart(2, '0');
    let mm = String(dateObj.getMonth() + 1).padStart(2, '0'); // Month bắt đầu từ 0
    let yyyy = dateObj.getFullYear();
    let yy = String(yyyy).slice(-2);
    let HH = String(dateObj.getHours()).padStart(2, '0');
    let MM = String(dateObj.getMinutes()).padStart(2, '0');
    let SS = String(dateObj.getSeconds()).padStart(2, '0');

    const map = { dd, mm, yyyy, yy, HH, MM, SS };

    return format.replace(/dd|mm|yyyy|yy|HH|MM|SS/g, (token) => map[token] || '');
}

HOMEOSAPP.exportRepost = async function( checkReport, type, startDate, endDate, reportType, isViewer) {
    if (isViewer)
        this.IsViewer = isViewer;
    const data = JSON.parse(localStorage.getItem("itemHistory"));
    // const datetesst =  DateFormatServerToLocal(Sdate.toISOString(), 'dd/mm/yy');
    // var c = [{"ID":"091840","NAME":"Trực Ninh","IDFIELD":"WORKSTATION_ID","NAMETABLE":"DM_WORKSTATION","REPORT_ID":"RPT_API_MOBILE"},{"ID":"RT","NAME":"Thiết bị đo nhiệt độ","IDFIELD":"ZONE_PROPERTY","NAMETABLE":"VW_COMMAND","REPORT_ID":"RPT_API_MOBILE"}]
    var c = [];
    var linkbase;
    var nameReport;
    if(checkReport == 'KTTV'){
        linkbase = 'https://'+data.domain+'/Service/Service.svc/';
        // c = [{"ID":data.CodeWorkStation,"NAME":data.NameWorkStation,"IDFIELD":"WORKSTATION_ID","NAMETABLE":"DM_WORKSTATION","REPORT_ID":"RPT_API_MOBILE"},{"ID":reportType,"NAME":"","IDFIELD":"ZONE_PROPERTY","NAMETABLE":"VW_COMMAND","REPORT_ID":"RPT_API_MOBILE"}];
        nameReport = reportType;
    } else {
        linkbase = 'https://central.homeos.vn/service_XD/service.svc/';
        const data = JSON.parse(localStorage.getItem("itemCondition"));
        const qrCodeParts = data[0].QR_CODE.split(',');
        c = [{"ID":qrCodeParts[3],"NAME":"","IDFIELD":"","NAMETABLE":"DM_WORKSTATION","REPORT_ID": reportType}]
        // c = [{"ID":"12929172","NAME":"Tủ chị Hà tầng 1","IDFIELD":"WORKSTATION_ID","NAMETABLE":"DM_WORKSTATION","REPORT_ID":"RPT_BAO_CAO"}]
        nameReport = reportType;
    }
    const dataUser = await checkRoleUser("dev", HOMEOSAPP.sha1Encode("1" + "@1B2c3D4e5F6g7H8").toString(), linkbase, "Export");
    
    var val = [];
    
    // val.url = 'https://central.homeos.vn/service_XD/service.svc/' + "GenerateReportOther";
    val.url = linkbase + "GenerateReportOther";
    // this.generateCondition();
    val.data = {
        // Uid: 'admin',
        // Sid: 'cb880c13-5465-4a1d-a598-28e06be43982',
        Uid: dataUser[0].StateName,
        Sid: dataUser[0].StateId,
        PRid: nameReport,
        Rid: nameReport,
        Sd: DateFormatServerToLocal(startDate, 'yyyy/mm/dd'),
        Ed: DateFormatServerToLocal(endDate, 'yyyy/mm/dd'),
        // St: this.txtFromTime.Value(),
        // Et: this.txtToTime.Value(),
        c: JSON.stringify(c),
        type: type
    };
    val.type = "POST";
    val.dataType = "jsonp";
    val.crossDomain = true;
    val.contentType = "application/json; charset=utf-8";
    val.complete = function (data) {
        // finishLoading();
    };
    val.error = function (e, b) {
        alert(b);
        // finishLoading();
    };
    val.success = function (msg) {
        var state = msg;
        
        try {
            state = JSON.parse(msg);
            $('#submitExport').css({
                'background-color': '#2c697b',
                'border': 'solid 1px #2c697b'
            });
        
            // Đổi nội dung text
            $('#submitExport').text('Xuất dữ liệu báo cáo (excel)');

            toastr.error("Xuất báo cáo lỗi, vui lòng kiểm tra lại");
            console.log(state);
            // this.MessageBox(state.StateName, "danger", "")
            return;
        } catch (e) {
            state = msg;
        }
        if (state != 'error') {
            if (this.IsViewer) {
                var link = HomeOS.linkbase().toLowerCase().replace('service.svc/', '') + '' + msg;
                link = link.replace('service.svc/', '');
                
                // this.transOutput.LinkDocument = link;
                if (!this.transOutput.is_Initial) {
                    this.transOutput.Form_Loaded = function () {
                        // this.transOutput.fullScreen();
                        // this.transOutput.SetUrl();
                    }.bind(this);
                    this.transOutput.initial(function () {
                        this.transOutput.Show();
                    }.bind(this));
                }
                else {
                    this.transOutput.SetUrl(link);
                    this.transOutput.Show();
                }
                $('#submitExport').css({
                    'background-color': '#2c697b',
                    'border': 'solid 1px #2c697b'
                });
                // Đổi nội dung text
                $('#submitExport').text('Xuất dữ liệu báo cáo (excel)');
            }
            else {
                const urlservice = linkbase
                // const urlservice = 'https://central.homeos.vn/service_XD/service.svc/'
                var link = urlservice.replace('service.svc/', '') + '' + msg;
                link = link.replace('service.svc/', '');
                link = link.replace('Service.svc/', '');
                // link = link.replace('pdf', 'xls');
                if(window.downloadFileToDevice){
                    window.downloadFileToDevice(link);
                    
                    toastr.success("download file thành công ");
                } else {
                    // window.open(link, "download");
                    const a = document.createElement('a');
                    a.href = link;
                    a.download = link.split('/').pop(); // tự lấy tên file từ URL
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                }
                $('#submitExport').css({
                    'background-color': '#2c697b',
                    'border': 'solid 1px #2c697b'
                });
                // Đổi nội dung text
                $('#submitExport').text('Xuất dữ liệu báo cáo (excel)');
                HOMEOSAPP.callBackExport(link);
            }
        }
        else {
            this.checkError(msg);
        }
        this.IsViewer = false;
    }.bind(this);
    $.ajax(val);
}

$('#submitExport').click(function () {
    $('#submitExport').css({
        'background-color': '#f39c12',
        'border': 'solid 1px #f39c12'
    });

    // Đổi nội dung text
    $('#submitExport').text('Đang xuất dữ liệu...');
    
    let reportType;
    let checkReport;
    if(HOMEOSAPP.checkTabHistory == 1){
        reportType = $('#KTTV_Report').val();
        checkReport = 'KTTV'
    } else if(HOMEOSAPP.checkTabHistory == 2){
        reportType = $('#nameReport').val();
        checkReport = 'CONTROL'
    }
    const startDate = $('#startDate').val();
    const endDate = $('#endDate').val();

    HOMEOSAPP.exportRepost(checkReport, 'E', startDate, endDate, reportType);
    // Bạn có thể xử lý tiếp ở đây, ví dụ:
    // Gọi API, tạo URL báo cáo, hiển thị kết quả...
});

HOMEOSAPP.sha1Encode = function(message) {
    function rotate_left(n, s) {
        return (n << s) | (n >>> (32 - s));
    }

    function cvt_hex(val) {
        let str = "";
        let i;
        let v;
        for (i = 7; i >= 0; i--) {
            v = (val >>> (i * 4)) & 0x0f;
            str += v.toString(16);
        }
        return str;
    }

    function utf8_encode(str) {
        return unescape(encodeURIComponent(str));
    }

    let blockstart;
    let i, j;
    const W = new Array(80);
    let H0 = 0x67452301;
    let H1 = 0xEFCDAB89;
    let H2 = 0x98BADCFE;
    let H3 = 0x10325476;
    let H4 = 0xC3D2E1F0;
    let A, B, C, D, E;
    let temp;

    message = utf8_encode(message);
    const msg_len = message.length;

    const word_array = [];
    for (i = 0; i < msg_len - 3; i += 4) {
        j = (message.charCodeAt(i) << 24) |
            (message.charCodeAt(i + 1) << 16) |
            (message.charCodeAt(i + 2) << 8) |
            message.charCodeAt(i + 3);
        word_array.push(j);
    }

    switch (msg_len % 4) {
        case 0:
            i = 0x080000000;
            break;
        case 1:
            i = (message.charCodeAt(msg_len - 1) << 24) | 0x0800000;
            break;
        case 2:
            i = (message.charCodeAt(msg_len - 2) << 24) |
                (message.charCodeAt(msg_len - 1) << 16) |
                0x08000;
            break;
        case 3:
            i = (message.charCodeAt(msg_len - 3) << 24) |
                (message.charCodeAt(msg_len - 2) << 16) |
                (message.charCodeAt(msg_len - 1) << 8) |
                0x80;
            break;
    }

    word_array.push(i);

    while ((word_array.length % 16) !== 14) word_array.push(0);

    word_array.push(msg_len >>> 29);
    word_array.push((msg_len << 3) & 0x0ffffffff);

    for (blockstart = 0; blockstart < word_array.length; blockstart += 16) {
        for (i = 0; i < 16; i++) W[i] = word_array[blockstart + i];
        for (i = 16; i <= 79; i++) W[i] = rotate_left(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1);

        A = H0;
        B = H1;
        C = H2;
        D = H3;
        E = H4;

        for (i = 0; i <= 19; i++) {
            temp = (rotate_left(A, 5) + ((B & C) | (~B & D)) + E + W[i] + 0x5A827999) & 0x0ffffffff;
            E = D;
            D = C;
            C = rotate_left(B, 30);
            B = A;
            A = temp;
        }

        for (i = 20; i <= 39; i++) {
            temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff;
            E = D;
            D = C;
            C = rotate_left(B, 30);
            B = A;
            A = temp;
        }

        for (i = 40; i <= 59; i++) {
            temp = (rotate_left(A, 5) + ((B & C) | (B & D) | (C & D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff;
            E = D;
            D = C;
            C = rotate_left(B, 30);
            B = A;
            A = temp;
        }

        for (i = 60; i <= 79; i++) {
            temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff;
            E = D;
            D = C;
            C = rotate_left(B, 30);
            B = A;
            A = temp;
        }

        H0 = (H0 + A) & 0x0ffffffff;
        H1 = (H1 + B) & 0x0ffffffff;
        H2 = (H2 + C) & 0x0ffffffff;
        H3 = (H3 + D) & 0x0ffffffff;
        H4 = (H4 + E) & 0x0ffffffff;
    }

    const sha1hash = cvt_hex(H0) + cvt_hex(H1) + cvt_hex(H2) + cvt_hex(H3) + cvt_hex(H4);
    return sha1hash.toLowerCase();
}

$("#share-workStation").click(function () {
    const item = JSON.parse(localStorage.getItem("itemHistory"));
    if(window.shareWorkStation){
        if(HOMEOSAPP.objApp.MENU_ID == 'KTTV'){
            window.shareWorkStation("Trạm quan trắc "+ item.NameWorkStation, 'https://central.homeos.vn/images/MiniAppLoadingScreen.png', HOMEOSAPP.objApp.MENU_SHARE_OWNER);
        } else if(HOMEOSAPP.objApp.MENU_ID == 'CONTROL') {
            const dataItemLink = HOMEOSAPP.itemlinkQR;
            window.shareWorkStation( dataItemLink[0].NAME_DEVICE +"-"+ dataItemLink[0].WORKSTATION_ID, 'https://central.homeos.vn/images/cabinetConditionPNJ.jpg', HOMEOSAPP.objApp.MENU_SHARE_OWNER);
        }
    } else {

    }
});

HOMEOSAPP.openTabSchedule = function(evt, tabName) {
    // Ẩn tất cả nội dung tab và bỏ class 'active'
    $('.tab-content-schedule').removeClass('active');
    $('.tablinkSchedule').removeClass('active');

    // Hiển thị tab được chọn và thêm class 'active' cho nút đã nhấn
    $('#' + tabName).addClass('active');
    $(evt.currentTarget).addClass('active');

    if (typeof map !== 'undefined' && map) {
        map.invalidateSize();
    }
}

HOMEOSAPP.showElement = function(...ids) {
    ids.forEach(id => {
        document.getElementById(id)?.classList.remove("hidden", "d-none");
    });
}

HOMEOSAPP.hideElement = function(...ids) {
    ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.classList.add("fade-out"); // thêm hiệu ứng mờ dần
            setTimeout(() => {
                el.classList.add("hidden", "d-none");
                el.classList.remove("fade-out");
            }, 500); // chờ animation xong rồi mới ẩn
        }
    });
}

function formatPhoneNumber(phone) {
    if (phone.startsWith("84")) {
        return "0" + phone.slice(2);
    }
    return phone;
}

HOMEOSAPP.handleLogin = async function() {
    if (window.GetUser) {
        await window.GetUser();
        let dataPhone;
        // if(window.getPhoneNum){
        //     const tokenPhone = await window.getPhoneNum();
        //     const token = await window.getUserAccessToken();
        //     dataPhone = await HOMEOSAPP.getPhoneNumberByUserZalo("https://central.homeos.vn/service_XD/service.svc", token, tokenPhone);
            
        // }
        DataUser = JSON.parse(localStorage.getItem("userInfo"));
        $(".userName").text(DataUser.name);
        $(".userAvt").attr("src", DataUser.avatar);
        // document.getElementById("PickApp-button-login").classList.add("d-none");
        const dataUserResponse = await HOMEOSAPP.getDM("https://central.homeos.vn/service_XD/service.svc", "WARRANTY_USER", "USER_ID='" + UserID + "'");
        console.log(dataUserResponse);
        if (dataUserResponse.data.length === 0) {
            if(window.getPhoneNum){
                const tokenPhone = await window.getPhoneNum();
                const token = await window.getUserAccessToken();
                dataPhone = await HOMEOSAPP.getPhoneNumberByUserZalo("https://central.homeos.vn/service_XD/service.svc", token, tokenPhone);
            }
            const willInsertData = {
                USER_ID: DataUser.id,
                USER_NAME: DataUser.name,
                USER_ROLE: "GUEST",
                USER_PHONE_NUM: formatPhoneNumber(dataPhone),
                DATE_CREATE: new Date(),
                DATASTATE: "ADD",
            };
            HOMEOSAPP.add('WARRANTY_USER', willInsertData);
        } else if(dataUserResponse.data[0].USER_PHONE_NUM == null) {
            if(window.getPhoneNum){
                const tokenPhone = await window.getPhoneNum();
                const token = await window.getUserAccessToken();
                dataPhone = await HOMEOSAPP.getPhoneNumberByUserZalo("https://central.homeos.vn/service_XD/service.svc", token, tokenPhone);
            }
            const data = dataUserResponse.data[0];
            const willInsertData = {
                PR_KEY: data.PR_KEY,
                USER_ID: data.USER_ID,
                USER_NAME: data.USER_NAME,
                USER_ROLE: data.USER_ROLE,
                USER_PHONE_NUM: formatPhoneNumber(dataPhone),
                DATE_CREATE: data.DATE_CREATE,
                DATASTATE: "EDIT",
            };
            HOMEOSAPP.add('WARRANTY_USER', willInsertData);
        } else {
            localStorage.setItem('UserLogin', dataUserResponse.data[0]);
        }
    }
}

$("#BackCodeQR").off("click").click(function () {
    const modal = document.getElementById("share-popup");
    modal.classList.add("closing");
    setTimeout(() => {
        modal.classList.remove("closing");
        HOMEOSAPP.goBack();
    }, 300);
});

$("#BackExportCondition").click(function () {
    const modal = document.getElementById("export-condition-popup");
    modal.classList.add("closing");
    setTimeout(() => {
        modal.classList.remove("closing");
        HOMEOSAPP.goBack();
    }, 300);
});

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

HOMEOSAPP.getDataOEE = function(NAME_TAG) {
    const url = "https://central.homeos.vn/service_XD/service.svc/";

    return new Promise((resolve, reject) => {
        $.ajax({
            url: url + "ApiServicePublic/" + "GetDataOEEZaloApp" + "/" + "NAME_TAG=" + NAME_TAG,
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

HOMEOSAPP.checkPermissionDevice = async function (data) {
    const serviceUrl = "https://central.homeos.vn/service_XD/service.svc";
    let OWNER_SHIP_LEVEL = 0;
    let DataUser;
    
    // Lấy dữ liệu quyền sở hữu từ QR code
    const dataPermission = await HOMEOSAPP.getDM(
        serviceUrl,
        "ZALO_OWNER_SHIP_DEVICE",
        `PR_KEY_QRCODE='${data.PR_KEY}'`
    );

    if (!dataPermission.data?.length) {
        // Không có quyền nào trong DB
        return true;
    }

    // Lấy số điện thoại đăng nhập
    DataUser = JSON.parse(localStorage.getItem("userInfo"));
    if(!DataUser){
        await HOMEOSAPP.handleLogin();
    }
    DataUser = JSON.parse(localStorage.getItem("userInfo"));
    console.log(DataUser);
    
    let userLogin = JSON.parse(localStorage.getItem('UserLogin'));
    let dataPhone = userLogin?.USER_PHONE_NUM || '';

    // Nếu không có thì cố gắng lấy từ Zalo
    if (!dataPhone && window.getPhoneNum) {
        try {
            const tokenPhone = await window.getPhoneNum();
            const token = await window.getUserAccessToken();
            dataPhone = await HOMEOSAPP.getPhoneNumberByUserZalo(serviceUrl, token, tokenPhone);
        } catch (err) {
            toastr.error("Lỗi khi lấy số điện thoại từ Zalo!");
            return false;
        }
    }

    // Nếu vẫn không có số điện thoại => thoát
    if (!dataPhone) {
        toastr.error("Vui lòng cung cấp Số Điện Thoại để chúng tôi xác định quyền truy cập.");
        return false;
    }

    // Lọc quyền theo số điện thoại
    const matched = dataPermission.data.find(item => item.USER_PHONE_NUMBER === formatPhoneNumber(dataPhone));

    if (!matched) {
        if(window.paramObjects.Q){
            if(window.paramObjects.Q == 'OWNER'){
                OWNER_SHIP_LEVEL = 1;
            } else if(window.paramObjects.Q == 'ADMIN'){
                OWNER_SHIP_LEVEL = 2;
            } else if(window.paramObjects.Q == 'GUEST'){
                OWNER_SHIP_LEVEL = 3;
            }
            if(OWNER_SHIP_LEVEL == 1){
                const userOwner = dataPermission.data.find(item => item.OWNER_SHIP_LEVEL == 1);
                const InsertDataEdit = {
                    PR_KEY: userOwner.PR_KEY,
                    PR_KEY_QRCODE: userOwner.PR_KEY_QRCODE,
                    Z_USER_ID: userOwner.Z_USER_ID,
                    USER_PHONE_NUMBER: userOwner.USER_PHONE_NUMBER,
                    DATE_CREATE: userOwner.DATE_CREATE,
                    OWNER_SHIP_LEVEL: 2,
                    ACTIVE: 1,
                    DATASTATE: "EDIT",
                };
                await HOMEOSAPP.add('ZALO_OWNER_SHIP_DEVICE', InsertDataEdit);
                const qrParts = data.QR_CODE.split(',');
                const seri = (qrParts.length === 4) ? qrParts[3] : qrParts[2].substring(1);
                const P_KEY = HOMEOSAPP.sha1Encode(seri + formatPhoneNumber(dataPhone) + "@1B2c3D4e5F6g7H8").toString()
                const InsertData = {
                    PR_KEY_QRCODE: data.PR_KEY,
                    Z_USER_ID: DataUser.id,
                    USER_PHONE_NUMBER: formatPhoneNumber(dataPhone),
                    P_KEY: P_KEY,
                    DATE_CREATE: new Date(),
                    OWNER_SHIP_LEVEL: OWNER_SHIP_LEVEL,
                    ACTIVE: 1,
                    DATASTATE: "ADD",
                };
                await HOMEOSAPP.add('ZALO_OWNER_SHIP_DEVICE', InsertData);
            } else {
                
                const InsertData = {
                    PR_KEY_QRCODE: data.PR_KEY,
                    Z_USER_ID: DataUser.id,
                    USER_PHONE_NUMBER: formatPhoneNumber(dataPhone),
                    DATE_CREATE: new Date(),
                    OWNER_SHIP_LEVEL: OWNER_SHIP_LEVEL,
                    ACTIVE: 1,
                    DATASTATE: "ADD",
                };
                await HOMEOSAPP.add('ZALO_OWNER_SHIP_DEVICE', InsertData);
            }
            
        } else {
            toastr.error("Bạn chưa có quyền truy cập!");
            return false;
        }
    }

    // So sánh P_KEY nếu cần
    const qrParts = data.QR_CODE.split(',');
    const expectedP_KEY = HOMEOSAPP.sha1Encode(qrParts[2].substring(1) + dataPhone + "@1B2c3D4e5F6g7H8").toString();

    // Dù có khớp hay không, vẫn lấy LeverPermission (nếu logic của bạn cho phép)
    if(OWNER_SHIP_LEVEL == 0){
        HOMEOSAPP.LeverPermission = matched.OWNER_SHIP_LEVEL;
    } else {
        HOMEOSAPP.LeverPermission = OWNER_SHIP_LEVEL;
    }
    return true;
};

HOMEOSAPP.generateQRCode = function(text, targetId) {
    QRCode.toCanvas(text, { width: 200 }, function (error, canvas) {
        if (error) {
            console.error("Lỗi khi tạo mã QR:", error);
            alert('Lỗi khi tạo mã QR!');
            return;
        }

        // Xóa nội dung cũ (nếu cần)
        $('#' + targetId).empty();

        // Thêm canvas vào DOM
        $('#' + targetId).append(canvas);

        // Tạo ảnh từ canvas (ẩn đi nếu cần dùng)
        const image = canvas.toDataURL('image/png');
        const img = $('<img>')
            .attr('src', image)
            .css({ display: 'none' })
            .attr('id', 'hidden-image');
        
        $('#' + targetId).append(img);
    });
}

HOMEOSAPP.delay = function(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

HOMEOSAPP.addObj = function(type, code) {
    HOMEOSAPP.objApp.SHARE = {
        SHARE_TYPE: type,
        SHARE_CODE: code
    };
    if(type == 'CK'){
        console.log(code);
        
        HOMEOSAPP.objApp.MENU_SHARE_OWNER += code;
        HOMEOSAPP.objApp.MENU_SHARE_ADMIN += code;
        HOMEOSAPP.objApp.MENU_SHARE_GUEST += code;
    } else {
        HOMEOSAPP.objApp.MENU_SHARE_OWNER += code;
    }
}

HOMEOSAPP.updateTranNo = function(result, tableName, tranNo, lengthKey) {
    const willInsertData = {
        PR_KEY: 17,
        TABLE_NAME: tableName,
        TRAN_NO: tranNo,
        ORGANIZATION_ID: '',
        AUTO_KEY: result,
        LENGTH_KEY: lengthKey,
        DATASTATE: "EDIT",
    };
    console.log(willInsertData);
    
    HOMEOSAPP.add('PRODUCT_PUBLISH', willInsertData);
}

HOMEOSAPP.getTranNo = async function(value, TYPE, table_name){
    try {
        if(TYPE == 'GET'){
            const data = await HOMEOSAPP.getDM(HOMEOSAPP.linkbase, 'SYS_TRAN_NO', "TABLE_NAME='"+table_name+"'");
            const state = data.data
            console.log(state);
            let temp = state[0].TRAN_NO || null;
            temp = temp.replace(/\[YEAR\]/g, (new Date()).getFullYear());
            temp = temp.replace(/\[MONTH\]/g, ((new Date()).getMonth() + 1).toString().padStart(2, '0'));
            temp = temp.replace(/\[DAY\]/g, (new Date()).getDate().toString().padStart(2, '0'));
            temp = temp.replace(/\[HOUR\]/g, (new Date()).getHours().toString().padStart(2, '0'));
            temp = temp.replace(/\[MINUTE\]/g, (new Date()).getMinutes().toString().padStart(2, '0'));
            temp = temp.replace(/\[SECOND\]/g, (new Date()).getSeconds().toString().padStart(2, '0'));
            let auto_key = state[0].AUTO_KEY;
            auto_key += 1;
            const code = temp.replace(/\[AUTO_KEY\]/g, (auto_key).toString().padStart(state[0].LENGTH_KEY, '0'));
            console.log(auto_key, state[0].TABLE_NAME, state[0].TRAN_NO, state[0].LENGTH_KEY);
            
            // updateTranNo(auto_key, state[0].TABLE_NAME, state[0].TRAN_NO, state[0].LENGTH_KEY);
            return code; 
        } else {
            let temp = value;
            temp = temp.replace(/\[YEAR\]/g, (new Date()).getFullYear());
            temp = temp.replace(/\[MONTH\]/g, ((new Date()).getMonth() + 1).toString().padStart(2, '0'));
            temp = temp.replace(/\[DAY\]/g, (new Date()).getDate().toString().padStart(2, '0'));
            temp = temp.replace(/\[HOUR\]/g, (new Date()).getHours().toString().padStart(2, '0'));
            temp = temp.replace(/\[MINUTE\]/g, (new Date()).getMinutes().toString().padStart(2, '0'));
            temp = temp.replace(/\[SECOND\]/g, (new Date()).getSeconds().toString().padStart(2, '0'));
            
            return temp;
        }
        
    } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
    }
}

setTimeout(async () => {
    HOMEOSAPP.hideElement("LoadScreen", "LogoLoadScreen");
    historyItems = JSON.parse(localStorage.getItem('dataHistory'));
    const serviceUrl = "https://central.homeos.vn/service_XD/service.svc";
    const data = await HOMEOSAPP.getDM(
        serviceUrl,
        "ZALO_MENU_IOT_SMART",
        `1=1`
    );
    if(data.data){
        // HOMEOSAPP.apps = data.data
    }
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
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    if(urlParams){
        const paramObject = {};
        urlParams.forEach((value, key) => {
        paramObject[key] = value;
        });
        window.paramObjects = paramObject;
    }
    let checkparam = false;
    if(window.paramObjects){
        console.log(window.paramObjects);
        console.log(window.paramObjects.WID);
        
        if(window.paramObjects.CID){
            HOMEOSAPP.application = "CONTROL";
            HOMEOSAPP.checkTabHistory = 2;
            HOMEOSAPP.controlID = window.paramObjects.CID;
            checkparam = true;
        } else if(window.paramObjects.CK){
            HOMEOSAPP.application = "WARRANTY";
            HOMEOSAPP.checkTabHistory = 3;
            HOMEOSAPP.checkTabMenu = "DetailDevice";
            checkparam = true;
        } else if(window.paramObjects.WID) {
            HOMEOSAPP.application = "KTTV";
            HOMEOSAPP.checkTabHistory = 1;
            HOMEOSAPP.workstationID = window.paramObjects.WID;
            checkparam = true;
        }
        if(checkparam){
            const app = HOMEOSAPP.apps.find(a => a.MENU_ID === HOMEOSAPP.application);
            HOMEOSAPP.objApp = app;
            let historyStack = JSON.parse(localStorage.getItem('historyStack')) || [];
            historyStack.push("https://miniapp-new.vercel.app/src/pages/menu/menu.html");
            historyStack.push("https://miniapp-new.vercel.app/src/pages/History/history.html");
            localStorage.setItem('historyStack', JSON.stringify(historyStack));
            HOMEOSAPP.loadPage("https://miniapp-new.vercel.app/src/pages/ScanQR/scanQR.html");
        }
    }
    if(!checkparam){
        localStorage.setItem('dataHistory', JSON.stringify(historyItems));
        
        const saved = localStorage.getItem("selectedApps");
        if (saved) {
            HOMEOSAPP.loadPage("https://miniapp-new.vercel.app/src/pages/menu/menu.html");
        } else {
            $("#content-block").load("https://miniapp-new.vercel.app/src/pages/UserSelection/userSelection.html");
        }
    }
}, 1000);