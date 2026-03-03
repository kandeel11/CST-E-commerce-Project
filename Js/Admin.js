// -------dom---------
const AdminName = document.getElementById("adminName");
const totalUsers = document.getElementById("totalUsers");
const totalSellers = document.getElementById("totalSellers");
const totalOrders = document.getElementById("totalOrders");
const totalRevenue = document.getElementById("totalRevenue");

const currentadmin = JSON.parse(sessionStorage.getItem("currentAdmin"));
const sidebar = document.getElementById("sidebar");
const contentSections = document.querySelectorAll(".content-section");
const logoutBtn = document.getElementById("logoutBtn");
logoutBtn.addEventListener("click", function (e) {
    e.preventDefault();
    sessionStorage.removeItem("currentAdmin");
    window.location.href = "../Pages/Login.html";
});

// ===== Render Popular Products Bar Chart =====
let popularChartInstance = null;

if (!currentadmin) {
    //window.location.href = "../Pages/Login.html";
    // For testing purposes, if no admin is logged in, we can set a default admin

}
//AdminName.textContent = `Welcome, ${currentadmin.Fname} ${currentadmin.Lname}`;

function renderPopularProductsChart() {
    const orders = getOrders();
    const productMap = {};

    for (let i = 0; i < orders.length; i++) {
        const order = orders[i];
        if (!order.products) continue;
        const orderStatus = (order.orderStatus || "").toLowerCase();
        if (orderStatus === "cancelled" || orderStatus === "usercancelled") continue;

        for (let j = 0; j < order.products.length; j++) {
            const p = order.products[j];
            const key = p.id || p.name;
            if (!productMap[key]) {
                productMap[key] = { name: p.name, totalQuantity: 0 };
            }
            productMap[key].totalQuantity += p.quantity;
        }
    }

    const sorted = Object.values(productMap)
        .sort((a, b) => b.totalQuantity - a.totalQuantity)
        .slice(0, 10);

    if (popularChartInstance) { popularChartInstance.destroy(); popularChartInstance = null; }

    const canvas = document.getElementById('popularProductsChart');
    if (!canvas) return;

    const colors = [
        'rgba(46, 204, 113, 0.8)',
        'rgba(54, 162, 235, 0.8)',
        'rgba(255, 159, 64, 0.8)',
        'rgba(255, 99, 132, 0.8)',
        'rgba(153, 102, 255, 0.8)',
        'rgba(255, 205, 86, 0.8)',
        'rgba(75, 192, 192, 0.8)',
        'rgba(201, 203, 207, 0.8)',
        'rgba(255, 99, 71, 0.8)',
        'rgba(100, 149, 237, 0.8)'
    ];

    const borderColors = colors.map(c => c.replace('0.8', '1'));

    popularChartInstance = new Chart(canvas, {
        type: 'bar',
        data: {
            labels: sorted.map(p => p.name),
            datasets: [{
                label: 'Quantity Sold',
                data: sorted.map(p => p.totalQuantity),
                backgroundColor: sorted.map((_, i) => colors[i % colors.length]),
                borderColor: sorted.map((_, i) => borderColors[i % borderColors.length]),
                borderWidth: 1,
                borderRadius: 6,
                maxBarThickness: 50
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            scales: {
                x: {
                    beginAtZero: true,
                    ticks: { stepSize: 1, font: { size: 11 } },
                    grid: { color: 'rgba(0,0,0,0.06)' },
                    title: { display: true, text: 'Quantity', font: { weight: 'bold' } }
                },
                y: {
                    ticks: { font: { size: 11 } },
                    grid: { display: false }
                }
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: ctx => ` Quantity: ${ctx.parsed.x}`
                    }
                }
            }
        }
    });
}

renderPopularProductsChart();

const users = JSON.parse(localStorage.getItem("users")) || [];
const userCount = users.filter(u => u.Role === "User").length;
const sellerCount = users.filter(u => u.Role === "Seller").length;
renderUsersSellersPieChart(userCount, sellerCount);

function renderUsersSellersPieChart(usersNum, sellersNum) {
    const canvas = document.getElementById('usersSellersPieChart');
    if (!canvas) return;

    new Chart(canvas, {
        type: 'doughnut',
        data: {
            labels: ['Users', 'Sellers'],
            datasets: [{
                data: [usersNum, sellersNum],
                backgroundColor: ['rgba(54, 162, 235, 0.8)', 'rgba(255, 159, 64, 0.8)'],
                borderColor: ['rgba(54, 162, 235, 1)', 'rgba(255, 159, 64, 1)'],
                borderWidth: 2,
                hoverOffset: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            cutout: '55%',
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: { usePointStyle: true, padding: 15, font: { size: 12 } }
                },
                tooltip: {
                    callbacks: {
                        label: function (ctx) {
                            const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
                            const pct = total > 0 ? ((ctx.parsed / total) * 100).toFixed(1) : 0;
                            return ` ${ctx.label}: ${ctx.parsed} (${pct}%)`;
                        }
                    }
                }
            }
        }
    });
}
const orders = JSON.parse(localStorage.getItem("orders")) || [];
totalOrders.textContent = orders.length;
let totlUsers = users.filter(u => u.Role === "User");
totalUsers.textContent = totlUsers.length;
let TOtalsellers = users.filter(u => u.Role === "Seller");
totalSellers.textContent = TOtalsellers.length;
let revenue = 0;
orders.forEach(order => {
    order.products.forEach(item => {
        if (item.status && item.status.toLowerCase() === "completed") {
            revenue += (item.quantity || 0) * (item.price || 0);
        };

    });
});
totalRevenue.textContent = revenue.toFixed(2);

document.addEventListener("click", function (e) {
    const link = e.target.closest("[data-section]");
    if (!link) return;
    e.preventDefault();
    const sectionId = link.getAttribute("data-section");
    switchSection(sectionId);
});



function switchSection(sectionId) {
    // Hide all sections
    contentSections.forEach(s => s.classList.add("d-none"));

    // Show target section
    const target = document.getElementById(sectionId);
    if (target) target.classList.remove("d-none");

    // Update sidebar active state
    sidebar.querySelectorAll("li").forEach(l => l.classList.remove("active"));
    const activeLink = sidebar.querySelector(`a[data-section="${sectionId}"]`);
    if (activeLink) activeLink.parentElement.classList.add("active");

    // Load data for each section when switching
    if (sectionId === "section-orders") {
        renderAllOrders();
    }
    if (sectionId === "section-sellers") {
        loadSellers();
    }
}





