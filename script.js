// Data Storage Keys
const STORAGE_KEYS = {
    MENU: 'restaurantMenu',
    CART: 'shoppingCart',
    INVOICES: 'invoices'
};

// State Management
let currentMenu = [];
let currentCart = [];
let invoices = [];
let editingItemId = null;

// DOM Elements
const elements = {
    // Views
    customerView: document.getElementById('customerView'),
    managerView: document.getElementById('managerView'),
    
    // Buttons
    managerBtn: document.getElementById('managerBtn'),
    backToCustomerBtn: document.getElementById('backToCustomerBtn'),
    cartBtn: document.getElementById('cartBtn'),
    closeCartBtn: document.getElementById('closeCartBtn'),
    addMenuItemBtn: document.getElementById('addMenuItemBtn'),
    clearCartBtn: document.getElementById('clearCartBtn'),
    checkoutBtn: document.getElementById('checkoutBtn'),
    
    // Modals
    menuItemModal: document.getElementById('menuItemModal'),
    invoiceModal: document.getElementById('invoiceModal'),
    paymentModal: document.getElementById('paymentModal'),
    closeModalBtn: document.getElementById('closeModalBtn'),
    closeInvoiceBtn: document.getElementById('closeInvoiceBtn'),
    closePaymentBtn: document.getElementById('closePaymentBtn'),
    cancelModalBtn: document.getElementById('cancelModalBtn'),
    
    // Forms
    menuItemForm: document.getElementById('menuItemForm'),
    
    // Display Areas
    menuGrid: document.getElementById('menuGrid'),
    managerMenuGrid: document.getElementById('managerMenuGrid'),
    cartItems: document.getElementById('cartItems'),
    cartCount: document.getElementById('cartCount'),
    cartTotal: document.getElementById('cartTotal'),
    invoiceContent: document.getElementById('invoiceContent'),
    paymentAmount: document.getElementById('paymentAmount'),
    qrcode: document.getElementById('qrcode'),
    paymentCompleteBtn: document.getElementById('paymentCompleteBtn'),
    printQRBtn: document.getElementById('printQRBtn'),
    payBtn: document.getElementById('payBtn'),
    printInvoiceBtn: document.getElementById('printInvoiceBtn'),
    
    // Manager Tabs
    tabBtns: document.querySelectorAll('.tab-btn'),
    tabContents: document.querySelectorAll('.tab-content'),
    
    // Sales Report
    reportMonth: document.getElementById('reportMonth'),
    reportYear: document.getElementById('reportYear'),
    generateReportBtn: document.getElementById('generateReportBtn'),
    salesReportContent: document.getElementById('salesReportContent'),
    invoiceHistoryContent: document.getElementById('invoiceHistoryContent'),
    
    // Manager Cart
    managerCartContent: document.getElementById('managerCartContent'),
    managerClearCartBtn: document.getElementById('managerClearCartBtn'),
    managerPrintCartBtn: document.getElementById('managerPrintCartBtn'),
    
    // Cart Widget
    cartSummaryContent: document.getElementById('cartSummaryContent'),
    cartWidgetTotal: document.getElementById('cartWidgetTotal'),
    toggleCartWidgetBtn: document.getElementById('toggleCartWidgetBtn'),
    checkoutFromWidgetBtn: document.getElementById('checkoutFromWidgetBtn'),
    clearCartWidgetBtn: document.getElementById('clearCartWidgetBtn'),
    floatingCartBtn: document.getElementById('floatingCartBtn'),
    floatingCartCount: document.getElementById('floatingCartCount'),
    
    // Overlay
    cartOverlay: document.getElementById('cartOverlay'),
    
    // Toast
    toast: document.getElementById('toast')
};

// Initialize App
function init() {
    loadMenu();
    loadCart();
    loadInvoices();
    setupEventListeners();
    initializeDefaultMenu();
    populateYearMonthDropdowns();
}

