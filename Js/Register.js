const registerForm = document.querySelector('#accountForm');
const FnameInput = document.getElementById('FirstName');
const LnameInput = document.getElementById('LastName');
const emailInput = document.getElementById('Email');
const roleInput = document.getElementById('role');
const passwordInput = document.getElementById('Password');
const confirmPasswordInput = document.getElementById('confirmPassword1');
const streetInput = document.getElementById('Street');
const cityInput = document.getElementById('City');
const countryInput = document.getElementById('Country');
const phoneInput = document.getElementById('Phone');
const toastLiveExample = document.getElementById('liveToast');
const toastbody = toastLiveExample.querySelector('.toast-body');

import { User } from "./Classes/User.js";
FnameInput.focus();
const currentUser = JSON.parse(localStorage.getItem("currentUser"));
if (currentUser) {
    window.location.href = "../Pages/home.html";
}

FnameInput.addEventListener("blur", function () {
    const nameValue = FnameInput.value.trim();
    if (nameValue === '') {
        FnameInput.classList.remove('is-valid');
        FnameInput.classList.add('is-invalid');
        FnameInput.focus();

    } else {
        FnameInput.classList.remove('is-invalid');
        FnameInput.classList.add('is-valid');
    }
});
FnameInput.addEventListener("input", function () {
    FnameInput.classList.remove('is-invalid');
    const nameError = document.getElementById('nameError');
    nameError.style.display = 'none';
});

cityInput.addEventListener("blur", function () {
    const nameValue = cityInput.value.trim();
    if (nameValue === '') {
        cityInput.classList.remove('is-valid');
        cityInput.classList.add('is-invalid');
        cityInput.focus();
    } else {
        cityInput.classList.remove('is-invalid');
        cityInput.classList.add('is-valid');
    }
});
cityInput.addEventListener("input", function () {
    cityInput.classList.remove('is-invalid');
    const nameError = document.getElementById('cityError');
});
streetInput.addEventListener("blur", function () {
    const nameValue = streetInput.value.trim();
    if (nameValue === '') {
        streetInput.classList.remove('is-valid');
        streetInput.classList.add('is-invalid');
        streetInput.focus();
    }
    else {
        streetInput.classList.remove('is-invalid');
        streetInput.classList.add('is-valid');
    }
});
streetInput.addEventListener("input", function () {
    streetInput.classList.remove('is-invalid');
    const nameError = document.getElementById('streetError');
});
phoneInput.addEventListener("blur", function () {
    const nameValue = phoneInput.value.trim();
    if (nameValue === '' || !isValidPhone(nameValue)) {
        phoneInput.classList.remove('is-valid');
        phoneInput.classList.add('is-invalid');
        phoneInput.focus();
    } else {
        phoneInput.classList.remove('is-invalid');
        phoneInput.classList.add('is-valid');
    }
});
phoneInput.addEventListener("input", function () {
    phoneInput.classList.remove('is-invalid');
    const nameError = document.getElementById('phoneError');
    nameError.style.display = 'none';
});
countryInput.addEventListener("blur", function () {
    const nameValue = countryInput.value.trim();
    if (nameValue === '') {
        countryInput.classList.remove('is-valid');
        countryInput.classList.add('is-invalid');
        countryInput.focus();
    } else {
        countryInput.classList.remove('is-invalid');
        countryInput.classList.add('is-valid');
    }
});
countryInput.addEventListener("input", function () {
    countryInput.classList.remove('is-invalid');
    const nameError = document.getElementById('countryError');
});

LnameInput.addEventListener("blur", function () {
    const nameValue = LnameInput.value.trim();
    if (nameValue === '') {
        LnameInput.classList.remove('is-valid');
        LnameInput.classList.add('is-invalid');
        LnameInput.focus();
    } else {
        LnameInput.classList.remove('is-invalid');
        LnameInput.classList.add('is-valid');
    }
});
LnameInput.addEventListener("input", function () {
    LnameInput.classList.remove('is-invalid');
});

