import { Order } from "./Checkout.js";
var carts = JSON.parse(localStorage.getItem("cart")) || [];
let mycart = JSON.parse(sessionStorage.getItem("MyCart")) || [];
export class Cart {
  constructor(userid) {
    this.userid = userid;
    this.items = [];
  }
  static createcart(userid) {
    let carts = JSON.parse(localStorage.getItem("cart")) || [];
    let usercart = carts.find((p) => p.userid === userid);
    if (!usercart) {
      let newcart = new Cart(userid);
      carts.push(newcart);
      localStorage.setItem("cart", JSON.stringify(carts));
      return newcart;
    } else {
      return usercart;
    }
  }
  static syncToCart(mycart) {
    if (!mycart || !mycart.userid) return;

    let carts = JSON.parse(localStorage.getItem("cart")) || [];

    let index = carts.findIndex((c) => c.userid === mycart.userid);

    if (index !== -1) {
      carts[index] = mycart;
    } else {
      carts.push(mycart);
    }

    localStorage.setItem("cart", JSON.stringify(carts));
  }
  static GetCurrentUserCart() {
    let mycart = JSON.parse(sessionStorage.getItem("MyCart"));

    if (!mycart || !Array.isArray(mycart.items)) {
      mycart = {
        userid: null,
        items: [],
      };
      sessionStorage.setItem("MyCart", JSON.stringify(mycart));
    }

    return mycart;
  }
  static AddItemstoTable() {
    var row = document.getElementsByTagName("tbody")[0];
    if (!row) {
      return;
    }
    let mycart = Cart.GetCurrentUserCart();
    if (mycart.items && mycart.items.length > 0) {
      for (let i = 0; i < mycart.items.length; i++) {
        var newrow = document.createElement("tr");
        var producttd = document.createElement("td");
        var pricetd = document.createElement("td");
        var quantitytd = document.createElement("td");
        var subtotatd = document.createElement("td");
        var daletetd = document.createElement("td");
        producttd.innerHTML = `
  <div class="product-cell">
    <img src="${mycart.items[i].images[0]}" />
    <span>${mycart.items[i].name}</span>
  </div>
`;
        pricetd.innerHTML = `${mycart.items[i].price}`;
        quantitytd.innerHTML = `<button class="minnum" data-productid="${mycart.items[i].product_id}">-</button>
              <span class="qty"> ${mycart.items[i].quantity} </span>
              <button class="maxnum" data-productid="${mycart.items[i].product_id}">+</button>`;

        subtotatd.innerHTML = `<span class="spansub">${(mycart.items[i].price * mycart.items[i].quantity).toFixed(2)}</span>`;
        subtotatd.classList.add("calcsubtotal");
        daletetd.innerHTML = `<button class="deletebtn" data-productid="${mycart.items[i].product_id}"><i class="bi bi-trash3"></i></button>`;

        newrow.appendChild(producttd);
        newrow.appendChild(pricetd);
        newrow.appendChild(quantitytd);
        newrow.appendChild(subtotatd);
        newrow.appendChild(daletetd);
        row.appendChild(newrow);
      }
    } else {
      var newrow = document.createElement("tr");
      var producttd = document.createElement("td");
      producttd.innerHTML = "No Products Added";
      producttd.colSpan = "5";
      producttd.style.textAlign = "center";
      newrow.appendChild(producttd);
      row.appendChild(newrow);
    }
  }
  static MinQuantity() {
    var mycart = Cart.GetCurrentUserCart();
    if (mycart.items.length == 0) {
      return;
    }
    var rows = document.querySelectorAll("tbody tr");
    if (rows.length > 0) {
      rows.forEach((row, index) => {
        var btnMin = row.querySelector(".minnum");
        if (!btnMin) {
          return;
        }
        btnMin.style.backgroundColor = "rgb(236, 236, 236)";
        btnMin.style.border = "none";
        btnMin.style.borderRadius = "50%";
        btnMin.style.width = "25px";
        btnMin.style.height = "25px";

        var qtySpan = row.querySelector(".qty");

        if (!qtySpan) {
          return;
        }
        var toastEl = document.getElementById("myToast");
        var toast = new bootstrap.Toast(toastEl);

        btnMin.addEventListener("click", function () {
          var innerqty = +qtySpan.innerText;
          if (innerqty > 1) {
            innerqty--;
            qtySpan.innerText = innerqty;
            var productid = btnMin.dataset.productid;
            var finditem = mycart.items.find((p) => p.product_id == productid);
            finditem.quantity = innerqty;
            let carts = JSON.parse(localStorage.getItem("cart")) || [];
            let cart = carts.find((c) => c.userid === mycart.userid);
            if (cart) {
              cart.items = mycart.items;
            }
            console.log(cart);
            carts = carts.map((c) => (c.userid === mycart.userid ? cart : c));
            sessionStorage.setItem("MyCart", JSON.stringify(mycart));
            localStorage.setItem("cart", JSON.stringify(carts));
            location.reload();
          } else {
            var toastEl = document.getElementById("myToastt");
            var toast = new bootstrap.Toast(toastEl);
            toast.show();
          }
        });
      });
    }
  }
  static MaxQuantity() {
    var mycart = Cart.GetCurrentUserCart();
    if (mycart.items.length == 0) {
      return;
    }
    var rows = document.querySelectorAll("tbody tr");
    if (rows.length > 0) {
      rows.forEach((row) => {
        var btnMax = row.querySelector(".maxnum");
        if (!btnMax) {
          return;
        }
        btnMax.style.backgroundColor = "rgb(236, 236, 236)";
        btnMax.style.border = "none";
        btnMax.style.borderRadius = "50%";
        btnMax.style.width = "25px";
        btnMax.style.height = "25px";

        btnMax.addEventListener("click", function () {
          var qtySpan = row.querySelector(".qty");
          var innerqty = +qtySpan.innerText;
          var productid = btnMax.dataset.productid;
          var finditem = mycart.items.find((p) => p.product_id == productid);
          if (!qtySpan) {
            return;
          }
          var toasttEl = document.getElementById("myToast");
          var toastt = new bootstrap.Toast(toasttEl);
          if (finditem.stock == finditem.quantity) {
            toastt.show();
          } else {
            innerqty++;
            qtySpan.innerText = innerqty;
            console.log(finditem);
            finditem.quantity = innerqty;
            let carts = JSON.parse(localStorage.getItem("cart")) || [];
            let cart = carts.find((c) => c.userid === mycart.userid);
            if (cart) {
              cart.items = mycart.items;
            }
            console.log(cart);
            carts = carts.map((c) => (c.userid === mycart.userid ? cart : c));
            sessionStorage.setItem("MyCart", JSON.stringify(mycart));
            localStorage.setItem("cart", JSON.stringify(carts));
            location.reload();
          }
        });
      });
    }
  }
  static DeteleProductinCart() {
    var mycart = Cart.GetCurrentUserCart();
    if (mycart.items.length == 0) {
      return;
    }
    var rows = document.querySelectorAll("tbody tr");
    if (rows.length > 0) {
      rows.forEach((row) => {
        var deletebtn = row.querySelector(".deletebtn");
        if (!deletebtn) {
          return;
        }
        deletebtn.addEventListener("mouseover", function () {
          deletebtn.style.color = "gray";
        });

        deletebtn.addEventListener("mouseout", function () {
          deletebtn.style.color = "lightgray";
        });
        deletebtn.style.backgroundColor = "white";
        deletebtn.style.color = "lightgray";
        deletebtn.style.fontSize = "22px";
        deletebtn.style.border = "none";

        //deletebtn.style.borderRadius = "50%";
        // deletebtn.style.width = "28px";
        //  deletebtn.style.fontSize = "18px";

        deletebtn.addEventListener("click", function (e) {
          var productid = deletebtn.dataset.productid;
          var finditem = mycart.items.findIndex(
            (p) => p.product_id == productid,
          );
          mycart.items.splice(finditem, 1);
          sessionStorage.setItem("MyCart", JSON.stringify(mycart));
          var userCart = carts.find((c) => c.userid === mycart.userid);
          if (userCart) {
            userCart.items = mycart.items;
            localStorage.setItem("cart", JSON.stringify(carts));
          }
          location.reload();
        });
      });
    }
  }
  static totalcal() {
    let mycart = Cart.GetCurrentUserCart();
    var rows = document.querySelectorAll("tbody tr");
    if (rows.length == 0) {
      return;
    }
    var SumSubtotal = 0;
    for (var i = 0; i < rows.length; i++) {
      var innersubtotal = rows[i].querySelector(".spansub");
      if (innersubtotal) {
        SumSubtotal += parseFloat(innersubtotal.innerHTML);
      }
    }
    if (mycart.items.length > 0) {
      var subtotaldiv = document.querySelector("#subtotal");
      subtotaldiv.innerHTML = `EGP ${SumSubtotal.toFixed(2)}`;
      var totaldiv = document.getElementById("total");
      totaldiv.innerText = `EGP ${SumSubtotal.toFixed(2)}`;
    } else {
      var subtotaldiv = document.getElementById("subtotal");
      subtotaldiv.innerHTML = `${0}`;
      var totaldiv = document.getElementById("total");
      totaldiv.innerHTML = `${0}`;
    }
  }
}
Cart.AddItemstoTable();
Cart.MinQuantity();
Cart.MaxQuantity();
Cart.DeteleProductinCart();
Cart.totalcal();
//reload page after any change in local storage
window.addEventListener("storage", function (e) {
  if (e.key === "cartUpdated") {
    location.reload();
  }
});
//button return to shop
var returnbtn = document.getElementById("btntocheckout");
if (returnbtn) {
  returnbtn.addEventListener("click", function () {
    window.location.href = "Home.html";
  });
}
//button procced to checkout

