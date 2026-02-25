// navbar.js - Breadcrumb and navbar functionality
document.addEventListener('DOMContentLoaded', () => {
    initBreadcrumb();
});

function initBreadcrumb() {
    const breadcrumbList = document.getElementById('breadcrumb-list');
    if (!breadcrumbList) return;

    // Get the current page name from the URL
    const path = window.location.pathname;
    let fileName = path.split('/').pop() || 'Home.html';
    fileName = fileName.split('?')[0].split('#')[0]; // strip query and hash

    // Remove extension and clean up
    let rawPageName = fileName.replace('.html', '').replace('.htm', '');
    let pageName = 'Home';

    if (rawPageName.toLowerCase() === 'aboutus') {
        pageName = 'About Us';
    } else if (rawPageName.toLowerCase() === 'contactus') {
        pageName = 'Contact Us';
    } else if (rawPageName.toLowerCase() === 'userdashboard') {
        pageName = 'User Dashboard';
    } else {
        // Capitalize and format the page name nicely
        pageName = rawPageName
            .replace(/[-_]/g, ' ')        // Replace dashes/underscores with spaces
            .replace(/\b\w/g, c => c.toUpperCase()); // Capitalize first letter of each word
    }

    if (!pageName || pageName.toLowerCase() === 'index' || pageName === '') {
        pageName = 'Home';
    }

    // Set the breadcrumb content
    if (pageName.toLowerCase() === 'home') {
        breadcrumbList.innerHTML = `<li class="breadcrumb-item active d-flex align-items-center" id="breadcrumb-current"><a href="Home.html" class="text-white text-decoration-none opacity-75"><i class="fas fa-home me-2"></i> ${pageName}</a></li>`;
    } else {
        // Use a > separator by default with Bootstrap
        breadcrumbList.style.setProperty('--bs-breadcrumb-divider', "'>'");
        breadcrumbList.innerHTML = `
            <li class="breadcrumb-item"><a href="Home.html" class="text-white opacity-75 text-decoration-none"><i class="fas fa-home"></i></a></li>
            <li class="breadcrumb-item active fw-semibold" aria-current="page" id="breadcrumb-current" style="color: var(--primary-green);">${pageName}</li>
        `;
    }

    // Highlight the active nav link based on the current page
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    navLinks.forEach(link => {
        const linkText = link.textContent.trim().toLowerCase();
        if (linkText === pageName.toLowerCase()) {
            link.classList.add('active', 'fw-semibold');
            link.classList.remove('text-muted');
            link.style.setProperty('color', 'var(--primary-green)', 'important');
        } else {
            link.classList.remove('active', 'fw-semibold');
            link.classList.add('text-muted');
            link.style.color = '';
        }
    });
}

