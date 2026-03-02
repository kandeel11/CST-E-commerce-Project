//import { Cart } from "../Js/Cart.js";
export class Order {
  constructor(orderid,userid, orderStatus, products = [], total) {
    this.orderid = orderid;
    this.userid = userid;
    this.products = products;
    this.orderStatus = orderStatus;
    this.createddate = new Date().toString();
    this.total = total;
  }
  static AddSummaryOrder() {
    //currentuser
    var currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    if (!currentUser) return;
    var userid = currentUser.id;

    var orders = JSON.parse(localStorage.getItem("orders")) || [];
    if (orders.length === 0) return;
    var myorder = orders.find(
      (o) => o.userid == userid && o.orderStatus === "pending",
    );
    if (!myorder || !Array.isArray(myorder.products)) {
      console.warn("No pending order found for user");
      return;
    }
    var products = myorder.products;
    products.forEach((product) => {
      var newrow = document.createElement("tr");
      var producttd = document.createElement("td");
      var quantitytd = document.createElement("td");
      var totaltd = document.createElement("td");
      producttd.innerHTML = `<div class="product-cell"><img src="${product.images[0]}" /><span>${product.name}</span>
          </div>`;
      quantitytd.innerHTML = `${product.quantity}`;
      totaltd.innerHTML = `EGP ${product.quantity * product.price}`;
      var row = document.querySelector("table tbody");
      newrow.appendChild(producttd);
      newrow.appendChild(quantitytd);
      newrow.appendChild(totaltd);
      row.appendChild(newrow);
    });
    var totalorder = document.getElementById("total");
    totalorder.innerHTML = `EGP ${(parseFloat(myorder.total)).toFixed(2)}`;
  }
  static fillform() {
    var currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    if (!currentUser) {
      toast2.show();
    }
    var emailinp = document.querySelector("#email");
    emailinp.value = currentUser.Email;
    var Fnameinp = document.querySelector("#firstName");
    Fnameinp.value = currentUser.Fname;
    var Lnameinp = document.querySelector("#lastName");
    Lnameinp.value = currentUser.Lname;
    var phoneinp = document.querySelector("#phone");
    phoneinp.value = currentUser.Phone;
    var addressinp = document.querySelector("#street");
    addressinp.value = currentUser.address;
  }
  static compelteOrder(){
      var currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
      if (!currentUser) return;
      var userId = currentUser.id;

      var orders = JSON.parse(localStorage.getItem("orders")) || [];
      var pendingOrder = orders.find((o) => o.userid === userId && o.orderStatus === "pending");
      if (!pendingOrder) return;
      pendingOrder.orderStatus = "Processing";

      var toastElement = document.getElementById("myToast33");
      var toastBody = toastElement.querySelector(".toast-body");
      var toast = new bootstrap.Toast(toastElement);

      var allProducts = JSON.parse(localStorage.getItem("products")) || [];
      for (let item of pendingOrder.products) {
        let realProduct = allProducts.find((p) => p.product_id == item.product_id);
        if (!realProduct || realProduct.stock < item.quantity) {
          toastBody.innerText = `Cannot Complete Order, ${item.name} is Out of Stock`;
          toast.show();
          return;
        }
      }
      pendingOrder.products.forEach((item) => {
        let realProduct = allProducts.find((p) => p.product_id == item.product_id);
        if (realProduct) {
          realProduct.stock -= item.quantity;
        }
      });
      localStorage.setItem("products", JSON.stringify(allProducts));
      localStorage.setItem("orders", JSON.stringify(orders));
      var mycart = JSON.parse(sessionStorage.getItem("MyCart"));
      if (mycart && mycart.userid == userId) {
        mycart.items = [];
        sessionStorage.setItem("MyCart", JSON.stringify(mycart));
      }
      var carts = JSON.parse(localStorage.getItem("cart")) || [];
      var userCart = carts.find((c) => c.userid == userId);
      if (userCart) {
        userCart.items = [];
      }
      localStorage.setItem("cart", JSON.stringify(carts));
      var toasttEl = document.getElementById("myToast3");
      var myToast3 = new bootstrap.Toast(toasttEl);
      myToast3.show();
      setTimeout(() => {
        window.location.href = "../Pages/Home.html";
      }, 1500);
     
  }
}
var returntocart = document.querySelector("#returntocart");
if(returntocart){
  returntocart.addEventListener("click", function () {
    window.location.href = "Cart.html";
  });
}
//form validation
var formselected = document.querySelector("form");
if(formselected){
  formselected.addEventListener("submit", function (e) {
    e.preventDefault();
  e.stopPropagation();
    const firstName = document.getElementById("firstName");
    const lastName = document.getElementById("lastName");
    const email = document.getElementById("email");
    const phone = document.getElementById("phone");
    const street = document.getElementById("street");
    const city = document.getElementById("city");
    let nameRegex = /^[A-Za-z]+$/;
    let phoneRegex = /^01[0-9]{9}$/;
    let emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
    let valid = true;
    if (!nameRegex.test(firstName.value.trim())) {
        firstName.classList.add("is-invalid");
        valid = false;
    } else {
        firstName.classList.remove("is-invalid");
    }
    if (!emailRegex.test(email.value.trim())) {
        email.classList.add("is-invalid");
        valid = false;
    } else {
        email.classList.remove("is-invalid");
    }
    if (!nameRegex.test(lastName.value.trim())) {
        lastName.classList.add("is-invalid");
        valid = false;
    } else {
        lastName.classList.remove("is-invalid");
    }
    if (!phoneRegex.test(phone.value.trim())) {
        phone.classList.add("is-invalid");
        valid = false;
    } else {
        phone.classList.remove("is-invalid");
    }
    if (street.value.trim() === "") {
        street.classList.add("is-invalid");
        valid = false;
    } else {
        street.classList.remove("is-invalid");
    }
    if(city.value === ""){ 
      city.classList.add("is-invalid");
      valid = false;
    } else {
      city.classList.remove("is-invalid");
    }

    if (!valid) {
        e.preventDefault();
        e.stopPropagation();
        return;
    }
    Order.compelteOrder();
});}


function loadComponents() {
  // 1. Load Navbar
  fetch('../Pages/NavBar.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('navbar-placeholder').innerHTML = data;

      // Re-run NavBar initialization since the HTML is dynamically loaded
      if (window.initNavBarAuth) window.initNavBarAuth();
      if (window.initSearchAutoSuggest) window.initSearchAutoSuggest();
      if (window.initMobileSearch) window.initMobileSearch();
      if (window.updateCartBadge) window.updateCartBadge();
    })
    .catch(error => console.error('Error loading navbar:', error));

  // 2. Load Footer
  fetch('../Pages/Footer.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('footer-placeholder').innerHTML = data;
    })
    .catch(error => console.error('Error loading footer:', error));
}

window.addEventListener("load", function () {
  loadComponents();
});

