// var apps_waveHouse = [
//     { MENU_ID: "CREATELOT", MENU_NAME: "Tạo lô", MENU_VERSION: "v1.1.5", MENU_BGCOLOR: "#17a2b8", MENU_ICON: "bi-cloud-sun", MENU_SHARE_OWNER: "WID=", MENU_SHARE_ADMIN: null, MENU_SHARE_GUEST: null, MENU_TYPE: "LOAD", MENU_LINK: "https://miniapp-new.vercel.app/src/pages/History/history.html", DESCRIPTION: "Quản lý lô hàng", VISIBLE: true },
//     { MENU_ID: "PRQRCODE", MENU_NAME: "In mã QR", MENU_VERSION: "v4.56 Pro", MENU_BGCOLOR: "#da4a58", MENU_ICON: "bi-pc-display-horizontal", MENU_SHARE_OWNER: null, MENU_SHARE_ADMIN: null, MENU_SHARE_GUEST: null, MENU_TYPE: "LOCATION", MENU_LINK: "http://devices.homeos.vn/", DESCRIPTION: "In mã QR", VISIBLE: true },
//     { MENU_ID: "IMPORT", MENU_NAME: "Kho sản phẩm", MENU_VERSION: "v1.0.5", MENU_BGCOLOR: "#e29038", MENU_ICON: "bi-tools", MENU_SHARE_OWNER: "Q=OWNER&CK=", MENU_SHARE_ADMIN: "Q=ADMIN&CK=", MENU_SHARE_GUEST: "Q=GUEST&CK=", MENU_TYPE: "LOAD", MENU_LINK: "https://miniapp-new.vercel.app/src/pages/History/history.html", DESCRIPTION: "Tồn kho", VISIBLE: true },
//     { MENU_ID: "EXPORT", MENU_NAME: "Xuất kho", MENU_VERSION: "v1.0.4", MENU_BGCOLOR: "#17a2b8", MENU_ICON: "bi-toggles", MENU_SHARE_OWNER: "CID=", MENU_SHARE_ADMIN: null, MENU_SHARE_GUEST: null, MENU_TYPE: "LOAD", MENU_LINK: "https://miniapp-new.vercel.app/src/pages/History/history.html", DESCRIPTION: "Quét xuất kho", VISIBLE: true },
// ];
var apps_waveHouse = [
    { MENU_ID: "WAREHOUSE_PRODUCT", MENU_NAME: "Kho Sản Phẩm", MENU_ICON: "bi-box-seam", MENU_BGCOLOR_CLASS: "bg-primary", DESCRIPTION: "Xem tồn kho, nhập, xuất", VISIBLE: true },
    { MENU_ID: "MATERIAL", MENU_NAME: "Kho Vật Tư", MENU_ICON: "bi-tools", MENU_BGCOLOR_CLASS: "bg-success", DESCRIPTION: "Quản lý vật tư sản xuất", VISIBLE: true },
    { MENU_ID: "CREATELOT", MENU_NAME: "Quản Lý Lô", MENU_ICON: "bi-stack", MENU_BGCOLOR_CLASS: "bg-warning", DESCRIPTION: "Tạo và sửa lô hàng", VISIBLE: true },
    { MENU_ID: "PRQRCODE", MENU_NAME: "Tạo QR", MENU_ICON: "bi-qr-code", MENU_BGCOLOR_CLASS: "bg-info", DESCRIPTION: "In mã QR cho sản phẩm", VISIBLE: true },
    { MENU_ID: "BOM_DECLARATION", MENU_NAME: "Khai báo BOM", MENU_ICON: "bi-diagram-3", MENU_BGCOLOR_CLASS: "bg-secondary", DESCRIPTION: "Định mức nguyên vật liệu", VISIBLE: true },
    { MENU_ID: "PRODUCTION_ORDER", MENU_NAME: "Lập Lệnh SX", MENU_ICON: "bi-building-gear", MENU_BGCOLOR_CLASS: "bg-danger", DESCRIPTION: "Tạo lệnh sản xuất mới", VISIBLE: true }
];

// --- FUNCTIONS ---
function renderApps(apps, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = "";

    apps.forEach(app => {
        if (!app.VISIBLE) return;
        
        // Determine text color based on background class for better contrast
        const textClass = ['bg-success', 'bg-warning', 'bg-info'].includes(app.MENU_BGCOLOR_CLASS) ? 'text-dark' : 'text-white';

        const html = `
        <div class="col-6">
            <div class="card p-3 text-center rounded-4 h-100" id="app-${app.MENU_ID}" onclick="connectAppWaveHouse('${app.MENU_ID}', '${app.MENU_NAME}')">
                <div class="icon-box ${app.MENU_BGCOLOR_CLASS} ${textClass} mx-auto mb-2"><i class="${app.MENU_ICON}"></i></div>
                <h3 class="h6 mb-1 text-body-emphasis">${app.MENU_NAME}</h3>
                <p class="small text-secondary mb-0">${app.DESCRIPTION}</p>
            </div>
        </div>`;
        container.insertAdjacentHTML('beforeend', html);
    });
    // // --- Theme Switcher Logic ---
    // const themeToggle = document.getElementById('theme-checkbox');
    // const htmlElement = document.documentElement;
    
    // // Function to set the theme
    // const setTheme = (theme) => {
    //     htmlElement.setAttribute('data-bs-theme', theme);
    //     localStorage.setItem('theme', theme);
    //     themeToggle.checked = theme === 'dark';
    // };

    // // Event listener for the toggle
    // themeToggle.addEventListener('change', () => {
    //     if (themeToggle.checked) {
    //         setTheme('dark');
    //     } else {
    //         setTheme('light');
    //     }
    // });

    // // Check for saved theme in localStorage or system preference
    // const savedTheme = localStorage.getItem('theme');
    // const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // if (savedTheme) {
    //     setTheme(savedTheme);
    // } else if (prefersDark) {
    //     setTheme('dark');
    // } else {
    //     setTheme('light');
    // }

    // // --- Greeting Logic ---
    // const dateElement = document.getElementById('current-date');
    // const now = new Date();
    // const hours = now.getHours();
    
    // let greeting = 'Chào bạn!';
    // if (hours < 12) {
    //     greeting = 'Chào buổi sáng!';
    // } else if (hours < 18) {
    //     greeting = 'Chào buổi chiều!';
    // } else {
    //     greeting = 'Chào buổi tối!';
    // }
    // dateElement.textContent = greeting;
}

function connectAppWaveHouse(ID, NAME) {
    // Ẩn màn chọn menu
    document.getElementById("wareHouse-menu").classList.add("d-none");
    document.getElementById("wareHouse-detail").classList.remove("d-none");

    // Ẩn tất cả màn chức năng
    document.querySelectorAll(".app-screen").forEach(div => div.classList.add("d-none"));
    if(ID == 'CREATELOT'){
        $('#productSelect').select2({
            placeholder: "-- Chọn sản phẩm --",
            allowClear: true,
            width: '100%',
            dropdownParent: $('#CREATELOT') // tránh lỗi z-index khi trong modal
        });
    } else if(ID == 'PRQRCODE'){
        runOptionS();
        showPrintOptions('detail');
    } else if(ID == 'WAREHOUSE_PRODUCT') {
        renderInventory();
    } else if(ID == 'MATERIAL') {
        initializeMaterialInventoryApp();
    } else if(ID == 'BOM_DECLARATION') {
        initBomDeclarationModule();
    } else if(ID == 'PRODUCTION_ORDER') {
        initProductionOrderModule();
    }
    // Hiện màn đúng ID
    // $("#name-detail").text(NAME);
    $("#footer-wareHouse").addClass("d-none");
    const screen = document.getElementById(ID);
    if (screen) screen.classList.remove("d-none");
}

function createLot() {
    const lotName = document.getElementById("lotName").value.trim();
    const quantity = parseInt(document.getElementById("lotQuantity").value, 10);
    const product = document.getElementById("productSelect").value;
  
    if (!lotName || !quantity || !product) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    let resultHTML = `
      <div class="alert alert-success mt-3">
        <b>Lô đã tạo thành công!</b><br>
        Tên lô: ${lotName}<br>
        Số lượng: ${quantity}<br>
        Sản phẩm: ${product}
      </div>
    `;

    document.getElementById("lotResult").innerHTML = resultHTML;
}

$('.backWaveHouse').click(() => {
    document.getElementById("wareHouse-menu").classList.remove("d-none");
    document.getElementById("wareHouse-detail").classList.add("d-none");
    $("#footer-wareHouse").removeClass("d-none");
})

$('#backMenuAll').click(() => {
    HOMEOSAPP.goBack();
})

function switchMode(mode) {
    const container = document.getElementById("modeDetails");
    container.innerHTML = ""; // clear form cũ
  
    if (mode === "single") {
      container.innerHTML = `
        <label class="form-label text-white">Chọn QR</label>
        <select class="form-select">
          <option value="">-- Chọn QR --</option>
          <option value="qr1">QR 1</option>
          <option value="qr2">QR 2</option>
        </select>
      `;
    } else if (mode === "batch") {
      container.innerHTML = `
        <label class="form-label text-white">Số lượng</label>
        <input type="number" class="form-control" placeholder="Nhập số lượng">
      `;
    }
    // mode all thì không hiện gì thêm
}

function runOptionS() {
    const options = document.querySelectorAll(".repeat-options .option");
  
    options.forEach(opt => {
      if (!opt.hasAttribute("data-bound")) {
        opt.addEventListener("click", () => {
          // Bỏ selected tất cả
          options.forEach(o => o.classList.remove("selected"));
          // Đánh dấu option hiện tại
          opt.classList.add("selected");
  
          // Lấy value để xử lý hiển thị form tương ứng
          const mode = opt.getAttribute("data-value");
          showPrintOptions(mode);
        });
        opt.setAttribute("data-bound", "true");
      }
    });
}
  
  // Hiển thị form theo chế độ in
function showPrintOptions(mode) {
    const container = document.getElementById("modeDetails");
    if (!container) return;
  
    container.innerHTML = ""; // clear cũ
  
    if (mode === "detail") {
        container.innerHTML = `
            <label class="form-label text-white">Chọn QR</label>
            <select class="form-select">
                <option>-- Chọn QR --</option>
                <option>QR 1</option>
                <option>QR 2</option>
            </select>
        `;
    } else if (mode === "bo") {
      container.innerHTML = `
        <label class="form-label text-white">Số lượng</label>
        <input type="number" class="form-control" placeholder="Nhập số lượng">
      `;
    }
    // mode === "all" thì không hiển thị gì thêm
}

renderApps(apps_waveHouse, 'wareHouse-list');
// --- DỮ LIỆU MẪU (MOCK DATA) ---
var generateScannedItems = (count, prefix) => Array.from({ length: count }, (_, i) => `${prefix}-item-${String(i + 1).padStart(4,'0')}`);
var mockBatches = [
    { batchCode: 'LSP-250911-001', productCode: 'SP-CPU-I9', productName: 'CPU Intel Core i9', bomId: 'BOM_CPU_I9_V1.5', lsx: 'LSX-0987', creationDate: '2025-09-11', status: 'Sẵn sàng nhập kho', active: 0,
      // Identification Data
      quantity: 50000, unit: 'Cái', batchUnit: 'Container', identifiedQuantity: 0, scannedData: {}, palletsPerContainer: 10, cartonsPerPallet: 25, layersPerCarton: 10, itemsPerLayer: 20 },
    { batchCode: 'LSP-250911-002', productCode: 'SP-RAM-DDR5', productName: 'RAM DDR5 16GB', bomId: 'BOM_RAM_DDR5_V2.1', lsx: 'LSX-0988', creationDate: '2025-09-11', status: 'Mới sản xuất', active: 0,
      // Identification Data
      quantity: 482, unit: 'Thanh', batchUnit: 'Thùng', identifiedQuantity: 22, scannedData: {"pallet_1":{"carton_1":{"layer_1": generateScannedItems(20, "P1-C1-L1"), "layer_2": generateScannedItems(2, "P1-C1-L2")}}}, palletsPerContainer: null, cartonsPerPallet: null, layersPerCarton: 5, itemsPerLayer: 20 },
    { batchCode: 'LSP-250910-001', productCode: 'SP-SSD-1TB', productName: 'SSD NVMe 1TB', bomId: 'BOM_SSD_NVME_V4.0', lsx: 'LSX-0989', creationDate: '2025-09-10', status: 'Đã qua KCS', active: 0,
      // Identification Data
      quantity: 120, unit: 'Ổ', batchUnit: 'Pallet', identifiedQuantity: 0, scannedData: {}, palletsPerContainer: null, cartonsPerPallet: 3, layersPerCarton: 4, itemsPerLayer: 10 },
    { batchCode: 'LSP-250910-002', productCode: 'SP-CPU-I9', productName: 'CPU Intel Core i9', bomId: 'BOM_CPU_I9_V1.5', lsx: 'LSX-0987', creationDate: '2025-09-10', status: 'Đã hủy', active: 0,
      // Identification Data
      quantity: 50, unit: 'Cái', batchUnit: 'Hộp', identifiedQuantity: 0, scannedData: {}, palletsPerContainer: null, cartonsPerPallet: null, layersPerCarton: null, itemsPerLayer: null },
];
var productionOrders = [
    { id: 'LSX-0987', productCode: 'SP-CPU-I9', productName: 'CPU Intel Core i9', bomId: 'BOM_CPU_I9_V1.5', specs: '14 nhân, 20 luồng', quantity: 100, unit: 'Cái', warranty: '36 tháng' },
    { id: 'LSX-0988', productCode: 'SP-RAM-DDR5', productName: 'RAM DDR5 16GB', bomId: 'BOM_RAM_DDR5_V2.1', specs: 'Kingston Fury, Bus 5200MHz', quantity: 500, unit: 'Thanh', warranty: '24 tháng' },
    { id: 'LSX-0989', productCode: 'SP-SSD-1TB', productName: 'SSD NVMe 1TB', bomId: 'BOM_SSD_NVME_V4.0', specs: 'Samsung 980 Pro', quantity: 250, unit: 'Ổ', warranty: '60 tháng' }
];
var boms = [
    { id: 'BOM_CPU_I9_V1.5', productCode: 'SP-CPU-I9', productName: 'CPU Intel Core i9', specs: '14 nhân, 20 luồng', unit: 'Cái', warranty: '36 tháng' },
    { id: 'BOM_RAM_DDR5_V2.1', productCode: 'SP-RAM-DDR5', productName: 'RAM DDR5 16GB', specs: 'Kingston Fury, Bus 5200MHz', unit: 'Thanh', warranty: '24 tháng' },
    { id: 'BOM_SSD_NVME_V4.0', productCode: 'SP-SSD-1TB', productName: 'SSD NVMe 1TB', specs: 'Samsung 980 Pro', unit: 'Ổ', warranty: '60 tháng' }
];

