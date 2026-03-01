export class Product {
    constructor({
        name,
        images,
        price,
        oldPrice,
        discount,
        rating,
        brand,
        description,
        category,
        unit,
        weight,
        organic,
        stock,
        seller_id,
        dailySale,
        monthSale,
        reviews
    }) {
        this.product_id = this.generateId();;
        this.name = name;
        this.images = images || [];
        this.price = price;
        this.oldPrice = oldPrice;
        this.discount = discount;
        this.rating = rating;
        this.brand = brand;
        this.description = description;
        this.category = category;
        this.unit = unit;
        this.weight = weight;
        this.organic = organic;
        this.stock = stock || 0;
        this.seller_id = seller_id || null;
        this.dailySale = dailySale || false;
        this.monthSale = monthSale || false;
        this.reviews = reviews || [];
    }

    // Get the main display image (first image)
    get mainImage() {
        return this.images.length > 0 ? this.images[0] : '';
    }

    // Check if product is in stock
    get inStock() {
        return this.stock > 0;
    }

    // Get discounted savings amount
    get savings() {
        return this.oldPrice ? (this.oldPrice - this.price).toFixed(2) : 0;
    }

    // Get average review rating
    get averageRating() {
        if (!this.reviews || this.reviews.length === 0) return 0;
        const total = this.reviews.reduce((sum, r) => sum + r.rating, 0);
        return (total / this.reviews.length).toFixed(1);
    }

    // Decrease stock when purchased
    decreaseStock(quantity = 1) {
        if (this.stock >= quantity) {
            this.stock -= quantity;
            return true;
        } else {

            return false;
        }
    }
    // Add a review
    addReview(user_id, rating, comment) {
        this.reviews.push({ user_id, rating, comment });
    }
    static generateId() {
        let products = JSON.parse(localStorage.getItem("products")) || [];
        if (products.length === 0) {
            return 1;
        } else {
            return products[products.length - 1].product_id + 1;
        }
    }
}

