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
var timeStart;
var timeEnd;
function changeWidth(){
    const progress = document.querySelector(".progress-done");
    const now = moment();
    const diff_Start__Now = timeStart.diff(now, 'second');
    const diff_Start__End = timeStart.diff(timeEnd, 'second');
    const diff_Now__end = now.diff(timeEnd, 'second');
    if(diff_Now__end <= 0){
        const percentage = (diff_Start__Now / diff_Start__End)*100;
        progress.style.width = `${Math.round(percentage)}%`;
        progress.innerHTML = `<i class="fa-solid fa-truck-moving fa-bounce"></i>`;
    }
    else{
        progress.style.width = `100%`;
        progress.innerHTML = `<i class="fa-solid fa-check"></i>`;
    }
}


//Function to search
const id_button = document.querySelector(".search__form button");
const id_input = document.querySelector("#search__input");
const result = document.querySelector(".search__result-list");
const searchResult = document.querySelector('.search__result');
const searchResultList = document.querySelector('.search__result-list');
const searchProgress = document.querySelector('.search__progress');
const searchProgressContent = document.querySelector('.search__progress-content');


id_button.addEventListener('click', async (e) => {
    e.preventDefault();
    searchResultList.innerHTML = '';
    searchProgressContent.innerHTML = '';
    searchResult.style.display = 'block';
    searchProgress.style.display = 'block';
    const carRef = doc(db, "carOrders", id_input.value);
    getDoc(carRef)
        .then((doc) => {
            if(doc.data().type == "Xe khách"){
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
                timeStart = moment(`${doc.data().departureDate} ${doc.data().departureTime}`, "YYYY-MM-DD HH:mm:ss");
                departure_Time.innerHTML = `<span>Thời gian đi:</span><span> ${timeStart} </span>`;
                const arrive_Time = document.createElement("li");
                timeEnd = moment(`${doc.data().arriveDate} ${doc.data().arriveTime}`, "YYYY-MM-DD HH:mm:ss");
                arrive_Time.innerHTML = `<span>Thời gian đến:</span> <span>${timeEnd}</span>`;
                const Price = document.createElement("li");
                Price.innerHTML = `<span>Giá:</span><span> ${doc.data().price} </span>`;
                result.appendChild(name);
                result.appendChild(email);
                result.appendChild(tel);
                result.appendChild(size);
                result.appendChild(seat_type);
                result.appendChild(car_feature);
                result.appendChild(departure_Place);
                result.appendChild(arrive_Place);
                result.appendChild(departure_Time);
                result.appendChild(arrive_Time);
                result.appendChild(Price);

                const Progress_bar = document.createElement("div");
                Progress_bar.classList.add('progress');
                Progress_bar.innerHTML = '<div class="progress-done"></div>';
                searchProgressContent.appendChild(Progress_bar);
                setInterval(changeWidth, 1000);
            }
            else if (doc.data().type == "Xe tải"){
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
                timeStart = moment(`${doc.data().departureDate} ${doc.data().departureTime}`, "YYYY-MM-DD HH:mm:ss");
                departure_Time.innerHTML = `<span>Thời gian đi:</span><span> ${timeStart} </span>`;
                const arrive_Time = document.createElement("li");
                timeEnd = moment(`${doc.data().arriveDate} ${doc.data().arriveTime}`, "YYYY-MM-DD HH:mm:ss");
                arrive_Time.innerHTML = `<span>Thời gian đến:</span> <span>${timeEnd}</span>`;
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
                result.appendChild(arrive_Time);
                result.appendChild(Price);
                
                const Progress_bar = document.createElement("div");
                Progress_bar.classList.add('progress');
                Progress_bar.innerHTML = '<div class="progress-done"></div>';
                searchProgressContent.appendChild(Progress_bar);
                setInterval(changeWidth, 1000);
            }
            else {
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
                timeStart = moment(`${doc.data().departureDate} ${doc.data().departureTime}`, "YYYY-MM-DD HH:mm:ss");
                departure_Time.innerHTML = `<span>Thời gian đi:</span><span> ${timeStart} </span>`;
                const arrive_Time = document.createElement("li");
                timeEnd = moment(`${doc.data().arriveDate} ${doc.data().arriveTime}`, "YYYY-MM-DD HH:mm:ss");
                arrive_Time.innerHTML = `<span>Thời gian đến:</span> <span>${timeEnd}</span>`;
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
                result.appendChild(arrive_Time);
                result.appendChild(Price);
                
                const Progress_bar = document.createElement("div");
                Progress_bar.classList.add('progress');
                Progress_bar.innerHTML = '<div class="progress-done"></div>';
                searchProgressContent.appendChild(Progress_bar);
                setInterval(changeWidth, 1000);
            }
        })
    // getDoc(truckRef)
    //     .then((doc) => {
    //         if(doc.data()){
    //             const name = document.createElement("li");
    //             name.innerHTML = `<span>Họ và tên:</span><span> ${doc.data().fullName} </span>`;
    //             const email = document.createElement("li");
    //             email.innerHTML = `<span>Email:</span><span> ${doc.data().email} </span>`;
    //             const tel = document.createElement("li");
    //             tel.innerHTML = `<span>Số điện thoại: </span><span> ${doc.data().tel} </span>`;
    //             const car_Weight = document.createElement("li");
    //             car_Weight.innerHTML = `<span>Tải trọng:</span><span> ${doc.data().carWeight} </span>`;
    //             const car_Box_Type = document.createElement("li");
    //             car_Box_Type.innerHTML = `<span>Kiểu thùng xe:</span><span> ${doc.data().carBoxType} </span>`;
    //             const departure_Place = document.createElement("li");
    //             departure_Place.innerHTML = `<span>Nơi đi:</span><span> ${doc.data().departurePlace} </span>`;
    //             const arrive_Place = document.createElement("li");
    //             arrive_Place.innerHTML = `<span>Nơi đến:</span><span> ${doc.data().arrivePlace} </span>`;
    //             const departure_Time = document.createElement("li");
    //             timeStart = moment(`${doc.data().departureDate} ${doc.data().departureTime}`, "YYYY-MM-DD HH:mm:ss");
    //             departure_Time.innerHTML = `<span>Thời gian đi:</span><span> ${timeStart} </span>`;
    //             const arrive_Time = document.createElement("li");
    //             timeEnd = moment(`${doc.data().arriveDate} ${doc.data().arriveTime}`, "YYYY-MM-DD HH:mm:ss");
    //             arrive_Time.innerHTML = `<span>Thời gian đến:</span> <span>${timeEnd}</span>`;
    //             const Price = document.createElement("li");
    //             Price.innerHTML = `<span>Giá:</span><span> ${doc.data().price} </span>`;
    //             result.appendChild(name);
    //             result.appendChild(email);
    //             result.appendChild(tel);
    //             result.appendChild(car_Weight);
    //             result.appendChild(car_Box_Type);
    //             result.appendChild(departure_Place);
    //             result.appendChild(arrive_Place);
    //             result.appendChild(departure_Time);
    //             result.appendChild(arrive_Time);
    //             result.appendChild(Price);
                
    //             const Progress_bar = document.createElement("div");
    //             Progress_bar.classList.add('progress');
    //             Progress_bar.innerHTML = '<div class="progress-done"></div>';
    //             searchProgressContent.appendChild(Progress_bar);
    //             setInterval(changeWidth, 1000);
    //         }
    //     })
    // getDoc(containerRef)
    //     .then((doc) => {
    //         if(doc.data()){
    //             const name = document.createElement("li");
    //             name.innerHTML = `<span>Họ và tên:</span><span> ${doc.data().fullName} </span>`;
    //             const email = document.createElement("li");
    //             email.innerHTML = `<span>Email:</span><span> ${doc.data().email} </span>`;
    //             const tel = document.createElement("li");
    //             tel.innerHTML = `<span>Số điện thoại: </span><span> ${doc.data().tel} </span>`
    //             const size = document.createElement("li");
    //             size.innerHTML = `<span>Kích thước:</span><span> ${doc.data().carSize} </span>`;
    //             const goods_Type = document.createElement("li");
    //             goods_Type.innerHTML = `<span>Loại hàng hóa:</span><span> ${doc.data().carGoodsType} </span>`;
    //             const Structure = document.createElement("li");
    //             Structure.innerHTML = `<span>Cấu tạo xe:</span><span> ${doc.data().carStructure} </span>`;
    //             const departure_Place = document.createElement("li");
    //             departure_Place.innerHTML = `<span>Nơi đi:</span><span> ${doc.data().departurePlace} </span>`;
    //             const arrive_Place = document.createElement("li");
    //             arrive_Place.innerHTML = `<span>Nơi đến:</span><span> ${doc.data().arrivePlace} </span>`;
    //             const departure_Time = document.createElement("li");
    //             timeStart = moment(`${doc.data().departureDate} ${doc.data().departureTime}`, "YYYY-MM-DD HH:mm:ss");
    //             departure_Time.innerHTML = `<span>Thời gian đi:</span><span> ${timeStart} </span>`;
    //             const arrive_Time = document.createElement("li");
    //             timeEnd = moment(`${doc.data().arriveDate} ${doc.data().arriveTime}`, "YYYY-MM-DD HH:mm:ss");
    //             arrive_Time.innerHTML = `<span>Thời gian đến:</span> <span>${timeEnd}</span>`;
    //             const Price = document.createElement("li");
    //             Price.innerHTML = `<span>Giá:</span><span> ${doc.data().price} </span>`;
    //             result.appendChild(name);
    //             result.appendChild(email);
    //             result.appendChild(tel);
    //             result.appendChild(size);
    //             result.appendChild(goods_Type);
    //             result.appendChild(Structure);
    //             result.appendChild(departure_Place);
    //             result.appendChild(arrive_Place);
    //             result.appendChild(departure_Time);
    //             result.appendChild(arrive_Time);
    //             result.appendChild(Price);
                
    //             const Progress_bar = document.createElement("div");
    //             Progress_bar.classList.add('progress');
    //             Progress_bar.innerHTML = '<div class="progress-done"></div>';
    //             searchProgressContent.appendChild(Progress_bar);
    //             setInterval(changeWidth, 1000);
    //         }
    //     })
})