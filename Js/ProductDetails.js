import { getAllProducts, toggleWishlist, isInWishlist, addToCart, getCartCount } from "../Js/services/storageService.js";

document.addEventListener("DOMContentLoaded", () => {
    loadComponents();
    loadProductData();
});

function loadComponents() {
    // Load standard NavBar
    fetch('NavBar.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('navbar-placeholder').innerHTML = data;
            if (window.initNavBarAuth) window.initNavBarAuth();
            if (window.updateCartBadge) window.updateCartBadge();
            if (window.hideNavbarCartWishlistForRole) window.hideNavbarCartWishlistForRole();
        });

    fetch('Footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-placeholder').innerHTML = data;
            if (window.hideFooterCartWishlistForRole) window.hideFooterCartWishlistForRole();
        });
}

let currentProductData = null;

function loadProductData() {
    const urlParams = new URLSearchParams(window.location.search);
    let productId = parseInt(urlParams.get('id'));

    const products = getAllProducts(); // flat array from localStorage

    let foundProduct = null;
    let currentCategory = null;

    if (!productId) {
        // Default: first product
        foundProduct = products.find(p => p.name && p.images && p.images.length > 0) || products[0];
    } else {
        foundProduct = products.find(p => p.product_id === productId);
    }

    // Fallback
    if (!foundProduct) foundProduct = products[0];

    if (foundProduct) {
        currentCategory = foundProduct.category;
        renderProductDetails(foundProduct);
        renderRelatedProducts(products, currentCategory, foundProduct.product_id);
    } else {
        document.getElementById('product-main').innerHTML = '<div class="alert alert-danger">Product data not found!</div>';
    }
}

function renderProductDetails(product) {
    currentProductData = product;

    // Title
    document.title = `Ecobazar - ${product.name}`;
    document.getElementById('product-title').textContent = product.name;

    // Breadcrumb Update

    // Formatting Tags
    let tagsArr = [];
    if (product.tags && Array.isArray(product.tags)) {
        tagsArr = product.tags;
    } else {
        tagsArr.push(product.category);
        if (product.organic) tagsArr.push("Healthy");
    }

    const renderTags = (tags) => tags.filter(Boolean).map(t => `<a href="Shop.html?category=${encodeURIComponent(t)}" class="text-dark text-decoration-none" onmouseover="this.style.color='var(--primary-green)'" onmouseout="this.style.color=''">${t}</a>`).join(', ');

    document.getElementById('product-category').textContent = product.category;
    document.getElementById('product-tags').innerHTML = renderTags(tagsArr);

    // Additional info Tab
    document.getElementById('info-weight').textContent = product.weight ? product.weight : '--';
    document.getElementById('info-category').textContent = product.category || '--';
    document.getElementById('info-tags').innerHTML = renderTags(tagsArr);
    document.getElementById('info-type').textContent = product.organic ? 'Organic' : 'Standard';
    document.getElementById('info-stock').textContent = (product.stock > 0) ? `Available` : 'Out of Stock';


    // Stock badge
    const stockBadge = document.getElementById('stock-status');
    if (product.stock > 0) {
        stockBadge.className = 'badge bg-success-subtle text-success py-1 px-2 fw-medium rounded-pill';
        stockBadge.textContent = 'In Stock';
    } else {
        stockBadge.className = 'badge bg-danger-subtle text-danger py-1 px-2 fw-medium rounded-pill';
        stockBadge.textContent = 'Out of Stock';
    }

    // Stars Rating calculation
    let avgRating = product.rating || 0;
    if (product.reviews && product.reviews.length > 0 && avgRating === 0) {
        avgRating = Math.round(product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length);
    }
    const starsHtml = Array.from({ length: 5 }, (_, i) => `<i class="fas fa-star" style="color: ${i < avgRating ? '#FF8A00' : '#ddd'}"></i>`).join('');
    document.getElementById('product-stars').innerHTML = starsHtml;
    document.getElementById('review-count').textContent = product.reviews ? product.reviews.length : 0;

    // Generate SKU based on ID to match screenshot style
    document.getElementById('product-sku').textContent = `2,51,594`;

    // Price setup
    document.getElementById('product-price').textContent = `EGP ${product.price.toFixed(2)}`;
    if (product.oldPrice) {
        document.getElementById('product-old-price').textContent = `EGP ${product.oldPrice.toFixed(2)}`;
    } else {
        document.getElementById('product-old-price').style.display = 'none';
    }

    // Discount Badge
    const discountEl = document.getElementById('product-discount');
    if (product.discount > 0) {
        discountEl.textContent = `${product.discount}% Off`;
        discountEl.classList.remove('d-none');
    } else {
        discountEl.classList.add('d-none');
    }

    // Images parsing
    const images = product.images && product.images.length > 0 ? product.images : [product.img || product.image];
    const mainImg = document.getElementById('main-product-image');
    mainImg.src = images[0];

    // Thumbnail Gallery disabled per user request
    const thumbContainer = document.getElementById('thumbnail-container');
    if (thumbContainer) thumbContainer.innerHTML = '';



    // Description text for Tabs pane (rich text)
    document.getElementById('tab-description-content').innerHTML = `
        <p class="mb-4">${product.description}</p>
        <ul class="list-unstyled d-flex flex-column gap-3 mt-4 text-muted">
            <li><i class="fas fa-check-circle text-green me-2"></i> ${product.weight ? product.weight + ' of fresh product' : 'Freshly picked'}</li>
            <li><i class="fas fa-check-circle text-green me-2"></i> ${product.organic ? '100% Organic certified' : 'High quality guaranteed'}</li>
            <li><i class="fas fa-check-circle text-green me-2"></i> Category: ${product.category}</li>
            <li><i class="fas fa-check-circle text-green me-2"></i> Fast and secure delivery</li>
        </ul>
    `;

    // Render Reviews Tab
    renderReviews(product);

    setupQuantityAndCart();

    // Hide add-to-cart and quantity for sellers/admins
    if (window.isSellerOrAdmin && window.isSellerOrAdmin()) {
        const cartRow = document.getElementById('cart-quantity-row');
        if (cartRow) cartRow.style.display = 'none';
    }
}

