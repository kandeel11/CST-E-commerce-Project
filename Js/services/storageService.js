export function addProductToStorage(product) {
    let products = JSON.parse(localStorage.getItem("products")) || [];
    products.push(product.toJSON());
    localStorage.setItem("products", JSON.stringify(products));
}

function getProductsBySeller(sellerID) {
    let products = JSON.parse(localStorage.getItem("products")) || [];
    return products.filter(p => p.sellerID === sellerID);
}

function renderProductsTable(products) {
    let tableBody = document.getElementById('productsTbody');
    tableBody.innerHTML = "";

    //let addedProduct = products[products.length - 1];
    products.forEach(product => {
        let row = document.createElement('tr');
        row.innerHTML = `
            <td><img src="${product.imageUrl}" alt="${product.productName}" class="img-fluid" style="max-height: 100px;"></td>
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

export function loadProductsForSeller(sellerID) {
    let products = getProductsBySeller(sellerID);
    renderProductsTable(products);
}