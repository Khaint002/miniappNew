// var apps_waveHouse = [
//     { MENU_ID: "CREATELOT", MENU_NAME: "Tạo lô", MENU_VERSION: "v1.1.5", MENU_BGCOLOR: "#17a2b8", MENU_ICON: "bi-cloud-sun", MENU_SHARE_OWNER: "WID=", MENU_SHARE_ADMIN: null, MENU_SHARE_GUEST: null, MENU_TYPE: "LOAD", MENU_LINK: "https://miniapp-new.vercel.app/src/pages/History/history.html", DESCRIPTION: "Quản lý lô hàng", VISIBLE: true },
//     { MENU_ID: "PRQRCODE", MENU_NAME: "In mã QR", MENU_VERSION: "v4.56 Pro", MENU_BGCOLOR: "#da4a58", MENU_ICON: "bi-pc-display-horizontal", MENU_SHARE_OWNER: null, MENU_SHARE_ADMIN: null, MENU_SHARE_GUEST: null, MENU_TYPE: "LOCATION", MENU_LINK: "http://devices.homeos.vn/", DESCRIPTION: "In mã QR", VISIBLE: true },
//     { MENU_ID: "IMPORT", MENU_NAME: "Kho sản phẩm", MENU_VERSION: "v1.0.5", MENU_BGCOLOR: "#e29038", MENU_ICON: "bi-tools", MENU_SHARE_OWNER: "Q=OWNER&CK=", MENU_SHARE_ADMIN: "Q=ADMIN&CK=", MENU_SHARE_GUEST: "Q=GUEST&CK=", MENU_TYPE: "LOAD", MENU_LINK: "https://miniapp-new.vercel.app/src/pages/History/history.html", DESCRIPTION: "Tồn kho", VISIBLE: true },
//     { MENU_ID: "EXPORT", MENU_NAME: "Xuất kho", MENU_VERSION: "v1.0.4", MENU_BGCOLOR: "#17a2b8", MENU_ICON: "bi-toggles", MENU_SHARE_OWNER: "CID=", MENU_SHARE_ADMIN: null, MENU_SHARE_GUEST: null, MENU_TYPE: "LOAD", MENU_LINK: "https://miniapp-new.vercel.app/src/pages/History/history.html", DESCRIPTION: "Quét xuất kho", VISIBLE: true },
// ];
var apps_waveHouse = [
    { MENU_ID: "WAREHOUSE_PRODUCT", MENU_NAME: "Kho Sản Phẩm", MENU_ICON: "bi-box-seam", MENU_BGCOLOR_CLASS: "bg-primary", DESCRIPTION: "Xem tồn kho, nhập, xuất", VISIBLE: true, },
    { MENU_ID: "MATERIAL", MENU_NAME: "Kho Vật Tư", MENU_ICON: "bi-tools", MENU_BGCOLOR_CLASS: "bg-success", DESCRIPTION: "Quản lý vật tư sản xuất", VISIBLE: true, },
    { MENU_ID: "CREATELOT", MENU_NAME: "Quản Lý Lô", MENU_ICON: "bi-stack", MENU_BGCOLOR_CLASS: "bg-warning", DESCRIPTION: "Tạo và sửa lô hàng", VISIBLE: true, },
    { MENU_ID: "PRQRCODE", MENU_NAME: "Tạo QR", MENU_ICON: "bi-qr-code", MENU_BGCOLOR_CLASS: "bg-info", DESCRIPTION: "In mã QR cho sản phẩm", VISIBLE: true, },
    { MENU_ID: "BOM_DECLARATION", MENU_NAME: "Khai báo BOM", MENU_ICON: "bi-diagram-3", MENU_BGCOLOR_CLASS: "bg-secondary", DESCRIPTION: "Định mức nguyên vật liệu", VISIBLE: true, },
    { MENU_ID: "PRODUCTION_ORDER", MENU_NAME: "Lập Lệnh SX", MENU_ICON: "bi-building-gear", MENU_BGCOLOR_CLASS: "bg-danger", DESCRIPTION: "Tạo lệnh sản xuất mới", VISIBLE: true, },
];
var currentCameraIndex = 0;
var isScannerRunning = false;
var dataPR;
var dataMaterial;
var dataBom;
var dataLSX;
var dataDetailLot;
var mockBatches = [
    
    // {
    //     batchCode: "LSP-250911-002",
    //     productCode: "SP-RAM-DDR5",
    //     productName: "RAM DDR5 16GB",
    //     bomId: "BOM_RAM_DDR5_V2.1",
    //     lsx: "LSX-0988",
    //     creationDate: "2025-09-11",
    //     status: "Mới sản xuất",
    //     active: 0,
    //     // Identification Data
    //     quantity: 482,
    //     unit: "Thanh",
    //     batchUnit: "Thùng",
    //     identifiedQuantity: 22,
    //     scannedData: {
    //         pallet_1: {
    //             carton_1: {
    //                 layer_1: generateScannedItems(1, "P1-C1-L1"),
    //                 layer_2: generateScannedItems(1, "P1-C1-L2"),
    //             },
    //         },
    //     },
    //     palletsPerContainer: null,
    //     cartonsPerPallet: null,
    //     layersPerCarton: 5,
    //     itemsPerLayer: 20,
    // }
];
var productionOrders = [];
var boms = [];

// --- FUNCTIONS ---
async function renderApps(apps, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = "";
    setTheme("dark");
    apps.forEach((app) => {
        if (!app.VISIBLE) return;

        // Determine text color based on background class for better contrast
        const textClass = ["bg-success", "bg-warning", "bg-info"].includes(
            app.MENU_BGCOLOR_CLASS
        )
            ? "text-dark"
            : "text-white";

        const html = `
        <div class="col-6">
            <div class="card p-3 text-center rounded-4 h-100" id="app-${app.MENU_ID}" onclick="connectAppWaveHouse('${app.MENU_ID}', '${app.MENU_NAME}')">
                <div class="icon-box ${app.MENU_BGCOLOR_CLASS} ${textClass} mx-auto mb-2"><i class="${app.MENU_ICON}"></i></div>
                <h3 class="h6 mb-1 text-body-emphasis">${app.MENU_NAME}</h3>
                <p class="small text-secondary mb-0">${app.DESCRIPTION}</p>
            </div>
        </div>`;
        container.insertAdjacentHTML("beforeend", html);
    });
    dataMaterial = await HOMEOSAPP.getDM(
        HOMEOSAPP.linkbase,
        "DM_ITEM",
        "1=1"
    );
    HOMEOSAPP.delay(100);
    dataBom = await HOMEOSAPP.getApiServicePublic(
        HOMEOSAPP.linkbase,
        "GetDataDynamicWareHouse",
        "TYPE_QUERY='BOM'"
    );
    HOMEOSAPP.delay(100);
    dataLSX = await HOMEOSAPP.getApiServicePublic(
        HOMEOSAPP.linkbase,
        "GetDataDynamicWareHouse",
        "TYPE_QUERY='LSX'"
    );

    dataLSX = await groupProductDataWithArrayLSX(dataLSX);

    console.log(dataLSX);
    
    dataBom = await groupProductDataWithArray(dataBom);
    $("#loading-popup").hide();
}
function scanAgain() {
    // document.getElementById("footer-instruct-scanQR").classList.add("d-none");
    document.getElementById("result-form").classList.add("d-none");
    document.getElementById("file-input").value = '';
    if(typeof window.ScanQR == "function"){
        ScanQRcodeByZalo();
    } else {
        startQRcode();
    }
}
// Scan QR code
$("#start-scan-button").off("click").click(function () {
    if(typeof window.ScanQR == "function"){
        ScanQRcodeByZalo();
    } else {
        startQRcode();
    }
});

function startQRcode() {
    $("#result-form-total, #result-form-title").addClass("d-none");
    $("#result-form-loading, #result-form-stationID, #result-form-stationName").removeClass("d-none");
    $("#qr-popup").show();

    // Lấy danh sách camera và bắt đầu quét
    Html5Qrcode.getCameras().then(_devices => {
        devices = _devices; // Lưu lại danh sách camera
        if (devices && devices.length) {
            if (devices.length == 1) {
                startScanW(devices[currentCameraIndex].id, "user");  // Bắt đầu quét với camera đầu tiên
            } else {
                startScanW(devices[currentCameraIndex].id, "environment");
            }
        } else {
            console.error("Không tìm thấy thiết bị camera nào.");
        }
    }).catch(err => {
        console.error("Lỗi khi lấy danh sách camera: ", err);
    });
}

async function startScanW(cameraId, cam) {
    currentCamera = cam;
    html5QrCode = new Html5Qrcode("qr-reader");
    html5QrCode.start(
        cameraId,
        {
            fps: 30,    // Số khung hình trên giây
            qrbox: { width: 250, height: 250 },  // Kích thước khung quét QR
            aspectRatio: 1.7, // Đặt tỉ lệ khung hình
            videoConstraints: {
                // width: { ideal: 3840 }, // Độ phân giải video 4k
                // height: { ideal: 2160 },
                width: { ideal: 1920 }, // Độ phân giải video 1080p
                height: { ideal: 1080 },
                // width: { ideal: 2560 }, // Độ phân giải video 2k 
                // height: { ideal: 1440 },
                facingMode: { exact: cam },
                advanced: [{ zoom: 2 }]
            }
        },
        onScanSuccess,
        onScanFailure
    ).then(() => {
        isScannerRunning = true;  // Đánh dấu scanner đang chạy
        setTimeout(() => {
            if (typeQR == 1) {
                $('#qr-shaded-region').css('border-width', '35vh 10vh');
                // $('#qr-shaded-region').attr('style', 'border-width: 35vh 10vh !important;');
            } else {
                $('#qr-shaded-region').css('border-width', '36vh 13vh');
                // $('#qr-shaded-region').attr('style', 'border-width: 40vh 15vh !important;');
            }
        }, 100);
    }).catch(err => {
        console.error("Lỗi khi khởi động camera: ", err);
    });

}

async function ScanQRcodeByZalo() {
    const testDataScan = await window.ScanQR();
    if(testDataScan){
        onScanSuccess(testDataScan);
    }
}

