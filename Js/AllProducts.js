// ===== All Products Page - Main JS =====

const PRODUCTS_PER_PAGE = 12;
let allProducts = [];
let filteredProducts = [];
let currentPage = 1;
let currentView = 'grid';
let sellers = [];

// ===== Fetch Data =====
async function fetchProducts() {
    try {
        const response = await fetch('../Data/ecobazar.json');
        const data = await response.json();

        // Store sellers
        sellers = data.Sellers || [];

        // Flatten all categories into one array
        const categories = ['Fruits', 'Vegetables', 'MeatFish', 'Dairy', 'Bakery', 'Beverages', 'Snacks'];
        allProducts = [];

        categories.forEach(cat => {
            if (data[cat]) {
                data[cat].forEach(product => {
                    product._category = cat; // store the JSON key for filtering
                    allProducts.push(product);
                });
            }
        });

        // Update category counts
        updateCategoryCounts(data);

        // Apply initial filters
        filteredProducts = [...allProducts];
        renderProducts();
        updateResultsCount();

    } catch (error) {
        console.error('Error loading products:', error);
        document.getElementById('productsContainer').innerHTML =
            '<p class="text-center text-danger p-4">Failed to load products. Please try again.</p>';
    }
}

// ===== Category Counts =====
function updateCategoryCounts(data) {
    document.getElementById('countAll').textContent = allProducts.length;
    const categories = ['Fruits', 'Vegetables', 'MeatFish', 'Dairy', 'Bakery', 'Beverages', 'Snacks'];
    categories.forEach(cat => {
        const el = document.getElementById('count' + cat);
        if (el) el.textContent = data[cat] ? data[cat].length : 0;
    });
}

// ===== Get Seller Name =====
function getSellerName(sellerId) {
    const seller = sellers.find(s => s.seller_id === sellerId);
    return seller ? seller.name : 'Unknown Seller';
}

// ===== Render Star Rating =====
function renderStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        stars += i <= rating ? '★' : '☆';
    }
    return stars;
}

// ===== Create Product Card HTML =====
function createProductCard(product) {
    const mainImg = product.images && product.images.length > 0 ? product.images[0] : '';
    const stockText = getStockText(product.stock);
    const stockClass = getStockClass(product.stock);
    const sellerName = getSellerName(product.seller_id);
    const isOutOfStock = product.stock <= 0;

    return `
        <div class="product-card" data-id="${product.product_id}">
            <div class="product-img-wrap">
                <img src="${mainImg}" alt="${product.name}" loading="lazy"
                     onerror="this.src='https://via.placeholder.com/400x400?text=No+Image'">
                <div class="badge-group">
                    ${product.discount ? `<span class="badge-discount">-${product.discount}%</span>` : ''}
                    ${product.organic ? '<span class="badge-organic">Organic</span>' : ''}
                    ${product.stock > 0 && product.stock <= 10 ? '<span class="badge-stock">Low Stock</span>' : ''}
                    ${isOutOfStock ? '<span class="badge-out">Out of Stock</span>' : ''}
                </div>
                <div class="product-actions">
                    <button class="action-btn" title="Quick View" onclick="openQuickView(${product.product_id})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn" title="Add to Cart" onclick="addToCart(${product.product_id})"
                        ${isOutOfStock ? 'disabled' : ''}>
                        <i class="fas fa-shopping-cart"></i>
                    </button>
                    <button class="action-btn" title="Add to Wishlist" onclick="addToWishlist(${product.product_id})">
                        <i class="fas fa-heart"></i>
                    </button>
                </div>
            </div>
            <div class="product-info">
                <span class="product-category">${product.category}</span>
                <h3 class="product-name">${product.name}</h3>
                <div class="product-rating">
                    <span class="stars">${renderStars(product.rating)}</span>
                    <span class="review-count">(${product.reviews ? product.reviews.length : 0})</span>
                </div>

                <!-- Description (visible in list view only via CSS) -->
                <p class="product-description">${product.description}</p>

                <!-- Meta info (list view) -->
                <div class="product-meta">
                    <span class="product-meta-item"><i class="fas fa-weight-hanging"></i>${product.weight}</span>
                    <span class="product-meta-item"><i class="fas fa-tag"></i>${product.brand}</span>
                    <span class="product-meta-item"><i class="fas fa-store"></i>${sellerName}</span>
                </div>

                <div class="product-price-row">
                    <span class="product-price">$${product.price.toFixed(2)}</span>
                    ${product.oldPrice ? `<span class="product-old-price">$${product.oldPrice.toFixed(2)}</span>` : ''}
                </div>
                <div class="product-stock-info ${stockClass}">${stockText}</div>
                <div class="product-seller"><i class="fas fa-store me-1"></i>${sellerName}</div>

                <button class="add-to-cart-btn" onclick="addToCart(${product.product_id})" ${isOutOfStock ? 'disabled' : ''}>
                    <i class="fas fa-shopping-cart me-1"></i> ${isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                </button>
            </div>
        </div>
    `;
}

