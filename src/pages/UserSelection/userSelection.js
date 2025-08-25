var selectedApps = localStorage.getItem("selectedApps");
if (!selectedApps) {
    $("#BackSelection").addClass("d-none")
}
var apps = [
    { id: "KTTV", name: "Môi trường", version: "v1.1.5", description: "Khí tượng thuỷ văn", bgColor: "#17a2b8", icon: "bi-cloud-sun", visible: true },
    { id: "IOT", name: "Web OS", version: "v4.56 Pro", description: "IIoT", bgColor: "#da4a58", icon: "bi-pc-display-horizontal", visible: true },
    { id: "den", name: "Đèn", version: "v6.10.24", description: "Chiếu sáng thông minh", bgColor: "#28a745", icon: "bi-lightbulb-fill", visible: false },
    { id: "warranty", name: "Bảo hành", version: "v1.0.5", description: "Bảo hành sản phẩm", bgColor: "#e29038", icon: "bi-tools", visible: true },
    { id: "CONTROL", name: "Điều khiển", version: "v1.0.4", description: "Giám sát năng lượng", bgColor: "#17a2b8", icon: "bi-toggles", visible: true },
    { id: "Schedule", name: "Lịch công tác", version: "v1.0.1", description: "Xem lịch làm việc", bgColor: "#da4a58", icon: "bi-pc-display-horizontal", visible: true },
    { id: "Schedule", name: "Kho hàng", version: "v1.0.1", description: "Quản lý kho", bgColor: "#42a130", icon: "bi-box-seam", visible: true }
];

function renderApps(apps, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";

    let visibleIndex = 0;

    // ✅ Lấy selectedApps từ localStorage (dựa trên MENU_ID)
    const selectedAppsRaw = localStorage.getItem("selectedApps");
    const selectedApps = selectedAppsRaw ? JSON.parse(selectedAppsRaw).map(app => app.MENU_ID) : [];
    console.log(selectedApps);
    
    apps.forEach(app => {
        if (!app.VISIBLE) return;

        const paddingStyle = (visibleIndex % 2 === 0)
            ? 'padding-right: 10px; padding-left: 0;'
            : 'padding-left: 10px; padding-right: 0;';
        
        const isSelected = selectedApps.includes(app.MENU_ID);
        const selectedClass = isSelected ? 'selected-card' : '';

        const html = `
        <div class="col-6" style="${paddingStyle} margin-bottom: 10px;">
            <div class="card text-center border-0 p-2 app-card ${selectedClass}" 
                 id="app-${app.MENU_ID}" onclick="toggleAppSelection('${app.MENU_ID}')"
                 style="cursor: pointer; border-radius: 0.5rem;">
                <input type="checkbox" id="checkbox-${app.MENU_ID}" class="d-none" ${isSelected ? 'checked' : ''} />
                <div class="card-body d-flex flex-column align-items-center" style="padding: 1.25rem 0;">
                    <div class="icon-wrapper rounded-circle d-flex align-items-center justify-content-center mb-3"
                         style="background-color: ${app.MENU_BGCOLOR}; width: 60px; height: 60px;">
                        <i class="bi ${app.MENU_ICON} text-white fs-3" style="font-size: 25px"></i>
                    </div>
                    <h6 class="mb-1">${app.MENU_NAME}</h6>
                    <p class="mb-1 small" style="color: gray;">${app.DESCRIPTION}</p>
                    <span class="badge bg-secondary">${app.MENU_VERSION}</span>
                </div>
            </div>
        </div>
        `;

        container.innerHTML += html;
        visibleIndex++;
    });
}



function toggleAppSelection(appId) {
    const card = document.getElementById(`app-${appId}`);
    const checkbox = document.getElementById(`checkbox-${appId}`);

    card.classList.toggle("selected-card");
    checkbox.checked = !checkbox.checked;
}


$("#appSelection").click(()=>{
    saveSelectedAppsToLocal();
})

function saveSelectedAppsToLocal() {
    const selectedAppIds = [];

    HOMEOSAPP.apps.forEach(app => {
        const checkbox = document.getElementById(`checkbox-${app.MENU_ID}`);
        if (checkbox && checkbox.checked) {
            selectedAppIds.push(app.MENU_ID);
        }
    });

    if (selectedAppIds.length === 0) {
        toastr.error("Vui lòng chọn ít nhất 1 ứng dụng!");
        return;
    }

    // ✅ Lưu cả object app (không chỉ ID)
    const selectedApps = HOMEOSAPP.apps.filter(app => selectedAppIds.includes(app.MENU_ID));
    localStorage.setItem("selectedApps", JSON.stringify(selectedApps));

    const historyStack = JSON.parse(localStorage.getItem("historyStack")) || [];

    if (historyStack.length !== 0) {
        HOMEOSAPP.goBack();
        HOMEOSAPP.handleLogin();
    } else {
        HOMEOSAPP.loadPage("https://miniapp-new.vercel.app/src/pages/menu/menu.html");

        const DataUser = JSON.parse(localStorage.getItem("userInfo"));
        if (UserID && !DataUser) {
            HOMEOSAPP.handleLogin();
        }
    }
}

$("#BackSelection").click( () => {
    HOMEOSAPP.goBack();
})


renderApps(HOMEOSAPP.apps, "app-list");