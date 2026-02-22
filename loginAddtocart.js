//Create cart for each user
import { Cart } from "./cart.js";

var btnlogin = document.getElementById("btnlogin");
btnlogin.addEventListener("click", function () {
    var currentuser = JSON.parse(localStorage.getItem("currentUser"));
    if(!currentuser){return;}
    var userid = currentuser.id;
    var mycart = Cart.createcart(userid);
    localStorage.setItem("MyCart",JSON.stringify(mycart));
    console.log(mycart);
});
//import{addProductToTable} from 'cart.js';
 let products = [
    { id: 1, name: "Shirt2", price: 300, image: "shirt.jpg" },
    { id: 2, name: "Shoes2", price: 500, image: "shoes.jpg" }
];

if(!localStorage.getItem("products")){
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
                <button class="btn btn-primary btnaddtocart" data-id="${product.id}">Add to Cart</button>
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
        if (!currentUser) return;

        let userId = currentUser.id;
        let cartKey = "cart_" + userId;

        let userCart = JSON.parse(localStorage.getItem(cartKey)) || {
            userid: userId,
            items: []
        };

        let selectedProduct = storedProducts.find(p => p.id === productId);
        if (!selectedProduct) return;

        let findItem = userCart.items.find(i => i.id === productId);

        if (findItem) {
            findItem.quantity += 1;
        } else {
            userCart.items.push({
                id: selectedProduct.id,
                name: selectedProduct.name,
                price: selectedProduct.price,
                image: selectedProduct.image,
                quantity: 1
            });
        }

        localStorage.setItem(cartKey, JSON.stringify(userCart));
        localStorage.setItem("cartUpdated", Date.now());

        console.log(userCart);
    });
}