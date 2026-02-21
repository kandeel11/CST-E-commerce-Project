const togglePassword = document.querySelector('#togglePassword');
const passwordField = document.querySelector('#password');
const rememberMeCheckbox = document.querySelector('#rememberMe');
const Email = document.querySelector('#email');
const LoginButton = document.querySelector('#loginButton');
const RemembertUser = JSON.parse(localStorage.getItem("RememberedUser")) || null;
const CurrentUser = JSON.parse(localStorage.getItem("currentUser")) || null;



import { User } from './Classes/User.js';
if (CurrentUser) {
    window.location.href = `../Pages/Home.html`;
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
console.log(RemembertUser);
Email.addEventListener("blur", function () {

    const emailValue = Email.value.trim();
    const emailError = document.getElementById('emailError');
    if (emailValue === '' || !validateEmail(emailValue)) {
        Email.focus();
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
        passwordField.focus();
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
            if (!users[i].Active) {
                alert("Your account is inactive. Please contact support.");
                return;
            }
            if (users[i].Role === "Admin") {
                alert(`welcome back ${users[i].name} ${users[i].Role}!`);
                window.location.href = `../Pages/AdminDashboard.html?name=${users[i].name}`;
                isUserFound = true;
                break;
            }
            else if (users[i].Role === "User") {
                alert(`welcome back ${users[i].name} ${users[i].Role}!`);
                localStorage.setItem("currentUser", JSON.stringify(users[i]));
                if (rememberMeCheckbox.checked) {
                    localStorage.setItem("RememberedUser", JSON.stringify(users[i]));
                }
                else {
                    localStorage.removeItem("RememberedUser");
                }
                window.location.href = `../Pages/Home.html`;
                isUserFound = true;
                break;
            }
            else if (users[i].Role === "Seller") {
                alert(`welcome back ${users[i].name} ${users[i].Role}!`);
                // window.location.href = `../Pages/SellerDashboard.html`;
                localStorage.setItem("currentSeller", JSON.stringify(users[i]));
                isUserFound = true;
                break;
            }

            // document.querySelector('form').submit();
        }
    }
    if (!isUserFound) {
        alert("Invalid email or password.");
        event.preventDefault(); // Prevent form submission
    }

});


function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}