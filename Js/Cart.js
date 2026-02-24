export class Cart {
    constructor(userid) {
        this.userid = userid;
        this.items = [];
        this.createddate = new Date().toString();
    }


    static GetAllCarts() {
        return JSON.parse(localStorage.getItem("cart")) || [];
    }

    static SaveAllCarts(carts) {
        localStorage.setItem("cart", JSON.stringify(carts));
    }

    static GetCurrentUserId() {
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        return currentUser ? currentUser.id : null;
    }

    static createcart(userid) {

        let carts = Cart.GetAllCarts();
        let usercart = carts.find(c => c.userid === userid);

        if (!usercart) {
            usercart = new Cart(userid);
            carts.push(usercart);
            Cart.SaveAllCarts(carts);
        }
        return usercart;
    }

    static GetCurrentUserCart() {
        const userid = Cart.GetCurrentUserId();
        if (!userid) return null;
        return Cart.createcart(userid);
    }


    static UpdateCartAndSave(updatedCart) {
        let carts = Cart.GetAllCarts();
        let index = carts.findIndex(c => c.userid === updatedCart.userid);
        if (index !== -1) {
            carts[index] = updatedCart;
        } else {
            carts.push(updatedCart);
        }
        Cart.SaveAllCarts(carts);
    }


    static GetItem(cart, productId) {
        if (!cart || !cart.items) return null;
        return cart.items.find(item => item.product_id == productId);
    }

    static AddOrUpdateItem(cart, item) {
        if (!cart.items) cart.items = [];
        let existing = cart.items.find(i => i.product_id == item.product_id);
        if (existing) {
            existing.quantity += (item.quantity || 1);
        } else {
            cart.items.push(item);
        }
        Cart.UpdateCartAndSave(cart);
        return cart;
    }

    static RemoveItem(cart, productId) {
        if (!cart || !cart.items) return cart;
        let index = cart.items.findIndex(i => i.product_id == productId);
        if (index !== -1) {
            cart.items.splice(index, 1);
        }
        Cart.UpdateCartAndSave(cart);
        return cart;
    }


    static AddItemstoTable() {
        var row = document.getElementsByTagName("tbody")[0];
        if (!row) return;

        let mycart = Cart.GetCurrentUserCart();
        if (!mycart) return;

        if (mycart.items && mycart.items.length > 0) {
            for (let i = 0; i < mycart.items.length; i++) {
                var newrow = document.createElement("tr");
                var producttd = document.createElement("td");
                var pricetd = document.createElement("td");
                var quantitytd = document.createElement("td");
                var subtotatd = document.createElement("td");
                var daletetd = document.createElement("td");

                producttd.innerHTML = `<span>${mycart.items[i].name}</span>`;
                pricetd.innerHTML = `$${mycart.items[i].price}`;
                pricetd.classList.add("price-col");
                quantitytd.innerHTML = `<div class="qty-controls">
              <button class="minnum" data-productid="${mycart.items[i].product_id}"><i class="bi bi-dash"></i></button>
              <span class="qty">${mycart.items[i].quantity}</span>
              <button class="maxnum" data-productid="${mycart.items[i].product_id}"><i class="bi bi-plus"></i></button>
            </div>`;

                subtotatd.innerHTML = `<span class="spansub">$${mycart.items[i].price * mycart.items[i].quantity}</span>`;
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
            producttd.innerHTML = `<i class="bi bi-cart-x"></i><br>Your cart is empty`;
            producttd.colSpan = "5";
            producttd.classList.add("empty-cart-cell");
            newrow.appendChild(producttd);
            row.appendChild(newrow);
        }
    }

    static MinQuantity() {
        let mycart = Cart.GetCurrentUserCart();
        if (!mycart || !mycart.items || mycart.items.length === 0) return;

        var rows = document.querySelectorAll("tbody tr");
        if (rows.length > 0) {
            rows.forEach((row) => {
                var btnMin = row.querySelector(".minnum");
                if (!btnMin) return;

                var qtySpan = row.querySelector(".qty");
                if (!qtySpan) return;

                btnMin.addEventListener("click", function () {
                    let freshCart = Cart.GetCurrentUserCart();
                    var innerqty = +qtySpan.innerText;
                    if (innerqty > 1) {
                        innerqty--;
                        var productid = btnMin.dataset.productid;
                        var finditem = Cart.GetItem(freshCart, productid);
                        if (finditem) {
                            finditem.quantity = innerqty;
                            Cart.UpdateCartAndSave(freshCart);
                            location.reload();
                        }
                    }
                });
            });
        }
    }

    static MaxQuantity() {
        let mycart = Cart.GetCurrentUserCart();
        if (!mycart || !mycart.items || mycart.items.length === 0) return;

        var rows = document.querySelectorAll("tbody tr");
        if (rows.length > 0) {
            rows.forEach((row) => {
                var btnMax = row.querySelector(".maxnum");
                if (!btnMax) return;

                btnMax.addEventListener("click", function () {
                    var qtySpan = row.querySelector(".qty");
                    if (!qtySpan) return;

                    let freshCart = Cart.GetCurrentUserCart();
                    var innerqty = +qtySpan.innerText;
                    innerqty++;
                    var productid = btnMax.dataset.productid;
                    var finditem = Cart.GetItem(freshCart, productid);
                    if (finditem) {
                        finditem.quantity = innerqty;
                        Cart.UpdateCartAndSave(freshCart);
                        location.reload();
                    }
                });
            });
        }
    }

    static DeteleProductinCart() {
        let mycart = Cart.GetCurrentUserCart();
        if (!mycart || !mycart.items || mycart.items.length === 0) return;

        var rows = document.querySelectorAll("tbody tr");
        if (rows.length > 0) {
            rows.forEach((row) => {
                var deletebtn = row.querySelector(".deletebtn");
                if (!deletebtn) return;

                deletebtn.addEventListener("click", function () {
                    // Re-read from storage
                    let freshCart = Cart.GetCurrentUserCart();
                    var productid = deletebtn.dataset.productid;
                    Cart.RemoveItem(freshCart, productid);
                    location.reload();
                });
            });
        }
    }

    static totalcal() {
        let mycart = Cart.GetCurrentUserCart();
        if (!mycart) return;

        var rows = document.querySelectorAll("tbody tr");
        if (rows.length === 0) return;

        var SumSubtotal = 0;
        for (var i = 0; i < rows.length; i++) {
            var innersubtotal = rows[i].querySelector(".spansub");
            if (innersubtotal) {
                SumSubtotal += parseInt(innersubtotal.innerHTML.replace("$", ""));
            }
        }

        var subtotaldiv = document.getElementById("subtotal");
        var totaldiv = document.getElementById("total");
        if (mycart.items && mycart.items.length > 0) {
            if (subtotaldiv) subtotaldiv.innerText = `$${SumSubtotal}`;
            if (totaldiv) totaldiv.innerText = `$${SumSubtotal}`;
        } else {
            if (subtotaldiv) subtotaldiv.innerText = `$0`;
            if (totaldiv) totaldiv.innerText = `$0`;
        }
    }
}

Cart.AddItemstoTable();
Cart.MinQuantity();
Cart.MaxQuantity();
Cart.DeteleProductinCart();
Cart.totalcal();

window.addEventListener("storage", function (e) {
    if (e.key === "cartUpdated") {
        location.reload();
    }
});

var returnbtn = document.getElementById("returnbtn");
if (returnbtn) {
    returnbtn.addEventListener("click", function () {
        window.location.href = "loginAddtocart.html";
    });
}



