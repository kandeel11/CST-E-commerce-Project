import {
    addProductToStorage,
    updateProduct,
    removeProductFromStorage,
    getCurrentSeller,
    loadProductsForSeller,
    loadOrdersForSeller,
    getSellerTotalRevenue,
    getSellerOrders,
    getSellerProducts,
    getAllProducts,
    getAllOrders,
    saveProducts
} from "../services/storageService.js";

// ── State 
let currentUser = null;   // { storeName, name, userID }
let editingId = null;   // product id when editing, null when adding

window.addEventListener("DOMContentLoaded", () => {
    if (!sessionStorage.getItem("currentSeller"))
        window.location.href = "../Pages/Login.html";

    initUser();
    initSidebar();
    initProductModal();
    initLogout();
    initSearch('productSearch', 'productStatusFilter');
    initAnalytics();

    loadProductsForSeller(currentUser.id);
    loadOrdersForSeller(currentUser.id)

    // Auto-refresh orders when storage changes (from other tabs/pages)
    window.addEventListener("storage", function (e) {
        if (e.key === "orders") {
            loadOrdersForSeller(currentUser.id);
            loadProductsForSeller(currentUser.id); // in case stock/status changed due to order updates
        }
    });
});

const sllerdiv = document.getElementById("store");
sllerdiv.addEventListener("click", function () {
    window.location.href = "../Pages/Home.html";
});
// ── User ───────────────────────────────────────────────────────────────────────
function initUser() {
    // simulate seller data after login
    currentUser = getCurrentSeller();

    //sessionStorage.setItem("pageUser", JSON.stringify(currentUser));
    document.getElementById("storeName").textContent = "EcoBAZAAR"; //currentUser.storeName;
    document.getElementById("sellerName").textContent = `${currentUser.Fname} ${currentUser.Lname}`;
}

// ── Sidebar / section switching ────────────────────────────────────────────────
function initSidebar() {
    const SECTIONS = ["products", "orders", "analytics"];
    const TITLES = { products: "Products", orders: "Orders", analytics: "Analytics" };

    function switchSection(target) {
        SECTIONS.forEach(s =>
            document.getElementById(`section-${s}`).classList.toggle("d-none", s !== target)
        );
        document.querySelectorAll(".sidebar-btn, .mobile-nav-btn").forEach(btn =>
            btn.classList.toggle("active", btn.dataset.section === target)
        );
        document.getElementById("pageHeaderTitle").textContent = TITLES[target] || "Dashboard";

        if (target === "analytics") refreshAnalytics();
    }

    document.querySelectorAll(".sidebar-btn, .mobile-nav-btn").forEach(btn =>
        btn.addEventListener("click", function () {
            switchSection(btn.dataset.section);
            let Input;
            let Filter;
            if (btn.dataset.section === 'products') {
                Input = "productSearch";
                Filter = "productStatusFilter";
            }
            else if (btn.dataset.section === 'orders') {
                Input = "orderSearch";
                Filter = "orderStatusFilter"
            }
            else {
                return;
            }
            initSearch(Input, Filter);
        })
    );
}

// ── Logout ─────────────────────────────────────────────────────────────────────
function initLogout() {
    document.getElementById("logoutBtn").addEventListener("click", () => {
        sessionStorage.removeItem("currentSeller");
        window.location.href = "../Pages/Login.html";
    });
}

// ── Search / filter (products table) ──────────────────────────────────────────
function initSearch(Input, Filter) {
    const searchInput = document.getElementById(Input);
    const statusFilter = document.getElementById(Filter);

    function applyFilter() {
        const input = searchInput.value.trim().toLowerCase();
        const status = statusFilter.value;

        let rows;
        if (Input === 'productSearch') {
            rows = document.querySelectorAll("#productsTbody tr[data-id]");
            rows.forEach(row => {
                const name = row.querySelector("td:nth-child(2)")?.textContent.toLowerCase() || "";
                const matches = !input || name.includes(input);
                const matchesStatus = status === "all"; // extend when real status field exists
                row.style.display = matches && matchesStatus ? "" : "none";
            });
        } else {
            rows = document.querySelectorAll("#ordersTbody tr[data-id]");
            rows.forEach(row => {
                const date = row.querySelector("td:nth-child(1)")?.textContent.toLowerCase() || "";
                const email = row.querySelector("td:nth-child(2)")?.textContent.toLowerCase() || "";
                const name = row.querySelector("td:nth-child(3)")?.textContent.toLowerCase() || "";
                const rowStatus = row.querySelector("td:nth-child(5)")?.textContent.toLowerCase() || "";
                const matchesSearch = !input || date.includes(input) || email.includes(input) || name.includes(input);
                const matchesStatus = status === "all" || rowStatus.includes(status.toLowerCase());

                row.style.display = matchesSearch && matchesStatus ? "" : "none";
            });
        }


        /*rows.forEach(row => {
            const name = row.querySelector("td:nth-child(2)")?.textContent.toLowerCase() || "";
            const matches      = !input || name.includes(input);
            const matchesStatus = status === "all"; // extend when real status field exists
            row.style.display   = matches && matchesStatus ? "" : "none";
        });*/
    }

    searchInput.addEventListener("input", applyFilter);
    statusFilter.addEventListener("change", applyFilter);
}

