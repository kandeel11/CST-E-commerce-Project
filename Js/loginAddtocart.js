//Create cart for each user
import { Cart } from "./Cart.js";

var btnlogin = document.getElementById("btnlogin");
btnlogin.addEventListener("click", function () {
    var currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) return;
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
    // createcart already persists the full carts array
    Cart.createcart(currentUser.id);
});
//import{addProductToTable} from 'cart.js';
let products = [
    { product_id: 1, name: "Shirt2", price: 300, image: "shirt.jpg", stock: 10 },
    { product_id: 2, name: "Shoes2", price: 500, image: "shoes.jpg", stock: 5 }
];

if (!localStorage.getItem("products")) {
    localStorage.setItem("products", JSON.stringify(products));
}

let storedProducts = JSON.parse(localStorage.getItem("products"));

let productContainer = document.getElementById("productdiv");

storedProducts.forEach(product => {
    let cel = document.createElement("div");
    cel.style.width = "300px";
    cel.style.height = "300px";
    cel.style.display = "inline-block";
    cel.classList.add("col-6", "mb-4", "ms-4");
    cel.innerHTML = `
        <div class="card h-100">
            <div class="card-body">
                <h5 class="card-title">${product.name}</h5>
                <p class="card-text">Price: ${product.price}</p>
                <button class="btn btn-primary btnaddtocart" data-id="${product.product_id}">Add to Cart</button>
            </div>
        </div>
    `;
    productContainer.appendChild(cel);
});

let btnAdd = document.getElementsByClassName("btnaddtocart");

for (let i = 0; i < btnAdd.length; i++) {
    btnAdd[i].addEventListener("click", function (e) {
        if (!e.target.classList.contains("btnaddtocart")) return;

        let productId = parseInt(e.target.dataset.id);
        let currentUser = JSON.parse(localStorage.getItem("currentUser"));
        if (!currentUser) {
            alert("Please login first!");
            return;
        }

        // Get (or create) the current user's cart from the carts array
        let usercart = Cart.createcart(currentUser.id);

        let selectedProduct = storedProducts.find(p => p.product_id === productId);
        if (!selectedProduct) return;
        if (selectedProduct.stock <= 0) {
            alert("Sorry, this product is out of stock.");
            return;
        }

        // Use the Cart helper to check / update the item
        let existingItem = Cart.GetItem(usercart, productId);

        if (existingItem) {
            selectedProduct.stock -= 1;
            existingItem.quantity += 1;
            Cart.UpdateCartAndSave(usercart);
        } else {
            Cart.AddOrUpdateItem(usercart, {
                product_id: selectedProduct.product_id,
                name: selectedProduct.name,
                price: selectedProduct.price,
                image: selectedProduct.image,
                quantity: 1
            });
        }

        localStorage.setItem("products", JSON.stringify(storedProducts));
        localStorage.setItem("cartUpdated", Date.now());

        console.log(usercart);
    });
}