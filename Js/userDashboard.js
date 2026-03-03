/* ============================
   User Dashboard JS - Ecobazar
   ============================ */

// ---- Auth Guard ----
{
    let currentUser = JSON.parse(sessionStorage.getItem("currentUser")) || null;
    if (!currentUser) {
        window.location.href = "Login.html";
    }
}

const navUsername = document.getElementById("navUsername");
const profileName = document.getElementById("profileName");
const profileRole = document.getElementById("profileRole");
const profileAvatar = document.getElementById("profileAvatar");
const billingName = document.getElementById("billingName");
const billingAddress = document.getElementById("billingAddress");
const billingEmail = document.getElementById("billingEmail");
const billingPhone = document.getElementById("billingPhone");
const recentOrdersBody = document.getElementById("recentOrdersBody");
const allOrdersBody = document.getElementById("allOrdersBody");
const wishlistGrid = document.getElementById("wishlistGrid");
const cartCountEl = document.getElementById("cartCount");
const currentUser = JSON.parse(sessionStorage.getItem("currentUser")) || null;

const sidebarLinks = document.querySelectorAll(".sidebar-nav .nav-link[data-section]");
const contentSections = document.querySelectorAll(".content-section");

// Handle all links with data-section (sidebar + inline links)
document.addEventListener("click", function (e) {
    const link = e.target.closest("[data-section]");
    if (!link) return;
    e.preventDefault();
    const section = link.getAttribute("data-section");
    switchSection(section);
});

function switchSection(sectionName) {
    // Hide all sections
    contentSections.forEach(s => s.classList.add("d-none"));

    // Show target section
    const target = document.getElementById("section-" + sectionName);
    if (target) target.classList.remove("d-none");

    // Update sidebar active state
    sidebarLinks.forEach(l => l.classList.remove("active"));
    const activeLink = document.querySelector(`.sidebar-nav .nav-link[data-section="${sectionName}"]`);
    if (activeLink) activeLink.classList.add("active");

    // Load data for certain sections
    if (sectionName === "orders") renderAllOrders();
    if (sectionName === "wishlist") window.location.href = "wishlist.html"; // Redirect to wishlist page
    if (sectionName === "settings") loadSettings();
}

