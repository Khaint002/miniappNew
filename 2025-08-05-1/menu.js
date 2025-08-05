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
    { id: "CONTROL", name: "Điều khiển", version: "v1.0.3", description: "Điều khiển, giám sát năng lượng", bgColor: "#17a2b8", icon: "bi-toggles", visible: true },
    { id: "Schedule", name: "Lịch công tác", version: "v1.0.1", description: "Xem lịch làm việc", bgColor: "#da4a58", icon: "bi-pc-display-horizontal", visible: true }
];

function renderApps(apps, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";

    let delay = 0;
    let html = "";

    apps.forEach(app => {
        if (!app.VISIBLE) return;

        delay += 0.1;
        html += `
        <div class="col-12 m-0" style="padding: 5px 10px; position: relative; overflow: hidden; height: 90px;">
            <div class="zoom-box slide-in-right" style="animation-delay: ${delay}s;">
                <div id="PickApp-button-${app.MENU_ID}" class="iconApp" onclick="pickApp('${app.MENU_ID}')">
                    <div class="icon d-flex align-items-center justify-content-center"
                         style="background-color: ${app.MENU_BGCOLOR}; width: 60px; height: 60px; border-radius: 10px;">
                        <i class="bi ${app.MENU_ICON}" style="font-size: 2rem; color: #fff;"></i>
                    </div>
                    <div class="info-box-content">
                        <div class="d-flex justify-content-between">
                            <span class="app-text">${app.MENU_NAME}</span>
                            <span class="app-text">${app.MENU_VERSION}</span>
                        </div>
                        <span class="app-text-number" style="overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">${app.DESCRIPTION}</span>
                    </div>
                </div>
            </div>
        </div>
        `;
    });

    // ✅ Ô "Thêm hoặc ẩn ứng dụng"
    delay += 0.1;
    html += `
    <div class="col-12 m-0" style="padding: 5px 10px; position: relative; overflow: hidden; height: 90px;">
        <div class="zoom-box slide-in-right" style="animation-delay: ${delay}s;">
            <div class="iconApp add-app-box text-center" onclick="onAddNewApp()">
                <div class="d-flex flex-column justify-content-center align-items-center h-100 w-100">
                    <i class="bi bi-plus-lg add-icon-plus"></i>
                    <span class="add-text-label">Thêm hoặc ẩn ứng dụng</span>
                </div>
            </div>
        </div>
    </div>
    `;

    // ✅ Chỉ gán vào DOM một lần
    container.innerHTML = html;

    // ✅ Gán sự kiện hiệu ứng
    document.querySelectorAll('.zoom-box').forEach(box => {
        box.addEventListener('click', () => {
            box.classList.toggle('zoom-out');
        });
    });
}


function onAddNewApp() {
    HOMEOSAPP.loadPage("https://central.homeos.vn/singlepage/workstation/src/pages/UserSelection/userSelection.html");
}

function getSelectedAppsOrDefault() {
    const latestApps = HOMEOSAPP.apps;
    const latestMap = new Map(latestApps.map(app => [app.MENU_ID.toUpperCase(), app]));

    try {
        const saved = localStorage.getItem("selectedApps");
        if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed)) {
                const fixedApps = [];

                for (const oldApp of parsed) {
                    const id = (oldApp.MENU_ID || oldApp.id || "").toUpperCase();
                    const latest = latestMap.get(id);
                    if (latest && latest.VISIBLE) {
                        fixedApps.push(latest); // dùng phiên bản mới nhất từ HOMEOSAPP.apps
                    }
                }

                // Nếu danh sách sau khi lọc vẫn còn
                if (fixedApps.length > 0) {
                    localStorage.setItem("selectedApps", JSON.stringify(fixedApps));
                    return fixedApps;
                }
            }
        }
    } catch (e) {
        console.error("Lỗi parse localStorage:", e);
    }

    return [];
}



HOMEOSAPP.handleUser("home");
var appData = getSelectedAppsOrDefault();
renderApps(appData, "app-list");
$("#PickApp-button-login").off("click").click(function () {
    pickApp('LOGIN');
});
async function pickApp(type) {
    const app = HOMEOSAPP.apps.find(a => a.MENU_ID === type);
    HOMEOSAPP.objApp = app;
    switch (app.MENU_TYPE) {
        case 'LOAD':
            HOMEOSAPP.application = type;
            HOMEOSAPP.handleAppView(type, 'IN');
            break;

        case 'LOCATION':
            window.location.href = app.MENU_LINK;
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
