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
        });

    fetch('Footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-placeholder').innerHTML = data;
        });
}

let currentProductData = null;

function loadProductData() {
    const urlParams = new URLSearchParams(window.location.search);
    let productId = parseInt(urlParams.get('id'));

    fetch('../Data/ecobazar.json')
        .then(response => response.json())
        .then(data => {
            let foundProduct = null;
            let currentCategory = null;

            for (const category in data) {
                if (Array.isArray(data[category]) && category !== 'Sellers') {
                    // If no ID passed, pick a product with images and reviews as default to show off the UI well
                    if (!productId) {
                        if (category === 'Vegetables') {
                            foundProduct = data[category].find(p => p.name.includes('Cabbage')) || data[category][0];
                            currentCategory = category;
                            productId = foundProduct.product_id;
                            break;
                        }
                    } else {
                        const prod = data[category].find(p => p.product_id === productId);
                        if (prod) {
                            foundProduct = prod;
                            currentCategory = category;
                            break;
                        }
                    }
                }
            }

            // Fallback if ID is invalid
            if (!foundProduct && data["Vegetables"]) {
                foundProduct = data["Vegetables"][0];
                currentCategory = "Vegetables";
                productId = foundProduct.product_id;
            }

            if (foundProduct) {
                renderProductDetails(foundProduct);
                renderRelatedProducts(data, currentCategory, productId);
            } else {
                document.getElementById('product-main').innerHTML = '<div class="alert alert-danger">Product data not found!</div>';
            }
        });
}

function renderProductDetails(product) {
    currentProductData = product;

    // Title
    document.title = `Ecobazar - ${product.name}`;
    document.getElementById('product-title').textContent = product.name;

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

    // Build Thumbnail Gallery
    const thumbContainer = document.getElementById('thumbnail-container');
    thumbContainer.innerHTML = '';
    images.forEach((img, idx) => {
        const div = document.createElement('div');
        div.className = `img-thumbnail-wrapper cursor-pointer border rounded bg-white p-1 ${idx === 0 ? 'active-thumb' : ''}`;
        div.style.width = '80px';
        div.style.height = '80px';
        div.innerHTML = `<img src="${img}" alt="Thumb" class="w-100 h-100 object-fit-contain mix-blend-multiply">`;
        div.onclick = () => {
            mainImg.src = img;
            document.querySelectorAll('.img-thumbnail-wrapper').forEach(el => el.classList.remove('active-thumb'));
            div.classList.add('active-thumb');
        };
        thumbContainer.appendChild(div);
    });



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
    const reviewContainer = document.getElementById('reviews-container');
    if (product.reviews && product.reviews.length > 0) {
        const customerNames = ["Robert Fox", "Dianne Russell", "Eleanor Pena", "James Wilson", "Sarah Johnson"];
        reviewContainer.innerHTML = product.reviews.map((r, i) => {
            const name = customerNames[i % customerNames.length];
            const gender = r.user_id % 2 === 0 ? 'women' : 'men';
            const avatarId = (r.user_id % 90) + 1;
            const avatar = `https://randomuser.me/api/portraits/${gender}/${avatarId}.jpg`;
            const rStars = Array.from({ length: 5 }, (_, idx) => `<i class="fas fa-star" style="color: ${idx < r.rating ? '#FF8A00' : '#ddd'}"></i>`).join('');

            return `
            <div class="d-flex gap-4 mb-4 pb-4 border-bottom">
                <img src="${avatar}" alt="User" class="rounded-circle" style="width: 50px; height: 50px; object-fit:cover;">
                <div class="flex-grow-1">
                    <div class="d-flex justify-content-between align-items-center mb-1">
                        <h6 class="fw-bold mb-0 text-dark">${name}</h6>
                        <small class="text-muted">2 mins ago</small>
                    </div>
                    <div class="mb-2" style="font-size: 0.8rem;">${rStars}</div>
                    <p class="text-muted mb-0 small lh-lg">${r.comment}</p>
                </div>
            </div>`;
        }).join('');
    } else {
        reviewContainer.innerHTML = '<p class="text-muted py-4">No feedback available yet.</p>';
    }

    setupQuantityAndCart();

    // Update navbar breadcrumb to match the product
    const updateBreadcrumbUI = () => {
        const breadcrumbList = document.getElementById('breadcrumb-list');
        const breadcrumbSection = document.getElementById('breadcrumb-section');

        if (breadcrumbList) {
            breadcrumbList.innerHTML = `
                <li class="breadcrumb-item"><a href="Home.html" class="text-white opacity-75 text-decoration-none"><i class="fas fa-home"></i></a></li>
                <li class="breadcrumb-item"><a href="#" class="text-white opacity-75 text-decoration-none">Category</a></li>
                <li class="breadcrumb-item"><a href="#" class="text-white opacity-75 text-decoration-none">${product.category}</a></li>
                <li class="breadcrumb-item active fw-semibold" aria-current="page" style="color: var(--primary-green);">${product.name}</li>
            `;
        }

        if (breadcrumbSection) {
            const texts = breadcrumbSection.querySelectorAll('.text-muted, .text-dark');
            texts.forEach(t => {
                t.classList.remove('text-muted', 'text-dark');
                t.classList.add('text-white');
            });
        }
    };

    updateBreadcrumbUI();
    setTimeout(updateBreadcrumbUI, 100);
    setTimeout(updateBreadcrumbUI, 500);
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
        }
    };

    btnAddToCart.onclick = () => {
        if (!currentProductData) return;

        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItem = cart.find(item => item.product_id === currentProductData.product_id);

        if (existingItem) {
            existingItem.quantity += currentQty;
        } else {
            const img = currentProductData.images && currentProductData.images.length > 0
                ? currentProductData.images[0]
                : (currentProductData.img || currentProductData.image);

            cart.push({
                product_id: currentProductData.product_id,
                name: currentProductData.name,
                price: currentProductData.price,
                img: img,
                quantity: currentQty
            });
        }

        localStorage.setItem('cart', JSON.stringify(cart));

        // Update navbar cart badge if it exists
        if (window.updateCartBadge) window.updateCartBadge();

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

function renderRelatedProducts(data, currentCategory, currentProductId) {
    const container = document.getElementById('related-products-container');
    if (!container || !data[currentCategory]) return;

    // Get current user wishlist for heart icons
    let wishlistIds = [];
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user) {
        const wl = JSON.parse(localStorage.getItem('wishlist')) || [];
        const uw = wl.find(i => i.user_id === user.id);
        if (uw) wishlistIds = uw.product_ids || (uw.product_id ? [uw.product_id] : []);
    }

    // Filter out current product and get up to 4 items
    const related = data[currentCategory]
        .filter(p => p.product_id !== currentProductId)
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
                        <a href="#" class="action-icon-btn" title="Add to Wishlist" onclick="window.addToWishlistData(event, ${p.product_id || 0})">
                            <i class="${wishlistIds.includes(p.product_id || 0) ? 'fas fa-heart text-success' : 'far fa-heart'}"></i>
                        </a>
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
                            <button class="add-btn-circle" onclick="window.addToCartData(event, ${p.product_id || 0}, '${encodeURIComponent(p.name).replace(/'/g, "%27")}', ${p.price}, '${img}')"><i class="fas fa-shopping-bag"></i></button>
                        </div>
                    </div>
                </div>
            </div>`;
    }).join('');
}
