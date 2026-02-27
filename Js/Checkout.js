//import { Cart } from "../Js/Cart.js";
export class Order {
  constructor(userid, orderStatus, products = [], total) {
    this.userid = userid;
    this.products = products;
    this.orderStatus = orderStatus;
    this.createddate = new Date().toString();
    this.total = total;
  }
  static AddSummaryOrder() {
    //currentuser
    var currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) return;
    var userid = currentUser.id;

    var orders = JSON.parse(localStorage.getItem("order")) || [];
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
      producttd.innerHTML = `<img src="${product.image}" width="50px" height="50px"<span>${product.name}</span>`;
      quantitytd.innerHTML = `${product.quantity}`;
      totaltd.innerHTML = `${product.quantity * product.price}`;
      var row = document.querySelector("table tbody");
      newrow.appendChild(producttd);
      newrow.appendChild(quantitytd);
      newrow.appendChild(totaltd);
      row.appendChild(newrow);
      newrow.style.backgroundColor = "#f8f9fa";
      newrow.addEventListener("mouseover", function () {
        newrow.style.backgroundColor = "#eceaea";
      });
      newrow.addEventListener("mouseout", function () {
        newrow.style.backgroundColor = "#f8f9fa";
      });
    });
    var totalorder = document.getElementById("total");
    totalorder.innerHTML = `$${myorder.total}`;
  }
  static fillform() {
    var currentUser = JSON.parse(localStorage.getItem("currentUser"));
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
  static btnconfirmform() {
    var btnconfirm = document.querySelector("#btnconfirm");
    if (!btnconfirm) return;

    btnconfirm.addEventListener("click", function (e) {
      e.preventDefault();
      var currentUser = JSON.parse(localStorage.getItem("currentUser"));
      if (!currentUser) return;
      var userId = currentUser.id;

      var orders = JSON.parse(localStorage.getItem("order")) || [];
      var pendingOrder = orders.find(
        (o) => o.userid === userId && o.orderStatus === "pending",
      );

      if (!pendingOrder) return;

      pendingOrder.orderStatus = "Completed";
      localStorage.setItem("order", JSON.stringify(orders));

      var mycart = JSON.parse(localStorage.getItem("MyCart")) || { items: [] };
      mycart.items = [];
      localStorage.setItem("MyCart", JSON.stringify(mycart));

      var carts = JSON.parse(localStorage.getItem("cart")) || [];
      localStorage.setItem("cart", JSON.stringify(carts));
      location.reload();
    });
  }
  static btnconfirmform() {
    var btnconfirm = document.querySelector("#btnconfirm");
    if (!btnconfirm) return;
    btnconfirm.addEventListener("click", function (e) {
      e.preventDefault();

      var currentUser = JSON.parse(localStorage.getItem("currentUser"));
      if (!currentUser) return;
      var userId = currentUser.id;

      var orders = JSON.parse(localStorage.getItem("order")) || [];
      var pendingOrder = orders.find((o) => o.userid === userId && o.orderStatus === "pending");
      if (!pendingOrder) return;
      pendingOrder.orderStatus = "Completed";

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
      localStorage.setItem("order", JSON.stringify(orders));
      var mycart = JSON.parse(localStorage.getItem("MyCart"));
      if (mycart && mycart.userid == userId) {
        mycart.items = [];
        localStorage.setItem("MyCart", JSON.stringify(mycart));
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
        window.location.href = "../loginAddtocart.html";
      }, 1500);
    });
  }
}
(() => {
  "use strict";

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll(".needs-validation");

  // Loop over them and prevent submission
  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add("was-validated");
      },
      false,
    );
  });
})();


function loadComponents() {
  // 1. Load Navbar
  fetch('../Pages/NavBar.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('navbar-placeholder').innerHTML = data;

      // Re-run NavBar initialization since the HTML is dynamically loaded
      if (window.initNavBarAuth) window.initNavBarAuth();
      if (window.initBreadcrumb) window.initBreadcrumb();
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