// --- Lấy các phần tử DOM ---
var getDomElements = () => ({
    listScreen: document.getElementById('list-screen'),
    formScreen: document.getElementById('form-screen'),
    productIdScreen: document.getElementById('product-id-screen'),
    batchListContainer: document.getElementById('batch-list-container'),
    searchInput: document.getElementById('search-input'),
    noResults: document.getElementById('no-results'),
    addNewButton: document.getElementById('add-new-button'),
    backToListButton: document.getElementById('back-to-list-button'),
    backToListFromDetailsButton: document.getElementById('back-to-list-from-details-button'),
    form: document.getElementById('batch-declaration-form'),
    formTitle: document.getElementById('form-title'),
    formSubmitButton: document.getElementById('form-submit-button'),
    // Delete Modal
    deleteModalEl: document.getElementById('delete-modal'),
    batchCodeToDelete: document.getElementById('batch-code-to-delete'),
    confirmDeleteButton: document.getElementById('confirm-delete-button'),
    // Form fields
    declarationTypeRadios: document.querySelectorAll('input[name="declaration_type"]'),
    lsxSelectorContainer: document.getElementById('lsx-selector-container'),
    bomSelectorContainer: document.getElementById('bom-selector-container'),
    productionOrderSelect: document.getElementById('production-order'),
    bomSelect: document.getElementById('bom-select'),
    batchCode: document.getElementById('batch-code'),
    batchCreationDate: document.getElementById('batch-creation-date'),
    productCode: document.getElementById('product-code'),
    productName: document.getElementById('product-name'),
    bomDisplay: document.getElementById('bom-display'),
    specifications: document.getElementById('specifications'),
    plannedQuantity: document.getElementById('planned-quantity'),
    actualQuantity: document.getElementById('actual-quantity'),
    unit: document.getElementById('unit'),
    batchUnit: document.getElementById('batch-unit'),
    warranty: document.getElementById('warranty'),
    status: document.getElementById('status'),
    // Product ID Screen
    productIdTitle: document.getElementById('product-id-title'),
    batchInfoContainer: document.getElementById('batch-info-container'),
    packagingContainer: document.getElementById('packaging-declaration-container'),
    infoProductName: document.getElementById('info-product-name'),
    infoUnit: document.getElementById('info-unit'),
    infoTotalQuantity: document.getElementById('info-total-quantity'),
    infoIdentifiedQuantity: document.getElementById('info-identified-quantity'),
    infoRemainingQuantity: document.getElementById('info-remaining-quantity'),
    idListDetails: document.getElementById('id-list-details'),
    scanCount: document.getElementById('scan-count'),
    saveIdentitiesButton: document.getElementById('save-identities-button'),
    scanProgressContainer: document.getElementById('scan-progress-container'),
    progress: {
        pallet: document.getElementById('progress-pallet'),
        carton: document.getElementById('progress-carton'),
        layer: document.getElementById('progress-layer'),
    },
    inputs: {
        palletsPerContainer: document.getElementById('pallets-per-container'),
        cartonsPerPallet: document.getElementById('cartons-per-pallet'),
        layersPerCarton: document.getElementById('layers-per-carton'),
        itemsPerLayer: document.getElementById('items-per-layer'),
    },
    // Scan Modal for ID
    idScanModalEl: document.getElementById('id-scan-modal'),
    modalScanCount: document.getElementById('modal-scan-count'),
    simulateScanButton: document.getElementById('simulate-scan-button'),
    startScanButton: document.getElementById('start-scan-button'),
    // Toast
    toastEl: document.getElementById('app-toast'),
    toastTitle: document.getElementById('toast-title'),
    toastBody: document.getElementById('toast-body'),
});
var dom = getDomElements();

// --- Biến trạng thái ---
var currentScreen = 'list';
var currentFormMode = 'add';
var editingBatchCode = null;
var batchCodeToDeleteState = null;
var openSwipeContainer = null;
var deleteModal, idScanModal, appToast;

// --- State for Identification Screen ---
var sessionScannedData = {};
var sessionScannedCount = 0;
var currentScanIndices = { pallet: 1, carton: 1, layer: 1 };
var currentIdBatch = null;

// --- CÁC HÀM XỬ LÝ CHUNG ---
var navigateTo = (screen) => {
    currentScreen = screen;
    dom.listScreen.classList.toggle('d-none', screen !== 'list');
    dom.formScreen.classList.toggle('d-none', screen !== 'form');
    dom.productIdScreen.classList.toggle('d-none', screen !== 'details');
};

var showToast = (message, type = 'success') => {
    dom.toastEl.classList.remove('text-bg-success', 'text-bg-info', 'text-bg-warning', 'text-bg-danger');
    let bgClass = '';
    switch(type) {
        case 'info': bgClass = 'text-bg-info'; break;
        case 'warning': bgClass = 'text-bg-warning'; break;
        case 'error': bgClass = 'text-bg-danger'; break;
        default: bgClass = 'text-bg-success'; break;
    }
    dom.toastEl.classList.add(bgClass);
    dom.toastBody.textContent = message;
    appToast.show();
};

var getStatusClass = (status) => ({
    'Sẵn sàng nhập kho': 'text-bg-success', 'Đã qua KCS': 'text-bg-primary',
    'Mới sản xuất': 'text-bg-warning', 'Đã hủy': 'text-bg-danger'
}[status] || 'text-bg-secondary');

var closeOpenSwipeContainer = (animate = true) => {
    if (openSwipeContainer) {
        const content = openSwipeContainer.querySelector('.swipe-content');
        content.style.transition = animate ? 'transform 0.2s ease-out' : 'none';
        content.style.transform = 'translateX(0px)';
        openSwipeContainer = null;
    }
};

// --- Chức năng Màn hình Danh sách ---
var renderBatches = (batches) => {

    const activeBatches = batches.filter(b => b.active === 0);
    dom.batchListContainer.innerHTML = '';
    dom.noResults.classList.toggle('d-none', activeBatches.length > 0);
    activeBatches.forEach(batch => {
        const batchCardHTML = `
        <div class="swipe-container position-relative bg-body-tertiary rounded-3 shadow-sm border border-secondary overflow-hidden">
            <div class="swipe-actions position-absolute top-0 end-0 h-100 d-flex align-items-center">
                <button data-action="edit" data-code="${batch.batchCode}" class="h-100 btn btn-primary rounded-0 px-4 d-flex flex-column align-items-center justify-content-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="mb-1 pe-none" viewBox="0 0 16 16"><path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V12h2.293z"/></svg>
                    <span class="small pe-none">Sửa</span>
                </button>
                <button data-action="delete" data-code="${batch.batchCode}" class="h-100 btn btn-danger rounded-0 px-4 d-flex flex-column align-items-center justify-content-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="mb-1 pe-none" viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/><path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/></svg>
                    <span class="small pe-none">Xóa</span>
                </button>
            </div>
            <div class="swipe-content bg-body-secondary position-relative z-1 p-3" style="transition: transform 0.2s ease-out; cursor: pointer;" data-code="${batch.batchCode}">
                <div class="d-flex justify-content-between align-items-start pe-none">
                    <div>
                        <p class=" text-light mb-1">${batch.batchCode}</p>
                        <p class="small text-body mb-0">${batch.productName}</p>
                    </div>
                    <span class="badge rounded-pill small ${getStatusClass(batch.status)}">${batch.status}</span>
                </div>
                <div class="mt-3 d-flex justify-content-between align-items-center small text-secondary pe-none">
                    <span>SL: <span class= text-light">${batch.quantity} ${batch.unit}</span></span>
                    <span>Ngày tạo: <span class= text-light">${batch.creationDate}</span></span>
                </div>
            </div>
        </div>`;
        dom.batchListContainer.insertAdjacentHTML('beforeend', batchCardHTML);
    });
    initializeSwipeActions();
};

function initializeSwipeActions() {
    document.querySelectorAll('.swipe-container').forEach(container => {
        const content = container.querySelector('.swipe-content');
        if (!content) return;

        let startX, startY, diffX = 0, diffY = 0, isDragging = false, isScrolling = false;
        const tapThreshold = 10;

        const handleTouchStart = (e) => {
            if (openSwipeContainer && openSwipeContainer !== container) closeOpenSwipeContainer();
            startX = e.touches[0].clientX; startY = e.touches[0].clientY;
            diffX = 0; diffY = 0; isDragging = true; isScrolling = false;
            content.style.transition = 'none';
        };
        
        const handleTouchMove = (e) => {
            if (!isDragging) return;
            diffX = e.touches[0].clientX - startX; diffY = e.touches[0].clientY - startY;
            if (!isScrolling && Math.abs(diffY) > Math.abs(diffX) + 5) isScrolling = true;
            if(isScrolling) return;
            e.preventDefault();
            
            const actionsWidth = container.querySelector('.swipe-actions').offsetWidth;
            if (diffX > 0) diffX = 0;
            if (Math.abs(diffX) > actionsWidth) {
                  const overdrag = Math.abs(diffX) - actionsWidth;
                  diffX = -actionsWidth - (overdrag / 4);
            }
            content.style.transform = `translateX(${diffX}px)`;
        };

        const handleTouchEnd = () => {
            if (!isDragging || isScrolling) { isDragging = false; return; }
            isDragging = false;
            content.style.transition = 'transform 0.2s ease-out';
            
            const actionsWidth = container.querySelector('.swipe-actions').offsetWidth;
            if (Math.abs(diffX) < tapThreshold) {
                if (openSwipeContainer === container) closeOpenSwipeContainer();
                else setupProductIdScreen(content.dataset.code);
            } else if (diffX < -actionsWidth / 2) {
                content.style.transform = `translateX(${-actionsWidth}px)`;
                openSwipeContainer = container;
            } else {
                content.style.transform = 'translateX(0px)';
                if (openSwipeContainer === container) openSwipeContainer = null;
            }
        };

        content.addEventListener('touchstart', handleTouchStart, { passive: true });
        content.addEventListener('touchmove', handleTouchMove);
        content.addEventListener('touchend', handleTouchEnd);
    });
}

var handleSearch = () => {
    const searchTerm = dom.searchInput.value.toLowerCase();
    const filteredBatches = mockBatches.filter(batch => 
        batch.batchCode.toLowerCase().includes(searchTerm) ||
        batch.productName.toLowerCase().includes(searchTerm) ||
        (batch.lsx && batch.lsx.toLowerCase().includes(searchTerm))
    );
    renderBatches(filteredBatches);
};

// --- Chức năng Màn hình Form (Sửa/Thêm) ---
var resetFormFields = () => {
    dom.form.reset(); dom.batchCreationDate.valueAsDate = new Date();
    clearAutoFilledFields();
};
var clearAutoFilledFields = () => {
    dom.productCode.value = ''; dom.productName.value = ''; dom.bomDisplay.value = '';
    dom.specifications.value = ''; dom.plannedQuantity.value = ''; dom.unit.value = '';
    dom.warranty.value = '';
};
var setupFormForAdd = () => {
    currentFormMode = 'add'; editingBatchCode = null;
    dom.formTitle.textContent = 'Khai Báo Lô Sản Phẩm';
    dom.formSubmitButton.textContent = 'Xác Nhận & Lưu Lô';
    dom.batchCode.value = `LSP-${new Date().toISOString().slice(2,10).replace(/-/g,"")}-${String(mockBatches.length + 1).padStart(3, '0')}`;
    resetFormFields(); populateDropdowns();
    dom.declarationTypeRadios[0].checked = true;
    dom.lsxSelectorContainer.classList.remove('d-none');
    dom.bomSelectorContainer.classList.add('d-none');
    navigateTo('form');
};
var setupFormForEdit = (batchCode) => {
    const batch = mockBatches.find(b => b.batchCode === batchCode);
    if (!batch) return;
    currentFormMode = 'edit'; editingBatchCode = batchCode;
    dom.formTitle.textContent = 'Chỉnh Sửa Lô Sản Phẩm';
    dom.formSubmitButton.textContent = 'Cập Nhật Lô';
    
    populateDropdowns(); clearAutoFilledFields();
    if (batch.lsx) {
        dom.declarationTypeRadios[0].checked = true;
        dom.lsxSelectorContainer.classList.remove('d-none'); dom.bomSelectorContainer.classList.add('d-none');
        dom.productionOrderSelect.value = batch.lsx;
        fillFormWithData(productionOrders.find(o => o.id === batch.lsx));
    } else if (batch.bomId) {
        dom.declarationTypeRadios[1].checked = true;
        dom.lsxSelectorContainer.classList.add('d-none'); dom.bomSelectorContainer.classList.remove('d-none');
        dom.bomSelect.value = batch.bomId;
        fillFormWithData(boms.find(b => b.id === batch.bomId));
    }
    dom.batchCode.value = batch.batchCode; dom.productName.value = batch.productName;
    dom.batchCreationDate.value = batch.creationDate; dom.actualQuantity.value = batch.quantity; 
    dom.status.value = batch.status; dom.unit.value = batch.unit; dom.batchUnit.value = batch.batchUnit;
    navigateTo('form');
};
var handleDelete = (batchCode) => {
    batchCodeToDeleteState = batchCode;
    dom.batchCodeToDelete.textContent = batchCode;
    deleteModal.show();
};
var confirmDelete = () => {
    const batchIndex = mockBatches.findIndex(b => b.batchCode === batchCodeToDeleteState);
    if (batchIndex > -1) mockBatches[batchIndex].active = 1;
    deleteModal.hide(); handleSearch();
};
var populateDropdowns = () => {
    dom.productionOrderSelect.innerHTML = '<option value="">-- Chọn LSX --</option>';
    dom.bomSelect.innerHTML = '<option value="">-- Chọn BOM --</option>';
    productionOrders.forEach(o => dom.productionOrderSelect.add(new Option(`${o.id} - ${o.productName}`, o.id)));
    boms.forEach(b => dom.bomSelect.add(new Option(`${b.id} - ${b.productName}`, b.id)));
};
var fillFormWithData = (data) => {
    if (!data) { clearAutoFilledFields(); return; }
    dom.productCode.value = data.productCode || ''; dom.productName.value = data.productName || '';
    dom.bomDisplay.value = data.bomId || data.id || ''; dom.specifications.value = data.specs || '';
    dom.plannedQuantity.value = data.quantity || ''; dom.actualQuantity.value = data.quantity || '';
    dom.unit.value = data.unit || ''; dom.warranty.value = data.warranty || '';
};
var handleFormSubmit = (e) => {
    e.preventDefault();
    const formData = {
        batchCode: dom.batchCode.value, productName: dom.productName.value, bomId: dom.bomDisplay.value,
        lsx: dom.declarationTypeRadios[0].checked ? dom.productionOrderSelect.value : null,
        quantity: parseInt(dom.actualQuantity.value), unit: dom.unit.value, batchUnit: dom.batchUnit.value,
        creationDate: dom.batchCreationDate.value, status: dom.status.value, active: 0,
        // Add default identification fields
        identifiedQuantity: 0, scannedData: {}, palletsPerContainer: null, cartonsPerPallet: null, layersPerCarton: null, itemsPerLayer: null
    };
    if (currentFormMode === 'add') {
        mockBatches.unshift(formData);
    } else {
        const batchIndex = mockBatches.findIndex(b => b.batchCode === editingBatchCode);
        if (batchIndex > -1) mockBatches[batchIndex] = {...mockBatches[batchIndex], ...formData};
    }
    handleSearch(); navigateTo('list');
};

