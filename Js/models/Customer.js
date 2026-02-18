export class Customer extends User{
    #cartID;
    #orderHistory; //array of order IDs

    constructor(id, name, email, password, role, status, cartID, orderHistory=[]){
        super(id, name, email, password, role, status);
        this.CartID = cartID;
        this.#orderHistory = orderHistory;
    }

    set CartID(c){
        this.#cartID = c;
    }
    get CartID(){
        return this.#cartID;
    }

    get OrderHistory(){
        return this.#orderHistory;
    }
}