async function onScanSuccess(decodedText, decodedResult) {
    ['result-form-total', 'result-product', 'result-condition'].forEach(id => document.getElementById(id).classList.add('d-none'));
    if (isScannerRunning) {
        html5QrCode.stop().then(ignore => {
            isScannerRunning = false;  // Đánh dấu scanner đã dừng
            document.getElementById("result-form").classList.remove("d-none");
        }).catch(err => {
            console.error("Lỗi khi dừng camera sau khi quét thành công: ", err);
        });
    } else {
        $("#qr-popup").show();
        document.getElementById("result-form").classList.remove("d-none");
    }
    const urlPattern = /^https?:\/\/[^\s/$.?#].[^\s]*$/i;
    let data;
    let domain;
    let workstation;
    let checkQRcode;

    if (urlPattern.test(decodedText)) {
        const urlObj = new URL(decodedText)
        const param = new URLSearchParams(urlObj.search);
        const paramObject = {};
        param.forEach((value, key) => {
            paramObject[key] = value;
        });
        console.log(paramObject);
        
        if(paramObject.CK){
            const dataQRcode = await HOMEOSAPP.getDM(
                "https://central.homeos.vn/service_XD/service.svc",
                "DM_QRCODE",
                "CK_CODE='"+paramObject.CK+"'"
            );
            console.log(dataQRcode);
            decodedText = dataQRcode.data[0].QR_CODE
            checkQRcode = dataQRcode.data[0].QR_CODE.split(',');
        } 

        if(checkQRcode){
            //dom.inputs.itemsPerLayer
            // console.log(dom.inputs.layersPerCarton.value);
            
            const checkQR = addProduct(dataDetailLot, decodedText, dom.inputs.itemsPerLayer.value, dom.inputs.layersPerCarton.value, 1, 1);
            console.log(checkQR);
            
            switch (checkQR) {
                case "FULL":
                    toastr.error("Đã quét đủ số lượng cần!");
                    $("#qr-popup").hide();
                    break;
                case "DULICATE":
                    toastr.error("sản phẩm đã được quét!");
                    $("#qr-popup").hide();
                    break;
                case "COMPLETE":
                    renderScannedData(dataDetailLot);
                    scanAgain();
                    break;
                default:
                    break;
            }
            console.log(data);
            
            
        }
        // else if(paramObject.CID){
        //     decodedText = QRcode
        //     const workstationID = url.searchParams.get("workstationID");
        //     const QRcode = url.searchParams.get("QRcode");
        //     decodedText = QRcode
        //     console.log(decodedText);
        //     checkQRcode = QRcode.split(',');
        // }
        
    } else {
        checkQRcode = decodedText.split(',');
    }
}
function onScanFailure(error) {
    // Xử lý lỗi (nếu cần)
}
$("#close-scanner").off("click").click(function () {
    if (isScannerRunning) {
        html5QrCode.stop().then(ignore => {
            isScannerRunning = false;  // Đánh dấu scanner đã dừng
            $('#qr-popup').hide() // Đóng popup
        }).catch(err => {
            console.error("Lỗi khi dừng quét QR: ", err);
        });
    } else {
        $('#qr-popup').hide() // Nếu không có quét đang chạy, chỉ đóng popup
    }
});

$("#upload-qr").off("click").click(function () {
    $("#file-input").click();  // Mở hộp thoại chọn file
});

$("#file-input").change(function (event) {
    var file = event.target.files[0];  // Đảm bảo lấy file đúng
    if (file) {
        // Dừng quét camera trước khi quét file
        if (isScannerRunning) {
            html5QrCode.stop().then(function () {
                isScannerRunning = false;  // Đánh dấu scanner đã dừng
                var reader = new FileReader();
                reader.onload = function (e) {
                    var img = new Image();
                    img.onload = function () {
                        // Quét QR từ hình ảnh đã tải lên
                        html5QrCode.scanFile(file).then(async decodedText => {  // Sửa tại đây
                            console.log(decodedText);
                            
                            document.getElementById("result-form").classList.remove("d-none");
                            const urlPattern = /^https?:\/\/[^\s/$.?#].[^\s]*$/i;
                            let data;
                            let domain;
                            let workstation;
                            let checkQRcode;
                            
                            if (urlPattern.test(decodedText)) {
                                const urlObj = new URL(decodedText)
                                const param = new URLSearchParams(urlObj.search);
                                const paramObject = {};
                                param.forEach((value, key) => {
                                    paramObject[key] = value;
                                });
                                console.log(paramObject);
                                
                                if(paramObject.CK){
                                    const dataQRcode = await HOMEOSAPP.getDM(
                                        "https://central.homeos.vn/service_XD/service.svc",
                                        "DM_QRCODE",
                                        "CK_CODE='"+paramObject.CK+"'"
                                    );
                                    console.log(dataQRcode);
                                    decodedText = dataQRcode.data[0].QR_CODE
                                    checkQRcode = dataQRcode.data[0].QR_CODE.split(',');
                                }

                                
                            } else {
                                checkQRcode = decodedText.split(',');
                            }
                            if(checkQRcode){
                                //dom.inputs.itemsPerLayer
                                const data = addProduct(dataDetailLot, decodedText, 2, dom.inputs.layersPerCarton, dom.inputs.cartonsPerPallet, dom.inputs.palletsPerContainer);
                                
                                console.log(data);
                                renderScannedData(data);
                                
                            }
                            $('#result-form').addClass('d-none');
                        });
                    };
                    img.src = e.target.result;
                };
                reader.readAsDataURL(file);  // Đọc hình ảnh từ file
            }).catch(err => {
                console.error("Lỗi khi dừng camera: ", err);
            });
        } else {
            // Nếu không có scanner đang chạy, quét trực tiếp từ hình ảnh
            var reader = new FileReader();
            reader.onload = function (e) {
                var img = new Image();
                img.onload = function () {
                    html5QrCode.scanFile(file).then(decodedText => {
                        $("#result").text("Kết quả quét: " + decodedText); // Hiển thị kết quả
                    }).catch(err => {
                        $("#result").text("Không thể quét QR từ hình ảnh.");
                        console.error("Lỗi khi quét hình ảnh QR: ", err);
                    });
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);  // Đọc hình ảnh từ file
        }
    }
});

function addProduct(data, productCode, maxItemsPerLayer = 20, maxLayersPerCarton = 3, maxCartonsPerPallet = 1, maxPallets = 1) {
  // Kiểm tra nếu đã tồn tại

  for (let palletKey in data) {
    let pallet = data[palletKey];
    for (let cartonKey in pallet) {
      let carton = pallet[cartonKey];
      for (let layerKey in carton) {
        if (carton[layerKey].includes(productCode)) {
        //   console.log("Sản phẩm đã tồn tại trong", palletKey, cartonKey, layerKey);
          return "DULICATE";
        }
      }
    }
  }

  // Nếu chưa tồn tại → tìm chỗ để thêm
  let palletCount = Object.keys(data).length;
  let lastPalletKey = `pallet_${palletCount}`;
  let lastPallet = data[lastPalletKey];

  if (!lastPallet || Object.keys(lastPallet).length >= maxCartonsPerPallet) {
    // tạo pallet mới
    if (palletCount >= maxPallets) {
    } else {
        lastPalletKey = `pallet_${palletCount + 1}`;
        data[lastPalletKey] = {};
        lastPallet = data[lastPalletKey];
    }
  }

  let cartonCount = Object.keys(lastPallet).length;
  let lastCartonKey = `carton_${cartonCount}`;
  let lastCarton = lastPallet[lastCartonKey];

  if (!lastCarton || Object.keys(lastCarton).length >= maxLayersPerCarton) {
    // tạo carton mới
    if (cartonCount >= maxCartonsPerPallet) {
      
    } else {
        lastCartonKey = `carton_${cartonCount + 1}`;
        lastPallet[lastCartonKey] = {};
        lastCarton = lastPallet[lastCartonKey];
    }
    
  }

  let layerKeys = Object.keys(lastCarton).sort((a, b) => {
    return parseInt(a.split("_")[1]) - parseInt(b.split("_")[1]);
  });

  for (let key of layerKeys) {
    if (lastCarton[key].length < maxItemsPerLayer) {
      lastCarton[key].push(productCode);
    //   console.log("Đã thêm sản phẩm vào", lastPalletKey, lastCartonKey, key);
      dataDetailLot = data;
      return "COMPLETE";
    }
  }

  // 5. Nếu tất cả layer đều đầy → tạo layer mới
  let layerCount = layerKeys.length;
  if (layerCount >= maxLayersPerCarton) {
    // toastr.error("số lượng cần quét đã đủ");
    return 'FULL';
  } else {
    let newLayerKey = `layer_${layerCount + 1}`;
    lastCarton[newLayerKey] = [productCode];
    dataDetailLot = data
  }

  
  console.log("Đã thêm sản phẩm vào", lastPalletKey, lastCartonKey);

  return "COMPLETE";
}

// ---------------------------------------------------------------------
function groupProductDataWithArray(sourceData) {
    const resultArray = []; // Khởi tạo mảng kết quả cuối cùng
    const ArrayBom = [];
    sourceData.forEach(item => {
        // Tìm xem sản phẩm đã có trong mảng kết quả chưa
        let existingProduct = resultArray.find(p => p.id === item.TRAN_NO);

        // Tạo thông tin vật tư từ item hiện tại
        const newMaterial = {
            id: item.ITEM_ID,
            name: item.ITEM_NAME,
            qty: item.QUANTITY,
            cmt: item.QUNATITY_ADDING || 0
        };

        if (existingProduct) {
            // Nếu sản phẩm đã tồn tại, chỉ cần thêm vật tư vào
            existingProduct.materials.push(newMaterial);
        } else {
            // Nếu sản phẩm chưa tồn tại, tạo mới sản phẩm và thêm vào mảng kết quả
            const newProduct = {
                id: item.TRAN_NO,
                name: `${item.BOM_PRODUCT}`,
                productName: item.PRODUCT_ID,
                version: item.VERSION || 'v1.0.0',
                noteVersion: item.NOTE_VERSION || 'v1.0.0',
                shortDesc: item.TRAN_NO || 'Không có mô tả',
                designer: item.USER_ID,
                sampleRequester: item.CUSTOMER_ID || 'Chưa có thông tin',
                hardwareFinisher: item.HARDWARE_OF || 'Chưa có thông tin',
                softwareUploader: item.SOFTWARE_OF || 'Chưa có thông tin',
                // Khởi tạo mảng materials với vật tư đầu tiên
                materials: [newMaterial] 
            };
            resultArray.push(newProduct);
            ArrayBom.push({
                id: item.TRAN_NO,
                productCode: item.PRODUCT_ID,
                productName: item.PRODUCT_ID,
                specs: item.NOTE_VERSION,
                unit: "Cái",
                warranty: "60",
            })
        }
    });
    boms = ArrayBom;
    return resultArray;
}
function groupProductDataWithArrayLSX(sourceData) {
    const resultArray = [];
    const ArrayLot = []
    sourceData.forEach(item => {
        // Kiểm tra xem LSX (TRAN_NO) đã có trong mảng kết quả chưa
        let existingOrder = resultArray.find(o => o.id === item.TRAN_NO);

        // Tạo thông tin vật tư từ item hiện tại
        const newMaterial = {
            id: item.ITEM_ID,
            name: item.ITEM_NAME,
            qty: item.QUANTITY,
            cmt: item.WH_QUANTITY
        };
        

        if (existingOrder) {
            // Nếu đã có LSX, thêm vật tư vào
            existingOrder.materials.push(newMaterial);
        } else {
            // Nếu chưa có, tạo mới 1 đơn sản xuất
            const newOrder = {
                id: item.TRAN_NO,                  // giống "LSX-24-001"
                product: item.BOM_PRODUCT,         // tên sản phẩm
                quantity: item.ORDER_QTY || 0,     // số lượng sản xuất (nếu có)
                startDate: item.TRAN_DATE || "",  // ngày bắt đầu (nếu có)
                status: item.STATUS || "pending",  // trạng thái
                designer: item.USER_ID,
                description: item.DESCRIPTION || "",
                materials: [newMaterial]           // khởi tạo mảng materials
            };
            ArrayLot.push({
                id: item.TRAN_NO,
                productCode: item.PRODUCT_ID,
                productName: item.PRODUCT_NAME,
                bomId: item.BOM_PRODUCT,
                specs: "",
                quantity: item.ORDER_QTY,
                unit: "Cái",
                warranty: "36",
            });
            resultArray.push(newOrder);
        }
    });
    productionOrders = ArrayLot;
    console.log();
    
    return resultArray;
}

function connectAppWaveHouse(ID, NAME) {
    // Ẩn màn chọn menu
    document.getElementById("wareHouse-menu").classList.add("d-none");
    document.getElementById("wareHouse-detail").classList.remove("d-none");

    // Ẩn tất cả màn chức năng
    document
        .querySelectorAll(".app-screen")
        .forEach((div) => div.classList.add("d-none"));
    if (ID == "CREATELOT") {
        $("#productSelect").select2({
            placeholder: "-- Chọn sản phẩm --",
            allowClear: true,
            width: "100%",
            dropdownParent: $("#CREATELOT"), // tránh lỗi z-index khi trong modal
        });

    } else if (ID == "PRQRCODE") {
        runOptionS();
        showPrintOptions("detail");
    } else if (ID == "WAREHOUSE_PRODUCT") {
        renderInventory();
    } else if (ID == "MATERIAL") {
        initializeMaterialInventoryApp();
    } else if (ID == "BOM_DECLARATION") {
        initBomDeclarationModule();
    } else if (ID == "PRODUCTION_ORDER") {
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

$(".backWaveHouse").click(() => {
    document.getElementById("wareHouse-menu").classList.remove("d-none");
    document.getElementById("wareHouse-detail").classList.add("d-none");
    $("#footer-wareHouse").removeClass("d-none");
});

$("#backMenuAll").click(() => {
    HOMEOSAPP.goBack();
});

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

    options.forEach((opt) => {
        if (!opt.hasAttribute("data-bound")) {
            opt.addEventListener("click", () => {
                // Bỏ selected tất cả
                options.forEach((o) => o.classList.remove("selected"));
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

// --- DỮ LIỆU MẪU (MOCK DATA) ---
var generateScannedItems = (count, prefix) =>
    Array.from(
        { length: count },
        (_, i) => `${prefix}-item-${String(i + 1).padStart(4, "0")}`
    );
function mapProductionDataToBatches(productionData) {
    return productionData.map(item => {
        return {
            batchCode: item.LOT_PRODUCT_CODE,
            productCode: item.PRODUCT_CODE,
            productName: item.PRODUCT_NAME,
            bomId: item.BOM_PRODUCT,
            lsx: item.PRODUCTION_ORDER,
            // Xử lý chuỗi ngày tháng để chỉ lấy phần ngày
            creationDate: item.DATE_CREATE.split('T')[0],
            status: item.STATUS_NAME,
            active: 0, 
            // Identification Data
            quantity: item.QUANTITY_PLAN,
            unit: item.UNIT_NAME,
            batchUnit: item.UNIT_LOT_ID,
            identifiedQuantity: 0, // Giá trị mặc định
            scannedData: {
                pallet_1: {
                    carton_1: {
                        layer_1: generateScannedItems(1, "P1-C1-L1")
                    },
                },
            }, // Giá trị mặc định
            palletsPerContainer: item.PALLET_IN_CONTAINER,
            cartonsPerPallet: item.CARTON_IN_PALLET,
            layersPerCarton: item.CLASS_IN_CARTON, // Giả sử Class là Layer
            itemsPerLayer: item.PRODUCT_IN_CLASS,
        };
    });
}


// --- Lấy các phần tử DOM ---
var getDomElements = () => ({
    listScreen: document.getElementById("list-screen"),
    formScreen: document.getElementById("form-screen"),
    productIdScreen: document.getElementById("product-id-screen"),
    batchListContainer: document.getElementById("batch-list-container"),
    searchInput: document.getElementById("search-input"),
    noResults: document.getElementById("no-results"),
    addNewButton: document.getElementById("add-new-button"),
    backToListButton: document.getElementById("back-to-list-button"),
    backToListFromDetailsButton: document.getElementById(
        "back-to-list-from-details-button"
    ),
    form: document.getElementById("batch-declaration-form"),
    formTitle: document.getElementById("form-title"),
    formSubmitButton: document.getElementById("form-submit-button"),
    // Delete Modal
    deleteModalEl: document.getElementById("delete-modal"),
    batchCodeToDelete: document.getElementById("batch-code-to-delete"),
    confirmDeleteButton: document.getElementById("confirm-delete-button"),
    // Form fields
    declarationTypeRadios: document.querySelectorAll(
        'input[name="declaration_type"]'
    ),
    lsxSelectorContainer: document.getElementById("lsx-selector-container"),
    bomSelectorContainer: document.getElementById("bom-selector-container"),
    productionOrderSelect: document.getElementById("production-order"),
    bomSelect: document.getElementById("bom-select"),
    batchCode: document.getElementById("batch-code"),
    batchCreationDate: document.getElementById("batch-creation-date"),
    productCode: document.getElementById("product-code"),
    productName: document.getElementById("product-name"),
    bomDisplay: document.getElementById("bom-display"),
    specifications: document.getElementById("specifications"),
    plannedQuantity: document.getElementById("planned-quantity"),
    actualQuantity: document.getElementById("actual-quantity"),
    unit: document.getElementById("unit"),
    batchUnit: document.getElementById("batch-unit"),
    warranty: document.getElementById("warranty"),
    status: document.getElementById("status"),
    // Product ID Screen
    productIdTitle: document.getElementById("product-id-title"),
    batchInfoContainer: document.getElementById("batch-info-container"),
    packagingContainer: document.getElementById(
        "packaging-declaration-container"
    ),
    infoProductName: document.getElementById("info-product-name"),
    infoUnit: document.getElementById("info-unit"),
    infoTotalQuantity: document.getElementById("info-total-quantity"),
    infoIdentifiedQuantity: document.getElementById("info-identified-quantity"),
    infoRemainingQuantity: document.getElementById("info-remaining-quantity"),
    idListDetails: document.getElementById("id-list-details"),
    scanCount: document.getElementById("scan-count"),
    saveIdentitiesButton: document.getElementById("save-identities-button"),
    scanProgressContainer: document.getElementById("scan-progress-container"),
    progress: {
        pallet: document.getElementById("progress-pallet"),
        carton: document.getElementById("progress-carton"),
        layer: document.getElementById("progress-layer"),
    },
    inputs: {
        palletsPerContainer: document.getElementById("pallets-per-container"),
        cartonsPerPallet: document.getElementById("cartons-per-pallet"),
        layersPerCarton: document.getElementById("layers-per-carton"),
        itemsPerLayer: document.getElementById("items-per-layer"),
    },
    // Scan Modal for ID
    idScanModalEl: document.getElementById("id-scan-modal"),
    modalScanCount: document.getElementById("modal-scan-count"),
    simulateScanButton: document.getElementById("simulate-scan-button"),
    startScanButton: document.getElementById("start-scan-button"),
    // Toast
    toastEl: document.getElementById("app-toast"),
    toastTitle: document.getElementById("toast-title"),
    toastBody: document.getElementById("toast-body"),
});
var dom = getDomElements();

// --- Biến trạng thái ---
var currentScreen = "list";
var currentFormMode = "add";
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
    dom.listScreen.classList.toggle("d-none", screen !== "list");
    dom.formScreen.classList.toggle("d-none", screen !== "form");
    dom.productIdScreen.classList.toggle("d-none", screen !== "details");
};

var showToast = (message, type = "success") => {
    dom.toastEl.classList.remove(
        "text-bg-success",
        "text-bg-info",
        "text-bg-warning",
        "text-bg-danger"
    );
    let bgClass = "";
    switch (type) {
        case "info":
            bgClass = "text-bg-info";
            break;
        case "warning":
            bgClass = "text-bg-warning";
            break;
        case "error":
            bgClass = "text-bg-danger";
            break;
        default:
            bgClass = "text-bg-success";
            break;
    }
    dom.toastEl.classList.add(bgClass);
    dom.toastBody.textContent = message;
    appToast.show();
};

var getStatusClass = (status) =>
({
    "Sẵn sàng nhập kho": "text-bg-success",
    "Đã qua KCS": "text-bg-primary",
    "Mới sản xuất": "text-bg-warning",
    "Đã hủy": "text-bg-danger",
}[status] || "text-bg-secondary");

var closeOpenSwipeContainer = (animate = true) => {
    if (openSwipeContainer) {
        const content = openSwipeContainer.querySelector(".swipe-content");
        content.style.transition = animate ? "transform 0.2s ease-out" : "none";
        content.style.transform = "translateX(0px)";
        openSwipeContainer = null;
    }
};

// --- Chức năng Màn hình Danh sách ---
var renderBatches = (batches) => {
    const activeBatches = batches.filter((b) => b.active === 0);
    dom.batchListContainer.innerHTML = "";
    dom.noResults.classList.toggle("d-none", activeBatches.length > 0);
    activeBatches.forEach((batch) => {
        const batchCardHTML = `
        <div class="swipe-container position-relative bg-body-tertiary rounded-3 shadow-sm border border-secondary overflow-hidden">
            <div class="swipe-actions position-absolute top-0 end-0 h-100 d-flex align-items-center">
                <button data-action="edit" data-code="${batch.batchCode
            }" class="h-100 btn btn-primary rounded-0 px-4 d-flex flex-column align-items-center justify-content-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="mb-1 pe-none" viewBox="0 0 16 16"><path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V12h2.293z"/></svg>
                    <span class="small pe-none">Sửa</span>
                </button>
                <button data-action="delete" data-code="${batch.batchCode
            }" class="h-100 btn btn-danger rounded-0 px-4 d-flex flex-column align-items-center justify-content-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="mb-1 pe-none" viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/><path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/></svg>
                    <span class="small pe-none">Xóa</span>
                </button>
            </div>
            <div style="text-align: start;" class="swipe-content bg-body-secondary position-relative z-1 p-3" style="transition: transform 0.2s ease-out; cursor: pointer;" data-code="${batch.batchCode
            }">
                <div class="d-flex justify-content-between align-items-start pe-none">
                    <div>
                        <p class=" text-light mb-1">${batch.batchCode}</p>
                        <p class="small text-body mb-0">${batch.productName}</p>
                    </div>
                    <span class="badge rounded-pill small ${getStatusClass(
                batch.status
            )}" style="font-weight: 300;">${batch.status}</span>
                </div>
                <div class="mt-3 d-flex justify-content-between align-items-center small text-secondary pe-none">
                    <span>SL: <span class= text-light">${batch.quantity} ${batch.unit
            }</span></span>
                    <span>Ngày tạo: <span class= text-light">${batch.creationDate
            }</span></span>
                </div>
            </div>
        </div>`;
        dom.batchListContainer.insertAdjacentHTML("beforeend", batchCardHTML);
    });
    initializeSwipeActions();
};

function initializeSwipeActions() {
    document.querySelectorAll(".swipe-container").forEach((container) => {
        const content = container.querySelector(".swipe-content");
        if (!content) return;

        let startX,
            startY,
            diffX = 0,
            diffY = 0,
            isDragging = false,
            isScrolling = false;
        const tapThreshold = 10;

        const handleTouchStart = (e) => {
            if (openSwipeContainer && openSwipeContainer !== container)
                closeOpenSwipeContainer();
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            diffX = 0;
            diffY = 0;
            isDragging = true;
            isScrolling = false;
            content.style.transition = "none";
        };

        const handleTouchMove = (e) => {
            if (!isDragging) return;
            diffX = e.touches[0].clientX - startX;
            diffY = e.touches[0].clientY - startY;
            if (!isScrolling && Math.abs(diffY) > Math.abs(diffX) + 5)
                isScrolling = true;
            if (isScrolling) return;
            e.preventDefault();

            const actionsWidth =
                container.querySelector(".swipe-actions").offsetWidth;
            if (diffX > 0) diffX = 0;
            if (Math.abs(diffX) > actionsWidth) {
                const overdrag = Math.abs(diffX) - actionsWidth;
                diffX = -actionsWidth - overdrag / 4;
            }
            content.style.transform = `translateX(${diffX}px)`;
        };

        const handleTouchEnd = () => {
            if (!isDragging || isScrolling) {
                isDragging = false;
                return;
            }
            isDragging = false;
            content.style.transition = "transform 0.2s ease-out";

            const actionsWidth =
                container.querySelector(".swipe-actions").offsetWidth;
            if (Math.abs(diffX) < tapThreshold) {
                if (openSwipeContainer === container) closeOpenSwipeContainer();
                else setupProductIdScreen(content.dataset.code);
            } else if (diffX < -actionsWidth / 2) {
                content.style.transform = `translateX(${-actionsWidth}px)`;
                openSwipeContainer = container;
            } else {
                content.style.transform = "translateX(0px)";
                if (openSwipeContainer === container) openSwipeContainer = null;
            }
        };

        content.addEventListener("touchstart", handleTouchStart, { passive: true });
        content.addEventListener("touchmove", handleTouchMove);
        content.addEventListener("touchend", handleTouchEnd);
    });
}

var handleSearch = () => {
    const searchTerm = dom.searchInput.value.toLowerCase();
    const filteredBatches = mockBatches.filter(
        (batch) =>
            batch.batchCode.toLowerCase().includes(searchTerm) ||
            batch.productName.toLowerCase().includes(searchTerm) ||
            (batch.lsx && batch.lsx.toLowerCase().includes(searchTerm))
    );
    renderBatches(filteredBatches);
};

// --- Chức năng Màn hình Form (Sửa/Thêm) ---
var resetFormFields = () => {
    dom.form.reset();
    dom.batchCreationDate.valueAsDate = new Date();
    clearAutoFilledFields();
};
var clearAutoFilledFields = () => {
    dom.productCode.value = "";
    dom.productName.value = "";
    dom.bomDisplay.value = "";
    dom.specifications.value = "";
    dom.plannedQuantity.value = "";
    dom.unit.value = "";
    dom.warranty.value = "";
};
var setupFormForAdd = () => {
    currentFormMode = "add";
    editingBatchCode = null;
    dom.formTitle.textContent = "Khai Báo Lô Sản Phẩm";
    dom.formSubmitButton.textContent = "Xác Nhận & Lưu Lô";
    dom.batchCode.value = `LSP-${new Date()
        .toISOString()
        .slice(2, 10)
        .replace(/-/g, "")}-${String(mockBatches.length + 1).padStart(3, "0")}`;
    resetFormFields();
    populateDropdowns();
    dom.declarationTypeRadios[0].checked = true;
    dom.lsxSelectorContainer.classList.remove("d-none");
    dom.bomSelectorContainer.classList.add("d-none");
    navigateTo("form");
};
var setupFormForEdit = (batchCode) => {
    const batch = mockBatches.find((b) => b.batchCode === batchCode);
    console.log(batch);
    
    if (!batch) return;
    currentFormMode = "edit";
    editingBatchCode = batchCode;
    dom.formTitle.textContent = "Chỉnh Sửa Lô Sản Phẩm";
    dom.formSubmitButton.textContent = "Cập Nhật Lô";

    populateDropdowns();
    clearAutoFilledFields();
    if (batch.lsx) {
        dom.declarationTypeRadios[0].checked = true;
        dom.lsxSelectorContainer.classList.remove("d-none");
        dom.bomSelectorContainer.classList.add("d-none");
        dom.productionOrderSelect.value = batch.lsx;
        fillFormWithData(productionOrders.find((o) => o.id === batch.lsx));
    } else if (batch.bomId) {
        dom.declarationTypeRadios[1].checked = true;
        dom.lsxSelectorContainer.classList.add("d-none");
        dom.bomSelectorContainer.classList.remove("d-none");
        dom.bomSelect.value = batch.bomId;
        fillFormWithData(boms.find((b) => b.id === batch.bomId));
    }
    dom.batchCode.value = batch.batchCode;
    dom.productName.value = batch.productName;
    dom.batchCreationDate.value = batch.creationDate;
    dom.actualQuantity.value = batch.quantity;
    dom.status.value = batch.status;
    dom.unit.value = batch.unit;
    dom.batchUnit.value = batch.batchUnit;
    navigateTo("form");
};
var handleDelete = (batchCode) => {
    batchCodeToDeleteState = batchCode;
    dom.batchCodeToDelete.textContent = batchCode;
    deleteModal.show();
};
var confirmDelete = () => {
    const batchIndex = mockBatches.findIndex(
        (b) => b.batchCode === batchCodeToDeleteState
    );
    if (batchIndex > -1) mockBatches[batchIndex].active = 1;
    deleteModal.hide();
    handleSearch();
};
var populateDropdowns = () => {
    dom.productionOrderSelect.innerHTML =
        '<option value="">-- Chọn LSX --</option>';
    dom.bomSelect.innerHTML = '<option value="">-- Chọn BOM --</option>';
    productionOrders.forEach((o) =>
        dom.productionOrderSelect.add(
            new Option(`${o.id} - ${o.productName}`, o.id)
        )
    );
    boms.forEach((b) =>
        dom.bomSelect.add(new Option(`${b.id} - ${b.productName}`, b.id))
    );
};
var fillFormWithData = (data) => {
    if (!data) {
        clearAutoFilledFields();
        return;
    }
    console.log(data);
    
    dom.productCode.value = data.productCode || "";
    dom.productName.value = data.productName || "";
    dom.bomDisplay.value = data.bomId || data.id || "";
    dom.specifications.value = data.specs || "";
    dom.plannedQuantity.value = data.quantity || "";
    dom.actualQuantity.value = data.quantity || "";
    dom.unit.value = data.unit || "";
    dom.warranty.value = data.warranty || "";
};
var handleFormSubmit = (e) => {
    e.preventDefault();
    const formData = {
        batchCode: dom.batchCode.value,
        productName: dom.productName.value,
        bomId: dom.bomDisplay.value,
        lsx: dom.declarationTypeRadios[0].checked
            ? dom.productionOrderSelect.value
            : null,
        quantity: parseInt(dom.actualQuantity.value),
        unit: dom.unit.value,
        batchUnit: dom.batchUnit.value,
        creationDate: dom.batchCreationDate.value,
        status: dom.status.value,
        active: 0,
        // Add default identification fields
        identifiedQuantity: 0,
        scannedData: {},
        palletsPerContainer: null,
        cartonsPerPallet: null,
        layersPerCarton: null,
        itemsPerLayer: null,
    };
    if (currentFormMode === "add") {
        mockBatches.unshift(formData);
    } else {
        const batchIndex = mockBatches.findIndex(
            (b) => b.batchCode === editingBatchCode
        );
        if (batchIndex > -1)
            mockBatches[batchIndex] = { ...mockBatches[batchIndex], ...formData };
    }
    handleSearch();
    navigateTo("list");
};

// --- Chức năng Màn hình Định danh (ID Screen) ---
var setupProductIdScreen = (batchCode) => {
    const foundBatch = mockBatches.find((b) => b.batchCode === batchCode);
    if (!foundBatch) {
        showToast("Lỗi: Không tìm thấy lô sản phẩm.", "error");
        return;
    }

    currentIdBatch = JSON.parse(JSON.stringify(foundBatch)); // Deep copy for editing
    resetIdSession();

    dom.productIdTitle.textContent = `Lô: ${currentIdBatch.batchCode}`;
    dom.infoProductName.textContent = currentIdBatch.productName;
    dom.infoUnit.textContent = currentIdBatch.batchUnit;
    dom.infoTotalQuantity.textContent =
        currentIdBatch.quantity.toLocaleString("vi-VN");
    dom.infoIdentifiedQuantity.textContent =
        currentIdBatch.identifiedQuantity.toLocaleString("vi-VN");
    dom.infoRemainingQuantity.textContent = (
        currentIdBatch.quantity - currentIdBatch.identifiedQuantity
    ).toLocaleString("vi-VN");

    showDeclarationLevelsByUnit(currentIdBatch.batchUnit);
    dom.inputs.palletsPerContainer.value =
        currentIdBatch.palletsPerContainer || "";
    dom.inputs.cartonsPerPallet.value = currentIdBatch.cartonsPerPallet || "";
    dom.inputs.layersPerCarton.value = currentIdBatch.layersPerCarton || "";
    dom.inputs.itemsPerLayer.value = currentIdBatch.itemsPerLayer || "";

    currentScanIndices = getIndicesFromTotal(
        currentIdBatch.identifiedQuantity,
        currentIdBatch
    );
    renderScannedData(currentIdBatch.scannedData);
    handleDeclarationChange();
    updateIdButtonStates();
    navigateTo("details");
};

var handleDeclarationChange = () => {
    if (!currentIdBatch) return;
    currentIdBatch.itemsPerLayer =
        parseInt(dom.inputs.itemsPerLayer.value, 10) || null;
    currentIdBatch.layersPerCarton =
        parseInt(dom.inputs.layersPerCarton.value, 10) || null;
    currentIdBatch.cartonsPerPallet =
        parseInt(dom.inputs.cartonsPerPallet.value, 10) || null;
    currentIdBatch.palletsPerContainer =
        parseInt(dom.inputs.palletsPerContainer.value, 10) || null;

    const { quantity, batchUnit } = currentIdBatch;
    const {
        itemsPerLayer = 0,
        layersPerCarton = 0,
        cartonsPerPallet = 0,
        palletsPerContainer = 0,
    } = currentIdBatch;

    const itemsPerCarton = itemsPerLayer * layersPerCarton;
    const itemsPerPallet = itemsPerCarton * cartonsPerPallet;
    const itemsPerContainer = itemsPerPallet * palletsPerContainer;

    const totalContainers =
        itemsPerContainer > 0 ? Math.ceil(quantity / itemsPerContainer) : 0;
    const totalPallets =
        itemsPerPallet > 0 ? Math.ceil(quantity / itemsPerPallet) : 0;
    const totalCartons =
        itemsPerCarton > 0 ? Math.ceil(quantity / itemsPerCarton) : 0;

    // Update UI
    let showDivider = false;
    [
        "carton",
        "pallet",
        "container",
        "total-cartons",
        "total-pallets",
        "total-containers",
    ].forEach((type) => {
        document.getElementById(`calc-${type}-row`).classList.add("d-none");
    });

    if (["Thùng", "Pallet", "Container"].includes(batchUnit)) {
        document.getElementById("calc-items-per-carton").textContent =
            itemsPerCarton > 0 ? itemsPerCarton.toLocaleString("vi-VN") : "-";
        document.getElementById("calc-carton-row").classList.remove("d-none");
        if (totalCartons > 0) {
            document.getElementById("calc-total-cartons").textContent =
                totalCartons.toLocaleString("vi-VN");
            document
                .getElementById("calc-total-cartons-row")
                .classList.remove("d-none");
            showDivider = true;
        }
    }
    if (["Pallet", "Container"].includes(batchUnit)) {
        document.getElementById("calc-items-per-pallet").textContent =
            itemsPerPallet > 0 ? itemsPerPallet.toLocaleString("vi-VN") : "-";
        document.getElementById("calc-pallet-row").classList.remove("d-none");
        if (totalPallets > 0) {
            document.getElementById("calc-total-pallets").textContent =
                totalPallets.toLocaleString("vi-VN");
            document
                .getElementById("calc-total-pallets-row")
                .classList.remove("d-none");
            showDivider = true;
        }
    }
    if (batchUnit === "Container") {
        document.getElementById("calc-items-per-container").textContent =
            itemsPerContainer > 0 ? itemsPerContainer.toLocaleString("vi-VN") : "-";
        document.getElementById("calc-container-row").classList.remove("d-none");
        if (totalContainers > 0) {
            document.getElementById("calc-total-containers").textContent =
                totalContainers.toLocaleString("vi-VN");
            document
                .getElementById("calc-total-containers-row")
                .classList.remove("d-none");
            showDivider = true;
        }
    }
    document
        .getElementById("calc-divider")
        .classList.toggle("d-none", !showDivider);
    updateScanProgressUI();
    updateIdButtonStates();
};

var renderScannedData = (data) => {
    console.log(data);
    dataDetailLot = data;
    const totalCount = Object.values(data).reduce(
        (pAcc, cartons) =>
            pAcc +
            Object.values(cartons).reduce(
                (cAcc, layers) =>
                    cAcc +
                    Object.values(layers).reduce((lAcc, items) => lAcc + items.length, 0),
                0
            ),
        0
    );
    dom.scanCount.textContent = totalCount;
    if (totalCount === 0) {
        dom.idListDetails.innerHTML =
            '<p class="text-center text-secondary small m-0">Chưa có sản phẩm nào được quét.</p>';
        return;
    }
    let html = "";
    const renderLayers = (layers, indentClass = "ms-4") =>
        Object.entries(layers)
            .map(
                ([layerKey, items]) =>
                    `<details open><summary class="${indentClass}">Lớp ${layerKey.split("_")[1]
                    } (${items.length} SP)</summary>${items
                        .map(
                            (item) => `<p class="item-code font-monospace small">${item}</p>`
                        )
                        .join("")}</details>`
            )
            .join("");
    const renderCartons = (cartons, indentClass = "ms-2") =>
        Object.entries(cartons)
            .map(
                ([cartonKey, layers]) =>
                    `<details open><summary class=" ${indentClass}">Thùng ${cartonKey.split("_")[1]
                    }</summary>${renderLayers(layers)}</details>`
            )
            .join("");

    if (currentIdBatch.batchUnit === "Container") {
        html = Object.entries(data)
            .map(
                ([palletKey, cartons]) =>
                    `<details open><summary class="er">Pallet ${palletKey.split("_")[1]
                    }</summary>${renderCartons(cartons)}</details>`
            )
            .join("");
    } else if (data.pallet_1) {
        html = renderCartons(data.pallet_1, "ms-0 ");
    }
    dom.idListDetails.innerHTML =
        html ||
        '<p class="text-center text-secondary small m-0">Chưa có sản phẩm nào được quét.</p>';
};

var getDeclaration = (batch) => {
    const b = batch || currentIdBatch;
    if (!b) return { pallets: 1, cartons: 1, layers: 1, items: 1 };
    return {
        pallets: b.palletsPerContainer || 1,
        cartons: b.cartonsPerPallet || 1,
        layers: b.layersPerCarton || 1,
        items: b.itemsPerLayer || 1,
    };
};

var getIndicesFromTotal = (totalScanned, batch) => {
    if (!batch) return { pallet: 1, carton: 1, layer: 1 };
    const dec = getDeclaration(batch);
    const itemsPerLayer = dec.items || 1,
        itemsPerCarton = (dec.layers || 1) * itemsPerLayer,
        itemsPerPallet = (dec.cartons || 1) * itemsPerCarton;
    const scannedIndex = totalScanned;
    let pallet = 1,
        carton = 1,
        layer = 1;
    switch (batch.batchUnit) {
        case "Container":
            pallet =
                itemsPerPallet > 0 ? Math.floor(scannedIndex / itemsPerPallet) + 1 : 1;
            const remP =
                itemsPerPallet > 0 ? scannedIndex % itemsPerPallet : scannedIndex;
            carton = itemsPerCarton > 0 ? Math.floor(remP / itemsPerCarton) + 1 : 1;
            const remC = itemsPerCarton > 0 ? remP % itemsPerCarton : remP;
            layer = itemsPerLayer > 0 ? Math.floor(remC / itemsPerLayer) + 1 : 1;
            break;
        case "Pallet":
            pallet = 1;
            carton =
                itemsPerCarton > 0 ? Math.floor(scannedIndex / itemsPerCarton) + 1 : 1;
            const remCP =
                itemsPerCarton > 0 ? scannedIndex % itemsPerCarton : scannedIndex;
            layer = itemsPerLayer > 0 ? Math.floor(remCP / itemsPerLayer) + 1 : 1;
            break;
        case "Thùng":
            pallet = 1;
            carton = 1;
            layer =
                itemsPerLayer > 0 ? Math.floor(scannedIndex / itemsPerLayer) + 1 : 1;
            break;
    }
    return { pallet, carton, layer };
};

var updateScanProgressUI = () => {
    if (!currentIdBatch) return;
    const dec = getDeclaration();
    const unit = currentIdBatch.batchUnit;
    dom.progress.pallet.classList.add("d-none");
    dom.progress.carton.classList.add("d-none");
    dom.progress.layer.classList.add("d-none");
    dom.scanProgressContainer.classList.add("d-none");
    if (unit === "Container") {
        dom.progress.pallet.classList.remove("d-none");
        dom.progress.pallet.lastElementChild.textContent = `${currentScanIndices.pallet
            } / ${dec.pallets || "N/A"}`;
    }
    if (["Container", "Pallet"].includes(unit)) {
        dom.progress.carton.classList.remove("d-none");
        dom.progress.carton.lastElementChild.textContent = `${currentScanIndices.carton
            } / ${dec.cartons || "N/A"}`;
    }
    if (["Container", "Pallet", "Thùng"].includes(unit)) {
        dom.progress.layer.classList.remove("d-none");
        dom.progress.layer.lastElementChild.textContent = `${currentScanIndices.layer
            } / ${dec.layers || "N/A"}`;
        dom.scanProgressContainer.classList.remove("d-none");
    }
};

var handleSimulateScan = () => {
    if (!currentIdBatch) return;
    const totalCanScan =
        currentIdBatch.quantity - currentIdBatch.identifiedQuantity;
    if (sessionScannedCount >= totalCanScan) {
        showToast("Đã quét đủ số lượng còn lại cho lô này.", "warning");
        idScanModal.hide();
        return;
    }
    const dec = getDeclaration();
    const totalBeforeScan =
        currentIdBatch.identifiedQuantity + sessionScannedCount;
    const { pallet, carton, layer } = getIndicesFromTotal(
        totalBeforeScan,
        currentIdBatch
    );

    const palletKey = `pallet_${pallet}`,
        cartonKey = `carton_${carton}`,
        layerKey = `layer_${layer}`;
    sessionScannedData[palletKey] = sessionScannedData[palletKey] || {};
    sessionScannedData[palletKey][cartonKey] =
        sessionScannedData[palletKey][cartonKey] || {};
    sessionScannedData[palletKey][cartonKey][layerKey] =
        sessionScannedData[palletKey][cartonKey][layerKey] || [];

    const scannedId = `${currentIdBatch.productCode
        }-P${pallet}C${carton}L${layer}-${Date.now().toString().slice(-5)}`;
    sessionScannedData[palletKey][cartonKey][layerKey].push(scannedId);
    sessionScannedCount++;
    dom.modalScanCount.textContent = sessionScannedCount;

    const totalAfterScan = totalBeforeScan + 1;
    const itemsPerLayer = dec.items,
        itemsPerCarton = dec.layers * itemsPerLayer,
        itemsPerPallet = dec.cartons * itemsPerCarton;
    if (
        totalAfterScan > 0 &&
        itemsPerLayer > 0 &&
        totalAfterScan % itemsPerLayer === 0
    ) {
        showToast(`Đã hoàn thành Lớp ${layer}!`, "info");
        if (itemsPerCarton > 0 && totalAfterScan % itemsPerCarton === 0) {
            showToast(`Đã hoàn thành Thùng ${carton}!`, "success");
            if (
                currentIdBatch.batchUnit === "Container" &&
                itemsPerPallet > 0 &&
                totalAfterScan % itemsPerPallet === 0
            ) {
                showToast(`Đã hoàn thành Pallet ${pallet}!`, "success");
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
                mergedData[pKey][cKey][lKey] = (
                    mergedData[pKey][cKey][lKey] || []
                ).concat(lVal);
            });
        });
    });

    renderScannedData(mergedData);
    updateScanProgressUI();
    updateIdButtonStates();
};

var handleSaveIdentities = () => {
    if (dom.saveIdentitiesButton.disabled || !currentIdBatch) return;
    const batchIndex = mockBatches.findIndex(
        (b) => b.batchCode === currentIdBatch.batchCode
    );
    if (batchIndex > -1) {
        const mainBatch = mockBatches[batchIndex];
        mainBatch.identifiedQuantity += sessionScannedCount;
        // Merge data
        Object.entries(sessionScannedData).forEach(([pKey, pVal]) => {
            mainBatch.scannedData[pKey] = mainBatch.scannedData[pKey] || {};
            Object.entries(pVal).forEach(([cKey, cVal]) => {
                mainBatch.scannedData[pKey][cKey] =
                    mainBatch.scannedData[pKey][cKey] || {};
                Object.entries(cVal).forEach(([lKey, lVal]) => {
                    mainBatch.scannedData[pKey][cKey][lKey] = (
                        mainBatch.scannedData[pKey][cKey][lKey] || []
                    ).concat(lVal);
                });
            });
        });
        showToast(`Đã lưu thành công ${sessionScannedCount} mã định danh!`);
        setupProductIdScreen(mainBatch.batchCode); // Refresh the screen
    } else {
        showToast("Lỗi: Không tìm thấy lô hàng để lưu.", "error");
    }
};

var updateIdButtonStates = () => {
    if (!currentIdBatch) {
        dom.startScanButton.disabled = true;
        dom.saveIdentitiesButton.disabled = true;
        return;
    }
    const remaining = currentIdBatch.quantity - currentIdBatch.identifiedQuantity;
    dom.startScanButton.disabled = remaining <= 0;
    dom.saveIdentitiesButton.disabled = sessionScannedCount === 0;
};

var resetIdSession = () => {
    sessionScannedData = {};
    sessionScannedCount = 0;
    dom.modalScanCount.textContent = 0;
};

var showDeclarationLevelsByUnit = (unit) => {
    const levels = {
        container: document.getElementById("declaration-container-level"),
        pallet: document.getElementById("declaration-pallet-level"),
        carton: document.getElementById("declaration-carton-level"),
        layer: document.getElementById("declaration-layer-level"),
    };
    Object.values(levels).forEach((l) => l.classList.add("d-none"));
    if (unit === "Container")
        Object.values(levels).forEach((l) => l.classList.remove("d-none"));
    else if (unit === "Pallet") {
        levels.pallet.classList.remove("d-none");
        levels.carton.classList.remove("d-none");
        levels.layer.classList.remove("d-none");
    } else if (unit === "Thung") {
        levels.carton.classList.remove("d-none");
        levels.layer.classList.remove("d-none");
    }
    dom.packagingContainer.classList.toggle(
        "d-none",
        !unit || unit === "Cái" || unit === "Hộp"
    );
};

// --- GÁN CÁC SỰ KIỆN ---
var addEventListeners = () => {
    dom.addNewButton.addEventListener("click", setupFormForAdd);
    dom.backToListButton.addEventListener("click", () => navigateTo("list"));
    dom.backToListFromDetailsButton.addEventListener("click", () =>
        navigateTo("list")
    );
    dom.searchInput.addEventListener("input", handleSearch);
    dom.form.addEventListener("submit", handleFormSubmit);
    dom.confirmDeleteButton.addEventListener("click", confirmDelete);

    dom.batchListContainer.addEventListener("click", (e) => {
        const actionButton = e.target.closest(".swipe-actions button");
        if (actionButton) {
            const { action, code } = actionButton.dataset;
            closeOpenSwipeContainer();
            if (action === "edit") setupFormForEdit(code);
            if (action === "delete") handleDelete(code);
        }
    });
    document.body.addEventListener("click", (e) => {
        if (
            currentScreen === "list" &&
            openSwipeContainer &&
            !openSwipeContainer.contains(e.target)
        ) {
            closeOpenSwipeContainer();
        }
    });
    dom.declarationTypeRadios.forEach((radio) =>
        radio.addEventListener("change", (e) => {
            clearAutoFilledFields();
            dom.productionOrderSelect.value = "";
            dom.bomSelect.value = "";
            dom.lsxSelectorContainer.classList.toggle(
                "d-none",
                e.target.value !== "lsx"
            );
            dom.bomSelectorContainer.classList.toggle(
                "d-none",
                e.target.value !== "bom"
            );
        })
    );
    dom.productionOrderSelect.addEventListener("change", (e) =>
        fillFormWithData(productionOrders.find((o) => o.id === e.target.value))
    );
    dom.bomSelect.addEventListener("change", (e) =>
        fillFormWithData(boms.find((b) => b.id === e.target.value))
    );

    // Events for product ID screen
    dom.simulateScanButton.addEventListener("click", handleSimulateScan);
    dom.saveIdentitiesButton.addEventListener("click", handleSaveIdentities);
    Object.values(dom.inputs).forEach((input) =>
        input.addEventListener("input", handleDeclarationChange)
    );
};

// --- KHỞI TẠO BAN ĐẦU ---
var initializeApp = async () => {
    dataPR = await HOMEOSAPP.getDM(
        "https://central.homeos.vn/service_XD/service.svc",
        "DM_PRODUCT",
        "1=1"
    );

    var dataLot = await HOMEOSAPP.getApiServicePublic(
        HOMEOSAPP.linkbase,
        "GetDataDynamicWareHouse",
        "TYPE_QUERY='LOT'"
    );

    const mockBatchesMulti = mapProductionDataToBatches(dataLot);
    // mockBatches = mockBatchesMulti;
    // console.log(mockBatchesMulti);
    mockBatches = mockBatchesMulti
    console.log(mockBatches);
    console.log(mockBatchesMulti);
    
    
    if (dataPR.data) {
        mockProducts = mapProducts(dataPR.data);
    }

    deleteModal = new bootstrap.Modal(dom.deleteModalEl);
    // idScanModal = new bootstrap.Modal(dom.idScanModalEl);
    appToast = new bootstrap.Toast(dom.toastEl);
    addEventListeners();
    renderBatches(mockBatches);
};

var mockProducts;
initializeApp();

//
var currentUser = "Nguyễn Văn A"; // Giả lập người dùng đăng nhập

var mockBatches_2 = [
    {
        batchId: 101,
        productId: 1,
        batchCode: "L20250901",
        quantity: 58,
        unit: "Cái",
        location: "Kho A, Kệ 12",
        supplier: "TechSource Inc.",
        lastUpdated: "10/09/2025",
        pricePerItem: 15000000,
        description: "Lô nhập đầu tháng 9",
    },
    {
        batchId: 102,
        productId: 2,
        batchCode: "L20250901",
        quantity: 15,
        unit: "Thanh",
        location: "Kho A, Kệ 12",
        supplier: "Memory World",
        lastUpdated: "09/09/2025",
        pricePerItem: 2500000,
        description: "RAM bus 5600",
    },
    {
        batchId: 103,
        productId: 4,
        batchCode: "L20250902",
        quantity: 5,
        unit: "Cái",
        location: "Kho A, Kệ 15",
        supplier: "Graphics Direct",
        lastUpdated: "10/09/2025",
        pricePerItem: 45000000,
        description: "Bản Founder Edition",
    },
    {
        batchId: 104,
        productId: 5,
        batchCode: "L20250820",
        quantity: 120,
        unit: "Cái",
        location: "Kho B, Kệ 1",
        supplier: "Power Supplies Co.",
        lastUpdated: "01/09/2025",
        pricePerItem: 4000000,
        description: "",
    },
    {
        batchId: 105,
        productId: 6,
        batchCode: "L20250825",
        quantity: 2,
        unit: "Cái",
        location: "Kho A, Kệ 22",
        supplier: "Cooling Bros",
        lastUpdated: "08/09/2025",
        pricePerItem: 2200000,
        description: "Màu Chromax Black",
    },
];

var mockHistory = {
    101: [
        {
            type: "import",
            quantity: 60,
            reason: "Nhập hàng đầu kỳ",
            date: "01/09/2025",
        },
        { type: "export", quantity: 2, reason: "Bán lẻ", date: "05/09/2025" },
    ],
    102: [
        {
            type: "import",
            quantity: 20,
            reason: "Nhập hàng đầu kỳ",
            date: "01/09/2025",
        },
        { type: "export", quantity: 5, reason: "Bán sỉ", date: "06/09/2025" },
    ],
};

var appContainer = document.getElementById("app-container");
var inventoryListEl = document.getElementById("inventory-list");
var searchInputEl = document.getElementById("search-input");
var filterButtonsEl = document.getElementById("filter-buttons");
var currentFilter = "all";
var currentProductId = null;

var detailViewElements = {
    name: document.getElementById("detail-product-name"),
    image: document.getElementById("detail-image"),
    sku: document.getElementById("detail-sku"),
    quantity: document.getElementById("detail-quantity"),
    statusBadge: document.getElementById("detail-status-badge"),
    location: document.getElementById("detail-location"),
    supplier: document.getElementById("detail-supplier"),
    lastUpdated: document.getElementById("detail-last-updated"),
};
var historyListEl = document.getElementById("history-list");
var importViewElements = {
    select: document.getElementById("import-product-select"),
    batchCode: document.getElementById("import-batch-code"),
    quantity: document.getElementById("import-quantity"),
    unit: document.getElementById("import-unit"),
    reason: document.getElementById("import-reason-select"),
    location: document.getElementById("import-location"),
    priceItem: document.getElementById("import-price-item"),
    priceTotal: document.getElementById("import-price-total"),
    description: document.getElementById("import-description"),
};
var exportViewElements = {
    batchSelect: document.getElementById("export-batch-select"),
    batchInfo: document.getElementById("export-batch-info"),
    stockInfo: document.getElementById("export-stock-info"),
    location: document.getElementById("export-location"),
    quantity: document.getElementById("export-quantity"),
    price: document.getElementById("export-price"),
    totalPrice: document.getElementById("export-total-price"),
    exporter: document.getElementById("export-exporter"),
    receiver: document.getElementById("export-receiver"),
    formSelect: document.getElementById("export-form-select"),
    reason: document.getElementById("export-reason"),
    description: document.getElementById("export-description"),
};

var toastEl = document.getElementById("liveToast");
var toastBody = document.getElementById("toast-body");
var toast = new bootstrap.Toast(toastEl);

var navigate = (view) => {
    appContainer.dataset.view = view;
};

var getStockInfo = (quantity) => {
    if (quantity <= 0)
        return {
            text: "Hết hàng",
            color: "danger",
            bg: "bg-danger-subtle",
            text_color: "text-danger-emphasis",
        };
    if (quantity <= 20)
        return {
            text: "Sắp hết hàng",
            color: "warning",
            bg: "bg-warning-subtle",
            text_color: "text-warning-emphasis",
        };
    return {
        text: "Còn hàng",
        color: "success",
        bg: "bg-success-subtle",
        text_color: "text-success-emphasis",
    };
};

var renderInventory = () => {
    const searchTerm = searchInputEl.value.toLowerCase();

    let productQuantities = mockProducts.map((product) => {
        const totalQuantity = mockBatches_2
            .filter((batch) => batch.productId === product.id)
            .reduce((sum, batch) => sum + batch.quantity, 0);
        return { ...product, totalQuantity };
    });

    let filteredInventory = productQuantities.filter(
        (item) =>
            item.name.toLowerCase().includes(searchTerm) ||
            item.sku.toLowerCase().includes(searchTerm)
    );
    if (currentFilter === "low_stock")
        filteredInventory = filteredInventory.filter(
            (item) => item.totalQuantity > 0 && item.totalQuantity <= 20
        );
    else if (currentFilter === "out_of_stock")
        filteredInventory = filteredInventory.filter(
            (item) => item.totalQuantity <= 0
        );

    if (filteredInventory.length === 0) {
        inventoryListEl.innerHTML = `<div class="text-center py-5"><p class="text-muted">Không tìm thấy sản phẩm nào.</p></div>`;
        return;
    }
    inventoryListEl.innerHTML = filteredInventory
        .map((item) => {
            const stock = getStockInfo(item.totalQuantity);
            return `<div data-id="${item.id
                }" class="product-card bg-body p-3 rounded-3 shadow-sm border-0 d-flex align-items-start gap-3">
            <img src="${item.imageUrl.replace("400x300", "160x160")}" alt="${item.name
                }" class="rounded border" style="width: 64px; height: 64px; object-fit: cover;">
            <div class="flex-grow-1">
                <p class=" text-body-emphasis mb-1" style="text-align: start;">${item.name
                }</p>
                <p class="text-muted small font-monospace mb-2" style="text-align: start;">${item.sku
                }</p>
                <div class="d-flex justify-content-between align-items-center">
                    <span class="badge ${stock.bg} ${stock.text_color
                } rounded-pill" style="font-weight: 300;">${stock.text}</span>
                    <div>
                        <span class="small text-muted">Tổng tồn:</span> 
                        <span class=" fs-5 text-${stock.color}">${item.totalQuantity
                }</span>
                    </div>
                </div>
            </div>
        </div>`;
        })
        .join("");
};

function mapProducts(realProducts) {
    return realProducts.map((p) => {
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
            imageUrl: imageUrl,
        };
    });
}

var showDetailView = (productId) => {
    currentProductId = productId;
    const product = mockProducts.find((item) => item.id == productId);
    if (!product) return;

    const productBatches = mockBatches_2.filter((b) => b.productId == productId);
    const totalQuantity = productBatches.reduce((sum, b) => sum + b.quantity, 0);
    const latestBatch =
        productBatches.sort(
            (a, b) =>
                new Date(b.lastUpdated.split("/").reverse().join("-")) -
                new Date(a.lastUpdated.split("/").reverse().join("-"))
        )[0] || {};

    const stock = getStockInfo(totalQuantity);
    detailViewElements.name.textContent = product.name;
    detailViewElements.image.src = product.imageUrl;
    detailViewElements.image.alt = product.name;
    detailViewElements.sku.textContent = product.sku;
    detailViewElements.quantity.textContent = totalQuantity;
    detailViewElements.quantity.className = ` display-6 mb-0 text-${stock.color}`;
    detailViewElements.statusBadge.textContent = stock.text;
    detailViewElements.statusBadge.className = `badge fs-6 rounded-pill ${stock.bg} ${stock.text_color}`;
    detailViewElements.location.innerHTML = `<i class="bi bi-geo-alt-fill me-2 text-muted"></i> ${[...new Set(productBatches.map((b) => b.location))].join(", ") ||
        "Chưa có vị trí"
        }`;
    detailViewElements.supplier.textContent = latestBatch.supplier || "N/A";
    detailViewElements.lastUpdated.textContent = latestBatch.lastUpdated || "N/A";
    navigate("detail");
};

var showHistoryView = () => {
    const productBatches = mockBatches_2.filter(
        (b) => b.productId == currentProductId
    );
    const batchIds = productBatches.map((b) => b.batchId);
    const productHistory = batchIds
        .flatMap((id) => mockHistory[id] || [])
        .sort(
            (a, b) =>
                new Date(b.date.split("/").reverse().join("-")) -
                new Date(a.date.split("/").reverse().join("-"))
        );

    if (productHistory.length === 0) {
        historyListEl.innerHTML = `<div class="text-center py-5"><p class="text-muted">Chưa có lịch sử cho sản phẩm này.</p></div>`;
    } else {
        historyListEl.innerHTML = productHistory
            .map((entry) => {
                const isImport = entry.type === "import";
                return `<div class="card card-body border-0 shadow-sm"><div class="d-flex w-100 justify-content-between"><h6 class="mb-1">${entry.reason
                    }</h6><span class=" fs-5 ${isImport ? "text-success" : "text-danger"
                    }">${isImport ? "+" : "-"}${entry.quantity
                    }</span></div><small class="text-muted">${entry.date}</small></div>`;
            })
            .join("");
    }
    navigate("history");
};

var populateProductSelect = (selectEl) => {
    selectEl.innerHTML = '<option value="">-- Chọn sản phẩm --</option>';
    mockProducts.forEach((p) => {
        selectEl.innerHTML += `<option value="${p.id}">${p.name} (${p.sku})</option>`;
    });
};

var showImportView = () => {
    populateProductSelect(importViewElements.select);
    Object.values(importViewElements).forEach((el) => {
        if (el.tagName !== "SELECT") el.value = "";
    });
    importViewElements.priceTotal.value = "0 VNĐ";
    navigate("import");
};

var showExportView = () => {
    exportViewElements.batchSelect.innerHTML =
        '<option value="">-- Chọn lô sản phẩm --</option>';
    const groupedBatches = mockProducts
        .map((product) => ({
            productName: product.name,
            batches: mockBatches_2.filter(
                (b) => b.productId === product.id && b.quantity > 0
            ),
        }))
        .filter((group) => group.batches.length > 0);

    groupedBatches.forEach((group) => {
        const optgroup = document.createElement("optgroup");
        optgroup.label = group.productName;
        group.batches.forEach((b) => {
            const option = document.createElement("option");
            option.value = b.batchId;
            option.textContent = `Mã lô: ${b.batchCode} (Tồn: ${b.quantity} ${b.unit})`;
            optgroup.appendChild(option);
        });
        exportViewElements.batchSelect.appendChild(optgroup);
    });

    Object.values(exportViewElements).forEach((el) => {
        if (el.tagName !== "SELECT") el.value = "";
    });
    exportViewElements.exporter.value = currentUser; // Auto-fill exporter
    exportViewElements.batchInfo.classList.add("d-none");
    exportViewElements.totalPrice.value = "0 VNĐ";

    navigate("export");
};

var setTheme = (theme) => {
    document.documentElement.setAttribute("data-bs-theme", theme);
    localStorage.setItem("theme", theme);
    document.querySelectorAll(".theme-switcher-btn").forEach((btn) => {
        btn.innerHTML =
            theme === "dark"
                ? '<i class="bi bi-sun-fill"></i>'
                : '<i class="bi bi-moon-stars-fill"></i>';
    });
};

// Event Listeners
searchInputEl.addEventListener("change", renderInventory);
filterButtonsEl.addEventListener("click", (e) => {
    const button = e.target.closest(".filter-btn");
    if (!button) return;
    currentFilter = button.dataset.filter;
    document.querySelectorAll("#filter-buttons .filter-btn").forEach((btn) => {
        btn.classList.remove("btn-primary");
        btn.classList.add("btn-secondary");
    });
    button.classList.add("btn-primary");
    button.classList.remove("btn-secondary");
    renderInventory();
});

inventoryListEl.addEventListener("click", (e) => {
    const card = e.target.closest(".product-card");
    if (card) showDetailView(card.dataset.id);
});

document.querySelectorAll(".back-btn").forEach((btn) => {
    btn.addEventListener("click", (e) =>
        navigate(e.currentTarget.dataset.target)
    );
});

document.querySelectorAll(".theme-switcher-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
        const currentTheme = document.documentElement.getAttribute("data-bs-theme");
        setTheme(currentTheme === "dark" ? "light" : "dark");
    });
});

document
    .getElementById("view-history-btn")
    .addEventListener("click", showHistoryView);
document
    .getElementById("show-import-view-btn")
    .addEventListener("click", showImportView);
document
    .getElementById("show-export-view-btn")
    .addEventListener("click", showExportView);

[importViewElements.quantity, importViewElements.priceItem].forEach((el) => {
    el.addEventListener("input", () => {
        const quantity = parseInt(importViewElements.quantity.value) || 0;
        const price = parseFloat(importViewElements.priceItem.value) || 0;
        importViewElements.priceTotal.value =
            (quantity * price).toLocaleString("vi-VN") + " VNĐ";
    });
});

document.getElementById("save-import-btn").addEventListener("click", () => {
    const productId = parseInt(importViewElements.select.value);
    const batchCode = importViewElements.batchCode.value.trim();
    const quantity = parseInt(importViewElements.quantity.value);
    const unit = importViewElements.unit.value.trim();
    const reason = importViewElements.reason.value;
    const location = importViewElements.location.value.trim();
    const pricePerItem = parseFloat(importViewElements.priceItem.value);
    const description = importViewElements.description.value.trim();

    if (
        !productId ||
        !batchCode ||
        !quantity ||
        !unit ||
        !location ||
        !pricePerItem
    ) {
        showToast("Vui lòng điền đầy đủ thông tin.", "error");
        return;
    }

    const newBatch = {
        batchId: Date.now(),
        productId,
        batchCode,
        quantity,
        unit,
        location,
        pricePerItem,
        description,
        supplier: "Nhà cung cấp mới",
        lastUpdated: new Date().toLocaleDateString("vi-VN"),
    };
    mockBatches_2.push(newBatch);

    if (!mockHistory[newBatch.batchId]) mockHistory[newBatch.batchId] = [];
    mockHistory[newBatch.batchId].push({
        type: "import",
        quantity,
        reason,
        date: newBatch.lastUpdated,
    });

    showToast(`Nhập kho thành công lô ${batchCode}!`);
    navigate("list");
    renderInventory();
});

var calculateExportTotal = () => {
    const quantity = parseInt(exportViewElements.quantity.value) || 0;
    const price = parseFloat(exportViewElements.price.value) || 0;
    exportViewElements.totalPrice.value =
        (quantity * price).toLocaleString("vi-VN") + " VNĐ";
};

[exportViewElements.quantity, exportViewElements.price].forEach((el) =>
    el.addEventListener("input", calculateExportTotal)
);

exportViewElements.batchSelect.addEventListener("change", (e) => {
    const batchId = e.target.value;
    if (!batchId) {
        exportViewElements.batchInfo.classList.add("d-none");
        return;
    }
    const batch = mockBatches_2.find((b) => b.batchId == batchId);
    exportViewElements.stockInfo.textContent = `${batch.quantity} ${batch.unit}`;
    exportViewElements.location.textContent = batch.location;
    exportViewElements.price.value = batch.pricePerItem; // Suggest price
    exportViewElements.batchInfo.classList.remove("d-none");
    calculateExportTotal();
});

document.getElementById("save-export-btn").addEventListener("click", () => {
    const batchId = parseInt(exportViewElements.batchSelect.value);
    const quantity = parseInt(exportViewElements.quantity.value);
    const price = parseFloat(exportViewElements.price.value);
    const exporter = exportViewElements.exporter.value.trim();
    const receiver = exportViewElements.receiver.value.trim();
    const form = exportViewElements.formSelect.value;
    const reason = exportViewElements.reason.value.trim();
    const description = exportViewElements.description.value.trim();

    if (
        !batchId ||
        !quantity ||
        quantity <= 0 ||
        !price ||
        !receiver ||
        !reason
    ) {
        showToast("Vui lòng điền đầy đủ các trường bắt buộc.", "error");
        return;
    }

    const batch = mockBatches_2.find((b) => b.batchId === batchId);
    if (quantity > batch.quantity) {
        showToast("Số lượng xuất vượt quá tồn kho của lô.", "error");
        return;
    }

    batch.quantity -= quantity;
    batch.lastUpdated = new Date().toLocaleDateString("vi-VN");
    if (!mockHistory[batch.batchId]) mockHistory[batch.batchId] = [];
    mockHistory[batch.batchId].push({
        type: "export",
        quantity,
        reason,
        date: batch.lastUpdated,
        price,
        exporter,
        receiver,
        form,
        description,
    });

    showToast(
        `Xuất kho thành công ${quantity} sản phẩm từ lô ${batch.batchCode}!`
    );
    navigate("list");
    renderInventory();
});

// Initial Theme
var savedTheme =
    localStorage.getItem("theme") ||
    (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light");
setTheme(savedTheme);

async function initializeMaterialInventoryApp() {
    let mt_mockMaterials = [];
    let mt_mockBatches = [];
    const dataMaterials = await HOMEOSAPP.getApiServicePublic(
        HOMEOSAPP.linkbase,
        "GetDataDynamicWareHouse",
        "TYPE_QUERY='WAREHOUSE'"
    );
    console.log(dataMaterials);
    if (dataMaterials) {
        processInventoryData(dataMaterials);
    }
    const mt_currentUser = "Nguyễn Văn A";

    // = [
    //     { id: 1, name: 'Thép tấm SPHC 2.0mm', sku: 'VT-STEEL-SPHC-20', imageUrl: 'https://placehold.co/400x300/e2e8f0/334155?text=Thép' },
    //     { id: 2, name: 'Bulong lục giác M10', sku: 'VT-BOLT-M10', imageUrl: 'https://placehold.co/400x300/e2e8f0/334155?text=Bulong' },
    //     { id: 3, name: 'Sơn chống gỉ xám 5L', sku: 'VT-PAINT-GREY-5L', imageUrl: 'https://placehold.co/400x300/e2e8f0/334155?text=Sơn' },
    //     { id: 4, name: 'Que hàn J421 3.2mm', sku: 'VT-WELD-J421-32', imageUrl: 'https://placehold.co/400x300/e2e8f0/334155?text=Que+Hàn' },
    //     { id: 5, name: 'Dầu thủy lực Caltex Rando 68', sku: 'VT-OIL-CALTEX-68', imageUrl: 'https://placehold.co/400x300/e2e8f0/334155?text=Dầu' },
    // ];
    // = [
    //     { batchId: 101, materialId: 1, batchCode: 'L20250901', quantity: 58, unit: 'Tấm', location: 'Kho A, Kệ 12', supplier: 'Hòa Phát', lastUpdated: '10/09/2025', pricePerItem: 750000, description: 'Lô nhập đầu tháng 9' },
    //     { batchId: 102, materialId: 2, batchCode: 'L20250901', quantity: 2500, unit: 'Cái', location: 'Kho A, Kệ 12', supplier: 'Bulong Comat', lastUpdated: '09/09/2025', pricePerItem: 1500, description: 'Bulong Inox 304' },
    //     { batchId: 103, materialId: 3, batchCode: 'L20250902', quantity: 5, unit: 'Thùng', location: 'Kho A, Kệ 15', supplier: 'Sơn Jotun', lastUpdated: '10/09/2025', pricePerItem: 1200000, description: 'Sơn lót' },
    //     { batchId: 104, materialId: 4, batchCode: 'L20250820', quantity: 120, unit: 'Kg', location: 'Kho B, Kệ 1', supplier: 'Que hàn Kim Tín', lastUpdated: '01/09/2025', pricePerItem: 40000, description: '' },
    //     { batchId: 105, materialId: 5, batchCode: 'L20250825', quantity: 2, unit: 'Xô', location: 'Kho A, Kệ 22', supplier: 'Caltex Việt Nam', lastUpdated: '08/09/2025', pricePerItem: 1800000, description: 'Xô 18L' },
    // ];

    let mt_mockHistory = {
        101: [
            {
                type: "import",
                quantity: 60,
                reason: "Nhập hàng từ NCC",
                date: "01/09/2025",
            },
            {
                type: "export",
                quantity: 2,
                reason: "Xuất cho SX",
                date: "05/09/2025",
            },
        ],
        102: [
            {
                type: "import",
                quantity: 3000,
                reason: "Nhập hàng từ NCC",
                date: "01/09/2025",
            },
            {
                type: "export",
                quantity: 500,
                reason: "Xuất cho SX",
                date: "06/09/2025",
            },
        ],
    };

    const mt_appContainer = document.getElementById("mt-app-container");
    const mt_inventoryListEl = document.getElementById("mt-inventory-list");
    const mt_searchInputEl = document.getElementById("mt-search-input");
    const mt_filterButtonsEl = document.getElementById("mt-filter-buttons");
    let mt_currentFilter = "all";
    let mt_currentMaterialId = null;

    const mt_detailViewElements = {
        name: document.getElementById("mt-detail-material-name"),
        image: document.getElementById("mt-detail-image"),
        sku: document.getElementById("mt-detail-sku"),
        quantity: document.getElementById("mt-detail-quantity"),
        statusBadge: document.getElementById("mt-detail-status-badge"),
        location: document.getElementById("mt-detail-location"),
        supplier: document.getElementById("mt-detail-supplier"),
        lastUpdated: document.getElementById("mt-detail-last-updated"),
    };
    const mt_historyListEl = document.getElementById("mt-history-list");
    const mt_importViewElements = {
        select: document.getElementById("mt-import-material-select"),
        batchCode: document.getElementById("mt-import-batch-code"),
        quantity: document.getElementById("mt-import-quantity"),
        unit: document.getElementById("mt-import-unit"),
        reason: document.getElementById("mt-import-reason-select"),
        location: document.getElementById("mt-import-location"),
        priceItem: document.getElementById("mt-import-price-item"),
        priceTotal: document.getElementById("mt-import-price-total"),
        description: document.getElementById("mt-import-description"),
    };
    const mt_exportViewElements = {
        batchSelect: document.getElementById("mt-export-batch-select"),
        batchInfo: document.getElementById("mt-export-batch-info"),
        stockInfo: document.getElementById("mt-export-stock-info"),
        location: document.getElementById("mt-export-location"),
        quantity: document.getElementById("mt-export-quantity"),
        price: document.getElementById("mt-export-price"),
        totalPrice: document.getElementById("mt-export-total-price"),
        exporter: document.getElementById("mt-export-exporter"),
        receiver: document.getElementById("mt-export-receiver"),
        formSelect: document.getElementById("mt-export-form-select"),
        reason: document.getElementById("mt-export-reason"),
        description: document.getElementById("mt-export-description"),
    };

    const mt_toastEl = document.getElementById("mt-liveToast");
    const mt_toastBody = document.getElementById("mt-toast-body");
    const mt_toast = new bootstrap.Toast(mt_toastEl);

    const mt_navigate = (view) => {
        mt_appContainer.dataset.view = view;
    };
    const mt_showToast = (message, type = "success") => {
        mt_toastEl.className = `toast text-white ${type === "success" ? "bg-success" : "bg-danger"
            }`;
        mt_toastBody.textContent = message;
        mt_toast.show();
    };

    const mt_getStockInfo = (quantity) => {
        if (quantity <= 0)
            return {
                text: "Hết hàng",
                color: "danger",
                bg: "bg-danger-subtle",
                text_color: "text-danger-emphasis",
            };
        if (quantity <= 20)
            return {
                text: "Sắp hết hàng",
                color: "warning",
                bg: "bg-warning-subtle",
                text_color: "text-warning-emphasis",
            };
        return {
            text: "Còn hàng",
            color: "success",
            bg: "bg-success-subtle",
            text_color: "text-success-emphasis",
        };
    };

    function processInventoryData(sourceData) {
        const materials = [];
        const batches = [];
        // Dùng một Map để theo dõi các vật tư đã được thêm, tránh trùng lặp
        // key: ITEM_ID, value: id mới của vật tư
        const materialMap = new Map();

        sourceData.forEach((item, index) => {
            let materialId;

            // 1. Xử lý mảng vật tư (materials)
            // Kiểm tra xem vật tư này đã tồn tại trong Map chưa
            if (!materialMap.has(item.ITEM_ID)) {
                // Nếu chưa có, tạo một vật tư mới
                materialId = materials.length + 1; // Tạo ID mới tăng dần
                materialMap.set(item.ITEM_ID, materialId);

                const newMaterial = {
                    id: materialId,
                    name: item.ITEM_NAME,
                    sku: item.ITEM_ID,
                    // Tạo ảnh placeholder động với tên vật tư
                    imageUrl: `https://placehold.co/400x300/e2e8f0/334155?text=${encodeURIComponent(
                        item.ITEM_NAME
                    )}`,
                };
                materials.push(newMaterial);
            } else {
                // Nếu đã có, lấy ID đã tạo trước đó
                materialId = materialMap.get(item.ITEM_ID);
            }

            // 2. Xử lý mảng lô hàng (batches)
            // Định dạng lại ngày tháng
            const date = new Date(item.UPDATED_DATE);
            const day = String(date.getDate()).padStart(2, "0");
            const month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng trong JS bắt đầu từ 0
            const year = date.getFullYear();
            const formattedDate = `${day}/${month}/${year}`;

            const newBatch = {
                batchId: 101 + index, // Tạo batchId duy nhất
                materialId: materialId, // Lấy từ Map ở trên
                batchCode: `L-${item.ITEM_ID}-${index}`, // Tạo mã lô giả định
                quantity: item.QUANTITY,
                unit: item.UNIT_NAME,
                location: item.WAREHOUSE_NAME,
                supplier: "Chưa có thông tin", // Giá trị mặc định
                lastUpdated: formattedDate,
                pricePerItem: 0, // Giá trị mặc định
                description: `Nhập từ kho ${item.WAREHOUSE_NAME}`, // Mô tả mặc định
            };
            batches.push(newBatch);
        });
        mt_mockMaterials = materials;
        mt_mockBatches = batches;

        return { materials, batches };
    }

    const mt_renderMaterialList = () => {
        const searchTerm = mt_searchInputEl.value.toLowerCase();

        let materialQuantities = mt_mockMaterials.map((material) => {
            const totalQuantity = mt_mockBatches
                .filter((batch) => batch.materialId === material.id)
                .reduce((sum, batch) => sum + batch.quantity, 0);
            return { ...material, totalQuantity };
        });

        let filteredInventory = materialQuantities.filter(
            (item) =>
                item.name.toLowerCase().includes(searchTerm) ||
                item.sku.toLowerCase().includes(searchTerm)
        );
        if (mt_currentFilter === "low_stock")
            filteredInventory = filteredInventory.filter(
                (item) => item.totalQuantity > 0 && item.totalQuantity <= 20
            );
        else if (mt_currentFilter === "out_of_stock")
            filteredInventory = filteredInventory.filter(
                (item) => item.totalQuantity <= 0
            );

        if (filteredInventory.length === 0) {
            mt_inventoryListEl.innerHTML = `<div class="text-center py-5"><p class="text-muted">Không tìm thấy vật tư nào.</p></div>`;
            return;
        }
        mt_inventoryListEl.innerHTML = filteredInventory
            .map((item) => {
                const stock = mt_getStockInfo(item.totalQuantity);
                return `<div data-id="${item.id
                    }" class="mt-material-card bg-body p-3 rounded-3 shadow-sm border-0 d-flex align-items-start gap-3"><img src="${item.imageUrl.replace(
                        "400x300",
                        "160x160"
                    )}" alt="${item.name
                    }" class="rounded border" style="width: 64px; height: 64px; object-fit: cover;"><div class="flex-grow-1"><p class=" text-body-emphasis mb-1">${item.name
                    }</p><p class="text-muted small font-monospace mb-2">${item.sku
                    }</p><div class="d-flex justify-content-between align-items-center"><span class="badge ${stock.bg
                    } ${stock.text_color} rounded-pill" style="font-weight: 300;">${stock.text
                    }</span><div><span class="small text-muted">Tổng tồn:</span> <span class=" fs-5 text-${stock.color
                    }">${item.totalQuantity}</span></div></div></div></div>`;
            })
            .join("");
    };

    const mt_showMaterialDetailView = (materialId) => {
        mt_currentMaterialId = materialId;
        const material = mt_mockMaterials.find((item) => item.id == materialId);
        if (!material) return;

        const materialBatches = mt_mockBatches.filter(
            (b) => b.materialId == materialId
        );
        const totalQuantity = materialBatches.reduce(
            (sum, b) => sum + b.quantity,
            0
        );
        const latestBatch =
            materialBatches.sort(
                (a, b) =>
                    new Date(b.lastUpdated.split("/").reverse().join("-")) -
                    new Date(a.lastUpdated.split("/").reverse().join("-"))
            )[0] || {};

        const stock = mt_getStockInfo(totalQuantity);
        mt_detailViewElements.name.textContent = material.name;
        mt_detailViewElements.image.src = material.imageUrl;
        mt_detailViewElements.image.alt = material.name;
        mt_detailViewElements.sku.textContent = material.sku;
        mt_detailViewElements.quantity.textContent = totalQuantity;
        mt_detailViewElements.quantity.className = ` display-6 mb-0 text-${stock.color}`;
        mt_detailViewElements.statusBadge.textContent = stock.text;
        mt_detailViewElements.statusBadge.className = `badge fs-6 rounded-pill ${stock.bg} ${stock.text_color}`;
        mt_detailViewElements.location.innerHTML = `<i class="bi bi-geo-alt-fill me-2 text-muted"></i> ${[...new Set(materialBatches.map((b) => b.location))].join(", ") ||
            "Chưa có vị trí"
            }`;
        mt_detailViewElements.supplier.textContent = latestBatch.supplier || "N/A";
        mt_detailViewElements.lastUpdated.textContent =
            latestBatch.lastUpdated || "N/A";
        mt_navigate("mt-detail");
    };

    const mt_showMaterialHistoryView = () => {
        const materialBatches = mt_mockBatches.filter(
            (b) => b.materialId == mt_currentMaterialId
        );
        const batchIds = materialBatches.map((b) => b.batchId);
        const materialHistory = batchIds
            .flatMap((id) => mt_mockHistory[id] || [])
            .sort(
                (a, b) =>
                    new Date(b.date.split("/").reverse().join("-")) -
                    new Date(a.date.split("/").reverse().join("-"))
            );

        if (materialHistory.length === 0) {
            mt_historyListEl.innerHTML = `<div class="text-center py-5"><p class="text-muted">Chưa có lịch sử cho vật tư này.</p></div>`;
        } else {
            mt_historyListEl.innerHTML = materialHistory
                .map((entry) => {
                    const isImport = entry.type === "import";
                    return `<div class="card card-body border-0 shadow-sm"><div class="d-flex w-100 justify-content-between"><h6 class="mb-1">${entry.reason
                        }</h6><span class=" fs-5 ${isImport ? "text-success" : "text-danger"
                        }">${isImport ? "+" : "-"}${entry.quantity
                        }</span></div><small class="text-muted">${entry.date}</small></div>`;
                })
                .join("");
        }
        mt_navigate("mt-history");
    };

    const mt_populateMaterialsForSelect = (selectEl) => {
        selectEl.innerHTML = '<option value="">-- Chọn vật tư --</option>';
        mt_mockMaterials.forEach((material) => {
            selectEl.innerHTML += `<option value="${material.id}">${material.name} (${material.sku})</option>`;
        });
    };

    const mt_showMaterialImportView = () => {
        mt_populateMaterialsForSelect(mt_importViewElements.select);
        Object.values(mt_importViewElements).forEach((el) => {
            if (el.tagName !== "SELECT") el.value = "";
        });
        mt_importViewElements.priceTotal.value = "0 VNĐ";
        mt_navigate("mt-import");
    };

    const mt_showMaterialExportView = () => {
        mt_exportViewElements.batchSelect.innerHTML =
            '<option value="">-- Chọn lô vật tư --</option>';
        const groupedBatches = mt_mockMaterials
            .map((material) => ({
                materialName: material.name,
                batches: mt_mockBatches.filter(
                    (b) => b.materialId === material.id && b.quantity > 0
                ),
            }))
            .filter((group) => group.batches.length > 0);

        groupedBatches.forEach((group) => {
            const optgroup = document.createElement("optgroup");
            optgroup.label = group.materialName;
            group.batches.forEach((b) => {
                const option = document.createElement("option");
                option.value = b.batchId;
                option.textContent = `Mã lô: ${b.batchCode} (Tồn: ${b.quantity} ${b.unit})`;
                optgroup.appendChild(option);
            });
            mt_exportViewElements.batchSelect.appendChild(optgroup);
        });

        Object.values(mt_exportViewElements).forEach((el) => {
            if (el.tagName !== "SELECT") el.value = "";
        });
        mt_exportViewElements.exporter.value = mt_currentUser;
        mt_exportViewElements.batchInfo.classList.add("d-none");
        mt_exportViewElements.totalPrice.value = "0 VNĐ";

        mt_navigate("mt-export");
    };

    const mt_setTheme = (theme) => {
        document.documentElement.setAttribute("data-bs-theme", theme);
        localStorage.setItem("theme", theme);
        document.querySelectorAll(".mt-theme-switcher-btn").forEach((btn) => {
            btn.innerHTML =
                theme === "dark"
                    ? '<i class="bi bi-sun-fill"></i>'
                    : '<i class="bi bi-moon-stars-fill"></i>';
        });
    };

    // Event Listeners
    mt_searchInputEl.addEventListener("input", mt_renderMaterialList);
    mt_filterButtonsEl.addEventListener("click", (e) => {
        const button = e.target.closest(".mt-filter-btn");
        if (!button) return;
        mt_currentFilter = button.dataset.filter;
        document
            .querySelectorAll("#mt-filter-buttons .mt-filter-btn")
            .forEach((btn) => {
                btn.classList.remove("btn-primary");
                btn.classList.add("btn-secondary");
            });
        button.classList.add("btn-primary");
        button.classList.remove("btn-secondary");
        mt_renderMaterialList();
    });

    mt_inventoryListEl.addEventListener("click", (e) => {
        const card = e.target.closest(".mt-material-card");
        if (card) mt_showMaterialDetailView(card.dataset.id);
    });

    document.querySelectorAll(".mt-back-btn").forEach((btn) => {
        console.log(1);

        btn.addEventListener("click", (e) =>
            mt_navigate(e.currentTarget.dataset.target)
        );
    });

    document.querySelectorAll(".mt-theme-switcher-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
            const currentTheme =
                document.documentElement.getAttribute("data-bs-theme");
            mt_setTheme(currentTheme === "dark" ? "light" : "dark");
        });
    });

    document
        .getElementById("mt-view-history-btn")
        .addEventListener("click", mt_showMaterialHistoryView);
    document
        .getElementById("mt-show-import-view-btn")
        .addEventListener("click", mt_showMaterialImportView);
    document
        .getElementById("mt-show-export-view-btn")
        .addEventListener("click", mt_showMaterialExportView);

    [mt_importViewElements.quantity, mt_importViewElements.priceItem].forEach(
        (el) => {
            el.addEventListener("input", () => {
                const quantity = parseInt(mt_importViewElements.quantity.value) || 0;
                const price = parseFloat(mt_importViewElements.priceItem.value) || 0;
                mt_importViewElements.priceTotal.value =
                    (quantity * price).toLocaleString("vi-VN") + " VNĐ";
            });
        }
    );

    document
        .getElementById("mt-save-import-btn")
        .addEventListener("click", () => {
            const materialId = parseInt(mt_importViewElements.select.value);
            const batchCode = mt_importViewElements.batchCode.value.trim();
            const quantity = parseInt(mt_importViewElements.quantity.value);
            const unit = mt_importViewElements.unit.value.trim();
            const reason = mt_importViewElements.reason.value;
            const location = mt_importViewElements.location.value.trim();
            const pricePerItem = parseFloat(mt_importViewElements.priceItem.value);
            const description = mt_importViewElements.description.value.trim();

            if (
                !materialId ||
                !batchCode ||
                !quantity ||
                !unit ||
                !location ||
                !pricePerItem
            ) {
                mt_showToast("Vui lòng điền đầy đủ thông tin.", "error");
                return;
            }

            const newBatch = {
                batchId: Date.now(),
                materialId,
                batchCode,
                quantity,
                unit,
                location,
                pricePerItem,
                description,
                supplier: "Nhà cung cấp mới",
                lastUpdated: new Date().toLocaleDateString("vi-VN"),
            };
            mt_mockBatches.push(newBatch);

            if (!mt_mockHistory[newBatch.batchId])
                mt_mockHistory[newBatch.batchId] = [];
            mt_mockHistory[newBatch.batchId].push({
                type: "import",
                quantity,
                reason,
                date: newBatch.lastUpdated,
            });

            mt_showToast(`Nhập kho thành công lô ${batchCode}!`);
            mt_navigate("mt-list");
            mt_renderMaterialList();
        });

    const mt_calculateExportTotal = () => {
        const quantity = parseInt(mt_exportViewElements.quantity.value) || 0;
        const price = parseFloat(mt_exportViewElements.price.value) || 0;
        mt_exportViewElements.totalPrice.value =
            (quantity * price).toLocaleString("vi-VN") + " VNĐ";
    };

    [mt_exportViewElements.quantity, mt_exportViewElements.price].forEach((el) =>
        el.addEventListener("input", mt_calculateExportTotal)
    );

    mt_exportViewElements.batchSelect.addEventListener("change", (e) => {
        const batchId = e.target.value;
        if (!batchId) {
            mt_exportViewElements.batchInfo.classList.add("d-none");
            return;
        }
        const batch = mt_mockBatches.find((b) => b.batchId == batchId);
        mt_exportViewElements.stockInfo.textContent = `${batch.quantity} ${batch.unit}`;
        mt_exportViewElements.location.textContent = batch.location;
        mt_exportViewElements.price.value = batch.pricePerItem;
        mt_exportViewElements.batchInfo.classList.remove("d-none");
        mt_calculateExportTotal();
    });

    document
        .getElementById("mt-save-export-btn")
        .addEventListener("click", () => {
            const batchId = parseInt(mt_exportViewElements.batchSelect.value);
            const quantity = parseInt(mt_exportViewElements.quantity.value);
            const price = parseFloat(mt_exportViewElements.price.value);
            const exporter = mt_exportViewElements.exporter.value.trim();
            const receiver = mt_exportViewElements.receiver.value.trim();
            const form = mt_exportViewElements.formSelect.value;
            const reason = mt_exportViewElements.reason.value.trim();
            const description = mt_exportViewElements.description.value.trim();

            if (
                !batchId ||
                !quantity ||
                quantity <= 0 ||
                !price ||
                !receiver ||
                !reason
            ) {
                mt_showToast("Vui lòng điền đầy đủ các trường bắt buộc.", "error");
                return;
            }

            const batch = mt_mockBatches.find((b) => b.batchId === batchId);
            if (quantity > batch.quantity) {
                mt_showToast("Số lượng xuất vượt quá tồn kho của lô.", "error");
                return;
            }

            batch.quantity -= quantity;
            batch.lastUpdated = new Date().toLocaleDateString("vi-VN");
            if (!mt_mockHistory[batch.batchId]) mt_mockHistory[batch.batchId] = [];
            mt_mockHistory[batch.batchId].push({
                type: "export",
                quantity,
                reason,
                date: batch.lastUpdated,
                price,
                exporter,
                receiver,
                form,
                description,
            });

            mt_showToast(
                `Xuất kho thành công ${quantity} vật tư từ lô ${batch.batchCode}!`
            );
            mt_navigate("mt-list");
            mt_renderMaterialList();
        });

    const savedTheme =
        localStorage.getItem("theme") ||
        (window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light");
    mt_setTheme(savedTheme);

    mt_renderMaterialList();
}

function initProductionOrderModule() {
    const $container = $("#PRODUCTION_ORDER");
    let materials;
    let products;
    // --- DATA ---
    let productionOrders = dataLSX;
    // let productionOrders = [
    //     {
    //         id: "LSX-24-001",
    //         product: "Tủ quần áo 3 cánh",
    //         quantity: 50,
    //         startDate: "2024-07-20",
    //         status: "completed",
    //         materials: [
    //             { id: "GO_MDF", name: "Gỗ MDF", qty: 100 },
    //             { id: "S_PU", name: "Sơn PU", qty: 20 },
    //             { id: "BAN_LE", name: "Bản lề", qty: 150 },
    //         ],
    //     }
    // ];
    
    let newOrderData = { info: {}, materials: [] }; // Used for both add and edit
    if(dataBom){
        const resultArray = [];
        dataBom.forEach(item => {
            resultArray.push({ id: item.id, text: item.name });
        });
        products = resultArray;;
    }
    if(dataMaterial.data){
        const resultArray = [];
        dataMaterial.data.forEach(item => {
            resultArray.push({ id: item.ITEM_ID, text: item.ITEM_NAME });
        });
        materials = resultArray;;
    }
    let editingOrderId = null;

    // --- FUNCTIONS ---
    function navigateTo(pageId) {
        $container.find(".page").removeClass("active");
        $container.find(pageId).addClass("active");
    }
    function renderOrderList() {
        const listEl = $container.find("#po-productionOrderList");
        listEl.empty();
        if (productionOrders.length === 0) {
            listEl.html(
                '<p class="text-center text-muted">Chưa có lệnh sản xuất nào.</p>'
            );
            return;
        }
        // Sắp xếp lại danh sách để đưa item mới lên đầu
        const sortedOrders = [...productionOrders].sort(
            (a, b) =>
                b.startDate.localeCompare(a.startDate) || b.id.localeCompare(a.id)
        );
        sortedOrders.forEach((order) => {
            const statusInfo = getStatusInfo(order.status);
            const orderHtml = `<div class="list-item-wrapper"><div class="list-item-actions"><button class="action-button action-edit" data-id="${order.id}"><i class="fas fa-pen"></i>Sửa</button><button class="action-button action-delete" data-id="${order.id}"><i class="fas fa-trash"></i>Xoá</button></div><div class="list-item-content" data-id="${order.id}"><div class="d-flex w-100 justify-content-between"><h5 class="mb-1 font-weight-bold" style="color: var(--accent-color-light);">${order.id}</h5><small class="text-muted">${order.startDate}</small></div><p class="mb-1">${order.product} - SL: ${order.quantity}</p><small><span class="status-badge ${statusInfo.class}">${statusInfo.text}</span></small></div></div>`;
            listEl.append(orderHtml);
        });
    }
    function renderOrderDetail(orderId) {
        const order = productionOrders.find((o) => o.id === orderId);
        if (!order) return;
        $container.find("#po-detailOrderId").text(order.id);
        const infoContent = `<p><strong>Sản phẩm:</strong> ${order.product
            }</p><p><strong>Số lượng:</strong> ${order.quantity
            }</p><p><strong>Ngày bắt đầu:</strong> ${order.startDate
            }</p><p><strong>Trạng thái:</strong> <span class="status-badge ${getStatusInfo(order.status).class
            }">${getStatusInfo(order.status).text}</span></p>`;
        $container.find("#po-detailInfoContent").html(infoContent);
        const materialsContent = $container.find("#po-detailMaterialsContent");
        materialsContent.empty();
        if (order.materials.length > 0) {
            order.materials.forEach((mat) => {
                materialsContent.append(
                    `<li class="list-group-item">${mat.name} <span class="badge badge-primary badge-pill" style="font-weight: 300;">${mat.qty}</span></li>`
                );
            });
        } else {
            materialsContent.html(
                '<li class="list-group-item text-muted">Không có vật tư cho lệnh này.</li>'
            );
        }
        setTimeout(() => updateTabIndicator($container.find("#po-detailTabs")), 50);
    }
    function renderAddedMaterials() {
        const listEl = $container.find("#po-addedMaterialsList");
        listEl.empty();
        if (newOrderData.materials.length === 0) {
            listEl.html(
                '<p class="text-center text-muted small mt-2">Chưa có vật tư nào được thêm.</p>'
            );
            return;
        }
        newOrderData.materials.forEach((mat, index) => {
            // Cấu trúc HTML mới cho mỗi list item
            const materialHtml = `
                <li class="list-group-item dark-theme-item">
                    <div class="material-content">
                        <div class="material-name">${mat.name}</div>
                        <div class="material-details">
                            <span class="material-qty">Số lượng: ${mat.qty}</span>
                            <div class="cmt-group">
                                <label class="cmt-label">Bù hao %:</label>
                                <input type="number" class="form-control input-cmt" value="${mat.cmt}" data-index="${index}" min="0">
                            </div>
                        </div>
                    </div>
                    <button class="btn-delete-material" data-index="${index}">
                        <i class="fas fa-trash"></i>
                    </button>
                </li>
            `;
            listEl.append(materialHtml);
        });
        listEl.on('change', '.input-cmt', function() {
            const index = $(this).data('index');
            // Dùng parseInt để đảm bảo giá trị là một con số
            const newValue = parseInt($(this).val(), 10) || 0; 

            // Cập nhật lại giá trị trong mảng dữ liệu gốc
            newOrderData.materials[index].cmt = newValue;

            console.log('Đã cập nhật mảng materials:', newOrderData.materials);
        });
    }
    function renderEditedMaterials() {
        const listEl = $container.find("#po-editedMaterialsList");
        listEl.empty();
        if (newOrderData.materials.length === 0) {
            listEl.html(
                '<p class="text-center text-muted small mt-2">Chưa có vật tư nào được thêm.</p>'
            );
            return;
        }
        newOrderData.materials.forEach((mat, index) => {
            const materialHtml = `
                <li class="list-group-item dark-theme-item">
                    <div class="material-content">
                        <div class="material-name">${mat.name}</div>
                        <div class="material-details">
                            <span class="material-qty">Số lượng: ${mat.qty}</span>
                            <div class="cmt-group">
                                <label class="cmt-label">Bù hao %:</label>
                                <input type="number" class="form-control input-cmt" value="${mat.cmt}" data-index="${index}" min="0">
                            </div>
                        </div>
                    </div>
                    <button class="btn-delete-material" data-index="${index}">
                        <i class="fas fa-trash"></i>
                    </button>
                </li>
            `;
            listEl.append(materialHtml);
        });
        listEl.on('change', '.input-cmt', function() {
            const index = $(this).data('index');
            // Dùng parseInt để đảm bảo giá trị là một con số
            const newValue = parseInt($(this).val(), 10) || 0; 

            // Cập nhật lại giá trị trong mảng dữ liệu gốc
            newOrderData.materials[index].cmt = newValue;

            console.log('Đã cập nhật mảng materials:', newOrderData.materials);
        });
    }
    function getStatusInfo(status) {
        switch (status) {
            case "NEW":
                return { text: "Mới", class: "status-new" };
            case "INPRO":
                return { text: "Đang SX", class: "status-inprogress" };
            case "COMP":
                return { text: "Hoàn thành", class: "status-completed" };
            default:
                return { text: "Không xác định", class: "" };
        }
    }
    function resetStepper() {
        const stepper1 = $container.find("#po-stepper-1");
        const stepper2 = $container.find("#po-stepper-2");
        stepper1.addClass("active").removeClass("completed");
        stepper2.removeClass("active").removeClass("completed");
        stepper1.find(".step-counter").html("1");
        stepper2.find(".step-counter").html("2");
    }
    function populateEditForm(order) {
        $container.find("#po-editOrderId").val(order.id);
        $container.find("#po-editQuantity").val(order.quantity);
        $container.find("#po-editStartDate").val(order.startDate);
        const product = products.find((p) => p.text === order.product);
        if (product) {
            $container.find("#po-editProductName").val(product.id).trigger("change");
        }
        newOrderData.materials = JSON.parse(JSON.stringify(order.materials));
        renderEditedMaterials();
        $container
            .find("#po-editTabs .tab-item:first")
            .addClass("active")
            .siblings()
            .removeClass("active");
        $container
            .find("#po-editTabContent .tab-pane:first")
            .addClass("show active")
            .siblings()
            .removeClass("show active");
        setTimeout(() => updateTabIndicator($container.find("#po-editTabs")), 50);
    }
    function updateTabIndicator(tabsContainer) {
        const activeTab = tabsContainer.find(".tab-item.active");
        const indicator = tabsContainer.find(".tab-indicator");
        if (activeTab.length) {
            indicator.css({
                left: activeTab[0].offsetLeft + "px",
                width: activeTab[0].offsetWidth + "px",
            });
        }
    }

    async function addOrEditLSX(type, dataLSX) {
        try {
            // --- BƯỚC 1: LẤY PR_KEY MỚI CHO BẢN GHI MASTER ---
            // (Trong trường hợp EDIT, bạn sẽ không cần bước này mà dùng PR_KEY có sẵn)
            const keyData = await HOMEOSAPP.getDM(
                "https://central.homeos.vn/service_XD/service.svc",
                "SYS_KEY",
                "TABLE_NAME in ('PO_INFORMATION_MASTER', 'PO_INFORMATION_DETAIL')"
            );
            const FRKey = keyData.data.filter((o) => o.TABLE_NAME == 'PO_INFORMATION_MASTER')[0].LAST_NUM;
            const FRKeyDetail = keyData.data.filter((o) => o.TABLE_NAME == 'PO_INFORMATION_DETAIL')[0].LAST_NUM;

            // Lấy User ID hiện tại (ví dụ, bạn cần có cách lấy thông tin này)
            const currentUserId = 'khai.nt'; // <-- THAY BẰNG ID USER THỰC TẾ

            // --- BƯỚC 2: CHUẨN BỊ VÀ THÊM DỮ LIỆU VÀO BẢNG MASTER ---
            const willInsertMaster = {
                TRAN_NO: dataLSX.info.id,
                TRAN_DATE: new Date(),
                PO_NAME: dataLSX.info.id,
                BOM_PRODUCT: dataLSX.info.id_product,
                ORDER_DATE: new Date(dataLSX.info.startDate),
                DELIVERY_DATE_PLN: new Date(dataLSX.info.startDate),
                STATUS: 'NEW', // Chuyển đổi status text sang số
                USER_ID: currentUserId,
                DATASTATE: type,

                // --- Các trường không có trong dataLSX, cung cấp giá trị mặc định ---
                PR_DETAIL_ID: null,
                PO_GROUP_ID: 'SX', // Ví dụ: Mặc định nhóm sản xuất
                PO_TYPE_ID: 'LSX', // Ví dụ: Mặc định loại là Lệnh sản xuất
                DELIVERY_DATE_ACT: null,
                PAYMENT_TERM_CODE: '',
                ORGANIZATION_ID: '0000', // Ví dụ: ID tổ chức mặc định
                SALE_EMPLOYEE_ID: '',
                SUPPORT_EMPLOYEE_ID: '',
                SHIPPING_ADDRESS: '',
                DESCRIPTION: `Lệnh sản xuất cho ${dataLSX.info.product}`,
                ACTIVE: 1,
            };
            await HOMEOSAPP.add('PO_INFORMATION_MASTER', willInsertMaster);

            // --- BƯỚC 3: CHUẨN BỊ VÀ THÊM DỮ LIỆU VÀO BẢNG DETAIL ---
            // Bảng này mô tả sản phẩm chính của Lệnh sản xuất
            const willInsertDetail = {
                FR_KEY: FRKey,
                PRODUCT_ID: dataLSX.info.product, // Tạm dùng tên, lý tưởng nên là ID sản phẩm
                QUANTITY: parseInt(dataLSX.info.quantity, 10),
                DELIVERY_DATE_PLN: new Date(dataLSX.info.startDate),
                USER_ID: currentUserId,
                DATASTATE: type,

                // --- Các trường không có trong dataLSX, cung cấp giá trị mặc định ---
                PR_PRODUCT_CODE: dataLSX.info.id_product,
                STATUS: 'NEW',
                PRICING: 0,
                QUANTITY_ACT: 0,
                UNIT_ID: 'CAI', // Ví dụ: Đơn vị mặc định là "Cái"
                TAX_RATE: 0,
                DELIVERY_DATE_ACT: null,
                SHIPPING_ADDRESS: '',
                NOTE: '',
                ACTIVE: 1,
            };
            await HOMEOSAPP.add('PO_INFORMATION_DETAIL', willInsertDetail);

            // --- BƯỚC 4: LẶP QUA VÀ THÊM DỮ LIỆU VÀO BẢNG BOM (VẬT TƯ) ---
            // Dùng for...of để có thể sử dụng await bên trong vòng lặp
            for (const material of dataLSX.materials) {
                // Giả sử bạn có mảng dataMaterial để lấy UNIT_ID
                // const dataItem = dataMaterial.data.find(item => item.ITEM_ID === material.id);
                // const unitId = dataItem ? dataItem.UNIT_ID : 'CAI'; // Đơn vị mặc định nếu không tìm thấy

                const willInsertBom = {
                    FR_KEY: FRKeyDetail,
                    ITEM_ID: material.id,
                    QUANTITY: material.qty,
                    // Lượng cần thiết = SL trên 1 sản phẩm * tổng SL sản phẩm
                    QUANTITY_NEEDED: (material.qty + (material.qty * (material.cmt / 100))) * parseInt(dataLSX.info.quantity, 10), 
                    NOTE: `Bù hao: ${material.cmt}%`, // Dùng trường cmt cho NOTE
                    USER_ID: currentUserId,
                    DATASTATE: type,
                    WH_QUANTITY: material.cmt,
                    
                    // --- Các trường không có trong dataLSX, cung cấp giá trị mặc định ---
                    PO_DETAIL_ID: null,
                    REG_CODE: '',
                    UNIT_ID: 'Cai', // Thay bằng unitId ở trên nếu có
                    ACTIVE: 1,
                    WH_UPDATE_DATE: null,
                };
                await HOMEOSAPP.add('PO_INFORMATION_BOM', willInsertBom);
            }

            toastr.success("Lưu thông tin Lệnh sản xuất thành công!");

        } catch (err) {
            console.error('Đã xảy ra lỗi khi lưu Lệnh sản xuất:', err);
            toastr.error('Có lỗi xảy ra, không thể lưu Lệnh sản xuất.');
        }
    }

    // --- INITIALIZE SELECT2 ---
    $container
        .find("#po-productName, #po-editProductName")
        .select2({
            data: products,
            placeholder: "Chọn hoặc tìm sản phẩm",
            allowClear: true,
        });
        
    $container
        .find("#po-materialName, #po-editMaterialName")
        .select2({ data: materials, placeholder: "Chọn vật tư", allowClear: true });

    // --- EVENT HANDLERS (GENERAL) ---
    $container.off(); // Detach all previous handlers within the container

    $container.on("click", "#po-btnAddOrder", async function (e) {
        e.preventDefault();
        $container.find("#po-formStep1")[0].reset();
        $container.find("#po-productName").val(null).trigger("change");
        resetStepper();
        $container.find("#po-addStep1").show();
        $container.find("#po-addStep2").hide();
        newOrderData = { info: {}, materials: [] };
        navigateTo("#po-addView");
        const LSX_code = await HOMEOSAPP.getTranNo("", 'GET', 'PO_INFORMATION_MASTER');
        $container.find("#po-orderId").val(LSX_code);
    });
    $container.on("click", ".btn-back", function () {
        navigateTo("#po-listView");
    });

    // --- ADD ORDER LOGIC ---
    $container.on("submit", "#po-formStep1", function (e) {
        e.preventDefault();
        const selectedProduct = $container
            .find("#po-productName")
            .select2("data")[0];
        if (!selectedProduct || selectedProduct.text === "") {
            alert("Vui lòng chọn một sản phẩm.");
            return;
        }
        const dataBomFilter = dataBom.filter((o) => o.id == selectedProduct.id);
        newOrderData.info = {
            id: $container.find("#po-orderId").val(),
            product: dataBomFilter[0].productName,
            id_product: selectedProduct.id,
            bom_product: selectedProduct.text,
            quantity: $container.find("#po-quantity").val(),
            startDate: $container.find("#po-startDate").val(),
            status: "new",
        };
        
        console.log(selectedProduct.id, dataBomFilter);
        
        dataBomFilter[0].materials.forEach(e => {
            newOrderData.materials.push({
                id: e.id,
                name: e.name,
                qty: e.qty,
                cmt: e.cmt
            });
        });
        console.log(newOrderData);
        
        
        const summaryHtml = `<p class="mb-1"><strong>Mã lệnh:</strong> ${newOrderData.info.id}</p><p class="mb-0"><strong>Sản phẩm:</strong> ${newOrderData.info.bom_product} (SL: ${newOrderData.info.quantity})</p>`;
        $container.find("#po-orderSummary").html(summaryHtml);
        const stepper1 = $container.find("#po-stepper-1");
        const stepper2 = $container.find("#po-stepper-2");
        stepper1.find(".step-counter").html('<i class="fas fa-check"></i>');
        stepper1.removeClass("active").addClass("completed");
        stepper2.addClass("active");
        $container.find("#po-addStep1").hide();
        $container.find("#po-addStep2").show();
        renderAddedMaterials();
    });

    $container.on("submit", "#po-formAddMaterial", function (e) {
        e.preventDefault();
        const selectedMaterial = $container
            .find("#po-materialName")
            .select2("data")[0];
        const materialQty = $container.find("#po-materialQty").val();
        if (selectedMaterial && selectedMaterial.text !== "" && materialQty) {
            newOrderData.materials.push({
                name: selectedMaterial.text,
                qty: parseInt(materialQty),
            });
            renderAddedMaterials();
            $container.find("#po-materialQty").val("");
            $container.find("#po-materialName").val(null).trigger("change");
            $container.find("#po-materialName").select2("open");
        }
    });

    $container.on(
        "click",
        "#po-addedMaterialsList .btn-delete-material",
        function () {
            newOrderData.materials.splice($(this).data("index"), 1);
            renderAddedMaterials();
        }
    );

    $container.on("click", "#po-btnSaveOrder", function () {
        productionOrders.unshift({
            ...newOrderData.info,
            materials: newOrderData.materials,
        });
        console.log(newOrderData);
        addOrEditLSX('ADD', newOrderData)
        // renderOrderList();
        // navigateTo("#po-listView");
        // alert("Đã lưu lệnh sản xuất thành công!");
    });

    // --- EDIT ORDER LOGIC ---
    $container.on("submit", "#po-formEditMaterial", function (e) {
        e.preventDefault();
        const selectedMaterial = $container
            .find("#po-editMaterialName")
            .select2("data")[0];
        const materialQty = $container.find("#po-editMaterialQty").val();
        if (selectedMaterial && selectedMaterial.text !== "" && materialQty) {
            newOrderData.materials.push({
                name: selectedMaterial.text,
                qty: parseInt(materialQty),
            });
            renderEditedMaterials();
            $container.find("#po-editMaterialQty").val("");
            $container.find("#po-editMaterialName").val(null).trigger("change");
            $container.find("#po-editMaterialName").select2("open");
        }
    });

    $container.on(
        "click",
        "#po-editedMaterialsList .btn-delete-material",
        function () {
            newOrderData.materials.splice($(this).data("index"), 1);
            renderEditedMaterials();
        }
    );
    $container.on("click", "#po-btnUpdateOrder", function () {
        const orderIndex = productionOrders.findIndex(
            (o) => o.id === editingOrderId
        );
        if (orderIndex > -1) {
            const selectedProduct = $container
                .find("#po-editProductName")
                .select2("data")[0];
            productionOrders[orderIndex].product = selectedProduct
                ? selectedProduct.text
                : "";
            productionOrders[orderIndex].quantity = $container
                .find("#po-editQuantity")
                .val();
            productionOrders[orderIndex].startDate = $container
                .find("#po-editStartDate")
                .val();
            productionOrders[orderIndex].materials = newOrderData.materials;
            renderOrderList();
            navigateTo("#po-listView");
            alert("Đã cập nhật lệnh sản xuất!");
        }
        editingOrderId = null;
    });

    // --- TABS & SWIPE & CLICK LOGIC ---
    $container.on("click", ".custom-tabs .tab-item", function (e) {
        e.preventDefault();
        const $this = $(this);
        if ($this.hasClass("active")) return;

        const tabsContainer = $this.closest(".custom-tabs");
        const tabContentContainer = $this.closest(".page").find(".po-tab-content");

        tabsContainer.find(".tab-item").removeClass("active");
        $this.addClass("active");

        const targetPaneId = $this.data("target");
        tabContentContainer.find(".tab-pane").removeClass("show active");
        tabContentContainer.find(targetPaneId).addClass("show active");

        updateTabIndicator(tabsContainer);
    });

    let startX,
        swipedItem = null,
        isSwiping = false,
        didMove = false;
    const threshold = 50;
    const maxSwipe = 150;

    function closeSwipedItem() {
        if (swipedItem) {
            // Thêm transition để item trượt về mượt mà và reset transform
            swipedItem.css("transition", "transform 0.3s ease-out");
            swipedItem.removeClass("swiped").css("transform", "translateX(0)");
            swipedItem = null;
        }
    }

    $container.on(
        "touchstart",
        "#po-productionOrderList .list-item-content",
        function (e) {
            // === THAY ĐỔI: Nếu có item khác đang mở -> đóng nó lại ===
            if (swipedItem && swipedItem[0] !== $(this)[0]) {
                closeSwipedItem();
            }
            startX = e.originalEvent.touches[0].clientX;
            isSwiping = false;
            didMove = false;
            // Bỏ transition khi bắt đầu chạm để di chuyển theo ngón tay
            $(this).css("transition", "none");
        }
    );

    $container.on(
        "touchmove",
        "#po-productionOrderList .list-item-content",
        function (e) {
            // === TỐI ƯU: Cache lại đối tượng jQuery $(this) để không phải gọi lại nhiều lần ===
            const $this = $(this);
            if (e.originalEvent.touches.length === 0) return;
            let currentX = e.originalEvent.touches[0].clientX;
            let diffX = startX - currentX;
            if (!didMove) didMove = true;
            if (Math.abs(diffX) > 10) isSwiping = true;

            if (isSwiping) {
                e.preventDefault();
                requestAnimationFrame(() => {
                    let moveX =
                        diffX > 0 ? Math.min(diffX, maxSwipe + 50) : Math.max(diffX, -50);
                    $this.css("transform", `translateX(${-moveX}px)`);
                });
            }
        }
    );

    $container.on(
        "touchend",
        "#po-productionOrderList .list-item-content",
        function (e) {
            if (!didMove) return; // Nếu không di chuyển, không xử lý gì cả

            const $this = $(this);
            // Thêm lại transition để có hiệu ứng mượt mà khi kết thúc chạm
            $this.css("transition", "transform 0.3s ease-out");

            if (isSwiping) {
                let diffX = startX - e.originalEvent.changedTouches[0].clientX;
                if (diffX > threshold) {
                    $this.addClass("swiped");
                    $this.css("transform", `translateX(-${maxSwipe}px)`);
                    swipedItem = $this;
                } else {
                    $this.removeClass("swiped").css("transform", "translateX(0)");
                    if (swipedItem && swipedItem[0] === $this[0]) {
                        swipedItem = null;
                    }
                }
            } else {
                // Nếu không phải là swipe (chỉ là tap), đóng item đang mở (nếu có)
                if (swipedItem) closeSwipedItem();
            }
        }
    );

    // Đóng item đang trượt khi click ra ngoài
    $(document).on("click", function (e) {
        const $target = $(e.target);
        if (
            swipedItem &&
            !$target.closest("#PRODUCTION_ORDER .list-item-wrapper").length
        ) {
            closeSwipedItem();
        }
    });

    // Xử lý sự kiện click trên item
    $container.on("click", ".list-item-content", function (e) {
        // Chỉ xử lý click nếu người dùng không có ý định vuốt
        if (didMove) return;

        if ($(this).hasClass("swiped")) {
            closeSwipedItem();
        } else {
            // Đóng item khác đang mở trước khi mở chi tiết
            if (swipedItem) {
                closeSwipedItem();
                return;
            }
            const orderId = $(this).data("id");
            renderOrderDetail(orderId);
            navigateTo("#po-detailView");
        }
    });

    $container.on("click", ".action-button", function (e) {
        e.stopPropagation();
        const orderId = $(this).data("id");
        const orderToEdit = productionOrders.find((o) => o.id === orderId);

        if ($(this).hasClass("action-edit")) {
            if (orderToEdit) {
                editingOrderId = orderId;
                populateEditForm(orderToEdit);
                navigateTo("#po-editView");
            }
        }
        if ($(this).hasClass("action-delete")) {
            if (confirm(`Bạn có chắc muốn xoá lệnh sản xuất ${orderId}?`)) {
                productionOrders = productionOrders.filter((o) => o.id !== orderId);
                renderOrderList();
                swipedItem = null;
            }
        }
    });

    // --- INITIALIZATION ---
    renderOrderList();
}

async function initBomDeclarationModule() {
    const $container = $("#BOM_DECLARATION");
    let productBOMs = dataBom;
    let materialsMasterList = [];
    
    const dataEmployee = await HOMEOSAPP.getDM(
        "https://central.homeos.vn/service_XD/service.svc",
        "HR_EMPLOYEE_INFO",
        "ACTIVE=1"
    );

    if(dataMaterial.data){
        const resultArray = [];
        dataMaterial.data.forEach(item => {
            resultArray.push({ id: item.ITEM_ID, text: item.ITEM_NAME });
        });
        materialsMasterList = resultArray;;
    }
    if(dataEmployee){
        populateEmployeeSelects(dataEmployee.data);
    }
    console.log(dataBom);
    
    let tempBomData = {};
    let editingBomId = null;

    // --- RENDER FUNCTIONS ---
    

    async function populateEmployeeSelects(data) {
        // 1. Tạo một chuỗi HTML chứa tất cả các thẻ <option>
        // Dùng map() để biến đổi mỗi object nhân viên thành một chuỗi <option>
        const optionsHtml = data.map(employee => {
            return `<option value="${employee.EMPLOYEE_ID}">${employee.EMPLOYEE_NAME}</option>`;
        }).join(''); // Dùng join('') để nối tất cả các chuỗi lại với nhau

        // 2. Lấy danh sách ID của tất cả các thẻ select cần cập nhật
        const selectIds = [
            'editBomDesigner',
            'editBomSampleRequester',
            'editBomHardwareFinisher',
            'editBomSoftwareUploader',
            'bomDesigner',
            'bomSampleRequester',
            'bomHardwareFinisher',
            'bomSoftwareUploader'
        ];

        // 3. Lặp qua từng ID và cập nhật nội dung HTML
        selectIds.forEach(id => {
            const selectElement = document.getElementById(id);
            if (selectElement) { // Kiểm tra xem thẻ có tồn tại không
                selectElement.innerHTML = optionsHtml;
            } else {
                console.warn(`Không tìm thấy thẻ select với ID: ${id}`);
            }
        });
        let optionsHtmlProduct = ` <option value="">-- Chọn sản phẩm --</option>
        ` + dataPR.data.map(product => {
            return `<option value="${product.PRODUCT_CODE}">${product.PRODUCT_NAME}</option>`;
        }).join(''); // Dùng join('') để nối tất cả các chuỗi lại với nhau
        
        // 2. Lấy danh sách ID của tất cả các thẻ select cần cập nhật
        const selectIdsProduct = [
            'editBomProductName',
            'bomProductName'
        ];

        // 3. Lặp qua từng ID và cập nhật nội dung HTML
        selectIdsProduct.forEach( id => {
            const selectElement = document.getElementById(id);
            if (selectElement) { // Kiểm tra xem thẻ có tồn tại không
                selectElement.innerHTML = optionsHtmlProduct;

                selectElement.addEventListener("change", async (e) => {
                    const selectedValue = e.target.value; // lấy value (PRODUCT_CODE)
                    const selectedText = e.target.options[e.target.selectedIndex].text; // lấy tên (PRODUCT_NAME)

                    console.log("ID Select:", id);
                    console.log("Value:", selectedValue);
                    console.log("Text:", selectedText);

                    const dataProduct = await HOMEOSAPP.getDM(
                        "https://central.homeos.vn/service_XD/service.svc",
                        "PRODUCT_PUBLISH",
                        "PRODUCT_ID='"+selectedValue+"'"
                    );
                    if(dataProduct.data.length > 0){
                        $container.find("#bomVersion").val(selectedValue+"_v"+ String(dataProduct.data.length+1).padStart(2, '0'));
                        $container.find("#editBomVersion").val(selectedValue+"_v"+ String(dataProduct.data.length+1).padStart(2, '0'));
                    } else {
                        $container.find("#editBomVersion").val(selectedValue+"_v01");
                    }
                    console.log(dataProduct);
                    
                });
            } else {
                console.warn(`Không tìm thấy thẻ select với ID: ${id}`);
            }
        });
    }

    function navigateTo(pageId) {
        $container.find(".page").removeClass("active");
        $container.find(pageId).addClass("active");
    }

    function renderBOMList() {
        const listEl = $container.find("#bomListContainer");
        listEl.empty();
        if (productBOMs.length === 0) {
            listEl.html('<p class="text-center text-muted p-3">Chưa có BOM nào.</p>');
            return;
        }
        productBOMs.forEach((bom) => {
            const bomHtml = `<div class="list-item-wrapper"><div class="list-item-actions"><button class="action-button action-edit" data-id="${bom.id}"><i class="fas fa-pen"></i>Sửa</button><button class="action-button action-delete" data-id="${bom.id}"><i class="fas fa-trash"></i>Xoá</button></div><div class="list-item-content" data-id="${bom.id}"><div class="d-flex w-100 justify-content-between"><h6 class="mb-1 font-weight-bold" style="color: var(--accent-color-light);">${bom.name}</h6><span class="bom-version-badge">${bom.version}</span></div><p class="mb-1 small text-secondary">${bom.shortDesc}</p></div></div>`;
            listEl.append(bomHtml);
        });
    }

    function renderMaterialList(listId, materials) {
        const listEl = $container.find(listId);
        listEl.empty();
        if (materials.length === 0) {
            listEl.html(
                '<p class="text-center text-muted small mt-2">Chưa có vật tư nào.</p>'
            );
            return;
        }
        materials.forEach((mat, index) => {
            listEl.append(
                `<li class="list-group-item"><span>${mat.name} - SL: ${mat.qty} - BH: ${mat.cmt}</span><button class="btn-delete-material" data-index="${index}"><i class="fas fa-trash"></i></button></li>`
            );
        });
    }

    function renderBOMDetail(bomId) {
        const bom = productBOMs.find((b) => b.id === bomId);
        if (!bom) return;
        $container.find("#detailBomTitle").text(bom.name);
        $container.find("#detailBomName").text(bom.name);
        $container.find("#detailBomShortDesc").text(bom.shortDesc);
        $container.find("#detailBomVersion").text(bom.version);
        $container.find("#detailBomDesigner").text(bom.designer);
        $container
            .find("#detailBomSampleRequester")
            .text(bom.sampleRequester || "N/A");
        $container
            .find("#detailBomHardwareFinisher")
            .text(bom.hardwareFinisher || "N/A");
        $container
            .find("#detailBomSoftwareUploader")
            .text(bom.softwareUploader || "N/A");

        const materialsTableBody = $container.find("#detailMaterialsTableBody");
        materialsTableBody.empty();
        if (bom.materials.length > 0) {
            bom.materials.forEach((mat) => {
                materialsTableBody.append(
                    `<tr><td>${mat.name}</td><td>${mat.qty}</td><td class="text-right">${mat.cmt}</td></tr>`
                );
            });
        } else {
            materialsTableBody.append(
                '<tr><td colspan="2" class="text-center text-secondary">Không có vật tư.</td></tr>'
            );
        }
        setTimeout(() => updateTabIndicator($("#detailTabs")), 50);
    }

    function resetStepper() {
        const stepper1 = $container.find("#stepper-1"),
            stepper2 = $container.find("#stepper-2");
        stepper1.addClass("active").removeClass("completed");
        stepper2.removeClass("active completed");
        stepper1.find(".step-counter").html("1");
        stepper2.find(".step-counter").html("2");
    }

    function populateEditForm(bom) {
        $container.find("#editBomName").val(bom.name);
        $container.find("#editBomProductName").val(bom.productName);
        $container.find("#editBomShortDesc").val(bom.shortDesc);
        $container.find("#editBomVersion").val(bom.version);
        $container.find("#editBomDescVersion").val(bom.noteVersion);
        $container.find("#editBomDesigner").val(bom.designer);
        $container.find("#editBomSampleRequester").val(bom.sampleRequester);
        $container.find("#editBomHardwareFinisher").val(bom.hardwareFinisher);
        $container.find("#editBomSoftwareUploader").val(bom.softwareUploader);
        tempBomData.materials = JSON.parse(JSON.stringify(bom.materials)); // Deep copy
        renderMaterialList("#editedMaterialsList", tempBomData.materials);
        $container
            .find("#editTabs .tab-item:first")
            .addClass("active")
            .siblings()
            .removeClass("active");
        $container
            .find("#editTabContent .tab-pane:first")
            .addClass("show active")
            .siblings()
            .removeClass("show active");
        setTimeout(() => updateTabIndicator($container.find("#editTabs")), 50);
    }

    function updateTabIndicator(tabsContainer) {
        const activeTab = tabsContainer.find(".tab-item.active");
        const indicator = tabsContainer.find(".tab-indicator");
        if (activeTab.length) {
            indicator.css({
                left: activeTab[0].offsetLeft + "px",
                width: activeTab[0].offsetWidth + "px",
            });
        }
    }

    async function addOrEditBom(type, dataBom) {
        dataPR_key = await HOMEOSAPP.getDM(
            "https://central.homeos.vn/service_XD/service.svc",
            "SYS_KEY",
            "TABLE_NAME='PRODUCT_PUBLISH'"
        );
        
        const willInsertData = {
            TRAN_NO: await HOMEOSAPP.getTranNo(dataBom.productName+"_[DAY][MONTH][YEAR]", ''), 
            TRAN_ID: '',
            TRAN_DATE: new Date(),
            PRODUCT_ID: dataBom.productName,
            CREATE_DATE: new Date(),
            ORDER_TEST: 3,
            DATE_PRODUCT: new Date(),
            SOFTWARE_OF: dataBom.softwareUploader,
            HARDWARE_OF: dataBom.hardwareFinisher,
            PACKAGE_OF: '',
            INCLUDE_NO: '',
            TYPE_VERSION: dataBom.productName + 'v01',
            IS_MODULE: 1,
            NOTE: dataBom.shortDesc,
            USER_ID: dataBom.designer,
            CUSTOMER_ID: dataBom.sampleRequester,
            BOM_PRODUCT: dataBom.name,
            DATASTATE: type,
        };
        
        const willInsertDataVersion = {
            FR_KEY: dataPR_key.data[0].LAST_NUM,
            TRAN_DATE: new Date(),
            VERSION: dataBom.version,
            NOTE: dataBom.noteVersion,
            USER_ID: dataBom.designer,
            DATASTATE: type,
        };

        HOMEOSAPP.add('PRODUCT_PUBLISH', willInsertData).then(async data => {
            try {
                toastr.success("Lưu thông tin BOM thành công!");
                
            } catch (e) { }
        }).catch(err => {
            console.error('Error:', err);
        });
        HOMEOSAPP.add('PRODUCT_PUBLISH_VERSION', willInsertDataVersion).then(async data => {
            try {
            } catch (e) { }
        }).catch(err => {
            console.error('Error:', err);
        });
        
        
        dataBom.materials.forEach(e => {
            const dataItem = dataMaterial.data.filter(item => item.ITEM_ID === e.id);
            const willInsertData_detail = {
                FR_KEY: dataPR_key.data[0].LAST_NUM,
                ITEM_ID: e.id,
                UNIT_ID: dataItem[0].UNIT_ID,
                IS_MODULE: dataItem[0].IS_MODULE,
                QUANTITY: e.qty,
                ITEM_PRICE: 0,
                ITEM_PRICE_DESIGN: 0,
                QUNATITY_ADDING: e.cmt,
                LIST_ORDER: 0,
                NOTE: '',
                TRAN_DATE: new Date(),
                USER_ID: dataBom.designer,
                DATASTATE: type
            }
            HOMEOSAPP.add('PRODUCT_PUBLISH_DETAIL', willInsertData_detail).then(async data => {
                try {
                } catch (e) { }
            }).catch(err => {
                console.error('Error:', err);
            });
            HOMEOSAPP.delay(200);
        });
    }

    // --- INITIALIZE SELECT2 ---
    $container
        .find("#materialName, #editMaterialName")
        .select2({
            data: materialsMasterList,
            placeholder: "Chọn vật tư",
            allowClear: true,
        });

    // --- EVENT HANDLERS ---
    $container.off(); // Detach all previous handlers

    $container.on("click", "#btnAddBom", function (e) {
        e.preventDefault();
        $container.find("#formStep1")[0].reset();
        resetStepper();
        $container.find("#addStep1").show();
        $container.find("#addStep2").hide();
        tempBomData = { info: {}, materials: [] };
        navigateTo("#addView");
    });
    $container.on("click", ".btn-back", function () {
        navigateTo("#bomListView");
    });

    // Add BOM Logic
    $container.on("submit", "#formStep1", function (e) {
        e.preventDefault();
        tempBomData.info = {
            id: `BOM${Date.now()}`,
            name: $container.find("#bomName").val(),
            productName: $container.find("#bomProductName").val(),
            shortDesc: $container.find("#bomShortDesc").val(),
            version: $container.find("#bomVersion").val(),
            noteVersion: $container.find("#bomDescVersion").val(),
            designer: $container.find("#bomDesigner").val(),
            sampleRequester: $container.find("#bomSampleRequester").val(),
            hardwareFinisher: $container.find("#bomHardwareFinisher").val(),
            softwareUploader: $container.find("#bomSoftwareUploader").val(),
        };
        $container
            .find("#bomSummary")
            .html(
                `<p class="mb-1"><strong>Tên BOM:</strong> ${tempBomData.info.name}</p><p class="mb-0"><strong>Sản phẩm:</strong> ${tempBomData.info.productName}</p>`
            );
        const stepper1 = $container.find("#stepper-1"),
            stepper2 = $container.find("#stepper-2");
        stepper1.find(".step-counter").html('<i class="fas fa-check"></i>');
        stepper1.removeClass("active").addClass("completed");
        stepper2.addClass("active");
        $container.find("#addStep1").hide();
        $container.find("#addStep2").show();
        renderMaterialList("#addedMaterialsList", tempBomData.materials);
    });

    $container.on("submit", "#formAddMaterial", function (e) {
        e.preventDefault();
        const selectedMaterial = $container
            .find("#materialName")
            .select2("data")[0];
        console.log(selectedMaterial);
        
        const materialQty = $container.find("#materialQty").val();
        const materialBH = $container.find("#materialBH").val();
        if (selectedMaterial && selectedMaterial.text && materialQty) {
            tempBomData.materials.push({
                id: selectedMaterial.id,
                name: selectedMaterial.text,
                qty: parseInt(materialQty),
                cmt: parseInt(materialBH),
            });
            renderMaterialList("#addedMaterialsList", tempBomData.materials);
            this.reset();
            $container.find("#materialName").val(null).trigger("change");
        }
    });

    $container.on(
        "click",
        "#addedMaterialsList .btn-delete-material",
        function () {
            tempBomData.materials.splice($(this).data("index"), 1);
            renderMaterialList("#addedMaterialsList", tempBomData.materials);
        }
    );

    $container.on("click", "#btnSaveBom", function () {
        const newBom = { ...tempBomData.info, materials: tempBomData.materials };
        productBOMs.unshift(newBom);
        addOrEditBom('ADD', newBom);
        renderBOMList();
        navigateTo("#bomListView");
    });

    // Edit BOM Logic
    $container.on("submit", "#formEditMaterial", function (e) {
        e.preventDefault();
        const selectedMaterial = $container
            .find("#editMaterialName")
            .select2("data")[0];
        const materialQty = $container.find("#editMaterialQty").val();
        const materialBH = $container.find("#editMaterialBH").val();
        if (selectedMaterial && selectedMaterial.text && materialQty) {
            tempBomData.materials.push({
                name: selectedMaterial.text,
                qty: parseInt(materialQty),
                cmt: parseInt(materialBH),
            });
            renderMaterialList("#editedMaterialsList", tempBomData.materials);
            this.reset();
            $container.find("#editMaterialName").val(null).trigger("change");
        }
    });
    $container.on(
        "click",
        "#editedMaterialsList .btn-delete-material",
        function () {
            tempBomData.materials.splice($(this).data("index"), 1);
            renderMaterialList("#editedMaterialsList", tempBomData.materials);
        }
    );

    $container.on("click", "#btnUpdateBom", function () {
        const bomIndex = productBOMs.findIndex((b) => b.id === editingBomId);
        if (bomIndex > -1) {
            productBOMs[bomIndex] = {
                ...productBOMs[bomIndex],
                name: $container.find("#editBomName").val(),
                productName: $container.find("#editBomProductName").val(),
                shortDesc: $container.find("#editBomShortDesc").val(),
                version: $container.find("#editBomVersion").val(),
                notVersion: $container.find("#editBomDescVersion").val(),
                designer: $container.find("#editBomDesigner").val(),
                sampleRequester: $container.find("#editBomSampleRequester").val(),
                hardwareFinisher: $container.find("#editBomHardwareFinisher").val(),
                softwareUploader: $container.find("#editBomSoftwareUploader").val(),
                materials: tempBomData.materials,
            };
            renderBOMList();
            navigateTo("#bomListView");
            alert("Đã cập nhật BOM!");
        }
        editingBomId = null;
    });

    // TABS, SWIPE, CLICK Logic
    $container.on("click", ".custom-tabs .tab-item", function (e) {
        e.preventDefault();
        const $this = $(this);
        if ($this.hasClass("active")) return;
        const tabsContainer = $this.closest(".custom-tabs");
        tabsContainer.find(".tab-item").removeClass("active");
        $this.addClass("active");
        const targetPaneId = $this.data("target");
        $(targetPaneId).siblings(".tab-pane").removeClass("show active");
        $(targetPaneId).addClass("show active");
        updateTabIndicator(tabsContainer);
    });

    let startX,
        swipedItem = null,
        isSwiping = false,
        didMove = false;
    const threshold = 50,
        maxSwipe = 150;
    function closeSwipedItem() {
        if (swipedItem) {
            swipedItem.removeClass("swiped").css("transform", "translateX(0)");
            swipedItem = null;
        }
    }

    $container.on(
        "touchstart",
        "#bomListContainer .list-item-content",
        function (e) {
            if (swipedItem && swipedItem[0] !== $(this)[0]) {
                closeSwipedItem();
            }
            startX = e.originalEvent.touches[0].clientX;
            isSwiping = false;
            didMove = false;
            $(this).css("transition", "none");
        }
    );
    $container.on(
        "touchmove",
        "#bomListContainer .list-item-content",
        function (e) {
            if (e.originalEvent.touches.length === 0) return;
            let currentX = e.originalEvent.touches[0].clientX;
            let diffX = startX - currentX;
            if (!didMove) didMove = true;
            if (Math.abs(diffX) > 10) isSwiping = true;
            if (isSwiping) {
                e.preventDefault();
                let moveX =
                    diffX > 0 ? Math.min(diffX, maxSwipe + 50) : Math.max(diffX, -50);
                $(this).css("transform", `translateX(${-moveX}px)`);
            }
        }
    );
    $container.on(
        "touchend",
        "#bomListContainer .list-item-content",
        function (e) {
            if (!isSwiping) return;
            $(this).css("transition", "transform 0.3s ease-out");
            let diffX = startX - e.originalEvent.changedTouches[0].clientX;
            if (diffX > threshold) {
                $(this)
                    .addClass("swiped")
                    .css("transform", `translateX(-${maxSwipe}px)`);
                swipedItem = $(this);
            } else {
                $(this).removeClass("swiped").css("transform", "translateX(0)");
                if (swipedItem && swipedItem[0] === $(this)[0]) swipedItem = null;
            }
        }
    );

    $(document).on("click", function (e) {
        const $target = $(e.target);
        if (swipedItem && !$target.closest(".list-item-wrapper").length) {
            closeSwipedItem();
        }
    });

    $container.on("click", ".list-item-content", function (e) {
        if (didMove) return;
        if ($(this).hasClass("swiped")) {
            closeSwipedItem();
        } else {
            const bomId = $(this).data("id");
            renderBOMDetail(bomId);
            navigateTo("#detailView");
        }
    });

    $container.on("click", ".action-button", function (e) {
        e.stopPropagation();
        const bomId = $(this).data("id");
        const bomToEdit = productBOMs.find((b) => b.id === bomId);

        if ($(this).hasClass("action-edit")) {
            if (bomToEdit) {
                editingBomId = bomId;
                populateEditForm(bomToEdit);
                navigateTo("#editView");
            }
        }
        if ($(this).hasClass("action-delete")) {
            if (confirm(`Bạn có chắc muốn xoá ${bomToEdit.name}?`)) {
                productBOMs = productBOMs.filter((b) => b.id !== bomId);
                renderBOMList();
                swipedItem = null;
            }
        }
    });

    // --- INITIALIZATION ---
    renderBOMList();
}

renderApps(apps_waveHouse, "wareHouse-list");
// Chạy hàm khởi tạo để test (bạn sẽ xóa dòng này khi ghép file)
//