// --- Chức năng Màn hình Định danh (ID Screen) ---
var setupProductIdScreen = (batchCode) => {
    const foundBatch = mockBatches.find(b => b.batchCode === batchCode);
    if (!foundBatch) { showToast('Lỗi: Không tìm thấy lô sản phẩm.', 'error'); return; }

    currentIdBatch = JSON.parse(JSON.stringify(foundBatch)); // Deep copy for editing
    resetIdSession();

    dom.productIdTitle.textContent = `Lô: ${currentIdBatch.batchCode}`;
    dom.infoProductName.textContent = currentIdBatch.productName;
    dom.infoUnit.textContent = currentIdBatch.batchUnit;
    dom.infoTotalQuantity.textContent = currentIdBatch.quantity.toLocaleString('vi-VN');
    dom.infoIdentifiedQuantity.textContent = currentIdBatch.identifiedQuantity.toLocaleString('vi-VN');
    dom.infoRemainingQuantity.textContent = (currentIdBatch.quantity - currentIdBatch.identifiedQuantity).toLocaleString('vi-VN');
    
    showDeclarationLevelsByUnit(currentIdBatch.batchUnit);
    dom.inputs.palletsPerContainer.value = currentIdBatch.palletsPerContainer || '';
    dom.inputs.cartonsPerPallet.value = currentIdBatch.cartonsPerPallet || '';
    dom.inputs.layersPerCarton.value = currentIdBatch.layersPerCarton || '';
    dom.inputs.itemsPerLayer.value = currentIdBatch.itemsPerLayer || '';
    
    currentScanIndices = getIndicesFromTotal(currentIdBatch.identifiedQuantity, currentIdBatch);
    renderScannedData(currentIdBatch.scannedData);
    handleDeclarationChange();
    updateIdButtonStates();
    navigateTo('details');
};

var handleDeclarationChange = () => {
    if (!currentIdBatch) return;
    currentIdBatch.itemsPerLayer = parseInt(dom.inputs.itemsPerLayer.value, 10) || null;
    currentIdBatch.layersPerCarton = parseInt(dom.inputs.layersPerCarton.value, 10) || null;
    currentIdBatch.cartonsPerPallet = parseInt(dom.inputs.cartonsPerPallet.value, 10) || null;
    currentIdBatch.palletsPerContainer = parseInt(dom.inputs.palletsPerContainer.value, 10) || null;
    
    const { quantity, batchUnit } = currentIdBatch;
    const { itemsPerLayer = 0, layersPerCarton = 0, cartonsPerPallet = 0, palletsPerContainer = 0 } = currentIdBatch;

    const itemsPerCarton = itemsPerLayer * layersPerCarton;
    const itemsPerPallet = itemsPerCarton * cartonsPerPallet;
    const itemsPerContainer = itemsPerPallet * palletsPerContainer;
    
    const totalContainers = itemsPerContainer > 0 ? Math.ceil(quantity / itemsPerContainer) : 0;
    const totalPallets = itemsPerPallet > 0 ? Math.ceil(quantity / itemsPerPallet) : 0;
    const totalCartons = itemsPerCarton > 0 ? Math.ceil(quantity / itemsPerCarton) : 0;
    
    // Update UI
    let showDivider = false;
    ['carton', 'pallet', 'container', 'total-cartons', 'total-pallets', 'total-containers'].forEach(type => {
        document.getElementById(`calc-${type}-row`).classList.add('d-none');
    });

    if (['Thùng', 'Pallet', 'Container'].includes(batchUnit)) {
        document.getElementById('calc-items-per-carton').textContent = itemsPerCarton > 0 ? itemsPerCarton.toLocaleString('vi-VN') : '-';
        document.getElementById('calc-carton-row').classList.remove('d-none');
        if (totalCartons > 0) { document.getElementById('calc-total-cartons').textContent = totalCartons.toLocaleString('vi-VN'); document.getElementById('calc-total-cartons-row').classList.remove('d-none'); showDivider = true; }
    }
    if (['Pallet', 'Container'].includes(batchUnit)) {
        document.getElementById('calc-items-per-pallet').textContent = itemsPerPallet > 0 ? itemsPerPallet.toLocaleString('vi-VN') : '-';
        document.getElementById('calc-pallet-row').classList.remove('d-none');
        if (totalPallets > 0) { document.getElementById('calc-total-pallets').textContent = totalPallets.toLocaleString('vi-VN'); document.getElementById('calc-total-pallets-row').classList.remove('d-none'); showDivider = true; }
    }
    if (batchUnit === 'Container') {
        document.getElementById('calc-items-per-container').textContent = itemsPerContainer > 0 ? itemsPerContainer.toLocaleString('vi-VN') : '-';
        document.getElementById('calc-container-row').classList.remove('d-none');
        if (totalContainers > 0) { document.getElementById('calc-total-containers').textContent = totalContainers.toLocaleString('vi-VN'); document.getElementById('calc-total-containers-row').classList.remove('d-none'); showDivider = true; }
    }
    document.getElementById('calc-divider').classList.toggle('d-none', !showDivider);
    updateScanProgressUI(); updateIdButtonStates();
};

var renderScannedData = (data) => {
    const totalCount = Object.values(data).reduce((pAcc, cartons) => pAcc + Object.values(cartons).reduce((cAcc, layers) => cAcc + Object.values(layers).reduce((lAcc, items) => lAcc + items.length, 0), 0), 0);
    dom.scanCount.textContent = totalCount;
    if (totalCount === 0) {
        dom.idListDetails.innerHTML = '<p class="text-center text-secondary small m-0">Chưa có sản phẩm nào được quét.</p>'; return;
    }
    let html = '';
    const renderLayers = (layers, indentClass = 'ms-4') => Object.entries(layers).map(([layerKey, items]) => `<details open><summary class="${indentClass}">Lớp ${layerKey.split('_')[1]} (${items.length} SP)</summary>${items.map(item => `<p class="item-code font-monospace small">${item}</p>`).join('')}</details>`).join('');
    const renderCartons = (cartons, indentClass = 'ms-2') => Object.entries(cartons).map(([cartonKey, layers]) => `<details open><summary class=" ${indentClass}">Thùng ${cartonKey.split('_')[1]}</summary>${renderLayers(layers)}</details>`).join('');
    
    if (currentIdBatch.batchUnit === 'Container') {
          html = Object.entries(data).map(([palletKey, cartons]) => `<details open><summary class="er">Pallet ${palletKey.split('_')[1]}</summary>${renderCartons(cartons)}</details>`).join('');
    } else if (data.pallet_1) {
        html = renderCartons(data.pallet_1, 'ms-0 ');
    }
    dom.idListDetails.innerHTML = html || '<p class="text-center text-secondary small m-0">Chưa có sản phẩm nào được quét.</p>';
};

var getDeclaration = (batch) => {
    const b = batch || currentIdBatch;
    if (!b) return { pallets: 1, cartons: 1, layers: 1, items: 1 };
    return {
        pallets: b.palletsPerContainer || 1, cartons: b.cartonsPerPallet || 1,
        layers: b.layersPerCarton || 1, items: b.itemsPerLayer || 1,
    };
};

var getIndicesFromTotal = (totalScanned, batch) => {
    if (!batch) return { pallet: 1, carton: 1, layer: 1 };
    const dec = getDeclaration(batch);
    const itemsPerLayer = dec.items || 1, itemsPerCarton = (dec.layers || 1) * itemsPerLayer, itemsPerPallet = (dec.cartons || 1) * itemsPerCarton;
    const scannedIndex = totalScanned;
    let pallet = 1, carton = 1, layer = 1;
    switch (batch.batchUnit) {
        case 'Container':
            pallet = itemsPerPallet > 0 ? Math.floor(scannedIndex / itemsPerPallet) + 1 : 1;
            const remP = itemsPerPallet > 0 ? scannedIndex % itemsPerPallet : scannedIndex;
            carton = itemsPerCarton > 0 ? Math.floor(remP / itemsPerCarton) + 1 : 1;
            const remC = itemsPerCarton > 0 ? remP % itemsPerCarton : remP;
            layer = itemsPerLayer > 0 ? Math.floor(remC / itemsPerLayer) + 1 : 1;
            break;
        case 'Pallet':
            pallet = 1; 
            carton = itemsPerCarton > 0 ? Math.floor(scannedIndex / itemsPerCarton) + 1 : 1;
            const remCP = itemsPerCarton > 0 ? scannedIndex % itemsPerCarton : scannedIndex;
            layer = itemsPerLayer > 0 ? Math.floor(remCP / itemsPerLayer) + 1 : 1;
            break;
        case 'Thùng':
            pallet = 1; carton = 1;
            layer = itemsPerLayer > 0 ? Math.floor(scannedIndex / itemsPerLayer) + 1 : 1;
            break;
    }
    return { pallet, carton, layer };
};

var updateScanProgressUI = () => {
    if (!currentIdBatch) return;
    const dec = getDeclaration();
    const unit = currentIdBatch.batchUnit;
    dom.progress.pallet.classList.add('d-none'); dom.progress.carton.classList.add('d-none'); dom.progress.layer.classList.add('d-none');
    dom.scanProgressContainer.classList.add('d-none');
    if (unit === 'Container') { dom.progress.pallet.classList.remove('d-none'); dom.progress.pallet.lastElementChild.textContent = `${currentScanIndices.pallet} / ${dec.pallets || 'N/A'}`; }
    if (['Container', 'Pallet'].includes(unit)) { dom.progress.carton.classList.remove('d-none'); dom.progress.carton.lastElementChild.textContent = `${currentScanIndices.carton} / ${dec.cartons || 'N/A'}`; }
    if (['Container', 'Pallet', 'Thùng'].includes(unit)) { dom.progress.layer.classList.remove('d-none'); dom.progress.layer.lastElementChild.textContent = `${currentScanIndices.layer} / ${dec.layers || 'N/A'}`; dom.scanProgressContainer.classList.remove('d-none'); }
};

var handleSimulateScan = () => {
    if (!currentIdBatch) return;
    const totalCanScan = currentIdBatch.quantity - currentIdBatch.identifiedQuantity;
    if (sessionScannedCount >= totalCanScan) {
        showToast('Đã quét đủ số lượng còn lại cho lô này.', 'warning');
        idScanModal.hide(); return;
    }
    const dec = getDeclaration();
    const totalBeforeScan = currentIdBatch.identifiedQuantity + sessionScannedCount;
    const { pallet, carton, layer } = getIndicesFromTotal(totalBeforeScan, currentIdBatch);
    
    const palletKey = `pallet_${pallet}`, cartonKey = `carton_${carton}`, layerKey = `layer_${layer}`;
    sessionScannedData[palletKey] = sessionScannedData[palletKey] || {};
    sessionScannedData[palletKey][cartonKey] = sessionScannedData[palletKey][cartonKey] || {};
    sessionScannedData[palletKey][cartonKey][layerKey] = sessionScannedData[palletKey][cartonKey][layerKey] || [];
    
    const scannedId = `${currentIdBatch.productCode}-P${pallet}C${carton}L${layer}-${Date.now().toString().slice(-5)}`;
    sessionScannedData[palletKey][cartonKey][layerKey].push(scannedId);
    sessionScannedCount++;
    dom.modalScanCount.textContent = sessionScannedCount;

    const totalAfterScan = totalBeforeScan + 1;
    const itemsPerLayer = dec.items, itemsPerCarton = dec.layers * itemsPerLayer, itemsPerPallet = dec.cartons * itemsPerCarton;
    if (totalAfterScan > 0 && itemsPerLayer > 0 && totalAfterScan % itemsPerLayer === 0) {
        showToast(`Đã hoàn thành Lớp ${layer}!`, 'info');
        if (itemsPerCarton > 0 && totalAfterScan % itemsPerCarton === 0) {
            showToast(`Đã hoàn thành Thùng ${carton}!`, 'success');
            if (currentIdBatch.batchUnit === 'Container' && itemsPerPallet > 0 && totalAfterScan % itemsPerPallet === 0) {
                showToast(`Đã hoàn thành Pallet ${pallet}!`, 'success');
            }
        }
    }
    currentScanIndices = getIndicesFromTotal(totalAfterScan, currentIdBatch);
    
    // Merge existing and session data for rendering
    const mergedData = JSON.parse(JSON.stringify(currentIdBatch.scannedData));
    Object.entries(sessionScannedData).forEach(([pKey, pVal]) => {
        mergedData[pKey] = mergedData[pKey] || {};
        Object.entries(pVal).forEach(([cKey, cVal]) => {
            mergedData[pKey][cKey] = mergedData[pKey][cKey] || {};
            Object.entries(cVal).forEach(([lKey, lVal]) => {
                mergedData[pKey][cKey][lKey] = (mergedData[pKey][cKey][lKey] || []).concat(lVal);
            });
        });
    });

    renderScannedData(mergedData);
    updateScanProgressUI();
    updateIdButtonStates();
};

