import { generateID } from "../utils.js";

export class Cart {
    #cartID;
    #customerID;
    #cartItems; // array of product ids

    constructor(customerID) {
        this.#cartID = generateID("CART");
        this.#customerID = customerID;
        this.#cartItems = [];
    }

    addCartItem(cartItem) {
        this.#cartItems.push(cartItem);
    }

    get CartID() {
        return this.#cartID;
    }

    get CustomerID() {
        return this.#customerID;
    }

    get CartItems() {
        return [...this.#cartItems];
    }
}