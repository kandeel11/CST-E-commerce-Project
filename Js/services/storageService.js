// current user
let CURRENT_USER = localStorage.getItem('currentUser');

//  product helpers 
const PRODUCTS_KEY = "products";

export function addProductToStorage(product) {
    const products = getAllProducts();
    //products.push(product.toJSON());
    products.push(product)
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

export function loadProductsForSeller(sellerID) {
    renderProductsTable(getAllProducts().filter(p => p.sellerID === sellerID));
}

function renderProductsTable(products) {
    const tableBody = document.getElementById("productsTbody");
    if (!tableBody) return;
    tableBody.innerHTML = "";
    products.forEach(product => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td><img src="${product.imageUrl}" alt="${product.productName}" class="img-fluid" style="max-height:80px"></td>
            <td>${product.productName}</td>
            <td>$${Number(product.productPrice).toFixed(2)}</td>
            <td>${product.stockQuantity}</td>
            <td class="text-end d-none d-lg-table-cell">
                <button class="btn btn-sm btn-outline-primary me-1">Edit</button>
                <button class="btn btn-sm btn-outline-warning me-1">Freeze</button>
                <button class="btn btn-sm btn-outline-danger">Delete</button>
            </td>
        `;
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

//  cart helpers 
const CART_KEY = "cart";

export function getCart() {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

export function addToCart(product) {
    const cart = getCart();
    const existing = cart.find(item => item.product_id === product.product_id);
    if (existing) {
        existing.quantity = (existing.quantity || 1) + 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function getCartCount() {
    return getCart().reduce((sum, item) => sum + (item.quantity || 1), 0);
}