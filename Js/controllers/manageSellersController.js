import { 
    getAllUsers, 
    getAllProducts, 
    saveProducts, 
    saveUsers, 
    toggleSellerActive, 
    deleteSellerAndProducts 
} from "../services/storageService.js";

// State 
let allSellers = [];
let filtered = [];
let pendingDelete = null; // seller id queued for confirmation

// start
window.addEventListener("DOMContentLoaded", () => {
    loadSellers();
    bindSearch();
    bindDeleteConfirm();
    setAdminName();

    document.getElementById("logoutBtn").addEventListener("click", () => {
        sessionStorage.clear();
        window.location.href = "../Pages/Login.html";
    });
});


function loadSellers() {
    const users    = getAllUsers();
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
        const toggleIcon  = seller.active ? "fa-ban" : "fa-check-circle";
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
                    <button class="btn btn-sm ${toggleClass} toggle-btn" title="${toggleLabel}">
                        <i class="fas ${toggleIcon} me-1"></i>${toggleLabel}
                    </button>
                    <button class="btn btn-sm btn-outline-danger delete-btn" title="Delete seller">
                        <i class="fas fa-trash-alt me-1"></i>Delete
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
            document.getElementById("deleteSellerName").textContent  = seller.name;
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
    document.getElementById("confirmDeleteBtn").addEventListener("click", () => {
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
    const q      = document.getElementById("searchInput").value.trim().toLowerCase();
    const status = document.getElementById("statusFilter").value;

    filtered = allSellers.filter(s => {
        const matchesQ = !q ||
            s.name.toLowerCase().includes(q)  ||
            s.email.toLowerCase().includes(q) ||
            s.id.toLowerCase().includes(q);

        const matchesStatus =
            status === "all"     ||
            (status === "active"   &&  s.active) ||
            (status === "inactive" && !s.active);

        return matchesQ && matchesStatus;
    });

    renderTable();
}

// ── Helpers 
function starsHtml(rating) {
    const full  = Math.floor(rating);
    const half  = rating - full >= 0.5 ? 1 : 0;
    const empty = 5 - full - half;
    return "★".repeat(full) + (half ? "½" : "") + "☆".repeat(empty);
}

function setAdminName() {
    try {
        const user = JSON.parse(sessionStorage.getItem("pageUser") || "{}");
        if (user?.name) document.getElementById("adminName").textContent = user.name;
    } catch {  }
}