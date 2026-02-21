const registerForm = document.querySelector('.login-form');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const roleInput = document.getElementById('role');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');
const togglePassword = document.querySelector('#togglePassword');
const toggleConfirmPassword = document.querySelector('#toggleConfirmPassword');

import { User } from "./Classes/User.js";
nameInput.focus();

togglePassword.addEventListener('click', function () {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);

    this.classList.toggle('fa-eye-slash');
});
toggleConfirmPassword.addEventListener('click', function () {
    const type = confirmPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    confirmPasswordInput.setAttribute('type', type);

    this.classList.toggle('fa-eye-slash');
});
nameInput.addEventListener("blur", function () {
    const nameValue = nameInput.value.trim();
    const nameError = document.getElementById('nameError');
    if (nameValue === '') {
        nameInput.classList.remove('is-valid');
        nameInput.classList.add('is-invalid');
        nameInput.focus();
        nameError.textContent = 'Please enter your name.';
        nameError.style.display = 'block';
    } else {
        nameInput.classList.remove('is-invalid');
        nameInput.classList.add('is-valid');
        nameError.style.display = 'none';
    }
});
nameInput.addEventListener("input", function () {
    nameInput.classList.remove('is-invalid');
    const nameError = document.getElementById('nameError');
    nameError.style.display = 'none';
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
    const passwordError = document.getElementById('passwordError');
    if (passwordValue === '' || passwordValue.length < 6) {
        passwordInput.classList.remove('is-valid');
        passwordInput.classList.add('is-invalid');
        passwordInput.focus();
        passwordError.textContent = 'Please enter your password (minimum 6 characters).';
        passwordError.style.display = 'block';
    }
    else {
        passwordInput.classList.remove('is-invalid');
        passwordInput.classList.add('is-valid');
        passwordError.style.display = 'none';
    }
});
passwordInput.addEventListener("input", function () {
    passwordInput.classList.remove('is-invalid');
    const passwordError = document.getElementById('passwordError');
    passwordError.style.display = 'none';
});
confirmPasswordInput.addEventListener("blur", function () {
    const confirmPasswordValue = confirmPasswordInput.value.trim();
    const passwordValue = passwordInput.value.trim();
    const confirmPasswordError = document.getElementById('confirmPasswordError');
    if (confirmPasswordValue === '' || confirmPasswordValue !== passwordValue) {
        confirmPasswordInput.classList.remove('is-valid');
        confirmPasswordInput.classList.add('is-invalid');
        confirmPasswordInput.focus();
        confirmPasswordError.textContent = 'Passwords do not match.';
        confirmPasswordError.style.display = 'block';
    }
    else {
        confirmPasswordInput.classList.remove('is-invalid');
        confirmPasswordInput.classList.add('is-valid');
        confirmPasswordError.style.display = 'none';
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
    const roleError = document.getElementById('roleError');
    roleError.style.display = 'none';
});


registerForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const role = roleInput.value;
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    let users = JSON.parse(localStorage.getItem("users")) || [];
    if (name === '' || email === '' || role === '' || password === '' || confirmPassword === '') {
        alert("Please fill in all fields.")
        return;
    }
    if (!isValidEmail(email)) {
        alert("Please enter a valid email address.");
        return;
    }
    if (password.length < 6) {
        alert("Password must be at least 6 characters long.");
        return;
    }
    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }
    for (let user of users) {
        if (user.Email === email) {
            alert("Email already exists. Please use a different email.");
            window.location.reload();
            return;
        }
    }
    const newUser = new User(name, role, email, password);
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    alert("Registration successful! now you can log in with your credentials.");
    window.location.href = "../Pages/Login.html";
    // Clear form fields after registration


});


function isValidEmail(email) {
    const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}