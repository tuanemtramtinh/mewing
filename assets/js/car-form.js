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
    getDoc, updateDoc, arrayUnion
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

const car = document.querySelector('.car');
const carSizes = document.getElementsByName('luachon1');
const carSeatTypes = document.getElementsByName('luachon2');
const carFeatures = document.getElementsByName('luachon3');

const carFormFullname = document.querySelector('#car__fullname');
const carFormTel = document.querySelector('#car__tel');
const carFormEmail = document.querySelector('#car__email');
const carFormSize = document.querySelector('#car__size');
const carFormSeatType = document.querySelector('#car__seatType');
const carFormFeature = document.querySelector('#car__feature');
const departureDate = document.querySelector('.car__day');
const departureTime = document.querySelector('.car__time');
const departurePlace = document.querySelector('.car__start');
const arrivePlace = document.querySelector('.car__end');
const carForm = document.querySelector('.car__form form');
const carDriverList = document.querySelector('.car__driverList');


tripRegister.addEventListener('click', () => {

    const carSizeCheck = Array.from(carSizes).find((carSize) => carSize.checked);
    const carSeatTypeCheck = Array.from(carSeatTypes).find((carSeatType) => carSeatType.checked);
    const carFeatureCheck = Array.from(carFeatures).find((carFeature) => carFeature.checked);

    if (userAccount == null){
        alert('Vui lòng đăng nhập để thực hiện chức năng này');
        //location.reload();
    }
    else if (carSizeCheck && carSeatTypeCheck && carFeatureCheck){        
        const userDocRef = doc(db, 'users', userAccount.uid);

        getDoc(userDocRef)
            .then((doc) => {
                carFormFullname.value = doc.data().fullName;
                carFormTel.value = doc.data().tel;
                carFormEmail.value = doc.data().email;
                carFormSize.value = carSizeCheck.value;
                carFormSeatType.value = carSeatTypeCheck.value;
                carFormFeature.value = carFeatureCheck.value;
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



                //Kiểm tra tài xế có loại xe phù hợp hay không

                const q = query(collection(db, 'drivers'));
                getDocs(q).then((querySnapshot) => {
                    const driverList = querySnapshot.docs.map(async (doc) => {
                        let driver = {
                            driverId: doc.id,
                            driverName: doc.data().fullName,
                            driverLicense: doc.data().license,
                            driverTel: doc.data().tel,
                            schedule: doc.data().schedule
                        };
                
                        const subq = query(collection(db, `drivers/${doc.id}/Vehicles`));
                        const subQuerySnapshot = await getDocs(subq);
                
                        subQuerySnapshot.forEach((subDoc) => {
                            driver.carSize = subDoc.data().Size;
                            driver.carType = subDoc.data().Type;
                            driver.carID = subDoc.data().ID;
                            driver.maintaince = subDoc.data().maintaince;
                        });
                
                        return driver;
                    });
                    return Promise.all(driverList);
                }).then((driverList) => {

                    let flag = false;

                    console.log(flag);

                    const newBooking = {
                        departureTime: `${getDepartureDate}T${getDepartureTime}`,
                        arriveTime: `${arriveDate}T${arriveTime}`
                    }

                    const isDriverScheduleAvailable = (driver, newBooking) => {
                        for(var i = 0; i < driver.schedule.length; i++){
                            const start = driver.schedule[i].departureTime;
                            const end = driver.schedule[i].arriveTime;
                            if(newBooking.departureTime < end && newBooking.arriveTime > start){
                                return false;
                            }
                        }
                        return true;
                    }

                    const isVehicleScheduleAvailable = (driver, newBooking) => {
                        for(var i = 0; i < driver.maintaince.length; i++){
                            const start = driver.maintaince[i].time_start;
                            const end = driver.maintaince[i].time_end;
                            if(newBooking.departureTime < end && newBooking.arriveTime > start){
                                return false;
                            }
                        }
                        return true;
                    }

                    //Kiểm tra điều kiện của tài xế . Thêm điều kiện về kiểm tra lịch trình hiện tại, 
                    //Cái này chỉ mới kiểm tra kích thước của xe tài xế và kích thước xe khách chọn.

                    driverList.forEach((driver) => {
                        if (driver.carSize === carFormSize.value && isDriverScheduleAvailable(driver, newBooking) && isVehicleScheduleAvailable(driver, newBooking)){
                            const option =  document.createElement('option');
                            option.value = `${driver.driverId}:${driver.carID}`;
                            option.innerHTML = `${driver.driverName} - ${driver.driverTel}`;
                            carDriverList.appendChild(option);
                            flag = true;
                        }
                    });

                    if (flag == false) alert("Hiện tại không có tài xế");
                });

                return true;        
            }
            return false;
        });

        if (!(typeof checkStatus == 'undefined')){
            // console.log(document.querySelector('.car__price span'));
            const driverSelector = document.querySelector('.car__driver');
            driverSelector.style.display = "block";
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

carForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    console.log(carDriverList.value);   
    const carOrderId = crypto.randomUUID();
    const driverRef = doc(db, 'drivers', carDriverList.value.split(':')[0]);
    const newBooking = {
        departureTime: `${getDepartureDate}T${getDepartureTime}`,
        arriveTime: `${arriveDate}T${arriveTime}`
    }
    await updateDoc(driverRef, {
        schedule: arrayUnion(newBooking)
    })
    await setDoc(doc(db, 'carOrders', carOrderId), {
        driverId: carDriverList.value.split(':')[0],
        carId: carDriverList.value.split(':')[1],
        userId: userAccount.uid,
        fullName : carFormFullname.value,
        tel: carFormTel.value,
        email: carFormEmail.value,
        carSize: carFormSize.value,
        carSeatType: carFormSeatType.value,
        carFeature: carFormFeature.value,
        departureDate: departureDate.value,
        arriveDate: arriveDate,
        departureTime: departureTime.value,
        arriveTime: arriveTime,
        departurePlace: departurePlace.value,
        arrivePlace: arrivePlace.value,
        price: outputPrice,
        createdAt: serverTimestamp(),
        type: 'Xe khách'
    })
    alert(`Đặt xe thành công, mã đặt xe của bạn là ${carOrderId}`);
    window.location.href = 'index.html';
});