var handleSaveIdentities = () => {
    if (dom.saveIdentitiesButton.disabled || !currentIdBatch) return;
    const batchIndex = mockBatches.findIndex(b => b.batchCode === currentIdBatch.batchCode);
    if (batchIndex > -1) {
        const mainBatch = mockBatches[batchIndex];
        mainBatch.identifiedQuantity += sessionScannedCount;
        // Merge data
        Object.entries(sessionScannedData).forEach(([pKey, pVal]) => {
            mainBatch.scannedData[pKey] = mainBatch.scannedData[pKey] || {};
            Object.entries(pVal).forEach(([cKey, cVal]) => {
                mainBatch.scannedData[pKey][cKey] = mainBatch.scannedData[pKey][cKey] || {};
                Object.entries(cVal).forEach(([lKey, lVal]) => {
                      mainBatch.scannedData[pKey][cKey][lKey] = (mainBatch.scannedData[pKey][cKey][lKey] || []).concat(lVal);
                });
            });
        });
        showToast(`Đã lưu thành công ${sessionScannedCount} mã định danh!`);
        setupProductIdScreen(mainBatch.batchCode); // Refresh the screen
    } else {
        showToast('Lỗi: Không tìm thấy lô hàng để lưu.', 'error');
    }
};

var updateIdButtonStates = () => {
    if (!currentIdBatch) { dom.startScanButton.disabled = true; dom.saveIdentitiesButton.disabled = true; return; };
    const remaining = currentIdBatch.quantity - currentIdBatch.identifiedQuantity;
    dom.startScanButton.disabled = remaining <= 0;
    dom.saveIdentitiesButton.disabled = sessionScannedCount === 0;
};

var resetIdSession = () => {
    sessionScannedData = {}; sessionScannedCount = 0; dom.modalScanCount.textContent = 0;
};

var showDeclarationLevelsByUnit = (unit) => {
    const levels = {
        container: document.getElementById('declaration-container-level'), pallet: document.getElementById('declaration-pallet-level'),
        carton: document.getElementById('declaration-carton-level'), layer: document.getElementById('declaration-layer-level')
    };
    Object.values(levels).forEach(l => l.classList.add('d-none'));
    if (unit === 'Container') Object.values(levels).forEach(l => l.classList.remove('d-none'));
    else if (unit === 'Pallet') { levels.pallet.classList.remove('d-none'); levels.carton.classList.remove('d-none'); levels.layer.classList.remove('d-none'); }
    else if (unit === 'Thùng') { levels.carton.classList.remove('d-none'); levels.layer.classList.remove('d-none'); }
    dom.packagingContainer.classList.toggle('d-none', !unit || unit === 'Cái' || unit === 'Hộp');
};


// --- GÁN CÁC SỰ KIỆN ---
var addEventListeners = () => {
    dom.addNewButton.addEventListener('click', setupFormForAdd);
    dom.backToListButton.addEventListener('click', () => navigateTo('list'));
    dom.backToListFromDetailsButton.addEventListener('click', () => navigateTo('list'));
    dom.searchInput.addEventListener('input', handleSearch);
    dom.form.addEventListener('submit', handleFormSubmit);
    dom.confirmDeleteButton.addEventListener('click', confirmDelete);

    dom.batchListContainer.addEventListener('click', (e) => {
        const actionButton = e.target.closest('.swipe-actions button');
        if (actionButton) {
            const { action, code } = actionButton.dataset;
            closeOpenSwipeContainer();
            if (action === 'edit') setupFormForEdit(code);
            if (action === 'delete') handleDelete(code);
        }
    });
    document.body.addEventListener('click', (e) => {
        if (currentScreen === 'list' && openSwipeContainer && !openSwipeContainer.contains(e.target)) {
            closeOpenSwipeContainer();
        }
    });
    dom.declarationTypeRadios.forEach(radio => radio.addEventListener('change', (e) => {
        clearAutoFilledFields(); dom.productionOrderSelect.value = ''; dom.bomSelect.value = '';
        dom.lsxSelectorContainer.classList.toggle('d-none', e.target.value !== 'lsx');
        dom.bomSelectorContainer.classList.toggle('d-none', e.target.value !== 'bom');
    }));
    dom.productionOrderSelect.addEventListener('change', (e) => fillFormWithData(productionOrders.find(o => o.id === e.target.value)));
    dom.bomSelect.addEventListener('change', (e) => fillFormWithData(boms.find(b => b.id === e.target.value)));
    
    // Events for product ID screen
    dom.simulateScanButton.addEventListener('click', handleSimulateScan);
    dom.saveIdentitiesButton.addEventListener('click', handleSaveIdentities);
    Object.values(dom.inputs).forEach(input => input.addEventListener('input', handleDeclarationChange));
};

// --- KHỞI TẠO BAN ĐẦU ---
var initializeApp = async () => {
    var dataPR = await HOMEOSAPP.getDM("https://central.homeos.vn/service_XD/service.svc", 'DM_PRODUCT', "1=1");
    var dataLot = await HOMEOSAPP.getDM("https://central.homeos.vn/service_XD/service.svc", 'WARRANTY_LOT', "1=1");
    if(dataPR.data){
        mockProducts = mapProducts(dataPR.data);
    }
    
    
    
    deleteModal = new bootstrap.Modal(dom.deleteModalEl);
    idScanModal = new bootstrap.Modal(dom.idScanModalEl);
    appToast = new bootstrap.Toast(dom.toastEl);
    addEventListeners();
    renderBatches(mockBatches);
};

var mockProducts;
initializeApp();

// 
var currentUser = 'Nguyễn Văn A'; // Giả lập người dùng đăng nhập

var mockBatches_2 = [
    { batchId: 101, productId: 1, batchCode: 'L20250901', quantity: 58, unit: 'Cái', location: 'Kho A, Kệ 12', supplier: 'TechSource Inc.', lastUpdated: '10/09/2025', pricePerItem: 15000000, description: 'Lô nhập đầu tháng 9' },
    { batchId: 102, productId: 2, batchCode: 'L20250901', quantity: 15, unit: 'Thanh', location: 'Kho A, Kệ 12', supplier: 'Memory World', lastUpdated: '09/09/2025', pricePerItem: 2500000, description: 'RAM bus 5600' },
    { batchId: 103, productId: 4, batchCode: 'L20250902', quantity: 5, unit: 'Cái', location: 'Kho A, Kệ 15', supplier: 'Graphics Direct', lastUpdated: '10/09/2025', pricePerItem: 45000000, description: 'Bản Founder Edition' },
    { batchId: 104, productId: 5, batchCode: 'L20250820', quantity: 120, unit: 'Cái', location: 'Kho B, Kệ 1', supplier: 'Power Supplies Co.', lastUpdated: '01/09/2025', pricePerItem: 4000000, description: '' },
    { batchId: 105, productId: 6, batchCode: 'L20250825', quantity: 2, unit: 'Cái', location: 'Kho A, Kệ 22', supplier: 'Cooling Bros', lastUpdated: '08/09/2025', pricePerItem: 2200000, description: 'Màu Chromax Black' },
];

var mockHistory = {
    101: [{ type: 'import', quantity: 60, reason: 'Nhập hàng đầu kỳ', date: '01/09/2025' }, { type: 'export', quantity: 2, reason: 'Bán lẻ', date: '05/09/2025' }],
    102: [{ type: 'import', quantity: 20, reason: 'Nhập hàng đầu kỳ', date: '01/09/2025' }, { type: 'export', quantity: 5, reason: 'Bán sỉ', date: '06/09/2025' }],
};

var appContainer = document.getElementById('app-container');
var inventoryListEl = document.getElementById('inventory-list');
var searchInputEl = document.getElementById('search-input');
var filterButtonsEl = document.getElementById('filter-buttons');
var currentFilter = 'all';
var currentProductId = null;

var detailViewElements = { name: document.getElementById('detail-product-name'), image: document.getElementById('detail-image'), sku: document.getElementById('detail-sku'), quantity: document.getElementById('detail-quantity'), statusBadge: document.getElementById('detail-status-badge'), location: document.getElementById('detail-location'), supplier: document.getElementById('detail-supplier'), lastUpdated: document.getElementById('detail-last-updated') };
var historyListEl = document.getElementById('history-list');
var importViewElements = { select: document.getElementById('import-product-select'), batchCode: document.getElementById('import-batch-code'), quantity: document.getElementById('import-quantity'), unit: document.getElementById('import-unit'), reason: document.getElementById('import-reason-select'), location: document.getElementById('import-location'), priceItem: document.getElementById('import-price-item'), priceTotal: document.getElementById('import-price-total'), description: document.getElementById('import-description') };
var exportViewElements = { batchSelect: document.getElementById('export-batch-select'), batchInfo: document.getElementById('export-batch-info'), stockInfo: document.getElementById('export-stock-info'), location: document.getElementById('export-location'), quantity: document.getElementById('export-quantity'), price: document.getElementById('export-price'), totalPrice: document.getElementById('export-total-price'), exporter: document.getElementById('export-exporter'), receiver: document.getElementById('export-receiver'), formSelect: document.getElementById('export-form-select'), reason: document.getElementById('export-reason'), description: document.getElementById('export-description') };

var toastEl = document.getElementById('liveToast');
var toastBody = document.getElementById('toast-body');
var toast = new bootstrap.Toast(toastEl);

var navigate = (view) => { appContainer.dataset.view = view; };

var getStockInfo = (quantity) => {
    if (quantity <= 0) return { text: 'Hết hàng', color: 'danger', bg: 'bg-danger-subtle', text_color: 'text-danger-emphasis' };
    if (quantity <= 20) return { text: 'Sắp hết hàng', color: 'warning', bg: 'bg-warning-subtle', text_color: 'text-warning-emphasis' };
    return { text: 'Còn hàng', color: 'success', bg: 'bg-success-subtle', text_color: 'text-success-emphasis' };
};

var renderInventory = () => {
    const searchTerm = searchInputEl.value.toLowerCase();
    
    let productQuantities = mockProducts.map(product => {
        const totalQuantity = mockBatches_2.filter(batch => batch.productId === product.id).reduce((sum, batch) => sum + batch.quantity, 0);
        return { ...product, totalQuantity };
    });

    let filteredInventory = productQuantities.filter(item => item.name.toLowerCase().includes(searchTerm) || item.sku.toLowerCase().includes(searchTerm));
    if (currentFilter === 'low_stock') filteredInventory = filteredInventory.filter(item => item.totalQuantity > 0 && item.totalQuantity <= 20);
    else if (currentFilter === 'out_of_stock') filteredInventory = filteredInventory.filter(item => item.totalQuantity <= 0);
    
    if (filteredInventory.length === 0) {
        inventoryListEl.innerHTML = `<div class="text-center py-5"><p class="text-muted">Không tìm thấy sản phẩm nào.</p></div>`; return;
    }
    inventoryListEl.innerHTML = filteredInventory.map(item => {
        const stock = getStockInfo(item.totalQuantity);
        return `<div data-id="${item.id}" class="product-card bg-body p-3 rounded-3 shadow-sm border-0 d-flex align-items-start gap-3">
            <img src="${item.imageUrl.replace('400x300', '160x160')}" alt="${item.name}" class="rounded border" style="width: 64px; height: 64px; object-fit: cover;">
            <div class="flex-grow-1">
                <p class=" text-body-emphasis mb-1" style="text-align: start;">${item.name}</p>
                <p class="text-muted small font-monospace mb-2" style="text-align: start;">${item.sku}</p>
                <div class="d-flex justify-content-between align-items-center">
                    <span class="badge ${stock.bg} ${stock.text_color} rounded-pill">${stock.text}</span>
                    <div>
                        <span class="small text-muted">Tổng tồn:</span> 
                        <span class=" fs-5 text-${stock.color}">${item.totalQuantity}</span>
                    </div>
                </div>
            </div>
        </div>`;
    }).join('');
};

function mapProducts(realProducts) {
  return realProducts.map(p => {
    // Ưu tiên PRODUCT_IMG, nếu không có thì lấy ảnh đầu tiên trong PRODUCT_IMG_SLIDE
    let imageUrl = p.PRODUCT_IMG;
    if (!imageUrl && p.PRODUCT_IMG_SLIDE) {
      imageUrl = p.PRODUCT_IMG_SLIDE.split(",")[0]; // lấy ảnh đầu tiên
    }
    if (!imageUrl) {
      imageUrl = "https://placehold.co/400x300/e2e8f0/334155?text=No+Image";
    }

    return {
      id: p.PR_KEY,
      name: p.PRODUCT_NAME,
      sku: p.PRODUCT_CODE,
      imageUrl: imageUrl
    };
  });
}

var showDetailView = (productId) => {
    currentProductId = productId;
    const product = mockProducts.find(item => item.id == productId);
    if (!product) return;
    
    const productBatches = mockBatches_2.filter(b => b.productId == productId);
    const totalQuantity = productBatches.reduce((sum, b) => sum + b.quantity, 0);
    const latestBatch = productBatches.sort((a,b) => new Date(b.lastUpdated.split('/').reverse().join('-')) - new Date(a.lastUpdated.split('/').reverse().join('-')))[0] || {};

    const stock = getStockInfo(totalQuantity);
    detailViewElements.name.textContent = product.name;
    detailViewElements.image.src = product.imageUrl;
    detailViewElements.image.alt = product.name;
    detailViewElements.sku.textContent = product.sku;
    detailViewElements.quantity.textContent = totalQuantity;
    detailViewElements.quantity.className = ` display-6 mb-0 text-${stock.color}`;
    detailViewElements.statusBadge.textContent = stock.text;
    detailViewElements.statusBadge.className = `badge fs-6 rounded-pill ${stock.bg} ${stock.text_color}`;
    detailViewElements.location.innerHTML = `<i class="bi bi-geo-alt-fill me-2 text-muted"></i> ${[...new Set(productBatches.map(b => b.location))].join(', ') || 'Chưa có vị trí'}`;
    detailViewElements.supplier.textContent = latestBatch.supplier || 'N/A';
    detailViewElements.lastUpdated.textContent = latestBatch.lastUpdated || 'N/A';
    navigate('detail');
};

