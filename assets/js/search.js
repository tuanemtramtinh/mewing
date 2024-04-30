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

//Function to search
var timeStart;
var timeEnd;
const id_button = document.querySelector(".search__form button");
const id_input = document.querySelector("#search__input");
const result = document.querySelector(".search__result-list");
const searchResult = document.querySelector('.search__result');
const searchResultList = document.querySelector('.search__result-list');
const searchProgress = document.querySelector('.search__progress');
const searchProgressContent = document.querySelector('.search__progress-content');

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

function resetDisplay() {
    searchResultList.innerHTML = '';
    searchProgressContent.innerHTML = '';
    searchResult.style.display = 'block';
    searchProgress.style.display = 'block';
}

function padToTwoDigits(number) {
    return number.toString().padStart(2, '0');
}


function formatDateAndTime(date, time) {
    const fullDate = new Date(`${date} ${time}:00`);
    return formatDateTime(fullDate);
}

function formatDateTime(date) {
    const dayNames = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
    const monthNames = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
    
    return `${dayNames[date.getDay()]}, ngày ${padToTwoDigits(date.getDate())}/${padToTwoDigits(monthNames[date.getMonth()])}/${date.getFullYear()} ${padToTwoDigits(date.getHours())}:${padToTwoDigits(date.getMinutes())}:${padToTwoDigits(date.getSeconds())}`;
}

function createElementWithText(label, text) {
    const element = document.createElement("li");
    element.innerHTML = `<span>${label}:</span><span> ${text}</span>`;
    return element;
}


id_button.addEventListener('click', async (e) => {  
    e.preventDefault();
    const carRef = doc(db, "carOrders", id_input.value);
    getDoc(carRef)
        .then((doc) => {
            if(!doc.exists()){
                alert("Nhập sai id của đơn");
            }
            else{
                resetDisplay();
                if(doc.data().type == "Xe khách"){
                    const element_name = ['Họ và tên: ', 'Email: ', 'Số điện thoại: ', 'Kích thước: ', 'Loại ghế ngồi: ', 'Tiện nghi: ', 'Nơi đi: ', 'Nơi đến: ', 'Thời gian đi: ', 'Thời gian đến: ', 'Giá: '];
                    const doc_datas = [doc.data().fullName, doc.data().email, doc.data().tel, doc.data().carSize, doc.data().carSeatType, doc.data().carFeature, doc.data().departurePlace, doc.data().arrivePlace, formatDateAndTime(doc.data().departureDate, doc.data().departureTime), formatDateAndTime(doc.data().arriveDate, doc.data().arriveTime), doc.data().price];
                    for(var i = 0; i < element_name.length; i++){
                        const new_element = createElementWithText(element_name[i], doc_datas[i]);
                        result.appendChild(new_element);
                    }
    
                    timeStart = moment(`${doc.data().departureDate} ${doc.data().departureTime}`, "YYYY-MM-DD HH:mm:ss");
                    timeEnd = moment(`${doc.data().arriveDate} ${doc.data().arriveTime}`, "YYYY-MM-DD HH:mm:ss");
                    const Progress_bar = document.createElement("div");
                    Progress_bar.classList.add('progress');
                    Progress_bar.innerHTML = '<div class="progress-done"></div>';
                    searchProgressContent.appendChild(Progress_bar);
                    setInterval(changeWidth, 1000);
                }
                else if (doc.data().type == "Xe tải"){
                    const element_name = ['Họ và tên: ', 'Email: ', 'Số điện thoại: ', 'Tải trọng: ', 'Kiểu thùng xe: ', 'Nơi đi: ', 'Nơi đến: ', 'Thời gian đi: ', 'Thời gian đến: ', 'Giá: '];
                    const doc_datas = [doc.data().fullName, doc.data().email, doc.data().tel, doc.data().carWeight, doc.data().carBoxType, doc.data().departurePlace, doc.data().arrivePlace, formatDateAndTime(doc.data().departureDate, doc.data().departureTime), formatDateAndTime(doc.data().arriveDate, doc.data().arriveTime), doc.data().price];
                    for(var i = 0; i < element_name.length; i++){
                        const new_element = createElementWithText(element_name[i], doc_datas[i]);
                        result.appendChild(new_element);
                    }
                    
                    timeStart = moment(`${doc.data().departureDate} ${doc.data().departureTime}`, "YYYY-MM-DD HH:mm:ss");
                    timeEnd = moment(`${doc.data().arriveDate} ${doc.data().arriveTime}`, "YYYY-MM-DD HH:mm:ss");
                    const Progress_bar = document.createElement("div");
                    Progress_bar.classList.add('progress');
                    Progress_bar.innerHTML = '<div class="progress-done"></div>';
                    searchProgressContent.appendChild(Progress_bar);
                    setInterval(changeWidth, 1000);
                }
                else {
                    const element_name = ['Họ và tên: ', 'Email: ', 'Số điện thoại: ', 'Kích thước: ', 'Loại hàng hóa: ', 'Cấu tạo xe: ', 'Nơi đi: ', 'Nơi đến: ', 'Thời gian đi: ', 'Thời gian đến: ', 'Giá: '];
                    const doc_datas = [doc.data().fullName, doc.data().email, doc.data().tel, doc.data().carSize, doc.data().carGoodsType, doc.data().carStructure, doc.data().departurePlace, doc.data().arrivePlace, formatDateAndTime(doc.data().departureDate, doc.data().departureTime), formatDateAndTime(doc.data().arriveDate, doc.data().arriveTime), doc.data().price];
                    for(var i = 0; i < element_name.length; i++){
                        const new_element = createElementWithText(element_name[i], doc_datas[i]);
                        result.appendChild(new_element);
                    }
    
                    timeStart = moment(`${doc.data().departureDate} ${doc.data().departureTime}`, "YYYY-MM-DD HH:mm:ss");
                    timeEnd = moment(`${doc.data().arriveDate} ${doc.data().arriveTime}`, "YYYY-MM-DD HH:mm:ss");
                    const Progress_bar = document.createElement("div");
                    Progress_bar.classList.add('progress');
                    Progress_bar.innerHTML = '<div class="progress-done"></div>';
                    searchProgressContent.appendChild(Progress_bar);
                    setInterval(changeWidth, 1000);
                }
            }
        })
})