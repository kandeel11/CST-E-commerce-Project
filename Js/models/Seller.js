import {User} from "./User.js";
import {generateID} from './idGenerator.js';

export class Seller extends User {
    #sellerID;
    #storeName;
    #storeDescription;
    #products; // array of product IDs
    #salesHistory; // array of order IDs
    #totalRevenue;

    constructor(name, email, password){
        super(email, name, password, 'seller');
        this.#sellerID = generateID();
        this.StoreName = 'NO STORE NAME';
        this.StoreDescription = 'No description provided.';
        this.#products = [];
        this.#salesHistory = [];
        this.#totalRevenue = 0;
    }

    get SellerID(){
        return this.#sellerID;
    }

    set StoreName(name){
        this.#storeName = name;
    }
    get StoreName(){
        return this.#storeName;
    }

    set StoreDescription(desc){
        this.#storeDescription = desc;
    }
    get StoreDescription(){
        return this.#storeDescription;
    }

    get Products(){
        return this.#products;
    }

    get SalesHistory(){
        return [...this.#salesHistory];
    }

    get TotalRevenue(){
        return this.#totalRevenue;
    }

    toJSON() {
        return {
            id: this.ID,
            name: this.Name,
            email: this.Email,
            password: this.Password,
            role: "seller",
            status: this.Status,
            sellerID: this.SellerID,
            storeDescription: this.StoreDescription,
            storeName: this.StoreName,
            products: this.Products,
            salesHistory: this.SalesHistory,
            totalRevenue: this.TotalRevenue
        };
    }

    /*
    static fromJSON(obj) {
        const seller = new Seller(
            obj.email,
            obj.name,
            obj.password,
            obj.status
        );
        seller.#storeName = obj.storeName || "";
        seller.#products = obj.products || [];
        seller.#salesHistory = obj.salesHistory || [];
        seller.#totalRevenue = obj.totalRevenue || 0;
        return seller;
    }
        */
}