// ===== Stock Helpers =====
function getStockText(stock) {
    if (stock <= 0) return 'Out of Stock';
    if (stock <= 10) return `Only ${stock} left!`;
    return `In Stock (${stock})`;
}

function getStockClass(stock) {
    if (stock <= 0) return 'out-of-stock';
    if (stock <= 10) return 'low-stock';
    return '';
}

// ===== Render Products =====
function renderProducts() {
    const container = document.getElementById('productsContainer');
    const noResults = document.getElementById('noResults');
    const paginationContainer = document.getElementById('paginationContainer');

    if (filteredProducts.length === 0) {
        container.innerHTML = '';
        noResults.style.display = 'block';
        paginationContainer.style.display = 'none';
        return;
    }

    noResults.style.display = 'none';
    paginationContainer.style.display = 'block';

    // Paginate
    const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
    if (currentPage > totalPages) currentPage = totalPages;

    const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const end = start + PRODUCTS_PER_PAGE;
    const pageProducts = filteredProducts.slice(start, end);

    // Render cards
    container.innerHTML = pageProducts.map(p => createProductCard(p)).join('');

    // Render pagination
    renderPagination(totalPages);
    updateResultsCount();

    // Update view class
    container.classList.toggle('list-view', currentView === 'list');
}

// ===== Pagination =====
function renderPagination(totalPages) {
    const pagination = document.getElementById('pagination');

    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }

    let html = '';

    // Previous
    html += `<li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
        <a class="page-link" href="#" onclick="goToPage(${currentPage - 1}); return false;">
            <i class="fas fa-chevron-left"></i>
        </a>
    </li>`;

    // Page Numbers
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);
    if (endPage - startPage < maxVisible - 1) {
        startPage = Math.max(1, endPage - maxVisible + 1);
    }

    if (startPage > 1) {
        html += `<li class="page-item"><a class="page-link" href="#" onclick="goToPage(1); return false;">1</a></li>`;
        if (startPage > 2) html += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
    }

    for (let i = startPage; i <= endPage; i++) {
        html += `<li class="page-item ${i === currentPage ? 'active' : ''}">
            <a class="page-link" href="#" onclick="goToPage(${i}); return false;">${i}</a>
        </li>`;
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) html += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
        html += `<li class="page-item"><a class="page-link" href="#" onclick="goToPage(${totalPages}); return false;">${totalPages}</a></li>`;
    }

    // Next
    html += `<li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
        <a class="page-link" href="#" onclick="goToPage(${currentPage + 1}); return false;">
            <i class="fas fa-chevron-right"></i>
        </a>
    </li>`;

    pagination.innerHTML = html;
}

function goToPage(page) {
    const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
    if (page < 1 || page > totalPages) return;
    currentPage = page;
    renderProducts();
    window.scrollTo({ top: 300, behavior: 'smooth' });
}

// ===== Results Count =====
function updateResultsCount() {
    const start = (currentPage - 1) * PRODUCTS_PER_PAGE + 1;
    const end = Math.min(currentPage * PRODUCTS_PER_PAGE, filteredProducts.length);
    const text = filteredProducts.length > 0
        ? `Showing ${start}-${end} of ${filteredProducts.length} results`
        : 'No results found';
    document.getElementById('resultsCount').textContent = text;
}