var showHistoryView = () => {
    const productBatches = mockBatches_2.filter(b => b.productId == currentProductId);
    const batchIds = productBatches.map(b => b.batchId);
    const productHistory = batchIds.flatMap(id => mockHistory[id] || []).sort((a,b) => new Date(b.date.split('/').reverse().join('-')) - new Date(a.date.split('/').reverse().join('-')));

    if (productHistory.length === 0) {
        historyListEl.innerHTML = `<div class="text-center py-5"><p class="text-muted">Chưa có lịch sử cho sản phẩm này.</p></div>`;
    } else {
        historyListEl.innerHTML = productHistory.map(entry => {
            const isImport = entry.type === 'import';
            return `<div class="card card-body border-0 shadow-sm"><div class="d-flex w-100 justify-content-between"><h6 class="mb-1">${entry.reason}</h6><span class=" fs-5 ${isImport ? 'text-success' : 'text-danger'}">${isImport ? '+' : '-'}${entry.quantity}</span></div><small class="text-muted">${entry.date}</small></div>`;
        }).join('');
    }
    navigate('history');
};

var populateProductSelect = (selectEl) => {
    selectEl.innerHTML = '<option value="">-- Chọn sản phẩm --</option>';
    mockProducts.forEach(p => {
        selectEl.innerHTML += `<option value="${p.id}">${p.name} (${p.sku})</option>`;
    });
};

var showImportView = () => {
    populateProductSelect(importViewElements.select);
    Object.values(importViewElements).forEach(el => { if(el.tagName !== 'SELECT') el.value = ''; });
    importViewElements.priceTotal.value = '0 VNĐ';
    navigate('import');
};

var showExportView = () => {
    exportViewElements.batchSelect.innerHTML = '<option value="">-- Chọn lô sản phẩm --</option>';
    const groupedBatches = mockProducts.map(product => ({
        productName: product.name,
        batches: mockBatches_2.filter(b => b.productId === product.id && b.quantity > 0)
    })).filter(group => group.batches.length > 0);

    groupedBatches.forEach(group => {
        const optgroup = document.createElement('optgroup');
        optgroup.label = group.productName;
        group.batches.forEach(b => {
            const option = document.createElement('option');
            option.value = b.batchId;
            option.textContent = `Mã lô: ${b.batchCode} (Tồn: ${b.quantity} ${b.unit})`;
            optgroup.appendChild(option);
        });
        exportViewElements.batchSelect.appendChild(optgroup);
    });

    Object.values(exportViewElements).forEach(el => { if(el.tagName !== 'SELECT') el.value = ''; });
    exportViewElements.exporter.value = currentUser; // Auto-fill exporter
    exportViewElements.batchInfo.classList.add('d-none');
    exportViewElements.totalPrice.value = "0 VNĐ";

    navigate('export');
};

var setTheme = (theme) => {
    document.documentElement.setAttribute('data-bs-theme', theme);
    localStorage.setItem('theme', theme);
    document.querySelectorAll('.theme-switcher-btn').forEach(btn => {
        btn.innerHTML = theme === 'dark' ? '<i class="bi bi-sun-fill"></i>' : '<i class="bi bi-moon-stars-fill"></i>';
    });
};

// Event Listeners
searchInputEl.addEventListener('change', renderInventory);
filterButtonsEl.addEventListener('click', (e) => {
    const button = e.target.closest('.filter-btn');
    if (!button) return;
    currentFilter = button.dataset.filter;
    document.querySelectorAll('#filter-buttons .filter-btn').forEach(btn => {btn.classList.remove('btn-primary'); btn.classList.add('btn-secondary');});
    button.classList.add('btn-primary');
    button.classList.remove('btn-secondary');
    renderInventory();
});

inventoryListEl.addEventListener('click', (e) => {
    const card = e.target.closest('.product-card');
    if(card) showDetailView(card.dataset.id);
});

document.querySelectorAll('.back-btn').forEach(btn => {
    btn.addEventListener('click', (e) => navigate(e.currentTarget.dataset.target));
});

document.querySelectorAll('.theme-switcher-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-bs-theme');
        setTheme(currentTheme === 'dark' ? 'light' : 'dark');
    });
});

document.getElementById('view-history-btn').addEventListener('click', showHistoryView);
document.getElementById('show-import-view-btn').addEventListener('click', showImportView);
document.getElementById('show-export-view-btn').addEventListener('click', showExportView);

[importViewElements.quantity, importViewElements.priceItem].forEach(el => {
    el.addEventListener('input', () => {
        const quantity = parseInt(importViewElements.quantity.value) || 0;
        const price = parseFloat(importViewElements.priceItem.value) || 0;
        importViewElements.priceTotal.value = (quantity * price).toLocaleString('vi-VN') + ' VNĐ';
    });
});

document.getElementById('save-import-btn').addEventListener('click', () => {
    const productId = parseInt(importViewElements.select.value);
    const batchCode = importViewElements.batchCode.value.trim();
    const quantity = parseInt(importViewElements.quantity.value);
    const unit = importViewElements.unit.value.trim();
    const reason = importViewElements.reason.value;
    const location = importViewElements.location.value.trim();
    const pricePerItem = parseFloat(importViewElements.priceItem.value);
    const description = importViewElements.description.value.trim();

    if (!productId || !batchCode || !quantity || !unit || !location || !pricePerItem) {
        showToast('Vui lòng điền đầy đủ thông tin.', 'error'); return;
    }
    
    const newBatch = {
        batchId: Date.now(), productId, batchCode, quantity, unit, location, pricePerItem, description,
        supplier: 'Nhà cung cấp mới',
        lastUpdated: new Date().toLocaleDateString('vi-VN'),
    };
    mockBatches_2.push(newBatch);
    
    if (!mockHistory[newBatch.batchId]) mockHistory[newBatch.batchId] = [];
    mockHistory[newBatch.batchId].push({ type: 'import', quantity, reason, date: newBatch.lastUpdated });
    
    showToast(`Nhập kho thành công lô ${batchCode}!`);
    navigate('list');
    renderInventory();
});

var calculateExportTotal = () => {
    const quantity = parseInt(exportViewElements.quantity.value) || 0;
    const price = parseFloat(exportViewElements.price.value) || 0;
    exportViewElements.totalPrice.value = (quantity * price).toLocaleString('vi-VN') + ' VNĐ';
};

[exportViewElements.quantity, exportViewElements.price].forEach(el => el.addEventListener('input', calculateExportTotal));

exportViewElements.batchSelect.addEventListener('change', (e) => {
        const batchId = e.target.value;
        if (!batchId) {
        exportViewElements.batchInfo.classList.add('d-none');
        return;
    }
    const batch = mockBatches_2.find(b => b.batchId == batchId);
    exportViewElements.stockInfo.textContent = `${batch.quantity} ${batch.unit}`;
    exportViewElements.location.textContent = batch.location;
    exportViewElements.price.value = batch.pricePerItem; // Suggest price
    exportViewElements.batchInfo.classList.remove('d-none');
    calculateExportTotal();
});

    document.getElementById('save-export-btn').addEventListener('click', () => {
    const batchId = parseInt(exportViewElements.batchSelect.value);
    const quantity = parseInt(exportViewElements.quantity.value);
    const price = parseFloat(exportViewElements.price.value);
    const exporter = exportViewElements.exporter.value.trim();
    const receiver = exportViewElements.receiver.value.trim();
    const form = exportViewElements.formSelect.value;
    const reason = exportViewElements.reason.value.trim();
    const description = exportViewElements.description.value.trim();
    
    if (!batchId || !quantity || quantity <= 0 || !price || !receiver || !reason) {
        showToast('Vui lòng điền đầy đủ các trường bắt buộc.', 'error'); return;
    }

    const batch = mockBatches_2.find(b => b.batchId === batchId);
    if (quantity > batch.quantity) {
        showToast('Số lượng xuất vượt quá tồn kho của lô.', 'error'); return;
    }

    batch.quantity -= quantity;
    batch.lastUpdated = new Date().toLocaleDateString('vi-VN');
    if (!mockHistory[batch.batchId]) mockHistory[batch.batchId] = [];
    mockHistory[batch.batchId].push({ type: 'export', quantity, reason, date: batch.lastUpdated, price, exporter, receiver, form, description });

    showToast(`Xuất kho thành công ${quantity} sản phẩm từ lô ${batch.batchCode}!`);
    navigate('list');
    renderInventory();
});

// Initial Theme
var savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
setTheme(savedTheme);

