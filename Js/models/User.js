import {generateID} from './idGenerator.js';

export class User{
    #id;
    #email;
    #name;
    #password;
    #role;
    #status;

    constructor(email, name, password, role, status='active'){
        this.#id = idGenerator.generateID();
        this.Email = email;
        this.Name = name;
        this.Password = password;
        this.Role = role;
        this.Status = status;
    }

    get ID(){
        return this.#id;
    }

    set Email(e){
        this.#email = e;
    }
    get Email(){
        return this.#email;
    }

    set Name(n){
        this.#name = n;
    }
    get Name(){
        return this.#name;
    }

    set Password(p){
        this.#password = p;
    }
    get Password(){
        return this.#password;
    }

    set Role(r){
        this.#role = r;
    }   
    get Role(){
        return this.#role;
    }

    set Status(s){
        this.#status = s;
    }
    get Status(){
        return this.#status;
    }
}