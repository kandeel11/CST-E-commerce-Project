document.addEventListener("DOMContentLoaded", () => {
    loadComponents();
    loadData();
    initCountdown();
});

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
        })
        .catch(error => console.error('Error loading navbar:', error));

    // 2. Load Footer
    fetch('Footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-placeholder').innerHTML = data;
        })
        .catch(error => console.error('Error loading footer:', error));
}

// Fetch JSON data and render sections
function loadData() {
    fetch('../Js/ecobazar.json')
        .then(response => response.json())
        .then(data => {
            renderCategories(data);
            renderProducts(data);
            renderHotDeals(data);
            renderTestimonials(data);
        })
        .catch(error => console.error('Error loading data:', error));
}

// ========== CATEGORIES ==========
const categoryMeta = {
    Fruits: { name: "Fruits", icon: "fa-apple-alt" },
    Vegetables: { name: "Vegetables", icon: "fa-carrot" },
    Meat: { name: "Meat", icon: "fa-drumstick-bite" },
    Fish: { name: "Fish & Seafood", icon: "fa-fish" },
    Dairy: { name: "Dairy", icon: "fa-cheese" },
    Bakery: { name: "Bread & Bakery", icon: "fa-bread-slice" },
    Beverages: { name: "Beverages", icon: "fa-mug-hot" }
};

