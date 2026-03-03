let users = []


let input_fname = document.getElementById("fname")
let input_lname = document.getElementById("lname")
let input_email = document.getElementById("fp-email")
let input_phone = document.getElementById("fp-phone")
let current_user;

window.addEventListener('load', function () {

    input_fname.focus();
})//end of load

let rest_btn = document.getElementById("rest_btn")
rest_btn.addEventListener('click', function (event) {
    current_user = x = JSON.parse(localStorage.getItem('users')).find(item => item["Email"] == input_email.value);

    document.getElementById("mod_res").style.color = "red"

    fields = document.getElementsByClassName("needs-validation")
    for (i = 0; i < fields.length; i++) {
        fields[i].classList.remove("is-invalid")
    }

    if (input_fname.value.length == 0 || input_lname.value.length == 0 || input_email.value.length == 0 || input_phone.value.length == 0) {
        for (i = 0; i < fields.length; i++) {
            if (fields[i].value.length == 0) {
                fields[i].classList.add("is-invalid")
            }
            document.getElementById("mod_res").innerHTML = "Please Complete your data"
            document.getElementById("mod_res").style.color = "red"
            document.getElementsByClassName("modal-footer")[0].innerHTML = ` <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>`

        }

        event.preventDefault();


    }
    else if (!CheckData(current_user)) {
        document.getElementById("mod_res").innerHTML = "You entered the wrong data! \n please try again"
        document.getElementById("mod_res").style.color = "red"
        document.getElementsByClassName("modal-footer")[0].innerHTML = ` <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>`

        event.preventDefault();
    }

    else if (CheckData(current_user) == true) {
        document.getElementById("mod_res").innerHTML = "Your Password is Reset Sucessfully your password is the same as your email now, please change it after login"
        document.getElementById("mod_res").style.color = "green"
        document.getElementsByClassName("modal-footer")[0].innerHTML = ` <p class="fp-back">
                <a href="Login.html"><i class="fas fa-arrow-left"></i> Back to Login</a>
            </p>`
        users = JSON.parse(localStorage.getItem('users'))
        user_index = users.indexOf(users.find(item => item.Email == input_email.value))
        users[user_index].password = input_email.value
        localStorage.setItem('users', JSON.stringify(users))
    }
}
)

function CheckData(current_user) {

    return ((current_user.Email == input_email.value) && (current_user.Phone == input_phone.value) && (current_user.Fname.toLowerCase() == input_fname.value.toLowerCase()) && (current_user.Lname.toLowerCase() == input_lname.value.toLowerCase()))
}




