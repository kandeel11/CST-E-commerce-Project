import { getAllProducts, toggleWishlist, isInWishlist, addToCart, getCartCount } from "../services/storageService.js";

//  DOM re
const productsContainer = document.getElementById("productsContainer");
const resultsCount = document.getElementById("resultsCount");
const noResults = document.getElementById("noResults");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const priceRange = document.getElementById("priceRange");
const priceValue = document.getElementById("priceValue");
const ratingFilters = document.getElementById("ratingFilters");
const organicFilter = document.getElementById("organicFilter");
const inStockFilter = document.getElementById("inStockFilter");
const resetFiltersBtn = document.getElementById("resetFilters");
const clearSearchBtn = document.getElementById("clearSearch");
const paginationEl = document.getElementById("pagination");
const categoryItems = document.querySelectorAll(".category-item");
const viewBtns = document.querySelectorAll(".view-btn");
const cartCountEl = document.getElementById("cartCount");


let allProducts      = [];
let filteredProducts = [];
let currentPage      = 1;
let currentCategory  = "All";
let currentView      = "grid";
const PAGE_SIZE      = 9;

//  start
window.addEventListener("DOMContentLoaded", () => {
    allProducts = getAllProducts();
    if (allProducts.length === 0) {
        allProducts = getDemoProducts();
        localStorage.setItem("products", JSON.stringify(allProducts));
    }
    updateCartBadge();
    populateCategoryCounts(allProducts);
    applyFilters();
    bindEvents();
});

// events 
function bindEvents() {
    searchInput.addEventListener("input",  () => { currentPage = 1; applyFilters(); });
    sortSelect.addEventListener("change",  () => applyFilters());
    priceRange.addEventListener("input",   () => {
        priceValue.textContent = `$${parseFloat(priceRange.value).toFixed(2)}`;
        currentPage = 1;
        applyFilters();
    });
    ratingFilters.addEventListener("change", () => { currentPage = 1; applyFilters(); });
    organicFilter.addEventListener("change", () => { currentPage = 1; applyFilters(); });
    inStockFilter.addEventListener("change", () => { currentPage = 1; applyFilters(); });

    categoryItems.forEach(item => {
        item.addEventListener("click", () => {
            categoryItems.forEach(i => i.classList.remove("active"));
            item.classList.add("active");
            currentCategory = item.dataset.category;
            currentPage = 1;
            applyFilters();
        });
    });

    viewBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            viewBtns.forEach(b => {
                b.classList.remove("active", "btn-success");
                b.classList.add("btn-outline-success");
            });
            btn.classList.add("active", "btn-success");
            btn.classList.remove("btn-outline-success");
            currentView = btn.dataset.view;
            renderProducts(paginateProducts(filteredProducts));
        });
    });

    resetFiltersBtn.addEventListener("click", resetFilters);
    clearSearchBtn?.addEventListener("click", resetFilters);
}

//  Filter & Sort
function applyFilters() {
    let result = [...allProducts];

    if (currentCategory !== "All")
        result = result.filter(p => p.category === currentCategory);

    const q = searchInput.value.trim().toLowerCase();
    if (q)
        result = result.filter(p =>
            pName(p).toLowerCase().includes(q) || pDesc(p).toLowerCase().includes(q)
        );

    const maxPrice = parseFloat(priceRange.value);
    result = result.filter(p => pPrice(p) <= maxPrice);

    const minRating = parseInt(document.querySelector('input[name="rating"]:checked')?.value || "0");
    if (minRating > 0)
        result = result.filter(p => (p.rating || 0) >= minRating);

    if (organicFilter.checked)
        result = result.filter(p => p.organic || p.isOrganic);

    if (inStockFilter.checked)
        result = result.filter(p => (p.stockQuantity || p.stock || 0) > 0);

    filteredProducts = sortProducts(result, sortSelect.value);
    renderPage();
}

function sortProducts(arr, method) {
    const copy = [...arr];
    switch (method) {
        case "price-low":  return copy.sort((a, b) => pPrice(a) - pPrice(b));
        case "price-high": return copy.sort((a, b) => pPrice(b) - pPrice(a));
        case "name-az":    return copy.sort((a, b) => pName(a).localeCompare(pName(b)));
        case "name-za":    return copy.sort((a, b) => pName(b).localeCompare(pName(a)));
        case "rating":     return copy.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        case "discount":   return copy.sort((a, b) => (b.discount || 0) - (a.discount || 0));
        default:           return copy;
    }
}

// Pagination 
function paginateProducts(arr) {
    const start = (currentPage - 1) * PAGE_SIZE;
    return arr.slice(start, start + PAGE_SIZE);
}

function renderPage() {
    const pageItems = paginateProducts(filteredProducts);
    resultsCount.textContent = `Showing ${filteredProducts.length} result${filteredProducts.length !== 1 ? "s" : ""}`;
    noResults.style.display = filteredProducts.length === 0 ? "block" : "none";
    productsContainer.style.display = filteredProducts.length === 0 ? "none"  : "";
    renderProducts(pageItems);
    renderPagination();
}

