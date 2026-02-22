
/*window.addEventListener('load',loadComponents);*/


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
    wishes_ids=[]

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
but=document.querySelector('#adding');

but.addEventListener('click',addToWishlist) //end of function

user_wish=new WishList();

function addToWishlist(productId){
     const product = allProducts.find(p => p.product_id === productId);
    if (!product) return;
    createProductCard(product);
    p_id=product.product_id;
     const exists = wishlist.some(item => item.product_id === productId);

    if (!exists) {
        wishlist.push({
            product_id: product.product_id,
            name: product.name,
            price: product.price,
            image: product.images[0]
        });
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        showToast(`${product.name} added to wishlist! ♥`);
    } else {
        showToast('Already in wishlist!');
    }
}
    document.getElementById('table_data').innerHTML=createProductCard(product)+document.getElementById('table_data').innerHTML;
    user_wish.wish_prod.push(product);
    user_wish.wishes_ids.push(product.product_id);
//get element by ID
//Push element to user wish list



function createProductCard(product) {
    const mainImg = product.images && product.images.length > 0 ? product.images[0] : '';
    const stockText = getStockText(product.stock);
    //const stockClass = getStockClass(product.stock);
    //const sellerName = getSellerName(product.seller_id);
    const isOutOfStock = product.stock <= 0;

    return `
    <div class="row  flex-column flex-md-row col-6 col-sm-4 col-md-12 justify-content-center align-items-center border border-1 py-1 mx-1 data-id="${product.product_id}">

        <div class="col row" >
        
        <img  class="d-inline-block col-6" src="${mainImg}"  alt="${product.name}" loading="lazy" onerror="this.src='https://via.placeholder.com/400x400?text=No+Image'">
           <p class="d-md-inline-block col-6" >${product.name}</p>
        </div>
     
        
        <div class="col"><p>${product.price.toFixed(2)}</p></div>
       
        <div class="col"><P>
        ${product.stock>0? "Avilable" : "Out of stock!"}
        </P></div>
       
       <div class="col">
        <button class="add-to-cart-btn" onclick="addToCart(${product.product_id})" ${isOutOfStock ? 'disabled' : ''}>
        <i class="fas fa-shopping-cart me-1"></i> ${isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
        </button>
        <i class="fa-solid fa-x d-inline-block"></i>
        </div>
       
    </div>
       
    `;
}

/*
 */

    /*
     <div class="product-card" data-id="${product.product_id}">
            <div class="product-img-wrap">
                <img src="${mainImg}" alt="${product.name}" loading="lazy"
                     onerror="this.src='https://via.placeholder.com/400x400?text=No+Image'">
                <div class="badge-group">
                    ${product.discount ? `<span class="badge-discount">-${product.discount}%</span>` : ''}
                    ${product.organic ? '<span class="badge-organic">Organic</span>' : ''}
                    ${product.stock > 0 && product.stock <= 10 ? '<span class="badge-stock">Low Stock</span>' : ''}
                    ${isOutOfStock ? '<span class="badge-out">Out of Stock</span>' : ''}
                </div>
                <div class="product-actions">
                    <button class="action-btn" title="Quick View" onclick="openQuickView(${product.product_id})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn" title="Add to Cart" onclick="addToCart(${product.product_id})"
                        ${isOutOfStock ? 'disabled' : ''}>
                        <i class="fas fa-shopping-cart"></i>
                    </button>
                    <button class="action-btn" title="Add to Wishlist" onclick="addToWishlist(${product.product_id})">
                        <i class="fas fa-heart"></i>
                    </button>
                </div>
            </div>
            <div class="product-info">
                <span class="product-category">${product.category}</span>
                <h3 class="product-name">${product.name}</h3>
                <div class="product-rating">
                    <span class="stars">${renderStars(product.rating)}</span>
                    <span class="review-count">(${product.reviews ? product.reviews.length : 0})</span>
                </div>

                <!-- Description (visible in list view only via CSS) -->
                <p class="product-description">${product.description}</p>

                <!-- Meta info (list view) -->
                <div class="product-meta">
                    <span class="product-meta-item"><i class="fas fa-weight-hanging"></i>${product.weight}</span>
                    <span class="product-meta-item"><i class="fas fa-tag"></i>${product.brand}</span>
                    <span class="product-meta-item"><i class="fas fa-store"></i>${sellerName}</span>
                </div>

                <div class="product-price-row">
                    <span class="product-price">$${product.price.toFixed(2)}</span>
                    ${product.oldPrice ? `<span class="product-old-price">$${product.oldPrice.toFixed(2)}</span>` : ''}
                </div>
                <div class="product-stock-info ${stockClass}">${stockText}</div>
                <div class="product-seller"><i class="fas fa-store me-1"></i>${sellerName}</div>

                <button class="add-to-cart-btn" onclick="addToCart(${product.product_id})" ${isOutOfStock ? 'disabled' : ''}>
                    <i class="fas fa-shopping-cart me-1"></i> ${isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                </button>
            </div>
        </div>
        */

function getStockText(stock) {
    if (stock <= 0) return 'Out of Stock';
    if (stock <= 10) return `Only ${stock} left!`;
    return `In Stock (${stock})`;
}


