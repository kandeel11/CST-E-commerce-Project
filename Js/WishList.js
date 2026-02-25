window.addEventListener('load', function () {

    loadComponents();

    //Assiging event listeners
    loadProducts();
});

function loadComponents() {
    // 1. Load Navbar
    fetch('../Pages/NavBar.html')
        .then(response => response.text())
        .then(data => {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = data;

            // Remove script tags from injected HTML to prevent duplicate execution attempts
            const scripts = tempDiv.querySelectorAll('script');
            scripts.forEach(script => script.remove());

            document.getElementById('navbar-placeholder').innerHTML = tempDiv.innerHTML;

            // Re-run NavBar initialization since the HTML is dynamically loaded
            setTimeout(() => {
                if (window.initNavBarAuth) window.initNavBarAuth();
                if (window.initBreadcrumb) window.initBreadcrumb();
                if (window.updateCartBadge) window.updateCartBadge();
            }, 50);
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

class WishList {
    userid
    wish_prod = []
    wishes_ids = []

    constructor(x) {
        this.userid = x;

    }

    addToWishlist(productId) {
        const product = allProducts.find(p => p.product_id === productId);
        if (!product) return;


        //  p_id=product.product_id;
        const exists = this.wish_prod.some(item => item.product_id === productId);

        const imageSrc = product.images && product.images.length > 0 ? product.images[0] : (product.image || product.img || '');
        if (!exists) {
            this.wish_prod.push({
                product_id: product.product_id,
                name: product.name,
                price: product.price,
                image: imageSrc
            });
            createProductCard(product);
            document.getElementById('table_data').innerHTML = createProductCard(product) + document.getElementById('table_data').innerHTML;
            // localStorage.setItem('wishlist', JSON.stringify(this.wish_prod));



            //alert(`${product.name} added to wishlist! ♥`);
        } else {
            alert('Already in wishlist!');
        }
    }

    delete(productId) {
        const product = this.wish_prod.find(p => p.product_id === productId);
        if (!product) return;
        let index = this.wish_prod.indexOf(product);
        this.wish_prod.splice(index, 1); //removing from data
        if (document.querySelectorAll((`[data-id="${productId}"]`))[0]) { //removing from layout
            document.querySelectorAll((`[data-id="${productId}"]`))[0].remove();
        }

        // Sync with localStorage
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser) {
            const wishlistKey = 'wishlist';
            let allWishlistItems = JSON.parse(localStorage.getItem(wishlistKey)) || [];

            // Find this user's wishlist entry
            let userWishlist = allWishlistItems.find(item => item.user_id === currentUser.id);
            if (userWishlist) {
                if (!userWishlist.product_ids) {
                    userWishlist.product_ids = userWishlist.product_id ? [userWishlist.product_id] : [];
                }

                // Remove the product_id from the product_ids array
                userWishlist.product_ids = userWishlist.product_ids.filter(id => id !== productId);

                // Save updated structure
                localStorage.setItem(wishlistKey, JSON.stringify(allWishlistItems));

                // Check if user still has items in their wishlist to show empty state
                if (userWishlist.product_ids.length === 0) {
                    document.getElementById('table_data').innerHTML = '<div class="text-center py-5 text-muted">Your wishlist is currently empty. Start <a href="Home.html" class="text-success text-decoration-none">shopping</a> to add products!</div>';
                }
            }
        }
    }


}
but = document.querySelector('#adding');


user_wish = new WishList();

function createProductCard(product) {
    const mainImg = product.images && product.images.length > 0 ? product.images[0] : (product.image || product.img || '');
    const isOutOfStock = product.stock <= 0;
    const stockStatus = isOutOfStock ?
        '<span class="badge stock-out-of-stock">Out of Stock</span>' :
        '<span class="badge stock-in-stock">In Stock</span>';

    const btnClass = isOutOfStock ? 'btn btn-light  text-muted px-4 py-2 fw-semibold' : 'btn btn-success  px-1 py-1 fw-semibold';

    // Parse oldPrice out if exists or mockup has some crossed out price
    const priceHtml = product.oldPrice ?
        `<span class="fw-bold fs-6 text-dark">EGP ${product.price.toFixed(2)}</span> <span class="text-decoration-line-through text-muted ms-1" style="font-size: 0.9em;">EGP ${product.oldPrice.toFixed(2)}</span>` :
        `<span class="fw-bold fs-6 text-dark">EGP ${product.price.toFixed(2)}</span>`;

    // Adding add to cart using the product id feature per user request
    return `
    <div class="row m-0 py-3 align-items-center wishlist-item position-relative border-bottom text-start" data-id="${product.product_id}">
        <div class="col-5 d-flex align-items-center gap-3 ps-4">
            <img src="${mainImg}" alt="${product.name}" style="width: 70px; height: 70px; object-fit: contain;">
            <span class="product-name fw-medium" style="color: #4d4d4d;">${product.name}</span>
        </div>
        
        <div class="col-2">
            ${priceHtml}
        </div>
        
        <div class="col-3">
            ${stockStatus}
        </div>
        
        <div class="col-2 d-flex justify-content-end align-items-center gap-3 pe-4">
            <button class="${btnClass}" onclick="window.addToCartData(event, ${product.product_id}, '${encodeURIComponent(product.name).replace(/'/g, "%27")}', ${product.price}, '${mainImg}')" ${isOutOfStock ? 'disabled' : ''}>
                 Add to Cart
            </button>
            <button class="remove-btn" type="button" onclick="user_wish.delete(${product.product_id})" aria-label="Close">
                <i class="fa-solid fa-xmark"></i>
            </button>
        </div>
    </div>
    `;
}


function getStockText(stock) {
    if (stock <= 0) return 'Out of Stock';
    if (stock <= 10) return `Only ${stock} left!`;
    return `In Stock (${stock})`;
}

del_buttons = document.querySelectorAll('.canceling');





let allProducts = [];

function loadProducts() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    // If not logged in, just show empty state or prompt login
    if (!currentUser) {
        document.getElementById('table_data').innerHTML = `
            <div class="text-center py-5 text-muted w-100 fs-5 border-bottom border-top mt-3" style="background: #fafafa;">
                Please <a href="Login.html" class="text-success text-decoration-none fw-semibold">login</a> to view your wishlist.
            </div>`;
        return;
    }

    fetch('../Data/ecobazar.json')
        .then(response => response.json())
        .then(data => {
            // Flatten all categories into a single array
            for (const category in data) {
                if (Array.isArray(data[category]) && category !== 'Sellers') {
                    allProducts = allProducts.concat(data[category]);
                }
            }

            const wishlistKey = 'wishlist';
            const allWishlistItems = JSON.parse(localStorage.getItem(wishlistKey)) || [];

            // Filter wishlist items for current user and extract product IDs
            const userWishlistEntry = allWishlistItems.find(item => item.user_id === currentUser.id);

            // Defensively handle old schema structures where product_ids doesn't exist yet
            let userWishlistProductIds = [];
            if (userWishlistEntry) {
                if (userWishlistEntry.product_ids) {
                    userWishlistProductIds = userWishlistEntry.product_ids;
                } else if (userWishlistEntry.product_id) {
                    // Fallback for older single-item formats
                    userWishlistProductIds = [userWishlistEntry.product_id];
                }
            }

            if (!userWishlistProductIds || userWishlistProductIds.length === 0) {
                document.getElementById('table_data').innerHTML = `
                    <div class="text-center py-5 text-muted w-100 fs-5 border-bottom border-top mt-3" style="background: #fafafa;">
                        Your wishlist is currently empty. Start <a href="Home.html" class="text-success text-decoration-none fw-semibold">shopping</a> to add products!
                    </div>`;
                return;
            }

            // Loop and add to our local class to render the DOM
            userWishlistProductIds.forEach(id => {
                user_wish.addToWishlist(id);
            });
        })
        .catch(err => {
            console.error('Error loading wishlist data:', err);
            document.getElementById('table_data').innerHTML = `
                <div class="text-center py-5 text-muted w-100 fs-5 border-bottom border-top mt-3">
                    Failed to load wishlist.
                </div>`;
        });
}