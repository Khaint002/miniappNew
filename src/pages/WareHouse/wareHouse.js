// var apps_waveHouse = [
//     { MENU_ID: "CREATELOT", MENU_NAME: "Tạo lô", MENU_VERSION: "v1.1.5", MENU_BGCOLOR: "#17a2b8", MENU_ICON: "bi-cloud-sun", MENU_SHARE_OWNER: "WID=", MENU_SHARE_ADMIN: null, MENU_SHARE_GUEST: null, MENU_TYPE: "LOAD", MENU_LINK: "https://miniapp-new.vercel.app/src/pages/History/history.html", DESCRIPTION: "Quản lý lô hàng", VISIBLE: true },
//     { MENU_ID: "PRQRCODE", MENU_NAME: "In mã QR", MENU_VERSION: "v4.56 Pro", MENU_BGCOLOR: "#da4a58", MENU_ICON: "bi-pc-display-horizontal", MENU_SHARE_OWNER: null, MENU_SHARE_ADMIN: null, MENU_SHARE_GUEST: null, MENU_TYPE: "LOCATION", MENU_LINK: "http://devices.homeos.vn/", DESCRIPTION: "In mã QR", VISIBLE: true },
//     { MENU_ID: "IMPORT", MENU_NAME: "Kho sản phẩm", MENU_VERSION: "v1.0.5", MENU_BGCOLOR: "#e29038", MENU_ICON: "bi-tools", MENU_SHARE_OWNER: "Q=OWNER&CK=", MENU_SHARE_ADMIN: "Q=ADMIN&CK=", MENU_SHARE_GUEST: "Q=GUEST&CK=", MENU_TYPE: "LOAD", MENU_LINK: "https://miniapp-new.vercel.app/src/pages/History/history.html", DESCRIPTION: "Tồn kho", VISIBLE: true },
//     { MENU_ID: "EXPORT", MENU_NAME: "Xuất kho", MENU_VERSION: "v1.0.4", MENU_BGCOLOR: "#17a2b8", MENU_ICON: "bi-toggles", MENU_SHARE_OWNER: "CID=", MENU_SHARE_ADMIN: null, MENU_SHARE_GUEST: null, MENU_TYPE: "LOAD", MENU_LINK: "https://miniapp-new.vercel.app/src/pages/History/history.html", DESCRIPTION: "Quét xuất kho", VISIBLE: true },
// ];
var apps_waveHouse = [
    { MENU_ID: "MATERIAL", MENU_NAME: "Kho Vật Tư", MENU_ICON: "bi-tools", MENU_BGCOLOR_CLASS: "bg-success", DESCRIPTION: "Quản lý vật tư sản xuất", VISIBLE: true, },
    { MENU_ID: "BOM_DECLARATION", MENU_NAME: "Khai báo BOM", MENU_ICON: "bi-diagram-3", MENU_BGCOLOR_CLASS: "bg-secondary", DESCRIPTION: "Định mức nguyên vật liệu", VISIBLE: true, },
    { MENU_ID: "PRODUCTION_ORDER", MENU_NAME: "Lập Lệnh SX", MENU_ICON: "bi-building-gear", MENU_BGCOLOR_CLASS: "bg-danger", DESCRIPTION: "Tạo lệnh sản xuất mới", VISIBLE: true, },
    { MENU_ID: "WAREHOUSE_PRODUCT", MENU_NAME: "Kho Sản Phẩm", MENU_ICON: "bi-box-seam", MENU_BGCOLOR_CLASS: "bg-primary", DESCRIPTION: "Xem tồn kho, nhập, xuất", VISIBLE: true, },
    { MENU_ID: "CREATELOT", MENU_NAME: "Quản Lý Lô", MENU_ICON: "bi-stack", MENU_BGCOLOR_CLASS: "bg-warning", DESCRIPTION: "Tạo và sửa lô hàng", VISIBLE: true, },
    { MENU_ID: "PRQRCODE", MENU_NAME: "Tạo QR", MENU_ICON: "bi-qr-code", MENU_BGCOLOR_CLASS: "bg-info", DESCRIPTION: "In mã QR cho sản phẩm", VISIBLE: true, },
];
var currentCameraIndex = 0;
var isScannerRunning = false;
var dataPR;
var dataMaterial;
var dataBom;
var dataLSX;
var dataDetailLot;
var dataEmployee;
var currentUser = "Nguyễn Văn A";
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
var dataPropose = [];