// ---- Initialize Profile ----
function initProfile() {
    const userProfile = getUserProfile();
    const name = userProfile.Fname
        ? `${userProfile.Fname} ${userProfile.Lname || ""}`.trim()
        : currentUser.Fname && currentUser.Lname ? `${currentUser.Fname} ${currentUser.Lname}` : "User";
    profileName.textContent = name;
    profileRole.textContent = currentUser.Role || "Customer";
    profileAvatar.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=00B207&color=fff&size=100`;

    billingName.textContent = name;
    billingEmail.textContent = currentUser.Email || "Not set";

    const addr = userProfile.address;
    if (addr && addr.street) {
        const parts = [addr.street, addr.city, addr.state, addr.zip, addr.country].filter(Boolean);
        billingAddress.textContent = parts.join(", ");
    } else {
        billingAddress.textContent = "No address set";
    }
    billingPhone.textContent = userProfile.phone || "Not set";
}

// ---- User Profile Storage ----
// Extend currentUser data with profile/address stored separately
function getUserProfile() {
    const profiles = JSON.parse(localStorage.getItem("currentUser")) || {};
    return profiles[currentUser.Email] || {
        firstName: currentUser.Fname ? currentUser.Fname : "",
        lastName: currentUser.Lname || "",

        phone: currentUser.Phone || "",
        address: currentUser.address ? {
            street: currentUser.address.split(",")[0]?.trim() || "",
            city: currentUser.address.split(",")[1]?.trim() || "",
            country: currentUser.address.split(",")[2]?.trim() || ""
        }
            : null
    }
};

function saveUserProfile(profile) {
    const profiles = JSON.parse(localStorage.getItem("currentUser")) || {};
    profiles[currentUser.Email] = profile;
    localStorage.setItem("currentUser", JSON.stringify(profiles));
}

// ---- Orders ----
function getOrders() {
    const allOrders = JSON.parse(localStorage.getItem("orders")) || [];
    return allOrders.filter(o => o.userid === currentUser.id);
}

// ---- Auto-refresh orders when storage changes (from other tabs or pages) ----
window.addEventListener("storage", function (e) {
    if (e.key === "orders" || e.key === "order") {
        const ordersSection = document.getElementById("section-orders");
        if (ordersSection && !ordersSection.classList.contains("d-none")) {
            renderAllOrders();
        }
        checkForNewlyCompletedOrders();
    }
});


function renderAllOrders() {
    const orders = getOrders();
    allOrdersBody.innerHTML = "";

    if (orders.length === 0) {
        document.getElementById("noAllOrdersMsg").classList.remove("d-none");
        return;
    }
    document.getElementById("noAllOrdersMsg").classList.add("d-none");

    orders.forEach(order => {
        allOrdersBody.innerHTML += createOrderRow(order);
    });
}

function createOrderRow(order) {
    const statusClass = getStatusClass(order.orderStatus);
    const itemCount = order.products ? order.products.length : 0;
    const productText = itemCount === 1 ? "1 Product" : `${itemCount} Products`;
    const isCancellable = order.orderStatus && !['completed', 'cancelled', 'usercancelled'].includes(order.orderStatus.toLowerCase());
    const cancelBtn = isCancellable
        ? `<button class="btn btn-outline-danger btn-sm rounded-pill ms-2 cancel-order-btn" onclick="confirmCancelOrder('${order.orderid}')"><i class="fas fa-times-circle me-1"></i>Cancel</button>`
        : '';

    // Show Review button for completed orders
    const isCompleted = order.orderStatus && order.orderStatus.toLowerCase() === 'completed';
    const hasUnreviewedProducts = isCompleted && hasProductsToReview(order);
    const reviewBtn = hasUnreviewedProducts
        ? `<button class="btn btn-outline-success btn-sm rounded-pill ms-2 review-order-btn" onclick="openReviewModal('${order.orderid}')"><i class="fas fa-star me-1"></i>Review</button>`
        : '';

    return `
        <tr>
            <td class="fw-semibold">#${order.orderid}</td>
            <td>${formatDate(order.createddate)}</td>
            <td>$${order.total.toFixed(2)} <span class="text-muted small">(${productText})</span></td>
            <td><span class="badge-status ${statusClass}">${order.orderStatus}</span></td>
            <td>
                <a href="#" class="view-details-link" onclick="viewOrderDetail('${order.orderid}')">View Details</a>
                ${cancelBtn}
                ${reviewBtn}
            </td>
        </tr>
    `;
}

function getStatusClass(status) {
    switch (status?.toLowerCase()) {
        case "pending": return "badge-pending";
        case "processing": return "badge-processing";
        case "completed": return "badge-completed";
        case "cancelled": return "badge-cancelled";
        case "usercancelled": return "badge-user-cancelled";
        default: return "badge-pending";
    }
}

function formatDate(dateStr) {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
}

// ---- View Order Detail (Modal) ----
window.viewOrderDetail = function (orderId) {
    const orders = getOrders();
    const order = orders.find(o => o.orderid === Number(orderId));
    if (!order) return;

    const body = document.getElementById("orderDetailBody");
    let itemsHtml = "";

    if (order.products && order.products.length > 0) {
        order.products.forEach(item => {
            const productStatus = item.status || order.orderStatus;
            const productStatusClass = getStatusClass(productStatus);
            itemsHtml += `
                <div class="order-detail-item">
                    <img src="${item.images[0]}" alt="${item.name}">
                    <div class="flex-grow-1">
                        <h6 class="mb-0 fw-semibold small">${item.name}</h6>
                        <p class="text-muted mb-0 small">Qty: ${item.quantity} × $${item.price.toFixed(2)}</p>
                    </div>
                    <div class="d-flex align-items-center gap-2">
                        <span class="badge-status ${productStatusClass}" style="font-size:0.72rem;">${productStatus}</span>
                        <span class="fw-bold small">$${(item.quantity * item.price).toFixed(2)}</span>
                    </div>
                </div>
            `;
        });
    }

    body.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom">
            <div>
                <p class="mb-1 small text-muted">Order ID</p>
                <h6 class="fw-bold mb-0">#${order.orderid}</h6>
            </div>
            <div class="text-end">
                <p class="mb-1 small text-muted">Date</p>
                <h6 class="fw-bold mb-0">${formatDate(order.createddate)}</h6>
            </div>
            <div class="text-end">
                <p class="mb-1 small text-muted">Status</p>
                <span class="badge-status ${getStatusClass(order.orderStatus)}">${order.orderStatus}</span>
            </div>
        </div>
        <div class="mb-3">
            ${itemsHtml || '<p class="text-muted">No item details available.</p>'}
        </div>
        <div class="d-flex justify-content-between align-items-center pt-3 border-top">
            <h6 class="fw-bold mb-0">Total</h6>
            <h5 class="fw-bold text-success mb-0">$${order.total.toFixed(2)}</h5>
        </div>
    `;

    const modal = new bootstrap.Modal(document.getElementById("orderDetailModal"));
    modal.show();
};


