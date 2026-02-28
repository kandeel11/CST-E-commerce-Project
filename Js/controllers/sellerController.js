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
    saveProducts,
} from "../services/storageService.js";

// ── State 
let currentUser  = null;   // { storeName, name, userID }
let editingId    = null;   // product id when editing, null when adding

window.addEventListener("DOMContentLoaded", () => {
    initUser();
    initSidebar();
    initProductModal();
    initLogout();
    initSearch('productSearch', 'productStatusFilter');
    initAnalytics();

    loadProductsForSeller(currentUser.id);
    loadOrdersForSeller(currentUser.id)
});

// ── User ───────────────────────────────────────────────────────────────────────
function initUser() {
    // simulate seller data after login
    currentUser = getCurrentSeller();

    //sessionStorage.setItem("pageUser", JSON.stringify(currentUser));
    document.getElementById("storeName").textContent  = currentUser.storeName;
    document.getElementById("sellerName").textContent = `${currentUser.Fname} ${currentUser.Lname}`;
}

// ── Sidebar / section switching ────────────────────────────────────────────────
function initSidebar() {
    const SECTIONS = ["products", "orders", "analytics"];
    const TITLES   = { products: "Products", orders: "Orders", analytics: "Analytics" };

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
        btn.addEventListener("click", function() {
            switchSection(btn.dataset.section);
            let Input;
            let Filter;
            if(btn.dataset.section === 'products'){
                Input = "productSearch";
                Filter = "productStatusFilter";
            }
            else if(btn.dataset.section === 'orders'){
                Input = "orderSearch";
                Filter = "orderStatusFilter"
            }
            else{
                return;
            }
            initSearch(Input, Filter);
        } )
    );
}

// ── Logout ─────────────────────────────────────────────────────────────────────
function initLogout() {
    document.getElementById("logoutBtn").addEventListener("click", () => {
        sessionStorage.removeItem("pageUser");
        window.location.href = "../Pages/Login.html";
    });
}

// ── Search / filter (products table) ──────────────────────────────────────────
function initSearch(Input, Filter) {
    const searchInput  = document.getElementById(Input);
    const statusFilter = document.getElementById(Filter);

    function applyFilter() {
        const input      = searchInput.value.trim().toLowerCase();
        const status = statusFilter.value;

        let rows;
        if(Input === 'productSearch'){
            rows = document.querySelectorAll("#productsTbody tr[data-id]");
            rows.forEach(row => {
            const name = row.querySelector("td:nth-child(2)")?.textContent.toLowerCase() || "";
            const matches      = !input || name.includes(input);
            const matchesStatus = status === "all"; // extend when real status field exists
            row.style.display   = matches && matchesStatus ? "" : "none";
        });
        }else{
            rows = document.querySelectorAll("#ordersTbody tr[data-id]");
            rows.forEach(row => {
                const date   = row.querySelector("td:nth-child(1)")?.textContent.toLowerCase() || "";
                const email  = row.querySelector("td:nth-child(2)")?.textContent.toLowerCase() || "";
                const name   = row.querySelector("td:nth-child(3)")?.textContent.toLowerCase() || "";
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

    searchInput.addEventListener("input",  applyFilter);
    statusFilter.addEventListener("change", applyFilter);
}

//  Product modal (Add + Edit) 
function initProductModal() {
    const modal       = bootstrap.Modal.getOrCreateInstance(document.getElementById("productModal"));
    const modalTitle  = document.getElementById("productModalTitle");
    const modalIcon   = modalTitle.querySelector("i");
    const form        = document.getElementById("productForm");

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
            const url  = row.querySelector(".product-image-url")?.value.trim();
            const file = row.querySelector(".product-image-file")?.files?.[0];
            if (url)        imageUrls.push(url);
            else if (file)  imageUrls.push(URL.createObjectURL(file));
        });

        const name     = document.getElementById("productName").value.trim();
        const category = document.getElementById("productCategory").value;
        const price    = parseFloat(document.getElementById("productPrice").value);
        const newPrice = parseFloat(document.getElementById("productNewPrice").value);
        const stock    = parseInt(document.getElementById("productStock").value);
        const organic  = document.getElementById("productOrganic").checked;
        const desc     = document.getElementById("productDescription").value.trim();

        if (editingId) {
            //  UPDATE existing product 
            const existing = getAllProducts().find(p => p.product_id === editingId);
            // iff a sale price is given: current price → oldPrice, newPrice → price
            let priceUpdate;
            if(!isNaN(newPrice) && newPrice > 0 ){
                if(newPrice < price){
                    priceUpdate = { price: newPrice, oldPrice: price }
                }
                else{
                    priceUpdate = { price: newPrice, oldPrice: null }
                }
            }
            else{
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
                product_id:   `${currentUser.id}_${Date.now()}`,
                seller_id:    currentUser.id,
                brand:        currentUser.storeName,
                name,
                category,
                description:  desc,
                price,
                oldPrice: null,
                stock,
                organic,
                images:       imageUrls.length > 0
                                  ? imageUrls
                                  : ["https://placehold.co/400x300/e8f5e9/2e7d32?text=Product"],
                rating:       0,
                discount:     0,
                dailySale:    false,
                weight:       "",
                unit:         "",
            };
            addProductToStorage(product);
        }

        modal.hide();
        loadProductsForSeller(currentUser.id);
    });
}

// ── Analytics ──────────────────────────────────────────────────────────────────
function initAnalytics() {
    // Chart.js is optional; skip gracefully if not loaded
    if (typeof Chart === "undefined") return;

    const ctx = document.getElementById("salesChart")?.getContext("2d");
    if (!ctx) return;

    window._salesChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: [],
            datasets: [{
                label: "Revenue (EGP)",
                data: [],
                borderColor: "#2e9e45",
                backgroundColor: "rgba(46,158,69,.08)",
                borderWidth: 2,
                pointRadius: 3,
                fill: true,
                tension: .35,
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true, grid: { color: "#e9ecef" } },
                x: { grid: { display: false } }
            }
        }
    });
}

function refreshAnalytics() {
    //const myProducts = getAllProducts().filter(p => p.seller_id === currentUser.userID);
    document.getElementById("kpiRevenue").textContent =
        "EGP " + getSellerTotalRevenue(currentUser.id);
    document.getElementById("kpiOrders").textContent  = getSellerOrders(currentUser.id).length;
    document.getElementById("kpiProducts").textContent = getSellerProducts(currentUser.id).length;

    // Stub chart data (replace with real order data when available)
    if (window._salesChart) {
        const labels = ["Jan","Feb","Mar","Apr","May","Jun","Jul"];
        const data   = labels.map(() => Math.floor(Math.random() * 3000) + 500);
        window._salesChart.data.labels   = labels;
        window._salesChart.data.datasets[0].data = data;
        window._salesChart.update();
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
    document.getElementById("productName").value        = product.name        || "";
    document.getElementById("productPrice").value       = product.price       || "";
    document.getElementById("productNewPrice").value    = "";   // always blank; seller fills in if desired
    document.getElementById("productStock").value       = product.stock       || "";
    document.getElementById("productDescription").value = product.description || "";
    document.getElementById("productCategory").value    = product.category    || "";
    document.getElementById("productOrganic").checked   = !!product.organic;

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