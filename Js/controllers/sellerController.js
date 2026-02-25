import { addProductToStorage, loadProductsForSeller } from "../services/storageService.js";
import { Product } from "../models/Product.js";

function getUserInfo(){
    let user = JSON.parse(sessionStorage.getItem("pageUser"));
    return user;
}

window.addEventListener('load', function(){
    //temp
    document.getElementById("addImageBtn").addEventListener("click", function () {

        const container = document.getElementById("imagesContainer");
        const newRow = document.createElement("div");
        newRow.className = "row g-2 mb-2 image-row";

        newRow.innerHTML = `
            <div class="col-md-6">
            <input type="url"
                    class="form-control product-image-url"
                    placeholder="Paste Image URL (https://…)" />
            </div>

            <div class="col-md-5">
            <input type="file"
                    class="form-control product-image-file"
                    accept="image/*" />
            </div>

            <div class="col-md-1 d-flex align-items-center">
            <button type="button"
                    class="btn btn-outline-danger btn-sm remove-image-btn">
                <i class="fas fa-times"></i>
            </button>
            </div>
        `;

        container.appendChild(newRow);
    });

    // Remove image row
    document.addEventListener("click", function (e) {
    if (e.target.closest(".remove-image-btn")) {
        e.target.closest(".image-row").remove();
    }
    });
    //temp


    const sections   = ["products", "orders", "analytics"];
    const headerTitles = { products: "Products", orders: "Orders", analytics: "Analytics" };

    function switchSection(target) {
        sections.forEach(s => {
        document.getElementById(`section-${s}`).classList.toggle("d-none", s !== target);
        });

        document.querySelectorAll(".sidebar-btn, .mobile-nav-btn").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.section === target);
        });

        document.getElementById("pageHeaderTitle").textContent = headerTitles[target] || "Dashboard";
    }

    document.querySelectorAll(".sidebar-btn, .mobile-nav-btn").forEach(btn => {
        btn.addEventListener("click", () => switchSection(btn.dataset.section));
    });
    
    ////////OLD
    //let user = getUserInfo();
    let user = {storeName:"A5dar", name:"Mohamed Khalifa", userID:"123"};
    this.sessionStorage.setItem('pageUser', JSON.stringify(user));
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
        //document.getElementById("productImageUrl").value = "";
        document.getElementById("productDescription").value = "";

        let modal = bootstrap.Modal.getOrCreateInstance(document.getElementById("productModal"));
        modal.show();
    });

    this.document.getElementById("productForm").addEventListener("submit", function(event){
        event.preventDefault();

        /*
        let product = new Product(
            document.getElementById("productName").value,
            document.getElementById("productDescription").value,
            parseFloat(document.getElementById("productPrice").value),
            user.userID,
            document.getElementById("productImageUrl").value,
            parseInt(document.getElementById("productStock").value)
        );
        */
        let product = {
            brand : user.storeName,
            name : document.getElementById("productName").value,
            description : document.getElementById("productDescription").value,
            price : parseFloat(document.getElementById("productPrice").value),
            seller_id : user.userID,
            stock : parseInt(document.getElementById("productStock").value),
            category: "Fruits",
            //_-_-_-_-_-_-_-
            dailySale: true,
            discount: 'no_val',
            images: ["https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400"],
            monthSale: 'no_val',
            oldPrice: 'no_val',
            organic: 'no_val',
            product_id:1,
            rating:'no_val',
            reviews:'no_val',
            unit:"no_val",
            weight:"1 kg"
        }
        addProductToStorage(product);

        let modal = bootstrap.Modal.getOrCreateInstance(document.getElementById("productModal"));
        modal.hide();

        loadProductsForSeller(user.userID);
    });
});