// ===== Filtering =====
function applyFilters() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
    const activeCategory = document.querySelector('.category-item.active')?.dataset.category || 'All';
    const maxPrice = parseFloat(document.getElementById('priceRange').value);
    const selectedRating = parseInt(document.querySelector('input[name="rating"]:checked')?.value || '0');
    const organicOnly = document.getElementById('organicFilter').checked;
    const inStockOnly = document.getElementById('inStockFilter').checked;

    filteredProducts = allProducts.filter(product => {
        // Category
        if (activeCategory !== 'All' && product._category !== activeCategory) return false;

        // Search
        if (searchTerm) {
            const haystack = `${product.name} ${product.brand} ${product.description} ${product.category}`.toLowerCase();
            if (!haystack.includes(searchTerm)) return false;
        }

        // Price
        if (product.price > maxPrice) return false;

        // Rating
        if (selectedRating > 0 && product.rating < selectedRating) return false;

        // Organic
        if (organicOnly && !product.organic) return false;

        // In Stock
        if (inStockOnly && product.stock <= 0) return false;

        return true;
    });

    // Apply sorting
    applySorting();

    currentPage = 1;
    renderProducts();
}

// ===== Sorting =====
function applySorting() {
    const sortValue = document.getElementById('sortSelect').value;

    switch (sortValue) {
        case 'price-low':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'name-az':
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'name-za':
            filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
            break;
        case 'rating':
            filteredProducts.sort((a, b) => b.rating - a.rating);
            break;
        case 'discount':
            filteredProducts.sort((a, b) => (b.discount || 0) - (a.discount || 0));
            break;
    }
}

// ===== Quick View Modal =====
function openQuickView(productId) {
    const product = allProducts.find(p => p.product_id === productId);
    if (!product) return;

    const sellerName = getSellerName(product.seller_id);
    const images = product.images || [];
    const mainImg = images[0] || 'https://via.placeholder.com/400x400?text=No+Image';
    const isOutOfStock = product.stock <= 0;

    const thumbsHtml = images.map((img, i) => `
        <img src="${img}" class="quickview-thumb ${i === 0 ? 'active' : ''}"
             onclick="changeQuickViewImage(this, '${img}')"
             alt="Thumbnail ${i + 1}">
    `).join('');

    document.getElementById('quickViewBody').innerHTML = `
        <div class="quickview-container">
            <div class="quickview-images">
                <img src="${mainImg}" class="quickview-main-img" id="quickviewMainImg" alt="${product.name}">
                <div class="quickview-thumbs">${thumbsHtml}</div>
            </div>
            <div class="quickview-details">
                <span class="product-category">${product.category}</span>
                <h2 class="product-name">${product.name}</h2>
                <div class="product-rating">
                    <span class="stars">${renderStars(product.rating)}</span>
                    <span class="review-count">(${product.reviews ? product.reviews.length : 0} reviews)</span>
                </div>
                <div class="product-price-row">
                    <span class="product-price">$${product.price.toFixed(2)}</span>
                    ${product.oldPrice ? `<span class="product-old-price">$${product.oldPrice.toFixed(2)}</span>` : ''}
                    ${product.discount ? `<span class="badge-discount ms-2">-${product.discount}%</span>` : ''}
                </div>
                <p class="product-description">${product.description}</p>
                <div class="quickview-info">
                    <div class="quickview-info-item">
                        <span class="label">Brand:</span>
                        <span class="value">${product.brand}</span>
                    </div>
                    <div class="quickview-info-item">
                        <span class="label">Weight:</span>
                        <span class="value">${product.weight}</span>
                    </div>
                    <div class="quickview-info-item">
                        <span class="label">Unit:</span>
                        <span class="value">${product.unit}</span>
                    </div>
                    <div class="quickview-info-item">
                        <span class="label">Seller:</span>
                        <span class="value">${sellerName}</span>
                    </div>
                    <div class="quickview-info-item">
                        <span class="label">Stock:</span>
                        <span class="value ${getStockClass(product.stock)}">${getStockText(product.stock)}</span>
                    </div>
                    ${product.organic ? `
                    <div class="quickview-info-item">
                        <span class="label">Type:</span>
                        <span class="value" style="color: var(--primary); font-weight: 500;">
                            <i class="fas fa-seedling me-1"></i>Organic Certified
                        </span>
                    </div>` : ''}
                </div>
                <button class="quickview-add-btn" onclick="addToCart(${product.product_id}); bootstrap.Modal.getInstance(document.getElementById('quickViewModal')).hide();"
                    ${isOutOfStock ? 'disabled' : ''}>
                    <i class="fas fa-shopping-cart me-2"></i>${isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                </button>
            </div>
        </div>
    `;

    const modal = new bootstrap.Modal(document.getElementById('quickViewModal'));
    modal.show();
}

