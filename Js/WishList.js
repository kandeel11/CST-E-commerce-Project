window.addEventListener('load',function(){

    loadComponents();

    //Assiging event listeners
    allProducts=[ {
            "product_id": 36,
            "name": "Organic Lemons",
            "images": [
                "https://images.unsplash.com/photo-1590502593747-42a996133562?w=400",
                "https://images.unsplash.com/photo-1557800636-894a64c1696f?w=400",
                "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400",
                "https://images.unsplash.com/photo-1587486913049-53fc88980cfc?w=400"
            ],
            "price": 2.49,
            "oldPrice": 3.49,
            "discount": 29,
            "rating": 4,
            "brand": "Nature's Best",
            "description": "Bright, zesty organic lemons perfect for cooking, baking, drinks, and dressings. Bursting with vitamin C.",
            "category": "Fruits",
            "unit": "Pack of 6",
            "weight": "600g",
            "organic": true,
            "stock": 120,
            "seller_id": "SLR-1",
            "dailySale": false,
            "monthSale": false,
            "reviews": [
                { "user_id": 106, "rating": 5, "comment": "Juicy and aromatic. Perfect for homemade lemonade!" },
                { "user_id": 107, "rating": 4, "comment": "Always fresh and zesty. A kitchen essential." },
                { "user_id": 108, "rating": 4, "comment": "Great for cooking and baking. Consistent quality." }
            ]
        },
        {
            "product_id": 37,
            "name": "Fresh Pineapple",
            "images": [
                "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=400",
                "https://images.unsplash.com/photo-1589820296156-2454bb8a6ad1?w=400",
                "https://images.unsplash.com/photo-1490885578174-acda8905c2c6?w=400",
                "https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=400"
            ],
            "price": 3.99,
            "oldPrice": 5.49,
            "discount": 27,
            "rating": 5,
            "brand": "Tropical Bliss",
            "description": "Sweet and tangy golden pineapple, hand-selected for peak ripeness. Enjoy fresh, grilled, or in tropical smoothies.",
            "category": "Fruits",
            "unit": "Whole",
            "weight": "1.2 kg",
            "organic": false,
            "stock": 35,
            "seller_id": "SLR-5",
            "dailySale": false,
            "monthSale": true,
            "reviews": [
                { "user_id": 109, "rating": 5, "comment": "Perfectly ripe and so sweet! Great tropical flavor." },
                { "user_id": 110, "rating": 5, "comment": "Love grilling pineapple slices. This one was perfect." },
                { "user_id": 111, "rating": 4, "comment": "Juicy and delicious. Makes great piña coladas!" }
            ]
        },
        {
            "product_id": 38,
            "name": "Organic Red Apples",
            "images": [
                "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400",
                "https://images.unsplash.com/photo-1584306670957-acf935f5033c?w=400",
                "https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?w=400",
                "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400"
            ],
            "price": 3.29,
            "oldPrice": 4.49,
            "discount": 27,
            "rating": 5,
            "brand": "Nature's Best",
            "description": "Crisp, sweet organic Fuji apples. Perfect for snacking, salads, baking, and juicing.",
            "category": "Fruits",
            "unit": "Bag of 6",
            "weight": "1 kg",
            "organic": true,
            "stock": 100,
            "seller_id": "SLR-1",
            "dailySale": true,
            "monthSale": false,
            "reviews": [
                { "user_id": 112, "rating": 5, "comment": "Crisp and sweet every time. My favorite snack apple!" },
                { "user_id": 113, "rating": 5, "comment": "These are perfect for my kids' lunchboxes." },
                { "user_id": 114, "rating": 4, "comment": "Great for apple pie. Always fresh and crunchy." }
            ]
        }]


loadProducts();
 


})

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

    constructor(x){
        this.userid=x;
       
    }

/*add(productId){
    const product = allProducts.find(p => p.product_id === productId);
    if (!product) return;

    for(let i=0;i<this.wish_prod.length;i++){
        if (this.wish_prod[i]==product){
            alert('product already on your wishlist!');
            return;
        }
    }
    this.wish_prod.push(product);
    
}*/

 addToWishlist(productId){
     const product = allProducts.find(p => p.product_id === productId);
    if (!product) return;
   

  //  p_id=product.product_id;
     const exists = this.wish_prod.some(item => item.product_id === productId);

    if (!exists) {
       this.wish_prod.push({
            product_id: product.product_id,
            name: product.name,
            price: product.price,
            image: product.images[0]
        });
         createProductCard(product);
    document.getElementById('table_data').innerHTML=createProductCard(product)+document.getElementById('table_data').innerHTML;
       // localStorage.setItem('wishlist', JSON.stringify(this.wish_prod));
      


        //alert(`${product.name} added to wishlist! ♥`);
    } else {
        alert('Already in wishlist!');
    }
}

delete(productId){
    const product = this.wish_prod.find(p => p.product_id === productId);
    if (!product) return;
    let index=this.wish_prod.indexOf(product);
    this.wish_prod.splice(index, 1); //removing from data
    //let deleted_item=document.querySelectorAll((`[data-id="${productId}"]`))[0]
if(document.querySelectorAll((`[data-id="${productId}"]`))[0]){ //removing from layout
document.querySelectorAll((`[data-id="${productId}"]`))[0].remove();}


}


}
but=document.querySelector('#adding');


user_wish=new WishList();



    //user_wish.wish_prod.push(product);
    //user_wish.wishes_ids.push(product.product_id);
//get element by ID
//Push element to user wish list



function createProductCard(product) {
    const mainImg = product.images && product.images.length > 0 ? product.images[0] : '';
    const stockText = getStockText(product.stock);
    //const stockClass = getStockClass(product.stock);
    //const sellerName = getSellerName(product.seller_id);
    const isOutOfStock = product.stock <= 0;

    return `
    <div class="row  flex-column flex-md-row col-12 col-sm-4 col-md-12 justify-content-center align-items-center border border-1 py-1 mx-1" data-id="${product.product_id}">

        <div class="col row" >
        
        <img  class="d-inline-block col-6" src="${mainImg}"  alt="${product.name}" style="width: 120px; height: 120px;" loading="lazy" onerror="this.src='https://via.placeholder.com/400x400?text=No+Image'">
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
        <button class="canceling" onclick="delett(event)">
        <i class="fa-solid fa-x d-inline-block "></i>
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

del_buttons=document.querySelectorAll('.canceling');



 function delett(event){
    console.log(event)
    console.log(event.target)
    console.log(event.target.parentElement.parentElement.dataset.id)
     console.log(user_wish)

user_wish.delete(Number(event.target.parentElement.parentElement.dataset.id));
//user_wish.delete(38);

 }

 function loadProducts(){
 
        user_wish.addToWishlist(36)
        user_wish.addToWishlist(37)
        user_wish.addToWishlist(38)
    }