function initializeMaterialInventoryApp() {
    
    const mt_currentUser = 'Nguyễn Văn A'; 

    let mt_mockMaterials = [
        { id: 1, name: 'Thép tấm SPHC 2.0mm', sku: 'VT-STEEL-SPHC-20', imageUrl: 'https://placehold.co/400x300/e2e8f0/334155?text=Thép' },
        { id: 2, name: 'Bulong lục giác M10', sku: 'VT-BOLT-M10', imageUrl: 'https://placehold.co/400x300/e2e8f0/334155?text=Bulong' },
        { id: 3, name: 'Sơn chống gỉ xám 5L', sku: 'VT-PAINT-GREY-5L', imageUrl: 'https://placehold.co/400x300/e2e8f0/334155?text=Sơn' },
        { id: 4, name: 'Que hàn J421 3.2mm', sku: 'VT-WELD-J421-32', imageUrl: 'https://placehold.co/400x300/e2e8f0/334155?text=Que+Hàn' },
        { id: 5, name: 'Dầu thủy lực Caltex Rando 68', sku: 'VT-OIL-CALTEX-68', imageUrl: 'https://placehold.co/400x300/e2e8f0/334155?text=Dầu' },
    ];

    let mt_mockBatches = [
        { batchId: 101, materialId: 1, batchCode: 'L20250901', quantity: 58, unit: 'Tấm', location: 'Kho A, Kệ 12', supplier: 'Hòa Phát', lastUpdated: '10/09/2025', pricePerItem: 750000, description: 'Lô nhập đầu tháng 9' },
        { batchId: 102, materialId: 2, batchCode: 'L20250901', quantity: 2500, unit: 'Cái', location: 'Kho A, Kệ 12', supplier: 'Bulong Comat', lastUpdated: '09/09/2025', pricePerItem: 1500, description: 'Bulong Inox 304' },
        { batchId: 103, materialId: 3, batchCode: 'L20250902', quantity: 5, unit: 'Thùng', location: 'Kho A, Kệ 15', supplier: 'Sơn Jotun', lastUpdated: '10/09/2025', pricePerItem: 1200000, description: 'Sơn lót' },
        { batchId: 104, materialId: 4, batchCode: 'L20250820', quantity: 120, unit: 'Kg', location: 'Kho B, Kệ 1', supplier: 'Que hàn Kim Tín', lastUpdated: '01/09/2025', pricePerItem: 40000, description: '' },
        { batchId: 105, materialId: 5, batchCode: 'L20250825', quantity: 2, unit: 'Xô', location: 'Kho A, Kệ 22', supplier: 'Caltex Việt Nam', lastUpdated: '08/09/2025', pricePerItem: 1800000, description: 'Xô 18L' },
    ];
    
    let mt_mockHistory = {
        101: [{ type: 'import', quantity: 60, reason: 'Nhập hàng từ NCC', date: '01/09/2025' }, { type: 'export', quantity: 2, reason: 'Xuất cho SX', date: '05/09/2025' }],
        102: [{ type: 'import', quantity: 3000, reason: 'Nhập hàng từ NCC', date: '01/09/2025' }, { type: 'export', quantity: 500, reason: 'Xuất cho SX', date: '06/09/2025' }],
    };

    const mt_appContainer = document.getElementById('mt-app-container');
    const mt_inventoryListEl = document.getElementById('mt-inventory-list');
    const mt_searchInputEl = document.getElementById('mt-search-input');
    const mt_filterButtonsEl = document.getElementById('mt-filter-buttons');
    let mt_currentFilter = 'all';
    let mt_currentMaterialId = null;

    const mt_detailViewElements = { name: document.getElementById('mt-detail-material-name'), image: document.getElementById('mt-detail-image'), sku: document.getElementById('mt-detail-sku'), quantity: document.getElementById('mt-detail-quantity'), statusBadge: document.getElementById('mt-detail-status-badge'), location: document.getElementById('mt-detail-location'), supplier: document.getElementById('mt-detail-supplier'), lastUpdated: document.getElementById('mt-detail-last-updated') };
    const mt_historyListEl = document.getElementById('mt-history-list');
    const mt_importViewElements = { select: document.getElementById('mt-import-material-select'), batchCode: document.getElementById('mt-import-batch-code'), quantity: document.getElementById('mt-import-quantity'), unit: document.getElementById('mt-import-unit'), reason: document.getElementById('mt-import-reason-select'), location: document.getElementById('mt-import-location'), priceItem: document.getElementById('mt-import-price-item'), priceTotal: document.getElementById('mt-import-price-total'), description: document.getElementById('mt-import-description') };
    const mt_exportViewElements = { batchSelect: document.getElementById('mt-export-batch-select'), batchInfo: document.getElementById('mt-export-batch-info'), stockInfo: document.getElementById('mt-export-stock-info'), location: document.getElementById('mt-export-location'), quantity: document.getElementById('mt-export-quantity'), price: document.getElementById('mt-export-price'), totalPrice: document.getElementById('mt-export-total-price'), exporter: document.getElementById('mt-export-exporter'), receiver: document.getElementById('mt-export-receiver'), formSelect: document.getElementById('mt-export-form-select'), reason: document.getElementById('mt-export-reason'), description: document.getElementById('mt-export-description') };
    
    const mt_toastEl = document.getElementById('mt-liveToast');
    const mt_toastBody = document.getElementById('mt-toast-body');
    const mt_toast = new bootstrap.Toast(mt_toastEl);

    const mt_navigate = (view) => { mt_appContainer.dataset.view = view;};
    const mt_showToast = (message, type = 'success') => {
        mt_toastEl.className = `toast text-white ${type === 'success' ? 'bg-success' : 'bg-danger'}`;
        mt_toastBody.textContent = message;
        mt_toast.show();
    };

    const mt_getStockInfo = (quantity) => {
        if (quantity <= 0) return { text: 'Hết hàng', color: 'danger', bg: 'bg-danger-subtle', text_color: 'text-danger-emphasis' };
        if (quantity <= 20) return { text: 'Sắp hết hàng', color: 'warning', bg: 'bg-warning-subtle', text_color: 'text-warning-emphasis' };
        return { text: 'Còn hàng', color: 'success', bg: 'bg-success-subtle', text_color: 'text-success-emphasis' };
    };

    const mt_renderMaterialList = () => {
        const searchTerm = mt_searchInputEl.value.toLowerCase();
        
        let materialQuantities = mt_mockMaterials.map(material => {
            const totalQuantity = mt_mockBatches.filter(batch => batch.materialId === material.id).reduce((sum, batch) => sum + batch.quantity, 0);
            return { ...material, totalQuantity };
        });

        let filteredInventory = materialQuantities.filter(item => item.name.toLowerCase().includes(searchTerm) || item.sku.toLowerCase().includes(searchTerm));
        if (mt_currentFilter === 'low_stock') filteredInventory = filteredInventory.filter(item => item.totalQuantity > 0 && item.totalQuantity <= 20);
        else if (mt_currentFilter === 'out_of_stock') filteredInventory = filteredInventory.filter(item => item.totalQuantity <= 0);
        
        if (filteredInventory.length === 0) {
            mt_inventoryListEl.innerHTML = `<div class="text-center py-5"><p class="text-muted">Không tìm thấy vật tư nào.</p></div>`; return;
        }
        mt_inventoryListEl.innerHTML = filteredInventory.map(item => {
            const stock = mt_getStockInfo(item.totalQuantity);
            return `<div data-id="${item.id}" class="mt-material-card bg-body p-3 rounded-3 shadow-sm border-0 d-flex align-items-start gap-3"><img src="${item.imageUrl.replace('400x300', '160x160')}" alt="${item.name}" class="rounded border" style="width: 64px; height: 64px; object-fit: cover;"><div class="flex-grow-1"><p class=" text-body-emphasis mb-1">${item.name}</p><p class="text-muted small font-monospace mb-2">${item.sku}</p><div class="d-flex justify-content-between align-items-center"><span class="badge ${stock.bg} ${stock.text_color} rounded-pill">${stock.text}</span><div><span class="small text-muted">Tổng tồn:</span> <span class=" fs-5 text-${stock.color}">${item.totalQuantity}</span></div></div></div></div>`;
        }).join('');
    };

    const mt_showMaterialDetailView = (materialId) => {
        mt_currentMaterialId = materialId;
        const material = mt_mockMaterials.find(item => item.id == materialId);
        if (!material) return;
        
        const materialBatches = mt_mockBatches.filter(b => b.materialId == materialId);
        const totalQuantity = materialBatches.reduce((sum, b) => sum + b.quantity, 0);
        const latestBatch = materialBatches.sort((a,b) => new Date(b.lastUpdated.split('/').reverse().join('-')) - new Date(a.lastUpdated.split('/').reverse().join('-')))[0] || {};

        const stock = mt_getStockInfo(totalQuantity);
        mt_detailViewElements.name.textContent = material.name;
        mt_detailViewElements.image.src = material.imageUrl;
        mt_detailViewElements.image.alt = material.name;
        mt_detailViewElements.sku.textContent = material.sku;
        mt_detailViewElements.quantity.textContent = totalQuantity;
        mt_detailViewElements.quantity.className = ` display-6 mb-0 text-${stock.color}`;
        mt_detailViewElements.statusBadge.textContent = stock.text;
        mt_detailViewElements.statusBadge.className = `badge fs-6 rounded-pill ${stock.bg} ${stock.text_color}`;
        mt_detailViewElements.location.innerHTML = `<i class="bi bi-geo-alt-fill me-2 text-muted"></i> ${[...new Set(materialBatches.map(b => b.location))].join(', ') || 'Chưa có vị trí'}`;
        mt_detailViewElements.supplier.textContent = latestBatch.supplier || 'N/A';
        mt_detailViewElements.lastUpdated.textContent = latestBatch.lastUpdated || 'N/A';
        mt_navigate('mt-detail');
    };
    
    const mt_showMaterialHistoryView = () => {
        const materialBatches = mt_mockBatches.filter(b => b.materialId == mt_currentMaterialId);
        const batchIds = materialBatches.map(b => b.batchId);
        const materialHistory = batchIds.flatMap(id => mt_mockHistory[id] || []).sort((a,b) => new Date(b.date.split('/').reverse().join('-')) - new Date(a.date.split('/').reverse().join('-')));

        if (materialHistory.length === 0) {
            mt_historyListEl.innerHTML = `<div class="text-center py-5"><p class="text-muted">Chưa có lịch sử cho vật tư này.</p></div>`;
        } else {
            mt_historyListEl.innerHTML = materialHistory.map(entry => {
                const isImport = entry.type === 'import';
                return `<div class="card card-body border-0 shadow-sm"><div class="d-flex w-100 justify-content-between"><h6 class="mb-1">${entry.reason}</h6><span class=" fs-5 ${isImport ? 'text-success' : 'text-danger'}">${isImport ? '+' : '-'}${entry.quantity}</span></div><small class="text-muted">${entry.date}</small></div>`;
            }).join('');
        }
        mt_navigate('mt-history');
    };
    
    const mt_populateMaterialsForSelect = (selectEl) => {
        selectEl.innerHTML = '<option value="">-- Chọn vật tư --</option>';
        mt_mockMaterials.forEach(material => {
            selectEl.innerHTML += `<option value="${material.id}">${material.name} (${material.sku})</option>`;
        });
    };

    const mt_showMaterialImportView = () => {
        mt_populateMaterialsForSelect(mt_importViewElements.select);
        Object.values(mt_importViewElements).forEach(el => { if(el.tagName !== 'SELECT') el.value = ''; });
        mt_importViewElements.priceTotal.value = '0 VNĐ';
        mt_navigate('mt-import');
    };

    const mt_showMaterialExportView = () => {
        mt_exportViewElements.batchSelect.innerHTML = '<option value="">-- Chọn lô vật tư --</option>';
        const groupedBatches = mt_mockMaterials.map(material => ({
            materialName: material.name,
            batches: mt_mockBatches.filter(b => b.materialId === material.id && b.quantity > 0)
        })).filter(group => group.batches.length > 0);

        groupedBatches.forEach(group => {
            const optgroup = document.createElement('optgroup');
            optgroup.label = group.materialName;
            group.batches.forEach(b => {
                const option = document.createElement('option');
                option.value = b.batchId;
                option.textContent = `Mã lô: ${b.batchCode} (Tồn: ${b.quantity} ${b.unit})`;
                optgroup.appendChild(option);
            });
            mt_exportViewElements.batchSelect.appendChild(optgroup);
        });

        Object.values(mt_exportViewElements).forEach(el => { if(el.tagName !== 'SELECT') el.value = ''; });
        mt_exportViewElements.exporter.value = mt_currentUser; 
        mt_exportViewElements.batchInfo.classList.add('d-none');
        mt_exportViewElements.totalPrice.value = "0 VNĐ";

        mt_navigate('mt-export');
    };
    
    const mt_setTheme = (theme) => {
        document.documentElement.setAttribute('data-bs-theme', theme);
        localStorage.setItem('theme', theme);
        document.querySelectorAll('.mt-theme-switcher-btn').forEach(btn => {
            btn.innerHTML = theme === 'dark' ? '<i class="bi bi-sun-fill"></i>' : '<i class="bi bi-moon-stars-fill"></i>';
        });
    };

    // Event Listeners
    mt_searchInputEl.addEventListener('input', mt_renderMaterialList);
    mt_filterButtonsEl.addEventListener('click', (e) => {
        const button = e.target.closest('.mt-filter-btn');
        if (!button) return;
        mt_currentFilter = button.dataset.filter;
        document.querySelectorAll('#mt-filter-buttons .mt-filter-btn').forEach(btn => {btn.classList.remove('btn-primary'); btn.classList.add('btn-secondary');});
        button.classList.add('btn-primary');
        button.classList.remove('btn-secondary');
        mt_renderMaterialList();
    });

    mt_inventoryListEl.addEventListener('click', (e) => {
        const card = e.target.closest('.mt-material-card');
        if(card) mt_showMaterialDetailView(card.dataset.id);
    });

    document.querySelectorAll('.mt-back-btn').forEach(btn => {
        console.log(1);
        
        btn.addEventListener('click', (e) => mt_navigate(e.currentTarget.dataset.target));
    });
    
    document.querySelectorAll('.mt-theme-switcher-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-bs-theme');
            mt_setTheme(currentTheme === 'dark' ? 'light' : 'dark');
        });
    });

    document.getElementById('mt-view-history-btn').addEventListener('click', mt_showMaterialHistoryView);
    document.getElementById('mt-show-import-view-btn').addEventListener('click', mt_showMaterialImportView);
    document.getElementById('mt-show-export-view-btn').addEventListener('click', mt_showMaterialExportView);

    [mt_importViewElements.quantity, mt_importViewElements.priceItem].forEach(el => {
        el.addEventListener('input', () => {
            const quantity = parseInt(mt_importViewElements.quantity.value) || 0;
            const price = parseFloat(mt_importViewElements.priceItem.value) || 0;
            mt_importViewElements.priceTotal.value = (quantity * price).toLocaleString('vi-VN') + ' VNĐ';
        });
    });

    document.getElementById('mt-save-import-btn').addEventListener('click', () => {
        const materialId = parseInt(mt_importViewElements.select.value);
        const batchCode = mt_importViewElements.batchCode.value.trim();
        const quantity = parseInt(mt_importViewElements.quantity.value);
        const unit = mt_importViewElements.unit.value.trim();
        const reason = mt_importViewElements.reason.value;
        const location = mt_importViewElements.location.value.trim();
        const pricePerItem = parseFloat(mt_importViewElements.priceItem.value);
        const description = mt_importViewElements.description.value.trim();

        if (!materialId || !batchCode || !quantity || !unit || !location || !pricePerItem) {
            mt_showToast('Vui lòng điền đầy đủ thông tin.', 'error'); return;
        }
        
        const newBatch = {
            batchId: Date.now(), materialId, batchCode, quantity, unit, location, pricePerItem, description,
            supplier: 'Nhà cung cấp mới',
            lastUpdated: new Date().toLocaleDateString('vi-VN'),
        };
        mt_mockBatches.push(newBatch);
        
        if (!mt_mockHistory[newBatch.batchId]) mt_mockHistory[newBatch.batchId] = [];
        mt_mockHistory[newBatch.batchId].push({ type: 'import', quantity, reason, date: newBatch.lastUpdated });
        
        mt_showToast(`Nhập kho thành công lô ${batchCode}!`);
        mt_navigate('mt-list');
        mt_renderMaterialList();
    });
    
    const mt_calculateExportTotal = () => {
        const quantity = parseInt(mt_exportViewElements.quantity.value) || 0;
        const price = parseFloat(mt_exportViewElements.price.value) || 0;
        mt_exportViewElements.totalPrice.value = (quantity * price).toLocaleString('vi-VN') + ' VNĐ';
    };

    [mt_exportViewElements.quantity, mt_exportViewElements.price].forEach(el => el.addEventListener('input', mt_calculateExportTotal));
    
    mt_exportViewElements.batchSelect.addEventListener('change', (e) => {
            const batchId = e.target.value;
            if (!batchId) {
            mt_exportViewElements.batchInfo.classList.add('d-none');
            return;
        }
        const batch = mt_mockBatches.find(b => b.batchId == batchId);
        mt_exportViewElements.stockInfo.textContent = `${batch.quantity} ${batch.unit}`;
        mt_exportViewElements.location.textContent = batch.location;
        mt_exportViewElements.price.value = batch.pricePerItem; 
        mt_exportViewElements.batchInfo.classList.remove('d-none');
        mt_calculateExportTotal();
    });

        document.getElementById('mt-save-export-btn').addEventListener('click', () => {
        const batchId = parseInt(mt_exportViewElements.batchSelect.value);
        const quantity = parseInt(mt_exportViewElements.quantity.value);
        const price = parseFloat(mt_exportViewElements.price.value);
        const exporter = mt_exportViewElements.exporter.value.trim();
        const receiver = mt_exportViewElements.receiver.value.trim();
        const form = mt_exportViewElements.formSelect.value;
        const reason = mt_exportViewElements.reason.value.trim();
        const description = mt_exportViewElements.description.value.trim();
        
        if (!batchId || !quantity || quantity <= 0 || !price || !receiver || !reason) {
            mt_showToast('Vui lòng điền đầy đủ các trường bắt buộc.', 'error'); return;
        }

        const batch = mt_mockBatches.find(b => b.batchId === batchId);
        if (quantity > batch.quantity) {
            mt_showToast('Số lượng xuất vượt quá tồn kho của lô.', 'error'); return;
        }

        batch.quantity -= quantity;
        batch.lastUpdated = new Date().toLocaleDateString('vi-VN');
        if (!mt_mockHistory[batch.batchId]) mt_mockHistory[batch.batchId] = [];
        mt_mockHistory[batch.batchId].push({ type: 'export', quantity, reason, date: batch.lastUpdated, price, exporter, receiver, form, description });

        mt_showToast(`Xuất kho thành công ${quantity} vật tư từ lô ${batch.batchCode}!`);
        mt_navigate('mt-list');
        mt_renderMaterialList();
    });
    
    const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    mt_setTheme(savedTheme);

    mt_renderMaterialList();
}

