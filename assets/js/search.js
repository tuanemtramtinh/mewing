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

//Authenticate

let userAccount;

onAuthStateChanged(auth, (user) => {
    if(user){
        userAccount = user;
    }
})

//Progress Bar
let finalValue = 50;
let Max = 100;

function changeWidth(){
    const progress = document.querySelector(".progress-done");
    progress.style.width = `${(finalValue / Max) * 100}%`;
    if(finalValue < Max){
        progress.innerHTML = `<span class="material-symbols-outlined">local_shipping</span>`;
    }
    else{
        progress.innerHTML = `<span class="material-symbols-outlined">done</span>`;
    }
}


//Function to search
const id_button = document.querySelector(".search__form button");
const id_input = document.querySelector("#search__input");
const result = document.querySelector(".search__result-list");

id_button.addEventListener('click', async (e) => {
    e.preventDefault();
    const carRef = doc(db, "carOrders", id_input.value);
    const truckRef = doc(db, "truckOrders", id_input.value);
    const containerRef = doc(db, "containerOrders", id_input.value);
    getDoc(carRef)
        .then((doc) => {
            if(doc.data()){
                const name = document.createElement("li");
                name.innerHTML = `<span>Họ và tên:</span><span> ${doc.data().fullName} </span>`;
                const email = document.createElement("li");
                email.innerHTML = `<span>Email:</span><span> ${doc.data().email} </span>`;
                const tel = document.createElement("li");
                tel.innerHTML = `<span>Số điện thoại: </span><span> ${doc.data().tel} </span>`
                const size = document.createElement("li");
                size.innerHTML = `<span>Kích thước:</span><span> ${doc.data().carSize} </span>`;
                const seat_type = document.createElement("li");
                seat_type.innerHTML = `<span>Loại ghế ngồi:</span><span> ${doc.data().carSeatType} </span>`;
                const car_feature = document.createElement("li");
                car_feature.innerHTML = `<span>Tiện nghi:</span><span> ${doc.data().carFeature} </span>`;
                const departure_Place = document.createElement("li");
                departure_Place.innerHTML = `<span>Nơi đi:</span><span> ${doc.data().departurePlace} </span>`;
                const arrive_Place = document.createElement("li");
                arrive_Place.innerHTML = `<span>Nơi đến:</span><span> ${doc.data().arrivePlace} </span>`;
                const departure_Time = document.createElement("li");
                departure_Time.innerHTML = `<span>Thời gian đi:</span><span> ${doc.data().departureTime} </span>`;
                const Price = document.createElement("li");
                Price.innerHTML = `<span>Giá:</span><span> ${doc.data().price} </span>`;
                const Progress_bar = document.createElement("li");
                Progress_bar.innerHTML = `<div class="progress"><div class="progress-done"></div></div>`;
                result.appendChild(name);
                result.appendChild(email);
                result.appendChild(tel);
                result.appendChild(size);
                result.appendChild(seat_type);
                result.appendChild(car_feature);
                result.appendChild(departure_Place);
                result.appendChild(arrive_Place);
                result.appendChild(departure_Time);
                result.appendChild(Price);
                result.appendChild(Progress_bar);
                changeWidth();
            }
        })
    getDoc(truckRef)
        .then((doc) => {
            if(doc.data()){
                const name = document.createElement("li");
                name.innerHTML = `<span>Họ và tên:</span><span> ${doc.data().fullName} </span>`;
                const email = document.createElement("li");
                email.innerHTML = `<span>Email:</span><span> ${doc.data().email} </span>`;
                const tel = document.createElement("li");
                tel.innerHTML = `<span>Số điện thoại: </span><span> ${doc.data().tel} </span>`;
                const car_Weight = document.createElement("li");
                car_Weight.innerHTML = `<span>Tải trọng:</span><span> ${doc.data().carWeight} </span>`;
                const car_Box_Type = document.createElement("li");
                car_Box_Type.innerHTML = `<span>Kiểu thùng xe:</span><span> ${doc.data().carBoxType} </span>`;
                const departure_Place = document.createElement("li");
                departure_Place.innerHTML = `<span>Nơi đi:</span><span> ${doc.data().departurePlace} </span>`;
                const arrive_Place = document.createElement("li");
                arrive_Place.innerHTML = `<span>Nơi đến:</span><span> ${doc.data().arrivePlace} </span>`;
                const departure_Time = document.createElement("li");
                departure_Time.innerHTML = `<span>Thời gian đi:</span><span> ${doc.data().departureTime} </span>`;
                const Price = document.createElement("li");
                Price.innerHTML = `<span>Giá:</span><span> ${doc.data().price} </span>`;
                result.appendChild(name);
                result.appendChild(email);
                result.appendChild(tel);
                result.appendChild(car_Weight);
                result.appendChild(car_Box_Type);
                result.appendChild(departure_Place);
                result.appendChild(arrive_Place);
                result.appendChild(departure_Time);
                result.appendChild(Price);
            }
        })
    getDoc(containerRef)
        .then((doc) => {
            if(doc.data()){
                const name = document.createElement("li");
                name.innerHTML = `<span>Họ và tên:</span><span> ${doc.data().fullName} </span>`;
                const email = document.createElement("li");
                email.innerHTML = `<span>Email:</span><span> ${doc.data().email} </span>`;
                const tel = document.createElement("li");
                tel.innerHTML = `<span>Số điện thoại: </span><span> ${doc.data().tel} </span>`
                const size = document.createElement("li");
                size.innerHTML = `<span>Kích thước:</span><span> ${doc.data().carSize} </span>`;
                const goods_Type = document.createElement("li");
                goods_Type.innerHTML = `<span>Loại hàng hóa:</span><span> ${doc.data().carGoodsType} </span>`;
                const Structure = document.createElement("li");
                Structure.innerHTML = `<span>Cấu tạo xe:</span><span> ${doc.data().carStructure} </span>`;
                const departure_Place = document.createElement("li");
                departure_Place.innerHTML = `<span>Nơi đi:</span><span> ${doc.data().departurePlace} </span>`;
                const arrive_Place = document.createElement("li");
                arrive_Place.innerHTML = `<span>Nơi đến:</span><span> ${doc.data().arrivePlace} </span>`;
                const departure_Time = document.createElement("li");
                departure_Time.innerHTML = `<span>Thời gian đi:</span><span> ${doc.data().departureTime} </span>`;
                const Price = document.createElement("li");
                Price.innerHTML = `<span>Giá:</span><span> ${doc.data().price} </span>`;
                result.appendChild(name);
                result.appendChild(email);
                result.appendChild(tel);
                result.appendChild(size);
                result.appendChild(goods_Type);
                result.appendChild(Structure);
                result.appendChild(departure_Place);
                result.appendChild(arrive_Place);
                result.appendChild(departure_Time);
                result.appendChild(Price);
            }
        })
})