(function($) {
    // Sử dụng IIFE (Immediately Invoked Function Expression) để tạo một scope riêng,
    // tránh làm ô nhiễm không gian tên toàn cục và an toàn khi sử dụng alias '$' cho jQuery.

    /**
     * ===================================================================
     * UI HANDLER CLASS (VIEW)
     * Lớp này chịu trách nhiệm cho TẤT CẢ các thao tác với DOM.
     * Nó không chứa bất kỳ logic nghiệp vụ nào.
     * ===================================================================
     */
    class UIHandler {
        constructor() {
            // Cache các element jQuery để tăng hiệu năng và tránh lặp lại selector
            this.elements = {
                qrPopup: $('#qr-popup'),
                loadingPopup: $('#loading-popup'),
                permissionSection: $("#warranty-permission"),
                isPermission: $("#isPermission"),
                notPermission: $("#notPermission"),
                shareWarrantyBtn: $("#share-warranty"),
                errorWarrantyBtn: $("#errorWarranty"),
                resultProductSection: $("#result-product"),
                resultForm: $("#result-form"),
                productName: $('#productName'),
                productCode: $('#productCode'),
                productSeri: $('#productSeri'),
                productOwner: $('#productOwner'),
                warrantyTime: $('#warrantyTime'),
                warrantyActive: $('#warrantyActive'),
                warrantyTimeActive: $('#warrantyTimeActive'),
                historyList: $('#history-warranty-detail'),
                deviceImgContainer: $("#deviceImg"),
                productCodeInput: $('#productCodeInput'),
                phoneNumberInput: $('#phoneNumberInput'),
                menuWarranty: $('#menu-warranty'),
                // ... Thêm các element khác vào đây
            };
        }

        /**
         * Gắn tất cả các sự kiện tĩnh vào một nơi duy nhất.
         * @param {WarrantyApp} controller - Instance của lớp điều khiển chính.
         */
        bindEvents(controller) {
            $('#submitError').on('click', () => {
                const payload = {
                    errorInput: $("#errorInput").val(),
                    errorType: $("#errorType").val(),
                    errorDesc: $("#errorDesc").val(),
                };
                controller.submitError(payload);
            });

            $('#result-product-warranty').on('click', () => {
                const product = controller.state.product;
                if (confirm(`Xác nhận kích hoạt bảo hành cho sản phẩm "${product.PRODUCT_NAME}"?`)) {
                    controller.activateWarranty();
                }
            });

            this.elements.shareWarrantyBtn.on('click', () => controller.showSharePopup());
            
            $('#btnPermission').on('click', () => {
                const phoneValue = this.elements.phoneNumberInput.val().trim();
                const productValue = this.elements.productCodeInput.val().trim();
                if (!phoneValue) {
                    alert("Vui lòng nhập số điện thoại.");
                    this.elements.phoneNumberInput.focus();
                    return;
                }
                controller.savePermission(phoneValue, productValue);
            });
            
            // Sự kiện cho các tab menu
            $('.bottom-navigation button').on("click", function () {
                const value = $(this).data('tab');
                $('.bottom-navigation button').removeClass('menuWarranty');
                $(this).addClass('menuWarranty');
                $('.tab-content').removeClass('active');
                $('#tab-' + value).addClass('active');
            });

            // ... Gắn các sự kiện khác ở đây (Back, Submit, Tabs, etc.)
        }

        toggleLoading(show) {
            this.elements.loadingPopup.toggle(show);
        }

        showScreen(screenName) {
            // Ẩn tất cả các màn hình chính
            this.elements.resultForm.addClass('d-none');
            this.elements.resultProductSection.addClass('d-none');
            this.elements.menuWarranty.addClass('d-none');
            this.elements.qrPopup.hide();
            
            // Hiển thị màn hình được yêu cầu
            if (screenName === 'detail') {
                this.elements.menuWarranty.removeClass('d-none');
            }
        }

        renderProductDetails(product) {
            if (!product) return;
            const qrParts = product.QR_CODE.split(',');
            const seri = (qrParts.length === 4) ? qrParts[3] : qrParts[2].substring(1);

            this.elements.productName.text(`Tên sản phẩm: ${product.PRODUCT_NAME}`);
            this.elements.productCode.text(`Mã định danh: ${product.PRODUCT_CODE}`);
            this.elements.productSeri.text(`Số seri: ${seri}`);
            this.elements.productOwner.text(product.USER_NAME ? `Chủ sở hữu: ${product.USER_NAME}` : 'Chưa có chủ sở hữu');
            
            this._renderProductImages(product.PRODUCT_IMG_SLIDE, product.PRODUCT_IMG);
            
            const timeLeft = this._calculateWarrantyRemaining(product.DATE_CREATE, Number(product.TIME_WARRANTY));
            this.elements.warrantyTime.text(timeLeft);

            const isNotActivated = product.ACTIVATE_WARRANTY === "1999-01-01T00:00:00";
            if (isNotActivated) {
                this.elements.warrantyActive.text("Chưa kích hoạt");
                this.elements.warrantyTimeActive.text("");
            } else {
                const activatedDate = new Date(product.ACTIVATE_WARRANTY).toISOString().split('T')[0];
                this.elements.warrantyActive.text("Đã kích hoạt");
                this.elements.warrantyTimeActive.text(activatedDate);
            }

            if (seri) {
                this.elements.productCodeInput.val(seri).attr("readonly", true);
            }
        }
        
        async updateUserPhoneInput() {
            let userLogin = JSON.parse(localStorage.getItem('UserLogin'));
            if (!userLogin && window.getPhoneNum) { // Chỉ lấy SĐT nếu chưa có
                const tokenPhone = await window.getPhoneNum();
                const token = await window.getUserAccessToken();
                const dataPhone = await HOMEOSAPP.getPhoneNumberByUserZalo("https://central.homeos.vn/service_XD/service.svc", token, tokenPhone);
                this.elements.phoneNumberInput.val(HOMEOSAPP.formatPhoneNumber(dataPhone)).attr("readonly", true);
            } else if (userLogin?.USER_PHONE_NUM) {
                this.elements.phoneNumberInput.val(userLogin.USER_PHONE_NUM).attr("readonly", true);
            }
        }

        _renderProductImages(slideImages, singleImage) {
            this.elements.deviceImgContainer.empty();
            let images = [];
            if (slideImages) {
                images = slideImages.split(",").map(url => url.trim());
            } else if (singleImage) {
                images = [singleImage];
            }

            if (images.length > 0) {
                 images.forEach((src, index) => {
                    const itemHTML = `
                        <div class="carousel-item h-100 ${index === 0 ? "active" : ""}">
                            <img src="${src}" class="d-block w-100 h-100" style="object-fit: cover;" alt="Slide ${index + 1}">
                        </div>`;
                    this.elements.deviceImgContainer.append(itemHTML);
                });
            }
        }
        
        renderPermissionView(permissionLevel) {
            this.elements.isPermission.toggleClass('d-none', permissionLevel !== 1);
            this.elements.notPermission.toggleClass('d-none', permissionLevel === 1);
            this.elements.permissionSection.toggleClass('d-none', permissionLevel !== 0 && permissionLevel !== 1);
            
            const canShare = permissionLevel === 1 || permissionLevel === 2;
            const canReportError = permissionLevel !== 3;

            this.elements.shareWarrantyBtn.toggleClass('d-none', !canShare);
            this.elements.errorWarrantyBtn.toggleClass('d-none', !canReportError);
        }

        renderHistory(historyData = [], lotData = []) {
            this.elements.historyList.empty();
            const parentItems = historyData.filter(item => item.GROUP_ID === 0);
            const childItemsMap = historyData.reduce((acc, item) => {
                if (item.GROUP_ID !== 0) {
                    (acc[item.GROUP_ID] = acc[item.GROUP_ID] || []).push(item);
                }
                return acc;
            }, {});

            parentItems.forEach(item => {
                const children = childItemsMap[item.PR_KEY] || [];
                const lot = lotData.find(l => l.PR_KEY === item.LOT_ID);
                const itemHTML = this._createHistoryItemHTML(item, children, lot);
                const $element = $(itemHTML);
                
                $element.find('.toggle-button').on('click', function(e) {
                    e.preventDefault();
                    const childList = $(this).siblings(".child-list");
                    const arrowIcon = $(this).find(".arrow-icon");
                    childList.slideToggle(200, () => {
                        arrowIcon.toggleClass("expanded", childList.is(':visible'));
                    });
                });
                this.elements.historyList.append($element);
            });
        }
        
        _createHistoryItemHTML(item, children, lot) {
            const [date, time] = (item.DATE_CREATE || '').split('T');
            const isErrorType = item.TYPE === 'ERROR';

            const icon = isErrorType ? 
                `<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" style="color: #cd5757;" fill="currentColor" class="bi bi-exclamation-triangle" viewBox="0 0 16 16"><path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.15.15 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.2.2 0 0 1-.054.06.1.1 0 0 1-.066.017H1.146a.1.1 0 0 1-.066-.017.2.2 0 0 1-.054-.06.18.18 0 0 1 .002-.183L7.884 2.073a.15.15 0 0 1 .054-.057m1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767z"/><path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z"/></svg>` :
                `<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" style="color: #27c527;" fill="currentColor" class="bi bi-check-circle" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/><path d="m10.97 4.97-.02.022-3.473 4.425-2.093-2.094a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05"/></svg>`;
            
            const title = isErrorType ? 'Bảo hành' : item.ERROR_NAME;
            let description = `<p class="item-desc">${isErrorType ? item.ERROR_NAME : item.DESCRIPTION || ''}</p>`;
            if (lot?.LOT_NUMBER) {
                description += `<p class="item-desc">Sản phẩm thuộc: ${lot.LOT_NUMBER}</p>`;
            }
            description += `<p class="item-desc">${date} ${time || ''}</p>`;

            const childHTML = children.map(child => this._createTimelineItemHTML(child)).join('');
            
            return `
                <li class="parent-item">
                    <button class="toggle-button">
                        <div>
                            <h5 style="margin: 0;">${icon} ${title}</h5>
                            ${description}
                        </div>
                        ${isErrorType ? '<span class="arrow-icon">▶</span>' : ''}
                    </button>
                    ${isErrorType ? `<ul class="child-list" style="display: none;"><div class="vertical-timeline">${this._createTimelineItemHTML(item, 'Báo lỗi sản phẩm')}${childHTML}</div></ul>` : ''}
                </li>`;
        }
        
        _createTimelineItemHTML(item, overrideTitle = '') {
            const [date, time] = (item.DATE_CREATE || '').split('T');
            const statusClasses = { 1: 'badge-warning', 2: 'badge-danger', 3: 'badge-success' };
            const statusClass = statusClasses[item.ERROR_STATUS] || 'badge-secondary';
            return `
                <div class="vertical-timeline-item">
                    <div>
                        <span class="vertical-timeline-element-icon"><i class="badge ${statusClass}"></i></span>
                        <div class="vertical-timeline-element-content">
                            <h4 class="timeline-title">${overrideTitle || item.ERROR_NAME}</h4>
                            <p>${item.DESCRIPTION || ''}</p>
                            <span class="vertical-timeline-element-date">${date}</span>
                            <span class="vertical-timeline-element-dateTime">${time || ''}</span>
                        </div>
                    </div>
                </div>`;
        }

        _calculateWarrantyRemaining(startDate, timeWarranty) {
            const warrantyEndDate = new Date(startDate);
            warrantyEndDate.setMonth(warrantyEndDate.getMonth() + timeWarranty);
            const diffTime = warrantyEndDate.getTime() - new Date().getTime();

            if (diffTime <= 0) return "Thời gian bảo hành đã hết.";
            
            const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            const months = Math.floor(totalDays / 30.44); // Average days in month
            const days = totalDays % 30;
            return `Còn lại: ${months} tháng ${days} ngày.`;
        }
    }

    /**
     * ===================================================================
     * WARRANTY APP CLASS (CONTROLLER)
     * "Bộ não" của ứng dụng, điều phối UI và API.
     * ===================================================================
     */
    class WarrantyApp {
        constructor() {
            this.ui = new UIHandler();
            this.api = HOMEOSAPP; // Sử dụng namespace API đã có
            this.state = {
                product: null,
                permissionLevel: 0,
                productCode: null,
            };
        }

        init() {
            this.state.permissionLevel = HOMEOSAPP.LeverPermission;
            this.state.productCode = HOMEOSAPP.CodeWarranty;
            this.ui.bindEvents(this);
            this.accessDevice();
        }

        async accessDevice() {
            if (!this.state.productCode) {
                toastr.error("Vui lòng nhập mã sản phẩm!");
                return;
            }

            this.ui.toggleLoading(true);
            try {
                const productData = await this._findProductByCode(this.state.productCode);
                if (!productData) {
                    toastr.error("Sản phẩm không tồn tại hoặc chưa được thêm vào hệ thống");
                    return;
                }
                
                this.state.product = productData;
                localStorage.setItem("productWarranty", JSON.stringify([productData]));
                HOMEOSAPP.addObj('CK', productData.CK_CODE);
                
                this.ui.renderProductDetails(productData);
                this.ui.renderPermissionView(this.state.permissionLevel);
                await this.ui.updateUserPhoneInput();
                await this.loadAndRenderHistory();
                this._saveToLocalHistory(productData);
                this.ui.showScreen('detail');
            } catch (error) {
                console.error("Error accessing device:", error);
                toastr.error("Đã có lỗi xảy ra khi tải thông tin sản phẩm.");
            } finally {
                this.ui.toggleLoading(false);
            }
        }
        
        async _findProductByCode(code) {
            const dataQRcode = await this.api.getDM("https://central.homeos.vn/service_XD/service.svc", "DM_QRCODE", "1=1");
            const inputPrefix = code.charAt(0).toUpperCase();
            const inputDigits = code.slice(1).replace(/\D/g, "");
            
            const matchedItem = dataQRcode.data.find(item => {
                const lastPart = item.QR_CODE.split(",").pop();
                const lastPrefix = lastPart.charAt(0).toUpperCase();
                const lastDigits = lastPart.slice(1).replace(/\D/g, "");
                return lastPrefix === inputPrefix && lastDigits.endsWith(inputDigits);
            });
            
            if (matchedItem) {
                const dataQRProduct = await this.api.getDataMDQRcode(matchedItem.QR_CODE.replaceAll(',', '$'));
                return dataQRProduct?.[0];
            }
            return null;
        }

        async loadAndRenderHistory() {
            if (!this.state.product?.PR_KEY) return;
            try {
                const historyPromise = this.api.getDM("https://central.homeos.vn/service_XD/service.svc", 'WARRANTY_ERROR', `QRCODE_ID='${this.state.product.PR_KEY}'`);
                const lotPromise = this.api.getDM("https://central.homeos.vn/service_XD/service.svc", 'WARRANTY_LOT', `PR_KEY='${this.state.product.LOT_ID}'`);
                const [history, lotData] = await Promise.all([historyPromise, lotPromise]);
                this.ui.renderHistory(history.data, lotData.data);
            } catch (error) {
                console.error("Failed to load warranty history:", error);
            }
        }

        async submitError(payload) {
            if (!this.state.product) return;
            const insertData = {
                TYPE: 'ERROR', ERROR_TYPE: payload.errorType, ERROR_NAME: payload.errorInput,
                DESCRIPTION: payload.errorDesc, DATE_CREATE: new Date(), ERROR_STATUS: 1,
                QRCODE_ID: this.state.product.PR_KEY, USER_ID: HOMEOSAPP.UserID, DATASTATE: "ADD",
            };
            try {
                await this.api.add('WARRANTY_ERROR', insertData);
                toastr.success("Báo lỗi thành công!");
                await this.loadAndRenderHistory();
                if (HOMEOSAPP.goBack) HOMEOSAPP.goBack();
            } catch (error) {
                toastr.error("Báo lỗi thất bại, vui lòng thử lại.");
            }
        }
        
        async activateWarranty() {
            const product = this.state.product;
            const editPayload = { PR_KEY: product.PR_KEY, ACTIVATE_WARRANTY: new Date(), DATASTATE: "EDIT" };
            const logPayload = {
                TYPE: "ACTIVATE", ERROR_NAME: "Kích hoạt bảo hành",
                DESCRIPTION: `${HOMEOSAPP.DataUser.name} đã kích hoạt bảo hành sản phẩm`,
                DATE_CREATE: new Date(), ERROR_STATUS: 0, QRCODE_ID: product.PR_KEY,
                USER_ID: HOMEOSAPP.UserID, DATASTATE: "ADD",
            };

            try {
                await this.api.add('DM_QRCODE', editPayload);
                await this.api.add('WARRANTY_ERROR', logPayload);
                toastr.success("Kích hoạt bảo hành thành công!");
                // Tải lại dữ liệu sản phẩm để cập nhật UI
                const updatedProduct = await this._findProductByCode(this.state.productCode);
                this.state.product = updatedProduct;
                this.ui.renderProductDetails(updatedProduct);
            } catch (error) {
                console.error('Error activating warranty:', err);
                toastr.error("Kích hoạt thất bại!");
            }
        }
        
        async savePermission(phoneNumber, productSeri) {
            const product = this.state.product;
            const userInfo = HOMEOSAPP.DataUser;
            try {
                const pKey = Utils.sha1Encode(`${productSeri}${phoneNumber}@1B2c3D4e5F6g7H8`);
                const ownerPayload = {
                    PR_KEY_QRCODE: product.PR_KEY, Z_USER_ID: userInfo?.id,
                    USER_PHONE_NUMBER: phoneNumber, P_KEY: pKey, DATE_CREATE: new Date(),
                    OWNER_SHIP_LEVEL: 1, ACTIVE: 1, DATASTATE: "ADD",
                };
                await this.api.add('ZALO_OWNER_SHIP_DEVICE', ownerPayload);
                await this.activateWarranty(); // Kích hoạt bảo hành sau khi nhận quyền
                toastr.success("Xác nhận chủ sở hữu thành công!");
                this.ui.renderPermissionView(1); // Cập nhật UI thành Owner
            } catch (error) {
                console.error("Error saving permission:", error);
                toastr.error("Lưu quyền sở hữu thất bại.");
            }
        }
        
        showSharePopup() {
            HOMEOSAPP.loadPage("share-warranty-popup");
            const product = this.state.product;
            const textAdmin = `https://zalo.me/s/4560528012046048397/?Q=ADMIN&CK=${product.CK_CODE}`;
            const textGuest = `https://zalo.me/s/4560528012046048397/?Q=GUEST&CK=${product.CK_CODE}`;
            // ... logic tạo QR code và hiển thị popup
        }

        _saveToLocalHistory(productData) {
            const qrCodeParts = productData.QR_CODE.split(',');
            const codeDevice = qrCodeParts.length === 4 ? qrCodeParts[3] : qrCodeParts[2];
            const item = {
                'CodeWarranty': codeDevice,
                'NameWarranty': productData.PRODUCT_NAME,
                'imgWarranty': productData.PRODUCT_IMG,
                'date': new Date().toLocaleString('vi-VN')
            };
            let items = JSON.parse(localStorage.getItem('dataWarranty')) || [];
            items = items.filter(i => i.CodeWarranty !== item.CodeWarranty);
            items.unshift(item);
            if (items.length > 20) items.pop();
            localStorage.setItem('dataWarranty', JSON.stringify(items));
        }
    }

    // ===================================================================
    // ENTRY POINT - KHỞI CHẠY ỨNG DỤNG
    // ===================================================================
    $(document).ready(function() {
        if (typeof HOMEOSAPP !== 'undefined') {
            const app = new WarrantyApp();
            app.init();
        } else {
            console.error("HOMEOSAPP is not defined. Warranty script cannot run.");
        }
    });

})(jQuery);