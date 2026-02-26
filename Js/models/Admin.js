import {User} from './User.js';

export class Admin extends User{
    constructor(email, name, password){
        super(email, name, password, 'admin');
    }

    toJSON(){
        return{
            id: this.ID,
            name: this.Name,
            email: this.Email,
            password: this.Password,
            role: "admin",
            status: this.Status
        }
    }
        }
    /* 
    approveProduct()
    addAdmin();
    removeUser()
    resetPassword()
    moderateListing()
    */
}