// Event Listeners Setup
function setupEventListeners() {
    // View Toggle
    elements.managerBtn.addEventListener('click', showManagerMenu);
    elements.backToCustomerBtn.addEventListener('click', hideManagerMenu);
    
    // Cart
    elements.cartBtn.addEventListener('click', toggleCart);
    elements.closeCartBtn.addEventListener('click', toggleCart);
    elements.cartOverlay.addEventListener('click', toggleCart);
    elements.clearCartBtn.addEventListener('click', clearCart);
    elements.checkoutBtn.addEventListener('click', generateInvoice);
    elements.toggleCartWidgetBtn.addEventListener('click', toggleCart);
    elements.checkoutFromWidgetBtn.addEventListener('click', generateInvoice);
    elements.clearCartWidgetBtn.addEventListener('click', clearCart);
    elements.floatingCartBtn.addEventListener('click', toggleCart);
    
    // Menu Item Modal
    elements.addMenuItemBtn.addEventListener('click', () => openMenuItemModal());
    elements.closeModalBtn.addEventListener('click', closeMenuItemModal);
    elements.cancelModalBtn.addEventListener('click', closeMenuItemModal);
    elements.menuItemForm.addEventListener('submit', handleMenuItemSubmit);
    
    // Image preview and generation
    const itemImageInput = document.getElementById('itemImage');
    const generateImageBtn = document.getElementById('generateImageBtn');
    if (itemImageInput) {
        itemImageInput.addEventListener('input', updateImagePreview);
    }
    if (generateImageBtn) {
        generateImageBtn.addEventListener('click', generateSampleImage);
    }
    
    // Invoice Modal
    elements.closeInvoiceBtn.addEventListener('click', closeInvoiceModal);
    elements.payBtn.addEventListener('click', showPaymentQR);
    elements.printInvoiceBtn.addEventListener('click', printInvoice);
    
    // Payment Modal
    elements.closePaymentBtn.addEventListener('click', closePaymentModal);
    elements.paymentCompleteBtn.addEventListener('click', completePayment);
    elements.printQRBtn.addEventListener('click', printQRCode);
    
    // Manager Tabs
    elements.tabBtns.forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });
    
    // Sales Report
    elements.generateReportBtn.addEventListener('click', generateMonthlyReport);
    
    // Manager Cart
    elements.managerClearCartBtn.addEventListener('click', () => {
        clearCart();
        renderManagerCart();
    });
    elements.managerPrintCartBtn.addEventListener('click', printManagerCart);
}

// Menu CRUD Operations
function loadMenu() {
    const stored = localStorage.getItem(STORAGE_KEYS.MENU);
    currentMenu = stored ? JSON.parse(stored) : [];
    renderMenu();
    renderManagerMenu();
}

function saveMenu() {
    localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(currentMenu));
    renderMenu();
    renderManagerMenu();
}

