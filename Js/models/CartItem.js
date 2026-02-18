export class CartItem {
    #productId;
    #quantity;
    //#totalPrice;

    constructor(productId, quantity) {
        this.#productId = productId;
        this.#quantity = quantity;
        //this.#totalPrice = 0;
    }
    
    get ProductId() {
        return this.#productId;
    }

    get Quantity() {
        return this.#quantity;
    }

    /*get TotalPrice() {
        return this.#totalPrice;
    }*/
}