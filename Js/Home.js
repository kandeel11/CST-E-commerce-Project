import { User } from "../Js/Classes/User.js";

document.addEventListener("DOMContentLoaded", () => {

    if (!localStorage.getItem("users")) {
        const now = new Date().toISOString();
        const defaultUsers = [
            // ── Admin ──────────────────────────────────────────────
            {
                id: "Admin-1",
                Fname: "Mohamed", Lname: "Admin",
                Role: "Admin",
                Email: "admin@ecobazar.com",
                password: "Admin123!",
                address: "1 Admin St, Cairo, Egypt",
                Phone: "0100000001",
                Active: true,
                dateCreated: now
            },
            // ── Default Customers ──────────────────────────────────
            {
                id: "Us-1",
                Fname: "Alice", Lname: "Johnson",
                Role: "User",
                Email: "alice@ecobazar.com",
                password: "Customer1!",
                address: "10 Oak Ave, New York, USA",
                Phone: "0111111111",
                Active: true,
                dateCreated: now
            },
            {
                id: "Us-2",
                Fname: "Bob", Lname: "Smith",
                Role: "User",
                Email: "bob@ecobazar.com",
                password: "Customer2!",
                address: "22 Pine Rd, London, UK",
                Phone: "0122222222",
                Active: true,
                dateCreated: now
            },
            {
                id: "Us-3",
                Fname: "Carol", Lname: "Williams",
                Role: "User",
                Email: "carol@ecobazar.com",
                password: "Customer3!",
                address: "5 Maple Blvd, Toronto, Canada",
                Phone: "0133333333",
                Active: true,
                dateCreated: now
            },
            // ── Default Sellers (SLR-1 … SLR-12) ──────────────────
            {
                id: "SLR-1",
                Fname: "Nature's Best", Lname: "Organics",
                Role: "Seller",
                Email: "seller1@ecobazar.com",
                password: "Seller001!",
                address: "100 Farm Lane, California, USA",
                Phone: "0141414141",
                Active: true,
                dateCreated: now,
                rating: 4.8,
                location: "California, USA",
                totalProducts: 12,
                description: "Certified organic produce and natural foods since 2010."
            },
            {
                id: "SLR-2",
                Fname: "Green Valley", Lname: "Farms",
                Role: "Seller",
                Email: "seller2@ecobazar.com",
                password: "Seller002!",
                address: "200 Valley Rd, Oregon, USA",
                Phone: "0142424242",
                Active: true,
                dateCreated: now,
                rating: 4.7,
                location: "Oregon, USA",
                totalProducts: 15,
                description: "Family-owned farm delivering fresh vegetables and produce daily."
            },
            {
                id: "SLR-3",
                Fname: "Berry Fields", Lname: "Co.",
                Role: "Seller",
                Email: "seller3@ecobazar.com",
                password: "Seller003!",
                address: "300 Berry St, Washington, USA",
                Phone: "0143434343",
                Active: true,
                dateCreated: now,
                rating: 4.9,
                location: "Washington, USA",
                totalProducts: 8,
                description: "Specializing in premium organic berries and small fruits."
            },
            {
                id: "SLR-4",
                Fname: "Prairie Ranch", Lname: "Meats",
                Role: "Seller",
                Email: "seller4@ecobazar.com",
                password: "Seller004!",
                address: "400 Ranch Rd, Texas, USA",
                Phone: "0144444444",
                Active: true,
                dateCreated: now,
                rating: 4.8,
                location: "Texas, USA",
                totalProducts: 10,
                description: "Grass-fed, free-range meats from sustainable ranch operations."
            },
            {
                id: "SLR-5",
                Fname: "Tropical Bliss", Lname: "Imports",
                Role: "Seller",
                Email: "seller5@ecobazar.com",
                password: "Seller005!",
                address: "500 Palm Ave, Florida, USA",
                Phone: "0145454545",
                Active: true,
                dateCreated: now,
                rating: 4.6,
                location: "Florida, USA",
                totalProducts: 7,
                description: "Importing the finest tropical fruits and coconut products."
            },
            {
                id: "SLR-6",
                Fname: "Ocean Fresh", Lname: "Seafood",
                Role: "Seller",
                Email: "seller6@ecobazar.com",
                password: "Seller006!",
                address: "600 Harbor Rd, Maine, USA",
                Phone: "0146464646",
                Active: true,
                dateCreated: now,
                rating: 4.9,
                location: "Maine, USA",
                totalProducts: 9,
                description: "Wild-caught sustainable seafood, fresh from the Atlantic coast."
            },
            {
                id: "SLR-7",
                Fname: "Green Pastures", Lname: "Dairy",
                Role: "Seller",
                Email: "seller7@ecobazar.com",
                password: "Seller007!",
                address: "700 Dairy Ln, Vermont, USA",
                Phone: "0147474747",
                Active: true,
                dateCreated: now,
                rating: 4.7,
                location: "Vermont, USA",
                totalProducts: 11,
                description: "Organic dairy from pasture-raised, grass-fed cows."
            },
            {
                id: "SLR-8",
                Fname: "Countryside Dairy", Lname: "Artisans",
                Role: "Seller",
                Email: "seller8@ecobazar.com",
                password: "Seller008!",
                address: "800 Cheese Way, Wisconsin, USA",
                Phone: "0148484848",
                Active: true,
                dateCreated: now,
                rating: 4.8,
                location: "Wisconsin, USA",
                totalProducts: 8,
                description: "Handcrafted artisan cheeses using traditional European methods."
            },
            {
                id: "SLR-9",
                Fname: "Golden Crust", Lname: "Bakery",
                Role: "Seller",
                Email: "seller9@ecobazar.com",
                password: "Seller009!",
                address: "900 Bakery Ave, New York, USA",
                Phone: "0149494949",
                Active: true,
                dateCreated: now,
                rating: 4.9,
                location: "New York, USA",
                totalProducts: 10,
                description: "Artisan bread and bakery goods made with organic ingredients."
            },
            {
                id: "SLR-10",
                Fname: "Sweet Harvest", Lname: "Treats",
                Role: "Seller",
                Email: "seller10@ecobazar.com",
                password: "Seller010!",
                address: "1000 Sweet St, Pennsylvania, USA",
                Phone: "0150505050",
                Active: true,
                dateCreated: now,
                rating: 4.7,
                location: "Pennsylvania, USA",
                totalProducts: 9,
                description: "Premium baked goods and chocolate treats made with real ingredients."
            },
            {
                id: "SLR-11",
                Fname: "Sunrise Beverages", Lname: "Co.",
                Role: "Seller",
                Email: "seller11@ecobazar.com",
                password: "Seller011!",
                address: "1100 Sunrise Blvd, Georgia, USA",
                Phone: "0151515151",
                Active: true,
                dateCreated: now,
                rating: 4.8,
                location: "Georgia, USA",
                totalProducts: 12,
                description: "Cold-pressed juices, organic teas, and specialty coffee roasters."
            },
            {
                id: "SLR-12",
                Fname: "Crystal Springs", Lname: "Water Co.",
                Role: "Seller",
                Email: "seller12@ecobazar.com",
                password: "Seller012!",
                address: "1200 Spring Rd, Colorado, USA",
                Phone: "0152525252",
                Active: true,
                dateCreated: now,
                rating: 4.5,
                location: "Colorado, USA",
                totalProducts: 5,
                description: "Natural spring water and sparkling beverages from mountain sources."
            }
        ];
        localStorage.setItem("users", JSON.stringify(defaultUsers));
    }
    if (!localStorage.getItem("products")) {
        fetch("../Data/ecobazar.json")
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then(data => {
                const products = Object.values(data).flat();
                localStorage.setItem('products', JSON.stringify(products));
                window.location.reload();
            })
            .catch(error => {
                console.error("There was an error loading the data:", error);
            });
    }

    loadComponents();
    loadData();
    initCountdown();
    // Check if we need to show a login toast
    if (sessionStorage.getItem("showLoginToast") === "true") {
        const currentUser = JSON.parse(sessionStorage.getItem("currentUser")) || JSON.parse(sessionStorage.getItem("currentSeller"));
        if (currentUser) {
            showWelcomeToast(`Welcome back ${currentUser.name} ${currentUser.Role || ''}!`);
        }
        sessionStorage.removeItem("showLoginToast");
    }
});

