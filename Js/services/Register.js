import{register} from "./authService.js";

document.getElementById("registerForm").addEventListener('submit', function(event){
    event.preventDefault();
    let name = document.getElementById("username").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let role = document.getElementById("role").value;

    try{
        register(name, email, password, role);
    }catch(error){
        alert("Error registering user: " + error.message);
    }
});
