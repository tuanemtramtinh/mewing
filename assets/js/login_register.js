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
