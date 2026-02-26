// ── Product helpers ────────────────────────────────────────────────────────────
const PRODUCTS_KEY = "products";

export function getCurrentUser(){
    return JSON.parse(localStorage.getItem('currentUser'));
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

export function saveProducts(products) {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
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
        const img   = (product.images && product.images[0]) || "";
        const name  = product.name  || "—";
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
            if (!confirm(`Delete "${name}"?`)) return;
            removeProductFromStorage(product.product_id);
            row.remove();
            if (!tableBody.querySelector("tr[data-id]")) renderProductsTable([]);
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

// ── Wishlist helpers (stored under key: "waitlists") ──────────────────────────
const WISHLIST_KEY = "wishlists";

export function getWishlist() {
    return JSON.parse(localStorage.getItem(WISHLIST_KEY)) || {};
}

export function isInWishlist(product_id) {
    const wishlists = getWishlist();
    let wishlist = wishlists[getCurrentUser().userid] || [];
    return wishlist.some(item => item.product_id === product_id);
}

export function addToWishlist(product) {
    let wishlists = getWishlist();
    let wishlist = wishlists[getCurrentUser().userid] || [];

    if (!wishlist.some(item => item.product_id === product.product_id)) {
        wishlist.push(product);
        wishlists[getCurrentUser().userid] = wishlist;
        localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlists));
        return true;
    }
    return false;
}

export function removeFromWishlist(product_id) {
    let wishlists = getWishlist();
    let wishlist = wishlists[getCurrentUser().userid] || [];
    wishlists[getCurrentUser().userid] = wishlist.filter(item => item.product_id !== product_id);
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlists));
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
    return getCart().find(e => e.userid === user.userid) || null;
}

/** Returns the items array for the current user. */
export function getUserCartItems() {
    return getUserCart()?.items || [];
}

/**
 * Adds a product to the current user's cart.
 * Increments quantity if already present; respects product.stock limit.
 * Returns true on success, false if stock limit reached or no user logged in.
 */
export function addToCart(product) {
    const user = getCurrentUser();
    if (!user) return false;

    const cart = getCart();

    let userCart = cart.find(e => e.userid === user.userid);
    if (!userCart) {
        userCart = { userid: user.userid, items: [] };
        cart.push(userCart);
    }

    const existing = userCart.items.find(item => item.product_id === product.product_id);

    if (existing) {
        if ((existing.quantity || 0) >= (product.stock || Infinity)) {
            return false; // stock limit reached
        }
        existing.quantity = (existing.quantity || 1) + 1;
    } else {
        userCart.items.push({ ...product, quantity: 1 });
    }

    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    return true;
}

/** Removes a single item from the current user's cart by product_id. */
export function removeFromCart(product_id) {
    const user = getCurrentUser();
    if (!user) return;

    const cart = getCart();
    const userCart = cart.find(e => e.userid === user.userid);
    if (!userCart) return;

    userCart.items = userCart.items.filter(item => item.product_id !== product_id);
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

/** Updates the quantity of an item; removes it if quantity reaches 0. */
export function updateCartItemQuantity(product_id, quantity) {
    const user = getCurrentUser();
    if (!user) return;

    const cart = getCart();
    const userCart = cart.find(e => e.userid === user.userid);
    if (!userCart) return;

    if (quantity <= 0) {
        userCart.items = userCart.items.filter(item => item.product_id !== product_id);
    } else {
        const item = userCart.items.find(item => item.product_id === product_id);
        if (item) item.quantity = quantity;
    }
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

/** Clears all items from the current user's cart. */
export function clearCart() {
    const user = getCurrentUser();
    if (!user) return;

    const cart = getCart();
    const userCart = cart.find(e => e.userid === user.userid);
    if (userCart) userCart.items = [];
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

/** Total number of items (sum of quantities) in the current user's cart. */
export function getCartCount() {
    return getUserCartItems().reduce((sum, item) => sum + (item.quantity || 1), 0);
}