var carts = JSON.parse(localStorage.getItem("cart")) || [];
export class Cart {
  constructor(userid) {
    this.userid = userid;
    this.items = [];
    this.createddate = new Date().toString();
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
  static GetCurrentUserCart() {
    let mycart = JSON.parse(localStorage.getItem("MyCart")) || [];
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
       // <img src="${mycart.items[i].image}" width="50px" height="50px" /">
        producttd.innerHTML = `
        <span>${mycart.items[i].name}</span>
        `;
        pricetd.innerHTML = `${mycart.items[i].price}`;
        quantitytd.innerHTML = `<button class="minnum" data-productid="${mycart.items[i].product_id}">-</button>
              <span class="qty"> ${mycart.items[i].quantity} </span>
              <button class="maxnum" data-productid="${mycart.items[i].product_id}">+</button>`;

        subtotatd.innerHTML = `<span class="spansub">${mycart.items[i].price * mycart.items[i].quantity}</span>`;
        subtotatd.classList.add("calcsubtotal");
        daletetd.innerHTML = `<button class="deletebtn" data-productid="${mycart.items[i].product_id}">x</button>`;
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
        btnMin.addEventListener("click", function () {
          var innerqty = +qtySpan.innerText;
          if (innerqty > 1) {
            innerqty--;
            qtySpan.innerText = innerqty;
            var productid = btnMin.dataset.productid;
            var finditem = mycart.items.find((p) => p.product_id == productid);
            finditem.quantity = innerqty;
            localStorage.setItem("MyCart", JSON.stringify(mycart));
            localStorage.setItem("cart", JSON.stringify(carts));
            location.reload();
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
          if (!qtySpan) {
          return;}
            innerqty++;
            qtySpan.innerText = innerqty;
            var productid = btnMax.dataset.productid;
            var finditem = mycart.items.find((p) => p.product_id == productid);
            console.log(finditem);
            finditem.quantity = innerqty;
            localStorage.setItem("MyCart", JSON.stringify(mycart));
            localStorage.setItem("cart", JSON.stringify(carts));
            location.reload();
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
            localStorage.setItem("MyCart", JSON.stringify(mycart));
            localStorage.setItem("cart", JSON.stringify(carts));
            location.reload();
          });
        });
    }
  }
  static totalcal(){
  let mycart = Cart.GetCurrentUserCart();
  var rows = document.querySelectorAll("tbody tr");
  if(rows.length == 0){return;}
  var SumSubtotal=0;
  for(var i =0;i<rows.length;i++){
    var innersubtotal = rows[i].querySelector(".spansub");
    if(innersubtotal){
       SumSubtotal+= parseInt(innersubtotal.innerHTML);
    }
  }
  if(mycart.items.length > 0){
     var subtotaldiv = document.getElementById("subtotal");
   subtotaldiv.innerHTML= SumSubtotal;
   var totaldiv = document.getElementById("total");
   totaldiv.innerText = SumSubtotal;
  }else{
     subtotaldiv.innerHTML = `${0}`;
      totaldiv.innerHTML = `${0}`;
  }
  
  // if (mycart.items.length > 0) {
  //   var subtotaldiv = document.getElementById("subtotal");
  //   var subtotals = document.getElementsByClassName("calcsubtotal");
  //   var totaldiv = document.getElementById("total");
  //   var sum = 0;
  //   for (var j = 0; j < subtotals.length; j++) {
  //     sum += parseInt(subtotals[j].innerText);
  //   }
  //   subtotaldiv.innerHTML = `${sum}`;
  //   totaldiv.innerHTML = `${sum}`;
  // } else {
  //   subtotaldiv.innerHTML = `${0}`;
  //   totaldiv.innerHTML = `${0}`;
  // }
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
var returnbtn = document.getElementById("returnbtn");
if(returnbtn){
  returnbtn.addEventListener("click", function () {
      window.location.href = "loginAddtocart.html";
    });
}
    


