const PRODUCTS_KEY = "products";
const ORDERS_KEY = "orders";
const USERS_KEY = "users";

export function getCurrentUser() {
    return JSON.parse(sessionStorage.getItem('currentUser'));
}
export function getCurrentSeller() {
    return JSON.parse(sessionStorage.getItem('currentSeller'));
}

export function addProductToStorage(product) {
    const products = getAllProducts();
    const plain = typeof product.toJSON === "function" ? product.toJSON() : { ...product };
    products.push(plain);
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
}

export function getAllProducts() {
    return JSON.parse(localStorage.getItem(PRODUCTS_KEY)) || [];
}
export function getAllOrders() {
    return JSON.parse(localStorage.getItem(ORDERS_KEY)) || [];
}
export function getAllUsers() {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
}
function getUserEmailById(userId) {
    const users = getAllUsers();
    const u = users.find(x => String(x.id) === String(userId));
    return u?.Email || "Unknown";
}

export function getSellerOrders(sellerId) {
    const allOrders = getAllOrders();
    let sellerProducts = allOrders.flatMap(order => {
        return (order.products || []).filter(p =>
            String(p.seller_id) === String(sellerId)
        );
    }
    );
    return sellerProducts;
}
export function getSellerTotalRevenue(sellerId) {
    const products = getSellerOrders(sellerId);
    let TotalRevenue = products.reduce((sum, p) => sum + (Number(p.price) * Number(p.quantity)), 0);
    return TotalRevenue.toFixed(2);
}
export function getSellerProducts(seller_id) {
    let allProducts = getAllProducts();
    return allProducts.filter(p => p.seller_id === seller_id);
}