// ---- Cancel Order ----
let pendingCancelOrderId = null;

window.confirmCancelOrder = function (orderId) {
    pendingCancelOrderId = orderId;
    const modal = new bootstrap.Modal(document.getElementById("cancelOrderModal"));
    modal.show();
};

document.addEventListener("click", function (e) {
    if (e.target && e.target.id === "confirmCancelBtn") {
        if (pendingCancelOrderId) {
            cancelOrder(pendingCancelOrderId);
            pendingCancelOrderId = null;
        }
        const modalEl = document.getElementById("cancelOrderModal");
        const modal = bootstrap.Modal.getInstance(modalEl);
        if (modal) modal.hide();
    }
});

function cancelOrder(orderId) {
    // Update in "orders" key (used by dashboard)
    let allOrders = JSON.parse(localStorage.getItem("orders")) || [];
    const order = allOrders.find(o => o.orderid === Number(orderId) && o.userid === currentUser.id);
    if (!order) {
        showToast("Order not found!", true);
        return;
    }

    order.orderStatus = "userCancelled";
    localStorage.setItem("orders", JSON.stringify(allOrders));

    // Restore product stock
    if (order.products && order.products.length > 0) {
        restoreProductStock(order.products);
    }

    renderAllOrders();
    showToast("Order cancelled successfully!");
}

function restoreProductStock(products) {
    let allProducts = JSON.parse(localStorage.getItem("products")) || [];
    products.forEach(item => {
        const product = allProducts.find(p => p.product_id === item.product_id || p.product_id == item.product_id);
        if (product) {
            product.stock = (product.stock || 0) + (item.quantity || 1);
        }
    });
    localStorage.setItem("products", JSON.stringify(allProducts));
}

// ---- Settings ----
function loadSettings() {
    const profile = getUserProfile();

    document.getElementById("settingFirstName").value = profile.firstName || "";
    document.getElementById("settingLastName").value = profile.lastName || "";
    document.getElementById("settingEmail").value = currentUser.Email || "";
    document.getElementById("settingPhone").value = profile.phone || "";

    const addr = profile.address || {};
    document.getElementById("settingStreet").value = addr.street || "";
    document.getElementById("settingCity").value = addr.city || "";

    document.getElementById("settingCountry").value = addr.country || "";
}

// Account Form
document.getElementById("accountForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const profile = getUserProfile();
    profile.firstName = document.getElementById("settingFirstName").value.trim();
    profile.lastName = document.getElementById("settingLastName").value.trim();
    profile.phone = document.getElementById("settingPhone").value.trim();
    if (profile.phone && !isValidPhone(profile.phone)) {
        showToast("Phone number must be 11 digits!", true);
        return;
    }
    saveUserProfile(profile);
    // Update currentUser name in localStorage
    currentUser.Fname = profile.firstName;
    currentUser.Lname = profile.lastName;
    sessionStorage.setItem("currentUser", JSON.stringify(currentUser));
    // Also update in users array
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const userIdx = users.findIndex(u => u.Email === currentUser.Email);
    if (userIdx !== -1) {
        users[userIdx].Fname = profile.firstName;
        users[userIdx].Lname = profile.lastName;
        sessionStorage.setItem("users", JSON.stringify(users));
    }
    initProfile();
    showToast("Account settings saved!");
});

