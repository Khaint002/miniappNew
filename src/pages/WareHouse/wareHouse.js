var apps_waveHouse = [
    { MENU_ID: "CREATELOT", MENU_NAME: "Tạo lô", MENU_VERSION: "v1.1.5", MENU_BGCOLOR: "#17a2b8", MENU_ICON: "bi-cloud-sun", MENU_SHARE_OWNER: "WID=", MENU_SHARE_ADMIN: null, MENU_SHARE_GUEST: null, MENU_TYPE: "LOAD", MENU_LINK: "https://miniapp-new.vercel.app/src/pages/History/history.html", DESCRIPTION: "Tạo lô QR", VISIBLE: true },
    { MENU_ID: "PRQRCODE", MENU_NAME: "In mã QR", MENU_VERSION: "v4.56 Pro", MENU_BGCOLOR: "#da4a58", MENU_ICON: "bi-pc-display-horizontal", MENU_SHARE_OWNER: null, MENU_SHARE_ADMIN: null, MENU_SHARE_GUEST: null, MENU_TYPE: "LOCATION", MENU_LINK: "http://devices.homeos.vn/", DESCRIPTION: "In mã QR", VISIBLE: true },
    { MENU_ID: "IMPORT", MENU_NAME: "Nhập kho", MENU_VERSION: "v1.0.5", MENU_BGCOLOR: "#e29038", MENU_ICON: "bi-tools", MENU_SHARE_OWNER: "Q=OWNER&CK=", MENU_SHARE_ADMIN: "Q=ADMIN&CK=", MENU_SHARE_GUEST: "Q=GUEST&CK=", MENU_TYPE: "LOAD", MENU_LINK: "https://miniapp-new.vercel.app/src/pages/History/history.html", DESCRIPTION: "Quét nhập kho", VISIBLE: true },
    { MENU_ID: "EXPORT", MENU_NAME: "Xuất kho", MENU_VERSION: "v1.0.4", MENU_BGCOLOR: "#17a2b8", MENU_ICON: "bi-toggles", MENU_SHARE_OWNER: "CID=", MENU_SHARE_ADMIN: null, MENU_SHARE_GUEST: null, MENU_TYPE: "LOAD", MENU_LINK: "https://miniapp-new.vercel.app/src/pages/History/history.html", DESCRIPTION: "Quét xuất kho", VISIBLE: true },
];

function renderApps(apps, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";

    let visibleIndex = 0;
    
    apps.forEach(app => {
        if (!app.VISIBLE) return;

        const paddingStyle = (visibleIndex % 2 === 0)
            ? 'padding-right: 10px; padding-left: 0;'
            : 'padding-left: 10px; padding-right: 0;';

        const html = `
        <div class="col-6" style="${paddingStyle} margin-bottom: 10px;">
            <div class="card text-center border-0 p-2 app-card" 
                 id="app-${app.MENU_ID}" onclick="connectAppWaveHouse('${app.MENU_ID}')"
                 style="cursor: pointer; border-radius: 0.5rem;">
                <input type="checkbox" id="checkbox-${app.MENU_ID}" class="d-none"/>
                <div class="card-body d-flex flex-column align-items-center" style="padding: 1.25rem 0;">
                    <div class="icon-wrapper rounded-circle d-flex align-items-center justify-content-center mb-3"
                         style="background-color: ${app.MENU_BGCOLOR}; width: 60px; height: 60px;">
                        <i class="bi ${app.MENU_ICON} text-white fs-3" style="font-size: 25px"></i>
                    </div>
                    <h6 class="mb-1">${app.MENU_NAME}</h6>
                    <p class="mb-1 small" style="color: gray;">${app.DESCRIPTION}</p>
                </div>
            </div>
        </div>
        `;
        container.innerHTML += html;
        visibleIndex++;
    });
}
function connectAppWaveHouse(ID) {
    
}

renderApps(apps_waveHouse, 'wareHouse-list');