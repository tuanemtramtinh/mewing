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
    getDoc, updateDoc, getCountFromServer,arrayUnion
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

const profileUsernameLeft = document.querySelector('.profile__usernameLeft span');
const profileFullname = document.querySelector('#profile__fullname');
const profileUsername = document.querySelector('#profile__username');
const profileTel = document.querySelector('#profile__tel');
const profileEmail = document.querySelector('#profile__email');
const profileForm = document.querySelector('.profile__form');

// console.log(profileButton);

// console.log(profileFullname);
// console.log(profileUsername);
// console.log(profileTel);
// console.log(profileEmail);


onAuthStateChanged(auth, async (user) => {
    if (user){
        const userQuery = query(collection(db, 'users'));
        const userSnapshot = await getDocs(userQuery);

        let foundUser;
        userSnapshot.forEach((doc) => {
            if (doc.id == user.uid){
                foundUser = {id: doc.id, ...doc.data(),}
            }
        });

        profileUsernameLeft.innerHTML = foundUser.username;
        profileFullname.value = foundUser.fullName;
        profileUsername.value = foundUser.username;
        profileTel.value = foundUser.tel;
        profileEmail.value = foundUser.email;
        // console.log(foundUser);

        profileForm.addEventListener('submit', async (e) => {
            e.preventDefault();
        
            const usernameInput = profileUsername.value;
            const fullnameInput = profileFullname.value;
            const telInput = profileTel.value;

            if (foundUser.username != usernameInput ||
                foundUser.fullName != fullnameInput ||
                foundUser.tel != telInput){
                    await updateDoc(doc(db, 'users', user.uid), {
                        tel: telInput,
                        fullName: fullnameInput,
                        username: usernameInput
                    });
                    alert('Cập nhật thông tin thành công !');
                    window.location.href = 'index.html';
            }
            else{
                alert('Thông tin méo có gì mới sao cập nhật');
            }
            
        })

    }
    else{
        alert('Bạn chưa đăng nhập để thực hiện chức năng này');
    }
});





console.log('----------------------');