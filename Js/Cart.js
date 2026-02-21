window.addEventListener("storage", function (e) {
    if (e.key === "cartUpdated") {
        location.reload();
    }
});
var row = document.getElementsByTagName("tbody")[0];
//currentuser
var currentUser = JSON.parse(localStorage.getItem("currentUser"));
if (!currentUser) {
    alert("Please login first to view your cart.");
    window.location.href = "Login.html";
}
var userid = currentUser ? currentUser.id : "guest";
//currentuser cart
var cartKey = "cart_" + userid;
var usercart = JSON.parse(localStorage.getItem(cartKey)) || { items: [] };

var item = usercart.items || [];
var producttd;
function addProductsToTable(item) {
    if (item.length != 0) {
        for (let i = 0; i < item.length; i++) {
            var newrow = document.createElement("tr");
            producttd = document.createElement("td");
            var pricetd = document.createElement("td");
            var quantitytd = document.createElement("td");
            var subtotatd = document.createElement("td");
            var daletetd = document.createElement("td");

            producttd.innerHTML = `<img src="${item[i].image}" width="50px" /">
        <span>${item[i].name}</span>
        `;
            pricetd.innerHTML = `${item[i].price}`;
            quantitytd.innerHTML = `<button class="minnum">-</button> 
              <span class="qty"> ${item[i].quantity} </span> 
              <button class="maxnum">+</button>`;

            // var outerbtn = quantitytd.querySelector("#outerbtn");
            // outerbtn.style.padding="5px";
            subtotatd.innerHTML = `${(item[i].price * item[i].quantity).toFixed(2)}`;
            subtotatd.classList.add("calcsubtotal");
            daletetd.innerHTML = `<button class="deletebtn">x</button>`;
            newrow.appendChild(producttd);
            newrow.appendChild(pricetd);
            newrow.appendChild(quantitytd);
            newrow.appendChild(subtotatd);
            newrow.appendChild(daletetd);
            row.appendChild(newrow);
            var btnMin = quantitytd.querySelector(".minnum");
            var btnmax = quantitytd.querySelector(".maxnum");

            btnMin.style.backgroundColor = "rgb(236, 236, 236)";
            btnMin.style.border = "none";
            btnMin.style.borderRadius = "50%";
            btnMin.style.width = "25px";
            btnMin.style.heigth = "25px";

            btnmax.style.backgroundColor = "rgb(236, 236, 236)";
            btnmax.style.border = "none";
            btnmax.style.borderRadius = "50%";
            btnmax.style.width = "25px";
            btnmax.style.heigth = "25px";

            var qtySpan = quantitytd.querySelector(".qty");

            btnMin.addEventListener("click", function () {

                if (item[i].quantity > 1) {
                    item[i].quantity--;
                    qtySpan.innerText = item[i].quantity;
                    localStorage.setItem(cartKey, JSON.stringify(usercart));
                    location.reload();
                }
            });

            btnmax.addEventListener("click", function () {
                item[i].quantity++;
                qtySpan.innerText = item[i].quantity;
                localStorage.setItem(cartKey, JSON.stringify(usercart));
                location.reload();
            })
            var deletebtns = daletetd.querySelector(".deletebtn");
            deletebtns.style.backgroundColor = "white";
            deletebtns.style.border = "1px solid #ccc";
            deletebtns.style.borderRadius = "50%";
            deletebtns.style.width = "28px";
            deletebtns.style.fontSize = "18px";

            deletebtns.addEventListener("click", function (e) {
                item.splice(i, 1);
                localStorage.setItem(cartKey, JSON.stringify(usercart));
                location.reload();
            })
        }
    } else {
        var newrow = document.createElement("tr");
        producttd = document.createElement("td");
        producttd.innerHTML = "No Products Added";
        producttd.colSpan = "4";
        producttd.style.textAlign = "center";
        newrow.appendChild(producttd);
        row.appendChild(newrow);
    }

    if (item.length != 0) {
        var subtotaldiv = document.getElementById("subtotal");
        var subtotals = document.getElementsByClassName("calcsubtotal");
        var totaldiv = document.getElementById("total");
        var sum = 0;
        for (var j = 0; j < subtotals.length; j++) {
            sum += parseFloat(subtotals[j].innerText);
        }
        subtotaldiv.innerHTML = `$${sum.toFixed(2)}`;
        totaldiv.innerHTML = `$${sum.toFixed(2)}`;
    } else {
        subtotaldiv.innerHTML = `$0.00`;
        totaldiv.innerHTML = `$0.00`;
    }
}

addProductsToTable(item);

var returnbtn = document.getElementById("returnbtn");
returnbtn.addEventListener("click", function () {
    window.location.href = "Home.html";
})
