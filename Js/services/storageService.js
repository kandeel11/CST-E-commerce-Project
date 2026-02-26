import { showToast } from "../controllers/productController.js";
const CURRENT_USER = 'ahmedali@example.com';

//  Product 
const PRODUCTS_KEY = "products";

/*
 * Accepts a plain object and a class instance that has toJSON().
 */
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

export function getProductById(id) {
    return getAllProducts().find(p => p.id === id) || null;
}

export function updateProduct(updatedProduct) {
    const products = getAllProducts().map(p =>
        p.id === updatedProduct.id ? { ...p, ...updatedProduct } : p
    );
    saveProducts(products);
}

export function removeProductFromStorage(productId) {
    saveProducts(getAllProducts().filter(p => p.id !== productId));
}

/**
 * Loads and renders the products table for a specific seller.
 * Expects products to have: id, name, price, stock, images[], seller_id
 */
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
        const price = parseFloat(product.price  || 0).toFixed(2);
        const stock = product.stock ?? "—";

        const row = document.createElement("tr");
        row.dataset.id = product.id;
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

        // Inline delete
        row.querySelector(".delete-btn").addEventListener("click", () => {
            if (!confirm(`Delete "${name}"?`)) return;
            removeProductFromStorage(product.id);
            row.remove();
            // Re-check empty state
            if (!tableBody.querySelector("tr[data-id]"))
                renderProductsTable([]);
        });

        // Inline edit — dispatch a custom event the controller listens to
        row.querySelector(".edit-btn").addEventListener("click", () => {
            tableBody.dispatchEvent(new CustomEvent("editProduct", {
                bubbles: true,
                detail: product
            }));
        });

        tableBody.appendChild(row);
    });
}

//  wishlist helpers  
const WISHLIST_KEY = "wishlists";

export function getWishlist() {
    return JSON.parse(localStorage.getItem(WISHLIST_KEY))[CURRENT_USER]|| [];
}

export function isInWishlist(productId) {
    return getWishlist().some(item => item.product_id === productId);
}

export function addToWishlist(product) {

    const wishlists = JSON.parse(localStorage.getItem(WISHLIST_KEY)) || {};

    // Ensure user array exists
    wishlists[CURRENT_USER] ??= [];

    const userWishlist = wishlists[CURRENT_USER];

    if (!userWishlist.some(item => item.product_id === product.product_id)) {
        userWishlist.push(product);

        localStorage.setItem(
            WISHLIST_KEY,
            JSON.stringify(wishlists)
        );

        return true;
    }

    return false;
}

export function removeFromWishlist(productId) {
    const wishlist = getWishlist().filter(item => item.product_id !== productId);
    let wishlists = JSON.parse(localStorage.getItem(WISHLIST_KEY)) || {};
    let userWishlist = wishlists[CURRENT_USER];
    userWishlist = wishlist;
    wishlists[CURRENT_USER] = userWishlist;
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlists));
}

export function toggleWishlist(product) {
    if (isInWishlist(product.product_id)) {
        removeFromWishlist(product.product_id);
        return false; 
    }
    addToWishlist(product);
    return true; 
}

//  Cart  
const CART_KEY = "cart";

export function getCart() {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

export function addToCart(product) {
    const cart = getCart();
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
            if((existing.quantity || 0) >= product.stock){
                showToast(`✋🏼 Maximum Quantity Reached!`);
                return false;
            }
        existing.quantity = (existing.quantity || 1) + 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    return true;
}

export function getCartCount() {
    return getCart().reduce((sum, item) => sum + (item.quantity || 1), 0);
}