////-------------------Admin Dashboard JS------------------////
///--------OrderManagement--------///
const allOrdersBody = document.getElementById("allOrdersBody");

let currentPage = 1;
const ordersPerPage = 10;

// ===== Chart instances (to prevent duplication) =====
let chartInstance = null;

// ===== Get orders from localStorage (never mutate) =====
function getOrders() {
    return JSON.parse(localStorage.getItem("orders")) || [];
}
renderCharts();
// ===== Render Line Chart =====
function renderCharts() {
    const orders = getOrders();

    // Destroy old chart first
    if (chartInstance) { chartInstance.destroy(); chartInstance = null; }

    const canvas = document.getElementById('ordersLineChart');
    if (!canvas) return;

    // Labels = Order IDs
    const orderLabels = orders.map(o => `#${o.orderid}`);

    // Line 1: Total per order (sum only completed products' prices)
    const totals = orders.map(o => {
        if (!o.products) return 0;
        let total = 0;
        for (let i = 0; i < o.products.length; i++) {
            const p = o.products[i];
            const status = (p.status || o.orderStatus || '').toLowerCase();
            if (status === 'completed') {
                total += (p.quantity || 0) * (p.price || 0);
            }
        }
        return Math.round(total * 100) / 100; // avoid floating point issues
    });

    // Line 2: Number of products per order (all)
    const productCounts = orders.map(o => (o.products ? o.products.length : 0));

    // Line 3: Number of completed products per order
    const completedProductCounts = orders.map(o => {
        if (!o.products) return 0;
        return o.products.filter(p => {
            const status = (p.status || o.orderStatus || '').toLowerCase();
            return status === 'completed';
        }).length;
    });

    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = 350;

    chartInstance = new Chart(canvas, {
        type: 'line',
        data: {
            labels: orderLabels,
            datasets: [
                {
                    label: 'Order Total ($) — Completed Only',
                    data: totals,
                    borderColor: 'rgba(46, 204, 113, 1)',
                    backgroundColor: 'rgba(46, 204, 113, 0.1)',
                    fill: true,
                    tension: 0.3,
                    borderWidth: 2,
                    pointRadius: 4,
                    pointBackgroundColor: 'rgba(46, 204, 113, 1)',
                    yAxisID: 'yTotal'
                },
                {
                    label: 'All Products',
                    data: productCounts,
                    borderColor: 'rgba(54, 162, 235, 1)',
                    backgroundColor: 'rgba(54, 162, 235, 0.1)',
                    fill: true,
                    tension: 0.3,
                    borderWidth: 2,
                    pointRadius: 4,
                    pointBackgroundColor: 'rgba(54, 162, 235, 1)',
                    yAxisID: 'yProducts'
                },
                {
                    label: 'Completed Products',
                    data: completedProductCounts,
                    borderColor: 'rgba(255, 159, 64, 1)',
                    backgroundColor: 'rgba(255, 159, 64, 0.1)',
                    fill: true,
                    tension: 0.3,
                    borderWidth: 2,
                    pointRadius: 4,
                    pointBackgroundColor: 'rgba(255, 159, 64, 1)',
                    borderDash: [5, 5],
                    yAxisID: 'yProducts'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false
            },
            scales: {
                x: {
                    grid: {
                        display: true,
                        color: 'rgba(0,0,0,0.08)'
                    },
                    ticks: { font: { size: 11 } }
                },
                yTotal: {
                    type: 'linear',
                    position: 'left',
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Total ($)',
                        color: 'rgba(46, 204, 113, 1)',
                        font: { weight: 'bold' }
                    },
                    grid: {
                        display: true,
                        color: 'rgba(46, 204, 113, 0.15)'
                    },
                    ticks: {
                        color: 'rgba(46, 204, 113, 1)',
                        callback: function (value) { return '$' + value; }
                    }
                },
                yProducts: {
                    type: 'linear',
                    position: 'right',
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Products Count',
                        color: 'rgba(54, 162, 235, 1)',
                        font: { weight: 'bold' }
                    },
                    grid: {
                        display: true,
                        drawOnChartArea: false,
                        color: 'rgba(54, 162, 235, 0.15)'
                    },
                    ticks: {
                        color: 'rgba(54, 162, 235, 1)',
                        stepSize: 1
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: { usePointStyle: true, padding: 20 }
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const label = context.dataset.label || '';
                            const value = context.parsed.y;
                            if (label.includes('Total')) {
                                return `${label}: $${value.toFixed(2)}`;
                            }
                            return `${label}: ${value}`;
                        }
                    }
                },
                datalabels: { display: false }
            }
        }
    });
}

// ===== Status badge class =====
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

// ===== Calculate display total (only completed items count) =====
function calcDisplayTotal(order) {
    let total = 0;
    if (order.products) {
        order.products.forEach(item => {
            const status = (item.status || order.orderStatus || "").toLowerCase();
            if (status === "completed") {
                total += item.quantity * item.price;
            }
        });
    }
    return total;
}

// ===== Create order table row (NO mutation) =====
function createOrderRow(order) {
    const statusClass = getStatusClass(order.orderStatus);
    const itemCount = order.products ? order.products.length : 0;
    const displayTotal = calcDisplayTotal(order);
    const productText = itemCount === 1 ? "1 Product" : `${itemCount} Products`;

    return `
        <tr>
            <td class="fw-semibold">#${order.orderid}</td>
            <td>${formatDate(order.createddate)}</td>
            <td>$${displayTotal.toFixed(2)} <span class="text-muted small">(${productText})</span></td>
            <td><span class="badge-status ${statusClass}">${order.orderStatus}</span></td>
            <td><a href="#" class="view-details-link" onclick="viewOrderDetail('${order.orderid}')">View Details</a></td>
        </tr>
    `;
}

// ===== Render orders table with pagination =====
function renderAllOrders() {
    const orders = getOrders();
    allOrdersBody.innerHTML = "";

    if (orders.length === 0) {
        document.getElementById("noAllOrdersMsg").classList.remove("d-none");
        updatePaginationControls(0);
        return;
    }
    document.getElementById("noAllOrdersMsg").classList.add("d-none");

    const totalPages = Math.ceil(orders.length / ordersPerPage);
    if (currentPage > totalPages) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;

    const startIndex = (currentPage - 1) * ordersPerPage;
    const endIndex = startIndex + ordersPerPage;
    const pageOrders = orders.slice(startIndex, endIndex);

    pageOrders.forEach(order => {
        allOrdersBody.innerHTML += createOrderRow(order);
    });

    updatePaginationControls(totalPages);
}