//  Product modal (Add + Edit) 
function initProductModal() {
    const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById("productModal"));
    const modalTitle = document.getElementById("productModalTitle");
    const modalIcon = modalTitle.querySelector("i");
    const form = document.getElementById("productForm");

    //  Open for ADD 
    document.getElementById("openAddProductModalBtn").addEventListener("click", () => {
        editingId = null;
        modalTitle.childNodes[modalTitle.childNodes.length - 1].textContent = "Add Product";
        modalIcon.className = "fas fa-plus-circle text-success me-2";
        // Hide sale-price field for new products
        document.getElementById("newPriceGroup").classList.add("d-none");
        clearForm();
        modal.show();
    });

    //  Open for EDIT (event fired by renderProductsTable) 
    document.getElementById("productsTbody").addEventListener("editProduct", e => {
        const product = e.detail;
        editingId = product.product_id;
        modalTitle.childNodes[modalTitle.childNodes.length - 1].textContent = "Edit Product";
        modalIcon.className = "fas fa-pen text-success me-2";
        // Show sale-price field only when editing
        document.getElementById("newPriceGroup").classList.remove("d-none");
        populateForm(product);
        modal.show();
    });

    //  Add / remove image rows 
    document.getElementById("addImageBtn").addEventListener("click", () => {
        const row = document.createElement("div");
        row.className = "row g-2 mb-2 image-row";
        row.innerHTML = `
            <div class="col-md-6">
                <input type="url" class="form-control product-image-url"
                       placeholder="Paste Image URL (https://…)" />
            </div>
            <div class="col-md-5">
                <input type="file" class="form-control product-image-file" accept="image/*" />
            </div>
            <div class="col-md-1 d-flex align-items-center">
                <button type="button" class="btn btn-outline-danger btn-sm remove-image-btn">
                    <i class="fas fa-times"></i>
                </button>
            </div>`;
        document.getElementById("imagesContainer").appendChild(row);
    });

    document.getElementById("imagesContainer").addEventListener("click", e => {
        if (e.target.closest(".remove-image-btn"))
            e.target.closest(".image-row").remove();
    });

    //  Form submit 
    form.addEventListener("submit", e => {
        e.preventDefault();

        // Collect images: prefer URL if filled, fall back to file object URL
        const imageUrls = [];
        document.querySelectorAll("#imagesContainer .image-row").forEach(row => {
            const url = row.querySelector(".product-image-url")?.value.trim();
            const file = row.querySelector(".product-image-file")?.files?.[0];
            if (url) imageUrls.push(url);
            else if (file) imageUrls.push(URL.createObjectURL(file));
        });

        const name = document.getElementById("productName").value.trim();
        const category = document.getElementById("productCategory").value;
        const price = parseFloat(document.getElementById("productPrice").value);
        const newPrice = parseFloat(document.getElementById("productNewPrice").value);
        const stock = parseInt(document.getElementById("productStock").value);
        const organic = document.getElementById("productOrganic").checked;
        const desc = document.getElementById("productDescription").value.trim();

        if (editingId) {
            //  UPDATE existing product 
            const existing = getAllProducts().find(p => p.product_id === editingId);
            // iff a sale price is given: current price → oldPrice, newPrice → price
            let priceUpdate;
            if (!isNaN(newPrice) && newPrice > 0) {
                if (newPrice < price) {
                    priceUpdate = { price: newPrice, oldPrice: price }
                }
                else {
                    priceUpdate = { price: newPrice, oldPrice: null }
                }
            }
            else {
                priceUpdate = { price };
            }
            //const priceUpdate = !isNaN(newPrice) && newPrice > 0 
            //    ? { price: newPrice, oldPrice: price }
            //    : { price };                            // no sale: just update price, clear old oldPrice
            const updated = {
                ...existing,
                name,
                category,
                description: desc,
                stock,
                organic,
                ...priceUpdate,
                images: imageUrls.length > 0 ? imageUrls : existing.images,
            };
            updateProduct(updated);
        } else {
            //  ADD new product 
            const product = {
                product_id: `${currentUser.id}_${Date.now()}`,
                seller_id: currentUser.id,
                brand: currentUser.storeName,
                name,
                category,
                description: desc,
                price,
                oldPrice: null,
                stock,
                organic,
                images: imageUrls.length > 0
                    ? imageUrls
                    : ["https://placehold.co/400x300/e8f5e9/2e7d32?text=Product"],
                rating: 0,
                discount: 0,
                dailySale: false,
                weight: "",
                unit: "",
            };
            addProductToStorage(product);
        }

        modal.hide();
        loadProductsForSeller(currentUser.id);
    });
}

