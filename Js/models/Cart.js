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

    get cartID() {
        return this.#cartID;
    }

    get customerID() {
        return this.#customerID;
    }

    get cartItems() {
        return [...this.#cartItems];
    }
}