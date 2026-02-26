export class OrderItem{
    #productId;
    #quantity;
    #priceAtPurchase;

    constructor(productID, quantity, priceAtPurchase) {
        this.#productId = productID;
        this.#quantity = quantity;
        this.#priceAtPurchase = priceAtPurchase;
    }

    get ProductId() {
        return this.#productId;
    }

    get Quantity() {
        return this.#quantity;
    }

    get PriceAtPurchase() {
        return this.#priceAtPurchase;
    }
}