// Visualization part
function buildSellerAnalyticsData(sellerId) {
    const orders = getAllOrders();

    const revenueByDate = {};
    const productSales = new Map();
    const statusCounts = {};

    orders.forEach(order => {
        const status = String(order.orderStatus || "").toLowerCase();
        statusCounts[status] = (statusCounts[status] || 0) + 1;

        const dateLabel = new Date(order.createddate).toLocaleDateString();

        (order.products || []).forEach(p => {
            if (String(p.seller_id) !== String(sellerId)) return;

            const qty = Number(p.quantity) || 0;
            const price = Number(p.price) || 0;
            const revenue = price * qty;

            // sales over time: should be only COMPLETED but I'll leave it as it for testing 
            if (status === "completed" || status === "pending") {
                revenueByDate[dateLabel] = (revenueByDate[dateLabel] || 0) + revenue;
            }

            // top products: use COMPLETED only (same as above)
            if (status === "completed" || status === "pending") {
                const key = String(p.product_id);
                const prev = productSales.get(key) || { name: p.name || `#${key}`, qty: 0, revenue: 0 };
                prev.qty += qty;
                prev.revenue += revenue;
                // keep latest known name
                prev.name = p.name || prev.name;
                productSales.set(key, prev);
            }
        });
    });

    // Sort dates properly
    const salesLabels = Object.keys(revenueByDate).sort((a, b) => new Date(a) - new Date(b));
    const salesData = salesLabels.map(d => revenueByDate[d]);

    // Top 5 products by quantity (you can switch to revenue if you want)
    const topProducts = Array.from(productSales.entries())
        .map(([product_id, v]) => ({ product_id, ...v }))
        .sort((a, b) => b.qty - a.qty)
        .slice(0, 5);

    // Status distribution: keep nice order
    const statusOrder = ["pending", "Processing", "completed"];
    const statusLabels = statusOrder.filter(s => statusCounts[s] != null);
    // include any other custom statuses
    Object.keys(statusCounts).forEach(s => { if (!statusLabels.includes(s)) statusLabels.push(s); });
    const statusData = statusLabels.map(s => statusCounts[s] || 0);

    return {
        sales: { labels: salesLabels, data: salesData },
        topProducts: {
            labels: topProducts.map(p => p.name),
            qty: topProducts.map(p => p.qty),
            revenue: topProducts.map(p => p.revenue),
        },
        status: { labels: statusLabels, data: statusData },
    };
}

function initAnalytics() {
    if (typeof Chart === "undefined") return;
    // avoid reinitialization
    if (window._salesChart || window._topProductsChart || window._statusChart) return;

    /// sales line
    const salesCtx = document.getElementById("salesChart")?.getContext("2d");
    if (salesCtx) {
        window._salesChart = new Chart(salesCtx, {
            type: "line",
            data: {
                labels: [],
                datasets: [{
                    label: "Revenue (EGP)",
                    data: [],
                    borderColor: "#2e9e45",
                    backgroundColor: "rgba(46,158,69,.10)",
                    borderWidth: 2,
                    pointRadius: 3,
                    fill: true,
                    tension: 0.35
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true, grid: { color: "#eef2f6" } },
                    x: { grid: { display: false } }
                }
            }
        });
    }

    /// Top products bar
    const topCtx = document.getElementById("topProductsChart")?.getContext("2d");
    if (topCtx) {
        window._topProductsChart = new Chart(topCtx, {
            type: "bar",
            data: {
                labels: [],
                datasets: [{
                    label: "Units Sold",
                    data: [],
                    backgroundColor: "rgb(102, 209, 123)",
                    borderColor: "#2e9e45",
                    borderWidth: 2,
                    borderRadius: 10,
                    maxBarThickness: 42
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true, ticks: { precision: 0 }, grid: { color: "#eef2f6" } },
                    x: { grid: { display: false } }
                }
            }
        });
    }

    /// Status doughnut 
    const statusCtx = document.getElementById("orderStatusChart")?.getContext("2d");
    if (statusCtx) {
        window._statusChart = new Chart(statusCtx, {
            type: "doughnut",
            data: {
                labels: [],
                datasets: [{
                    data: [],
                    backgroundColor: [],
                    borderColor: "#ffffff",
                    borderWidth: 2,
                    hoverOffset: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: "bottom" } },
                cutout: "65%"
            }
        });
    }

    //  resizing
    function forceChartsResize() {
        window._salesChart?.resize();
        window._topProductsChart?.resize();
        window._statusChart?.resize();

        window._salesChart?.update("none");
        window._topProductsChart?.update("none");
        window._statusChart?.update("none");
    }

    window.addEventListener("resize", () => {
        clearTimeout(window.__chartResizeTimer);
        window.__chartResizeTimer = setTimeout(forceChartsResize, 120);
    });

    document.addEventListener("visibilitychange", () => {
        if (!document.hidden) setTimeout(forceChartsResize, 120);
    });
}

