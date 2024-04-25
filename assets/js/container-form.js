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

//Authenticate

let userAccount;

onAuthStateChanged(auth, (user) => {
    if(user){
        userAccount = user;
    }
})

//Process

const tripRegister = document.querySelector('.Dangky');
const cancelButton = document.querySelector('.car__cancel-button');
console.log(cancelButton);

const car = document.querySelector('.car');


const carSizes = document.getElementsByName('luachon1');
const carGoodsTypes = document.getElementsByName('luachon2');
const carStructures = document.getElementsByName('luachon3');

const carFormFullname = document.querySelector('#car__fullname');
const carFormTel = document.querySelector('#car__tel');
const carFormEmail = document.querySelector('#car__email');

const carFormSize = document.querySelector('#car__size');
const carFormGoodsType = document.querySelector('#car__goodsType');
const carFormStructure = document.querySelector('#car__structure');

const departureDate = document.querySelector('.car__day');
const departureTime = document.querySelector('.car__time');
const departurePlace = document.querySelector('.car__start');
const arrivePlace = document.querySelector('.car__end');
const carForm = document.querySelector('.car__form form');

tripRegister.addEventListener('click', () => {

    const carSizeCheck = Array.from(carSizes).find((carSize) => carSize.checked);
    const carGoodsTypeCheck = Array.from(carGoodsTypes).find((carGoodsType) => carGoodsType.checked);
    const carStructureCheck = Array.from(carStructures).find((carStructure) => carStructure.checked);

    if (userAccount == null){
        alert('Vui lòng đăng nhập để thực hiện chức năng này');
        //location.reload();
    }
    else if (carSizeCheck && carGoodsTypeCheck && carStructureCheck){
        //console.log(carSizeCheck, carSeatTypeCheck, carFeatureCheck);
        
        const userDocRef = doc(db, 'users', userAccount.uid);

        getDoc(userDocRef)
            .then((doc) => {
                carFormFullname.value = doc.data().fullName;
                carFormTel.value = doc.data().tel;
                carFormEmail.value = doc.data().email;
                carFormSize.value = carSizeCheck.value;
                carFormGoodsType.value = carGoodsTypeCheck.value;
                carFormStructure.value = carStructureCheck.value;
            });


        car.style.display = "flex";
    }
    else{
        alert('Hãy nhập đầy đủ các ô');
    }

});

cancelButton.addEventListener('click', () => {
    car.style.display = "none";
});

const startEndPrice =
[
    {
        start: 'TPHCM',
        end: 'VUNGTAU',
        price: '500.000 VND',
        time: '2:00'
    },
    {
        start: 'TPHCM',
        end: 'NHATRANG',
        price: '1.000.000 VND',
        time: '8:30'
    },
    {
        start: 'VUNGTAU',
        end: 'NHATRANG',
        price: '1.500.000 VND',
        time: '6:00'
    },
    {
        start: 'VUNGTAU',
        end: 'TPHCM',
        price: '500.000 VND',
        time: '2:00'
    },
    {
        start: 'NHATRANG',
        end: 'TPHCM',
        price: '1.000.000 VND',
        time: '8:30'
    },
    {
        start: 'NHATRANG',
        end: 'VUNGTAU',
        price: '1.500.000 VND',
        time: '6:00'
    }
]

let getDepartureDate;
let getDepartureTime;
let outputPrice;
let arriveTime;
let arriveDate;

let checkAllInput = function() {
    if (typeof getDepartureDate != 'undefined' && typeof getDepartureTime != 'undefined'){
        
        let checkStatus = startEndPrice.find(item => {
            if (item.start === departurePlace.value && item.end === arrivePlace.value && departurePlace.value !== arrivePlace.value){
                outputPrice = item.price;
                const convertDateTime = () => {

                    let dateAndTime = getDepartureDate + 'T' + getDepartureTime;
                    dateAndTime = new Date(dateAndTime);
                    const [hours, minutes] = item.time.split(':');
                    dateAndTime.setHours(dateAndTime.getHours() + parseInt(hours));
                    dateAndTime.setMinutes(dateAndTime.getMinutes() + parseInt(minutes));
                    arriveTime = `${dateAndTime.getHours().toString().padStart(2, '0')}:${dateAndTime.getMinutes().toString().padStart(2, '0')}`;
                    arriveDate = `${dateAndTime.getFullYear()}-${(dateAndTime.getMonth() + 1).toString().padStart(2, '0')}-${dateAndTime.getDate().toString().padStart(2, '0')}`;
                }
                convertDateTime();
                return true;        
            }
            return false;
        });

        if (!(typeof checkStatus == 'undefined')){
            console.log(document.querySelector('.car__price span'));
            document.querySelector('.car__price span').innerHTML = outputPrice;
            document.querySelector('.car__price').style.display = 'block';
        }
    }
}


carForm.addEventListener('input', (e) => {

    if (e.target == departureDate){
        getDepartureDate = e.target.value;        
    }

    if (e.target == departureTime){
        getDepartureTime = e.target.value;
    }

    checkAllInput();
});

const carOrderRef = collection(db, 'carOrders');

carForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const carOrderId = crypto.randomUUID();

    setDoc(doc(db, 'containerOrders', carOrderId), {
        userId: userAccount.uid,
        fullName : carFormFullname.value,
        tel: carFormTel.value,
        email: carFormEmail.value,
        carSize: carFormSize.value,
        carGoodsType: carFormGoodsType.value,
        carStructure: carFormStructure.value,
        departureDate: departureDate.value,
        arriveDate: arriveDate,
        departureTime: departureTime.value,
        arriveTime: arriveTime,
        departurePlace: departurePlace.value,
        arrivePlace: arrivePlace.value,
        price: outputPrice,
        createdAt: serverTimestamp(),
        type: 'container'
    })

    .then(() => {
        alert(`Đặt xe thành công, mã đặt xe của bạn là ${carOrderId}`);
        window.location.href = 'index.html';
    })

});