export function saveProducts(products) {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
}
export function saveOrders(orders) {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

export function getProductById(product_id) {
    return getAllProducts().find(p => p.product_id === product_id) || null;
}

export function updateProduct(updatedProduct) {
    const products = getAllProducts().map(p =>
        p.product_id === updatedProduct.product_id ? { ...p, ...updatedProduct } : p
    );
    saveProducts(products);
}

export function removeProductFromStorage(product_id) {
    saveProducts(getAllProducts().filter(p => p.product_id !== product_id));
}

export function loadProductsForSeller(sellerID) {
    const products = getAllProducts().filter(p => p.seller_id === sellerID);
    renderProductsTable(products);
}
/////////////New
export function loadOrdersForSeller() {
    const sellerId = getCurrentSeller().id;
    getSellerTotalRevenue(sellerId);
    const rows = getAllOrders().flatMap(order => {
        const userid = order.userid;
        const buyerEmail = getUserEmailById(order.userid);
        const orderDate = new Date(order.createddate).toLocaleDateString();
        const orderStatus = order.orderStatus;

        // take only products for current seller
        const sellerProducts = (order.products || []).filter(p =>
            String(p.seller_id) === String(sellerId)
        );

        // each matching product becomes its own row
        return sellerProducts.map(p => ({
            orderDate,
            rawCreatedDate: order.createddate,//// raw value used for matching on cancel
            buyerEmail,
            productName: p.name,
            quantity: p.quantity,
            status: p.status || orderStatus, // use product-level status if available, else order-level
            product_id: p.product_id,
            userid
        }));
    });
    renderOrdersTable(rows);
}

function renderOrdersTable(orders) {
    const tableBody = document.getElementById("ordersTbody");
    if (!tableBody) return;

    tableBody.innerHTML = "";

    if (!Array.isArray(orders) || orders.length === 0) {
        tableBody.innerHTML = `
      <tr>
        <td colspan="6" class="text-center text-muted py-5">
          <div class="d-flex flex-column align-items-center gap-2">
            <i class="fas fa-box-open fa-2x opacity-50"></i>
            <div class="fw-semibold">No orders yet</div>
            <div class="small">When customers place orders, they’ll appear here.</div>
          </div>
        </td>
      </tr>
    `;
        return;
    }

    const statusBadgeClass = (status) => {
        const s = String(status || "").toLowerCase();
        if (s === "pending") return "badge bg-warning-subtle text-warning-emphasis border border-warning-subtle";
        if (s === "completed" || s === "delivered") return "badge bg-success-subtle text-success-emphasis border border-success-subtle";
        if (s === "processing" || s === "processed") return "badge bg-info-subtle text-info-emphasis border border-info-subtle";
        if (s === "cancelled" || s === "usercancelled") return "badge bg-danger-subtle text-danger-emphasis border border-danger-subtle";
        return "badge bg-secondary-subtle text-secondary-emphasis border border-secondary-subtle";
    };

    orders.forEach((order) => {

        const productId = order.product_id;
        const buyerEmail = order.buyerEmail ?? "Unknown";
        const productName = order.productName ?? "-";
        const quantity = Number(order.quantity ?? 0);
        const orderStatus = order.orderStatus ?? order.status ?? "pending";
        const orderDate = new Date(order.orderDate ?? order.createddate ?? Date.now()).toLocaleDateString();

        const row = document.createElement("tr");
        row.classList.add("align-middle");
        row.dataset.id = String(productId);

        row.innerHTML = `
      <td class="text-muted small">${orderDate}</td>

      <td class="small">
        <i class="fas fa-envelope me-2 text-muted"></i>
        <span class="text-primary">${buyerEmail}</span>
      </td>

      <td class="fw-semibold">
        <i class="fas fa-tag me-2 text-muted"></i>${productName}
      </td>

      <td>
        <span class="badge bg-success-subtle text-success-emphasis border border-success-subtle px-3 py-2">
          x${Number.isFinite(quantity) ? quantity : 0}
        </span>
      </td>

      <td>
        <span class="${statusBadgeClass(orderStatus)} px-3 py-2 text-capitalize statusbadge">
          ${orderStatus}
        </span>
      </td>

      <td class="text-end d-none d-lg-table-cell">
        ${(() => {
                const s = String(orderStatus).toLowerCase();
                if (s === 'completed' || s === 'cancelled' || s === 'usercancelled') return '';
                if (s === 'processing' || s === 'processed') return `
                <button type="button" class="btn btn-sm btn-outline-primary confirm-order-btn ms-1">
                    <span class="small"><i class="fas fa-check me-1"></i>Confirm</span>
                </button>
                <button type="button" class="btn btn-sm btn-outline-danger cancel-order-btn">
                    <span class="small"><i class="fas fa-trash-alt me-1"></i>Cancel</span>
                </button>`;
                // pending or any other status
                return `
                <button type="button" class="btn btn-sm btn-outline-danger cancel-order-btn">
                    <span class="small"><i class="fas fa-trash-alt me-1"></i>Cancel</span>
                </button>`;
            })()}
      </td>
    `;

        row.addEventListener("mouseenter", () => row.classList.add("table-active"));
        row.addEventListener("mouseleave", () => row.classList.remove("table-active"));
        const cancelBtn = row.querySelector(".cancel-order-btn");
        if (cancelBtn) {
            cancelBtn.addEventListener("click", () => {
                // Show modal instead of confirm()
                const modalEl = document.getElementById("cancelOrderItemModal");
                const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
                modal.show();

                // Remove previous listener to avoid stacking
                const confirmBtn = document.getElementById("confirmCancelOrderItemBtn");
                const newConfirmBtn = confirmBtn.cloneNode(true);
                confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);

                newConfirmBtn.addEventListener("click", () => {
                    modal.hide();

                    // restore stock 
                    const products = getAllProducts();
                    const idx = products.findIndex((p) => p.product_id === productId);

                    if (idx !== -1) {
                        const q = Number.isFinite(quantity) ? quantity : 0;
                        products[idx].stock = Number(products[idx].stock || 0) + q;
                        saveProducts(products);
                    }

                    // Set product-level status to "cancelled" instead of removing
                    let allOrders = getAllOrders();
                    allOrders.forEach(o => {
                        const sameBuyer = String(o.userid) === String(order.userid);
                        const sameDate = String(o.createddate) === String(order.rawCreatedDate);
                        if (!sameBuyer || !sameDate) return;

                        (o.products || []).forEach(p => {
                            if (String(p.product_id) === String(productId)) {
                                p.status = "cancelled";
                            }
                        });

                        // Recalculate overall order status based on all product statuses
                        o.orderStatus = recalcOrderStatus(o.products);
                    });
                    saveOrders(allOrders);

                    // Update UI
                    const statusBadge = row.querySelector('.statusbadge');
                    statusBadge.className = `${statusBadgeClass("cancelled")} px-3 py-2 text-capitalize statusbadge`;
                    statusBadge.textContent = "cancelled";
                    cancelBtn.remove();
                    const confirmBtnInRow = row.querySelector('.confirm-order-btn');
                    if (confirmBtnInRow) confirmBtnInRow.remove();
                });
            });
        }

        row.addEventListener('click', function (e) {
            const confirmBtn = e.target.closest('.confirm-order-btn');
            if (!confirmBtn) return;

            const productId = row.dataset.id;
            const orders = getAllOrders();

            // Find the order containing this product and update product-level status
            orders.forEach(o => {
                const matchProduct = (o.products || []).find(p => String(p.product_id) === String(productId));
                if (matchProduct) {
                    matchProduct.status = "completed";
                    // Recalculate overall order status
                    o.orderStatus = recalcOrderStatus(o.products);
                }
            });
            saveOrders(orders);

            const statusBadge = row.querySelector('.statusbadge');
            statusBadge.className = `${statusBadgeClass("completed")} px-3 py-2 text-capitalize statusbadge`;
            statusBadge.textContent = "Completed";

            confirmBtn.remove();
            const cancelBtnInRow = row.querySelector('.cancel-order-btn');
            if (cancelBtnInRow) cancelBtnInRow.remove();
        });
        tableBody.appendChild(row);
    });
}

