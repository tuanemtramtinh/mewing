//-------------------Firebase-------------------

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import {
    getAuth, createUserWithEmailAndPassword,
    signInWithEmailAndPassword, signOut,
    onAuthStateChanged, updateProfile
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import{
    getFirestore, collection, getDocs, onSnapshot,
    addDoc, deleteDoc, doc, setDoc,
    query, where,
    orderBy, serverTimestamp,
    getDoc, updateDoc
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAoDY7W8GaD9uiIuhTKvDy7529-ll4zVzk",
    authDomain: "mewing-642b4.firebaseapp.com",
    databaseURL: "https://mewing-642b4-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "mewing-642b4",
    storageBucket: "mewing-642b4.appspot.com",
    messagingSenderId: "559424480334",
    appId: "1:559424480334:web:f665adca53dddc32620f1f"
  };

//Init Firebase  

initializeApp(firebaseConfig);

//Init service

const auth = getAuth();
const db = getFirestore();

//-------------------Firebase-------------------

const admin = {
    username : 'admin',
    email: 'admin@gmail.com',
    password: 'admin@123'
}

const loginButton = document.querySelector("#login-button");
const registerButton = document.querySelector("#register-button");
const popupLogin = document.querySelector(".popupLogin");
const popupRegister = document.querySelector(".popupRegister");
const cancelButtons = document.querySelectorAll("#cancel-button");

console.log(popupLogin);

console.log(popupRegister);

loginButton.addEventListener("click", () => {
    popupLogin.style.display = "flex";
});

registerButton.addEventListener("click", () => {
    popupRegister.style.display = "flex";
});


cancelButtons.forEach((button) => {
    button.addEventListener('click', () => {
        if (popupLogin.style.display === "flex")
            popupLogin.style.display = "none";
        if (popupRegister.style.display === "flex")
            popupRegister.style.display = "none";
    });
});

//Authentication

const headerNav = document.querySelector('.header__nav');
const headerUser = document.querySelector('.header__user');
const headerUsername = document.querySelector('.header__username');

onAuthStateChanged(auth, (user) => {
    if (user) {

        
        headerNav.style.display = "none";
        headerUser.style.display = "flex";

        const userDocRef = doc(db, 'users', user.uid);
        getDoc(userDocRef)
            .then((doc) => {

                if (doc.data().username === admin.username && 
                    doc.data().email === admin.email &&
                    doc.data().password === admin.password ){
                        //navigate....
                    //alert("HelloWorld");

                }
                else{
                    
                }
                headerUsername.innerHTML = doc.data().username;
            })
        
    }
    else{
        headerNav.style.display = "flex";
        headerUser.style.display = "none";
    }
})

const popupLoginForm = popupLogin.querySelector('.popupLogin__content-login');
const popupRegisterForm = popupRegister.querySelector('.popupRegister__content-login');

popupRegisterForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const registerFullname = popupRegister.querySelector('#popupRegister__fullName');
    const registerTel = popupRegister.querySelector('#popupRegister__tel');
    const registerUsername = popupRegister.querySelector('#popupRegister__username');
    const registerEmail = popupRegister.querySelector('#popupRegister__email');
    const registerPassword = popupRegister.querySelector('#popupRegister__password');
    
    createUserWithEmailAndPassword(auth, registerEmail.value, registerPassword.value)
        .then((cred) => {
            setDoc(doc(db, 'users', cred.user.uid), { //Take user id as ID of a document in collection
                fullName: registerFullname.value,
                tel: registerTel.value,
                username: registerUsername.value,
                email: registerEmail.value,
                password: registerPassword.value
            })
            .then(() => {
                // console.log("Create and save user success");
                popupRegisterForm.reset();
                location.reload();
            })
        })
        .catch((err) => {
            console.log(err.message);
        })
});

popupLoginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const loginEmail = popupLoginForm.querySelector('#popupLogin__email');
    const loginPassword = popupLoginForm.querySelector('#popupLogin__password');


    // console.log(loginPassword);
    signInWithEmailAndPassword(auth, loginEmail.value, loginPassword.value)
        .then((cred) => {
            popupLoginForm.reset();
            location.reload();
        })
        .catch((err) => {
            console.log(err.message);
        })

});

const buttonLogout = document.querySelector('.header__logout');
buttonLogout.addEventListener('click', () => {
    signOut(auth)
        .then(() => {
            console.log('Sign out success');
        })
})