emailInput.addEventListener("blur", function () {
    const emailValue = emailInput.value.trim();
    const emailError = document.getElementById('emailError');
    if (emailValue === '' || !isValidEmail(emailValue)) {
        emailInput.classList.remove('is-valid');
        emailInput.classList.add('is-invalid');
        emailInput.focus();
        emailError.textContent = 'Please enter a valid email address.';
        emailError.style.display = 'block';
    } else {
        emailInput.classList.remove('is-invalid');
        emailInput.classList.add('is-valid');
        emailError.style.display = 'none';
    }
});
emailInput.addEventListener("input", function () {
    emailInput.classList.remove('is-invalid');
    const emailError = document.getElementById('emailError');
    emailError.style.display = 'none';
});
roleInput.style.color = "gray";
roleInput.addEventListener("blur", function () {
    const roleValue = roleInput.value;
    const roleError = document.getElementById('roleError');
    if (roleValue === '') {
        roleInput.classList.remove('is-valid');
        roleInput.classList.add('is-invalid');
        roleInput.focus();
        roleError.textContent = 'Please select a role.';
        roleError.style.display = 'block';
    } else {
        roleInput.classList.remove('is-invalid');
        roleInput.classList.add('is-valid');
        roleError.style.display = 'none';
    }
});

passwordInput.addEventListener("blur", function () {
    const passwordValue = passwordInput.value.trim();
    if (passwordValue === '' || passwordValue.length < 6 || !IsValidPassword(passwordValue)) {
        passwordInput.classList.remove('is-valid');
        passwordInput.classList.add('is-invalid');
        passwordInput.focus();

    }
    else {
        passwordInput.classList.remove('is-invalid');
        passwordInput.classList.add('is-valid');
    }
});
passwordInput.addEventListener("invalid", function () {
    passwordInput.setCustomValidity("Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, and one digit.");
});
passwordInput.addEventListener("input", function () {
    passwordInput.classList.remove('is-invalid');
    const passwordError = document.getElementById('passwordError');
    passwordError.style.display = 'none';
});
confirmPasswordInput.addEventListener("blur", function () {
    const confirmPasswordValue = confirmPasswordInput.value.trim();
    const passwordValue = passwordInput.value.trim();

    if (confirmPasswordValue === '' || confirmPasswordValue !== passwordValue) {
        confirmPasswordInput.classList.remove('is-valid');
        confirmPasswordInput.classList.add('is-invalid');
        confirmPasswordInput.focus();

    }
    else {
        confirmPasswordInput.classList.remove('is-invalid');
        confirmPasswordInput.classList.add('is-valid');
    }
});
confirmPasswordInput.addEventListener("input", function () {
    confirmPasswordInput.classList.remove('is-invalid');
    const confirmPasswordError = document.getElementById('confirmPasswordError');
    confirmPasswordError.style.display = 'none';
});

roleInput.addEventListener("change", function () {
    roleInput.style.color = "black";
    roleInput.classList.remove('is-invalid');
});


registerForm.addEventListener('submit', function (e) {
    const InvalidFields = document.querySelectorAll('.is-invalid');
    if (InvalidFields.length > 0) {
        InvalidFields[0].focus();
    }
    e.preventDefault();
    const name = FnameInput.value.trim();
    const lastName = LnameInput.value.trim();
    const email = emailInput.value.trim();
    const role = roleInput.value;
    const city = cityInput.value.trim();
    const country = countryInput.value.trim();
    const street = streetInput.value.trim();
    const Phone = phoneInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    let users = JSON.parse(localStorage.getItem("users")) || [];
    if (name === '' || email === '' || role === '' || city === '' || country === '' || street === '' || Phone === '' || password === '' || confirmPassword === '') {
        toastbody.textContent = "Please fill in all fields.";
        new bootstrap.Toast(toastLiveExample).show();
        return;
    }
    if (!isValidEmail(email)) {
        toastbody.textContent = "Please enter a valid email address.";
        new bootstrap.Toast(toastLiveExample).show();
        return;
    }
    if (password.length < 6) {
        toastbody.textContent = "Password must be at least 6 characters long.";
        new bootstrap.Toast(toastLiveExample).show();
        return;
    }
    if (password !== confirmPassword) {
        toastbody.textContent = "Passwords do not match.";
        new bootstrap.Toast(toastLiveExample).show();
        return;
    }
    for (let user of users) {
        if (user.Email === email) {

            toastbody.textContent = "Email already exists. Please use a different email.";
            new bootstrap.Toast(toastLiveExample).show();
            return;
        }
    }
    const newUser = new User(name, lastName, role, email, password, street, city, country, Phone);
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    window.location.href = "../Pages/Login.html?registered=true";
    // Clear form fields after registration
});
function IsValidPassword(password) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{7,}$/;
    return passwordRegex.test(password);
}
function isValidPhone(phone) {
    const phoneRegex = /^[0-9]{11}$/;
    return phoneRegex.test(phone);
}

function isValidEmail(email) {
    const emailRegex =
        /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
    return emailRegex.test(email);
}