window.addEventListener('storage', (event) => {
    if (event.key === 'products') {
        loadData();
    }
});
function showWelcomeToast(message) {
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
        toastContainer.style.zIndex = '1055';
        document.body.appendChild(toastContainer);
    }
    const toastEl = document.createElement('div');
    toastEl.className = `toast align-items-center text-white bg-success border-0 fade show`;
    toastEl.setAttribute('role', 'alert');
    toastEl.setAttribute('aria-live', 'assertive');
    toastEl.setAttribute('aria-atomic', 'true');
    toastEl.innerHTML = `
      <div class="d-flex">
        <div class="toast-body">
          ${message}
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
    }, 3000);
}
// Countdown timer for promo section
function initCountdown() {
    const now = new Date();
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    function update() {
        const diff = endOfMonth - new Date();
        if (diff <= 0) return;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const mins = Math.floor((diff / (1000 * 60)) % 60);
        const secs = Math.floor((diff / 1000) % 60);
        const el = (id) => document.getElementById(id);
        if (el('cd-days')) el('cd-days').textContent = String(days).padStart(2, '0');
        if (el('cd-hours')) el('cd-hours').textContent = String(hours).padStart(2, '0');
        if (el('cd-mins')) el('cd-mins').textContent = String(mins).padStart(2, '0');
        if (el('cd-secs')) el('cd-secs').textContent = String(secs).padStart(2, '0');
    }
    update();
    setInterval(update, 1000);
}
function loadComponents() {
    // 1. Load Navbar
    fetch('NavBar.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('navbar-placeholder').innerHTML = data;
            // Re-run NavBar initialization since the HTML is dynamically loaded
            if (window.initNavBarAuth) window.initNavBarAuth();
            if (window.initSearchAutoSuggest) window.initSearchAutoSuggest();
            if (window.initMobileSearch) window.initMobileSearch();
            if (window.updateCartBadge) window.updateCartBadge();
            if (window.hideNavbarCartWishlistForRole) window.hideNavbarCartWishlistForRole();
        })
        .catch(error => console.error('Error loading navbar:', error));
    // 2. Load Footer
    fetch('Footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-placeholder').innerHTML = data;
            if (window.hideFooterCartWishlistForRole) window.hideFooterCartWishlistForRole();
        })
        .catch(error => console.error('Error loading footer:', error));
}
// Fetch JSON data and render sections
// Fetch data from local storage or fallback to JSON and render sections
function loadData() {
    let products = JSON.parse(localStorage.getItem('products'));
    if (products && products.length > 0) {
        const data = {};
        products.forEach(p => {
            const cat = p.category || "Uncategorized";
            if (!data[cat]) data[cat] = [];
            data[cat].push(p);
        });
        renderCategories(data);
        renderProducts(data);
        renderHotDeals(data);
    }

}





// ========== CATEGORIES ==========
const categoryMeta = {
    Fruits: { name: "Fruits", icon: "fa-apple-alt" },
    Vegetables: { name: "Vegetables", icon: "fa-carrot" },
    MeatFish: { name: "Meat & Fish", icon: "fa-drumstick-bite" },
    Dairy: { name: "Dairy", icon: "fa-cheese" },
    Bakery: { name: "Bread & Bakery", icon: "fa-bread-slice" },
    Beverages: { name: "Beverages", icon: "fa-mug-hot" }
};
function renderCategories(data) {
    const container = document.getElementById('categories-container');
    if (!container) return;
    const categoryKeys = Object.keys(data).filter(key => Array.isArray(data[key]) && key !== 'Sellers');
    container.innerHTML = categoryKeys.map(key => {
        const meta = categoryMeta[key] || { name: key, icon: "fa-box" };
        const count = data[key].length;
        return `
            <div class="col">
            <a href="Product.html?category=${encodeURIComponent(key)}" class="text-decoration-none text-green">
            <div class="category-card">
            <i class="fas ${meta.icon} category-icon"></i>
            <h6 class="small fw-bold mb-0">${meta.name}</h6>
            <small class="text-muted">${count} Products</small>
            </div>
            </a>
            </div>
        `;
    }).join('');
}
// ========== PRODUCTS ==========
function renderProducts(data) {
    const container = document.getElementById('featured-products-container');
    if (!container) return;
    // Collect all products from all categories
    let allProducts = [];
    for (const category in data) {
        if (Array.isArray(data[category]) && category !== 'Sellers') {
            allProducts = allProducts.concat(data[category]);
        }
    }
    // Pick first 10 products for the homepage
    const featured = allProducts.slice(0, 10);
    // Get current user wishlist for heart icons
    let wishlistIds = [];
    const user = JSON.parse(sessionStorage.getItem('currentUser'));
    if (user) {
        const wl = JSON.parse(localStorage.getItem('WishLists')) || {};
        const userProducts = wl[user.id] || [];
        for (let i = 0; i < userProducts.length; i++) {
            if (userProducts[i].product_id) {
                wishlistIds.push(userProducts[i].product_id);
            }
        }
    }
    container.innerHTML = featured.map(product => {
        const imgSrc = product.img || product.image || (product.images && product.images[0]) || '';
        const name = product.name || 'Product';
        const price = product.price || 0;
        const oldPrice = product.oldPrice || null;
        const discount = product.discount || 0;
        // Calculate average rating from reviews
        let avgRating = product.rating || 0;
        if (product.reviews && product.reviews.length > 0 && avgRating === 0) {
            const sum = product.reviews.reduce((acc, r) => acc + r.rating, 0);
            avgRating = Math.round(sum / product.reviews.length);
        }
        // Generate stars HTML
        const starsHtml = Array.from({ length: 5 }, (_, i) =>
            `<i class="fas fa-star${i < avgRating ? '' : '-half-alt'}" style="color: ${i < avgRating ? '#FF8A00' : '#ddd'}"></i>`
        ).join('');
        // Discount badge
        const badgeHtml = discount > 0
            ? `<div class="sale-badge">Sale ${discount}%</div>`
            : '';
        // Old price
        const oldPriceHtml = oldPrice
            ? `<small class="text-muted text-decoration-line-through">EGP ${oldPrice.toLocaleString()}</small>`
            : '';
        // Heart Icon status
        const isWished = wishlistIds.includes(product.product_id || 0);
        const heartIconCls = isWished ? 'fas fa-heart text-success' : 'far fa-heart';
        return `
            <div class="col">
                <div class="card product-card h-100 position-relative">
                    ${badgeHtml}
                    <!-- Action Icons on Hover -->
                    <div class="product-action-icons z-2">
                        <a href="ProductDetails.html?id=${product.product_id || 0}" class="action-icon-btn" title="Quick View">
                            <i class="far fa-eye"></i>
                        </a>
                        ${window.isSellerOrAdmin && window.isSellerOrAdmin() ? '' : `<a href="#" class="action-icon-btn" title="Add to Wishlist" onclick="window.addToWishlistData(event, ${product.product_id || 0})">
                            <i class="${heartIconCls}"></i>
                        </a>`}
                    </div>
                    <a href="ProductDetails.html?id=${product.product_id || 0}" class="d-block text-decoration-none text-dark position-relative z-1">
                        <img src="${imgSrc}" class="card-img-top mx-auto d-block" alt="${name}" style="object-fit: contain; max-height: 200px;">
                    </a>
                    <div class="card-body d-flex flex-column z-1">
                        <a href="ProductDetails.html?id=${product.product_id || 0}" class="text-decoration-none text-dark">
                            <h6 class="card-title text-truncate mb-1">${name}</h6>
                        </a>
                        <div class="d-flex justify-content-between align-items-center mt-auto">
                            <div>
                                <span class="fw-bold">EGP ${price.toLocaleString()}</span>
                                ${oldPriceHtml}
                                <div class="small">${starsHtml}</div>
                            </div>
                            
                            ${window.isSellerOrAdmin && window.isSellerOrAdmin() || window.isOutOfStock(product.product_id || 0) ? '' : `<button class="add-btn-circle" onclick="window.addToCartData(event, ${product.product_id || 0}, '${encodeURIComponent(name).replace(/'/g, "%27")}', ${price}, '${imgSrc}')"><i class="fas fa-shopping-bag"></i></button>`}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}
