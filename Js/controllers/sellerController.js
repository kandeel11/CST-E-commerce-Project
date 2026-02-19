import { addProductToStorage, loadProductsForSeller } from "../services/storageService.js";
import { Product } from "../models/Product.js";

function getUserInfo(){
    let user = JSON.parse(sessionStorage.getItem("pageUser"));
    return user;
}

window.addEventListener('load', function(){
    let user = getUserInfo();
    this.document.getElementById("storeName").textContent = user.storeName;
    this.document.getElementById("sellerName").textContent = user.name;
    loadProductsForSeller(user.userID);

    this.document.getElementById("logoutBtn").addEventListener("click", function(){
        sessionStorage.removeItem("pageUser");
        window.location.href = "../Pages/Login.html";
    });

    this.document.getElementById("openAddProductModalBtn").addEventListener("click", function(){
        document.getElementById("productName").value = "";
        document.getElementById("productPrice").value = "";
        document.getElementById("productStock").value = "";
        document.getElementById("productImageUrl").value = "";
        document.getElementById("productDescription").value = "";

        let modal = bootstrap.Modal.getOrCreateInstance(document.getElementById("productModal"));
        modal.show();
    });

    this.document.getElementById("productForm").addEventListener("submit", function(event){
        event.preventDefault();

        let product = new Product(
            document.getElementById("productName").value,
            document.getElementById("productDescription").value,
            parseFloat(document.getElementById("productPrice").value),
            user.userID,
            document.getElementById("productImageUrl").value,
            parseInt(document.getElementById("productStock").value)
        );

        addProductToStorage(product);

        let modal = bootstrap.Modal.getOrCreateInstance(document.getElementById("productModal"));
        modal.hide();

        loadProductsForSeller(user.userID);
    });
});