function statusColor(label) {
    const s = String(label).toLowerCase();
    if (s === "pending") return "rgba(255, 193, 7, .85)";
    if (s === "Processing") return "rgba(13, 110, 253, .80)";
    if (s === "completed") return "rgba(46, 158, 69, .80)";
    return "rgba(108, 117, 125, .70)";
}

/// refreshing
function refreshAnalytics() {
    document.getElementById("kpiRevenue").textContent = "EGP " + getSellerTotalRevenue(currentUser.id);
    document.getElementById("kpiOrders").textContent = getSellerOrders(currentUser.id).length;
    document.getElementById("kpiProducts").textContent = getSellerProducts(currentUser.id).length;

    const data = buildSellerAnalyticsData(currentUser.id);

    // Sales line
    if (window._salesChart) {
        window._salesChart.data.labels = data.sales.labels;
        window._salesChart.data.datasets[0].data = data.sales.data;
        window._salesChart.update();
    }

    // Top 5 bar (by quantity)
    if (window._topProductsChart) {
        window._topProductsChart.data.labels = data.topProducts.labels;
        window._topProductsChart.data.datasets[0].data = data.topProducts.qty;
        window._topProductsChart.update();
    }

    // Status doughnut
    if (window._statusChart) {
        const labels = data.status.labels.map(s => s[0].toUpperCase() + s.slice(1));
        window._statusChart.data.labels = labels;
        window._statusChart.data.datasets[0].data = data.status.data;
        window._statusChart.data.datasets[0].backgroundColor = labels.map(statusColor);
        window._statusChart.update();
    }
}

// ── Form helpers ───────────────────────────────────────────────────────────────
function clearForm() {
    ["productName", "productPrice", "productNewPrice", "productStock", "productDescription"]
        .forEach(id => { document.getElementById(id).value = ""; });
    document.getElementById("productCategory").value = "";
    document.getElementById("productOrganic").checked = false;

    document.getElementById("imagesContainer").innerHTML = `
        <div class="row g-2 mb-2 image-row">
            <div class="col-md-6">
                <input type="url" class="form-control product-image-url"
                       placeholder="Paste Image URL (https://…)" />
            </div>
            <div class="col-md-5">
                <input type="file" class="form-control product-image-file" accept="image/*" />
            </div>
            <div class="col-md-1 d-flex align-items-center">
                <button type="button" class="btn btn-outline-danger btn-sm remove-image-btn d-none">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>`;
}

function populateForm(product) {
    document.getElementById("productName").value = product.name || "";
    document.getElementById("productPrice").value = product.price || "";
    document.getElementById("productNewPrice").value = "";   // always blank
    document.getElementById("productStock").value = product.stock || "";
    document.getElementById("productDescription").value = product.description || "";
    document.getElementById("productCategory").value = product.category || "";
    document.getElementById("productOrganic").checked = !!product.organic;

    const container = document.getElementById("imagesContainer");
    container.innerHTML = "";
    const images = (product.images && product.images.length) ? product.images : [""];
    images.forEach((url, idx) => {
        const row = document.createElement("div");
        row.className = "row g-2 mb-2 image-row";
        row.innerHTML = `
            <div class="col-md-6">
                <input type="url" class="form-control product-image-url"
                       placeholder="Paste Image URL (https://…)" value="${url}" />
            </div>
            <div class="col-md-5">
                <input type="file" class="form-control product-image-file" accept="image/*" />
            </div>
            <div class="col-md-1 d-flex align-items-center">
                <button type="button"
                        class="btn btn-outline-danger btn-sm remove-image-btn ${idx === 0 ? "d-none" : ""}">
                    <i class="fas fa-times"></i>
                </button>
            </div>`;
        container.appendChild(row);
    });
}