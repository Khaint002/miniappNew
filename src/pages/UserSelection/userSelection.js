
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

    let visibleIndex = 0; // chỉ đếm các app visible

    apps.forEach(app => {
        if (!app.visible) return;

        // Padding trái/phải xen kẽ
        const paddingStyle = (visibleIndex % 2 === 0)
            ? 'padding-right: 6px; padding-left: 0;'
            : 'padding-left: 6px; padding-right: 0;';

        const html = `
        <div class="col-6 col-md-4 col-lg-3" style="${paddingStyle} margin-bottom: 12px;">
            <div class="card text-center border-0 p-2 app-card" id="app-${app.id}" onclick="toggleAppSelection('${app.id}')" style="cursor: pointer;">
                <input type="checkbox" id="checkbox-${app.id}" class="d-none" />
                <div class="card-body d-flex flex-column align-items-center">
                    <div class="icon-wrapper rounded-circle d-flex align-items-center justify-content-center mb-3"
                         style="background-color: ${app.bgColor}; width: 60px; height: 60px;">
                        <i class="bi ${app.icon} text-white fs-3"></i>
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
    const dataSelection = getSelectedApps();
    console.log(dataSelection);
    
})

function getSelectedApps() {
    return Array.from(document.querySelectorAll('input.form-check-input:checked')).map(cb => cb.id.replace("checkbox-", ""));
}


renderApps(apps, "app-list");