import {generateID} from './idGenerator.js';

export class Product {
    #productID;
    #productName;
    #procuctCategory;
    #productDescription;
    #productPrice;
    #sellerID;
    #imageUrl;
    #stockQuantity;
    #createdDate;

    constructor(productName, procuctCategory, productDescription, productPrice, sellerID, imageUrl, stockQuantity){
        this.#productID = generateID('PRODUCT');
        this.ProductName = productName;
        this.ProcuctCategory = procuctCategory;
        this.ProductDescription = productDescription;
        this.ProductPrice = productPrice;
        this.SellerID = sellerID;
        this.ImageUrl = imageUrl;
        this.StockQuantity = stockQuantity;
        this.CreatedDate = new Date();
    }

    get ProductID(){
        return this.#productID;
    }

    set ProductName(name){
        this.#productName = name;
    }
    get ProductName(){
        return this.#productName;
    }

    set ProductDescription(desc){
        this.#productDescription = desc;
    }
    get ProductDescription(){
        return this.#productDescription;
    }

    set ProductPrice(price){
        this.#productPrice = price;
    }
    get ProductPrice(){
        return this.#productPrice;
    }

    set SellerID(sellerID){
        this.#sellerID = sellerID;
    }
    get SellerID(){
        return this.#sellerID;
    }

    set ImageUrl(url){
        this.#imageUrl = url;
    }
    get ImageUrl(){
        return this.#imageUrl;
    }

    set StockQuantity(quantity){
        this.#stockQuantity = quantity;
    }
    get StockQuantity(){
        return this.#stockQuantity;
    }

    set CreatedDate(date){
        this.#createdDate = date;
    }
    get CreatedDate(){
        return this.#createdDate;
    }

    set ProcuctCategory(category){
        this.#procuctCategory = category;
    }
    get ProcuctCategory(){
        return this.#procuctCategory;
    }

    toJSON(){
        return{
            productID : this.ProductID,
            productName : this.ProductName,
            procuctCategory : this.ProcuctCategory,
            productDescription : this.ProductDescription,
            productPrice : this.ProductPrice,
            sellerID : this.SellerID,
            imageUrl : this.ImageUrl,
            stockQuantity : this.StockQuantity,
            createdDate : this.CreatedDate
        }
    }
}