function renderReviews(product) {
    const reviewContainer = document.getElementById('reviews-container');
    if (!reviewContainer) return;

    // Get fresh product data from localStorage (may have new reviews)
    const products = getAllProducts();
    const freshProduct = products.find(p => p.product_id === product.product_id) || product;
    const reviews = freshProduct.reviews || [];
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    const users = JSON.parse(localStorage.getItem('users')) || [];

    let reviewsHtml = '';

    if (reviews.length > 0) {
        reviewsHtml += `<h6 class="fw-bold mb-3">${reviews.length} Review${reviews.length > 1 ? 's' : ''}</h6>`;
        reviews.forEach(r => {
            const reviewer = users.find(u => u.id === r.user_id);
            const reviewerName = reviewer ? `${reviewer.Fname || ''} ${reviewer.Lname || ''}`.trim() : 'Anonymous';
            const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(reviewerName)}&background=00B207&color=fff&size=40`;
            const starsHtml = Array.from({ length: 5 }, (_, i) => `<i class="fas fa-star" style="color: ${i < r.rating ? '#FF8A00' : '#ddd'}; font-size: 0.8rem;"></i>`).join('');
            const dateStr = r.date ? new Date(r.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : '';
            reviewsHtml += `
                <div class="d-flex gap-3 mb-3 pb-3 border-bottom">
                    <img src="${avatarUrl}" alt="${reviewerName}" class="rounded-circle" style="width:40px;height:40px;object-fit:cover;">
                    <div class="flex-grow-1">
                        <div class="d-flex justify-content-between align-items-center mb-1">
                            <h6 class="mb-0 fw-semibold small">${reviewerName}</h6>
                            <span class="text-muted" style="font-size:0.75rem;">${dateStr}</span>
                        </div>
                        <div class="mb-1">${starsHtml}</div>
                        <p class="text-muted small mb-0">${r.comment}</p>
                    </div>
                </div>
            `;
        });
    } else {
        reviewsHtml += '<p class="text-muted py-2">No feedback available yet. Be the first to review!</p>';
    }

    // Add review form (only for logged-in customers)
    if (currentUser && !window.isSellerOrAdmin()) {
        // Check if user already reviewed this product
        const alreadyReviewed = reviews.some(r => r.user_id === currentUser.id);
        if (alreadyReviewed) {
            reviewsHtml += `<div class="alert alert-success small mt-3"><i class="fas fa-check-circle me-2"></i>You have already reviewed this product.</div>`;
        } else {
            reviewsHtml += `
                <div class="card border-0 shadow-sm mt-4">
                    <div class="card-body">
                        <h6 class="fw-bold mb-3"><i class="fas fa-pen me-2 text-success"></i>Write a Review</h6>
                        <form id="reviewForm">
                            <div class="mb-3">
                                <label class="form-label small fw-semibold">Your Rating</label>
                                <div id="reviewStars" class="d-flex gap-1" style="cursor:pointer;">
                                    ${Array.from({ length: 5 }, (_, i) => `<i class="fas fa-star review-star" data-rating="${i + 1}" style="color:#ddd;font-size:1.5rem;"></i>`).join('')}
                                </div>
                                <input type="hidden" id="reviewRating" value="0">
                            </div>
                            <div class="mb-3">
                                <label class="form-label small fw-semibold">Your Review</label>
                                <textarea class="form-control" id="reviewComment" rows="3" placeholder="Share your experience with this product..." required></textarea>
                            </div>
                            <button type="submit" class="btn btn-success rounded-pill px-4">Submit Review</button>
                        </form>
                    </div>
                </div>
            `;
        }
    } else if (!currentUser) {
        reviewsHtml += `<div class="alert alert-info small mt-3"><i class="fas fa-info-circle me-2"></i>Please <a href="Login.html" class="fw-bold text-success">login</a> to write a review.</div>`;
    }

    reviewContainer.innerHTML = reviewsHtml;

    // Setup star rating interaction
    const reviewStarsContainer = document.getElementById('reviewStars');
    if (reviewStarsContainer) {
        const stars = reviewStarsContainer.querySelectorAll('.review-star');
        stars.forEach(star => {
            star.addEventListener('mouseover', () => {
                const rating = parseInt(star.dataset.rating);
                stars.forEach((s, i) => s.style.color = i < rating ? '#FF8A00' : '#ddd');
            });
            star.addEventListener('mouseout', () => {
                const currentRating = parseInt(document.getElementById('reviewRating').value);
                stars.forEach((s, i) => s.style.color = i < currentRating ? '#FF8A00' : '#ddd');
            });
            star.addEventListener('click', () => {
                document.getElementById('reviewRating').value = star.dataset.rating;
                const rating = parseInt(star.dataset.rating);
                stars.forEach((s, i) => s.style.color = i < rating ? '#FF8A00' : '#ddd');
            });
        });
    }

    // Setup review form submission
    const reviewForm = document.getElementById('reviewForm');
    if (reviewForm) {
        reviewForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const rating = parseInt(document.getElementById('reviewRating').value);
            const comment = document.getElementById('reviewComment').value.trim();

            if (rating === 0) {
                window.showBootstrapToast('Please select a rating.', 'error');
                return;
            }
            if (!comment) {
                window.showBootstrapToast('Please write a review comment.', 'error');
                return;
            }

            // Save review to localStorage products
            const allProducts = JSON.parse(localStorage.getItem('products')) || [];
            const prod = allProducts.find(p => p.product_id === product.product_id);
            if (prod) {
                if (!prod.reviews) prod.reviews = [];
                prod.reviews.push({
                    user_id: currentUser.id,
                    rating: rating,
                    comment: comment,
                    date: new Date().toISOString()
                });
                // Recalculate average rating
                prod.rating = Math.round(prod.reviews.reduce((acc, r) => acc + r.rating, 0) / prod.reviews.length);
                localStorage.setItem('products', JSON.stringify(allProducts));

                window.showBootstrapToast('Review submitted successfully!', 'success');

                // Re-render reviews and update stars
                renderReviews(prod);
                // Update header stars
                const avgRating = prod.rating;
                const starsHtml = Array.from({ length: 5 }, (_, i) => `<i class="fas fa-star" style="color: ${i < avgRating ? '#FF8A00' : '#ddd'}"></i>`).join('');
                document.getElementById('product-stars').innerHTML = starsHtml;
                document.getElementById('review-count').textContent = prod.reviews.length;
            }
        });
    }
}

function setupQuantityAndCart() {
    const qtyInput = document.getElementById('qty-input');
    const btnMinus = document.getElementById('qty-minus');
    const btnPlus = document.getElementById('qty-plus');
    const btnAddToCart = document.getElementById('add-to-cart-btn');

    let currentQty = 1;

    btnMinus.onclick = () => {
        if (currentQty > 1) {
            currentQty--;
            qtyInput.value = currentQty;
        }
    };

    btnPlus.onclick = () => {
        if (currentProductData && currentQty < currentProductData.stock) {
            currentQty++;
            qtyInput.value = currentQty;
            currentProductData.quantity = currentQty; // Update quantity in product data for cart addition

        }
    };

    btnAddToCart.onclick = () => {
        if (!currentProductData) return;
        let current_user = JSON.parse(localStorage.getItem("currentUser"));
        let carts = JSON.parse(localStorage.getItem('cart')) || [];
        let userId = current_user ? current_user.id : null;
        let cart = carts.find(c => c.userid === userId)?.items || [];
        let products = JSON.parse(localStorage.getItem('products')) || [];
        addToCart(currentProductData);
        // Update cart badge in navbar
        if (window.updateCartBadge) window.updateCartBadge();
        // Update navbar cart badge if it exists
        // Brief visual success animation
        const originalText = btnAddToCart.innerHTML;
        btnAddToCart.innerHTML = `Added! <i class="fas fa-check"></i>`;
        btnAddToCart.classList.add('bg-success', 'border-success');

        setTimeout(() => {
            btnAddToCart.innerHTML = originalText;
            btnAddToCart.classList.remove('bg-success', 'border-success');
            currentQty = 1;
            qtyInput.value = 1;
        }, 1500);
    };
}

function renderRelatedProducts(products, currentCategory, currentProductId) {
    const container = document.getElementById('related-products-container');
    if (!container) return;

    let wishlistIds = [];
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user) {
        const wl = JSON.parse(localStorage.getItem('WishLists')) || [];
        const uw = wl[`${user.id}`];
        if (uw) wishlistIds = uw.map(w => w.product_id);
    }

    const related = products
        .filter(p => p.category === currentCategory && p.product_id !== currentProductId)
        .slice(0, 4);

    container.innerHTML = related.map(p => {
        const img = p.images && p.images.length > 0 ? p.images[0] : (p.img || p.image);
        const oldPriceHtml = p.oldPrice ? `<small class="text-muted text-decoration-line-through ms-1">EGP ${p.oldPrice.toFixed(2)}</small>` : '';
        const saleBadge = p.discount > 0 ? `<div class="sale-badge">Sale ${p.discount}%</div>` : '';

        let avgRating = p.rating || 0;
        const starsHtml = Array.from({ length: 5 }, (_, i) => `<i class="fas fa-star" style="color: ${i < avgRating ? '#FF8A00' : '#ddd'}"></i>`).join('');

        return `
            <div class="col">
                <div class="card product-card h-100 position-relative">
                    ${saleBadge}
                    <!-- Action Icons on Hover -->
                    <div class="product-action-icons z-2">
                        <a href="ProductDetails.html?id=${p.product_id || 0}" class="action-icon-btn" title="Quick View">
                            <i class="far fa-eye"></i>
                        </a>
                        ${window.isSellerOrAdmin && window.isSellerOrAdmin() ? '' : `<a href="#" class="action-icon-btn" title="Add to Wishlist" onclick="window.addToWishlistData(event, ${p.product_id || 0})">
                            <i class="${wishlistIds.includes(p.product_id || 0) ? 'fas fa-heart text-success' : 'far fa-heart'}"></i>
                        </a>`}
                    </div>
                    <a href="ProductDetails.html?id=${p.product_id || 0}" class="d-block text-decoration-none text-dark position-relative z-1">
                        <img src="${img}" class="card-img-top mx-auto d-block" alt="${p.name}" style="object-fit: contain; max-height: 200px;">
                    </a>
                    <div class="card-body d-flex flex-column z-1 border-top">
                        <a href="ProductDetails.html?id=${p.product_id || 0}" class="text-decoration-none text-dark">
                            <h6 class="card-title text-truncate mb-1">${p.name}</h6>
                        </a>
                        <div class="d-flex justify-content-between align-items-center mt-auto">
                            <div class="mt-2">
                                <span class="fw-bold">EGP ${p.price.toLocaleString()}</span>
                                ${oldPriceHtml}
                                <div class="small">${starsHtml}</div>
                            </div>
                            ${window.isSellerOrAdmin && window.isSellerOrAdmin() ? '' : `<button class="add-btn-circle" onclick="window.addToCartData(event, ${p.product_id || 0}, '${encodeURIComponent(p.name).replace(/'/g, "%27")}', ${p.price}, '${img}')"><i class="fas fa-shopping-bag"></i></button>`}
                        </div>
                    </div>
                </div>
            </div>`;
    }).join('');
}
