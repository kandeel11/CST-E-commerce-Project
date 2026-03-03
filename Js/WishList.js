

let isGuest = false;
if (!sessionStorage.getItem('currentUser')) {
    isGuest = true;
}

import { removeFromWishlist, addToCart } from ".//services/storageService.js";

let current_user_Id = isGuest ? null : JSON.parse(sessionStorage.getItem('currentUser')).id;

// WishLists is now an object: { "Us-1": [product, ...], "Us-2": [product, ...] }
let wishlist_obj = JSON.parse(localStorage.getItem('WishLists')) || {};

export function addToWishlist1(productId) {
    if (!sessionStorage.getItem('currentUser')) {
        const loginModal = new bootstrap.Modal(document.getElementById('loginAlertModal'));
        loginModal.show();
        return;
    }
    const current_user_Id = JSON.parse(sessionStorage.getItem('currentUser')).id;
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

    // // If guest, show login modal and stop
    if (isGuest) {
        const loginModal = new bootstrap.Modal(document.getElementById('loginAlertModal'));
        loginModal.show();
        return;
    }

    checkWhichPage();

    loadComponents();

    let id = current_user_Id;
    wishlist_obj = JSON.parse(localStorage.getItem('WishLists')) || {};
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
            if (window.initSearchAutoSuggest) window.initSearchAutoSuggest();
            if (window.initMobileSearch) window.initMobileSearch();
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
            <button class="btn-add-cart" id="btn-add-cart-${product.product_id}" ${isOutOfStock ? 'disabled' : ''} title="${isOutOfStock ? 'Out of Stock' : 'Add to Cart'}">
                <i class="fas fa-shopping-cart"></i> ${isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
            </button>
            <button class="btn-dismiss" onclick="delett(event)" title="Remove">
                <i class="fa-solid fa-x"></i>
            </button>
        </div>
    </div>
    `;
}
document.getElementById('table_data').addEventListener('click', function (event) {
    if (event.target.closest('.btn-add-cart')) {
        const row = event.target.closest('.dismisser-row');
        const productId = row.dataset.id;

        // Get product from current user's wishlist (already has all fields)
        let wishlist_obj = JSON.parse(localStorage.getItem('WishLists')) || {};
        let userProducts = wishlist_obj[current_user_Id] || [];
        let product = userProducts.find(p => String(p.product_id) == String(productId));

        // Fallback: try localStorage "products" key
        if (!product) {
            let allProducts = JSON.parse(localStorage.getItem('products')) || [];
            product = allProducts.find(p => String(p.product_id) == String(productId));
        }

        if (product && product.stock > 0) {
            const result = addToCart(product);
            if (result) {
                if (window.updateCartBadge) window.updateCartBadge();
                showToast(`🛒 ${product.name} added to cart!`);
            } else {
                showToast(`⚠️ Stock limit reached for ${product.name}`, 'warning');
            }
        } else if (product) {
            showToast(`❌ ${product.name} is out of stock`, 'error');
        }
    }
});



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

        // const productId = Number(el.dataset.id);
        const productId = el.dataset.id; // Keep as string for comparison in wishlist_obj);

        // Remove from WishLists key in localStorage (use == for type safety)
        let wishlist_obj = JSON.parse(localStorage.getItem('WishLists')) || {};
        let userProducts = wishlist_obj[current_user_Id] || [];
        wishlist_obj[current_user_Id] = userProducts.filter(p => p.product_id != productId);
        localStorage.setItem('WishLists', JSON.stringify(wishlist_obj));
        localStorage.setItem("wishUpdated", Date.now());
        // Also remove via storageService (wrapped in try-catch to not block DOM removal)
        try {
            removeFromWishlist(productId);
        } catch (e) {
            console.warn('storageService removeFromWishlist error:', e);
        }

        // Dispatch event so heart icons update on other pages
        window.dispatchEvent(new CustomEvent('wishlistChanged', { detail: { productId, action: 'removed' } }));

        // Remove from DOM
        el.remove();
    }

    checkEmpty();
}


function checkEmpty() {
    const tableData = document.getElementById('table_data');
    const emptyState = document.getElementById('empty-state');
    if (emptyState) {
        const hasItems = tableData.querySelectorAll('.dismisser-row').length > 0;
        emptyState.classList.toggle('d-none', hasItems);
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