// ========== HOT DEALS ==========
function renderHotDeals(data) {
    const container = document.getElementById('hot-deals-container');
    if (!container) return;
    // Collect all products and sort by discount descending
    let allProducts = [];
    for (const category in data) {
        if (Array.isArray(data[category]) && category !== 'Sellers') {
            allProducts = allProducts.concat(data[category]);
        }
    }
    allProducts.sort((a, b) => (b.discount || 0) - (a.discount || 0));
    const featured = allProducts[0];
    const gridProducts = allProducts.slice(1, 10);
    // Get current user wishlist for heart icons
    let wishlistIds = [];
    const user = JSON.parse(sessionStorage.getItem('currentUser'));
    if (user) {
        const wl = JSON.parse(localStorage.getItem('WishLists')) || {};
        const userProducts = wl[user.id] || [];
        wishlistIds = userProducts.map(i => i.product_id);
    }
    // Helper: generate stars
    function starsHtml(rating) {
        return Array.from({ length: 5 }, (_, i) =>
            `<i class="fas fa-star" style="color: ${i < rating ? '#FF8A00' : '#ddd'}; font-size: 0.7rem;"></i>`
        ).join('');
    }
    // Featured card (left)
    const featImg = featured.img || featured.image || (featured.images && featured.images[0]) || '';
    const featReviewCount = featured.reviews ? featured.reviews.length * 100 + 24 : 0;
    const featuredHtml = `
        <div class="col-lg-5">
            <div class="hot-deal-featured card border rounded-3 h-100">
                <div class="position-relative p-3">
                    <div class="d-flex gap-2 position-absolute top-0 start-0 m-3 z-1">
                        <span class="badge bg-danger">Sale ${featured.discount}%</span>
                        ${featured.monthSale ? '<span class="badge bg-primary">Best Sale</span>' : ''}
                    </div>
                    <a href="ProductDetails.html?id=${featured.product_id || 0}" class="d-block text-center">
                        <img src="${featImg}" class="w-100 rounded" alt="${featured.name}" style="height: 260px; object-fit: contain;">
                    </a>
                    <div class="d-flex align-items-center gap-2 mt-3">
                        ${window.isSellerOrAdmin && window.isSellerOrAdmin() ? '' : `<button class="btn btn-outline-secondary btn-sm rounded-circle" style="width:36px;height:36px;" onclick="window.addToWishlistData(event, ${featured.product_id || 0})"><i class="${wishlistIds.includes(featured.product_id || 0) ? 'fas fa-heart text-success' : 'far fa-heart'}"></i></button>`}
                        ${window.isSellerOrAdmin && window.isSellerOrAdmin() || window.isOutOfStock(featured.product_id || 0) ? '' : `<a href="#" class="btn btn-sm rounded-pill flex-grow-1 fw-semibold py-2" style="background:var(--primary-green);color:#fff;" onclick="window.addToCartData(event, ${featured.product_id || 0}, '${encodeURIComponent(featured.name).replace(/'/g, "%27")}', ${featured.price}, '${featImg}')">
                            <i class="fas fa-shopping-bag me-1"></i> Add to Cart
                        </a>`}
                        <a href="ProductDetails.html?id=${featured.product_id || 0}" class="btn btn-outline-secondary btn-sm rounded-circle d-flex justify-content-center align-items-center text-decoration-none" style="width:36px;height:36px;"><i class="far fa-eye"></i></a>
                    </div>
                </div>
                <div class="card-body text-center">
                    <a href="ProductDetails.html?id=${featured.product_id || 0}" class="text-green text-decoration-none fw-medium">${featured.name}</a>
                    <div class="mt-1">
                        <span class="fw-bold fs-5">EGP ${featured.price.toFixed(2)}</span>
                        ${featured.oldPrice ? `<small class="text-muted text-decoration-line-through ms-1">EGP ${featured.oldPrice.toFixed(2)}</small>` : ''}
                    </div>
                    <div class="my-1">${starsHtml(featured.rating)} <small class="text-muted">(${featReviewCount} Feedback)</small></div>
                    <p class="text-muted small mb-2">Hurry up! Offer ends in:</p>
                    <div class="d-flex justify-content-center gap-2">
                        <div class="deal-timer-box"><span id="hd-days">00</span><small>DAYS</small></div>
                        <span class="deal-timer-sep">:</span>
                        <div class="deal-timer-box"><span id="hd-hours">00</span><small>HOURS</small></div>
                        <span class="deal-timer-sep">:</span>
                        <div class="deal-timer-box"><span id="hd-mins">00</span><small>MINS</small></div>
                        <span class="deal-timer-sep">:</span>
                        <div class="deal-timer-box"><span id="hd-secs">00</span><small>SECS</small></div>
                    </div>
                </div>
            </div>
        </div>`;
    const gridHtml = gridProducts.map(p => {
        const img = p.img || p.image || (p.images && p.images[0]) || '';
        const oldPriceHtml = p.oldPrice ? `<small class="text-muted text-decoration-line-through">EGP ${p.oldPrice.toFixed(2)}</small>` : '';
        const saleBadge = p.discount > 28 ? `<div class="sale-badge" style="padding: 3px 8px; font-size: 0.70rem;">Sale ${p.discount}%</div>` : '';
        return `
            <div class="col-6 col-md-4">
                <div class="card hot-deal-card h-100 border rounded-3 position-relative overflow-hidden">
                    ${saleBadge}
                    <!-- Action Icons on Hover -->
                    <div class="product-action-icons z-2">
                        <a href="ProductDetails.html?id=${p.product_id || 0}" class="action-icon-btn" title="Quick View" style="width:28px; height:28px; font-size: 0.75rem;">
                            <i class="far fa-eye"></i>
                        </a>
                        ${window.isSellerOrAdmin && window.isSellerOrAdmin() ? '' : `<a href="#" class="action-icon-btn" title="Add to Wishlist" onclick="window.addToWishlistData(event, ${p.product_id || 0})" style="width:28px; height:28px; font-size: 0.75rem;">
                            <i class="${wishlistIds.includes(p.product_id || 0) ? 'fas fa-heart text-success' : 'far fa-heart'}"></i>
                        </a>`}
                    </div>
                    <div class="p-2 text-center position-relative z-1" style="height:120px; display:flex; align-items:center; justify-content:center;">
                        <a href="ProductDetails.html?id=${p.product_id || 0}" class="d-block w-100 h-100">
                            <img src="${img}" alt="${p.name}" style="max-height:100%; max-width:100%; object-fit:contain;">
                        </a>
                    </div>
                    <div class="card-body py-2 px-2 z-1">
                        <a href="ProductDetails.html?id=${p.product_id || 0}" class="text-decoration-none text-dark">
                            <p class="small mb-1 text-truncate">${p.name}</p>
                        </a>
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <span class="fw-bold small">EGP ${p.price.toFixed(2)}</span> ${oldPriceHtml}
                            </div>
                            ${(window.isSellerOrAdmin && window.isSellerOrAdmin()) || window.isOutOfStock(p.product_id || 0) ? '' : `<button class="add-btn-circle" style="width:28px;height:28px;font-size:0.65rem;" onclick="window.addToCartData(event, ${p.product_id || 0}, '${encodeURIComponent(p.name).replace(/'/g, "%27")}', ${p.price}, '${img}')"><i class="fas fa-shopping-bag"></i></button>`}
                        </div>
                        <div>${starsHtml(p.rating)}</div>
                    </div>
                </div>
            </div>`;
    }).join('');
    container.innerHTML = featuredHtml + `
        <div class="col-lg-7">
            <div class="row g-3">
                ${gridHtml}
            </div>
        </div>`;
    // Start deal countdown
    initDealCountdown();
}
function initDealCountdown() {
    const end = new Date();
    end.setDate(end.getDate() + 1);
    end.setHours(23, 59, 59, 0);
    function tick() {
        const diff = end - new Date();
        if (diff <= 0) return;
        const d = Math.floor(diff / 86400000);
        const h = Math.floor((diff / 3600000) % 24);
        const m = Math.floor((diff / 60000) % 60);
        const s = Math.floor((diff / 1000) % 60);
        const el = id => document.getElementById(id);
        if (el('hd-days')) el('hd-days').textContent = String(d).padStart(2, '0');
        if (el('hd-hours')) el('hd-hours').textContent = String(h).padStart(2, '0');
        if (el('hd-mins')) el('hd-mins').textContent = String(m).padStart(2, '0');
        if (el('hd-secs')) el('hd-secs').textContent = String(s).padStart(2, '0');
    }
    tick();
    setInterval(tick, 1000);
}
