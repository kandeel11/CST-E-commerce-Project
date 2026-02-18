import {User} from "./User.js";
import {generateID} from './idGenerator.js';

export class Seller extends User {
    /*
    #storeName
    #storeDescription
    #products → array of product IDs
    #salesHistory → array of order IDs
    #totalRevenue (optional but useful)
    */

    #sellerID;
    #storeName;
    #storeDescription;
    #products; // array of product IDs
    #salesHistory; // array of order IDs
    #totalRevenue;

    constructor(email, name, password, storeName, storeDescription){
        super(email, name, password, 'seller');
        this.#sellerID = generateID();
        this.StoreName = storeName;
        this.StoreDescription = storeDescription;
        this.#products = products;
        this.#salesHistory = salesHistory;
        this.#totalRevenue = totalRevenue;
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
        return this.#salesHistory;
    }

    get TotalRevenue(){
        return this.#totalRevenue;
    }
}