function updatePaginationControls(totalPages) {
    const pageInfo = document.getElementById("pageInfo");
    const prevBtn = document.getElementById("prevPageBtn");
    const nextBtn = document.getElementById("nextPageBtn");

    if (!pageInfo || !prevBtn || !nextBtn) return;

    if (totalPages <= 0) {
        pageInfo.textContent = "";
        prevBtn.disabled = true;
        nextBtn.disabled = true;
        return;
    }

    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    prevBtn.disabled = currentPage <= 1;
    nextBtn.disabled = currentPage >= totalPages;
}

function goToPage(direction) {
    currentPage += direction;
    renderAllOrders();
}

// ===== Console: Most popular product =====
function logMostPopularProduct() {
    const orders = getOrders();
    const productMap = {};

    for (let i = 0; i < orders.length; i++) {
        const order = orders[i];
        if (!order.products) continue;
        // Skip cancelled/processing/usercancelled orders
        const orderStatus = (order.orderStatus || "").toLowerCase();
        if (orderStatus === "cancelled" || orderStatus === "processing" || orderStatus === "usercancelled") continue;

        for (let j = 0; j < order.products.length; j++) {
            const p = order.products[j];
            const key = p.id || p.name;
            if (!productMap[key]) {
                productMap[key] = { name: p.name, totalQuantity: 0 };
            }
            productMap[key].totalQuantity += p.quantity;
        }
    }

    let mostPopular = null;
    let maxQty = 0;
    for (const key in productMap) {
        if (productMap[key].totalQuantity > maxQty) {
            maxQty = productMap[key].totalQuantity;
            mostPopular = productMap[key];
        }
    }

    if (mostPopular) {
    } else {
    }
}

