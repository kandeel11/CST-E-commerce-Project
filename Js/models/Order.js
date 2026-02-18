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

    addItem(orderItem) {
        this.#items.push(orderItem);
        this.#totalPrice += orderItem.PriceAtPurchase * orderItem.Quantity;
    }

    get ID() {
        return this.#id;
    }

    get CustomerId() {
        return this.#customerId;
    }

    get Items() {
        return [...this.#items];
    }

    get TotalPrice() {
        return this.#totalPrice;
    }

    get CreatedDate() {
        return this.#createdDate;
    }
}