function initProductionOrderModule() {
    // --- DATA ---
    let productionOrders = [
        { id: 'LSX-24-001', product: 'Tủ quần áo 3 cánh', quantity: 50, startDate: '2024-07-20', status: 'completed', materials: [{name: 'Gỗ MDF', qty: 100}, {name: 'Sơn PU', qty: 20}, {name: 'Bản lề', qty: 150}] },
        { id: 'LSX-24-002', product: 'Bàn ăn 6 người', quantity: 30, startDate: '2024-07-22', status: 'inprogress', materials: [{name: 'Gỗ Sồi', qty: 60}, {name: 'Dầu lau', qty: 15}] },
        { id: 'LSX-24-003', product: 'Kệ TV treo tường', quantity: 120, startDate: '2024-07-25', status: 'new', materials: [] },
    ];
    let newOrderData = { info: {}, materials: [] }; // Used for both add and edit
    let products = [ { id: 'P01', text: 'Tủ quần áo 3 cánh' }, { id: 'P02', text: 'Bàn ăn 6 người' }, { id: 'P03', text: 'Kệ TV treo tường' }, { id: 'P04', text: 'Giường ngủ gỗ sồi' }, { id: 'P05', text: 'Bộ sofa phòng khách' }, ];
    let materials = [ { id: 'M01', text: 'Gỗ MDF' }, { id: 'M02', text: 'Sơn PU' }, { id: 'M03', text: 'Bản lề' }, { id: 'M04', text: 'Gỗ Sồi' }, { id: 'M05', text: 'Dầu lau' }, { id: 'M06', text: 'Vít các loại' }, ];
    let editingOrderId = null;

    // --- FUNCTIONS ---
    function navigateTo(pageId) { $('#PRODUCTION_ORDER .page').removeClass('active'); $(pageId).addClass('active'); }
    function renderOrderList() {
        const listEl = $('#productionOrderList'); listEl.empty();
        if (productionOrders.length === 0) { listEl.html('<p class="text-center text-muted">Chưa có lệnh sản xuất nào.</p>'); return; }
        productionOrders.forEach(order => {
            const statusInfo = getStatusInfo(order.status);
            const orderHtml = `<div class="list-item-wrapper"><div class="list-item-actions"><button class="action-button action-edit" data-id="${order.id}"><i class="fas fa-pen"></i>Sửa</button><button class="action-button action-delete" data-id="${order.id}"><i class="fas fa-trash"></i>Xoá</button></div><div class="list-item-content" data-id="${order.id}"><div class="d-flex w-100 justify-content-between"><h5 class="mb-1 font-weight-bold" style="color: var(--accent-color-light);">${order.id}</h5><small class="text-muted">${order.startDate}</small></div><p class="mb-1">${order.product} - SL: ${order.quantity}</p><small><span class="status-badge ${statusInfo.class}">${statusInfo.text}</span></small></div></div>`;
            listEl.append(orderHtml);
        });
    }
    function renderOrderDetail(orderId) {
        const order = productionOrders.find(o => o.id === orderId); if (!order) return;
        $('#detailOrderId').text(order.id);
        const infoContent = `<p><strong>Sản phẩm:</strong> ${order.product}</p><p><strong>Số lượng:</strong> ${order.quantity}</p><p><strong>Ngày bắt đầu:</strong> ${order.startDate}</p><p><strong>Trạng thái:</strong> <span class="status-badge ${getStatusInfo(order.status).class}">${getStatusInfo(order.status).text}</span></p>`;
        $('#detailInfoContent').html(infoContent);
        const materialsContent = $('#detailMaterialsContent'); materialsContent.empty();
        if (order.materials.length > 0) { order.materials.forEach(mat => { materialsContent.append(`<li class="list-group-item d-flex justify-content-between align-items-center">${mat.name} <span class="badge badge-primary badge-pill">${mat.qty}</span></li>`); }); } else { materialsContent.html('<li class="list-group-item text-muted">Không có vật tư cho lệnh này.</li>'); }
        setTimeout(() => updateTabIndicator($('#detailTabs')), 50);
    }
    function renderAddedMaterials() {
        const listEl = $('#addedMaterialsList'); listEl.empty();
        if (newOrderData.materials.length === 0) { listEl.html('<p class="text-center text-muted small mt-2">Chưa có vật tư nào được thêm.</p>'); return; }
        newOrderData.materials.forEach((mat, index) => { listEl.append(`<li class="list-group-item"><span>${mat.name} - SL: ${mat.qty}</span><button class="btn-delete-material" data-index="${index}"><i class="fas fa-trash"></i></button></li>`); });
    }
    function renderEditedMaterials() {
        const listEl = $('#editedMaterialsList'); listEl.empty();
        if (newOrderData.materials.length === 0) { listEl.html('<p class="text-center text-muted small mt-2">Chưa có vật tư nào được thêm.</p>'); return; }
        newOrderData.materials.forEach((mat, index) => { listEl.append(`<li class="list-group-item"><span>${mat.name} - SL: ${mat.qty}</span><button class="btn-delete-material" data-index="${index}"><i class="fas fa-trash"></i></button></li>`); });
    }
    function getStatusInfo(status) {
        switch (status) { case 'new': return { text: 'Mới', class: 'status-new' }; case 'inprogress': return { text: 'Đang SX', class: 'status-inprogress' }; case 'completed': return { text: 'Hoàn thành', class: 'status-completed' }; default: return { text: 'Không xác định', class: '' }; }
    }
    function resetStepper() {
        $('#stepper-1').addClass('active').removeClass('completed');
        $('#stepper-2').removeClass('active').removeClass('completed');
        $('#stepper-1 .step-counter').html('1');
        $('#stepper-2 .step-counter').html('2');
    }
    function populateEditForm(order) {
        $('#editOrderId').val(order.id);
        $('#editQuantity').val(order.quantity);
        $('#editStartDate').val(order.startDate);
        const product = products.find(p => p.text === order.product);
        if (product) { $('#editProductName').val(product.id).trigger('change'); }
        newOrderData.materials = JSON.parse(JSON.stringify(order.materials));
        renderEditedMaterials();
        $('#editTabs .tab-item:first').addClass('active').siblings().removeClass('active');
        $('#editTabContent .tab-pane:first').addClass('show active').siblings().removeClass('show active');
        setTimeout(() => updateTabIndicator($('#editTabs')), 50);
    }
    function updateTabIndicator(tabsContainer) {
        const activeTab = tabsContainer.find('.tab-item.active');
        const indicator = tabsContainer.find('.tab-indicator');
        if (activeTab.length) {
            indicator.css({
                left: activeTab[0].offsetLeft + 'px',
                width: activeTab[0].offsetWidth + 'px'
            });
        }
    }

    // --- INITIALIZE SELECT2 ---
    $('#productName').select2({ data: products, placeholder: "Chọn hoặc tìm sản phẩm", allowClear: true });
    $('#materialName').select2({ data: materials, placeholder: "Chọn vật tư", allowClear: true });
    $('#editProductName').select2({ data: products, placeholder: "Chọn hoặc tìm sản phẩm", allowClear: true });
    $('#editMaterialName').select2({ data: materials, placeholder: "Chọn vật tư", allowClear: true });
    
    // --- EVENT HANDLERS (GENERAL) ---
    // Detach previous handlers to avoid multiple bindings if init is called again
    $(document).off('click', '#PRODUCTION_ORDER .action-button');
    $('#PRODUCTION_ORDER').off();

    $('#btnAddOrder').on('click', function(e) { e.preventDefault(); $('#formStep1')[0].reset(); $('#productName').val(null).trigger('change'); resetStepper(); $('#addStep1').show(); $('#addStep2').hide(); newOrderData = { info: {}, materials: [] }; navigateTo('#addView'); });
    $('.btn-back').on('click', function() { navigateTo('#listView'); });
    
    // --- ADD ORDER LOGIC ---
    $('#formStep1').on('submit', function(e) {
        e.preventDefault(); const selectedProduct = $('#productName').select2('data')[0]; if (!selectedProduct || selectedProduct.text === "") { alert('Vui lòng chọn một sản phẩm.'); return; }
        newOrderData.info = { id: $('#orderId').val(), product: selectedProduct.text, quantity: $('#quantity').val(), startDate: $('#startDate').val(), status: 'new' };
        const summaryHtml = `<p class="mb-1"><strong>Mã lệnh:</strong> ${newOrderData.info.id}</p><p class="mb-0"><strong>Sản phẩm:</strong> ${newOrderData.info.product} (SL: ${newOrderData.info.quantity})</p>`;
        $('#orderSummary').html(summaryHtml);
        $('#stepper-1 .step-counter').html('<i class="fas fa-check"></i>');
        $('#stepper-1').removeClass('active').addClass('completed');
        $('#stepper-2').addClass('active');
        $('#addStep1').hide();
        $('#addStep2').show();
        renderAddedMaterials();
    });
    $('#formAddMaterial').on('submit', function(e) {
        e.preventDefault(); const selectedMaterial = $('#materialName').select2('data')[0]; const materialQty = $('#materialQty').val();
        if (selectedMaterial && selectedMaterial.text !== "" && materialQty) {
            newOrderData.materials.push({ name: selectedMaterial.text, qty: parseInt(materialQty) });
            renderAddedMaterials(); $('#materialQty').val(''); $('#materialName').val(null).trigger('change'); $('#materialName').select2('open');
        }
    });
    $('#addedMaterialsList').on('click', '.btn-delete-material', function() { newOrderData.materials.splice($(this).data('index'), 1); renderAddedMaterials(); });
    $('#btnSaveOrder').on('click', function() { productionOrders.unshift({ ...newOrderData.info, materials: newOrderData.materials }); renderOrderList(); navigateTo('#listView'); alert('Đã lưu lệnh sản xuất thành công!'); });
    
    // --- EDIT ORDER LOGIC ---
    $('#formEditMaterial').on('submit', function(e) {
        e.preventDefault(); const selectedMaterial = $('#editMaterialName').select2('data')[0]; const materialQty = $('#editMaterialQty').val();
        if (selectedMaterial && selectedMaterial.text !== "" && materialQty) {
            newOrderData.materials.push({ name: selectedMaterial.text, qty: parseInt(materialQty) });
            renderEditedMaterials(); $('#editMaterialQty').val(''); $('#editMaterialName').val(null).trigger('change'); $('#editMaterialName').select2('open');
        }
    });
    $('#editedMaterialsList').on('click', '.btn-delete-material', function() { newOrderData.materials.splice($(this).data('index'), 1); renderEditedMaterials(); });
    $('#btnUpdateOrder').on('click', function() {
        const orderIndex = productionOrders.findIndex(o => o.id === editingOrderId);
        if (orderIndex > -1) {
            const selectedProduct = $('#editProductName').select2('data')[0];
            productionOrders[orderIndex].product = selectedProduct ? selectedProduct.text : '';
            productionOrders[orderIndex].quantity = $('#editQuantity').val();
            productionOrders[orderIndex].startDate = $('#editStartDate').val();
            productionOrders[orderIndex].materials = newOrderData.materials;
            renderOrderList();
            navigateTo('#listView');
            alert('Đã cập nhật lệnh sản xuất!');
        }
        editingOrderId = null;
    });

    // --- TABS & SWIPE & CLICK LOGIC ---
    $('.custom-tabs').on('click', '.tab-item', function(e) {
        e.preventDefault();
        const $this = $(this);
        if ($this.hasClass('active')) return;

        const tabsContainer = $this.closest('.custom-tabs');
        tabsContainer.find('.tab-item').removeClass('active');
        $this.addClass('active');
        
        const targetPaneId = $this.data('target');
        $(targetPaneId).siblings('.tab-pane').removeClass('show active');
        $(targetPaneId).addClass('show active');

        updateTabIndicator(tabsContainer);
    });
    let startX, startY, swipedItem = null, isSwiping = false, didMove = false; const threshold = 50; const maxSwipe = 150;
    function closeSwipedItem() { if (swipedItem) { swipedItem.removeClass('swiped').css('transform', 'translateX(0)'); swipedItem = null; } }
    $('#productionOrderList').on('touchstart', '.list-item-content', function(e) { startX = e.originalEvent.touches[0].clientX; startY = e.originalEvent.touches[0].clientY; isSwiping = false; didMove = false; $(this).css('transition', 'none'); });
    $('#productionOrderList').on('touchmove', '.list-item-content', function(e) {
        if (e.originalEvent.touches.length === 0) return; let currentX = e.originalEvent.touches[0].clientX; let currentY = e.originalEvent.touches[0].clientY; let diffX = startX - currentX; let diffY = Math.abs(startY - currentY); if (!didMove) didMove = true;
        if (!isSwiping && Math.abs(diffX) > diffY && Math.abs(diffX) > 10) { isSwiping = true; if (swipedItem && swipedItem[0] !== $(this)[0]) { closeSwipedItem(); } }
        if (isSwiping) { e.preventDefault(); requestAnimationFrame(() => { let moveX = 0; if (diffX > 0) { moveX = diffX > maxSwipe ? maxSwipe + (diffX - maxSwipe) * 0.4 : diffX; $(this).css('transform', `translateX(${-moveX}px)`); } else { $(this).css('transform', `translateX(${-diffX}px)`); } }); }
    });
    $('#productionOrderList').on('touchend', '.list-item-content', function(e) {
        if (!isSwiping) return; $(this).css('transition', 'transform 0.3s ease-out'); let diffX = startX - e.originalEvent.changedTouches[0].clientX;
        if (diffX > threshold) { $(this).addClass('swiped').css('transform', `translateX(-${maxSwipe}px)`); swipedItem = $(this); } else { $(this).removeClass('swiped').css('transform', 'translateX(0)'); if (swipedItem && swipedItem[0] === $(this)[0]) { swipedItem = null; } }
    });
    $(document).on('click', '#PRODUCTION_ORDER', function(e) {
        const $target = $(e.target); const $clickedContent = $target.closest('.list-item-content'); if (didMove) { return; }
        if ($clickedContent.length) { if ($clickedContent.hasClass('swiped')) { closeSwipedItem(); } else { closeSwipedItem(); const orderId = $clickedContent.data('id'); renderOrderDetail(orderId); $('#detailTabs .tab-item:first').addClass('active').siblings().removeClass('active'); $('#myTabContent .tab-pane:first').addClass('show active').siblings().removeClass('show active'); navigateTo('#detailView'); } } else if (swipedItem && !$target.closest('.action-button')) { closeSwipedItem(); }
    });
    $('#productionOrderList').on('click', '.action-button', function(e) {
        e.stopPropagation(); const orderId = $(this).data('id');
        if($(this).hasClass('action-edit')) { 
            editingOrderId = orderId;
            const orderToEdit = productionOrders.find(o => o.id === editingOrderId);
            if (orderToEdit) {
                populateEditForm(orderToEdit);
                navigateTo('#editView');
            }
        }
        if($(this).hasClass('action-delete')) { if (confirm(`Bạn có chắc muốn xoá lệnh sản xuất ${orderId}?`)) { productionOrders = productionOrders.filter(o => o.id !== orderId); renderOrderList(); swipedItem = null; } }
    });

    // --- INITIALIZATION ---
    renderOrderList();
}

