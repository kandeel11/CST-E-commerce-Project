import { User } from "./User.js";

export class Customer extends User {
    #orderHistory;

    constructor(name, email, password, status) {
        super(email, name, password, "customer", status);
        this.#orderHistory = [];
    }

    get OrderHistory() {
        return [...this.#orderHistory];
    }

    
    toJSON() {
        return {
            id: this.ID,
            name: this.Name,
            email: this.Email,
            password: this.Password,
            role: "customer",
            status: this.Status,
            orderHistory: this.OrderHistory
        };
    }

    /*
    static fromJSON(obj) {
        const customer = new Customer(
            obj.name,
            obj.email,
            obj.password,
            obj.status
        );
        customer.#orderHistory = obj.orderHistory || [];
        return customer;
    }
        */
}
