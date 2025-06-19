
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

    apps.forEach(app => {
        if (!app.visible) return;

        const html = `
        <div class="col-6">
            <div class="card h-100 shadow-sm border-0 rounded-3 app-card" id="app-${app.id}" onclick="toggleAppSelection('${app.id}')">
                <div class="card-body d-flex">
                    <div class="me-3 d-flex align-items-center justify-content-center rounded bg-primary" 
                         style="width: 50px; height: 50px; background-color: ${app.bgColor};">
                        <i class="bi ${app.icon} text-white fs-4"></i>
                    </div>
                    <div class="flex-grow-1">
                        <h6 class="card-title mb-1">${app.name}</h6>
                        <p class="card-subtitle small text-muted mb-1">${app.description}</p>
                        <span class="badge bg-secondary">${app.version}</span>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input mt-2" type="checkbox" id="checkbox-${app.id}" onclick="event.stopPropagation();">
                    </div>
                </div>
            </div>
        </div>
        `;
        container.innerHTML += html;
    });
}

function toggleAppSelection(appId) {
    const card = document.getElementById(`app-${appId}`);
    const checkbox = document.getElementById(`checkbox-${appId}`);

    card.classList.toggle("border-primary");
    card.classList.toggle("bg-light");
    checkbox.checked = !checkbox.checked;
}

$("#appSelection").click(()=>{
    getSelectedApps();
})

function getSelectedApps() {
    return Array.from(document.querySelectorAll('input.form-check-input:checked')).map(cb => cb.id.replace("checkbox-", ""));
}


renderApps(apps, "app-list");