// --- FUNCTIONS ---
async function renderApps(apps, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const login = JSON.parse(localStorage.getItem("dataLogin")) || [];
    console.log(login);
    
    if(login.length != 0){
        document.getElementById("wareHouse-login").classList.add("d-none");
        document.getElementById("wareHouse-menu").classList.remove("d-none");
        document.getElementById("footer-wareHouse").classList.remove("d-none");
        if (window.GetUser) {
            DataUser = JSON.parse(localStorage.getItem("userInfo"));
            $(".userName").text(DataUser.name);
            $(".userAvt").attr("src", DataUser.avatar);
            currentUser = DataUser.name;
        } else {
            $(".userName").text(login.username);
            currentUser = login.username
        }
    }
    
    container.innerHTML = "";
    setTheme("dark");
    initPhotoUploader("photoBox1");
    initPhotoUploader("photoBox2");
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
    
    dataMaterial = await HOMEOSAPP.getApiServicePublic(
        HOMEOSAPP.linkbase,
        "GetDataDynamicWareHouse",
        "TYPE_QUERY='WAREHOUSE'"
    );
    let numberVT = 0;
    let numberSP = 0;
    let numberHold = 0;
    dataMaterial.forEach(item => {
        if(item.QUANTITY >= 0){
            
            if(item.QUANTITY < item.QUANTITY_HOLD){
                numberHold += 1;
            } else {
                numberVT += 1
            }
        }
    });

    document.getElementById("productCount").textContent = numberSP.toLocaleString();
    document.getElementById("materialCount").textContent = numberVT.toLocaleString();
    document.getElementById("lowStockCount").textContent = numberHold.toLocaleString();

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
    HOMEOSAPP.delay(100);
    const dataEmployeeAll = await HOMEOSAPP.getDM(
        HOMEOSAPP.linkbase,
        "HR_EMPLOYEE_INFO",
        "ACTIVE=1"
    );
    dataEmployee = dataEmployeeAll.data;
    renderSelectAll(dataEmployee);
    dataLSX = await groupProductDataWithArrayLSX(dataLSX);

    dataBom = await groupProductDataWithArray(dataBom);

    console.log(dataBom);
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
function renderSelectAll(data) {
    const optionsHtml = data.map(employee => {
        return `<option value="${employee.EMPLOYEE_ID}">${employee.EMPLOYEE_NAME}</option>`;
    }).join(''); // Dùng join('') để nối tất cả các chuỗi lại với nhau

    const optionsLotHtml = mockBatches.map(lot => {
        return `<option value="${lot.productCode}">${lot.batchCode}</option>`;
    }).join('');

    // 2. Lấy danh sách ID của tất cả các thẻ select cần cập nhật
    const selectIds = [
        'mt-export-receiver',
        'mt-exportP-receiver',
        'export-receiver'
    ];

    const selectLotIds = [
        'LotSelect'
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

    selectLotIds.forEach(id => {
        const selectElement = document.getElementById(id);
        if (selectElement) { // Kiểm tra xem thẻ có tồn tại không
            selectElement.innerHTML = optionsLotHtml;
        } else {
            console.warn(`Không tìm thấy thẻ select với ID: ${id}`);
        }
    });

}

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
                HOMEOSAPP.linkbase,
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
                    dom.infoIdentifiedQuantity.textContent = Number(dom.infoIdentifiedQuantity.textContent) + 1;
                    dom.infoRemainingQuantity.textContent = Number(dom.infoRemainingQuantity.value) - 1;
                    renderScannedData(dataDetailLot);
                    scanAgain();
                    updateIdButtonStates(true);
                    break;
                default:
                    break;
            }
        }
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
                                        HOMEOSAPP.linkbase,
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
            cmt: item.QUNATITY_ADDING || 0,
            atu_qty: item.ITEM_QUANTITY
        };

        if (existingProduct) {
            // Nếu sản phẩm đã tồn tại, chỉ cần thêm vật tư vào
            existingProduct.materials.push(newMaterial);
        } else {
            // Nếu sản phẩm chưa tồn tại, tạo mới sản phẩm và thêm vào mảng kết quả
            const newProduct = {
                prKey: item.PR_KEY,
                id: item.TRAN_NO,
                name: `${item.BOM_PRODUCT}`,
                productName: item.PRODUCT_ID,
                productNameText: item.PRODUCT_NAME,
                version: item.VERSION || 'v1.0.0',
                noteVersion: item.NOTE_VERSION || 'v1.0.0',
                shortDesc: item.TRAN_NO || 'Không có mô tả',
                designer: item.USER_ID,
                sampleRequester: item.CUSTOMER_ID || 'Chưa có thông tin',
                hardwareFinisher: item.HARDWARE_OF || 'Chưa có thông tin',
                softwareUploader: item.SOFTWARE_OF || 'Chưa có thông tin',
                // Khởi tạo mảng materials với vật tư đầu tiên
                materials: [newMaterial] ,
                date: item.CREATE_DATE
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
            cmt: item.WH_QUANTITY,
            atu_qty: item.ITEM_QUANTITY,
            need_qty: item.QUANTITY_NEEDED
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

function groupPropose(data) {
    const result = {};

    data.forEach(item => {
        const tranNo = item.TRAN_NO;

        // Nếu chưa có TRAN_NO trong result -> khởi tạo
        if (!result[tranNo]) {
            result[tranNo] = {
                TRAN_NO: tranNo,
                STATUS_ID: item.STATUS_ID,
                PRODUCT_ID: item.PRODUCT_ID,
                QUANTITY: item.QUANTITY,
                ITEMS: [] // mảng con chứa các vật tư
            };
        }

        // Thêm item vào mảng con
        result[tranNo].ITEMS.push({
            ITEM_ID: item.ITEM_ID,
            ITEM_NAME: item.ITEM_NAME,
            UNIT_ID: item.UNIT_ID,
            UNIT_NAME: item.UNIT_NAME,
            QUANTITY_REQUIRE: item.QUANTITY_REQUIRE,
            ITEM_QUANTITY: item.ITEM_QUANTITY,
            QUANTITY_BOM: item.QUANTITY_BOM,
            QUANTITY_ADDING: item.QUANTITY_ADDING
        });
    });

    // Chuyển object -> mảng
    return Object.values(result);
}

async function connectAppWaveHouse(ID, NAME) {
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
        const AlldataPropose = await HOMEOSAPP.getApiServicePublic(
            HOMEOSAPP.linkbase,
            "GetDataDynamicWareHouse",
            "TYPE_QUERY='PROPOSE'"
        );
        const groupedData = groupPropose(AlldataPropose);
        dataPropose = groupedData;
        
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

async function createLot(type) {
    const product = $("#LotSelect").val();
    const scannedData = await HOMEOSAPP.getDM(
        HOMEOSAPP.linkbase,
        "DM_QRCODE_MODAL",
        "PRODUCT_ID = '" + product + "'"
    );

    console.log(scannedData.data);
    generateCKUrls(341, scannedData.data, type);
}

function generateCKUrls(count, data, type) {
    const baseUrl = "https://zalo.me/s/4560528012046048397/?CK=";
    const hexChars = "0123456789abcdef";
    const urls = [];

    for (let i = 0; i < count; i++) {
        let ckValue = "";
        for (let j = 0; j < 64; j++) {
            ckValue += hexChars.charAt(Math.floor(Math.random() * hexChars.length));
        }
        urls.push(`${baseUrl}${ckValue}`);
    }
    if(type == "EXCEL"){
        generateQRCodeExcel(urls);
    } else if(type == "FILE"){
        generateQRCodes(urls, data);
    }
    
}

async function generateQRCodes(listcode, data) {
    console.log(listcode);

    $("#progressContainer").show(); // Hiện thanh tiến trình
    $("#progressBar").css("width", "0%").text("0%").removeClass("bg-info").addClass("bg-success");

    let htmlContent = `
        <html>
        <head>
            <style>
                .qr-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, 3cm);
                    gap: 0.5cm;
                    justify-content: center;
                    margin-top: 10px;
                }
            </style>
        </head>
        <body>
            <div style="display: flex; flex-wrap: wrap; gap: 5mm;">
    `;
    let PR_KEY = 10;
    for (const code of listcode) {
        // Tạo một <div> tạm để render mã QR
        const tempDiv = document.createElement('div');
        const qrCode = new QRCode(tempDiv, {
            text: code,           // Mã code muốn tạo
            // width: 57,           // Chiều rộng mã QR
            // height: 57           // Chiều cao mã QR
            width: 113,           // Chiều rộng mã QR
            height: 113           // Chiều cao mã QR
        });

        // Chờ QRCode render xong và lấy hình ảnh từ thẻ canvas
        const qrDataUrl = await new Promise((resolve) => {
            setTimeout(() => {
                const canvas = tempDiv.querySelector('canvas');  // Lấy thẻ canvas chứa mã QR
                resolve(canvas.toDataURL());                    // Chuyển canvas thành DataURL
            }, 500);  // Đợi một thời gian ngắn để chắc chắn mã QR được tạo xong
        });
        const prKeyStr = PR_KEY.toString().padStart(4, '0');

        const templateFn = new Function('prKeyStr', 'qrDataUrl', `return \`${data[0].MODAL_HTML}\`;`);
        const renderedHTML = templateFn(prKeyStr, qrDataUrl);
        console.log(data.MODAL_HTML);
        
        // Thêm template đã render vào nội dung
        htmlContent += `<div class="qr-item">${renderedHTML}</div>`;

        const ckValue = extractCK(code);
        
        const willInsertData = {
            QR_CODE: "T20251029,ASS.RF24.K01,A202510."+prKeyStr,
            CK_CODE: ckValue,
            MA_SAN_PHAM: "ASS.RF24.K01",
            DATE_CREATE: new Date(),
            ACTIVATE_WARRANTY: new Date('1999-01-01 07:00:00.000'),
            USER_ID: '6722547918621605824',
            DATASTATE: "ADD",
        };
        console.log(willInsertData);
        
        // add(user_id, session, 'DM_QRCODE', willInsertData);
        const percent = Math.round((PR_KEY / listcode.length) * 100);
        $("#progressBar").css("width", percent + "%").text(percent + "%");
        PR_KEY++;
    }

    $("#progressBar").removeClass("bg-success").addClass("bg-info").text("Hoàn tất!");

    const newTab = window.open('', '_blank');
    if (!newTab || newTab.closed || typeof newTab.closed == 'undefined') {
        alert('Tab mới không thể mở. Vui lòng kiểm tra cài đặt popup của trình duyệt.');
        return;
    }
    
    // Chèn nội dung HTML vào tab mới
    newTab.document.write(htmlContent);
    newTab.document.close();

    const script = newTab.document.createElement("script");
    script.textContent = "window.onload = function() { window.print(); }";
    newTab.document.body.appendChild(script);
    setTimeout(() => {
        $("#progressContainer").fadeOut(500);
    }, 1000);
}

async function generateQRCodeExcel(urls, sheetName = "QR Codes", fileName = "QRCode_List.xlsx") {
    if (typeof urls === "string") urls = [urls];
    urls = urls.filter(u => u && u.trim() !== "");

    if (urls.length === 0) {
        alert("Không có URL hợp lệ để tạo QR Code!");
        return;
    }

    // Chuẩn bị dữ liệu Excel
    const excelData = [["STT", "URL", "QR Base64"]];
    let PR_KEY = 10;
    for (let i = 0; i < urls.length; i++) {
        const prKeyStr = PR_KEY.toString().padStart(4, '0');
        const url = urls[i].trim();
        const ckValue = extractCK(url);
        
        const willInsertData = {
            QR_CODE: "T20251029,ASS.RF24.K01,A202510."+prKeyStr,
            CK_CODE: ckValue,
            MA_SAN_PHAM: "ASS.RF24.K01",
            DATE_CREATE: new Date(),
            ACTIVATE_WARRANTY: new Date('1999-01-01 07:00:00.000'),
            USER_ID: '6722547918621605824',
            DATASTATE: "ADD",
        };
        console.log(willInsertData);
        await HOMEOSAPP.add('DM_QRCODE', willInsertData);
        // const qrBase64 = await QRCode.toDataURL(url, { width: 150 });
        excelData.push([i + 1, "A202510."+prKeyStr, url]);
        PR_KEY++;
    }

    const ws = XLSX.utils.aoa_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);

    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([wbout], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    });

    const blobUrl = URL.createObjectURL(blob);

    // 🔍 Kiểm tra có hàm downloadFileToDevice hay không
    if (typeof window.downloadFileToDevice === "function") {
        // Nếu có -> gọi hàm người dùng
        window.downloadFileToDevice(blobUrl);
    } else {
        // Nếu không có -> tự động tải xuống
        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(blobUrl);
    }
}

function extractCK(url) {
    const match = url.match(/[?&]CK=([a-fA-F0-9]{64})/);
    return match ? match[1] : null;
}

$(".backWaveHouse").click(() => {
    document.getElementById("wareHouse-menu").classList.remove("d-none");
    document.getElementById("wareHouse-detail").classList.add("d-none");
    $("#footer-wareHouse").removeClass("d-none");
});

$(".backMenuAll").click(() => {
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

async function mapProductionDataToBatches(productionData) {
    const batches = await Promise.all(
        productionData.map(async (item) => {
            // Lấy dữ liệu quét
            let quantityScan = 0;
            const scannedData = await HOMEOSAPP.getDM(
                HOMEOSAPP.linkbase,
                "DM_QRCODE",
                "LOT_ID = '" + item.PR_KEY + "'"
            );

            // Chuẩn bị scannedData dạng pallet/carton/layer
            let structuredScannedData = {
                pallet_1: {
                    carton_1: {}
                }
            };

            if (scannedData?.data?.length) {
                scannedData.data.forEach((row) => {
                    const layerKey = `layer_${row.LOT_CLASS}`;
                    if (!structuredScannedData.pallet_1.carton_1[layerKey]) {
                        structuredScannedData.pallet_1.carton_1[layerKey] = [];
                    }

                    // tạo object sản phẩm {id, name}
                    // const parts = row.PRODUCT_CODE.split(",");
                    structuredScannedData.pallet_1.carton_1[layerKey].push(
                        row.QR_CODE
                    );
                    quantityScan += 1
                });
            } else {
                // Nếu chưa có dữ liệu thì mặc định layer_1 rỗng
                structuredScannedData.pallet_1.carton_1.layer_1 = [];
            }

            return {
                batchCode: item.LOT_PRODUCT_CODE,
                productCode: item.PRODUCT_CODE,
                productName: item.PRODUCT_NAME,
                bomId: item.BOM_PRODUCT,
                lsx: item.PRODUCTION_ORDER,
                creationDate: item.DATE_CREATE.split("T")[0],
                status: item.STATUS_NAME,
                active: 0,
                quantity: item.QUANTITY_PLAN,
                unit: item.UNIT_NAME,
                batchUnit: item.UNIT_LOT_ID,
                identifiedQuantity: quantityScan,
                scannedData: structuredScannedData,
                palletsPerContainer: item.PALLET_IN_CONTAINER,
                cartonsPerPallet: item.CARTON_IN_PALLET,
                layersPerCarton: item.CLASS_IN_CARTON,
                itemsPerLayer: item.PRODUCT_IN_CLASS
            };
        })
    );

    return batches;
}

// --- Lấy các phần tử DOM ---
var getDomElements = () => ({
    listScreen: document.getElementById("list-screen"),
    formScreen: document.getElementById("form-screen"),
    productIdScreen: document.getElementById("product-id-screen"),
    batchListContainer: document.getElementById("batch-list-container"),
    searchInput: document.getElementById("lot-search-input"),
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
    console.log(activeBatches);
    
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
    console.log(searchTerm);
    
    const filteredBatches = mockBatches.filter(
        (batch) =>
            batch.batchCode.toLowerCase().includes(searchTerm) ||
            batch.productName.toLowerCase().includes(searchTerm) ||
            (batch.lsx && batch.lsx.toLowerCase().includes(searchTerm))
    );
    console.log(filteredBatches);
    
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
    dom.productCode.value = data.productCode || "";
    dom.productName.value = data.productName || "";
    dom.bomDisplay.value = data.bomId || data.id || "";
    dom.specifications.value = data.specs || "";
    dom.plannedQuantity.value = data.quantity || "";
    dom.actualQuantity.value = data.quantity || "";
    dom.unit.value = data.unit || "";
    dom.warranty.value = data.warranty || "";
};
var handleFormSubmit = async (e) => {
    e.preventDefault();
    console.log(dom.productCode.value);
    
    const LotCode = await HOMEOSAPP.getTranNo("", 'GET', 'PRODUCT_LOT', dom.productCode.value);
    console.log(LotCode);
    
    const formData = {
        batchCode: LotCode,
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
        scannedData: {
            pallet_1: {
                carton_1: {}
            }
        },
        palletsPerContainer: 0,
        cartonsPerPallet: 0,
        layersPerCarton: 1,
        itemsPerLayer: 1,
    };
    const willInsertLot = {
        LOT_PRODUCT_CODE: LotCode,
        PRODUCTION_ORDER: dom.declarationTypeRadios[0].checked ? dom.productionOrderSelect.value : null,
        BOM_PRODUCT: dom.bomDisplay.value,
        QUANTITY_PLAN: parseInt(dom.plannedQuantity.value),
        QUANTITY_ACTUAL: parseInt(dom.actualQuantity.value),
        UNIT_ID: dom.unit.value,
        STATUS_ID: dom.status.value,
        PRICE_LOT_PRODUCT: 0,
        PRODUCT_IN_CLASS: 0,
        CLASS_IN_CARTON: 0,
        CARTON_IN_PALLET: 1,
        PALLET_IN_CONTAINER: 1,
        DESCRIPTION: "",
        PRODUCT_CODE: dom.productCode.value,
        DATE_CREATE: new Date(),
        USER_ID: 'khai.nt',
        UNIT_LOT_ID: dom.batchUnit.value,
        DATASTATE: 'ADD'
    }

    await HOMEOSAPP.add('PRODUCT_LOT', willInsertLot);

    console.log(formData);
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
    updateIdButtonStates(false);
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
};

var renderScannedData = (data) => {
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
                    // const parts = productCode.split(",");
                    `<details open><summary class="${indentClass}">Lớp ${layerKey.split("_")[1]
                    } (${items.length} SP)</summary>${items
                        .map(
                            (item) => {
                                const arrayItem = item.split(",");
                                return `<p class="item-code font-monospace small">${arrayItem[arrayItem.length - 1]}</p>`
                            }
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

function setButtonLoading(button, loadingText) {
  // Lưu text gốc vào dataset
  button.dataset.originalText = button.textContent.trim();

  // Đổi style + text
  button.classList.remove("btn-primary");
  button.classList.add("btn-warning");

  button.textContent = loadingText;
  button.classList.add("saving-dots");
}

function resetButton(button) {
  const originalText = button.dataset.originalText || "Lưu Thông Tin";

  button.classList.remove("btn-warning", "saving-dots");
  button.classList.add("btn-primary");

  button.textContent = originalText;
}

var handleSaveIdentities = async () => {

    if (dom.saveIdentitiesButton.disabled || !currentIdBatch) return;
    const btn = dom.saveIdentitiesButton;

    setButtonLoading(btn, "Đang lưu thông tin");
    const batchIndex = mockBatches.findIndex(
        (b) => b.batchCode === currentIdBatch.batchCode
    );
    if (batchIndex > -1) {
        const mainBatch = mockBatches[batchIndex];
        let dataLot = await HOMEOSAPP.getDM(
            HOMEOSAPP.linkbase,
            "PRODUCT_LOT",
            "LOT_PRODUCT_CODE='"+mainBatch.batchCode+"'"
        );

        let dataItemQRcodes = await HOMEOSAPP.getDM(
            HOMEOSAPP.linkbase,
            "DM_QRCODE",
            "1=1"
        );
        
        Object.values(dataDetailLot).forEach(pallet =>
            Object.values(pallet).forEach(carton =>
                Object.entries(carton).forEach(([layerKey, items]) => {
                    const layerNumber = parseInt(layerKey.split("_")[1], 10);

                    items.forEach(async item => {
                        // const dataItemQRcode = await HOMEOSAPP.getDM(
                        //     HOMEOSAPP.linkbase,
                        //     "DM_QRCODE",
                        //     "QR_CODE='" + item + "'"
                        // );
                        const dataItemQRcode = dataItemQRcodes.data.filter((batch) => batch.QR_CODE === item)
                        
                        console.log(dataLot.data[0].PR_KEY);
                        
                        if(dataItemQRcode.data[0].LOT_ID != dataLot.data[0].PR_KEY){
                            
                            const original = dataItemQRcode.data[0];
                            const willInsertData = {
                                ...original,
                                LOT_ID: dataLot.data[0].PR_KEY,
                                LOT_CLASS: layerNumber,
                                DATASTATE: 'EDIT'
                            }
                            console.log(willInsertData);
                            await HOMEOSAPP.add('DM_QRCODE', willInsertData);
                        }
                    });
                })
            )
        );
        const original = dataLot.data[0];
        const willInsertLot = {
            ...original,
            PRODUCT_IN_CLASS: dom.inputs.itemsPerLayer.value,
            CLASS_IN_CARTON: dom.inputs.layersPerCarton.value,
            CARTON_IN_PALLET: 1,
            PALLET_IN_CONTAINER: 1,
            DATASTATE: 'EDIT'
        }
        await HOMEOSAPP.add('PRODUCT_LOT', willInsertLot);


        toastr.success("Lưu thông tin thành công");
        
        // showToast(`Đã lưu thành công ${sessionScannedCount} mã định danh!`);
        resetButton(btn);
        
        setupProductIdScreen(mainBatch.batchCode); // Refresh the screen
        $("#back-to-list-from-details-button").click();
    } else {
        showToast("Lỗi: Không tìm thấy lô hàng để lưu.", "error");
    }
};

var updateIdButtonStates = (check) => {
    if (!check) {
        // dom.saveIdentitiesButton.disabled = true;
        return;
    } else {
        dom.saveIdentitiesButton.disabled = false;
    }
    
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

    dom.saveIdentitiesButton.addEventListener("click", handleSaveIdentities);

    Object.values(dom.inputs).forEach((input) =>
        input.addEventListener("input", handleDeclarationChange)
    );
};

// --- KHỞI TẠO BAN ĐẦU ---
var initializeApp = async () => {
    dataPR = await HOMEOSAPP.getApiServicePublic(
        HOMEOSAPP.linkbase,
        "GetDataDynamicWareHouse",
        "TYPE_QUERY='PRODUCT'"
    );
    HOMEOSAPP.delay(100);
    var dataLot = await HOMEOSAPP.getApiServicePublic(
        HOMEOSAPP.linkbase,
        "GetDataDynamicWareHouse",
        "TYPE_QUERY='LOT'"
    );

    const mockBatchesMulti = await mapProductionDataToBatches(dataLot);
    // mockBatches = mockBatchesMulti;
    // console.log(mockBatchesMulti);
    mockBatches = mockBatchesMulti
    console.log(dataPR);
    
    
    if (dataPR) {
        mapProducts(dataPR);
    }

    deleteModal = new bootstrap.Modal(dom.deleteModalEl);
    // idScanModal = new bootstrap.Modal(dom.idScanModalEl);
    appToast = new bootstrap.Toast(dom.toastEl);
    addEventListeners();
    renderBatches(mockBatches);
};

var mockProducts = [];
initializeApp();

// 
 // Giả lập người dùng đăng nhập

var mockBatches_2 = [];

var mockHistory = {
    // 101: [
    //     {
    //         type: "import",
    //         quantity: 60,
    //         reason: "Nhập hàng đầu kỳ",
    //         date: "01/09/2025",
    //     },
    //     { type: "export", quantity: 2, reason: "Bán lẻ", date: "05/09/2025" },
    // ],
    // 102: [
    //     {
    //         type: "import",
    //         quantity: 20,
    //         reason: "Nhập hàng đầu kỳ",
    //         date: "01/09/2025",
    //     },
    //     { type: "export", quantity: 5, reason: "Bán sỉ", date: "06/09/2025" },
    // ],
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
    if (quantity <= 10)
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
    console.log(searchTerm);

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
            (item) => item.totalQuantity > 0 && item.totalQuantity <= 10
        );
    else if (currentFilter === "out_of_stock")
        filteredInventory = filteredInventory.filter(
            (item) => item.totalQuantity <= 0
        );

    if (filteredInventory.length === 0) {
        inventoryListEl.innerHTML = `<div class="text-center py-5"><p class="text-muted">Không tìm thấy sản phẩm nào.</p></div>`;
        return;
    }
    inventoryListEl.innerHTML = filteredInventory.map((item) => {
        const stock = getStockInfo(item.totalQuantity);
        return `<div data-id="${item.id}" class="product-card bg-body p-3 rounded-3 shadow-sm border-0 d-flex align-items-start gap-3">
            <img src="${item.imageUrl.replace("400x300", "160x160")}" alt="${item.name}" class="rounded border" style="width: 64px; height: 64px; object-fit: cover;">
            <div class="flex-grow-1">
                <p class=" text-body-emphasis mb-1" style="text-align: start;">${item.name}</p>
                <p class="text-muted small font-monospace mb-2" style="text-align: start;">${item.sku}</p>
                <div class="d-flex justify-content-between align-items-center">
                    <span class="badge ${stock.bg} ${stock.text_color} rounded-pill" style="font-weight: 300;">${stock.text}</span>
                    <div>
                        <span class="small text-muted">Tổng tồn:</span> 
                        <span class=" fs-5 text-${stock.color}">${item.totalQuantity}</span>
                    </div>
                </div>
            </div>
        </div>`;
    }).join("");
};

function mapProducts(realProducts) {
    realProducts.map((p) => {
        // Ưu tiên PRODUCT_IMG, nếu không có thì lấy ảnh đầu tiên trong PRODUCT_IMG_SLIDE
        let imageUrl = p.PRODUCT_IMG;
        if (!imageUrl && p.PRODUCT_IMG_SLIDE) {
            imageUrl = p.PRODUCT_IMG_SLIDE.split(",")[0]; // lấy ảnh đầu tiên
        }
        if (!imageUrl) {
            imageUrl = "https://placehold.co/400x300/e2e8f0/334155?text=No+Image";
        }

        mockProducts.push({
            id: p.PRODUCT_CODE,
            name: p.PRODUCT_NAME,
            sku: p.PRODUCT_CODE,
            imageUrl: imageUrl,
        });
        mockBatches_2.push({
            batchId: p.BATCH_ID,
            productId: p.PRODUCT_CODE,
            batchCode: "",
            quantity: p.QUANTITY,
            unit: p.UNIT_NAME,
            location: p.WAREHOUSE_NAME,
            supplier: "HomeOS",
            lastUpdated: HOMEOSAPP.formatDateTime(p.UPDATED_DATE),
            pricePerItem: 0,
            description: ""
        })
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
searchInputEl.addEventListener("input", renderInventory);
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

[importViewElements.quantity, importViewElements.priceTotal].forEach((el) => {
    el.addEventListener("input", () => {
        const quantity = parseInt(importViewElements.quantity.value) || 0;
        const price = parseFloat(importViewElements.priceTotal.value) || 0;
        importViewElements.priceItem.value =
            (price / quantity).toLocaleString("vi-VN") + " VNĐ";
    });
});

document.getElementById("save-import-btn").addEventListener("click", () => {
    const productId = importViewElements.select.value;
    const batchCode = importViewElements.batchCode.value.trim();
    const quantity = parseInt(importViewElements.quantity.value);
    const unit = importViewElements.unit.value.trim();
    const reason = importViewElements.reason.value;
    const location = importViewElements.location.value.trim();
    const pricePerItem = parseFloat(importViewElements.priceItem.value.replace(/[^\d,.-]/g, "").replace(/\./g, "").replace(",", "."));
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

    console.log(newBatch);
    addAndEditImportExport("IMPORT", 'ADD', 'SP', newBatch);

    if (!mockHistory[newBatch.batchId]) mockHistory[newBatch.batchId] = [];
    mockHistory[newBatch.batchId].push({
        type: "import",
        quantity,
        reason,
        date: newBatch.lastUpdated,
    });

    toastr.success(`Nhập kho thành công!`);
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
    // const dataMaterials = await HOMEOSAPP.getApiServicePublic(
    //     HOMEOSAPP.linkbase,
    //     "GetDataDynamicWareHouse",
    //     "TYPE_QUERY='WAREHOUSE'"
    // );
    
    console.log(dataMaterial);
    if (dataMaterial) {
        processInventoryData(dataMaterial);
    }
    const login = JSON.parse(localStorage.getItem("dataLogin")) || [];
    const mt_currentUser = login.username;

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
        selectPropose: document.getElementById("mt-importPropose-material-select"),
        batchCode: document.getElementById("mt-import-batch-code"),
        quantity: document.getElementById("mt-import-quantity"),
        unit: document.getElementById("mt-import-unit"),
        reason: document.getElementById("mt-import-reason-select"),
        location: document.getElementById("mt-import-location"),
        priceItem: document.getElementById("mt-import-price-item"),
        priceTotal: document.getElementById("mt-import-price-total"),
        description: document.getElementById("mt-import-description"),
        listMaterial: document.getElementById("mt-addedMaterialsList"),
        // import theo phiếu
        batchCodeP: document.getElementById("mt-importPropose-batch-code"),
        descriptionP: document.getElementById("mt-importPropose-description"),
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
        // export theo phiếu
        batchSelectP: document.getElementById("mt-exportP-batch-select"),
        exporterP: document.getElementById("mt-exportP-exporter"),
        receiverP: document.getElementById("mt-exportP-receiver"),
    };

    const mt_toastEl = document.getElementById("mt-liveToast");
    const mt_toastBody = document.getElementById("mt-toast-body");
    const mt_toast = new bootstrap.Toast(mt_toastEl);

    const radioButtons = document.querySelectorAll('input[name="Material_type"]');
            
    // Lấy các tab panes
    const proposeTab = document.getElementById('propose-selector-container');
    const detailTab = document.getElementById('detail-selector-container');

    // Hàm để chuyển đổi tab
    function switchTab(event) {
        if (event.target.id === 'type_detail') {
            proposeTab.classList.add('d-none');
            detailTab.classList.remove('d-none');
        } else if (event.target.id === 'type_propose') {
            detailTab.classList.add('d-none');
            proposeTab.classList.remove('d-none');
        }
    }

    const radioExButtons = document.querySelectorAll('input[name="Material_ex_type"]');
            
    // Lấy các tab panes
    const proposeTabEx = document.getElementById('propose-ex-selector-container');
    const detailTabEx = document.getElementById('detail-ex-selector-container');

    // Hàm để chuyển đổi tab
    function switchTabex(event) {
        if (event.target.id === 'type_ex_detail') {
            proposeTabEx.classList.add('d-none');
            detailTabEx.classList.remove('d-none');
        } else if (event.target.id === 'type_ex_propose') {
            detailTabEx.classList.add('d-none');
            proposeTabEx.classList.remove('d-none');
        }
    }

    // Gắn sự kiện 'change' cho mỗi radio button
    radioButtons.forEach(radio => {
        radio.addEventListener('change', switchTab);
    });

    radioExButtons.forEach(radio => {
        radio.addEventListener('change', switchTabex);
    });

    const mt_navigate = (view) => {
        mt_appContainer.dataset.view = view;
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
                materialId = item.ITEM_ID; // Tạo ID mới tăng dần
                materialMap.set(item.ITEM_ID, materialId);

                const newMaterial = {
                    id: item.ITEM_ID,
                    name: item.ITEM_NAME,
                    sku: item.ITEM_ID,
                    // Tạo ảnh placeholder động với tên vật tư
                    // imageUrl: ""
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
        // selectEl.innerHTML = '<option value="">-- Chọn vật tư --</option>';
        // mt_mockMaterials.forEach((material) => {
        //     selectEl.innerHTML += `<option value="${material.id}">${material.name} (${material.sku})</option>`;
        // });
        // $(selectEl).select2({
        //     placeholder: "-- Chọn vật tư --",
        //     allowClear: true,
        //     width: "100%" // cho full width
        // });

        const materials = mt_mockMaterials.map(m => ({
            id: m.id,
            text: `${m.name} (${m.sku})`
        }));
        $(selectEl).select2({
            placeholder: "-- Chọn vật tư --",
            data: materials,
            width: "100%",
            allowClear: true,
        });
        $(selectEl).val(null).trigger('change');
    };
    const mt_populateProposeForSelect = (selectEl) => {
        // selectEl.innerHTML = '<option value="">-- Chọn phiếu --</option>';
        // dataPropose.forEach((propose) => {
        //     selectEl.innerHTML += `<option value="${propose.TRAN_NO}">${propose.TRAN_NO}</option>`;
        // });
        const materials = dataPropose.map(m => ({
            id: m.TRAN_NO,
            text: `${m.TRAN_NO}`
        }));
        $(selectEl).select2({
            placeholder: "-- Chọn phiếu --",
            data: materials,
            width: "100%",
            allowClear: true,
        });
        $(selectEl).val(null).trigger('change');
        $(selectEl).on('change', function () {
            const selectedValue = $(this).val();
            const selectedText = $(this).find('option:selected').text();
            const selectId = this.id;
            mt_renderMaterialProposeList(selectedValue, selectId);
        });
    };

    const mt_showMaterialImportView = () => {
        mt_populateMaterialsForSelect(mt_importViewElements.select);
        mt_populateProposeForSelect(mt_importViewElements.selectPropose);
        Object.values(mt_importViewElements).forEach((el) => {
            if (el.tagName !== "SELECT") el.value = "";
        });
        mt_importViewElements.priceTotal.value = "0 VNĐ";
        mt_navigate("mt-import");
    };

    const mt_showMaterialExportView = () => {
        // mt_exportViewElements.batchSelect.innerHTML =
        //     '<option value="">-- Chọn vật tư --</option>';
        // const groupedBatches = mt_mockMaterials
        //     .map((material) => ({
        //         materialName: material.name,
        //         batches: mt_mockBatches.filter(
        //             (b) => b.materialId === material.id && b.quantity > 0
        //         ),
        //     }))
        //     .filter((group) => group.batches.length > 0);

        // groupedBatches.forEach((group) => {
        //     const optgroup = document.createElement("optgroup");
        //     optgroup.label = group.materialName;
        //     group.batches.forEach((b) => {
        //         const option = document.createElement("option");
        //         option.value = b.batchId;
        //         option.textContent = `Mã lô: ${b.batchCode} (Tồn: ${b.quantity} ${b.unit})`;
        //         optgroup.appendChild(option);
        //     });
        //     mt_exportViewElements.batchSelect.appendChild(optgroup);
        // });
        mt_populateMaterialsForSelect(mt_exportViewElements.batchSelect);
        mt_populateProposeForSelect(mt_exportViewElements.batchSelectP);

        Object.values(mt_exportViewElements).forEach((el) => {
            if (el.tagName !== "SELECT") el.value = "";
        });

        mt_exportViewElements.exporter.value = mt_currentUser;
        mt_exportViewElements.exporterP.value = mt_currentUser;
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
    
    const mt_renderMaterialProposeList = (value, id) => {
        const selectedValue = value;
        const datafilter = dataPropose.filter((group) => group.TRAN_NO == selectedValue);
        
        let textID = '';
        if( id == 'mt-exportP-batch-select'){
            textID = 'mt-addedMaterialsListEx';
        } else {
            textID = 'mt-addedMaterialsList';
        }

        const materialsContent = $('#'+ textID);
        materialsContent.empty();
        if(datafilter.length == 0) return;

        if (datafilter[0].ITEMS.length > 0) {
            datafilter[0].ITEMS.forEach((mat, index) => {
                console.log(mat);
                
                materialsContent.append(
                    `<div class="card material-card mb-2">
                    <div class="card-header d-flex justify-content-between align-items-center material-toggle" 
                        data-bs-toggle="collapse" 
                        data-bs-target="#material-${index}" 
                        aria-expanded="false" 
                        aria-controls="material-${index}" style="font-size: 14px; height: 60px;">
                        
                        <span><strong style="font-size: 14px;" >${mat.ITEM_NAME}</strong></span>
                        
                        <span class="caret-icon" id="caret-${index}" style="transition: transform 0.2s ease;">
                            <i class="fas fa-chevron-down"></i>
                        </span>
                    </div>

                    <div id="material-${index}" class="collapse" style="border-top: 1px #535353 solid; ">
                        <div class="card-body">
                            <div class="d-flex justify-content-between" style="padding-bottom: 15px;">
                                <div>
                                    <strong style="font-weight: 500; color: #a9a8a8;">SL còn (kho):</strong>
                                </div>
                                <div>
                                    <span class="badge bg-success" style="font-size: 15px;">${mat.ITEM_QUANTITY}</span>
                                </div>
                            </div>
                            <div class="d-flex justify-content-between" style="padding-bottom: 15px;">
                                <strong style="font-weight: 500; color: #a9a8a8;">SL theo BOM:</strong> 
                                <span>${mat.QUANTITY_BOM || 0}</span>
                            </div>
                            
                            <div class="row mb-2">
                                <div class="col">
                                    <label class="form-label" style="color: #a9a8a8;">Bù hao (%)</label>
                                    <input type="number" class="form-control input-cmt" 
                                        value="${mat.QUANTITY_ADDING}" data-index="${index}" min="0" disabled>
                                </div>
                                <div class="col">
                                    <label class="form-label" style="color: #a9a8a8;">SL sản xuất</label>
                                    <input type="number" class="form-control input-produce" 
                                        value="${ mat.QUANTITY_REQUIRE || 0}" data-index="${index}" min="0" disabled>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`
                );
            });
        } else {
            materialsContent.html(
                '<li class="list-group-item text-muted">Không có vật tư cho lệnh này.</li>'
            );
        }
    }

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
    // mt_showMaterialHistoryView()
    // mt_showMaterialImportView();
    // mt_showMaterialExportView();
    document
        .getElementById("mt-view-history-btn")
        .addEventListener("click", mt_showMaterialHistoryView);
    document
        .getElementById("mt-show-import-view-btn")
        .addEventListener("click", mt_showMaterialImportView);
    document
        .getElementById("mt-show-export-view-btn")
        .addEventListener("click", mt_showMaterialExportView);

    [mt_importViewElements.quantity, mt_importViewElements.priceTotal].forEach(
        (el) => {
            el.addEventListener("input", () => {
                const quantity = parseInt(mt_importViewElements.quantity.value) || 0;
                const price = parseFloat(mt_importViewElements.priceTotal.value) || 0;
                mt_importViewElements.priceItem.value = (price / quantity).toLocaleString("vi-VN") + " VNĐ";
            });
        }
    );

    document
        .getElementById("mt-save-import-btn")
        .addEventListener("click", () => {
            const materialId = mt_importViewElements.select.value;
            const batchCode = mt_importViewElements.batchCode.value.trim();
            const quantity = parseInt(mt_importViewElements.quantity.value);
            const unit = mt_importViewElements.unit.value.trim();
            const reason = mt_importViewElements.reason.value;
            const location = mt_importViewElements.location.value.trim();
            const pricePerItem = parseFloat(mt_importViewElements.priceItem.value.replace(/[^\d,.-]/g, "").replace(/\./g, "").replace(",", "."));
            const description = mt_importViewElements.description.value.trim();
            console.log(materialId);
            if(radioButtons[0].checked == true){
                const batchId = mt_importViewElements.selectPropose.value;
                const tranNoRef = mt_importViewElements.batchCodeP.value;
                const desc = mt_importViewElements.descriptionP.value;

                const batch = dataPropose.find((b) => b.TRAN_NO === batchId);
                let addData = {
                    ...batch,
                    TRAN_NO_REF: tranNoRef,
                    COMMENT: desc
                }
                console.log(batchId, addData);
                
                addImportExportP("IMPORT", 'VT', addData);
                toastr.success(`Nhập kho thành công cho phiếu ${batchId}!`);
            } else {
                if (
                    !materialId ||
                    !batchCode ||
                    !quantity ||
                    !unit ||
                    !location ||
                    !pricePerItem
                ) {
                    toastr.error("Vui lòng điền đầy đủ thông tin.");
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
                addAndEditImportExport("IMPORT", 'ADD', 'VT', newBatch);
                mt_mockBatches.push(newBatch);

                if (!mt_mockHistory[newBatch.batchId])
                    mt_mockHistory[newBatch.batchId] = [];
                mt_mockHistory[newBatch.batchId].push({
                    type: "import",
                    quantity,
                    reason,
                    date: newBatch.lastUpdated,
                });
                toastr.success(`Nhập kho thành công!`);
            }
            
            
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
            const quantity = parseInt(mt_exportViewElements.quantity.value);
            const price = parseFloat(mt_exportViewElements.price.value);
            const exporter = mt_exportViewElements.exporter.value.trim();
            const receiver = mt_exportViewElements.receiver.value.trim();
            const form = mt_exportViewElements.formSelect.value;
            const reason = mt_exportViewElements.reason.value.trim();
            const description = mt_exportViewElements.description.value.trim();

            if(radioExButtons[0].checked == true){
                const batchId = mt_exportViewElements.batchSelectP.value;

                const batch = dataPropose.find((b) => b.TRAN_NO === batchId);

                console.log(batchId, batch);
                
                addImportExportP("EXPORT", 'VT', batch);
                toastr.success(`Xuất kho thành công cho phiếu ${batchId}!`);
            } else {
                const batchId = mt_exportViewElements.batchSelect.value;
                if (
                    !batchId ||
                    quantity <= 0 ||
                    !receiver
                ) {
                    // mt_showToast("Vui lòng điền đầy đủ các trường bắt buộc.", "error");
                    console.log("Lỗi");
                    
                    return;
                }

                
                
                const batch = mt_mockBatches.find((b) => b.materialId === batchId);

                console.log(batch);
                const pricePerItem = price;
                const newBatch = {
                    ...batch,
                    quantity,
                    pricePerItem,
                    exporter,
                    receiver,
                    description
                };

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
                console.log(newBatch);
                

                addAndEditImportExport("EXPORT", 'ADD', 'VT', newBatch);

                toastr.success(`Xuất kho thành công!`);
            }
            
            
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
    if(dataMaterial){
        const resultArray = [];
        dataMaterial.forEach(item => {
            resultArray.push({ id: item.ITEM_ID, text: item.ITEM_NAME, quantity: item.QUANTITY });
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
        const searchValue = $("#po-search-input").val()?.trim().toLowerCase() || "";

        // Lọc danh sách theo từ khóa nhập
        const filteredOrders = productionOrders.filter((order) => {
            const id = order.id?.toLowerCase() || "";
            const product = order.product?.toLowerCase() || "";
            const status = order.status?.toLowerCase() || "";
            return (
                id.includes(searchValue) ||
                product.includes(searchValue) ||
                status.includes(searchValue)
            );
        });
        console.log(filteredOrders);
        
        listEl.empty();
        if (filteredOrders.length === 0) {
            listEl.html(
                '<p class="text-center text-muted">Chưa có lệnh sản xuất nào.</p>'
            );
            return;
        }
        // Sắp xếp lại danh sách để đưa item mới lên đầu
        const sortedOrders = [...filteredOrders].sort(
            (a, b) =>
                b.startDate.localeCompare(a.startDate) || b.id.localeCompare(a.id)
        );
        
        sortedOrders.forEach((order) => {
            const statusInfo = getStatusInfo(order.status);
            const orderHtml = `<div class="list-item-wrapper"><div class="list-item-actions"><button class="action-button action-edit" data-id="${order.id}"><i class="fas fa-pen"></i>Sửa</button><button class="action-button action-delete" data-id="${order.id}"><i class="fas fa-trash"></i>Xoá</button></div><div class="list-item-content" data-id="${order.id}"><div class="d-flex w-100 justify-content-between"><h5 class="mb-1 font-weight-bold" style="color: var(--accent-color-light);">${order.id}</h5><small class="text-muted">${HOMEOSAPP.formatDateTime(order.startDate)}</small></div><p class="mb-1">${order.product} - SL: ${order.quantity}</p><small><span class="status-badge ${statusInfo.class}">${statusInfo.text}</span></small></div></div>`;
            listEl.append(orderHtml);
        });
    }
    function renderOrderDetail(orderId) {
        const order = productionOrders.find((o) => o.id === orderId);
        if (!order) return;
        $container.find("#po-detailOrderId").text(order.id);
        const infoContent = `<p><strong>Sản phẩm:</strong> ${order.product
            }</p><p><strong>Số lượng:</strong> ${order.quantity
            }</p><p><strong>Ngày bắt đầu:</strong> ${HOMEOSAPP.formatDateTime(order.startDate) 
            }</p><p><strong>Trạng thái:</strong> <span class="status-badge ${getStatusInfo(order.status).class
            }">${getStatusInfo(order.status).text}</span></p>`;
        $container.find("#po-detailInfoContent").html(infoContent);
        const materialsContent = $container.find("#po-detailMaterialsContent");
        materialsContent.empty();
        if (order.materials.length > 0) {
            order.materials.forEach((mat, index) => {
                console.log(mat);
                
                materialsContent.append(
                    `<div class="card material-card mb-2">
                    <div class="card-header d-flex justify-content-between align-items-center material-toggle" 
                        data-bs-toggle="collapse" 
                        data-bs-target="#material-${index}" 
                        aria-expanded="false" 
                        aria-controls="material-${index}" style="font-size: 14px; height: 60px;">
                        
                        <span><strong style="font-size: 14px;" >${mat.name}</strong></span>
                        
                        <span class="caret-icon" id="caret-${index}" style="transition: transform 0.2s ease;">
                            <i class="fas fa-chevron-down"></i>
                        </span>
                    </div>

                    <div id="material-${index}" class="collapse" style="border-top: 1px #535353 solid; ">
                        <div class="card-body">
                            <div class="d-flex justify-content-between" style="padding-bottom: 15px;">
                                <div>
                                    <strong style="font-weight: 500; color: #a9a8a8;">SL còn (kho):</strong>
                                </div>
                                <div>
                                    <span class="badge bg-success" style="font-size: 15px;">${mat.atu_qty}</span>
                                </div>
                            </div>
                            <div class="d-flex justify-content-between" style="padding-bottom: 15px;">
                                <strong style="font-weight: 500; color: #a9a8a8;">SL theo BOM:</strong> 
                                <span>${mat.qty || 0}</span>
                            </div>
                            
                            <div class="row mb-2">
                                <div class="col">
                                    <label class="form-label" style="color: #a9a8a8;">Bù hao (%)</label>
                                    <input type="number" class="form-control input-cmt" 
                                        value="${mat.cmt}" data-index="${index}" min="0" disabled>
                                </div>
                                <div class="col">
                                    <label class="form-label" style="color: #a9a8a8;">SL sản xuất</label>
                                    <input type="number" class="form-control input-produce" 
                                        value="${ Math.ceil(mat.qty * order.quantity) || 0}" data-index="${index}" min="0" disabled>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`
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
            const materialHtml = `
                <div class="card material-card mb-2">
                    <div class="card-header d-flex justify-content-between align-items-center material-toggle" 
                        data-bs-toggle="collapse" 
                        data-bs-target="#material-${index}" 
                        aria-expanded="false" 
                        aria-controls="material-${index}" style="font-size: 14px; height: 60px;">
                        
                        <span><strong style="font-size: 14px;" >${mat.name}</strong></span>
                        
                        <span class="caret-icon" id="caret-${index}" style="transition: transform 0.2s ease;">
                            <i class="fas fa-chevron-down"></i>
                        </span>
                    </div>

                    <div id="material-${index}" class="collapse" style="border-top: 1px #535353 solid; ">
                        <div class="card-body">
                            <div class="d-flex justify-content-between" style="padding-bottom: 15px;">
                                <div>
                                    <strong style="font-weight: 500; color: #a9a8a8;">SL còn (kho):</strong>
                                </div>
                                <div>
                                    <span class="badge bg-success" style="font-size: 15px;">${mat.atu_qty}</span>
                                </div>
                            </div>
                            <div class="d-flex justify-content-between" style="padding-bottom: 15px;">
                                <strong style="font-weight: 500; color: #a9a8a8;">SL theo BOM::</strong> 
                                <span>${mat.qty || 0}</span>
                            </div>
                            
                            <div class="row mb-2">
                                <div class="col">
                                    <label class="form-label" style="color: #a9a8a8;">Bù hao (%)</label>
                                    <input type="number" class="form-control input-cmt" 
                                        value="${mat.cmt}" data-index="${index}" min="0">
                                </div>
                                <div class="col">
                                    <label class="form-label" style="color: #a9a8a8;">SL sản xuất</label>
                                    <input type="number" class="form-control input-produce" 
                                        value="${Math.ceil(mat.qty * newOrderData.info.quantity) || 0}" data-index="${index}" min="0" disabled>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            listEl.append(materialHtml);
        });
        newOrderData.materials.forEach((mat, index) => {
            const collapseEl = document.getElementById(`material-${index}`);
            const caretEl = document.getElementById(`caret-${index}`).querySelector("i");

            collapseEl.addEventListener('show.bs.collapse', () => {
                caretEl.classList.remove("fa-chevron-down");
                caretEl.classList.add("fa-chevron-up");
            });

            collapseEl.addEventListener('hide.bs.collapse', () => {
                caretEl.classList.remove("fa-chevron-up");
                caretEl.classList.add("fa-chevron-down");
            });
        });
        listEl.on('change', '.input-cmt', function() {
            
            const index = $(this).data('index');
            // Dùng parseInt để đảm bảo giá trị là một con số
            const newValue = parseInt($(this).val(), 10) || 0; 

            const quantity = newOrderData.info.quantity
            const need_qty = (quantity * newOrderData.materials[index].qty) + (quantity * newOrderData.materials[index].qty) * (newValue / 100);
            
            $(`.input-produce[data-index="${index}"]`).val(Math.ceil(need_qty));
            console.log(need_qty);

            // Cập nhật lại giá trị trong mảng dữ liệu gốc
            newOrderData.materials[index].cmt = newValue;
            newOrderData.materials[index].need_qty = Math.ceil(need_qty);
            
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
        // <button class="btn btn-sm btn-danger btn-delete-material" data-index="${index}">
        //                     <i class="fas fa-trash"></i>
        //                 </button>
        newOrderData.materials.forEach((mat, index) => {
            const quantity = newOrderData.info.quantity
            const need_qty = (quantity * mat.qty) + (quantity * mat.qty) * (mat.cmt / 100);
            const materialHtml = `
                <div class="card material-card mb-2">
                    <div class="card-header d-flex justify-content-between align-items-center material-toggle" 
                        data-bs-toggle="collapse" 
                        data-bs-target="#material-${index}" 
                        aria-expanded="false" 
                        aria-controls="material-${index}" style="font-size: 14px; height: 60px;">
                        
                        <span><strong style="font-size: 14px;" >${mat.name}</strong></span>
                        
                        <span class="caret-icon" id="caret-${index}" style="transition: transform 0.2s ease;">
                            <i class="fas fa-chevron-down"></i>
                        </span>
                    </div>

                    <div id="material-${index}" class="collapse" style="border-top: 1px #535353 solid; ">
                        <div class="card-body">
                            <div class="d-flex justify-content-between" style="padding-bottom: 15px;">
                                <div>
                                    <strong style="font-weight: 500; color: #a9a8a8;">SL còn (kho):</strong>
                                </div>
                                <div>
                                    <span class="badge bg-success" style="font-size: 15px;">${mat.atu_qty}</span>
                                </div>
                            </div>
                            <div class="d-flex justify-content-between" style="padding-bottom: 15px;">
                                <strong style="font-weight: 500; color: #a9a8a8;">SL theo BOM:</strong> 
                                <span>${mat.qty || 0}</span>
                            </div>
                            
                            <div class="row mb-2">
                                <div class="col">
                                    <label class="form-label" style="color: #a9a8a8;">Bù hao (%)</label>
                                    <input type="number" class="form-control input-cmt" 
                                        value="${mat.cmt}" data-index="${index}" min="0">
                                </div>
                                <div class="col">
                                    <label class="form-label" style="color: #a9a8a8;">SL sản xuất</label>
                                    <input  type="number" class="form-control input-produce" 
                                        value="${ Math.ceil(need_qty) || 0}" data-index="${index}" min="0" disabled>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            listEl.append(materialHtml);
        });
        console.log(newOrderData);
        
        newOrderData.materials.forEach((mat, index) => {
            const collapseEl = document.getElementById(`material-${index}`);
            const caretEl = document.getElementById(`caret-${index}`).querySelector("i");

            collapseEl.addEventListener('show.bs.collapse', () => {
                caretEl.classList.remove("fa-chevron-down");
                caretEl.classList.add("fa-chevron-up");
            });

            collapseEl.addEventListener('hide.bs.collapse', () => {
                caretEl.classList.remove("fa-chevron-up");
                caretEl.classList.add("fa-chevron-down");
            });
        });
        listEl.on('change', '.input-cmt', function() {
            const index = $(this).data('index');
            // Dùng parseInt để đảm bảo giá trị là một con số
            const newValue = parseInt($(this).val(), 10) || 0; 

            const quantity = newOrderData.info.quantity
            const need_qty = (quantity * newOrderData.materials[index].qty) + (quantity * newOrderData.materials[index].qty) * (newValue / 100);

            $(`.input-produce[data-index="${index}"]`).val(Math.ceil(need_qty));

            console.log(newOrderData.materials[index].qty, need_qty);

            // Cập nhật lại giá trị trong mảng dữ liệu gốc
            newOrderData.materials[index].cmt = newValue;
            newOrderData.materials[index].need_qty = Math.ceil(need_qty);

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
        console.log(order);
        
        newOrderData.info = {
            id: order.id,
            product: order.product,
            id_product: order.product,
            bom_product: order.product,
            quantity: order.quantity,
            startDate: order.startDate,
            status: order.status,
        };
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
                HOMEOSAPP.linkbase,
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
            // HOMEOSAPP.updateTranNo("PO_INFORMATION_MASTER");
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
                    QUANTITY_NEEDED: material.need_qty, 
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
    $container.on("input", "#po-search-input", async function (e) {
        renderOrderList();
    })
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
                cmt: e.cmt,
                atu_qty: e.atu_qty
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
        renderOrderList();
        navigateTo("#po-listView");
        toastr.success("Đã lưu lệnh sản xuất thành công!");
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
        )
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
    let techDocs = [];

    if(dataMaterial){
        const resultArray = [];
        dataMaterial.forEach(item => {
            resultArray.push({ id: item.ITEM_ID, text: item.ITEM_NAME });
        });
        materialsMasterList = resultArray;;
    }
    if(dataEmployee){
        populateEmployeeSelects(dataEmployee);
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
        ` + dataPR.map(product => {
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

                    const dataProduct = await HOMEOSAPP.getDM(
                        HOMEOSAPP.linkbase,
                        "PRODUCT_PUBLISH",
                        "PRODUCT_ID='"+selectedValue+"'"
                    );
                    
                    if(dataProduct.data.length > 0){
                        $container.find("#editBomVersion").val(selectedValue+"_v"+ String(dataProduct.data.length+1).padStart(2, '0'));
                    } else {
                        $container.find("#editBomVersion").val(selectedValue+"_v01");
                    }
                    
                    
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
        const searchValue = $("#bom-search-input").val()?.trim().toLowerCase() || "";
        
        // Lọc danh sách theo từ khóa nhập
        const filteredOrders = productBOMs.filter((bom) => {
            const id = bom.id?.toLowerCase() || "";
            const product = bom.name?.toLowerCase() || "";
            const status = bom.version?.toLowerCase() || "";
            return (
                id.includes(searchValue) ||
                product.includes(searchValue) ||
                status.includes(searchValue)
            );
        });
        console.log(filteredOrders);
        
        listEl.empty();
        if (filteredOrders.length === 0) {
            listEl.html('<p class="text-center text-muted p-3">Chưa có BOM nào.</p>');
            return;
        }
        filteredOrders.forEach((bom) => {
            const bomHtml = `<div class="list-item-wrapper"><div class="list-item-actions"><button class="action-button action-edit" data-id="${bom.id}"><i class="fas fa-pen"></i>Sửa</button><button class="action-button action-delete" data-id="${bom.id}"><i class="fas fa-trash"></i>Xoá</button></div><div class="list-item-content" data-id="${bom.id}"><div class="d-flex w-100 justify-content-between"><h6 class="mb-1 font-weight-bold" style="color: var(--accent-color-light);">${bom.shortDesc}</h6><span class="bom-version-badge">${HOMEOSAPP.formatDateTime(bom.date, "YYYY-MM-DD")}</span></div><p class="mb-1 small text-secondary">${bom.productNameText}</p></div></div>`;
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
    function renderTechDocDetails(docs) {
        const listEl = document.getElementById('tech-doc-detail-list');
        listEl.innerHTML = ""; // Xóa nội dung cũ trước khi render

        docs.forEach(doc => {
            // Lấy tên file từ link
            const fileName = doc.LINK_DOCUMENT.split('/').pop();

            // Xác định icon
            let iconClass = "bi bi-file-earmark";
            const lowerName = fileName.toLowerCase();
            if (lowerName.endsWith(".pdf")) {
                iconClass = "bi bi-file-earmark-pdf";
            } else if (lowerName.endsWith(".zip")) {
                iconClass = "bi bi-file-earmark-zip";
            } else if (lowerName.match(/\.(jpg|jpeg|png|gif)$/)) {
                iconClass = "bi bi-file-earmark-image";
            }

            // Tạo thẻ li
            const li = document.createElement("li");
            li.className = "list-group-item d-flex justify-content-between align-items-center py-1";
            li.style.height = "40px";
            li.innerHTML = `
                <span class="small text-truncate" title="${fileName}">
                    <i class="${iconClass} me-2"></i>
                    <a href="${doc.LINK_DOCUMENT}" target="_blank" class="text-decoration-none">${fileName}</a>
                </span>
                <small class="text-muted">${new Date(doc.VALID_DATE).toLocaleDateString()}</small>
            `;

            listEl.appendChild(li);
        });
    }

    async function renderBOMDetail(bomId) {
        
        const bom = productBOMs.find((b) => b.id === bomId);
        if (!bom) return;
        console.log(bom);
        const dataDoc = await HOMEOSAPP.getDM(
            HOMEOSAPP.linkbase,
            "PRODUCT_PUBLISH_DOCUMENT",
            "FR_KEY='"+bom.prKey+"'"
        );
        console.log(dataDoc.data);
        renderTechDocDetails(dataDoc.data);
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
            HOMEOSAPP.linkbase,
            "SYS_KEY",
            "TABLE_NAME='PRODUCT_PUBLISH'"
        );
        
        const willInsertData = {
            TRAN_NO: await HOMEOSAPP.getTranNo("", 'GET', 'PRODUCT_PUBLISH'), 
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
            TYPE_VERSION: dataBom.version,
            IS_MODULE: 1,
            NOTE: dataBom.shortDesc,
            USER_ID: dataBom.designer,
            CUSTOMER_ID: dataBom.sampleRequester,
            BOM_PRODUCT: dataBom.productName+"_"+dataBom.version,
            DATASTATE: type,
        };
        
        // const willInsertDataVersion = {
        //     FR_KEY: dataPR_key.data[0].LAST_NUM,
        //     TRAN_DATE: new Date(),
        //     VERSION: dataBom.version,
        //     NOTE: dataBom.noteVersion,
        //     USER_ID: dataBom.designer,
        //     DATASTATE: type,
        // };

        HOMEOSAPP.add('PRODUCT_PUBLISH', willInsertData).then(async data => {
            try {
                toastr.success("Lưu thông tin BOM thành công!");
                
            } catch (e) { }
        }).catch(err => {
            console.error('Error:', err);
        });
        // HOMEOSAPP.add('PRODUCT_PUBLISH_VERSION', willInsertDataVersion).then(async data => {
        //     try {
        //     } catch (e) { }
        // }).catch(err => {
        //     console.error('Error:', err);
        // });
        console.log(dataBom);
        
        dataBom.materials.forEach(e => {
            const dataItem = dataMaterial.filter(item => item.ITEM_ID === e.id);
            const willInsertData_detail = {
                FR_KEY: dataPR_key.data[0].LAST_NUM,
                ITEM_ID: e.id,
                // UNIT_ID: dataItem[0].UNIT_ID,
                UNIT_ID: "DVT007",
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
                } catch (e) {}
            }).catch(err => {
                console.error('Error:', err);
            });
            HOMEOSAPP.delay(200);
        });
        if(techDocs.length != 0){
            const resource = await uploadFile("ZaloMiniApp/Warehouse/file/", techDocs);
            resource.forEach((e, index) => {
                const willInsertData_detail = {
                    FR_KEY: dataPR_key.data[0].LAST_NUM,
                    PRODUCT_DOCUMENT_NAME: "",
                    TYPE_DOCUMENT: "FILE",
                    USER_ID: dataBom.designer,
                    VALID_DATE: new Date(),
                    LINK_DOCUMENT: e.url,
                    STORE_DOCMENT: "",
                    DOCUMENT_ID: "",
                    ORGANIZATION_ID: "",
                    TRAN_DATE: new Date(),
                    VALID_DATE_TO: new Date(),
                    ORDER_DOCUMENT: index,
                    DATASTATE: 'ADD'
                }
                HOMEOSAPP.add('PRODUCT_PUBLISH_DOCUMENT', willInsertData_detail)
            });
        }
        await HOMEOSAPP.updateTranNo("PRODUCT_PUBLISH");
    }

    // --- INITIALIZE SELECT2 ---
    $container.find("#materialName, #editMaterialName")
    .select2({
        data: materialsMasterList,
        placeholder: "Chọn vật tư",
        width: "70%",
        allowClear: true,
    });

    // --- EVENT HANDLERS ---
    $container.off(); // Detach all previous handlers
    $container.on("input", "#bom-search-input", async function (e) {
        renderBOMList();
    })
    $container.on("click", "#btnAddBom", function (e) {
        e.preventDefault();
        $container.find("#formStep1")[0].reset();
        resetStepper();
        $container.find("#addStep1").show();
        $container.find("#addStep2").hide();
        tempBomData = { info: {}, materials: [] };
        $container.find("#tech-doc-list").html("");
        techDocs = [];
        navigateTo("#addView");
    });
    $container.on("click", ".btn-back", function () {
        navigateTo("#bomListView");
    });

    document.getElementById('tech-doc-input').addEventListener('change', function(event) {
        const fileList = event.target.files; 
        const listEl = document.getElementById('tech-doc-list');

        Array.from(fileList).forEach(file => {
            techDocs.push(file);
            // Kiểm tra extension để chọn icon
            let iconClass = "bi bi-file-earmark";
            if (file.name.endsWith(".pdf")) {
                iconClass = "bi bi-file-earmark-pdf";
            } else if (file.name.endsWith(".zip")) {
                iconClass = "bi bi-file-earmark-zip";
            }

            // Tạo li
            const li = document.createElement("li");
            li.className = "list-group-item d-flex justify-content-between align-items-center py-1";
            li.style = "height: 40px";
            li.innerHTML = `
                <span class="small text-truncate">
                    <i class="${iconClass} me-2"></i>
                    ${file.name}
                </span>
                <button type="button" class="btn-close btn-sm"></button>
            `;

            // Xử lý xóa item khi bấm close
            li.querySelector(".btn-close").addEventListener("click", () => {
                li.remove();
                techDocs = techDocs.filter(f => f !== file);
            });

            listEl.appendChild(li);
        });

        // Reset input để lần sau có thể chọn lại cùng file
        event.target.value = "";
    });

    // Add BOM Logic
    $container.on("submit", "#formStep1", async function (e) {
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
        const bomId = await HOMEOSAPP.getTranNo("", 'GET', 'PRODUCT_PUBLISH');
        $container
            .find("#bomSummary")
            .html(
                `<p class="mb-1"><strong>BOM:</strong> ${bomId}</p><p class="mb-0"><strong>Sản phẩm:</strong> ${tempBomData.info.productName}</p>`
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
        toastr.success("Thêm BOM thành công!");
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

document.querySelectorAll("#footer-wareHouse a").forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();

    // Nếu click Trang chủ thì không bật overlay
    if (link.querySelector("span").textContent.trim() === "Trang chủ") return;

    // Lấy icon class của link đó để đưa lên overlay
    const iconClass = link.querySelector("i").className;
    const overlayIcon = document.getElementById("overlay-icon");
    overlayIcon.className = iconClass + " fs-1 mb-3";

    // Hiện overlay
    document.getElementById("feature-overlay").classList.remove("d-none");
  });
});

// Đóng overlay
document.getElementById("overlay-close").addEventListener("click", () => {
  document.getElementById("feature-overlay").classList.add("d-none");
});

var photoStores = {};
// upload ảnh 
function initPhotoUploader(containerId) {
    const container = $("#" + containerId);
    const cameraInput = container.find(".camera-input");
    const uploadInput = container.find(".upload-input");
    const photoList   = container.find(".photo-list");

    // Tạo storage riêng cho container này
    photoStores[containerId] = [];

    // Hàm thêm file
    function addFiles(fileList) {
        Array.from(fileList).forEach(file => {
            const imgUrl = URL.createObjectURL(file);

            const li = $(`
                <li class="list-group-item d-flex align-items-center justify-content-between">
                    <div class="d-flex align-items-center">
                        <img src="${imgUrl}" style="max-height:60px; border-radius:8px; margin-right:10px;">
                        <span class="small text-truncate">${file.name}</span>
                    </div>
                    <button type="button" class="btn-close btn-sm"></button>
                </li>
            `);
            // Xoá file
            li.find(".btn-close").click(() => {
                const idx = photoStores[containerId].indexOf(file);
                if (idx !== -1) photoStores[containerId].splice(idx, 1);
                li.remove();
            });

            photoList.append(li);
            photoStores[containerId].push(file);
        });
    }

    // Mở camera
    container.find(".btn-camera").click(() => cameraInput.click());
    // Mở upload
    container.find(".btn-upload").click(() => uploadInput.click());

    // Xử lý chọn file
    cameraInput.on("change", e => {
        addFiles(e.target.files);
        e.target.value = "";
    });

    uploadInput.on("change", e => {
        addFiles(e.target.files);
        e.target.value = "";
    });
}

function uploadFile(source, files) {
    if (!files || !files.length) {
        return Promise.resolve([]); // trả về mảng rỗng nếu không có file
    }

    const folder = source;

    // Trả về Promise cho mỗi file
    const uploadPromises = files.map(file => {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: HOMEOSAPP.linkUpload + "/UploadFile",
                type: "POST",
                data: file,                        
                processData: false,
                contentType: "application/octet-stream",
                dataType: "text",
                success: function(resp) {
                    const id = resp.replace(/<.*?>/g, "").trim();
                    let saveUrl = HOMEOSAPP.linkUpload + "/SaveFileInfo?id=" + encodeURIComponent(id) + "&fileName=" + encodeURIComponent(file.name);
                    if (folder) saveUrl += "&folderName=" + encodeURIComponent(folder);

                    $.ajax({
                        url: saveUrl,
                        type: "POST",
                        dataType: "text",
                        success: function(res) {
                            const resource = "https://central.homeos.vn/resources/"+ folder + "" + encodeURIComponent(file.name);
                            resolve({ file: file.name, url: resource, resp: res });
                        },
                        error: function(err) {
                            reject("Lỗi SaveFileInfo: " + file.name);
                        }
                    });
                },
                error: function(err) {
                    reject("Lỗi upload: " + file.name);
                }
            });
        });
    });

    // Gom kết quả tất cả file
    return Promise.all(uploadPromises);
}

// Hàm lấy danh sách file của container bất kỳ
function getPhotoFiles(containerId) {
    return photoStores[containerId] || [];
}

async function mapDealData(rawData, type, Wtype, tableDeal) {
    return {
        TRAN_DATE: new Date(),
        TRAN_NO: await HOMEOSAPP.getTranNo("", 'GET', tableDeal),
        TRAN_ID: type,
        WAREHOUSE_ID: Wtype,
        WAREHOUSE_TYPE: Wtype,
        CONTACT_PERSION: rawData.supplier || "",
        ACTION_TYPE_ID: type === "IMPORT" ? "HT05" : "HT04",
        COMMENT: rawData.description || "",
        EXCHANGE_RATE: 0,
        ORGANIZATION_ID: "27446577457755184",
        EMPLOYEE_ID: rawData.receiver || currentUser,
        REFERENCE_SEQ: "",
        TRAN_NO_REF: "",
        PR_DETAIL_ID: rawData.receiver || currentUser,
        CONTRACT_NO: "BG",
        IS_LOCKED: 0,
        USER_ID: currentUser,
        STATUS: '',
        CURRENCY_ID: 'VND',
        QUANTITY: rawData.quantity || 0,
        EXPORT_ORGANIZATION_ID: "0000",
        PRODUCT_ID: '',
        DATE_MODIFY: new Date(),
        DATASTATE: "ADD"
    };
}

function mapDetailData(rawData, Fr_key) {
    const QUANTITY_REMAIN = dataMaterial.filter((b) => b.ITEM_ID == rawData.materialId);
    return { 
        FR_KEY: Fr_key + 1,                           
        ITEM_ID: rawData.materialId || rawData.productId,
        REG_NO: rawData.batchCode || "",
        UNIT_ID: rawData.unit || "",
        EXTRA_UNIT_ID: rawData.extraUnitId || "", 
        SOURCE_ID: rawData.sourceId || null,       
        QUANTITY_REQUIRE: rawData.quantity || 0,  
        QUANTITY_INCOME: rawData.quantity || 0,    
        QUANTITY_REMAIN: QUANTITY_REMAIN.QUANTITY || 0,    
        PRICE: rawData.pricePerItem || 0,          
        LIST_ORDER: rawData.listOrder || 0,        
        NOTE: rawData.description || "",           
        VAT_TAX_ID: rawData.vatTaxId || null,      
        IS_QUANLITY: rawData.isQuanlity || 0,      
        EXPIRY_DATE: rawData.expiryDate ? new Date(rawData.expiryDate) : null,
        IS_EXT: rawData.isExt || 0,
        DATASTATE: "ADD"
    };
}

async function addAndEditImportExport(type, typeRun, typeItem, data) {
    try {
        const tableDeal   = type === "IMPORT" ? "DEPOT_IMPORT_DEAL"  : "DEPOT_EXPORT_DEAL";
        const tableDetail = type === "IMPORT" ? "DEPOT_IMPORT_DETAIL": "DEPOT_EXPORT_DETAIL";
        const keyData = await HOMEOSAPP.getDM(
            HOMEOSAPP.linkbase,
            "SYS_KEY",
            "TABLE_NAME = '"+tableDeal+"'"
        );
        // --- DEAL ---
        let Wtype; 
        let ITEM_ID;
        let files;
        if(typeItem == "VT"){
            Wtype = "KLK";
            ITEM_ID = data.materialId;
            files = getPhotoFiles("photoBox2");
        } else {
            Wtype = "KTP";
            ITEM_ID = data.productId;
            files = getPhotoFiles("photoBox1");
        }
        const dealObj = await mapDealData(data, type, Wtype, tableDeal);
        
        const detailObj = await mapDetailData(data, keyData.data[0].LAST_NUM);

        if (typeRun == "EDIT") {
            await HOMEOSAPP.update(tableDeal, dealObj, { PR_KEY: dealKey });
        } else {
            await HOMEOSAPP.add(tableDeal, dealObj);
        }
        
        if (typeRun == "EDIT") {
            await HOMEOSAPP.update(tableDetail, detailObj, { PR_KEY: raw.PR_KEY });
        } else {
            await HOMEOSAPP.add(tableDetail, detailObj);
        }

        const DataInformation = await HOMEOSAPP.getDM(
            HOMEOSAPP.linkbase,
            "DEPOT_INFORMATION_MASTER",
            "ITEM_ID = '"+ITEM_ID+"'"
        );
        const original = DataInformation.data[0];

        if(type == "IMPORT"){
            const willInsertData = {
                ...original,
                QUANTITY_INCOME: original.QUANTITY_INCOME + data.quantity,
                DATASTATE: 'EDIT'
            }
            await HOMEOSAPP.add("DEPOT_INFORMATION_MASTER", willInsertData);
        } else if(type == "EXPORT") {
            const willInsertData = {
                ...original,
                QUANTITY_OUTCOME: original.QUANTITY_OUTCOME + data.quantity,
                DATASTATE: 'EDIT'
            }
            await HOMEOSAPP.add("DEPOT_INFORMATION_MASTER", willInsertData);
        }

        
        console.log( files.length, files);
        
        if(files.length != 0){
            const resource = await uploadFile("ZaloMiniApp/Warehouse/img/", files);
            const DataItem = await HOMEOSAPP.getDM(
                HOMEOSAPP.linkbase,
                "DM_ITEM",
                "ITEM_ID = '"+ITEM_ID+"'"
            );
            const originalItem = DataItem.data[0];
            if(originalItem.ITEM_IMAGE == null){
                const willInsertData = {
                    ...originalItem,
                    ITEM_IMAGE: resource[0].url,
                    DATASTATE: 'EDIT'
                }
                await HOMEOSAPP.add("DM_ITEM", willInsertData);
            }
        }
        await HOMEOSAPP.updateTranNo("DEPOT_IMPORT_DEAL");
        
    } catch (err) {
        // console.error("❌ Lỗi khi xử lý import/export:", err);
        throw err;
    }
}

async function mapDealDataP(rawData, type, Wtype, tableDeal) {
    return {
        TRAN_DATE: new Date(),
        TRAN_NO: await HOMEOSAPP.getTranNo("", 'GET', tableDeal),
        TRAN_ID: type,
        WAREHOUSE_ID: Wtype,
        WAREHOUSE_TYPE: 'ITEM',
        CONTACT_PERSION: rawData.supplier || "",
        ACTION_TYPE_ID: type === "IMPORT" ? "HT05" : "HT04",
        CURRENCY_ID: "VND",
        COMMENT: rawData.description || "",
        EXCHANGE_RATE: 0,
        EXPORT_ORGANIZATION_ID: "0000",
        ORGANIZATION_ID: "0000",
        EMPLOYEE_ID: currentUser,
        REFERENCE_SEQ: rawData.TRAN_NO,
        TRAN_NO_REF: "",
        PR_DETAIL_ID: currentUser,
        CONTRACT_NO: "BG",
        IS_LOCKED: 0,
        USER_ID: currentUser,
        STATUS: '',
        DATE_MODIFY: new Date(),
        PRODUCT_ID: rawData.PRODUCT_ID,
        QUANTITY: rawData.QUANTITY,
        DATASTATE: "ADD"
    };
}

async function addImportExportP(type, typeItem, data) {
    try {
        console.log(data);
        
        const tableDeal   = type === "IMPORT" ? "DEPOT_IMPORT_DEAL"  : "DEPOT_EXPORT_DEAL";
        const tableDetail = type === "IMPORT" ? "DEPOT_IMPORT_DETAIL"  : "DEPOT_EXPORT_DETAIL";
        const keyData = await HOMEOSAPP.getDM(
            HOMEOSAPP.linkbase,
            "SYS_KEY",
            "TABLE_NAME = '"+tableDeal+"'"
        );
        // --- DEAL ---
        let Wtype;
        let ITEM_ID;
        let files;
        if(typeItem == "VT"){
            Wtype = "KLK";
            ITEM_ID = data.materialId;
            files = getPhotoFiles("photoBox2");
        } else {
            Wtype = "KTP";
            ITEM_ID = data.productId;
            files = getPhotoFiles("photoBox1");
        }
        const dealObj = await mapDealDataP(data, type, Wtype, tableDeal);
        // console.log(dealObj);
        
        await HOMEOSAPP.add(tableDeal, dealObj);
        
        const DataDetail = await HOMEOSAPP.getDM(
            HOMEOSAPP.linkbase,
            tableDetail,
            "FR_KEY = '"+keyData.data[0].LAST_NUM+"'"
        );
        console.log(DataDetail.data);
        
        
        DataDetail.data.forEach( async (item) => {
            const original = item;
            const itemFilter = data.ITEMS.filter((b) => b.ITEM_ID == item.ITEM_ID);
            console.log(itemFilter);
            
            const willInsertData = {
                ...original,
                QUANTITY_REQUIRE: itemFilter[0].QUANTITY_REQUIRE,
                QUANTITY_OUTCOME: itemFilter[0].QUANTITY_REQUIRE,
                DATASTATE: 'EDIT'
            }
            await HOMEOSAPP.add(tableDetail, willInsertData);
        });

        // if(files.length != 0){
        //     const resource = await uploadFile("ZaloMiniApp/Warehouse/img/", files);
        //     const DataItem = await HOMEOSAPP.getDM(
        //         HOMEOSAPP.linkbase,
        //         "DM_ITEM",
        //         "ITEM_ID = '"+ITEM_ID+"'"
        //     );
        //     const originalItem = DataItem.data[0];
        //     if(originalItem.ITEM_IMAGE == null){
        //         const willInsertData = {
        //             ...originalItem,
        //             ITEM_IMAGE: resource[0].url,
        //             DATASTATE: 'EDIT'
        //         }
        //         await HOMEOSAPP.add("DM_ITEM", willInsertData);
        //     }
        // }
        await HOMEOSAPP.updateTranNo(tableDeal);
        
    } catch (err) {
        // console.error("❌ Lỗi khi xử lý import/export:", err);
        throw err;
    }
}

$("#submitLogin").click(async function(e) {
    e.preventDefault(); // chặn submit mặc định nếu có

    let username = $("#userName").val().trim();
    let password = $("#password").val().trim();

    if(username === "" || password === ""){
        toastr.error("Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu");
        return;
    }

    // Xử lý tiếp, ví dụ gọi API
    console.log("Tên đăng nhập:", username);
    console.log("Mật khẩu:", password);


    var dataUser = await checkRoleUserWarehouse(username, HOMEOSAPP.sha1Encode(password + "@1B2c3D4e5F6g7H8").toString(), HOMEOSAPP.linkbase + '/');
    if(dataUser){
        toastr.success("đăng nhập thành công!");
        const login = JSON.parse(localStorage.getItem("dataLogin")) || [];
        console.log(login);
        if(login != []){
            document.getElementById("wareHouse-login").classList.add("d-none");
            document.getElementById("wareHouse-menu").classList.remove("d-none");
            document.getElementById("wareHouse-detail").classList.add("d-none");
            document.getElementById("footer-wareHouse").classList.remove("d-none");
        }
    }
});

$("#logout").click(() => {
    localStorage.setItem('dataLogin', JSON.stringify([]));
    document.getElementById("wareHouse-login").classList.remove("d-none");
    document.getElementById("wareHouse-menu").classList.add("d-none");
    document.getElementById("wareHouse-detail").classList.add("d-none");
    document.getElementById("footer-wareHouse").classList.add("d-none");
})
function checkRoleUserWarehouse(user_id, password, url, check) {

    // Nếu chưa có session, gọi API
    const d = {
        Uid: user_id,
        p: password,
        ip: '0.0.0.0',
        a: '6fba9a59-46f1-42e6-baea-b2479fa1eb3b'
    };
    return new Promise((resolve, reject) => {
        $.ajax({
        url: url + "GetSessionId?callback=?",
        type: "GET",
        dataType: "jsonp",
        data: d,
        contentType: "application/json; charset=utf-8",
        success: function (msg) {
            try {
                const state = JSON.parse(msg);
                const newSession = {
                    url: url,
                    sid: state[0]?.StateId || '', // lưu sid nếu có
                    name: state[0]?.StateName || user_id,
                    username: state[1]?.UserName || state[0]?.StateName
                };
                console.log(state);
                $(".userName").text(state[1]?.UserName);
                localStorage.setItem('dataLogin', JSON.stringify(newSession));
                resolve(state);
            } catch (error) {
                reject(error);
            }
        },
        error: function (e, t, x) {
            reject(e);
        }
        });
    });
}

renderApps(apps_waveHouse, "wareHouse-list");
// Chạy hàm khởi tạo để test (bạn sẽ xóa dòng này khi ghép file)
//
