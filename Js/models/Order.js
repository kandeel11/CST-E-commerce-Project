import {generateID} from "./idGenerator.js";

export class Order{
    #id;
    #customerId;
    #items; // array of OrderItem
    #totalPrice;
    #createdDate;

    constructor(customerId) {
        this.#id = generateID("ORDER");
        this.#customerId = customerId;
        this.#items = [];
        this.#totalPrice = 0;
        this.#createdDate = new Date();
    }

    get ID() {
        return this.#id;
    }

    get customerId() {
        return this.#customerId;
    }

    get items() {
        return [...this.#items];
    }

    get totalPrice() {
        return this.#totalPrice;
    }

    get createdDate() {
        return this.#createdDate;
    }
}