// ===== View Order Detail (Modal) =====
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
                        <p class="text-muted mb-0 small">seller id: ${item.seller_id}</p>
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
            <div>
                <p class="mb-1 small text-muted">User ID</p>
                <h6 class="fw-bold mb-0">#${order.userid}</h6>
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
            <h5 class="fw-bold text-success mb-0">$${calcDisplayTotal(order)}</h5>
        </div>
    `;

    const modal = new bootstrap.Modal(document.getElementById("orderDetailModal"));
    modal.show();
};

function formatDate(dateStr) {
    const date = new Date(dateStr);
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return date.toLocaleDateString('en-US', options);
}


//-------Users management-------//
document.addEventListener("DOMContentLoaded", () => {
    // 1. Check if user is Admin, else redirect (optional feature to add security, skipping if strict UI reqs)

    // 2. State
    let users = [];

    // 3. DOM Elements
    const userTableBody = document.getElementById("userTableBody");
    const userSearchInput = document.getElementById("userSearchInput");
    const noUsersFound = document.getElementById("noUsersFound");

    // Modal Elements
    const qtyModal = new bootstrap.Modal(document.getElementById('userQuickViewModal'));
    const modalInitials = document.getElementById('modalUserInitials');
    const modalName = document.getElementById('modalUserName');
    const modalRole = document.getElementById('modalUserRole');
    const modalEmail = document.getElementById('modalUserEmail');
    const modalPhone = document.getElementById('modalUserPhone');
    const modalAddress = document.getElementById('modalUserAddress');
    const modalDate = document.getElementById('modalUserDate');
    const modalStatus = document.getElementById('modalUserStatus');
    const modalBtnDelete = document.getElementById('modalBtnDelete');

    let currentSelectedUserId = null;

    // 4. Initialize
    loadUsers();
    renderUsers(users);

    // 5. Event Listeners
    userSearchInput.addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase().trim();
        const filtered = users.filter(user => {
            const name = (user.name || (user.Fname && user.Lname ? user.Fname + " " + user.Lname : "")).toLowerCase();
            const email = (user.Email || "").toLowerCase();
            const phone = (user.Phone || "").toLowerCase();
            return name.startsWith(query) || email.startsWith(query) || phone.startsWith(query);
        });
        renderUsers(filtered);
    });

    modalBtnDelete.addEventListener("click", () => {
        if (currentSelectedUserId) {
            deleteUser(currentSelectedUserId);
            qtyModal.hide();
        }
    });

    // 6. Functions
    function loadUsers() {
        let storedUsers = JSON.parse(localStorage.getItem("users"));
        users = storedUsers.filter(u => u.Role === "User");
    }

    // Populate demo users if none exist in localStorage    }

    function saveUsers() {
        localStorage.setItem("users", JSON.stringify(users));
    }

    function formatDate(dateString) {
        if (!dateString) return "--";
        const d = new Date(dateString);
        if (isNaN(d.getTime())) return dateString;
        return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    }

    function formatAddress(user) {
        if (user.address) return user.address;

        let parts = [];
        if (user.street) parts.push(user.street);
        if (user.city) parts.push(user.city);
        if (user.country) parts.push(user.country);
        if (parts.length > 0) return parts.join(", ");

        // Check if address is object
        if (user.Address && typeof user.Address === 'object') {
            if (user.Address.Street) parts.push(user.Address.Street);
            if (user.Address.City) parts.push(user.Address.City);
            if (user.Address.Country) parts.push(user.Address.Country);
        }
        return parts.length > 0 ? parts.join(", ") : "--";
    }

    function renderUsers(usersToRender) {
        userTableBody.innerHTML = "";

        if (usersToRender.length === 0) {
            noUsersFound.classList.remove("d-none");
            return;
        }

        noUsersFound.classList.add("d-none");

        usersToRender.forEach(user => {
            // Default mappings
            const id = user.id || "Us-1"; // Fallback ID
            const name = user.name || (user.Fname && user.Lname ? user.Fname + " " + user.Lname : "Unknown");
            const email = user.Email || "--";
            const phone = user.Phone || "--";
            const address = formatAddress(user);
            const date = formatDate(user.dateCreated);

            // Assume missing Active prop implies true initially
            const isActive = user.Active === undefined ? true : user.Active;
            const statusClass = isActive ? "status-active" : "status-inactive";
            const statusText = isActive ? "Active" : "Inactive";

            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td class="ps-3 user-td-id">${id}</td>
                <td class="user-td-name">${name}</td>
                <td>${email}</td>
                <td>${phone}</td>
                <td class="text-truncate" style="max-width: 200px;" title="${address}">${address}</td>
                <td>${date}</td>
                <td class="text-center">
                    <span class="user-status-badge ${statusClass}">${statusText}</span>
                </td>
                <td class="text-center pe-3">
                    <button class="action-btn btn-view" title="Quick View" onclick="window.manageUsers.viewUser('${id}')">
                        <i class="far fa-eye"></i>
                    </button>
                    <button class="action-btn btn-toggle" title="Toggle Status" onclick="window.manageUsers.toggleStatus('${id}')">
                        <i class="fas ${isActive ? 'fa-pause' : 'fa-play'}"></i>
                    </button>
                    <button class="action-btn btn-view" title="Reset Password" onclick="window.manageUsers.resetPassword('${id}')">
                        <i class="fas fa-key"></i>
                    </button>

                    <button class="action-btn btn-delete" title="Delete" onclick="window.manageUsers.deleteUser('${id}')">
                        <i class="far fa-trash-alt"></i>
                    </button>
                </td>
            `;
            userTableBody.appendChild(tr);
        });
    }

    function viewUser(id) {
        const user = users.find(u => u.id === id);
        if (!user) return;

        currentSelectedUserId = id;

        const name = user.name || (user.Fname && user.Lname ? user.Fname + " " + user.Lname : "Unknown");
        const isActive = user.Active === undefined ? true : user.Active;
        const initials = name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();

        modalInitials.textContent = initials || "U";
        modalName.textContent = name;
        modalRole.className = `badge ${user.Role === 'Admin' ? 'bg-danger' : (user.Role === 'Seller' ? 'bg-warning text-dark' : 'bg-success')} bg-opacity-10 text-${user.Role === 'Admin' ? 'danger' : (user.Role === 'Seller' ? 'warning text-dark' : 'success')} px-3 py-1 rounded-pill fw-medium`;
        modalRole.textContent = user.Role || "User";

        modalEmail.textContent = user.Email || "--";
        modalPhone.textContent = user.Phone || "--";
        modalAddress.textContent = formatAddress(user);
        modalDate.textContent = formatDate(user.dateCreated);

        modalStatus.innerHTML = `<span class="user-status-badge ${isActive ? 'status-active' : 'status-inactive'}">${isActive ? 'Active' : 'Inactive'}</span>`;

        qtyModal.show();
    }

    function toggleStatus(id) {
        const userIndex = users.findIndex(u => u.id === id);
        if (userIndex !== -1) {
            const currentStatus = users[userIndex].Active === undefined ? true : users[userIndex].Active;
            users[userIndex].Active = !currentStatus;
            saveUsers();

            // Re-render table keeping current search filter
            userSearchInput.dispatchEvent(new Event('input'));
        }
    }

    // Modal Elements for Delete
    const deleteModal = new bootstrap.Modal(document.getElementById('deleteUserModal'));
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    let userToDeleteId = null;

    confirmDeleteBtn.addEventListener("click", () => {
        if (userToDeleteId) {
            users = users.filter(u => u.id !== userToDeleteId);
            saveUsers();

            // Check if current user was deleted
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            if (currentUser && currentUser.id === userToDeleteId) {
                localStorage.removeItem('currentUser');
                window.location.href = 'Login.html';
                return;
            }

            // Re-render table
            userSearchInput.dispatchEvent(new Event('input'));
            deleteModal.hide();
            userToDeleteId = null; // reset
        }
    });
    // Modal Elements for Reset Password
    const resetModal = new bootstrap.Modal(document.getElementById('resetPasswordModal'));
    const confirmResetBtn = document.getElementById('confirmResetBtn');
    let userToResetId = null;

    confirmResetBtn.addEventListener("click", () => {
        if (userToResetId) {
            const userIndex = users.findIndex(u => u.id === userToResetId);
            if (userIndex !== -1) {
                users[userIndex].password = users[userIndex].Email;
                saveUsers();
                userSearchInput.dispatchEvent(new Event('input'));
            }
            resetModal.hide();
            userToResetId = null; // reset
        }
    });

    function resetPassword(id) {
        userToResetId = id;
        resetModal.show();
    }

    function deleteUser(id) {
        userToDeleteId = id;
        deleteModal.show();
    }

    // Expose functions to global scope for onclick handlers
    window.manageUsers = {
        viewUser,
        toggleStatus,
        resetPassword,
        deleteUser
    };
});


//---- products management -----//

let cat = []
let prods = []
let sellers = []
let filtered_products = []
let allData = []
let count = 0;
let searched_prod = [];
let search_field = document.getElementById("search");
let product_per_page = 10;
let tempp = 0;
let num_pages = 0;
let prodspg = {

}
let nav = document.getElementsByClassName("links")[0]
let numbers = document.querySelectorAll(".link");
let html = ''
let menu = document.getElementById("cat_menu")



window.addEventListener('load', function () {
    data_section = document.getElementById("my_data");
    allData = JSON.parse(localStorage.getItem('products'))
    if (allData) {
        prods = Object.values(allData).flat();
        for (let n in allData) { if (n != 'Sellers') { cat.push(n); } }
        count = prods.length;
        this.document.getElementById("number").innerHTML = count;
        fill_categories();
        assign_cat_event();
        display_pgn(prods);
        fill_pobj(prods);
        fill_current_page(0);
        modal_events();
    }
})



let data_section = document.getElementById("my_data");

// Fill categories menu
function fill_categories() {

    cat = [];
    for (let i = 0; i < prods.length; i++) {
        let exists = cat.indexOf(prods[i].category)
        if (exists == -1) { cat.push(prods[i].category); }
        else { continue }
    }
    menu = document.getElementById("cat_menu")
    html = ''
    for (let i = 0; i < cat.length; i++) {
        html += `<li><a class="dropdown-item" href="#" >${cat[i]}</a></li>`

    }
    menu.innerHTML += html
}

