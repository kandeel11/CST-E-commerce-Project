

let isGuest = false;
if (!localStorage.getItem('currentUser')) {
    isGuest = true;
}

let current_user_Id = isGuest ? null : JSON.parse(localStorage.getItem('currentUser')).id;

// WishLists is now an object: { "Us-1": [product, ...], "Us-2": [product, ...] }
let wishlist_obj = JSON.parse(localStorage.getItem('WishLists')) || {};

export function addToWishlist1(productId) {
    if (!localStorage.getItem('currentUser')) {
        const loginModal = new bootstrap.Modal(document.getElementById('loginAlertModal'));
        loginModal.show();
        return;
    }
    const current_user_Id = JSON.parse(localStorage.getItem('currentUser')).id;
    const id = current_user_Id;

    let wishlist_obj = JSON.parse(localStorage.getItem('WishLists')) || {};

    // Ensure the user has an array
    if (!wishlist_obj[id]) {
        wishlist_obj[id] = [];
    }

    addToWishlistAsync(id, productId, wishlist_obj);
}

async function addToWishlistAsync(userId, productId, wishlist_obj) {
    let allProducts = await fetchProducts();
    const product = allProducts.find(p => p.product_id === productId);
    if (!product) return;

    const idx = wishlist_obj[userId].findIndex(item => item.product_id === productId);
    if (idx === -1) {
        // Add to wishlist
        wishlist_obj[userId].push(product);
        localStorage.setItem('WishLists', JSON.stringify(wishlist_obj));
        localStorage.setItem("wishUpdated", Date.now());
        showToast(`${product.name} added to wishlist! ♥`, 'success');
        // Dispatch event so the UI can update heart icons
        window.dispatchEvent(new CustomEvent('wishlistChanged', { detail: { productId, action: 'added' } }));
    } else {
        // Remove from wishlist
        wishlist_obj[userId].splice(idx, 1);
        localStorage.setItem('WishLists', JSON.stringify(wishlist_obj));
        localStorage.setItem("wishUpdated", Date.now());
        showToast(`${product.name} removed from wishlist`, 'success');
        // Dispatch event so the UI can update heart icons
        window.dispatchEvent(new CustomEvent('wishlistChanged', { detail: { productId, action: 'removed' } }));
    }
}

function checkWhichPage() {
    const wl = JSON.parse(localStorage.getItem('WishLists')) || {};
    const userProducts = wl[current_user_Id];
    if (!userProducts || userProducts.length === 0) {
        checkEmpty();
    } else {
        document.getElementById('empty-state').classList.add('d-none');
    }
}

async function fetchProducts() {
    try {
        const response = await fetch('../Data/ecobazar.json');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const products = await response.json();
        return Object.values(products).flat();
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
}


window.addEventListener('load', function () {

    checkWhichPage();

    loadComponents();

    let id = current_user_Id;
    wishlist_obj = JSON.parse(localStorage.getItem('WishLists')) || {};
    console.log(id);
    console.log(wishlist_obj[id]);

    Restore_data(id);





})

function loadComponents() {
    // 1. Load Navbar
    fetch('../Pages/NavBar.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('navbar-placeholder').innerHTML = data;

            // Re-run NavBar initialization since the HTML is dynamically loaded
            if (window.initNavBarAuth) window.initNavBarAuth();
            if (window.initBreadcrumb) window.initBreadcrumb();
            if (window.updateCartBadge) window.updateCartBadge();
        })
        .catch(error => console.error('Error loading navbar:', error));

    // 2. Load Footer
    fetch('../Pages/Footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-placeholder').innerHTML = data;
        })
        .catch(error => console.error('Error loading footer:', error));
}


function createProductCard(product) {
    const mainImg = product.images && product.images.length > 0 ? product.images[0] : '';
    const stockText = getStockText(product.stock);
    const isOutOfStock = product.stock <= 0;

    return `
     <div class="dismisser-row" data-id="${product.product_id}">
        <div class="dismisser-col-product">
            <img src="${mainImg}" alt="${product.name}" loading="lazy" onerror="this.src='https://via.placeholder.com/400x400?text=No+Image'">
            <p class="dismisser-product-name">${product.name}</p>
        </div>
        <div class="dismisser-col-price">
            <p class="dismisser-price">$${product.price.toFixed(2)}</p>
        </div>
        <div class="dismisser-col-stock">
            <span class="stock-badge ${product.stock > 0 ? 'stock-available' : 'stock-out'}">
                ${product.stock > 0 ? 'Available' : 'Out of Stock'}
            </span>
        </div>
        <div class="dismisser-col-actions">
            <button class="btn-add-cart" onclick="addToCart(${product.product_id})" ${isOutOfStock ? 'disabled' : ''}>
                <i class="fas fa-shopping-cart"></i> ${isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
            </button>
            <button class="btn-dismiss" onclick="delett(event)" title="Remove">
                <i class="fa-solid fa-x"></i>
            </button>
        </div>
    </div>
    `;
}


function getStockText(stock) {
    if (stock <= 0) return 'Out of Stock';
    if (stock <= 10) return `Only ${stock} left!`;
    return `In Stock (${stock})`;
}


function delett(event) {
    let el = event.target;
    while (el && !el.dataset.id) {
        el = el.parentElement;
    }
    if (el && el.dataset.id) {
        const productId = Number(el.dataset.id);
        let wishlist_obj = JSON.parse(localStorage.getItem('WishLists')) || {};
        let userProducts = wishlist_obj[current_user_Id] || [];
        const idx = userProducts.findIndex(p => p.product_id === productId);
        if (idx !== -1) {
            userProducts.splice(idx, 1);
            wishlist_obj[current_user_Id] = userProducts;
            localStorage.setItem('WishLists', JSON.stringify(wishlist_obj));
        }
        el.remove();
    }

    checkEmpty();
}


function checkEmpty() {
    const tableData = document.getElementById('table_data');
    const emptyState = document.getElementById('empty-state');
    if (emptyState) {
        emptyState.classList.toggle('d-none', !(tableData.children.length === 0 && tableData.innerHTML.trim() === ''));
    }
}


function Restore_data(id) {
    let wishlist_obj = JSON.parse(localStorage.getItem('WishLists')) || {};
    let userProducts = wishlist_obj[id];

    if (!userProducts || userProducts.length === 0) {
        return;
    }
    for (let i = 0; i < userProducts.length; i++) {
        document.getElementById('table_data').innerHTML = createProductCard(userProducts[i]) + document.getElementById('table_data').innerHTML;
    }
}
window.addEventListener("storage", function (event) {
    if (event.key === 'wishUpdated') {
        this.window.location.reload();
    }
});

window.addToWishlist1 = addToWishlist1;
window.delett = delett;
