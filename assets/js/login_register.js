var choosingLogin = document.getElementById('login-option');
var choosingRegister = document.getElementById('register-option');
var Login = document.getElementById('login__section');
var Register = document.getElementById('register__section');

choosingLogin.addEventListener( 'click', () => {
    Login.style.display = "block";
    Register.style.display = "none";
})

choosingRegister.addEventListener ('click', () => {
    Login.style.display = "none";
    Register.style.display = "block";
})

var deleteButtons = document.querySelectorAll('.delete-field');

var deleteField = 
[
    'login-email',
    'login-password',
    'register-username',
    'register-email',
    'register-password'
]

function deleteFieldFunction(index) {
    return function(e) {
        e.preventDefault();
        var id = document.getElementById(deleteField[index]);
        id.value = "";
    };
}


for (var i = 0; i < deleteButtons.length; i++){
    deleteButtons[i].addEventListener('click', deleteFieldFunction(i));
}

//Take user input
var login_email;
var login_password;
var register_username;
var register_email;
var register_password;

function takeLogin(){
    login_email = document.getElementById("login-email").value;
    login_password = document.getElementById("login-password").value;
}

function takeRegister(){
    register_email = document.getElementById("register-email").value;
    register_username = document.getElementById("register-username").value;
    register_password = document.getElementById("register-password").value;
}

//Show password
function showPass(){
    if(login_password_input.type === "password"){
        login_password_input.type = "text";
    }
    else{
        login_password_input.type = "password";
    }
}