let cat_buts = document.getElementsByClassName("dropdown-item")
function assign_cat_event() {
    cat_buts = document.getElementsByClassName("dropdown-item")

    for (let i = 0; i < cat_buts.length; i++) {
        cat_buts[i].addEventListener('click', function () {
            filtered_products = []
            chosen_cat = event.target.innerHTML
            document.getElementById("cat_but").innerHTML = chosen_cat;
            search_field = document.getElementById("search");

            srch = (search_field.value).toLowerCase().trim();

            if (chosen_cat != 'All') {
                if (srch.trim().length == 0) {
                    prods.forEach((item) => { if ((item.category.split(' ')[0] == chosen_cat.split(' ')[0])) { filtered_products.push(item) } })
                }
                else {
                    prods.forEach((item) => { if ((item.category.split(' ')[0] == chosen_cat.split(' ')[0])) { filtered_products.push(item) } })
                    filtered_products = filtered_products.filter(item => item.name.toLowerCase().includes(srch))
                }

                if (filtered_products.length == 0) {
                    data_section.innerHTML = 'NO RESULTS'
                    prods.forEach((item) => { if ((item.category.split(' ')[0] == chosen_cat.split(' ')[0])) { filtered_products.push(item) } })


                }
                else {
                    fill_pobj(filtered_products);
                    fill_current_page(0);
                    display_pgn(filtered_products)
                }

            }
            else {
                data_section.innerHTML = ' ';
                search_field.value = ''
                fill_pobj(prods);
                fill_current_page(0);
                display_pgn(prods)
            }


        })
    }
}


let chosen_cat;
let srch;
function filter_cat(event) {
    filtered_products = []
    chosen_cat = event.target.innerHTML
    document.getElementById("cat_but").innerHTML = chosen_cat;
    search_field = document.getElementById("search");

    srch = (search_field.value).toLowerCase().trim();

    if (chosen_cat != 'All') {
        if (srch.trim().length == 0) {
            prods.forEach((item) => { if ((item.category.split(' ')[0] == chosen_cat.split(' ')[0])) { filtered_products.push(item) } })
        }
        else {
            prods.forEach((item) => { if ((item.category.split(' ')[0] == chosen_cat.split(' ')[0])) { filtered_products.push(item) } })
            filtered_products = filtered_products.filter(item => item.name.toLowerCase().includes(srch))
        }

        if (filtered_products.length == 0) {
            data_section.innerHTML = 'NO RESULTS'
            prods.forEach((item) => { if ((item.category.split(' ')[0] == chosen_cat.split(' ')[0])) { filtered_products.push(item) } })


        }
        else {
            fill_pobj(filtered_products);
            fill_current_page(0);
            display_pgn(filtered_products)
        }

    }
    else {
        data_section.innerHTML = ' ';
        search_field.value = ''
        fill_pobj(prods);
        fill_current_page(0);
        display_pgn(prods)

    }
}


function display_filtered() {
    data_section.innerHTML = ' '
    let html = ''
    for (i = 0; i < filtered_products.length; i++) {
        product = filtered_products[i];

        html += `
             <div class="dismisser-row row" data-id="${product.product_id}">

        <div class="dismisser-col-id ">
           <p>${product.product_id}</p>
        </div>
        <div class="dismisser-col-img ">
            <img src="${product.images[0]}" alt="${product.name}" loading="lazy" >
        </div>

        <div class="dismisser-col-name ">
           <p>${product.name}</p>
        </div>

        <div class="dismisser-col-category ">
           <p>${product.category}</p>
        </div>

        <div class="dismisser-col-price ">
            <p>${product.price}</p>
        </div>
        <div class="dismisser-col-stock ">
            
               <p> ${product.stock}</p>
            
        </div>

         <div class="dismisser-col-seller ">
               <p> ${product.seller_id}</p>
        </div>

        <div class="dismisser-col-rate ">
            
               <p> ${product.reviews[0].rating} &#9733</p>
        </div>


        <div class="dismisser-col-actions ">
            <button class="btn-dismiss" data-del-id=${product.product_id} title="Remove">
                <i class="fa-solid fa-x"></i>
            </button>
        </div>
    </div>
            
            
            
            
            `
    }
    data_section.innerHTML = html;
    del_buttons = document.getElementsByClassName("btn-dismiss");
    modal_events();
}




function DisplayData() {
    let html = ''
    for (i = 0; i < prods.length; i++) {
        product = prods[i];
        html += `
             <div class="dismisser-row row" data-id="${product.product_id}">

        <div class="dismisser-col-id ">
           <p>${product.product_id}</p>
        </div>
        <div class="dismisser-col-img ">
            <img src="${product.images[0]}" alt="${product.name}" loading="lazy" >
        </div>

        <div class="dismisser-col-name ">
           <p>${product.name}</p>
        </div>

        <div class="dismisser-col-category ">
           <p>${product.category}</p>
        </div>

        <div class="dismisser-col-price ">
            <p>${product.price}</p>
        </div>
        <div class="dismisser-col-stock ">
            
               <p> ${product.stock}</p>
            
        </div>

         <div class="dismisser-col-seller ">
               <p> ${product.seller_id}</p>
        </div>

        <div class="dismisser-col-rate ">
            
               <p> ${product.reviews[0].rating} &#9733;</p>
        </div>


        <div class="dismisser-col-actions ">
            <button type="button" class="btn-dismiss" title="Remove"
            data-bs-toggle="modal" data-bs-target="#exampleModal"  data-del-id=${product.product_id}>
                <i class="fa-solid fa-x"></i>
            </button>
        </div>
    </div>
            
            
            
            
            
            
            
            `
    }
    data_section.innerHTML = html;
    del_buttons = document.getElementsByClassName("btn-dismiss");
    modal_events();
}
searched_prod = [];
search_field = document.getElementById("search");
search_field.addEventListener('input', function () {
    searched_prod = [];
    srch = (search_field.value).toLowerCase().trim();
    if (srch.length != 0) {
        if (filtered_products.length > 0) { //filtered products then search
            for (let i = 0; i < filtered_products.length; i++) {
                fullname = filtered_products[i].name.toLowerCase();
                splitted_name = fullname.split(' ');
                length = splitted_name.length; //length of product name
                for (j = 0; j < length; j++) {
                    if (fullname.includes(srch)) //product is found
                    {
                        searched_prod = searched_prod.concat((filtered_products[i]))
                    }
                    break;


                }
            }
        }
        else {
            for (let i = 0; i < prods.length; i++) {
                let fullname = prods[i].name.toLowerCase();
                let splitted_name = fullname.split(' ');
                let l = splitted_name.length; //length of product name
                let ml = srch.split().length;

                if (fullname.includes(srch)) {
                    searched_prod = searched_prod.concat((prods[i]))
                }


            }
        }//works on all data
        if (searched_prod.length > 0) {
            fill_pobj(searched_prod);
            fill_current_page(0);
            display_pgn(searched_prod);
        }
        else { data_section.innerHTML = 'No result' }
    }
    else {
        filtered_products = []
        prods.forEach((item) => { if ((item.category.split(' ')[0] == chosen_cat.split(' ')[0])) { filtered_products.push(item) } })

        if (filtered_products.length > 1) {
            fill_pobj(filtered_products);
            display_pgn(searched_prod)
            fill_current_page(0);
        } else {
            fill_pobj(prods);
            fill_current_page(0);
            display_pgn(prods)


        }
    }
}

)

