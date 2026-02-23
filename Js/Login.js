const togglePassword = document.querySelector('#togglePassword');
const passwordField = document.querySelector('#password');
const rememberMeCheckbox = document.querySelector('#rememberMe');
const Email = document.querySelector('#email');
const LoginButton = document.querySelector('#loginButton');
const RemembertUser = JSON.parse(localStorage.getItem("RememberedUser")) || null;
const CurrentUser = JSON.parse(localStorage.getItem("currentUser")) || null;



import { User } from './Classes/User.js';

document.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem("showRegistrationToast") === "true") {
        showSuccessToast("Registration successful! Now you can log in with your credentials.");
        localStorage.removeItem("showRegistrationToast");
    }
});

function showSuccessToast(message) {
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
        toastContainer.style.zIndex = '1055';
        document.body.appendChild(toastContainer);
    }

    const toastEl = document.createElement('div');
    toastEl.className = `toast align-items-center text-white bg-success border-0 fade show`;
    toastEl.setAttribute('role', 'alert');
    toastEl.setAttribute('aria-live', 'assertive');
    toastEl.setAttribute('aria-atomic', 'true');

    toastEl.innerHTML = `
      <div class="d-flex">
        <div class="toast-body">
          ${message}
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    `;

    const closeBtn = toastEl.querySelector('.btn-close');
    closeBtn.addEventListener('click', () => {
        toastEl.classList.remove('show');
        setTimeout(() => toastEl.remove(), 150);
    });

    toastContainer.appendChild(toastEl);

    setTimeout(() => {
        toastEl.classList.remove('show');
        setTimeout(() => toastEl.remove(), 150);
    }, 4000);
}

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
                localStorage.setItem("showLoginToast", "true");
                window.location.href = `../Pages/AdminDashboard.html?name=${users[i].name}`;
                isUserFound = true;
                break;
            }
            else if (users[i].Role === "User") {
                localStorage.setItem("currentUser", JSON.stringify(users[i]));
                if (rememberMeCheckbox.checked) {
                    localStorage.setItem("RememberedUser", JSON.stringify(users[i]));
                }
                else {
                    localStorage.removeItem("RememberedUser");
                }
                localStorage.setItem("showLoginToast", "true");
                window.location.href = `../Pages/Home.html`;
                isUserFound = true;
                break;
            }
            else if (users[i].Role === "Seller") {
                localStorage.setItem("currentSeller", JSON.stringify(users[i]));
                localStorage.setItem("showLoginToast", "true");
                window.location.href = `../Pages/Home.html`;
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