function changeQuickViewImage(thumb, imgSrc) {
    document.getElementById('quickviewMainImg').src = imgSrc;
    document.querySelectorAll('.quickview-thumb').forEach(t => t.classList.remove('active'));
    thumb.classList.add('active');
}

// ===== Cart =====
function addToCart(productId) {
    const product = allProducts.find(p => p.product_id === productId);
    if (!product || product.stock <= 0) return;

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingIndex = cart.findIndex(item => item.product_id === productId);

    if (existingIndex > -1) {
        cart[existingIndex].quantity += 1;
    } else {
        cart.push({
            product_id: product.product_id,
            name: product.name,
            price: product.price,
            image: product.images[0],
            quantity: 1,
            seller_id: product.seller_id
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showToast(`${product.name} added to cart!`);
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const el = document.getElementById('cartCount');
    if (el) el.textContent = totalItems;
}

// ===== Wishlist =====
function addToWishlist(productId) {
    const product = allProducts.find(p => p.product_id === productId);
    if (!product) return;

    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const exists = wishlist.some(item => item.product_id === productId);

    if (!exists) {
        wishlist.push({
            product_id: product.product_id,
            name: product.name,
            price: product.price,
            image: product.images[0]
        });
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        showToast(`${product.name} added to wishlist! ♥`);
    } else {
        showToast('Already in wishlist!');
    }
}

// ===== Toast =====
function showToast(message) {
    // Remove existing toast
    const existing = document.querySelector('.toast-notification');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.innerHTML = `<i class="fas fa-check-circle me-2"></i>${message}`;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
        toast.classList.add('show');
    });

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 2500);
}

// ===== Reset Filters =====
function resetFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('priceRange').value = 25;
    document.getElementById('priceValue').textContent = '$25.00';
    document.getElementById('organicFilter').checked = false;
    document.getElementById('inStockFilter').checked = false;
    document.getElementById('sortSelect').value = 'default';

    document.querySelectorAll('input[name="rating"]').forEach(r => r.checked = false);
    document.querySelector('input[name="rating"][value="0"]').checked = true;

    document.querySelectorAll('.category-item').forEach(c => c.classList.remove('active'));
    document.querySelector('.category-item[data-category="All"]').classList.add('active');

    filteredProducts = [...allProducts];
    currentPage = 1;
    renderProducts();
}

// ===== Event Listeners =====
document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
    updateCartCount();

    // Search (debounced)
    let searchTimeout;
    document.getElementById('searchInput').addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(applyFilters, 300);
    });

    // Category filter
    document.querySelectorAll('.category-item').forEach(item => {
        item.addEventListener('click', () => {
            document.querySelectorAll('.category-item').forEach(c => c.classList.remove('active'));
            item.classList.add('active');
            applyFilters();
        });
    });

    // Price range
    document.getElementById('priceRange').addEventListener('input', (e) => {
        document.getElementById('priceValue').textContent = `$${parseFloat(e.target.value).toFixed(2)}`;
        applyFilters();
    });

    // Rating filter
    document.querySelectorAll('input[name="rating"]').forEach(radio => {
        radio.addEventListener('change', applyFilters);
    });

    // Organic filter
    document.getElementById('organicFilter').addEventListener('change', applyFilters);

    // In Stock filter
    document.getElementById('inStockFilter').addEventListener('change', applyFilters);

    // Sort
    document.getElementById('sortSelect').addEventListener('change', applyFilters);

    // View Toggle
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentView = btn.dataset.view;
            const container = document.getElementById('productsContainer');
            container.classList.toggle('list-view', currentView === 'list');
        });
    });

    // Reset
    document.getElementById('resetFilters').addEventListener('click', resetFilters);
    document.getElementById('clearSearch').addEventListener('click', resetFilters);
});