function displaySearch() {
    let html = ''
    data_section.innerHTML = ''

    for (i = 0; i < searched_prod.length; i++) {
        product = searched_prod[i];
        html += `
             <div class="dismisser-row row" data-id="${product.product_id}">

        <div class="dismisser-col-id ">
           <p>${product.product_id}</p>
        </div>
        <div class="dismisser-col-img ">
            <img src="${product.images[0]}" alt="${product.name}" loading="lazy" >
        </div>

        <div class="dismisser-col-name ">
           <p>${product.name}</p>
        </div>

        <div class="dismisser-col-category ">
           <p>${product.category}</p>
        </div>

        <div class="dismisser-col-price ">
            <p>${product.price}</p>
        </div>
        <div class="dismisser-col-stock ">
            
               <p> ${product.stock}</p>
            
        </div>

         <div class="dismisser-col-seller ">
               <p> ${product.seller_id}</p>
        </div>

        <div class="dismisser-col-rate ">
            
               <p> ${product.reviews[0].rating} &#9733;</p>
        </div>


        <div class="dismisser-col-actions ">
            <button class="btn-dismiss" data-del-id=${product.product_id} title="Remove">
                <i class="fa-solid fa-x"></i>
            </button>
        </div>
    </div>
            

            `
    }
    data_section.innerHTML = html;
    del_buttons = document.getElementsByClassName("btn-dismiss");
    modal_events();
}

let del_buttons = document.getElementsByClassName("btn-dismiss");

function modal_events() {
    for (let i = 0; i < del_buttons.length; i++) {
        del_buttons[i].addEventListener('click', function () {
            showModal(del_buttons[i].dataset.delId)

        })
    }
}


function delete_prod(id) {

    filtered_products = []
    searched_prod = []
    let del_prod = prods.find(item => item.product_id == id);




    if (del_prod) {
        let index = prods.indexOf(del_prod);
        prods.splice(index, 1);
        count = prods.length;
        localStorage.setItem('products', JSON.stringify(prods))

        document.getElementById("number").innerHTML = count;
        let lay_element = document.querySelectorAll(`[data-id="${id}"]`)[0]
        lay_element.remove();
    }
}



tempp = 0;

function showModal(id) {
    let product = prods.find(item => item.product_id == id);
    document.getElementById("modal_img").src = product.images[0];
    document.getElementById("prod_name_mod").textContent = product.name;
    document.getElementById("prod_des_mod").textContent = product.description;
    tempp = id;
    document.getElementById("db").addEventListener("click", modalconf)


}





function modalconf() {
    delete_prod(tempp)
}


prodspg = {

}


function fill_pobj(arr) {
    prodspg = {}
    product_per_page = 10;
    arr.sort((a, b) => a.product_id - b.product_id)
    num_pages = arr.length / product_per_page;
    let st = 0
    let end = 10;
    for (let i = 0; i < num_pages; i++) {
        prodspg[i] = arr.slice(st, end);
        st += 10;
        end += 10;

    }
}

function fill_current_page(cp) {
    let html = ''
    for (let i = 0; i < prodspg[cp].length; i++) {
        let product = prodspg[cp][i];
        html += `
             <div class="dismisser-row row" data-id="${product.product_id}">

        <div class="dismisser-col-id ">
           <p>${product.product_id}</p>
        </div>
        <div class="dismisser-col-img ">
            <img src="${product.images[0]}" alt="${product.name}" loading="lazy" >
        </div>

        <div class="dismisser-col-name ">
           <p>${product.name}</p>
        </div>

        <div class="dismisser-col-category ">
           <p>${product.category}</p>
        </div>

        <div class="dismisser-col-price ">
            <p>${product.price}</p>
        </div>
        <div class="dismisser-col-stock ">
            
               <p> ${product.stock}</p>
            
        </div>

         <div class="dismisser-col-seller ">
               <p> ${product.seller_id}</p>
        </div>

        <div class="dismisser-col-rate ">

               <p> ${product.rating} &#9733;</p>
        </div>

        <div class="dismisser-col-actions ">
            <button type="button" class="btn-dismiss" title="Remove"
            data-bs-toggle="modal" data-bs-target="#exampleModal"  data-del-id=${product.product_id}>
                <i class="fa-solid fa-x"></i>
            </button>
        </div>
    </div>
            
            
            
            
            
            `
    }
    data_section.innerHTML = html;
    modal_events();

}

function display_pgn(arr) {
    product_per_page = 10;
    num_pages = arr.length / product_per_page;
    nav = document.getElementsByClassName("links")[0]
    numbers = document.querySelectorAll(".link");

    html = ''
    for (let i = 0; i < num_pages; i++) {
        if (i == 0) { html += `<a class='link active'>${i + 1}</a>` }
        else {
            html += `<a class='link'>${i + 1}</a>`
        }
    }
    nav.innerHTML = html;

    if (num_pages < 1) {
        document.querySelectorAll(".prevNext")[1].disabled = true
        document.querySelectorAll(".prevNext")[0].disabled = true
        document.querySelector("#startBtn").disabled = true;
        document.querySelector("#endBtn").disabled = true;
    }

    else {
        document.querySelectorAll(".prevNext")[1].disabled = false
        document.querySelectorAll(".prevNext")[0].disabled = true
        document.querySelector("#startBtn").disabled = true;
        document.querySelector("#endBtn").disabled = false;
    }

}



nav = document.getElementsByClassName("links")[0]

