var UserID = localStorage.getItem("userID");
var DataUser = JSON.parse(localStorage.getItem("userInfo"));

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
    { id: "warranty", name: "Bảo hành", version: "v1.0.4", description: "Bảo hành sản phẩm", bgColor: "#e29038", icon: "bi-tools", visible: true },
    { id: "CONTROL", name: "Điều khiển", version: "v1.0.3", description: "Điều khiển, giám sát năng lượng", bgColor: "#17a2b8", icon: "bi-toggles", visible: true }
];

function renderApps(apps, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";
    let delay = 0;

    apps.forEach(app => {
        delay += 0.1;
        const visibilityClass = app.visible ? "" : "d-none";
        const html = `
        <div class="col-12 ${visibilityClass} m-0" style="padding: 5px 10px; position: relative; overflow: hidden; height: 90px;">
            <div class="zoom-box slide-in-right" style="animation-delay: ${delay}s;">
                <div id="PickApp-button-${app.id}" class="iconApp" onclick="pickApp('${app.id.toUpperCase()}')">
                    <div class="icon d-flex align-items-center justify-content-center"
                         style="background-color: ${app.bgColor}; width: 60px; height: 60px; border-radius: 10px;">
                        <i class="bi ${app.icon}" style="font-size: 2rem; color: #fff;"></i>
                    </div>
                    <div class="info-box-content">
                        <div class="d-flex justify-content-between">
                            <span class="app-text">${app.name}</span>
                            <span class="app-text">${app.version}</span>
                        </div>
                        <span class="app-text-number" style="overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">${app.description}</span>
                    </div>
                </div>
            </div>
        </div>
        `;
        container.innerHTML += html;
    });

    // 👉 Ô "Thêm mới ứng dụng"
    const addNewHTML = `
    <div class="col-12 m-0" style="padding: 5px 10px; position: relative; overflow: hidden; height: 90px;">
    <div class="zoom-box slide-in-right" style="animation-delay: ${delay + 0.1}s;">
        <div class="iconApp add-app-box text-center" onclick="onAddNewApp()">
        <div class="d-flex flex-column justify-content-center align-items-center h-100 w-100">
            <i class="bi bi-plus-lg add-icon-plus"></i>
            <span class="add-text-label">Thêm hoặc ẩn ứng dụng</span>
        </div>
        </div>
    </div>
    </div>
    `;
    container.innerHTML += addNewHTML;

    // Sự kiện hiệu ứng
    document.querySelectorAll('.zoom-box').forEach((box) => {
        box.addEventListener('click', () => {
            box.classList.toggle('zoom-out');
        });
    });
}

function onAddNewApp() {
    HOMEOSAPP.loadPage("https://central.homeos.vn/singlepage/workstation/src/pages/UserSelection/userSelection.html");
}

function getSelectedAppsOrDefault() {
    const saved = localStorage.getItem("selectedApps");
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            // kiểm tra hợp lệ
            if (Array.isArray(parsed) && parsed.length > 0) {
                return parsed;
            }
        } catch (e) {
            console.error("Lỗi parse localStorage:", e);
        }
    }
    return apps; // fallback
}

HOMEOSAPP.handleUser("home");
var appData = getSelectedAppsOrDefault();
renderApps(appData, "app-list");
$("#PickApp-button-login").off("click").click(function () {
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

        case 'HISTORY':
            showHistory();
            break;

        case 'WARRANTY':
            HOMEOSAPP.application = "WARRANTY";
            await HOMEOSAPP.handleWarrantyApp("IN");
            break;

        case 'LOGIN':
            await handleLogin();
            break;

        case 'CONTROL':
            HOMEOSAPP.application = "CONTROL";
            HOMEOSAPP.handleControlApp("IN");
            break;
    }
}

// ✅ Các hàm xử lý riêng
function handleMuaApp() {
    HOMEOSAPP.showElement("LoadScreen", "img-station");

    HOMEOSAPP.loadPage("https://central.homeos.vn/singlepage/workstation/src/pages/History/history.html");
    setTimeout(() => {
        HOMEOSAPP.hideElement("LoadScreen", "img-station");

        $('#nameHistory').addClass("d-none");
        $('#nameHistory').removeClass("d-flex");
        $('#NameHistoryPage').text("Quan trắc:")
        // $('#descHistoryPage').text("Lịch sử truy cập")
        $('#historySelect').removeClass("d-none");
        $('#footerHistoryPage').text("thêm mới mã trạm hoặc chọn trạm đã lưu");

        $('.workstation_access').removeClass("d-none");
        $('.workstation_category').removeClass("d-none");
        $('.warranty_scansQRcode').addClass("d-none");
        $('.warranty_lot').addClass("d-none");
        $('.warranty_scanQRcode').addClass("d-none");

        HOMEOSAPP.checkTabHistory = 1;
    }, 1000);
}



// ✅ Helper hàm hiển thị / ẩn
