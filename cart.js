let carts = JSON.parse(localStorage.getItem("cart")) || [];

export class Cart {
  constructor(userid) {
    this.userid = userid;
    this.items = [];
    this.createddate = new Date().toString();
  }

  static createcart(userid) {
    let carts = JSON.parse(localStorage.getItem("cart"));
    let usercart = carts.find(p=>p.userid === userid);
    if(!usercart){
      let newcart = new Cart(userid);
      carts.push(newcart);
      localStorage.setItem("cart",JSON.stringify(carts));
      return newcart;
    }else{
      return usercart;
    }
    // if (carts.length > 0) {
    //   for (let cart of carts) {
    //     if (cart.userid === userid) {
    //       var usercart = JSON.parse(localStorage.getItem(cart.userid));
    //       return;
    //     } else {
    //       this.userid = userid;
    //       this.items = [];
    //       this.createddate = new Date().toString();

    //       carts.push(this);
    //       localStorage.setItem("cart", JSON.stringify(carts));
    //       var usercart = JSON.parse(localStorage.getItem(this.carts));
    //     }
    //   }
    // } else {
    //   this.userid = userid;
    //   this.items = [];
    //   this.createddate = new Date().toString();

    //   carts.push(this);
    //   localStorage.setItem("cart", JSON.stringify(carts));
    //   var usercart = JSON.parse(localStorage.getItem(this.carts));
    // }
  }
}
//    login ---create cart fo new user----

// window.addEventListener("storage", function (e) {
//   if (e.key === "cartUpdated") {
//     location.reload();
//   }
// });
// var row = document.getElementsByTagName("tbody")[0];
// //currentuser
// var currentUser = JSON.parse(localStorage.getItem("currentUser"));
// var userid = currentUser.id;
// //currentuser cart
// var cartKey = "cart_" + userid;
// var usercart = JSON.parse(localStorage.getItem(cartKey));

// var item = usercart.items;
// var producttd;
// function addProductsToTable(item) {
//   if (item.length != 0) {
//     for (let i = 0; i < item.length; i++) {
//       var newrow = document.createElement("tr");
//       producttd = document.createElement("td");
//       var pricetd = document.createElement("td");
//       var quantitytd = document.createElement("td");
//       var subtotatd = document.createElement("td");
//       var daletetd = document.createElement("td");

//       producttd.innerHTML = `<img src="${item[i].image}" width="50px" /">
//         <span>${item[i].name}</span>
//         `;
//       pricetd.innerHTML = `${item[i].price}`;
//       quantitytd.innerHTML = `<button class="minnum">-</button>
//               <span class="qty"> ${item[i].quantity} </span>
//               <button class="maxnum">+</button>`;

//               // var outerbtn = quantitytd.querySelector("#outerbtn");
//               // outerbtn.style.padding="5px";
//       subtotatd.innerHTML = `${item[i].price * item[i].quantity}`;
//       subtotatd.classList.add("calcsubtotal");
//       daletetd.innerHTML=`<button class="deletebtn">x</button>`;
//       newrow.appendChild(producttd);
//       newrow.appendChild(pricetd);
//       newrow.appendChild(quantitytd);
//       newrow.appendChild(subtotatd);
//       newrow.appendChild(daletetd);
//       row.appendChild(newrow);
//       var btnMin = quantitytd.querySelector(".minnum");
//       var btnmax = quantitytd.querySelector(".maxnum");

//       btnMin.style.backgroundColor="rgb(236, 236, 236)";
//       btnMin.style.border="none";
//       btnMin.style.borderRadius="50%";
//       btnMin.style.width="25px";
//       btnMin.style.heigth="25px";

//       btnmax.style.backgroundColor="rgb(236, 236, 236)";
//       btnmax.style.border="none";
//       btnmax.style.borderRadius="50%";
//       btnmax.style.width="25px";
//       btnmax.style.heigth="25px";

//       var qtySpan = quantitytd.querySelector(".qty");

//       btnMin.addEventListener("click", function () {

//        if (item[i].quantity > 1) {
//         item[i].quantity--;
//         qtySpan.innerText = item[i].quantity;
//         localStorage.setItem(cartKey, JSON.stringify(usercart));
//         location.reload();
//       }
//     });

//     btnmax.addEventListener("click",function(){
//       item[i].quantity++;
//       qtySpan.innerText = item[i].quantity;
//       localStorage.setItem(cartKey, JSON.stringify(usercart));
//       location.reload();
//     })
//     var deletebtns = daletetd.querySelector(".deletebtn");
//     deletebtns.style.backgroundColor="white";
//     deletebtns.style.border="1px solid #ccc";
//     deletebtns.style.borderRadius="50%";
//     deletebtns.style.width="28px";
//     deletebtns.style.fontSize="18px";

//     deletebtns.addEventListener("click",function(e){
//       item.splice(i,1);
//       localStorage.setItem(cartKey, JSON.stringify(usercart));
//       location.reload();
//     })
//     }
//     } else {
//     var newrow = document.createElement("tr");
//     producttd = document.createElement("td");
//     producttd.innerHTML = "No Products Added";
//     producttd.colSpan = "4";
//     producttd.style.textAlign="center";
//     newrow.appendChild(producttd);
//     row.appendChild(newrow);
//   }

//   if (item.length != 0) {
//     var subtotaldiv = document.getElementById("subtotal");
//     var subtotals = document.getElementsByClassName("calcsubtotal");
//     var totaldiv = document.getElementById("total");
//     var sum = 0;
//     for (var j = 0; j < subtotals.length; j++) {
//       sum += parseInt(subtotals[j].innerText);
//     }
//     subtotaldiv.innerHTML = `${sum}`;
//     totaldiv.innerHTML = `${sum}`;
//   } else {
//     subtotaldiv.innerHTML = `${0}`;
//     totaldiv.innerHTML = `${0}`;
//   }
// }

// addProductsToTable(item);

// var returnbtn = document.getElementById("returnbtn");
// returnbtn.addEventListener("click",function(){
//   window.location.href="product.html";
// })