function renderCategories(data) {
    const container = document.getElementById('categories-container');
    if (!container) return;

    const categoryKeys = Object.keys(data).filter(key => Array.isArray(data[key]));

    container.innerHTML = categoryKeys.map(key => {
        const meta = categoryMeta[key] || { name: key, icon: "fa-box" };
        const count = data[key].length;

        return `
            <div class="col">
                <div class="category-card">
                    <i class="fas ${meta.icon} category-icon"></i>
                    <h6 class="small fw-bold mb-0">${meta.name}</h6>
                    <small class="text-muted">${count} Products</small>
                </div>
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
        if (Array.isArray(data[category])) {
            allProducts = allProducts.concat(data[category]);
        }
    }

    // Pick first 10 products for the homepage
    const featured = allProducts.slice(0, 10);

    container.innerHTML = featured.map(product => {
        const imgSrc = product.img || product.image || '';
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
            ? `<span class="badge bg-danger position-absolute top-0 start-0 m-3">Sale ${discount}%</span>`
            : '';

        // Old price
        const oldPriceHtml = oldPrice
            ? `<small class="text-muted text-decoration-line-through">$${oldPrice.toLocaleString()}</small>`
            : '';

        return `
            <div class="col">
                <div class="card product-card h-100">
                    ${badgeHtml}
                    <img src="${imgSrc}" class="card-img-top" alt="${name}">
                    <div class="card-body d-flex flex-column">
                        <h6 class="card-title text-truncate">${name}</h6>
                        <div class="d-flex justify-content-between align-items-center mt-auto">
                            <div>
                                <span class="fw-bold">$${price.toLocaleString()}</span>
                                ${oldPriceHtml}
                                <div class="small">${starsHtml}</div>
                            </div>
                            <button class="add-btn-circle"><i class="fas fa-shopping-bag"></i></button>
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
        if (Array.isArray(data[category])) {
            allProducts = allProducts.concat(data[category]);
        }
    }
    allProducts.sort((a, b) => (b.discount || 0) - (a.discount || 0));

    const featured = allProducts[0];
    const gridProducts = allProducts.slice(1, 10);

    // Helper: generate stars
    function starsHtml(rating) {
        return Array.from({ length: 5 }, (_, i) =>
            `<i class="fas fa-star" style="color: ${i < rating ? '#FF8A00' : '#ddd'}; font-size: 0.7rem;"></i>`
        ).join('');
    }

    // Featured card (left)
    const featImg = featured.img || featured.image || '';
    const featReviewCount = featured.reviews ? featured.reviews.length * 100 + 24 : 0;
    const featuredHtml = `
        <div class="col-lg-5">
            <div class="hot-deal-featured card border rounded-3 h-100">
                <div class="position-relative p-3">
                    <div class="d-flex gap-2 position-absolute top-0 start-0 m-3 z-1">
                        <span class="badge bg-danger">Sale ${featured.discount}%</span>
                        ${featured.monthSale ? '<span class="badge bg-primary">Best Sale</span>' : ''}
                    </div>
                    <img src="${featImg}" class="w-100 rounded" alt="${featured.name}" style="height: 260px; object-fit: contain;">
                    <div class="d-flex align-items-center gap-2 mt-3">
                        <button class="btn btn-outline-secondary btn-sm rounded-circle" style="width:36px;height:36px;"><i class="far fa-heart"></i></button>
                        <a href="#" class="btn btn-sm rounded-pill flex-grow-1 fw-semibold py-2" style="background:var(--primary-green);color:#fff;">
                            <i class="fas fa-shopping-bag me-1"></i> Add to Cart
                        </a>
                        <button class="btn btn-outline-secondary btn-sm rounded-circle" style="width:36px;height:36px;"><i class="far fa-eye"></i></button>
                    </div>
                </div>
                <div class="card-body text-center">
                    <a href="#" class="text-green text-decoration-none fw-medium">${featured.name}</a>
                    <div class="mt-1">
                        <span class="fw-bold fs-5">$${featured.price.toFixed(2)}</span>
                        ${featured.oldPrice ? `<small class="text-muted text-decoration-line-through ms-1">$${featured.oldPrice.toFixed(2)}</small>` : ''}
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

    // Grid cards (right)
    const gridHtml = gridProducts.map(p => {
        const img = p.img || p.image || '';
        const oldPriceHtml = p.oldPrice ? `<small class="text-muted text-decoration-line-through">$${p.oldPrice.toFixed(2)}</small>` : '';
        const saleBadge = p.discount > 28 ? `<span class="badge bg-danger position-absolute top-0 start-0 m-2" style="font-size:0.65rem;">Sale ${p.discount}%</span>` : '';
        return `
            <div class="col-6 col-md-4">
                <div class="card hot-deal-card h-100 border rounded-3 position-relative">
                    ${saleBadge}
                    <div class="p-2 text-center" style="height:120px; display:flex; align-items:center; justify-content:center;">
                        <img src="${img}" alt="${p.name}" style="max-height:100%; max-width:100%; object-fit:contain;">
                    </div>
                    <div class="card-body py-2 px-2">
                        <p class="small mb-1 text-truncate">${p.name}</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <span class="fw-bold small">$${p.price.toFixed(2)}</span> ${oldPriceHtml}
                            </div>
                            <button class="add-btn-circle" style="width:28px;height:28px;font-size:0.65rem;"><i class="fas fa-shopping-bag"></i></button>
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

// ========== TESTIMONIALS (from product reviews) ==========
// Display names mapped to user_ids for testimonial cards
const customerNames = [
    "Robert Fox", "Dianne Russell", "Eleanor Pena", "James Wilson",
    "Sarah Johnson", "Michael Brown", "Emily Davis", "David Martinez",
    "Jessica Taylor", "Daniel Anderson"
];

function renderTestimonials(data) {
    const track = document.getElementById('testimonial-track');
    if (!track) return;

    // Collect all reviews from all products across all categories
    let allReviews = [];
    for (const category in data) {
        if (!Array.isArray(data[category])) continue;
        data[category].forEach(product => {
            if (product.reviews && product.reviews.length > 0) {
                product.reviews.forEach(review => {
                    allReviews.push({
                        ...review,
                        productName: product.name
                    });
                });
            }
        });
    }

    // Filter for high-rated reviews (4+ stars) and pick 6 for the carousel
    const topReviews = allReviews
        .filter(r => r.rating >= 4)
        .slice(0, 6);

    if (topReviews.length === 0) return;

    // Render testimonial cards
    track.innerHTML = topReviews.map((review, index) => {
        const name = customerNames[index % customerNames.length];
        // Use user_id to pick a consistent avatar (men for odd, women for even)
        const gender = review.user_id % 2 === 0 ? 'women' : 'men';
        const avatarId = (review.user_id % 90) + 1;
        const avatar = `https://randomuser.me/api/portraits/${gender}/${avatarId}.jpg`;

        const starsHtml = Array.from({ length: 5 }, (_, i) =>
            `<i class="fas fa-star" style="color: ${i < review.rating ? '#FF8A00' : '#ddd'}"></i>`
        ).join('');

        return `
            <div class="testimonial-card">
                <div class="quote-icon"><i class="fas fa-quote-right"></i></div>
                <p class="testimonial-text">${review.comment}</p>
                <p class="testimonial-product"><i class="fas fa-box-open"></i> ${review.productName}</p>
                <div class="testimonial-footer">
                    <div class="d-flex align-items-center gap-3">
                        <img src="${avatar}" alt="${name}" class="testimonial-avatar">
                        <div>
                            <h6 class="mb-0 fw-semibold">${name}</h6>
                            <small class="text-muted">Customer</small>
                        </div>
                    </div>
                    <div class="testimonial-stars">${starsHtml}</div>
                </div>
            </div>
        `;
    }).join('');

    // Initialize carousel after rendering
    initTestimonialCarousel();
}

function initTestimonialCarousel() {
    const track = document.getElementById('testimonial-track');
    const prevBtn = document.getElementById('testimonial-prev');
    const nextBtn = document.getElementById('testimonial-next');

    if (!track || !prevBtn || !nextBtn) return;

    const cards = track.querySelectorAll('.testimonial-card');
    let currentIndex = 0;

    function getVisibleCount() {
        if (window.innerWidth < 576) return 1;
        if (window.innerWidth < 992) return 2;
        return 3;
    }

    function getMaxIndex() {
        return Math.max(0, cards.length - getVisibleCount());
    }

    function updateCarousel() {
        const visibleCount = getVisibleCount();
        const gap = 24;
        const cardWidth = (track.parentElement.offsetWidth - gap * (visibleCount - 1)) / visibleCount;
        const offset = currentIndex * (cardWidth + gap);
        track.style.transform = `translateX(-${offset}px)`;
    }

    nextBtn.addEventListener('click', () => {
        if (currentIndex < getMaxIndex()) {
            currentIndex++;
            updateCarousel();
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    });

    window.addEventListener('resize', () => {
        currentIndex = Math.min(currentIndex, getMaxIndex());
        updateCarousel();
    });
}