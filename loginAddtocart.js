//Create cart for each user
import { Cart } from "./Js/Cart.js";

var btnlogin = document.getElementById("btnlogin");
btnlogin.addEventListener("click", function () {
    //{id: 111, name: "yoy", email: "yo@gmail.com"};
    var currentUser = {"id":"Us-1","Fname":"mohamed","Lname":"Khaled","dateCreated":"Wed Feb 25 2026 21:52:32 GMT+0200 (Eastern European Standard Time)","address":"22 Abo halmous, Gharbia, Egypt","Phone":"01014867453","Role":"User","Email":"khaled241@gmail.com","password":"Kh@123456","Active":true};//JSON.parse(localStorage.getItem("currentUser"));
    if(!currentUser){return;}
    localStorage.setItem("currentUser",JSON.stringify(currentUser));
    var userid = currentUser.id;
    var mycart = Cart.createcart(userid);
    localStorage.setItem("MyCart",JSON.stringify(mycart));
    console.log(mycart);
});
//import{addProductToTable} from 'cart.js';
 let products = [
    { product_id: 1, name: "A", price: 300, image: "shirt.jpg" ,stock: 9 ,seller_id: "SLR-1"},
    { product_id: 2, name: "B", price: 500, image: "shoes.jpg" ,stock:3,seller_id: "SLR-1" },
    { product_id: 3, name: "C", price: 300, image: "shirt.jpg" ,stock: 2 ,seller_id: "SLR-2"},
    { product_id: 4, name: "D", price: 500, image: "shoes.jpg" ,stock:3,seller_id: "SLR-2" },
    { product_id: 5, name: "E", price: 300, image: "shirt.jpg" ,stock: 5 ,seller_id: "SLR-3"},
    { product_id: 6, name: "F", price: 500, image: "shoes.jpg" ,stock:3,seller_id: "SLR-3" },
    { product_id: 7, name: "G", price: 300, image: "shirt.jpg" ,stock: 9 ,seller_id: "SLR-4"},
    { product_id: 8, name: "H", price: 500, image: "shoes.jpg" ,stock:3,seller_id: "SLR-4" },
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
        let mycart = JSON.parse(localStorage.getItem("MyCart")) || new Cart(currentUser.id);

        let selectedProduct = storedProducts.find(p => p.product_id === productId);
        if (!selectedProduct) return;

        let findItem = mycart.items.find(i => i.product_id === productId);

        if (findItem) {
            findItem.quantity += 1;
        } else {
            mycart.items.push({
                product_id: selectedProduct.product_id,
                name: selectedProduct.name,
                price: selectedProduct.price,
                image: selectedProduct.image,
                stock: selectedProduct.stock,
                quantity: 1
            });
        }

        localStorage.setItem("MyCart", JSON.stringify(mycart));
        localStorage.setItem("cartUpdated", Date.now());

        console.log(mycart);
    });
}