var orders = JSON.parse(localStorage.getItem("orders")) || [];
var btntocheckout = document.getElementById("btnch");
console.log(btntocheckout);
btntocheckout.addEventListener("click", function () {
  var toasttEl = document.getElementById("myToast2");
  var toast2 = new bootstrap.Toast(toasttEl);
  var currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
  if (!currentUser) {
    toast2.show();
    return;
  }
  var userId = currentUser.id;
  var toasttEl = document.getElementById("myToastemptycart");
  var toasttt = new bootstrap.Toast(toasttEl);
  var mycart = Cart.GetCurrentUserCart();
  if (!mycart || !mycart.items || mycart.items.length === 0) {
    toasttt.show();
    return;
  }
  var orders = JSON.parse(localStorage.getItem("orders")) || [];

  var pendingOrder = orders.find(
    (o) => o.userid === userId && o.orderStatus === "pending",
  );
  var mycart = Cart.GetCurrentUserCart();
  var items = mycart.items;
  var total = 0;

  items.forEach((item) => {
    total += item.quantity * item.price;
  });
  var orders = JSON.parse(localStorage.getItem("orders")) || [];
  var orderid;

  if (orders.length === 0) {
    orderid = 1;
  } else {
    orderid = orders[orders.length - 1].orderid + 1;
  }
  var pendingOrder = orders.find(
    (o) => o.userid === userId && o.orderStatus === "pending",
  );

  if (pendingOrder) {
    pendingOrder.products = [...items];
    pendingOrder.total = total;
  } else {
    var order = new Order(orderid, userId, "pending", [...items], total);
    orders.push(order);
  }

  localStorage.setItem("orders", JSON.stringify(orders));
  window.location.href = "checkout.html";
});

function loadComponents() {
  // 1. Load Navbar
  fetch("../Pages/NavBar.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("navbar-placeholder").innerHTML = data;

      // Re-run NavBar initialization since the HTML is dynamically loaded
      if (window.initNavBarAuth) window.initNavBarAuth();
      if (window.initSearchAutoSuggest) window.initSearchAutoSuggest();
      if (window.initMobileSearch) window.initMobileSearch();
      if (window.updateCartBadge) window.updateCartBadge();
    })
    .catch((error) => console.error("Error loading navbar:", error));

  // 2. Load Footer
  fetch("../Pages/Footer.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("footer-placeholder").innerHTML = data;
    })
    .catch((error) => console.error("Error loading footer:", error));
}
window.addEventListener("load", function () {
  loadComponents();
});