function initBomDeclarationModule() {
    const $container = $('#BOM_DECLARATION');

    // --- DATA ---
    let productBOMs = [
        { id: 'BOM001', name: 'BOM - iPhone 16 Pro', productName: 'iPhone 16 Pro', version: 'v1.0.2', shortDesc: 'BOM cho iPhone 16 Pro 256GB.', designer: 'Admin', sampleRequester: 'Steve', hardwareFinisher: 'Jony', softwareUploader: 'Craig', materials: [{name: 'Vi mạch XYZ', qty: 1}, {name: 'Màn hình OLED 6.1"', qty: 1}] },
        { id: 'BOM002', name: 'BOM - Galaxy S25 Ultra', productName: 'Galaxy S25 Ultra', version: 'v2.1.0', shortDesc: 'BOM cho Galaxy S25 Ultra 512GB.', designer: 'Admin', sampleRequester: 'Phil', hardwareFinisher: 'Andy', softwareUploader: 'Hiroshi', materials: [{name: 'Vi mạch ABC', qty: 1}] },
        { id: 'BOM003', name: 'BOM - Macbook Air M4', productName: 'Macbook Air M4', version: 'v1.0.0', shortDesc: 'BOM cho Macbook Air M4 13-inch.', designer: 'Team Apple', sampleRequester: 'Tim', hardwareFinisher: 'John', softwareUploader: 'Kevin', materials: [{name: 'Chip M4', qty: 1}] },
    ];
    let materialsMasterList = [ { id: 'M01', text: 'Vi mạch XYZ' }, { id: 'M02', text: 'Màn hình OLED 6.1"' }, { id: 'M03', text: 'Vỏ Titan' }, { id: 'M04', text: 'Vi mạch ABC' }, { id: 'M05', text: 'Màn hình Dynamic AMOLED' }, { id: 'M06', text: 'Chip M4' }, {id: 'M07', text: 'Vỏ nhôm'} ];
    let tempBomData = {};
    let editingBomId = null;

    // --- RENDER FUNCTIONS ---
    function navigateTo(pageId) { $container.find('.page').removeClass('active'); $container.find(pageId).addClass('active'); }
    function renderBOMList() {
        const listEl = $container.find('#bomListContainer'); listEl.empty();
        if (productBOMs.length === 0) { listEl.html('<p class="text-center text-muted p-3">Chưa có BOM nào.</p>'); return; }
        productBOMs.forEach(bom => {
            const bomHtml = `<div class="list-item-wrapper"><div class="list-item-actions"><button class="action-button action-edit" data-id="${bom.id}"><i class="fas fa-pen"></i>Sửa</button><button class="action-button action-delete" data-id="${bom.id}"><i class="fas fa-trash"></i>Xoá</button></div><div class="list-item-content" data-id="${bom.id}"><div class="d-flex w-100 justify-content-between"><h6 class="mb-1 font-weight-bold" style="color: var(--accent-color-light);">${bom.name}</h6><span class="bom-version-badge">${bom.version}</span></div><p class="mb-1 small text-secondary">${bom.shortDesc}</p></div></div>`;
            listEl.append(bomHtml);
        });
    }
    function renderMaterialList(listId, materials) {
        const listEl = $container.find(listId); listEl.empty();
        if (materials.length === 0) { listEl.html('<p class="text-center text-muted small mt-2">Chưa có vật tư nào.</p>'); return; }
        materials.forEach((mat, index) => { listEl.append(`<li class="list-group-item"><span>${mat.name} - SL: ${mat.qty}</span><button class="btn-delete-material" data-index="${index}"><i class="fas fa-trash"></i></button></li>`); });
    }
        function renderBOMDetail(bomId) {
        const bom = productBOMs.find(b => b.id === bomId); if (!bom) return;
        $container.find('#detailBomTitle').text(bom.name);
        $container.find('#detailBomName').text(bom.name);
        $container.find('#detailBomShortDesc').text(bom.shortDesc);
        $container.find('#detailBomVersion').text(bom.version);
        $container.find('#detailBomDesigner').text(bom.designer);
        $container.find('#detailBomSampleRequester').text(bom.sampleRequester || 'N/A');
        $container.find('#detailBomHardwareFinisher').text(bom.hardwareFinisher || 'N/A');
        $container.find('#detailBomSoftwareUploader').text(bom.softwareUploader || 'N/A');
        
        const materialsTableBody = $container.find('#detailMaterialsTableBody');
        materialsTableBody.empty();
        if (bom.materials.length > 0) { 
            bom.materials.forEach(mat => { 
                materialsTableBody.append(`<tr><td>${mat.name}</td><td class="text-right">${mat.qty}</td></tr>`); 
            }); 
        } else { 
            materialsTableBody.append('<tr><td colspan="2" class="text-center text-secondary">Không có vật tư.</td></tr>'); 
        }
        setTimeout(() => updateTabIndicator($('#detailTabs')), 50);
    }
    function resetStepper() {
        const stepper1 = $container.find('#stepper-1'), stepper2 = $container.find('#stepper-2');
        stepper1.addClass('active').removeClass('completed');
        stepper2.removeClass('active completed');
        stepper1.find('.step-counter').html('1');
        stepper2.find('.step-counter').html('2');
    }
    function populateEditForm(bom) {
        $container.find('#editBomName').val(bom.name);
        $container.find('#editBomProductName').val(bom.productName);
        $container.find('#editBomShortDesc').val(bom.shortDesc);
        $container.find('#editBomVersion').val(bom.version);
        $container.find('#editBomDesigner').val(bom.designer);
        $container.find('#editBomSampleRequester').val(bom.sampleRequester);
        $container.find('#editBomHardwareFinisher').val(bom.hardwareFinisher);
        $container.find('#editBomSoftwareUploader').val(bom.softwareUploader);
        tempBomData.materials = JSON.parse(JSON.stringify(bom.materials)); // Deep copy
        renderMaterialList('#editedMaterialsList', tempBomData.materials);
        $container.find('#editTabs .tab-item:first').addClass('active').siblings().removeClass('active');
        $container.find('#editTabContent .tab-pane:first').addClass('show active').siblings().removeClass('show active');
        setTimeout(() => updateTabIndicator($container.find('#editTabs')), 50);
    }
    function updateTabIndicator(tabsContainer) {
        const activeTab = tabsContainer.find('.tab-item.active');
        const indicator = tabsContainer.find('.tab-indicator');
        if (activeTab.length) {
            indicator.css({ left: activeTab[0].offsetLeft + 'px', width: activeTab[0].offsetWidth + 'px' });
        }
    }
    
    // --- INITIALIZE SELECT2 ---
    $container.find('#materialName, #editMaterialName').select2({ data: materialsMasterList, placeholder: "Chọn vật tư", allowClear: true });
    
    // --- EVENT HANDLERS ---
    $container.off(); // Detach all previous handlers

    $container.on('click', '#btnAddBom', function(e) { e.preventDefault(); $container.find('#formStep1')[0].reset(); resetStepper(); $container.find('#addStep1').show(); $container.find('#addStep2').hide(); tempBomData = { info: {}, materials: [] }; navigateTo('#addView'); });
    $container.on('click', '.btn-back', function() { navigateTo('#bomListView'); });
    
    // Add BOM Logic
    $container.on('submit', '#formStep1', function(e) {
        e.preventDefault();
        tempBomData.info = { 
            id: `BOM${Date.now()}`, 
            name: $container.find('#bomName').val(), 
            productName: $container.find('#bomProductName').val(), 
            shortDesc: $container.find('#bomShortDesc').val(), 
            version: $container.find('#bomVersion').val(), 
            designer: $container.find('#bomDesigner').val(),
            sampleRequester: $container.find('#bomSampleRequester').val(),
            hardwareFinisher: $container.find('#bomHardwareFinisher').val(),
            softwareUploader: $container.find('#bomSoftwareUploader').val()
        };
        $container.find('#bomSummary').html(`<p class="mb-1"><strong>Tên BOM:</strong> ${tempBomData.info.name}</p><p class="mb-0"><strong>Sản phẩm:</strong> ${tempBomData.info.productName}</p>`);
        const stepper1 = $container.find('#stepper-1'), stepper2 = $container.find('#stepper-2');
        stepper1.find('.step-counter').html('<i class="fas fa-check"></i>');
        stepper1.removeClass('active').addClass('completed');
        stepper2.addClass('active');
        $container.find('#addStep1').hide(); $container.find('#addStep2').show();
        renderMaterialList('#addedMaterialsList', tempBomData.materials);
    });

    $container.on('submit', '#formAddMaterial', function(e) {
        e.preventDefault();
        const selectedMaterial = $container.find('#materialName').select2('data')[0];
        const materialQty = $container.find('#materialQty').val();
        if (selectedMaterial && selectedMaterial.text && materialQty) {
            tempBomData.materials.push({ name: selectedMaterial.text, qty: parseInt(materialQty)});
            renderMaterialList('#addedMaterialsList', tempBomData.materials);
            this.reset();
            $container.find('#materialName').val(null).trigger('change');
        }
    });

    $container.on('click', '#addedMaterialsList .btn-delete-material', function() { tempBomData.materials.splice($(this).data('index'), 1); renderMaterialList('#addedMaterialsList', tempBomData.materials); });
    
    $container.on('click', '#btnSaveBom', function() {
        const newBom = { ...tempBomData.info, materials: tempBomData.materials };
        productBOMs.unshift(newBom);
        renderBOMList();
        navigateTo('#bomListView');
        alert('Đã lưu BOM thành công!');
    });
    
    // Edit BOM Logic
    $container.on('submit', '#formEditMaterial', function(e) {
        e.preventDefault();
        const selectedMaterial = $container.find('#editMaterialName').select2('data')[0];
        const materialQty = $container.find('#editMaterialQty').val();
        if (selectedMaterial && selectedMaterial.text && materialQty) {
            tempBomData.materials.push({ name: selectedMaterial.text, qty: parseInt(materialQty)});
            renderMaterialList('#editedMaterialsList', tempBomData.materials);
            this.reset();
            $container.find('#editMaterialName').val(null).trigger('change');
        }
    });
    $container.on('click', '#editedMaterialsList .btn-delete-material', function() { tempBomData.materials.splice($(this).data('index'), 1); renderMaterialList('#editedMaterialsList', tempBomData.materials); });

    $container.on('click', '#btnUpdateBom', function() {
        const bomIndex = productBOMs.findIndex(b => b.id === editingBomId);
        if (bomIndex > -1) {
            productBOMs[bomIndex] = {
                ...productBOMs[bomIndex],
                name: $container.find('#editBomName').val(),
                productName: $container.find('#editBomProductName').val(),
                shortDesc: $container.find('#editBomShortDesc').val(),
                version: $container.find('#editBomVersion').val(),
                designer: $container.find('#editBomDesigner').val(),
                sampleRequester: $container.find('#editBomSampleRequester').val(),
                hardwareFinisher: $container.find('#editBomHardwareFinisher').val(),
                softwareUploader: $container.find('#editBomSoftwareUploader').val(),
                materials: tempBomData.materials
            };
            renderBOMList();
            navigateTo('#bomListView');
            alert('Đã cập nhật BOM!');
        }
        editingBomId = null;
    });

    // TABS, SWIPE, CLICK Logic
    $container.on('click', '.custom-tabs .tab-item', function(e) {
        e.preventDefault();
        const $this = $(this);
        if ($this.hasClass('active')) return;
        const tabsContainer = $this.closest('.custom-tabs');
        tabsContainer.find('.tab-item').removeClass('active');
        $this.addClass('active');
        const targetPaneId = $this.data('target');
        $(targetPaneId).siblings('.tab-pane').removeClass('show active');
        $(targetPaneId).addClass('show active');
        updateTabIndicator(tabsContainer);
    });

    let startX, swipedItem = null, isSwiping = false, didMove = false;
    const threshold = 50, maxSwipe = 150;
    function closeSwipedItem() { if (swipedItem) { swipedItem.removeClass('swiped').css('transform', 'translateX(0)'); swipedItem = null; } }

    $container.on('touchstart', '#bomListContainer .list-item-content', function(e) {
        if (swipedItem && swipedItem[0] !== $(this)[0]) {
            closeSwipedItem();
        }
        startX = e.originalEvent.touches[0].clientX; 
        isSwiping = false; 
        didMove = false; 
        $(this).css('transition', 'none'); 
    });
    $container.on('touchmove', '#bomListContainer .list-item-content', function(e) { 
        if (e.originalEvent.touches.length === 0) return; 
        let currentX = e.originalEvent.touches[0].clientX; 
        let diffX = startX - currentX; 
        if (!didMove) didMove = true; 
        if (Math.abs(diffX) > 10) isSwiping = true; 
        if (isSwiping) { 
            e.preventDefault(); 
            let moveX = diffX > 0 ? Math.min(diffX, maxSwipe + 50) : Math.max(diffX, -50); 
            $(this).css('transform', `translateX(${-moveX}px)`); 
        } 
    });
    $container.on('touchend', '#bomListContainer .list-item-content', function(e) { 
        if (!isSwiping) return; 
        $(this).css('transition', 'transform 0.3s ease-out'); 
        let diffX = startX - e.originalEvent.changedTouches[0].clientX; 
        if (diffX > threshold) { 
            $(this).addClass('swiped').css('transform', `translateX(-${maxSwipe}px)`); 
            swipedItem = $(this); 
        } else { 
            $(this).removeClass('swiped').css('transform', 'translateX(0)'); 
            if (swipedItem && swipedItem[0] === $(this)[0]) swipedItem = null; 
        } 
    });
    
    $(document).on('click', function(e) {
        const $target = $(e.target);
        if (swipedItem && !$target.closest('.list-item-wrapper').length) {
            closeSwipedItem();
        }
    });

    $container.on('click', '.list-item-content', function(e){
        if (didMove) return;
        if ($(this).hasClass('swiped')) {
            closeSwipedItem();
        } else {
            const bomId = $(this).data('id');
            renderBOMDetail(bomId);
            navigateTo('#detailView');
        }
    });

    $container.on('click', '.action-button', function(e) {
        e.stopPropagation();
        const bomId = $(this).data('id');
        const bomToEdit = productBOMs.find(b => b.id === bomId);

        if($(this).hasClass('action-edit')) { 
            if (bomToEdit) {
                editingBomId = bomId;
                populateEditForm(bomToEdit);
                navigateTo('#editView');
            }
        }
        if($(this).hasClass('action-delete')) {
            if (confirm(`Bạn có chắc muốn xoá ${bomToEdit.name}?`)) {
                productBOMs = productBOMs.filter(b => b.id !== bomId);
                renderBOMList();
                swipedItem = null;
            }
        }
    });

    // --- INITIALIZATION ---
    renderBOMList();
}


// Chạy hàm khởi tạo để test (bạn sẽ xóa dòng này khi ghép file)
// 