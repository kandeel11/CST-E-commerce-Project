import {login} from './authService.js'

document.getElementById("loginForm").addEventListener("submit", function(event){
    event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try{
        login(email, password);
    }catch(error){
        alert("Login Error: " + error.message);
    }
});