// Recalculate overall order status from product-level statuses
function recalcOrderStatus(products) {
    if (!products || products.length === 0) return "pending";

    const statuses = products.map(p => (p.status || "processing").toLowerCase());
    const allCompleted = statuses.every(s => s === "completed");
    const allCancelled = statuses.every(s => s === "cancelled");
    const hasCompleted = statuses.some(s => s === "completed");
    const hasCancelled = statuses.some(s => s === "cancelled");

    if (allCompleted) return "completed";
    if (allCancelled) return "cancelled";
    if (hasCompleted || hasCancelled) return "processing";
    return "processing";
}

function renderProductsTable(products) {
    const tableBody = document.getElementById("productsTbody");
    if (!tableBody) return;
    tableBody.innerHTML = "";

    if (products.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center text-muted py-4">
                    <i class="fas fa-box-open me-2"></i>No products yet. Add your first product!
                </td>
            </tr>`;
        return;
    }

    products.forEach(product => {
        const img = (product.images && product.images[0]) || "";
        const name = product.name || "—";
        const price = parseFloat(product.price || 0).toFixed(2);
        const stock = product.stock ?? "—";

        const row = document.createElement("tr");
        row.dataset.id = product.product_id;
        row.innerHTML = `
            <td>
                <img src="${img}" alt="${name}"
                     class="rounded" style="width:56px;height:56px;object-fit:cover">
            </td>
            <td class="fw-semibold">${name}</td>
            <td class="text-success fw-semibold">EGP ${price}</td>
            <td>
                <span class="badge ${stock > 0 ? "bg-success-subtle text-success" : "bg-danger-subtle text-danger"}">
                    ${stock > 0 ? stock + " in stock" : "Out of stock"}
                </span>
            </td>
            <td class="text-end d-none d-lg-table-cell">
                <button class="btn btn-sm btn-outline-success me-1 edit-btn">
                    <i class="fas fa-pen me-1"></i>Edit
                </button>
                <button class="btn btn-sm btn-outline-danger delete-btn">
                    <i class="fas fa-trash-alt me-1"></i>Delete
                </button>
            </td>
        `;

        row.querySelector(".delete-btn").addEventListener("click", () => {
            // Show modal instead of confirm()
            const deleteModalEl = document.getElementById("deleteProductModal");
            const deleteModal = bootstrap.Modal.getOrCreateInstance(deleteModalEl);
            document.getElementById("deleteProductName").textContent = name;
            deleteModal.show();

            // Remove previous listener to avoid stacking
            const delConfirmBtn = document.getElementById("confirmDeleteProductBtn");
            const newDelConfirmBtn = delConfirmBtn.cloneNode(true);
            delConfirmBtn.parentNode.replaceChild(newDelConfirmBtn, delConfirmBtn);

            newDelConfirmBtn.addEventListener("click", () => {
                deleteModal.hide();
                removeProductFromStorage(product.product_id);
                row.remove();
                if (!tableBody.querySelector("tr[data-id]")) renderProductsTable([]);
            });
        });

        row.querySelector(".edit-btn").addEventListener("click", () => {
            tableBody.dispatchEvent(new CustomEvent("editProduct", {
                bubbles: true,
                detail: product
            }));
        });

        tableBody.appendChild(row);
    });
}

// Manage Sellers (Admin Page)
export function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function toggleSellerActive(sellerId) {
    const users = getAllUsers();
    const idx   = users.findIndex(u => String(u.id) === String(sellerId));
    if (idx === -1) return;
    users[idx].Active = !users[idx].Active;
    saveUsers(users);
}

export function deleteSellerAndProducts(sellerId) {
    // Remove seller from users
    const users = getAllUsers();
    saveUsers(users.filter(u => String(u.id) !== String(sellerId)));

    // Remove all products belonging to this seller
    const products = getAllProducts();
    saveProducts(products.filter(p => String(p.seller_id) !== String(sellerId)));
}

// ── Wishlist helpers
const WISHLIST_KEY = "wishlists";

export function getWishlist() {
    return JSON.parse(localStorage.getItem(WISHLIST_KEY)) || {};
}

export function isInWishlist(product_id) {
    if (!getCurrentUser()) return false;
    const wishlists = getWishlist();
    let wishlist = wishlists[getCurrentUser().id] || [];
    return wishlist.some(item => item.product_id === product_id);
}

export function addToWishlist(product) {
    if (!getCurrentUser()) return false;
    let wishlists = getWishlist();
    let wishlist = wishlists[getCurrentUser().id] || [];

    if (!wishlist.some(item => item.product_id === product.product_id)) {
        wishlist.push(product);
        wishlists[getCurrentUser().id] = wishlist;
        localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlists));
        localStorage.setItem("wishUpdated", Date.now());
        return true;
    }
    return false;
}

export function removeFromWishlist(product_id) {
    let wishlists = getWishlist();
    let wishlist = wishlists[getCurrentUser().id] || [];
    wishlists[getCurrentUser().id] = wishlist.filter(item => item.product_id !== product_id);
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlists));
    localStorage.setItem("wishUpdated", Date.now());
}

export function toggleWishlist(product) {
    if (isInWishlist(product.product_id)) {
        removeFromWishlist(product.product_id);
        return false; // removed
    }
    addToWishlist(product);
    return true; // added
}

// ── Cart helpers ───────────────────────────────────────────────────────────────
const CART_KEY = "cart";

/** Returns the full cart array (all users). */
export function getCart() {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

/** Returns the cart entry for the current user, or null if none. */
export function getUserCart() {
    const user = getCurrentUser();
    if (!user) return null;
    return getCart().find(e => e.userid === user.id) || null;
}

/** Returns the items array for the current user. */
export function getUserCartItems() {
    return getUserCart()?.items || [];
}
function getMyCart() {
    const key = "MyCart";
    const user = getCurrentUser();
    if (!user) {
        console.warn("getMyCart called but no user is logged in.");
    };
    const cart = getCart();


    if (!user) {
        let myCart = JSON.parse(sessionStorage.getItem(key));
        if (myCart) {
            return myCart;
        } else {
            let userCart = { "userid": "notlogin", "items": [] };
            return userCart;
        }


    }
    let userCart = cart.find(e => e.userid === user.id);
    if (!userCart) {
        userCart = { "userid": user.id, "items": [] };
        cart.push(userCart);
        sessionStorage.setItem(key, JSON.stringify(userCart));
    }
    return userCart;
}


export function addToCart(product) {
    const user = getCurrentUser();
    const myCart = getMyCart();
    const cart = getCart();
    let userCart;
    if (!user) {
        userCart = myCart; // use session-based cart for not logged in users
        const existing = userCart.items.find(item => item.product_id === product.product_id);

        if (existing) {
            if ((existing.quantity || 0) >= (product.stock || Infinity)) {
                return false; // stock limit reached
            }
            existing.quantity = (existing.quantity || 1) + (product.quantity || 1);
        } else {
            userCart.items.push({ ...product, quantity: product.quantity || 1 });

        }
        sessionStorage.setItem("MyCart", JSON.stringify(myCart));
        return true;


        // userCart = { "userid": "notlogin", "items": [] };
        // sessionStorage.setItem("MyCart", JSON.stringify(userCart));
    }
    if (user) {
        let userCart = cart.find(e => e.userid === user.id);
        if (!userCart) {
            userCart = { "userid": user.id, "items": [] };
            cart.push(userCart);
        }

        const existing = userCart.items.find(item => item.product_id === product.product_id);

        if (existing) {
            if ((existing.quantity || 0) >= (product.stock || Infinity)) {
                return false; // stock limit reached
            }
            existing.quantity = (existing.quantity || 1) + (product.quantity || 1);
        } else {
            userCart.items.push({ ...product, quantity: product.quantity || 1 });
        }
        myCart.items = userCart.items; // sync with getMyCart reference
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
        sessionStorage.setItem("MyCart", JSON.stringify(myCart));
        localStorage.setItem("cartUpdated", Date.now());
        if (window.updateCartBadge) window.updateCartBadge();
    }
    return true;

}

/** Removes a single item from the current user's cart by product_id. */
export function removeFromCart(product_id) {
    const user = getCurrentUser();
    if (!user) return;

    const cart = getCart();
    const userCart = cart.find(e => e.userid === user.id);
    if (!userCart) return;

    userCart.items = userCart.items.filter(item => item.product_id !== product_id);
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    sessionStorage.setItem("MyCart", JSON.stringify(userCart));
    localStorage.setItem("cartUpdated", Date.now());
}

/** Updates the quantity of an item; removes it if quantity reaches 0. */
export function updateCartItemQuantity(product_id, quantity) {
    const user = getCurrentUser();
    if (!user) return;

    const cart = getCart();
    const userCart = cart.find(e => e.userid === user.id);
    if (!userCart) return;

    if (quantity <= 0) {
        userCart.items = userCart.items.filter(item => item.product_id !== product_id);
    } else {
        const item = userCart.items.find(item => item.product_id === product_id);
        if (item) item.quantity = quantity;
    }
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    sessionStorage.setItem("MyCart", JSON.stringify(userCart));
    localStorage.setItem("cartUpdated", Date.now());
}

/** Clears all items from the current user's cart. */
export function clearCart() {
    const user = getCurrentUser();
    if (!user) return;

    const cart = getCart();
    const userCart = cart.find(e => e.userid === user.id);
    if (userCart) userCart.items = [];
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    sessionStorage.setItem("MyCart", JSON.stringify(userCart));
    localStorage.setItem("cartUpdated", Date.now());
}

/** Total number of items (sum of quantities) in the current user's cart. */
export function getCartCount() {
    return getUserCartItems().reduce((sum, item) => sum + (item.quantity || 1), 0);
}