function initAuthDisplay() {
    const authContainer = document.getElementById('nav-auth-container');
    if (!authContainer) return;

    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || JSON.parse(localStorage.getItem('currentSeller'));

    if (currentUser) {
        const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name || 'User')}&background=00B207&color=fff&size=100`;
        authContainer.innerHTML = `
            <div class="dropdown">
                <a href="#" class="text-white text-decoration-none dropdown-toggle d-flex align-items-center" id="userDropdown" aria-expanded="false">
                    <img src="${avatarUrl}" alt="Avatar" class="rounded-circle me-2" style="width: 25px; height: 25px; object-fit: cover; border: 1px solid rgba(255,255,255,0.5);">
                    <span class="small fw-semibold">Hi, ${currentUser.name || 'User'}</span>
                </a>
                <ul class="dropdown-menu dropdown-menu-end shadow-sm border-0 mt-2" aria-labelledby="userDropdown">
                    <li><a class="dropdown-item small py-2" href="../Pages/userdashboard.html"><i class="fa-solid fa-table-cells-large fa-sm me-2 text-muted"></i>My Dashboard</a></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item small py-2 text-danger" href="#" id="logoutBtn"><i class="fas fa-sign-out-alt fa-sm me-2"></i>Logout</a></li>
                </ul>
            </div>
        `;

        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('currentUser');
                localStorage.removeItem('RememberedUser');
                localStorage.removeItem('currentSeller');
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
}

// Ensure globally available for dynamic loading
window.initNavBarAuth = initAuthDisplay;
window.initBreadcrumb = initBreadcrumb;

window.updateCartBadge = function () {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let count = 0;
    let total = 0;
    if (currentUser) {
        const cartKey = 'cart_' + currentUser.id;
        const usercart = JSON.parse(localStorage.getItem(cartKey));
        if (usercart && usercart.items) {
            usercart.items.forEach(item => {
                count += parseInt(item.quantity) || 0;
                total += (parseFloat(item.price) || 0) * (parseInt(item.quantity) || 0);
            });
        }
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
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        alert('Please login first to add items to cart.');
        window.location.href = 'Login.html';
        return;
    }
    const cartKey = 'cart_' + currentUser.id;
    let usercart = JSON.parse(localStorage.getItem(cartKey)) || { items: [] };
    const existingItem = usercart.items.find(item => item.id == id || item.product_id == id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        usercart.items.push({
            id: id,
            product_id: id,
            name: decodeURIComponent(name),
            price: parseFloat(price),
            image: image,
            quantity: 1
        });
    }
    localStorage.setItem(cartKey, JSON.stringify(usercart));
    window.dispatchEvent(new Event('storage'));
    if (window.updateCartBadge) window.updateCartBadge();

    // Show Toast
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
          <i class="fas fa-check-circle me-2"></i> ${decodeURIComponent(name)} added to cart!
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

window.addToWishlistData = function (event, id) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }

    // Check user login (optional based on your app logic, here we enforce it like cart)
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        alert('Please login first to add items to your wishlist.');
        window.location.href = 'Login.html';
        return;
    }

    const wishlistKey = 'wishlist';
    let wishlist = JSON.parse(localStorage.getItem(wishlistKey)) || [];

    // Find the current user's wishlist entry
    let userWishlist = wishlist.find(item => item.user_id === currentUser.id);

    // If it doesn't exist, create it
    if (!userWishlist) {
        userWishlist = { user_id: currentUser.id, product_ids: [] };
        wishlist.push(userWishlist);
    } else if (!userWishlist.product_ids) {
        // Fallback for older localStorage schemas
        userWishlist.product_ids = userWishlist.product_id ? [userWishlist.product_id] : [];
    }

    const btn = event ? event.currentTarget : null;
    const icon = btn ? btn.querySelector('.fa-heart') : null;

    if (!userWishlist.product_ids.includes(id)) {
        // ADD ITEM
        userWishlist.product_ids.push(id);
        localStorage.setItem(wishlistKey, JSON.stringify(wishlist));

        if (icon) {
            icon.classList.remove('far');
            icon.classList.add('fas', 'text-success');
        }

        showWishlistToast('Product added to wishlist!', 'bg-success');
    } else {
        // REMOVE ITEM
        userWishlist.product_ids = userWishlist.product_ids.filter(pId => pId !== id);
        localStorage.setItem(wishlistKey, JSON.stringify(wishlist));

        if (icon) {
            icon.classList.remove('fas', 'text-success');
            icon.classList.add('far');
        }

        showWishlistToast('Product removed from wishlist!', 'bg-secondary');
    }
};

function showWishlistToast(msg, bgClass) {
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
        toastContainer.style.zIndex = '1055';
        document.body.appendChild(toastContainer);
    }
    const toastEl = document.createElement('div');
    toastEl.className = `toast align-items-center text-white ${bgClass} border-0 fade show`;
    toastEl.setAttribute('role', 'alert');
    toastEl.innerHTML = `
      <div class="d-flex">
        <div class="toast-body">
          <i class="fas fa-heart me-2"></i> ${msg}
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
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
}
