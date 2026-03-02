import { addToWishlist1 } from './WishList.js';
import { getAllProducts, toggleWishlist, isInWishlist, addToCart, getCartCount } from "../Js/services/storageService.js";

// Global helper to check if current user is a seller or admin
window.isSellerOrAdmin = function () {
    return !!(sessionStorage.getItem('currentSeller') || sessionStorage.getItem('currentAdmin'));
};

// Ensure globally available UI helpers
window.showBootstrapToast = function (message, type = 'success') {
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
        toastContainer.style.zIndex = '1055';
        document.body.appendChild(toastContainer);
    }

    const toastEl = document.createElement('div');
    const bgClass = type === 'success' ? 'bg-success' : 'bg-danger';
    const iconClass = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
    toastEl.className = `toast align-items-center text-white ${bgClass} border-0 fade show`;
    toastEl.setAttribute('role', 'alert');
    toastEl.setAttribute('aria-live', 'assertive');
    toastEl.setAttribute('aria-atomic', 'true');

    toastEl.innerHTML = `
      <div class="d-flex">
        <div class="toast-body">
          <i class="fas ${iconClass} me-2"></i> ${message}
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    `;

    const closeBtn = toastEl.querySelector('.btn-close');
    closeBtn.addEventListener('click', () => {
        toastEl.classList.remove('show');
        setTimeout(() => toastEl.remove(), 150);
    });

    toastContainer.appendChild(toastEl);

    setTimeout(() => {
        toastEl.classList.remove('show');
        setTimeout(() => toastEl.remove(), 150);
    }, 2500);
};

// Map existing showToast calls to the new Bootstrap Toast globally
window.showToast = window.showBootstrapToast;

// navbar.js - navbar functionality
document.addEventListener('DOMContentLoaded', () => {
    if (window.initSearchAutoSuggest) window.initSearchAutoSuggest();
    if (window.initMobileSearch) window.initMobileSearch();
});

let lastScrollTop = 0;

window.addEventListener('scroll', function () {
    const navbar = document.querySelector('.navbar-placeholder');
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > lastScrollTop && scrollTop > 100) {
        navbar.classList.add('scrolleddown');
        navbar.classList.remove('scrolledup');
    } else {
        navbar.classList.remove('scrolleddown');
        navbar.classList.add('scrolledup');
    }
    lastScrollTop = scrollTop;
});

