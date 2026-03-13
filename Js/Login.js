const togglePassword = document.querySelector('#togglePassword');
const passwordField = document.querySelector('#password');
const rememberMeCheckbox = document.querySelector('#rememberMe');
const Email = document.querySelector('#email');
const LoginButton = document.querySelector('#loginButton');
const RemembertUser = JSON.parse(localStorage.getItem("RememberedUser")) || null;
const CurrentUser = JSON.parse(sessionStorage.getItem("currentUser")) || null;
const CurrentSeller = JSON.parse(sessionStorage.getItem("currentSeller")) || null;
const CurrentAdmin = JSON.parse(sessionStorage.getItem("currentAdmin")) || null;
const toastLiveExample = document.getElementById('liveToast');
const toastbody = toastLiveExample.querySelector('.toast-body');
const toastcontainer = document.querySelector('.toast-container');

const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('registered') === 'true') {
    toastLiveExample.style.backgroundColor = 'rgb(111, 246, 111)';
    setInterval(() => {
        toastLiveExample.style.backgroundColor = 'rgb(246, 111, 111)';
    }, 5000);
    toastbody.textContent = "Registration successful! You can now log in with your credentials.";

    new bootstrap.Toast(toastLiveExample).show();
}
import { User } from './Classes/User.js';
if (CurrentUser) {
    window.location.href = `../Pages/Home.html`;
}
if (CurrentSeller) {
    window.location.href = `../Pages/Seller.html`;
}
if (CurrentAdmin) {
    window.location.href = `../Pages/Admin.html`;
}

togglePassword.addEventListener('click', function () {
    // Toggle the input type
    const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordField.setAttribute('type', type);

    // Toggle the eye icon
    this.classList.toggle('fa-eye-slash');
});
let users = [];

email.value = RemembertUser ? RemembertUser.Email : '';
passwordField.value = RemembertUser ? RemembertUser.password : '';


users = JSON.parse(localStorage.getItem("users")) || [];
localStorage.setItem("users", JSON.stringify(users));
Email.addEventListener("blur", function () {

    const emailValue = Email.value.trim();
    const emailError = document.getElementById('emailError');
    if (emailValue === '' || !validateEmail(emailValue)) {
        // Email.focus();
        Email.classList.remove('is-valid');
        Email.classList.add('is-invalid');
        emailError.textContent = 'Please enter a valid email address.';
        emailError.style.display = 'block';
    } else {
        Email.classList.remove('is-invalid');
        Email.classList.add('is-valid');

        emailError.style.display = 'none';
    }
});
Email.addEventListener("input", function () {
    Email.classList.remove('is-invalid');
    emailError.style.display = 'none';

});
passwordField.addEventListener("blur", function () {
    const passwordValue = passwordField.value.trim();
    const passwordError = document.getElementById('passwordError');
    if (passwordValue === '' || passwordValue.length < 6) {
        passwordField.classList.remove('is-valid');
        passwordField.classList.add('is-invalid');
        // passwordField.focus();
        passwordError.textContent = 'Please enter your password (minimum 6 characters).';
        passwordError.style.display = 'block';
    } else {
        passwordField.classList.remove('is-invalid');
        passwordField.classList.add('is-valid');
        passwordError.style.display = 'none';
    }
});
passwordField.addEventListener("input", function () {

    passwordField.classList.remove('is-invalid');
    passwordError.style.display = 'none';
});
LoginButton.addEventListener('click', function (event) {
    event.preventDefault(); // Prevent form submission
    const emailValue = Email.value.trim();
    const passwordValue = passwordField.value.trim();
    let isUserFound = false;
    for (let i = 0; i < users.length; i++) {
        if (emailValue == users[i].Email && passwordValue == users[i].password) {
            if (users[i].Role === "Admin") {
                sessionStorage.setItem("currentAdmin", JSON.stringify(users[i]));
                window.location.href = `../Pages/Admin.html`;
                isUserFound = true;
                break;
            }
            else if (users[i].Role === "User") {
                if (!users[i].Active) {
                    toastbody.textContent = "Your account is inactive. Please contact support.";
                    new bootstrap.Toast(toastLiveExample).show();
                    return;
                }
                sessionStorage.setItem("currentUser", JSON.stringify(users[i]));
                if (rememberMeCheckbox.checked) {
                    localStorage.setItem("RememberedUser", JSON.stringify(users[i]));
                }
                else {
                    localStorage.removeItem("RememberedUser");
                }
                let userCart = JSON.parse(localStorage.getItem("cart")) || [];
                if (!userCart.some(c => c.userid === users[i].id)) {
                    userCart.push({ userid: users[i].id, items: JSON.parse(sessionStorage.getItem("MyCart"))?.items || [] });
                    localStorage.setItem("cart", JSON.stringify(userCart));
                    sessionStorage.setItem("MyCart", JSON.stringify(userCart[userCart.length - 1]));
                } else {
                    let existingCart = userCart.find(c => c.userid === users[i].id);
                    let sessionCart = JSON.parse(sessionStorage.getItem("MyCart")) || { items: [] };
                    existingCart.items = [...new Map([...existingCart.items, ...sessionCart.items].map(item => [item.product_id, item])).values()];
                    localStorage.setItem("cart", JSON.stringify(userCart));
                    sessionStorage.setItem("MyCart", JSON.stringify(existingCart));
                }
                window.location.href = `../Pages/Home.html`;
                isUserFound = true;
                break;
            }
            else if (users[i].Role === "Seller") {
                sessionStorage.setItem("currentSeller", JSON.stringify(users[i]));
                window.location.href = `../Pages/Seller.html`;
                isUserFound = true;
                break;
            }
        }
    }
    if (!isUserFound) {
        toastbody.textContent = "Invalid email or password. Please try again.";
        new bootstrap.Toast(toastLiveExample).show();
        event.preventDefault(); // Prevent form submission
    }

});


function loadComponents() {
    // 1. Load Navbar
    fetch('../Pages/NavBar.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('navbar-placeholder').innerHTML = data;

            // Re-run NavBar initialization since the HTML is dynamically loaded
            if (window.initNavBarAuth) window.initNavBarAuth();
            if (window.initSearchAutoSuggest) window.initSearchAutoSuggest();
            if (window.initMobileSearch) window.initMobileSearch();
            if (window.updateCartBadge) window.updateCartBadge();
        })
        .catch(error => console.error('Error loading navbar:', error));

    // 2. Load Footer
    fetch('../Pages/Footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-placeholder').innerHTML = data;
        })
        .catch(error => console.error('Error loading footer:', error));
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}
window.addEventListener('DOMContentLoaded', function () {
    loadComponents();
});