function renderPagination() {
    const totalPages = Math.ceil(filteredProducts.length / PAGE_SIZE);
    paginationEl.innerHTML = "";
    if (totalPages <= 1) return;

    const li = (label, page, disabled, active) => {
        const el = document.createElement("li");
        el.className = `page-item${disabled ? " disabled" : ""}${active ? " active" : ""}`;
        el.innerHTML = `<a class="page-link" href="#">${label}</a>`;
        if (!disabled) el.addEventListener("click", e => {
            e.preventDefault();
            currentPage = page;
            renderPage();
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
        return el;
    };

    paginationEl.appendChild(li("&laquo;", currentPage - 1, currentPage === 1, false));
    for (let i = 1; i <= totalPages; i++)
        paginationEl.appendChild(li(i, i, false, i === currentPage));
    paginationEl.appendChild(li("&raquo;", currentPage + 1, currentPage === totalPages, false));
}

//  Render products 
function renderProducts(products) {
    productsContainer.innerHTML = "";
    productsContainer.className = currentView === "list" ? "products-list" : "products-grid";

    products.forEach(product => {
        const pid = pId(product);
        const name = pName(product);
        const price = pPrice(product);
        const image = pImg(product);
        const desc = pDesc(product);
        const rating = product.rating || 4;
        const inStock = (product.stockQuantity || product.stock || 1) > 0;
        const wishlisted = isInWishlist(pid);
        const discount = product.oldPrice ? Math.round(((product.oldPrice - price) / product.oldPrice) * 100) : 0;

        const card = document.createElement("div");
        card.className = "product-card card border-0 shadow-sm rounded-3 overflow-hidden";
        card.dataset.id = pid;

        card.innerHTML = `
            <div class="product-image-wrapper">
                ${!inStock
                    ? `<span class="position-absolute top-0 end-0 m-2 badge bg-danger rounded-pill z-1">Out of Stock</span>`
                    : ""}
                ${product.organic || product.isOrganic
                    ? `<span class="position-absolute top-0 start-0 m-2 badge bg-success rounded-pill z-1">
                           <i class="fas fa-seedling me-1"></i>Organic
                       </span>`
                    : ""}
                ${discount > 0
                    ? `<span class="position-absolute bottom-0 start-0 m-2 badge bg-warning text-dark rounded-pill z-1">-${discount}%</span>`
                    : ""}
                <img src="${image}" class="product-img" alt="${name}" loading="lazy">
                <div class="product-hover-actions">
                    <button class="hover-btn wishlist-btn ${wishlisted ? "wishlisted" : ""}"
                            title="${wishlisted ? "Remove from Wishlist" : "Add to Wishlist"}">
                        <i class="${wishlisted ? "fas" : "far"} fa-heart"></i>
                    </button>
                    <button class="hover-btn details-btn" title="View Details" data-id=${product.product_id}>
                        <i class="fas fa-eye" data-id=${product.product_id}></i>
                    </button>
                </div>
            </div>

            <div class="card-body d-flex flex-column p-3">
                <span class="text-success fw-semibold text-uppercase small mb-1" style="font-size:.7rem;letter-spacing:1px">
                    ${product.category || ""}
                </span>
                <h6 class="card-title fw-semibold mb-1 pb-3 line-clamp-2">${name}</h6>
                <div class="d-flex align-items-center gap-1 mb-1">
                    <span class="stars small">${"★".repeat(Math.floor(rating))}${"☆".repeat(5 - Math.floor(rating))}</span>
                    <span class="text-muted" style="font-size:.75rem">(${rating.toFixed(1)})</span>
                </div>
                <p class="card-text text-muted small line-clamp-2 mb-2 pb-3">${desc}</p>

                <div class="d-flex align-items-center justify-content-between mt-auto">
                    <div>
                        <span class="fw-bold text-success">EGP ${price.toFixed(2)}</span>
                        ${product.oldPrice
                            ? `<br><small class="text-muted text-decoration-line-through">EGP ${product.oldPrice.toFixed(2)}</small>`
                            : ""}
                    </div>
                    <button class="btn btn-success btn-sm add-cart-btn" ${!inStock ? "disabled" : ""}>
                        <i class="fas fa-cart-plus me-1"></i>
                    <span class="d-none d-md-inline">Add</span>

                    </button>
                </div>
            </div>
        `;

        // Wishlist
        card.querySelector(".wishlist-btn").addEventListener("click", e => {
            e.stopPropagation();
            const btn  = e.currentTarget;
            const icon = btn.querySelector("i");
            const added = toggleWishlist(product);
            btn.classList.toggle("wishlisted", added);
            icon.className = added ? "fas fa-heart" : "far fa-heart";
            btn.title = added ? "Remove from Wishlist" : "Add to Wishlist";
            showToast(added ? "❤️ Added to wishlist" : "💔 Removed from wishlist");
        });

        // Details
        card.querySelector(".details-btn").addEventListener("click", e => {
            e.stopPropagation();
            window.location.href = `ProductDetails.html?id=${e.target.dataset.id}`;
        });

        // Add to cart
        card.querySelector(".add-cart-btn")?.addEventListener("click", e => {
            e.stopPropagation();
            if (!inStock) return;
            addToCart(product);
            updateCartBadge();
            showToast(`🛒 ${name} added to cart!`);
        });

        productsContainer.appendChild(card);
    });
}

//  Helpers 
const pId = p => p.id || p.productId || "";
const pName = p => p.name || p.productName || "Product";
const pPrice = p => parseFloat(p.price || p.productPrice || 0);
const pDesc = p => p.description || p.productDescription || "";
const pImg = p => (p.images && p.images[0]) || p.imageUrl || "https://placehold.co/300x220/e8f5e9/2e7d32?text=Product";

function populateCategoryCounts(products) {
    const counts = {};
    products.forEach(p => { counts[p.category] = (counts[p.category] || 0) + 1; });
    document.getElementById("countAll").textContent = products.length;
    ["Fruits","Vegetables","MeatFish","Dairy","Bakery","Beverages","Snacks"].forEach(cat => {
        const el = document.getElementById(`count${cat}`);
        if (el) el.textContent = counts[cat] || 0;
    });
}

function updateCartBadge() {
    cartCountEl.textContent = getCartCount();
}

function resetFilters() {
    searchInput.value = "";
    sortSelect.value  = "default";
    priceRange.value  = priceRange.max;
    priceValue.textContent = `$${parseFloat(priceRange.max).toFixed(2)}`;
    document.querySelector('input[name="rating"][value="0"]').checked = true;
    organicFilter.checked = false;
    inStockFilter.checked = false;
    categoryItems.forEach(i => i.classList.remove("active"));
    document.querySelector('.category-item[data-category="All"]').classList.add("active");
    currentCategory = "All";
    currentPage = 1;
    applyFilters();
}

function showToast(message) {
    let container = document.getElementById("toastContainer");
    if (!container) {
        container = document.createElement("div");
        container.id = "toastContainer";
        document.body.appendChild(container);
    }
    const toast = document.createElement("div");
    toast.className = "eco-toast";
    toast.textContent = message;
    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add("show"));
    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 400);
    }, 2800);
}