function initAuthDisplay() {
    const authContainer = document.getElementById('nav-auth-container');
    if (!authContainer) return;

    const currentUser = JSON.parse(sessionStorage.getItem('currentUser')) || JSON.parse(sessionStorage.getItem('currentSeller')) || JSON.parse(sessionStorage.getItem('currentAdmin'));

    if (currentUser) {
        // Determine dashboard URL based on role
        let dashboardUrl = '../Pages/userdashboard.html';
        if (sessionStorage.getItem('currentSeller')) {
            dashboardUrl = '../Pages/Seller.html';
        } else if (sessionStorage.getItem('currentAdmin')) {
            dashboardUrl = '../Pages/Admin.html';
        }

        const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.Fname + ' ' + currentUser.Lname || 'User')}&background=00B207&color=fff&size=100`;
        authContainer.innerHTML = `
            <div class="dropdown">
                <a href="#" class="text-white text-decoration-none dropdown-toggle d-flex align-items-center" id="userDropdown" aria-expanded="false">
                    <img src="${avatarUrl}" alt="Avatar" class="rounded-circle me-2" style="width: 25px; height: 25px; object-fit: cover; border: 1px solid rgba(255,255,255,0.5);">
                    <span class="small fw-semibold">Hi, ${currentUser.Fname + ' ' + currentUser.Lname || 'User'}</span>
                </a>
                <ul class="dropdown-menu dropdown-menu-end shadow-sm border-0 mt-2" aria-labelledby="userDropdown">
                    <li><a class="dropdown-item small py-2" href="${dashboardUrl}"><i class="fa-solid fa-table-cells-large fa-sm me-2 text-muted"></i>My Dashboard</a></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item small py-2 text-danger" href="#" id="logoutBtn"><i class="fas fa-sign-out-alt fa-sm me-2"></i>Logout</a></li>
                </ul>
            </div>
        `;

        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                sessionStorage.removeItem('currentUser');
                sessionStorage.removeItem('RememberedUser');
                sessionStorage.removeItem('currentSeller');
                sessionStorage.removeItem('currentAdmin');
                sessionStorage.removeItem('MyCart');
                window.location.reload();
            });
        }

        // Manually initialize the dropdown to ensure it works properly
        // since dynamic injection sometimes bypasses Bootstrap's data-api
        const userDropdown = document.getElementById('userDropdown');
        if (userDropdown && window.bootstrap && bootstrap.Dropdown) {
            const bsDropdown = new bootstrap.Dropdown(userDropdown);
            userDropdown.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                bsDropdown.toggle();
            });
        }
    }

    // After auth is set up, apply role-based hiding (runs with correct timing)
    if (window.isSellerOrAdmin()) {
        // Hide navbar wishlist/cart
        const whishDiv = document.getElementById('Whish');
        if (whishDiv) {
            const wishlistBtn = whishDiv.querySelector('button[title="Wishlist"]');
            const cartBtn = document.getElementById('nabvar-cart');
            const cartrow = document.getElementById('cart-quantity-row');
            const cartBtns = whishDiv.querySelectorAll('.cart-btn');
            if (wishlistBtn) wishlistBtn.style.display = 'none';
            if (cartBtn) cartBtn.classList.add('d-none');
            if (cartrow) cartrow.classList.add('d-none');
            cartBtns.forEach(btn => btn.style.display = 'none');
        }
        // Hide product details cart row if on that page
        const cartRow = document.getElementById('cart-quantity-row');
        if (cartRow) cartRow.style.display = 'none';
    }
}

// Ensure globally available for dynamic loading
window.initNavBarAuth = initAuthDisplay;

// Hide wishlist and cart icons in navbar for sellers/admins
window.hideNavbarCartWishlistForRole = function () {
    if (window.isSellerOrAdmin()) {
        const whishDiv = document.getElementById('Whish');
        if (whishDiv) {
            // Hide the wishlist button (title="Wishlist"), not the mobile search toggle
            const wishlistBtn = whishDiv.querySelector('button[title="Wishlist"]');
            const cartBtn = whishDiv.querySelector('button[title="Cart"]');
            // Hide all cart buttons
            const cartBtns = whishDiv.querySelectorAll('.cart-btn');
            if (wishlistBtn) wishlistBtn.style.display = 'none';
            cartBtns.forEach(btn => btn.style.display = 'none');
        }
    }
};

// Hide footer cart/wishlist links for sellers/admins
window.hideFooterCartWishlistForRole = function () {
    if (window.isSellerOrAdmin()) {
        const cartLink = document.getElementById('footer-cart-link');
        const wishlistLink = document.getElementById('footer-wishlist-link');
        if (cartLink) cartLink.style.display = 'none';
        if (wishlistLink) wishlistLink.style.display = 'none';
    }
};

window.updateCartBadge = function () {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    let count = 0;
    let total = 0;
    if (currentUser) {
        const cartKey = 'cart';
        const usercart = JSON.parse(localStorage.getItem(cartKey));
        usercart.find(cart => {
            if (cart.userid === currentUser.id) {
                if (cart.items) {
                    cart.items.forEach(item => {
                        count += parseInt(item.quantity) || 0;
                        total += (parseFloat(item.price) || 0) * (parseInt(item.quantity) || 0);
                    });
                }
            }
        });
    }
    const badge = document.getElementById('cart-badge-count');
    if (badge) badge.textContent = count;
    const totalDisplay = document.getElementById('cart-badge-total');
    if (totalDisplay) totalDisplay.textContent = 'EGP ' + total.toFixed(2);
};

window.addToCartData = function (event, id, name, price, image) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!currentUser) {
        window.showBootstrapToast('Please login first to add items to cart.', 'error');
        return;
    }
    const cartKey = 'cart';
    let usercart = JSON.parse(localStorage.getItem(cartKey)) || { items: [] };
    usercart.find(cart => {
        if (cart.userid === currentUser.id) {
            usercart = cart;
        }
    });
    let products = JSON.parse(localStorage.getItem('products')) || [];
    products = products.find(p => p.product_id == id) || {};
    addToCart(products);

    window.dispatchEvent(new Event('storage'));
    if (window.updateCartBadge) window.updateCartBadge();

    // Show Toast
    window.showBootstrapToast(decodeURIComponent(name) + ' added to cart!', 'success');
};

window.addToWishlistData = function (event, id) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }

    // Intercept auth-check here to show toast instead of native modal in WishList.js
    const currentUser = sessionStorage.getItem('currentUser');
    if (!currentUser) {
        if (window.showBootstrapToast) {
            window.showBootstrapToast('Please login first to add items to wishlist.', 'error');
        }
        return;
    }

    console.log('Toggling wishlist:', id);
    addToWishlist1(id);
}

// Listen for wishlist changes and toggle heart icons across the page
window.addEventListener('wishlistChanged', function (e) {
    const { productId, action } = e.detail;

    // Find all wishlist heart icon buttons/links for this product
    document.querySelectorAll(`[onclick*="addToWishlistData(event, ${productId})"] i`).forEach(icon => {
        if (action === 'added') {
            icon.className = 'fas fa-heart text-success';
        } else {
            icon.className = 'far fa-heart';
        }
    });

    // Show toast for wishlist actions
    let products = JSON.parse(localStorage.getItem('products')) || [];
    let product = products.find(p => p.product_id == productId);
    let name = product ? product.name : "Item";

    if (window.showBootstrapToast) {
        if (action === 'added') {
            window.showBootstrapToast(`${name} added to wishlist! ♥`, 'success');
        } else {
            window.showBootstrapToast(`${name} removed from wishlist`, 'danger');
        }
    }
});


function initSearchAutoSuggest() {
    const searchInput = document.getElementById('navbarSearchInput');
    const searchBtn = document.getElementById('navbarSearchBtn');
    const suggestionsBox = document.getElementById('searchSuggestions');

    if (!searchInput || !suggestionsBox) return;

    // Helper to get products from localStorage

    searchInput.addEventListener('input', function () {
        const query = this.value.trim().toLowerCase();

        if (query.length === 0) {
            suggestionsBox.style.display = 'none';
            return;
        }

        const products = getAllProducts();

        // Filter products based on search query
        const matches = products.filter(p => {
            const pName = p.name || p.productName || "";
            const pCat = p.category || "";
            return pName.toLowerCase().includes(query) || pCat.toLowerCase().includes(query);
        }).slice(0, 5); // top 5 matches

        if (matches.length > 0) {
            suggestionsBox.innerHTML = matches.map(p => {
                const name = p.name || p.productName || "Unknown Product";
                const price = p.price || p.productPrice || 0;
                const image = (p.images && p.images[0]) || p.imageUrl || "https://images.unsplash.com/photo-1574577457582-8c88015ac502?q=80&w=200";

                return `
                <li>
                    <a class="dropdown-item d-flex align-items-center py-2 text-decoration-none" href="ProductDetails.html?id=${p.product_id}" style="border-bottom: 1px solid #f0f0f0;">
                        <img src="${image}" alt="${name}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 4px;" class="me-3">
                        <div class="flex-grow-1 overflow-hidden">
                            <span class="d-block fw-medium text-dark text-truncate" style="font-size: 0.9rem;">${name}</span>
                            <span class="text-success small fw-bold">EGP ${Number(price).toFixed(2)}</span>
                        </div>
                    </a>
                </li>
                `;
            }).join('');

            suggestionsBox.style.display = 'block';
        } else {
            suggestionsBox.innerHTML = '<li class="dropdown-item text-muted small py-2">No products found</li>';
            suggestionsBox.style.display = 'block';
        }
    });

    // Handle Enter key
    searchInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const query = this.value.trim();
            if (query) {
                window.location.href = `Product.html?search=${encodeURIComponent(query)}`;
            }
        }
    });

    // Handle search button click
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            const query = searchInput.value.trim();
            if (query) {
                window.location.href = `Product.html?search=${encodeURIComponent(query)}`;
            }
        });
    }

    // Hide dropdown when clicking outside
    document.addEventListener('click', function (e) {
        if (!searchInput.contains(e.target) && !suggestionsBox.contains(e.target)) {
            suggestionsBox.style.display = 'none';
        }
    });
}

// ── Mobile Search Toggle ──
function initMobileSearch() {
    const toggleBtn = document.getElementById('mobileSearchToggle');
    const mobileRow = document.getElementById('mobileSearchRow');
    const mobileInput = document.getElementById('mobileSearchInput');
    const mobileSuggest = document.getElementById('mobileSearchSuggestions');
    const mobileBtn = document.getElementById('mobileSearchBtn');

    if (!toggleBtn || !mobileRow) return;

    toggleBtn.addEventListener('click', () => {
        const isOpen = mobileRow.classList.contains('open');
        if (isOpen) {
            mobileRow.classList.remove('open');
        } else {
            mobileRow.classList.add('open');
            if (mobileInput) mobileInput.focus();
        }
    });

    if (!mobileInput || !mobileSuggest) return;

    // Auto-suggest for mobile
    mobileInput.addEventListener('input', function () {
        const query = this.value.trim().toLowerCase();
        if (query.length === 0) {
            mobileSuggest.style.display = 'none';
            return;
        }
        const products = getAllProducts();
        const matches = products.filter(p => {
            const pName = p.name || p.productName || '';
            const pCat = p.category || '';
            return pName.toLowerCase().includes(query) || pCat.toLowerCase().includes(query);
        }).slice(0, 5);

        if (matches.length > 0) {
            mobileSuggest.innerHTML = matches.map(p => {
                const name = p.name || p.productName || 'Unknown Product';
                const price = p.price || p.productPrice || 0;
                const image = (p.images && p.images[0]) || p.imageUrl || 'https://images.unsplash.com/photo-1574577457582-8c88015ac502?q=80&w=200';
                return `
                <li>
                    <a class="dropdown-item d-flex align-items-center py-2 text-decoration-none" href="ProductDetails.html?id=${p.product_id}" style="border-bottom: 1px solid #f0f0f0;">
                        <img src="${image}" alt="${name}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 4px;" class="me-3">
                        <div class="flex-grow-1 overflow-hidden">
                            <span class="d-block fw-medium text-dark text-truncate" style="font-size: 0.9rem;">${name}</span>
                            <span class="text-success small fw-bold">EGP ${Number(price).toFixed(2)}</span>
                        </div>
                    </a>
                </li>`;
            }).join('');
            mobileSuggest.style.display = 'block';
        } else {
            mobileSuggest.innerHTML = '<li class="dropdown-item text-muted small py-2">No products found</li>';
            mobileSuggest.style.display = 'block';
        }
    });

    mobileInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const query = this.value.trim();
            if (query) {
                window.location.href = `Product.html?search=${encodeURIComponent(query)}`;
            }
        }
    });

    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            const query = mobileInput.value.trim();
            if (query) {
                window.location.href = `Product.html?search=${encodeURIComponent(query)}`;
            }
        });
    }

    document.addEventListener('click', function (e) {
        if (!mobileInput.contains(e.target) && !mobileSuggest.contains(e.target) && !toggleBtn.contains(e.target)) {
            mobileSuggest.style.display = 'none';
        }
    });
}

// Make globally available
window.initSearchAutoSuggest = initSearchAutoSuggest;
window.initMobileSearch = initMobileSearch;
