import {Customer} from "../models/Customer.js";
import {Seller} from "../models/Seller.js";

// function to convert raw user data from localStorage into proper class instances
function getAllUsers() {
    const rawUsers = JSON.parse(localStorage.getItem("users")) || [];
    return rawUsers;
}

function saveUsers(users){
    localStorage.setItem("users", JSON.stringify(users));
}

function redirectByRole(role){
    switch(role){
        case "customer":
            window.location.href = "../Pages/Customer.html";
            break;
        case "seller":
            window.location.href = "../Pages/Seller.html";
            break;
        case "admin":
            window.location.href = "../Pages/Admin.html";
            break;
    }
}

export function register(name, email, password, role){
    let users = getAllUsers();

    //check if the email is already used
    let existingUser = users.find(u => u.email === email);
    if(existingUser){
        alert("The email used is already existed, please try another one");
        return;
    }

    let newUser;
    switch(role){
        case "customer":
            newUser = new Customer(name, email, password);
            users.push(newUser.toJSON());
            break;
        case "seller":
            newUser = new Seller(name, email, password);
            users.push(newUser.toJSON());
            break;
    }

    saveUsers(users);
    sessionStorage.setItem("pageUser", JSON.stringify(newUser.toJSON()));
    redirectByRole(role);
}

export function login(email, password){
    let users = getAllUsers();
    let correctUser = users.find(u => u.email === email && u.password === password);
    if(correctUser){
        sessionStorage.setItem("pageUser", JSON.stringify(correctUser));
        redirectByRole(correctUser.role);
    }
    else{
        alert("Incorrect email or password, please try again.");
        return;
    }
}