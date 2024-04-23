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

const userListButton = document.querySelector('.adminSection1__userListButton');
const driverListButton = document.querySelector('.adminSection1__userListDriver');
const carListButton = document.querySelector('.adminSection1__carListDriver');

console.log(userListButton);
console.log(driverListButton);
console.log(carListButton);

userListButton.addEventListener('click', () => {
    const userRef = collection(db, 'users');
    let userList = [];
    getDocs(userRef)
    .then((snapshot) => {
        snapshot.docs.forEach((doc) => {
            userList.push({...doc.data()});
        })

        let ulUserList = [];
        userList.forEach((user) => {
            const username = document.createElement('li');
            username.innerHTML = `<span>Tên đăng nhập: </span> <span>${user.username}</span>`;
            const fullname = document.createElement('li');
            fullname.innerHTML = `<span>Họ và tên: </span><span>${user.fullName}</span>`;
            const tel = document.createElement('li');
            tel.innerHTML = `<span>Số điện thoại: </span><span>${user.tel}</span>`;
            const email = document.createElement('li');
            email.innerHTML = `<span>Email: </span><span>${user.email}</span>`

            let ulElement = document.createElement('ul');
            ulElement.classList.add('adminSection1__userInfo');
            ulElement.appendChild(username);
            ulElement.appendChild(fullname);
            ulElement.appendChild(tel);
            ulElement.appendChild(email);
            ulUserList.push(ulElement);
        });
        console.log(ulUserList);
        const userListDiv = document.querySelector('.adminSection1__userList');
        ulUserList.forEach((element) => {
            userListDiv.appendChild(element);
        });
    })
});

driverListButton.addEventListener('click', () => {
    
});

carListButton.addEventListener('click', () => {

});