nav.addEventListener('click', function (e) {
    numbers = document.querySelectorAll(".link");
    if (numbers.length != 1) {
        if (e.target.innerHTML == numbers.length) {
            document.querySelectorAll(".prevNext")[1].disabled = true
            document.querySelectorAll(".prevNext")[0].disabled = false
            document.querySelector("#startBtn").disabled = false;
            document.querySelector("#endBtn").disabled = true;
        }
        else if (e.target.innerHTML == 1) {
            document.querySelectorAll(".prevNext")[1].disabled = false
            document.querySelectorAll(".prevNext")[0].disabled = true
            document.querySelector("#endBtn").disabled = false;
            document.querySelector("#startBtn").disabled = true;

        }
        else {
            document.querySelectorAll(".prevNext")[1].disabled = false
            document.querySelectorAll(".prevNext")[0].disabled = false
            document.querySelector("#startBtn").disabled = false;
            document.querySelector("#endBtn").disabled = false;


        }
    }
    else {
        document.querySelectorAll(".prevNext")[1].disabled = true
        document.querySelectorAll(".prevNext")[0].disabled = true
        document.querySelector("#startBtn").disabled = true
        document.querySelector("#endBtn").disabled = true


    }
    let cp = e.target.innerHTML
    if (cp - 1 in prodspg) {
        activate_button(e.target.innerHTML)
        fill_current_page(cp - 1);

    }

})


function activate_button(i) {
    i--;
    numbers = document.querySelectorAll(".link");

    document.querySelector(".active").classList.remove("active");
    numbers[i].classList.add("active");


}


/****************************************************************** */
//next
document.querySelectorAll(".prevNext")[1].addEventListener('click', function (e) {
    let cp = document.querySelector(".active").innerHTML;
    numbers = document.querySelectorAll(".link");
    if (!isNaN(Number(cp))) {
        if (numbers.length != 1) {
            if (cp == numbers.length - 1) {
                document.querySelectorAll(".prevNext")[1].disabled = true
                document.querySelectorAll(".prevNext")[0].disabled = false
                document.querySelector("#startBtn").disabled = false;
                document.querySelector("#endBtn").disabled = true;
            }
            else if (cp == 0) {
                document.querySelectorAll(".prevNext")[1].disabled = false
                document.querySelectorAll(".prevNext")[0].disabled = true
                document.querySelector("#endBtn").disabled = false;
                document.querySelector("#startBtn").disabled = true;

            }
            else {
                document.querySelectorAll(".prevNext")[1].disabled = false
                document.querySelectorAll(".prevNext")[0].disabled = false
                document.querySelector("#startBtn").disabled = false;
                document.querySelector("#endBtn").disabled = false;


            }
        }
        else {
            document.querySelectorAll(".prevNext")[1].disabled = true
            document.querySelectorAll(".prevNext")[0].disabled = true
            document.querySelector("#startBtn").disabled = true
            document.querySelector("#endBtn").disabled = true


        }
        cp++;
        if (cp - 1 in prodspg) {
            activate_button(cp)
            fill_current_page(cp - 1);

        }
    }

})

//prev
document.querySelectorAll(".prevNext")[0].addEventListener('click', function (e) {

    let cp = document.querySelector(".active").innerHTML;
    numbers = document.querySelectorAll(".link");
    if (!isNaN(Number(cp))) {
        if (numbers.length != 1) {
            if (cp == numbers.length - 1) {
                document.querySelectorAll(".prevNext")[1].disabled = true
                document.querySelectorAll(".prevNext")[0].disabled = false
                document.querySelector("#startBtn").disabled = false;
                document.querySelector("#endBtn").disabled = true;
            }
            else if (cp == 2) {
                document.querySelectorAll(".prevNext")[1].disabled = false
                document.querySelectorAll(".prevNext")[0].disabled = true
                document.querySelector("#endBtn").disabled = false;
                document.querySelector("#startBtn").disabled = true;

            }
            else {
                document.querySelectorAll(".prevNext")[1].disabled = false
                document.querySelectorAll(".prevNext")[0].disabled = false
                document.querySelector("#startBtn").disabled = false;
                document.querySelector("#endBtn").disabled = false;


            }
        }
        else {
            document.querySelectorAll(".prevNext")[1].disabled = true
            document.querySelectorAll(".prevNext")[0].disabled = true
            document.querySelector("#startBtn").disabled = true
            document.querySelector("#endBtn").disabled = true


        }
        cp--;
        if (cp - 1 in prodspg) {
            activate_button(cp)
            fill_current_page(cp - 1);

        }
    }
})

//start
document.querySelector("#startBtn").addEventListener('click', function (e) {

    activate_button(1)
    fill_current_page(0);
    document.querySelector("#startBtn").disabled = true;
    document.querySelectorAll(".prevNext")[0].disabled = true
    document.querySelector("#endBtn").disabled = false;
    document.querySelectorAll(".prevNext")[1].disabled = false


})


//end

document.querySelector("#endBtn").addEventListener('click', function (e) {
    numbers = document.querySelectorAll(".link").length; //num of pages
    if (searched_prod.length > 0) { fill_pobj(searched_prod); }
    fill_current_page(numbers - 1);
    activate_button(numbers);
    document.querySelector("#endBtn").disabled = true;
    document.querySelectorAll(".prevNext")[1].disabled = true
    document.querySelector("#startBtn").disabled = false;
    document.querySelectorAll(".prevNext")[0].disabled = false

})


//-----sellers management -----//

import {
    getAllUsers,
    getAllProducts,
    saveProducts,
    saveUsers,
    toggleSellerActive,
    deleteSellerAndProducts
} from "./services/storageService.js";

// State 
let allSellers = [];
let filtered = [];
let pendingDelete = null;

// Initialize sellers on load
window.addEventListener("DOMContentLoaded", () => {
    loadSellers();
    bindSearch();
    bindDeleteConfirm();
});


function loadSellers() {
    const users = getAllUsers();
    const products = getAllProducts();

    allSellers = users
        .filter(u => u.Role === "Seller")
        .map(seller => {
            const sellerProducts = products.filter(
                p => String(p.seller_id) === String(seller.id)
            );

            // average rating across all seller products
            const ratings = sellerProducts.map(p => parseFloat(p.rating)).filter(r => !isNaN(r) && r > 0);
            const avgRating = ratings.length ? (ratings.reduce((s, r) => s + r, 0) / ratings.length) : null;

            return {
                id: seller.id,
                name: `${seller.Fname || ""} ${seller.Lname || ""}`.trim(),
                email: seller.Email || "—",
                phone: seller.Phone || "—",
                active: seller.Active !== false,
                dateCreated: seller.dateCreated || null,
                productCount: sellerProducts.length,
                avgRating,
            };
        });

    filtered = [...allSellers];
    renderKPIs();
    renderTable();
}