// Address Form
document.getElementById("addressForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const profile = getUserProfile();
    profile.address = {
        street: document.getElementById("settingStreet").value.trim(),
        city: document.getElementById("settingCity").value.trim(),
        country: document.getElementById("settingCountry").value.trim()
    };
    saveUserProfile(profile);
    initProfile();
    showToast("Billing address saved!");
});
function IsValidPassword(password) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{7,}$/;
    return passwordRegex.test(password);
}
function isValidPhone(phone) {
    const phoneRegex = /^01[0125][0-9]{8}$/;
    return phoneRegex.test(phone);
}
// Password Form
document.getElementById("passwordForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const currentPw = document.getElementById("currentPassword").value;
    const newPw = document.getElementById("newPassword").value;
    const confirmPw = document.getElementById("confirmPassword").value;

    if (currentPw !== currentUser.password) {
        showToast("Current password is incorrect!", true);
        return;
    }
    if (!IsValidPassword(newPw)) {
        showToast("New password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, and one digit!", true);
        return;
    }
    if (newPw !== confirmPw) {
        showToast("Passwords do not match!", true);
        return;
    }

    // Update password
    currentUser.password = newPw;
    sessionStorage.setItem("currentUser", JSON.stringify(currentUser));

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const userIdx = users.findIndex(u => u.Email === currentUser.Email);
    if (userIdx !== -1) {
        users[userIdx].password = newPw;
        localStorage.setItem("users", JSON.stringify(users));
    }

    document.getElementById("passwordForm").reset();
    showToast("Password changed successfully!");
});

// ---- Logout ----
document.getElementById("logoutBtn").addEventListener("click", function (e) {
    e.preventDefault();
    sessionStorage.removeItem("currentUser");
    window.location.href = "Login.html";
});

// ---- Product Review Helpers ----
function hasProductsToReview(order) {
    if (!order.products || order.products.length === 0) return false;
    const allProducts = JSON.parse(localStorage.getItem("products")) || [];
    return order.products.some(item => {
        const prod = allProducts.find(p => p.product_id === item.product_id || p.product_id == item.product_id);
        if (!prod) return false;
        const reviews = prod.reviews || [];
        return !reviews.some(r => r.user_id === currentUser.id);
    });
}