// Demo data 
function getDemoProducts() {
    return [
        { id:"p1",  name:"Organic Avocado",      description:"Creamy Hass avocados, hand-picked at peak ripeness.",            category:"Fruits",     price:12.99, rating:4.8, stock:50, organic:true,  images:["https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400&q=80"] },
        { id:"p2",  name:"Fresh Strawberries",   description:"Sun-ripened strawberries bursting with natural sweetness.",       category:"Fruits",     price:7.50,  rating:4.6, stock:30, organic:false, images:["https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&q=80"] },
        { id:"p3",  name:"Baby Spinach",          description:"Tender baby spinach leaves, triple-washed and ready to eat.",    category:"Vegetables", price:4.99,  rating:4.4, stock:80, organic:true,  images:["https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&q=80"] },
        { id:"p4",  name:"Cherry Tomatoes",       description:"Vibrant and juicy cherry tomatoes straight from the vine.",      category:"Vegetables", price:5.49,  rating:4.5, stock:60, organic:false, images:["https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400&q=80"] },
        { id:"p5",  name:"Free-Range Chicken",    description:"Pasture-raised free-range chicken, no antibiotics.",             category:"MeatFish",   price:18.99, rating:4.7, stock:20, organic:false, images:["https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&q=80"] },
        { id:"p6",  name:"Atlantic Salmon",       description:"Premium Atlantic salmon fillet, rich in Omega-3.",               category:"MeatFish",   price:22.50, rating:4.9, stock:15, organic:false, images:["https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&q=80"] },
        { id:"p7",  name:"Greek Yogurt",          description:"Thick, creamy Greek yogurt with live active cultures.",          category:"Dairy",      price:6.99,  rating:4.3, stock:45, organic:true,  images:["https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&q=80"] },
        { id:"p8",  name:"Sourdough Bread",       description:"Artisan sourdough with a crispy crust and chewy interior.",      category:"Bakery",     price:8.50,  rating:4.8, stock:25, organic:false, images:["https://images.unsplash.com/photo-1585478259715-876acc5be8eb?w=400&q=80"] },
        { id:"p9",  name:"Cold Brew Coffee",      description:"Smooth, low-acid cold brew steeped for 24 hours.",               category:"Beverages",  price:9.99,  rating:4.7, stock:35, organic:false, images:["https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&q=80"] },
        { id:"p10", name:"Mixed Nuts",            description:"Premium blend of almonds, cashews, walnuts and pecans.",         category:"Snacks",     price:14.99, rating:4.5, stock:0,  organic:false, images:["https://images.unsplash.com/photo-1604940740030-a6e9c0e95b87?w=400&q=80"] },
        { id:"p11", name:"Alphonso Mango",        description:"Fragrant and intensely sweet mangoes at their peak.",            category:"Fruits",     price:11.00, rating:4.9, stock:40, organic:true,  originalPrice:14.00, images:["https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&q=80"] },
        { id:"p12", name:"Almond Milk",           description:"Unsweetened almond milk, creamy with no preservatives.",         category:"Beverages",  price:5.99,  rating:4.2, stock:55, organic:true,  images:["https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80"] },
    ];
}