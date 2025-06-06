var UserID = localStorage.getItem("userID");
var DataUser = JSON.parse(localStorage.getItem("userInfo"));
console.log('chạy');

async function handleUser() {
    if (UserID) {
        try {
            if (DataUser && DataUser.id === UserID) {
                $(".userName").text(DataUser.name);
                document.getElementById("PickApp-button-login").classList.add("d-none");
                $(".userAvt").attr("src", DataUser.avatar);
                // document.getElementById("LogoPickScreen").style.paddingTop = "10vh";
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
        document.getElementById("download-QRcode").classList.add("d-none");
        // document.getElementById("LogoPickScreen").style.paddingTop = "10vh";
    }
    WarrantyCheckUser(localStorage.getItem("RoleUser"));
}
function WarrantyCheckUser(ROLE) {
    switch (ROLE) {
        case "GUEST":
            $(".warranty_scansQRcode").addClass("d-none");
            // document.getElementById('result-product-warranty').classList.add('hidden');
            $("#lotProduct").addClass("d-none");
            $(".warranty_lot").addClass("d-none");
            break;
        case "DISTRIBUTIVE":
            // $("#lotProduct").add("d-none");
            $(".warranty_lot").addClass("d-none");
            $(".warranty_scansQRcode").addClass("d-none");
            break;
        default:
            break;
    }
}

var apps = [
    { id: "KTTV", name: "Môi trường", version: "v1.1.5", description: "Khí tượng thuỷ văn", bgColor: "#17a2b8", icon: "bi-cloud-sun", visible: true },
    { id: "IOT", name: "Web OS", version: "v4.56 Pro", description: "IIoT", bgColor: "#da4a58", icon: "bi-pc-display-horizontal", visible: false },
    { id: "den", name: "Đèn", version: "v6.10.24", description: "Chiếu sáng thông minh", bgColor: "#28a745", icon: "bi-lightbulb-fill", visible: false },
    { id: "warranty", name: "Bảo hành", version: "v1.0.4", description: "Bảo hành sản phẩm", bgColor: "#e29038", icon: "bi-tools", visible: false },
    { id: "CONTROL", name: "Điều khiển", version: "v1.0.3", description: "Điều khiển, giám sát năng lượng", bgColor: "#17a2b8", icon: "bi-toggles", visible: false }
];

function renderApps(apps, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";

    apps.forEach(app => {
        const visibilityClass = app.visible ? "" : "d-none";
        const html = `
        <div class="col-12 ${visibilityClass}" style="padding: 5px 10px;">
          <div id="PickApp-button-${app.id}" class="iconApp" onclick="pickApp('${app.id.toUpperCase()}')">
            <div class="icon d-flex align-items-center justify-content-center" style="background-color: ${app.bgColor}; width: 60px; height: 60px; border-radius: 10px;">
              <i class="bi ${app.icon}" style="font-size: 2rem; color: #fff;"></i>
            </div>
            <div class="info-box-content">
              <div class="d-flex justify-content-between">
                <span class="app-text">${app.name}</span>
                <span class="app-text">${app.version}</span>
              </div>
              <span class="app-text-number">${app.description}</span>
            </div>
          </div>
        </div>
      `;
        container.innerHTML += html;
    });
}
HOMEOSAPP.handleUser("home");
renderApps(apps, "app-list");
$("#PickApp-button-login").click(function () {
    pickApp('LOGIN');
});
async function pickApp(type) {
    switch (type) {
        case 'KTTV':
            HOMEOSAPP.application = "KTTV";
            handleMuaApp();
            break;

        case 'IOT':
            window.location.href = "http://devices.homeos.vn/";
            break;

        case 'PICK':
            showElement("history");
            hideElement("ScanQR", "history-setting");
            showElement("history-homePage", false); // remove d-none
            break;

        case 'PRE':
            hideElement("history", "homePage", "guarantee", "ScanQRWarranty");
            showElement("pickApp", false);
            hideElement("menu-warranty", "footer-instruct-warranty");
            break;

        case 'HISTORY':
            showHistory();
            showElement("history");
            hideElement("homePage");
            break;

        case 'warranty':
            HOMEOSAPP.application = "warranty";
            await handleWarrantyApp();
            break;

        case 'LOGIN':
            await handleLogin();
            break;

        case 'CONTROL':
            HOMEOSAPP.application = "CONTROL";
            checkApp = type;
            showElement("history");
            hideElement("pickApp");
            runLed7();
            break;
    }
}

// ✅ Các hàm xử lý riêng
function handleMuaApp() {
    // showElement("LoadScreen", "img-station");
    $('#loading-popup').show();
    hideElement("pickApp");
    HOMEOSAPP.loadPage("https://sonlahpc.hymetco.com/singlepage/SONLAHPC/pages/History/history.html");
    setTimeout(() => {
        // hideElement("LoadScreen", "img-station");
        $('#loading-popup').hide();
        showElement("history");
        $('#NameHistoryPage').text("Quan trắc:")
        $('#descHistoryPage').text("Lịch sử truy cập")
        $('#historySelect').removeClass("d-none");
        $('#footerHistoryPage').text("thêm mới mã trạm hoặc chọn trạm đã lưu");

        $('.workstation_access').removeClass("d-none");
        $('.workstation_category').removeClass("d-none");
        $('.warranty_scansQRcode').addClass("d-none");
        $('.warranty_lot').addClass("d-none");
        $('.warranty_scanQRcode').addClass("d-none");

        // historyListDetail.empty();
        // showAddWorkStationButton();
        HOMEOSAPP.checkTabHistory = 1;
        // showHistory();
        // pickApp('MUA');
    }, 2000);
}

async function handleWarrantyApp() {
    checkApp = 'GUA';
    showElement("LoadScreen", "LogoLoadScreen", "history");
    hideElement("pickApp");
    showElement("footer-instruct-warranty", false);

    $(".warrantyDetailProduct").removeClass("d-none");
    $("#ScanAllQRcode").addClass("d-none");
    $("#lotProduct").addClass("d-none");
    checkTab = false;

    setTimeout(() => {
        hideElement("LoadScreen", "LogoLoadScreen");
    }, 2000);
}

async function handleLogin() {
    if (window.GetUser) {
        await window.GetUser();
        DataUser = JSON.parse(localStorage.getItem("userInfo"));
        $(".userName").text(DataUser.name);
        $(".userAvt").attr("src", DataUser.avatar);
        document.getElementById("PickApp-button-login").classList.add("d-none");
        // document.getElementById("LogoPickScreen").style.paddingTop = '10vh';

        const dataUserResponse = await HOMEOSAPP.getDM("https://central.homeos.vn/service_XD/service.svc", "WARRANTY_USER", "USER_ID='" + UserID + "'");
        if (dataUserResponse.data.length === 0) {
            const willInsertData = {
                USER_ID: DataUser.id,
                USER_NAME: DataUser.name,
                USER_ROLE: "GUEST",
                DATE_CREATE: new Date(),
                DATASTATE: "ADD",
            };
            add('WARRANTY_USER', willInsertData);
        }
    }
}

// ✅ Helper hàm hiển thị / ẩn
function showElement(...ids) {
    ids.forEach(id => {
        document.getElementById(id)?.classList.remove("hidden", "d-none");
    });
}

function hideElement(...ids) {
    ids.forEach(id => {
        document.getElementById(id)?.classList.add("hidden", "d-none");
    });
}