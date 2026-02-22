
window.addEventListener('load',loadComponents);


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

class WishList{
    userid
    wish_prod=[]

    constructor(){
        this.userid=123;
        this.wish_prod=[1,2,3,4]
    }

add(prod){
    for(let i=0;i<this.wish_prod.length;i++){
        if (this.wish_prod[i]==prod){
            alert('product already on your wishlist!');
            return;
        }
    }
    this.wish_prod.push(prod)
    
}


}