// ---- Open Review Modal ----
window.openReviewModal = function (orderId) {
    const orders = getOrders();
    const order = orders.find(o => o.orderid === Number(orderId));
    if (!order || !order.products) return;

    const container = document.getElementById("reviewOrderProducts");
    const allProducts = JSON.parse(localStorage.getItem("products")) || [];
    let html = '';

    order.products.forEach(item => {
        const prod = allProducts.find(p => p.product_id === item.product_id || p.product_id == item.product_id);
        const existingReviews = prod ? (prod.reviews || []) : [];
        const alreadyReviewed = existingReviews.some(r => r.user_id === currentUser.id);
        const img = item.images && item.images[0] ? item.images[0] : '';

        html += `
            <div class="d-flex gap-3 mb-4 pb-3 border-bottom review-product-item" data-product-id="${item.product_id}">
                <img src="${img}" alt="${item.name}" class="rounded" style="width:60px;height:60px;object-fit:cover;">
                <div class="flex-grow-1">
                    <h6 class="mb-1 fw-semibold">${item.name}</h6>
                    <p class="text-muted small mb-2">Qty: ${item.quantity} × $${item.price.toFixed(2)}</p>
                    ${alreadyReviewed
                ? '<span class="badge bg-success-subtle text-success border border-success-subtle"><i class="fas fa-check me-1"></i>Already Reviewed</span>'
                : `<div class="mb-2">
                            <label class="form-label small fw-semibold mb-1">Rating</label>
                            <div class="d-flex gap-1 review-stars" data-product-id="${item.product_id}">
                                ${Array.from({ length: 5 }, (_, i) => `<i class="fas fa-star review-star-btn" data-rating="${i + 1}" style="color:#ddd;font-size:1.3rem;cursor:pointer;"></i>`).join('')}
                            </div>
                            <input type="hidden" class="review-rating-input" value="0">
                        </div>
                        <div>
                            <textarea class="form-control form-control-sm review-comment-input" rows="2" placeholder="Write your review (optional)..."></textarea>
                        </div>`
            }
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
    container.dataset.orderId = orderId;

    // Setup star interactions
    container.querySelectorAll('.review-stars').forEach(starsDiv => {
        const stars = starsDiv.querySelectorAll('.review-star-btn');
        const ratingInput = starsDiv.parentElement.querySelector('.review-rating-input');
        stars.forEach(star => {
            star.addEventListener('mouseover', () => {
                const r = parseInt(star.dataset.rating);
                stars.forEach((s, i) => s.style.color = i < r ? '#FF8A00' : '#ddd');
            });
            star.addEventListener('mouseout', () => {
                const cur = parseInt(ratingInput.value);
                stars.forEach((s, i) => s.style.color = i < cur ? '#FF8A00' : '#ddd');
            });
            star.addEventListener('click', () => {
                ratingInput.value = star.dataset.rating;
                const r = parseInt(star.dataset.rating);
                stars.forEach((s, i) => s.style.color = i < r ? '#FF8A00' : '#ddd');
            });
        });
    });

    const modal = new bootstrap.Modal(document.getElementById("reviewOrderModal"));
    modal.show();
};

// ---- Submit Order Reviews ----
document.getElementById("submitOrderReviewsBtn").addEventListener("click", function () {
    const container = document.getElementById("reviewOrderProducts");
    const items = container.querySelectorAll('.review-product-item');
    let allProducts = JSON.parse(localStorage.getItem("products")) || [];
    let reviewCount = 0;

    items.forEach(item => {
        const productId = item.dataset.productId;
        const ratingInput = item.querySelector('.review-rating-input');
        const commentInput = item.querySelector('.review-comment-input');
        if (!ratingInput) return; // already reviewed

        const rating = parseInt(ratingInput.value);
        if (rating === 0) return; // user didn't rate this one

        const comment = commentInput ? commentInput.value.trim() : '';
        const prod = allProducts.find(p => String(p.product_id) === String(productId));
        if (!prod) return;

        if (!prod.reviews) prod.reviews = [];
        // Prevent duplicate
        if (prod.reviews.some(r => r.user_id === currentUser.id)) return;

        prod.reviews.push({
            user_id: currentUser.id,
            rating: rating,
            comment: comment || 'Great product!',
            date: new Date().toISOString()
        });
        // Recalculate average rating
        prod.rating = Math.round(prod.reviews.reduce((acc, r) => acc + r.rating, 0) / prod.reviews.length);
        reviewCount++;
    });

    localStorage.setItem("products", JSON.stringify(allProducts));

    const modalEl = document.getElementById("reviewOrderModal");
    const modal = bootstrap.Modal.getInstance(modalEl);
    if (modal) modal.hide();

    if (reviewCount > 0) {
        showToast(`Thank you! ${reviewCount} review${reviewCount > 1 ? 's' : ''} submitted successfully!`);
    } else {
        showToast("No reviews submitted. You can review later from your orders.");
    }

    renderAllOrders();
});


// ---- Toast ----
function showToast(message, isError = false) {
    const toastEl = document.getElementById("toastNotification");
    const toastMsg = document.getElementById("toastMessage");
    toastMsg.textContent = message;

    if (isError) {
        toastEl.classList.remove("text-bg-success");
        toastEl.classList.add("text-bg-danger");
    } else {
        toastEl.classList.remove("text-bg-danger");
        toastEl.classList.add("text-bg-success");
    }
    const toast = new bootstrap.Toast(toastEl, { delay: 2500 });
    toast.show();
}

window.addEventListener("load", function () {
    loadComponents();
    initProfile();
    checkForNewlyCompletedOrders();
});


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
