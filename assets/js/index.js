const loginButton = document.querySelector("#login-button");
const registerButton = document.querySelector("#register-button");
const popupLoginForm = document.querySelector(".popupLogin");
const popupRegisterForm = document.querySelector(".popupRegister");
const cancelButtons = document.querySelectorAll("#cancel-button");

console.log(popupRegisterForm);

loginButton.addEventListener("click", () => {
    popupLoginForm.style.display = "flex";
});

registerButton.addEventListener("click", () => {
    popupRegisterForm.style.display = "flex";
});

cancelButtons.forEach((button) => {
    button.addEventListener('click', () => {
        console.log(popupRegisterForm.style.display);
        if (popupLoginForm.style.display === "flex")
            popupLoginForm.style.display = "none";
        if (popupRegisterForm.style.display === "flex")
            popupRegisterForm.style.display = "none";
    });
});
