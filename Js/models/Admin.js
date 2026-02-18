import {User} from './User.js';

export class Admin extends User{
    constructor(email, name, password, role="admin"){
        super(email, name, password, role);
    }

    /* 
    approveProduct()
    addAdmin();
    removeUser()
    resetPassword()
    moderateListing()
    */
}