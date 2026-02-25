//import { Cart } from "../Js/Cart.js";
export class Order{
  constructor(userid , orderStatus ,products = []){
    this.userid = userid;
    this.products = products;
    this.orderStatus = orderStatus;
    this.createddate = new Date().toString();
  }
  static AddSummaryOrder(){
     
//currentuser
var currentUser = JSON.parse(localStorage.getItem("currentUser"));
var userid = currentUser.id;

var orders = JSON.parse(localStorage.getItem("order"));
for(var i=0;i<orders.length;i++){
  if(userid == orders[i].userid && orders[i].orderStatus=="pending"){
    var myorder = orders[i];
    break;
  }
}
var products = myorder.products;
var sumtotal = 0;
products.forEach(product=>{
  var newrow = document.createElement("tr");
  var producttd = document.createElement("td");
  var quantitytd = document.createElement("td");
  var totaltd = document.createElement("td");
  producttd.innerHTML=`<img src="${product.image}" width="50px" height="50px"<span>${product.name}</span>`;
  quantitytd.innerHTML=`${product.quantity}`;
  totaltd.innerHTML=`${product.quantity * product.price}`;
  sumtotal += parseInt(totaltd.innerText);
  var row = document.querySelector("table tbody");
  newrow.appendChild(producttd);
  newrow.appendChild(quantitytd);
  newrow.appendChild(totaltd);
  row.appendChild(newrow);
  newrow.style.backgroundColor="#f8f9fa";
  newrow.addEventListener("mouseover",function(){
    newrow.style.backgroundColor="#eceaea";
  })
   newrow.addEventListener("mouseout",function(){
    newrow.style.backgroundColor="#f8f9fa";
  })
})
var totalorder = document.getElementById("total");
totalorder.innerHTML= `$${sumtotal}`;
  }
  static fillform(){
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
        var pendingOrder = orders.find(o => o.userid === userId && o.orderStatus === "pending");

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

    btnconfirm.addEventListener("click", function () {

        var orders = JSON.parse(localStorage.getItem("order")) || [];
        var pendingOrder = orders.find(o => o.userid === userId && o.orderStatus === "pending");

        if (!pendingOrder) return;

        pendingOrder.orderStatus = "Completed";
        localStorage.setItem("order", JSON.stringify(orders));

        var mycart = JSON.parse(localStorage.getItem("MyCart"));
        mycart.items = [];
        localStorage.setItem("MyCart", JSON.stringify(mycart));
        localStorage.setItem("cart", JSON.stringify(carts));
        location.reload();
 // window.location.href="loginAddtocart.html";

    });
}
}
(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()