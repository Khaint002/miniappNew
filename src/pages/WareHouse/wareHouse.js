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
                 id="app-${app.MENU_ID}" onclick="connectAppWaveHouse('${app.MENU_ID}', '${app.MENU_NAME}')"
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
    }
    // Hiện màn đúng ID
    $("#name-detail").text(NAME);
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

$('#backWaveHouse').click(() => {
    document.getElementById("wareHouse-menu").classList.remove("d-none");
    document.getElementById("wareHouse-detail").classList.add("d-none");
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
const generateScannedItems = (count, prefix) => Array.from({ length: count }, (_, i) => `${prefix}-item-${String(i + 1).padStart(4,'0')}`);
let mockBatches = [
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
const productionOrders = [
    { id: 'LSX-0987', productCode: 'SP-CPU-I9', productName: 'CPU Intel Core i9', bomId: 'BOM_CPU_I9_V1.5', specs: '14 nhân, 20 luồng', quantity: 100, unit: 'Cái', warranty: '36 tháng' },
    { id: 'LSX-0988', productCode: 'SP-RAM-DDR5', productName: 'RAM DDR5 16GB', bomId: 'BOM_RAM_DDR5_V2.1', specs: 'Kingston Fury, Bus 5200MHz', quantity: 500, unit: 'Thanh', warranty: '24 tháng' },
    { id: 'LSX-0989', productCode: 'SP-SSD-1TB', productName: 'SSD NVMe 1TB', bomId: 'BOM_SSD_NVME_V4.0', specs: 'Samsung 980 Pro', quantity: 250, unit: 'Ổ', warranty: '60 tháng' }
];
const boms = [
    { id: 'BOM_CPU_I9_V1.5', productCode: 'SP-CPU-I9', productName: 'CPU Intel Core i9', specs: '14 nhân, 20 luồng', unit: 'Cái', warranty: '36 tháng' },
    { id: 'BOM_RAM_DDR5_V2.1', productCode: 'SP-RAM-DDR5', productName: 'RAM DDR5 16GB', specs: 'Kingston Fury, Bus 5200MHz', unit: 'Thanh', warranty: '24 tháng' },
    { id: 'BOM_SSD_NVME_V4.0', productCode: 'SP-SSD-1TB', productName: 'SSD NVMe 1TB', specs: 'Samsung 980 Pro', unit: 'Ổ', warranty: '60 tháng' }
];

// --- Lấy các phần tử DOM ---
const getDomElements = () => ({
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
const dom = getDomElements();

// --- Biến trạng thái ---
let currentScreen = 'list';
let currentFormMode = 'add';
let editingBatchCode = null;
let batchCodeToDeleteState = null;
let openSwipeContainer = null;
let deleteModal, idScanModal, appToast;

// --- State for Identification Screen ---
let sessionScannedData = {};
let sessionScannedCount = 0;
let currentScanIndices = { pallet: 1, carton: 1, layer: 1 };
let currentIdBatch = null;

// --- CÁC HÀM XỬ LÝ CHUNG ---
const navigateTo = (screen) => {
    currentScreen = screen;
    dom.listScreen.classList.toggle('d-none', screen !== 'list');
    dom.formScreen.classList.toggle('d-none', screen !== 'form');
    dom.productIdScreen.classList.toggle('d-none', screen !== 'details');
};

const showToast = (message, type = 'success') => {
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

const getStatusClass = (status) => ({
    'Sẵn sàng nhập kho': 'text-bg-success', 'Đã qua KCS': 'text-bg-primary',
    'Mới sản xuất': 'text-bg-warning', 'Đã hủy': 'text-bg-danger'
}[status] || 'text-bg-secondary');

const closeOpenSwipeContainer = (animate = true) => {
    if (openSwipeContainer) {
        const content = openSwipeContainer.querySelector('.swipe-content');
        content.style.transition = animate ? 'transform 0.2s ease-out' : 'none';
        content.style.transform = 'translateX(0px)';
        openSwipeContainer = null;
    }
};

// --- Chức năng Màn hình Danh sách ---
const renderBatches = (batches) => {
  console.log('test');
  
    const activeBatches = batches.filter(b => b.active === 0);
    dom.batchListContainer.innerHTML = '';
    dom.noResults.classList.toggle('d-none', activeBatches.length > 0);
    activeBatches.forEach(batch => {
        const batchCardHTML = `
        <div class="swipe-container position-relative bg-body-tertiary rounded-3 shadow-sm border border-secondary overflow-hidden">
            <div class="swipe-actions position-absolute top-0 end-0 h-100 d-flex align-items-center">
                <button data-action="edit" data-code="${batch.batchCode}" class="h-100 btn btn-primary rounded-0 px-4 d-flex flex-column align-items-center justify-content-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="mb-1 pe-none" viewBox="0 0 16 16"><path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V12h2.293z"/></svg>
                    <span class="small fw-semibold pe-none">Sửa</span>
                </button>
                <button data-action="delete" data-code="${batch.batchCode}" class="h-100 btn btn-danger rounded-0 px-4 d-flex flex-column align-items-center justify-content-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="mb-1 pe-none" viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/><path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/></svg>
                    <span class="small fw-semibold pe-none">Xóa</span>
                </button>
            </div>
            <div class="swipe-content bg-body-secondary position-relative z-1 p-3" style="transition: transform 0.2s ease-out; cursor: pointer;" data-code="${batch.batchCode}">
                <div class="d-flex justify-content-between align-items-start pe-none">
                    <div>
                        <p class="fw-bold text-light mb-1">${batch.batchCode}</p>
                        <p class="small text-body mb-0">${batch.productName}</p>
                    </div>
                    <span class="badge rounded-pill small ${getStatusClass(batch.status)}">${batch.status}</span>
                </div>
                <div class="mt-3 d-flex justify-content-between align-items-center small text-secondary pe-none">
                    <span>SL: <span class="fw-semibold text-light">${batch.quantity} ${batch.unit}</span></span>
                    <span>Ngày tạo: <span class="fw-semibold text-light">${batch.creationDate}</span></span>
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

const handleSearch = () => {
    const searchTerm = dom.searchInput.value.toLowerCase();
    const filteredBatches = mockBatches.filter(batch => 
        batch.batchCode.toLowerCase().includes(searchTerm) ||
        batch.productName.toLowerCase().includes(searchTerm) ||
        (batch.lsx && batch.lsx.toLowerCase().includes(searchTerm))
    );
    renderBatches(filteredBatches);
};

// --- Chức năng Màn hình Form (Sửa/Thêm) ---
const resetFormFields = () => {
    dom.form.reset(); dom.batchCreationDate.valueAsDate = new Date();
    clearAutoFilledFields();
};
const clearAutoFilledFields = () => {
    dom.productCode.value = ''; dom.productName.value = ''; dom.bomDisplay.value = '';
    dom.specifications.value = ''; dom.plannedQuantity.value = ''; dom.unit.value = '';
    dom.warranty.value = '';
};
const setupFormForAdd = () => {
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
const setupFormForEdit = (batchCode) => {
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
const handleDelete = (batchCode) => {
    batchCodeToDeleteState = batchCode;
    dom.batchCodeToDelete.textContent = batchCode;
    deleteModal.show();
};
const confirmDelete = () => {
    const batchIndex = mockBatches.findIndex(b => b.batchCode === batchCodeToDeleteState);
    if (batchIndex > -1) mockBatches[batchIndex].active = 1;
    deleteModal.hide(); handleSearch();
};
const populateDropdowns = () => {
    dom.productionOrderSelect.innerHTML = '<option value="">-- Chọn LSX --</option>';
    dom.bomSelect.innerHTML = '<option value="">-- Chọn BOM --</option>';
    productionOrders.forEach(o => dom.productionOrderSelect.add(new Option(`${o.id} - ${o.productName}`, o.id)));
    boms.forEach(b => dom.bomSelect.add(new Option(`${b.id} - ${b.productName}`, b.id)));
};
const fillFormWithData = (data) => {
    if (!data) { clearAutoFilledFields(); return; }
    dom.productCode.value = data.productCode || ''; dom.productName.value = data.productName || '';
    dom.bomDisplay.value = data.bomId || data.id || ''; dom.specifications.value = data.specs || '';
    dom.plannedQuantity.value = data.quantity || ''; dom.actualQuantity.value = data.quantity || '';
    dom.unit.value = data.unit || ''; dom.warranty.value = data.warranty || '';
};
const handleFormSubmit = (e) => {
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
const setupProductIdScreen = (batchCode) => {
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

const handleDeclarationChange = () => {
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

const renderScannedData = (data) => {
    const totalCount = Object.values(data).reduce((pAcc, cartons) => pAcc + Object.values(cartons).reduce((cAcc, layers) => cAcc + Object.values(layers).reduce((lAcc, items) => lAcc + items.length, 0), 0), 0);
    dom.scanCount.textContent = totalCount;
    if (totalCount === 0) {
        dom.idListDetails.innerHTML = '<p class="text-center text-secondary small m-0">Chưa có sản phẩm nào được quét.</p>'; return;
    }
    let html = '';
    const renderLayers = (layers, indentClass = 'ms-4') => Object.entries(layers).map(([layerKey, items]) => `<details open><summary class="${indentClass}">Lớp ${layerKey.split('_')[1]} (${items.length} SP)</summary>${items.map(item => `<p class="item-code font-monospace small">${item}</p>`).join('')}</details>`).join('');
    const renderCartons = (cartons, indentClass = 'ms-2') => Object.entries(cartons).map(([cartonKey, layers]) => `<details open><summary class="fw-bold ${indentClass}">Thùng ${cartonKey.split('_')[1]}</summary>${renderLayers(layers)}</details>`).join('');
    
    if (currentIdBatch.batchUnit === 'Container') {
          html = Object.entries(data).map(([palletKey, cartons]) => `<details open><summary class="fw-bolder">Pallet ${palletKey.split('_')[1]}</summary>${renderCartons(cartons)}</details>`).join('');
    } else if (data.pallet_1) {
        html = renderCartons(data.pallet_1, 'ms-0 fw-bold');
    }
    dom.idListDetails.innerHTML = html || '<p class="text-center text-secondary small m-0">Chưa có sản phẩm nào được quét.</p>';
};

const getDeclaration = (batch) => {
    const b = batch || currentIdBatch;
    if (!b) return { pallets: 1, cartons: 1, layers: 1, items: 1 };
    return {
        pallets: b.palletsPerContainer || 1, cartons: b.cartonsPerPallet || 1,
        layers: b.layersPerCarton || 1, items: b.itemsPerLayer || 1,
    };
};

const getIndicesFromTotal = (totalScanned, batch) => {
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

const updateScanProgressUI = () => {
    if (!currentIdBatch) return;
    const dec = getDeclaration();
    const unit = currentIdBatch.batchUnit;
    dom.progress.pallet.classList.add('d-none'); dom.progress.carton.classList.add('d-none'); dom.progress.layer.classList.add('d-none');
    dom.scanProgressContainer.classList.add('d-none');
    if (unit === 'Container') { dom.progress.pallet.classList.remove('d-none'); dom.progress.pallet.lastElementChild.textContent = `${currentScanIndices.pallet} / ${dec.pallets || 'N/A'}`; }
    if (['Container', 'Pallet'].includes(unit)) { dom.progress.carton.classList.remove('d-none'); dom.progress.carton.lastElementChild.textContent = `${currentScanIndices.carton} / ${dec.cartons || 'N/A'}`; }
    if (['Container', 'Pallet', 'Thùng'].includes(unit)) { dom.progress.layer.classList.remove('d-none'); dom.progress.layer.lastElementChild.textContent = `${currentScanIndices.layer} / ${dec.layers || 'N/A'}`; dom.scanProgressContainer.classList.remove('d-none'); }
};

const handleSimulateScan = () => {
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

const handleSaveIdentities = () => {
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

const updateIdButtonStates = () => {
    if (!currentIdBatch) { dom.startScanButton.disabled = true; dom.saveIdentitiesButton.disabled = true; return; };
    const remaining = currentIdBatch.quantity - currentIdBatch.identifiedQuantity;
    dom.startScanButton.disabled = remaining <= 0;
    dom.saveIdentitiesButton.disabled = sessionScannedCount === 0;
};

const resetIdSession = () => {
    sessionScannedData = {}; sessionScannedCount = 0; dom.modalScanCount.textContent = 0;
};

const showDeclarationLevelsByUnit = (unit) => {
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
const addEventListeners = () => {
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
const initializeApp = () => {
    deleteModal = new bootstrap.Modal(dom.deleteModalEl);
    idScanModal = new bootstrap.Modal(dom.idScanModalEl);
    appToast = new bootstrap.Toast(dom.toastEl);
    addEventListeners();
    renderBatches(mockBatches);
};

initializeApp();