var selectedApps = localStorage.getItem("selectedApps");
if (!selectedApps) {
    $("#BackSelection").addClass("d-none")
}
var apps = [
    { id: "KTTV", name: "Môi trường", version: "v1.1.5", description: "Khí tượng thuỷ văn", bgColor: "#17a2b8", icon: "bi-cloud-sun", visible: true },
    { id: "IOT", name: "Web OS", version: "v4.56 Pro", description: "IIoT", bgColor: "#da4a58", icon: "bi-pc-display-horizontal", visible: true },
    { id: "den", name: "Đèn", version: "v6.10.24", description: "Chiếu sáng thông minh", bgColor: "#28a745", icon: "bi-lightbulb-fill", visible: false },
    { id: "warranty", name: "Bảo hành", version: "v1.0.5", description: "Bảo hành sản phẩm", bgColor: "#e29038", icon: "bi-tools", visible: true },
    { id: "CONTROL", name: "Điều khiển", version: "v1.0.3", description: "Giám sát năng lượng", bgColor: "#17a2b8", icon: "bi-toggles", visible: true }
];

function renderApps(apps, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";

    let visibleIndex = 0;

    // ✅ Lấy selectedApps từ localStorage
    const selectedAppsRaw = localStorage.getItem("selectedApps");
    const selectedApps = selectedAppsRaw ? JSON.parse(selectedAppsRaw).map(app => app.id) : [];

    apps.forEach(app => {
        if (!app.visible) return;

        const paddingStyle = (visibleIndex % 2 === 0)
            ? 'padding-right: 10px; padding-left: 0;'
            : 'padding-left: 10px; padding-right: 0;';

        // ✅ Nếu app.id có trong selectedApps → thêm class selected-card
        const isSelected = selectedApps.includes(app.id);
        const selectedClass = isSelected ? 'selected-card' : '';

        const html = `
        <div class="col-6" style="${paddingStyle} margin-bottom: 10px;">
            <div class="card text-center border-0 p-2 app-card ${selectedClass}" 
                 id="app-${app.id}" onclick="toggleAppSelection('${app.id}')"
                 style="cursor: pointer; border-radius: 0.5rem;">
                <input type="checkbox" id="checkbox-${app.id}" class="d-none" ${isSelected ? 'checked' : ''} />
                <div class="card-body d-flex flex-column align-items-center" style="padding: 1.25rem 0;">
                    <div class="icon-wrapper rounded-circle d-flex align-items-center justify-content-center mb-3"
                         style="background-color: ${app.bgColor}; width: 60px; height: 60px;">
                        <i class="bi ${app.icon} text-white fs-3" style="font-size: 25px"></i>
                    </div>
                    <h6 class="mb-1">${app.name}</h6>
                    <p class="text-muted mb-1 small">${app.description}</p>
                    <span class="badge bg-secondary">${app.version}</span>
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

    apps.forEach(app => {
        const checkbox = document.getElementById(`checkbox-${app.id}`);
        if (checkbox && checkbox.checked) {
            selectedAppIds.push(app.id);
        }
    });

    if (selectedAppIds.length === 0) {
        toastr.error("Vui lòng chọn ít nhấn 1 ứng dụng!");
        return;
    }

    // Lọc ra các app từ mảng gốc theo ID đã chọn
    const selectedApps = apps.filter(app => selectedAppIds.includes(app.id));

    // Lưu vào localStorage
    localStorage.setItem("selectedApps", JSON.stringify(selectedApps));
    let historyStack = JSON.parse(localStorage.getItem('historyStack')) || [];
    if(historyStack.length != 0){
        HOMEOSAPP.goBack();
        HOMEOSAPP.handleLogin();
    } else {
        HOMEOSAPP.loadPage("https://central.homeos.vn/singlepage/workstation/src/pages/menu/menu.html");
        DataUser = JSON.parse(localStorage.getItem("userInfo"));
        if (UserID && !DataUser) {
            HOMEOSAPP.handleLogin();
        }
    }
}
$("#BackSelection").click( () => {
    HOMEOSAPP.goBack();
})


renderApps(apps, "app-list");