function initializeDefaultMenu() {
    if (currentMenu.length === 0) {
        const defaultMenu = [
            { id: Date.now() + 1, name: 'Idly', price: 0.35, image: 'https://images.unsplash.com/photo-1585937421612-70a0083564be?w=400&h=300&fit=crop', description: 'Soft and fluffy steamed rice cakes' },
            { id: Date.now() + 2, name: 'Poori', price: 0.45, image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop', description: 'Deep-fried puffed bread' },
            { id: Date.now() + 3, name: 'Dosa', price: 0.55, image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=300&fit=crop', description: 'Crispy fermented crepe' },
            { id: Date.now() + 4, name: 'Vada', price: 0.30, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70946?w=400&h=300&fit=crop', description: 'Savory fried donut' },
            { id: Date.now() + 5, name: 'Samosa', price: 0.25, image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&h=300&fit=crop', description: 'Fried pastry with savory filling' }
        ];
        currentMenu = defaultMenu;
        saveMenu();
    }
}

function renderMenu() {
    elements.menuGrid.innerHTML = '';
    
    if (currentMenu.length === 0) {
        elements.menuGrid.innerHTML = '<p class="placeholder-text">No menu items available</p>';
        return;
    }
    
    currentMenu.forEach(item => {
        const menuItem = createMenuItemCard(item, false);
        elements.menuGrid.appendChild(menuItem);
    });
}

function renderManagerMenu() {
    elements.managerMenuGrid.innerHTML = '';
    
    if (currentMenu.length === 0) {
        elements.managerMenuGrid.innerHTML = '<p class="placeholder-text">No menu items available</p>';
        return;
    }
    
    currentMenu.forEach(item => {
        const menuItem = createMenuItemCard(item, true);
        elements.managerMenuGrid.appendChild(menuItem);
    });
}

function createMenuItemCard(item, isManagerView) {
    const card = document.createElement('div');
    card.className = 'menu-item';
    
    // Ensure image URL is from open source or use fallback
    let imageUrl = item.image;
    if (!imageUrl || imageUrl === 'images/' || imageUrl.startsWith('images/')) {
        // Generate Unsplash image if no valid URL
        const searchTerm = item.name.toLowerCase().replace(/\s+/g, '');
        imageUrl = `https://source.unsplash.com/400x300/?food,${encodeURIComponent(searchTerm)}`;
    }
    
    card.innerHTML = `
        <div class="menu-item-image-wrapper">
            <img src="${imageUrl}" alt="${item.name}" class="menu-item-image" 
                 onerror="handleImageError(this, '${item.name}')">
            <button class="menu-item-qr-btn" onclick="showItemQRCode(${item.id})" title="Show QR Code">
                <span>📱</span>
            </button>
        </div>
        <div class="menu-item-info">
            <h3 class="menu-item-name">${item.name}</h3>
            <p class="menu-item-price">€${item.price}</p>
            ${item.description ? `<p class="menu-item-description">${item.description}</p>` : ''}
            <div class="menu-item-actions">
                ${isManagerView ? `
                    <button class="btn btn-secondary btn-sm" onclick="editMenuItem(${item.id})">Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteMenuItem(${item.id})">Delete</button>
                ` : `
                    <button class="btn btn-primary btn-sm" onclick="addToCart(${item.id})">Add to Cart</button>
                `}
            </div>
        </div>
    `;
    return card;
}

function handleImageError(img, itemName) {
    // Try Unsplash as fallback
    const searchTerm = itemName.toLowerCase().replace(/\s+/g, '');
    const fallbackUrl = `https://source.unsplash.com/400x300/?food,${encodeURIComponent(searchTerm)}`;
    
    // If still fails, show placeholder
    img.onerror = function() {
        this.src = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect fill="#ddd" width="200" height="200"/><text fill="#999" font-family="sans-serif" font-size="14" dy="10.5" font-weight="bold" x="50%" y="50%" text-anchor="middle">${itemName}</text></svg>`)}`;
        this.onerror = null;
    };
    img.src = fallbackUrl;
}

function showItemQRCode(itemId) {
    const item = currentMenu.find(m => m.id === itemId);
    if (!item) return;
    
    // Create QR code modal
    const qrModal = document.createElement('div');
    qrModal.className = 'modal show';
    qrModal.id = 'itemQRModal';
    
    const qrData = JSON.stringify({
        type: 'menu_item',
        id: item.id,
        name: item.name,
        price: item.price,
        action: 'add_to_cart'
    });
    
    qrModal.innerHTML = `
        <div class="modal-content qr-item-modal">
            <div class="modal-header">
                <h2>${item.name} - QR Code</h2>
                <button class="close-btn" onclick="closeItemQRModal()">&times;</button>
            </div>
            <div class="qr-item-content">
                <div class="qr-item-info">
                    <h3>${item.name}</h3>
                    <p class="qr-item-price">€${item.price}</p>
                    ${item.description ? `<p class="qr-item-desc">${item.description}</p>` : ''}
                </div>
                <div id="itemQRCode" class="item-qrcode-container"></div>
                <p class="qr-instruction">Scan to add to cart</p>
                <div class="qr-item-actions">
                    <button class="btn btn-secondary" onclick="closeItemQRModal()">Close</button>
                    <button class="btn btn-primary" onclick="printItemQRCode(${item.id})">Print QR Code</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(qrModal);
    
    // Generate QR code
    setTimeout(() => {
        const qrContainer = document.getElementById('itemQRCode');
        if (qrContainer) {
            QRCode.toCanvas(qrContainer, qrData, {
                width: 250,
                margin: 2,
                color: {
                    dark: '#000000',
                    light: '#FFFFFF'
                }
            }, function (error) {
                if (error) {
                    console.error('QR Code generation error:', error);
                    qrContainer.innerHTML = '<p style="text-align: center; color: #999;">QR Code generation failed</p>';
                }
            });
        }
    }, 100);
}

function closeItemQRModal() {
    const modal = document.getElementById('itemQRModal');
    if (modal) {
        modal.remove();
    }
}

function printItemQRCode(itemId) {
    const item = currentMenu.find(m => m.id === itemId);
    if (!item) return;
    
    const qrContainer = document.getElementById('itemQRCode');
    const canvas = qrContainer.querySelector('canvas');
    
    if (!canvas) {
        showToast('QR code not generated yet', 'error');
        return;
    }
    
    const qrImage = canvas.toDataURL('image/png');
    const printWindow = window.open('', '_blank');
    
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>${item.name} - QR Code</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    min-height: 100vh;
                    margin: 0;
                    padding: 20px;
                }
                h1 {
                    margin-bottom: 10px;
                    color: #333;
                }
                .item-info {
                    text-align: center;
                    margin-bottom: 20px;
                }
                .item-price {
                    font-size: 1.5rem;
                    font-weight: bold;
                    color: #667eea;
                    margin-top: 10px;
                }
                .qr-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 20px;
                    background: #f9f9f9;
                    border-radius: 8px;
                }
                .qr-container img {
                    max-width: 400px;
                    height: auto;
                }
                @media print {
                    body {
                        margin: 0;
                        padding: 0;
                    }
                }
            </style>
        </head>
        <body>
            <h1>${item.name}</h1>
            <div class="item-info">
                <div class="item-price">€${item.price}</div>
                ${item.description ? `<p>${item.description}</p>` : ''}
            </div>
            <div class="qr-container">
                <img src="${qrImage}" alt="QR Code">
            </div>
            <p style="margin-top: 20px; color: #666;">Scan to add to cart</p>
        </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
        printWindow.print();
    }, 250);
}

function openMenuItemModal(itemId = null) {
    editingItemId = itemId;
    const form = elements.menuItemForm;
    const modalTitle = document.getElementById('modalTitle');
    
    if (itemId) {
        const item = currentMenu.find(m => m.id === itemId);
        if (item) {
            document.getElementById('menuItemId').value = item.id;
            document.getElementById('itemName').value = item.name;
            document.getElementById('itemPrice').value = item.price;
            document.getElementById('itemImage').value = item.image;
            document.getElementById('itemDescription').value = item.description || '';
            modalTitle.textContent = 'Edit Menu Item';
            updateImagePreview(); // Show preview for existing image
        }
    } else {
        form.reset();
        document.getElementById('menuItemId').value = '';
        modalTitle.textContent = 'Add Menu Item';
        clearImagePreview();
    }
    
    elements.menuItemModal.classList.add('show');
}

function closeMenuItemModal() {
    elements.menuItemModal.classList.remove('show');
    elements.menuItemForm.reset();
    editingItemId = null;
    clearImagePreview();
}

function updateImagePreview() {
    const imageUrl = document.getElementById('itemImage').value.trim();
    const preview = document.getElementById('imagePreview');
    
    if (!preview) return;
    
    if (imageUrl) {
        preview.innerHTML = `<img src="${imageUrl}" alt="Preview" onerror="this.parentElement.innerHTML='<p class=\'preview-error\'>Failed to load image. Please check the URL.</p>'">`;
    } else {
        clearImagePreview();
    }
}

function clearImagePreview() {
    const preview = document.getElementById('imagePreview');
    if (preview) {
        preview.innerHTML = '<p class="preview-placeholder">Image preview will appear here</p>';
    }
}

function generateSampleImage() {
    const itemName = document.getElementById('itemName').value.trim().toLowerCase();
    const imageInput = document.getElementById('itemImage');
    
    if (!itemName) {
        showToast('Please enter item name first', 'error');
        return;
    }
    
    // Map item names to better search terms for food images
    const searchTerms = {
        'idly': 'idli',
        'poori': 'puri',
        'dosa': 'dosa',
        'vada': 'vada',
        'samosa': 'samosa'
    };
    
    const searchTerm = searchTerms[itemName] || itemName;
    
    // Use Unsplash Source API for random food images
    // Alternative: Users can also use direct Unsplash URLs or other image services
    // Format: https://source.unsplash.com/400x300/?food,{searchTerm}
    const imageUrl = `https://source.unsplash.com/400x300/?food,${encodeURIComponent(searchTerm)}`;
    
    imageInput.value = imageUrl;
    updateImagePreview();
    showToast('Sample image generated from Unsplash! You can change the URL if needed.');
}

function handleMenuItemSubmit(e) {
    e.preventDefault();
    
    const formData = {
        id: editingItemId || Date.now(),
        name: document.getElementById('itemName').value.trim(),
        price: parseFloat(document.getElementById('itemPrice').value),
        image: document.getElementById('itemImage').value.trim(),
        description: document.getElementById('itemDescription').value.trim()
    };
    
    if (editingItemId) {
        const index = currentMenu.findIndex(m => m.id === editingItemId);
        if (index !== -1) {
            currentMenu[index] = { ...currentMenu[index], ...formData };
            showToast('Menu item updated successfully');
        }
    } else {
        currentMenu.push(formData);
        showToast('Menu item added successfully');
    }
    
    saveMenu();
    closeMenuItemModal();
}

function editMenuItem(id) {
    openMenuItemModal(id);
}

function deleteMenuItem(id) {
    if (confirm('Are you sure you want to delete this menu item?')) {
        currentMenu = currentMenu.filter(item => item.id !== id);
        saveMenu();
        showToast('Menu item deleted successfully');
    }
}

// Shopping Cart Operations
function loadCart() {
    const stored = localStorage.getItem(STORAGE_KEYS.CART);
    currentCart = stored ? JSON.parse(stored) : [];
    updateCart();
    updateCartWidget();
}

function saveCart() {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(currentCart));
    updateCart();
}

function addToCart(itemId) {
    const item = currentMenu.find(m => m.id === itemId);
    if (!item) return;
    
    const existingItem = currentCart.find(c => c.id === itemId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        currentCart.push({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: 1
        });
    }
    
    saveCart();
    showToast(`${item.name} added to cart`);
}

function removeFromCart(itemId) {
    currentCart = currentCart.filter(item => item.id !== itemId);
    saveCart();
}

function updateQuantity(itemId, change) {
    const item = currentCart.find(c => c.id === itemId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(itemId);
        } else {
            saveCart();
        }
    }
}

function clearCart() {
    if (currentCart.length === 0) return;
    
    if (confirm('Are you sure you want to clear the cart?')) {
        currentCart = [];
        saveCart();
        showToast('Cart cleared');
    }
}

function updateCart() {
    // Update cart count
    const totalItems = currentCart.reduce((sum, item) => sum + item.quantity, 0);
    elements.cartCount.textContent = totalItems;
    if (elements.floatingCartCount) {
        elements.floatingCartCount.textContent = totalItems;
        elements.floatingCartBtn.style.display = totalItems > 0 ? 'flex' : 'none';
    }
    
    // Calculate total
    const total = currentCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Update cart display
    if (currentCart.length === 0) {
        elements.cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        elements.cartTotal.textContent = '0';
        if (elements.cartSummaryContent) {
            elements.cartSummaryContent.innerHTML = '<p class="empty-cart-message">Your cart is empty</p>';
        }
        if (elements.cartWidgetTotal) {
            elements.cartWidgetTotal.textContent = '0';
        }
        if (elements.checkoutFromWidgetBtn) {
            elements.checkoutFromWidgetBtn.disabled = true;
        }
        if (elements.clearCartWidgetBtn) {
            elements.clearCartWidgetBtn.disabled = true;
        }
        return;
    }
    
    elements.cartItems.innerHTML = currentCart.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">€${item.price} each</div>
            </div>
            <div class="cart-item-controls">
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                <span class="quantity-display">${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                <button class="btn btn-danger btn-sm" onclick="removeFromCart(${item.id})" style="margin-left: 0.5rem;">Remove</button>
            </div>
        </div>
    `).join('');
    
    // Update total
    elements.cartTotal.textContent = total.toFixed(2);
    
    // Update cart widget
    updateCartWidget();
    
    // Update manager cart if in manager view
    if (!elements.managerView.classList.contains('hidden')) {
        renderManagerCart();
    }
}

function updateCartWidget() {
    if (!elements.cartSummaryContent) return;
    
    if (currentCart.length === 0) {
        elements.cartSummaryContent.innerHTML = '<p class="empty-cart-message">Your cart is empty</p>';
        if (elements.cartWidgetTotal) elements.cartWidgetTotal.textContent = '0';
        if (elements.checkoutFromWidgetBtn) elements.checkoutFromWidgetBtn.disabled = true;
        if (elements.clearCartWidgetBtn) elements.clearCartWidgetBtn.disabled = true;
        return;
    }
    
    const total = currentCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Show top 3 items in widget, or all if less than 3
    const displayItems = currentCart.slice(0, 3);
    const remainingCount = currentCart.length - 3;
    
    elements.cartSummaryContent.innerHTML = `
        <div class="cart-widget-items">
            ${displayItems.map(item => `
                <div class="cart-widget-item">
                    <span class="widget-item-name">${item.name}</span>
                    <span class="widget-item-qty">x${item.quantity}</span>
                    <span class="widget-item-price">€${(item.price * item.quantity).toFixed(2)}</span>
                </div>
            `).join('')}
            ${remainingCount > 0 ? `<p class="more-items">+${remainingCount} more item${remainingCount > 1 ? 's' : ''}</p>` : ''}
        </div>
    `;
    
    if (elements.cartWidgetTotal) {
        elements.cartWidgetTotal.textContent = total.toFixed(2);
    }
    if (elements.checkoutFromWidgetBtn) {
        elements.checkoutFromWidgetBtn.disabled = false;
    }
    if (elements.clearCartWidgetBtn) {
        elements.clearCartWidgetBtn.disabled = false;
    }
}

function renderManagerCart() {
    if (!elements.managerCartContent) return;
    
    if (currentCart.length === 0) {
        elements.managerCartContent.innerHTML = '<p class="placeholder-text">Cart is empty</p>';
        return;
    }
    
    const total = currentCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = total * 0.05;
    const grandTotal = total + tax;
    
    const cartHTML = `
        <div class="manager-cart-table">
            <table class="cart-table">
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    ${currentCart.map(item => `
                        <tr>
                            <td>${item.name}</td>
                            <td>€${item.price.toFixed(2)}</td>
                            <td>${item.quantity}</td>
                            <td>€${(item.price * item.quantity).toFixed(2)}</td>
                        </tr>
                    `).join('')}
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="3" style="text-align: right; font-weight: 600;">Subtotal:</td>
                        <td style="font-weight: 600;">€${total.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td colspan="3" style="text-align: right; font-weight: 600;">Tax (5%):</td>
                        <td style="font-weight: 600;">€${tax.toFixed(2)}</td>
                    </tr>
                    <tr class="cart-total-row">
                        <td colspan="3" style="text-align: right; font-weight: 700; font-size: 1.1rem;">Total:</td>
                        <td style="font-weight: 700; font-size: 1.1rem; color: #667eea;">€${grandTotal.toFixed(2)}</td>
                    </tr>
                </tfoot>
            </table>
        </div>
    `;
    
    elements.managerCartContent.innerHTML = cartHTML;
}

function printManagerCart() {
    if (currentCart.length === 0) {
        showToast('Cart is empty', 'error');
        return;
    }
    
    const total = currentCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = total * 0.05;
    const grandTotal = total + tax;
    const currentDate = new Date().toLocaleString();
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Cart Summary</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    padding: 20px;
                    max-width: 800px;
                    margin: 0 auto;
                }
                h1 {
                    color: #667eea;
                    text-align: center;
                    margin-bottom: 10px;
                }
                .date {
                    text-align: center;
                    color: #666;
                    margin-bottom: 30px;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 20px;
                }
                th {
                    background: #667eea;
                    color: white;
                    padding: 12px;
                    text-align: left;
                }
                td {
                    padding: 10px;
                    border-bottom: 1px solid #ddd;
                }
                tfoot tr {
                    border-top: 2px solid #667eea;
                }
                .total-row {
                    font-weight: 700;
                    font-size: 1.1rem;
                    color: #667eea;
                }
                @media print {
                    body {
                        padding: 0;
                    }
                }
            </style>
        </head>
        <body>
            <h1>Cart Summary</h1>
            <p class="date">Date: ${currentDate}</p>
            <table>
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    ${currentCart.map(item => `
                        <tr>
                            <td>${item.name}</td>
                            <td>€${item.price.toFixed(2)}</td>
                            <td>${item.quantity}</td>
                            <td>€${(item.price * item.quantity).toFixed(2)}</td>
                        </tr>
                    `).join('')}
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="3" style="text-align: right; font-weight: 600;">Subtotal:</td>
                        <td style="font-weight: 600;">€${total.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td colspan="3" style="text-align: right; font-weight: 600;">Tax (5%):</td>
                        <td style="font-weight: 600;">€${tax.toFixed(2)}</td>
                    </tr>
                    <tr class="total-row">
                        <td colspan="3" style="text-align: right; font-weight: 700; font-size: 1.1rem;">Total:</td>
                        <td style="font-weight: 700; font-size: 1.1rem; color: #667eea;">€${grandTotal.toFixed(2)}</td>
                    </tr>
                </tfoot>
            </table>
        </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
        printWindow.print();
    }, 250);
}

function toggleCart() {
    const isOpen = elements.cartSidebar.classList.contains('open');
    if (isOpen) {
        elements.cartSidebar.classList.remove('open');
        elements.cartOverlay.classList.remove('show');
    } else {
        elements.cartSidebar.classList.add('open');
        elements.cartOverlay.classList.add('show');
    }
}

// Billing/Invoice Operations
function generateInvoice() {
    if (currentCart.length === 0) {
        showToast('Cart is empty', 'error');
        return;
    }
    
    const invoiceId = Date.now();
    const invoiceDate = new Date().toLocaleString();
    const items = currentCart.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.price * item.quantity
    }));
    
    const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
    const tax = subtotal * 0.05; // 5% tax
    const total = subtotal + tax;
    
    const invoice = {
        id: invoiceId,
        date: invoiceDate,
        items: items,
        subtotal: subtotal,
        tax: tax,
        total: total
    };
    
    // Display invoice
    displayInvoice(invoice);
    elements.invoiceModal.classList.add('show');
    toggleCart(); // Close cart
}

function displayInvoice(invoice) {
    const invoiceHTML = `
        <div class="invoice-header">
            <h2>Restaurant Invoice</h2>
            <p>Invoice #${invoice.id}</p>
            <p>Date: ${invoice.date}</p>
        </div>
        <div class="invoice-details">
            <div class="invoice-item" style="font-weight: 600; border-bottom: 2px solid #ddd; padding-bottom: 0.5rem; margin-bottom: 0.5rem;">
                <span class="invoice-item-name">Item</span>
                <span class="invoice-item-qty">Qty</span>
                <span class="invoice-item-price">Price</span>
            </div>
            ${invoice.items.map(item => `
                <div class="invoice-item">
                    <span class="invoice-item-name">${item.name}</span>
                    <span class="invoice-item-qty">${item.quantity}</span>
                    <span class="invoice-item-price">€${item.subtotal.toFixed(2)}</span>
                </div>
            `).join('')}
            <div class="invoice-item" style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #ddd;">
                <span class="invoice-item-name">Subtotal</span>
                <span class="invoice-item-qty"></span>
                <span class="invoice-item-price">€${invoice.subtotal.toFixed(2)}</span>
            </div>
            <div class="invoice-item">
                <span class="invoice-item-name">Tax (5%)</span>
                <span class="invoice-item-qty"></span>
                <span class="invoice-item-price">€${invoice.tax.toFixed(2)}</span>
            </div>
            <div class="invoice-total">
                <span>Total</span>
                <span>€${invoice.total.toFixed(2)}</span>
            </div>
        </div>
        <div class="invoice-payment-qr-section">
            <div class="payment-total-display">
                <h3 class="payment-total-title">Final Payment Total</h3>
                <div class="payment-total-amount">€${invoice.total.toFixed(2)}</div>
            </div>
            <div class="invoice-qr-section">
                <h3>Payment QR Code</h3>
                <div id="invoiceQRCode" class="invoice-qrcode-container"></div>
                <p class="qr-instruction">Scan QR code to pay €${invoice.total.toFixed(2)}</p>
            </div>
        </div>
    `;
    
    elements.invoiceContent.innerHTML = invoiceHTML;
    elements.paymentAmount.textContent = invoice.total.toFixed(2);
    
    // Store invoice temporarily for payment
    window.currentInvoice = invoice;
    
    // Generate QR code for invoice with payment total
    generateInvoiceQRCode(invoice);
}

function closeInvoiceModal() {
    elements.invoiceModal.classList.remove('show');
}

function printInvoice() {
    window.print();
}

function saveInvoice(invoice) {
    invoices.push(invoice);
    localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(invoices));
    renderInvoiceHistory();
}

function loadInvoices() {
    const stored = localStorage.getItem(STORAGE_KEYS.INVOICES);
    invoices = stored ? JSON.parse(stored) : [];
    renderInvoiceHistory();
}

function renderInvoiceHistory() {
    if (invoices.length === 0) {
        elements.invoiceHistoryContent.innerHTML = '<p class="placeholder-text">No invoice history</p>';
        return;
    }
    
    elements.invoiceHistoryContent.innerHTML = invoices.map(invoice => `
        <div class="history-item">
            <div class="history-item-info">
                <h4>Invoice #${invoice.id}</h4>
                <p>${invoice.date} • ${invoice.items.length} items</p>
            </div>
            <div class="history-item-amount">€${invoice.total.toFixed(2)}</div>
        </div>
    `).join('');
}

// Generate QR Code for Invoice
function generateInvoiceQRCode(invoice) {
    const qrContainer = document.getElementById('invoiceQRCode');
    if (!qrContainer) return;
    
    // Clear previous QR code
    qrContainer.innerHTML = '';
    
    // Generate QR code with payment information including final total
    const paymentData = JSON.stringify({
        type: 'payment',
        amount: invoice.total.toFixed(2),
        currency: 'EUR',
        invoiceId: invoice.id,
        invoiceDate: invoice.date,
        items: invoice.items.length,
        message: `Payment for Invoice #${invoice.id} - Total: €${invoice.total.toFixed(2)}`
    });
    
    // Also create a simple text version for compatibility
    const paymentText = `PAYMENT\nAmount: €${invoice.total.toFixed(2)}\nInvoice: #${invoice.id}\nDate: ${invoice.date}\nItems: ${invoice.items.length}`;
    
    QRCode.toCanvas(qrContainer, paymentText, {
        width: 200,
        margin: 2,
        color: {
            dark: '#000000',
            light: '#FFFFFF'
        }
    }, function (error) {
        if (error) {
            console.error('QR Code generation error:', error);
            qrContainer.innerHTML = '<p style="text-align: center; color: #999;">QR Code generation failed</p>';
        }
    });
}

// Payment QR Code
function showPaymentQR() {
    if (!window.currentInvoice) return;
    
    const amount = window.currentInvoice.total;
    elements.paymentAmount.textContent = amount.toFixed(2);
    
    // Clear previous QR code
    elements.qrcode.innerHTML = '';
    
    // Generate QR code with payment information
    const paymentData = `Amount: €${amount.toFixed(2)}\nInvoice: #${window.currentInvoice.id}\nDate: ${window.currentInvoice.date}`;
    
    QRCode.toCanvas(elements.qrcode, paymentData, {
        width: 200,
        margin: 2,
        color: {
            dark: '#000000',
            light: '#FFFFFF'
        }
    }, function (error) {
        if (error) {
            console.error('QR Code generation error:', error);
            elements.qrcode.innerHTML = '<p>QR Code generation failed</p>';
        }
    });
    
    elements.paymentModal.classList.add('show');
}

function closePaymentModal() {
    elements.paymentModal.classList.remove('show');
}

function printQRCode() {
    if (!window.currentInvoice) return;
    
    // Get the canvas element
    const qrContainer = document.getElementById('qrcode');
    const canvas = qrContainer.querySelector('canvas');
    
    if (!canvas) {
        showToast('QR code not generated yet', 'error');
        return;
    }
    
    // Convert canvas to data URL
    const qrImage = canvas.toDataURL('image/png');
    const amount = elements.paymentAmount.textContent;
    
    // Open print window
    const printWindow = window.open('', '_blank');
    
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Payment QR Code</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    min-height: 100vh;
                    margin: 0;
                    padding: 20px;
                }
                h2 {
                    margin-bottom: 10px;
                    color: #333;
                }
                .amount {
                    font-size: 1.5rem;
                    font-weight: bold;
                    color: #667eea;
                    margin-bottom: 20px;
                }
                .qr-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 20px;
                    background: #f9f9f9;
                    border-radius: 8px;
                }
                .qr-container img {
                    max-width: 300px;
                    height: auto;
                }
                @media print {
                    body {
                        margin: 0;
                        padding: 0;
                    }
                    .qr-container {
                        background: white;
                        border: 1px solid #ddd;
                    }
                }
            </style>
        </head>
        <body>
            <h2>Payment QR Code</h2>
            <div class="amount">Amount: €${amount}</div>
            <div class="qr-container">
                <img src="${qrImage}" alt="Payment QR Code">
            </div>
            <p style="margin-top: 20px; color: #666;">Scan to complete payment</p>
        </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
        printWindow.print();
    }, 250);
}