// ── kpis
function renderKPIs() {
    const products = getAllProducts();
    document.getElementById("kpiTotal").textContent = allSellers.length;
    document.getElementById("kpiActive").textContent = allSellers.filter(s => s.active).length;
    document.getElementById("kpiInactive").textContent = allSellers.filter(s => !s.active).length;
    document.getElementById("kpiProducts").textContent = products.filter(
        p => allSellers.some(s => String(s.id) === String(p.seller_id))
    ).length;
}

// ── Render table 
function renderTable() {
    const tbody = document.getElementById("sellersTbody");
    document.getElementById("resultsLabel").textContent =
        `${filtered.length} seller${filtered.length !== 1 ? "s" : ""}`;

    if (filtered.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="9" class="text-center text-muted py-5">
                    <i class="fas fa-store fa-2x d-block mb-2 opacity-50"></i>
                    No sellers found.
                </td>
            </tr>`;
        return;
    }

    tbody.innerHTML = "";

    filtered.forEach(seller => {
        const initials = seller.name
            .split(" ").slice(0, 2).map(w => w[0] || "").join("").toUpperCase() || "S";

        const ratingHtml = seller.avgRating !== null
            ? `<span class="stars">${starsHtml(seller.avgRating)}</span>
               <span class="text-muted ms-1 small">(${seller.avgRating.toFixed(1)})</span>`
            : `<span class="text-muted small fst-italic">No ratings</span>`;

        const statusBadge = seller.active
            ? `<span class="badge bg-success-subtle text-success border border-success-subtle action-badge">
                   <i class="fas fa-circle me-1" style="font-size:.5rem"></i>Active
               </span>`
            : `<span class="badge bg-secondary-subtle text-secondary border border-secondary-subtle action-badge">
                   <i class="fas fa-circle me-1" style="font-size:.5rem"></i>Inactive
               </span>`;

        const joinDate = seller.dateCreated
            ? new Date(seller.dateCreated).toLocaleDateString()
            : "—";

        const toggleLabel = seller.active ? "Deactivate" : "Activate";
        const toggleIcon = seller.active ? "fa-ban" : "fa-check-circle";
        const toggleClass = seller.active ? "btn-outline-warning" : "btn-outline-success";

        const tr = document.createElement("tr");
        tr.dataset.id = seller.id;
        tr.innerHTML = `
            <td class="text-muted small fw-semibold d-none d-lg-table-cell">${seller.id}</td>

            <td>
                <div class="d-flex align-items-center gap-2">
                    <div class="seller-avatar">${initials}</div>
                    <div>
                        <div class="fw-semibold lh-sm">${seller.name}</div>
                        <div class="text-muted small d-lg-none">${seller.email}</div>
                    </div>
                </div>
            </td>

            <td class="small text-primary d-none d-lg-table-cell">${seller.email}</td>
            <td class="small text-muted d-none d-xl-table-cell">${seller.phone}</td>
            <td class="d-none d-md-table-cell">${ratingHtml}</td>

            <td>
                <span class="badge bg-success-subtle text-success border border-success-subtle action-badge">
                    ${seller.productCount} product${seller.productCount !== 1 ? "s" : ""}
                </span>
            </td>

            <td class="small text-muted d-none d-lg-table-cell">${joinDate}</td>
            <td>${statusBadge}</td>

            <td class="action-col">
                <div class="action-btns">
                    <button class="btn ${toggleClass} toggle-btn" title="${toggleLabel}">
                        <i class="fas ${toggleIcon}"></i><span class="btn-label">${toggleLabel}</span>
                    </button>
                    <button class="btn btn-outline-danger delete-btn" title="Delete seller">
                        <i class="fas fa-trash-alt"></i><span class="btn-label">Delete</span>
                    </button>
                </div>
            </td>
        `;

        //  active/inactive
        tr.querySelector(".toggle-btn").addEventListener("click", () => {
            toggleSellerActive(seller.id);
            loadSellers();   // re-enrich and re-render
            applyFilter();
        });

        // Delete — open confirm modal
        tr.querySelector(".delete-btn").addEventListener("click", () => {
            pendingDelete = seller.id;
            document.getElementById("deleteSellerName").textContent = seller.name;
            document.getElementById("deleteSellerEmail").textContent = seller.email;
            bootstrap.Modal.getOrCreateInstance(
                document.getElementById("deleteModal")
            ).show();
        });

        tbody.appendChild(tr);
    });
}

// ── Confirm delete 
function bindDeleteConfirm() {
    document.getElementById("confirmDeleteSellerBtn").addEventListener("click", () => {
        if (!pendingDelete) return;
        deleteSellerAndProducts(pendingDelete);
        pendingDelete = null;
        bootstrap.Modal.getOrCreateInstance(
            document.getElementById("deleteModal")
        ).hide();
        loadSellers();
        applyFilter();
    });
}

// ── search and status filter 
function bindSearch() {
    document.getElementById("searchInput").addEventListener("input", applyFilter);
    document.getElementById("statusFilter").addEventListener("change", applyFilter);
}

function applyFilter() {
    const q = document.getElementById("searchInput").value.trim().toLowerCase();
    const status = document.getElementById("statusFilter").value;

    filtered = allSellers.filter(s => {
        const matchesQ = !q ||
            s.name.toLowerCase().includes(q) ||
            s.email.toLowerCase().includes(q) ||
            s.id.toLowerCase().includes(q);

        const matchesStatus =
            status === "all" ||
            (status === "active" && s.active) ||
            (status === "inactive" && !s.active);

        return matchesQ && matchesStatus;
    });

    renderTable();
}

// ── Helpers 
function starsHtml(rating) {
    const full = Math.floor(rating);
    const half = rating - full >= 0.5 ? 1 : 0;
    const empty = 5 - full - half;
    return "★".repeat(full) + (half ? "½" : "") + "☆".repeat(empty);
}



const menuBtn = document.getElementById('menuBtn');
const sidebarr = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');

menuBtn.addEventListener('click', () => {
    sidebarr.classList.add('show');
    overlay.classList.add('active');
});

overlay.addEventListener('click', () => {
    sidebarr.classList.remove('show');
    overlay.classList.remove('active');
});