function completePayment() {
    if (!window.currentInvoice) return;
    
    // Save invoice
    saveInvoice(window.currentInvoice);
    
    // Clear cart
    currentCart = [];
    saveCart();
    
    // Close modals
    closePaymentModal();
    closeInvoiceModal();
    
    // Clear current invoice
    window.currentInvoice = null;
    
    showToast('Payment completed successfully!');
}

// Manager Menu
function showManagerMenu() {
    elements.customerView.classList.add('hidden');
    elements.managerView.classList.remove('hidden');
    loadMenu();
    loadInvoices();
    loadCart();
    renderManagerCart();
}

function hideManagerMenu() {
    elements.managerView.classList.add('hidden');
    elements.customerView.classList.remove('hidden');
}

function switchTab(tabName) {
    // Update tab buttons
    elements.tabBtns.forEach(btn => {
        if (btn.dataset.tab === tabName) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Update tab content
    elements.tabContents.forEach(content => {
        if (content.id === tabName) {
            content.classList.add('active');
        } else {
            content.classList.remove('active');
        }
    });
    
    // Load data if needed
    if (tabName === 'invoice-history') {
        renderInvoiceHistory();
    } else if (tabName === 'manager-cart') {
        renderManagerCart();
    }
}

// Sales Report
function populateYearMonthDropdowns() {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    
    // Populate years (last 2 years and current)
    for (let year = currentYear - 2; year <= currentYear; year++) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        if (year === currentYear) option.selected = true;
        elements.reportYear.appendChild(option);
    }
    
    // Populate months
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    months.forEach((month, index) => {
        const option = document.createElement('option');
        option.value = index + 1;
        option.textContent = month;
        if (index + 1 === currentMonth) option.selected = true;
        elements.reportMonth.appendChild(option);
    });
}

function generateMonthlyReport() {
    const selectedMonth = parseInt(elements.reportMonth.value);
    const selectedYear = parseInt(elements.reportYear.value);
    
    if (!selectedMonth || !selectedYear) {
        showToast('Please select both month and year', 'error');
        return;
    }
    
    // Filter invoices by month and year
    const filteredInvoices = invoices.filter(invoice => {
        const invoiceDate = new Date(invoice.date);
        return invoiceDate.getMonth() + 1 === selectedMonth && 
               invoiceDate.getFullYear() === selectedYear;
    });
    
    if (filteredInvoices.length === 0) {
        elements.salesReportContent.innerHTML = '<p class="placeholder-text">No sales data for selected month</p>';
        return;
    }
    
    // Calculate statistics
    const totalRevenue = filteredInvoices.reduce((sum, inv) => sum + inv.total, 0);
    const totalOrders = filteredInvoices.length;
    
    // Calculate top items
    const itemSales = {};
    filteredInvoices.forEach(invoice => {
        invoice.items.forEach(item => {
            if (itemSales[item.name]) {
                itemSales[item.name] += item.quantity;
            } else {
                itemSales[item.name] = item.quantity;
            }
        });
    });
    
    const topItems = Object.entries(itemSales)
        .map(([name, qty]) => ({ name, quantity: qty }))
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5);
    
    // Calculate daily breakdown
    const dailySales = {};
    filteredInvoices.forEach(invoice => {
        const date = new Date(invoice.date).toLocaleDateString();
        if (dailySales[date]) {
            dailySales[date] += invoice.total;
        } else {
            dailySales[date] = invoice.total;
        }
    });
    
    const dailyBreakdown = Object.entries(dailySales)
        .map(([date, revenue]) => ({ date, revenue }))
        .sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Display report
    const reportHTML = `
        <div class="report-stats">
            <div class="stat-card">
                <h4>Total Revenue</h4>
                <div class="stat-value">€${totalRevenue.toFixed(2)}</div>
            </div>
            <div class="stat-card">
                <h4>Total Orders</h4>
                <div class="stat-value">${totalOrders}</div>
            </div>
            <div class="stat-card">
                <h4>Average Order</h4>
                <div class="stat-value">€${(totalRevenue / totalOrders).toFixed(2)}</div>
            </div>
        </div>
        
        <div class="top-items-list">
            <h3>Top Selling Items</h3>
            ${topItems.length > 0 ? topItems.map(item => `
                <div class="top-item">
                    <span>${item.name}</span>
                    <strong>${item.quantity} sold</strong>
                </div>
            `).join('') : '<p class="placeholder-text">No data available</p>'}
        </div>
        
        <div class="daily-breakdown">
            <h3>Daily Sales Breakdown</h3>
            ${dailyBreakdown.length > 0 ? dailyBreakdown.map(day => `
                <div class="daily-item">
                    <span>${day.date}</span>
                    <strong>€${day.revenue.toFixed(2)}</strong>
                </div>
            `).join('') : '<p class="placeholder-text">No data available</p>'}
        </div>
    `;
    
    elements.salesReportContent.innerHTML = reportHTML;
}

// Utility Functions
function showToast(message, type = 'success') {
    elements.toast.textContent = message;
    elements.toast.className = `toast ${type}`;
    elements.toast.classList.add('show');
    
    setTimeout(() => {
        elements.toast.classList.remove('show');
    }, 3000);
}

// Make functions globally available for onclick handlers
window.addToCart = addToCart;
window.updateQuantity = updateQuantity;
window.removeFromCart = removeFromCart;
window.editMenuItem = editMenuItem;
window.deleteMenuItem = deleteMenuItem;
window.showItemQRCode = showItemQRCode;
window.closeItemQRModal = closeItemQRModal;
window.printItemQRCode = printItemQRCode;
window.handleImageError = handleImageError;

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

