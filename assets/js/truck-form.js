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

const car = document.querySelector('.car');


const carWeights = document.getElementsByName('luachon1');
const carBoxTypes = document.getElementsByName('luachon2');

const carFormFullname = document.querySelector('#car__fullname');
const carFormTel = document.querySelector('#car__tel');
const carFormEmail = document.querySelector('#car__email');

const carFormWeight = document.querySelector('#car__weight');
const carFormBoxType = document.querySelector('#car__boxType');

const departureDate = document.querySelector('.car__day');
const departureTime = document.querySelector('.car__time');
const departurePlace = document.querySelector('.car__start');
const arrivePlace = document.querySelector('.car__end');
const carForm = document.querySelector('.car__form form');
const carDriverList = document.querySelector('.car__driverList');
const driverSelector = document.querySelector('.car__driver');
tripRegister.addEventListener('click', () => {

    const carWeightCheck = Array.from(carWeights).find((carWeight) => carWeight.checked);
    const carBoxTypeCheck = Array.from(carBoxTypes).find((carBoxType) => carBoxType.checked);

    if (userAccount == null){
        alert('Vui lòng đăng nhập để thực hiện chức năng này');
        //location.reload();
    }
    else if (carWeightCheck && carBoxTypeCheck){
        //console.log(carSizeCheck, carSeatTypeCheck, carFeatureCheck);
        
        const userDocRef = doc(db, 'users', userAccount.uid);

        getDoc(userDocRef)
            .then((doc) => {
                carFormFullname.value = doc.data().fullName;
                carFormTel.value = doc.data().tel;
                carFormEmail.value = doc.data().email;
                carFormWeight.value = carWeightCheck.value;
                carFormBoxType.value = carBoxTypeCheck.value;
            });


        car.style.display = "flex";

        
    }
    else{
        alert('Hãy nhập đầy đủ các ô');
    }

});

cancelButton.addEventListener('click', () => {
    car.style.display = "none";
    driverSelector.style.display = 'none';
    carDriverList.innerHTML = '';
    document.querySelector('.car__price span').innerHTML = '';
    document.querySelector('.car__price').style.display = 'none';
    departureDate.value = '';
    departureTime.value = '';
    departurePlace.value = 'TPHCM';
    arrivePlace.value = 'TPHCM';
    getDepartureDate = undefined;
    getDepartureTime = undefined;
    outputPrice = undefined;
    arriveTime = undefined;
    arriveDate = undefined;
});

const startEndPrice =
[
    {
        start: 'TPHCM',
        end: 'VUNGTAU',
        time: '1:45',
        small: {
            price: '750.000 VND'
        },
        big: {
            price: '1.500.000 VND'
        }
    },
    {
        start: 'TPHCM',
        end: 'NHATRANG',
        time: '7:30',
        small : {
            price: '2.800.000 VND'
        },
        big : {
            price: '5.200.000 VND'
        }
    },
    {
        start: 'VUNGTAU',
        end: 'NHATRANG',
        time: '7:00',
        small : {
            price: '2.800.000 VND'
        },
        big : {
            price: '4.900.000 VND'
        }
    },
    {
        start: 'VUNGTAU',
        end: 'TPHCM',
        time: '1:45',
        small: {
            price: '750.000 VND'
        },
        big: {
            price: '1.500.000 VND'
        }
    },
    {
        start: 'NHATRANG',
        end: 'TPHCM',
        time: '7:30',
        small : {
            price: '2.800.000 VND'
        },
        big : {
            price: '5.200.000 VND'
        }
    },
    {
        start: 'NHATRANG',
        end: 'VUNGTAU',
        time: '7:00',
        small : {
            price: '2.800.000 VND'
        },
        big : {
            price: '4.900.000 VND'
        }
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
                if (carFormWeight.value.split(' ')[2] === 'nhẹ' || carFormWeight.value.split(' ')[2] === 'trung'){
                    outputPrice = item.small.price;
                }
                else{
                    outputPrice = item.big.price;
                }
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
                            driver.carWeight = subDoc.data().Weight;
                            driver.carType = subDoc.data().Type;
                            driver.carID = subDoc.data().ID;
                            driver.maintaince = subDoc.data().maintaince;
                        });
                
                        return driver;
                    });
                    return Promise.all(driverList);
                }).then((driverList) => {

                    // let flag = false;

                    const newBooking = {
                        departureTime: `${getDepartureDate}T${getDepartureTime}`,
                        arriveTime: `${arriveDate}T${arriveTime}`
                    }

                    const isDriverScheduleAvailable = (driver, newBooking) => {
                        for(var i = 0; i < driver.schedule.length; i++){
                            const start = driver.schedule[i].departureTime;
                            const end = driver.schedule[i].arriveTime;
                            if(newBooking.departureTime < end && newBooking.arriveTime > start){
                                console.log('Hello1')
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
                                console.log('Hello2')
                                return false;
                            }
                        }
                        return true;
                    }


                    //Kiểm tra điều kiện của tài xế . Thêm điều kiện về kiểm tra lịch trình hiện tại, 
                    //Cái này chỉ mới kiểm tra kích thước của xe tài xế và kích thước xe khách chọn.

                    // console.log(carDriverList.children.length);

                    console.log(newBooking);

                    if (carDriverList.children.length == 0){
                        let flag = false;
                        driverList.forEach((driver) => {
                            if (driver.carWeight === carFormWeight.value && isDriverScheduleAvailable(driver, newBooking) && isVehicleScheduleAvailable(driver, newBooking)){
                                const option =  document.createElement('option');
                                option.value = `${driver.driverId}:${driver.carID}`;
                                option.innerHTML = `${driver.driverName} - ${driver.driverTel}`;
                                carDriverList.appendChild(option);
                                flag = true;
                            }
                        });
    
                        if (flag == false){
                            alert("Hiện tại không có tài xế");
                            window.location.reload();
                        }
                    }

                    
                });

                    return true;        
                }
                return false;
            });

        if (!(typeof checkStatus == 'undefined')){
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

carForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const carOrderId = crypto.randomUUID();
    
    setDoc(doc(db, 'carOrders', carOrderId), {
        driverId: carDriverList.value.split(':')[0],
        carId: carDriverList.value.split(':')[1],
        userId: userAccount.uid,
        fullName : carFormFullname.value,
        tel: carFormTel.value,
        email: carFormEmail.value,
        carWeight: carFormWeight.value,
        carBoxType: carFormBoxType.value,
        departureDate: departureDate.value,
        arriveDate: arriveDate,
        departureTime: departureTime.value,
        arriveTime: arriveTime,
        departurePlace: departurePlace.value,
        arrivePlace: arrivePlace.value,
        price: outputPrice,
        createdAt: serverTimestamp(),
        type : 'Xe tải'
    })

    .then(() => {
        alert(`Đặt xe thành công, mã đặt xe của bạn là ${carOrderId}`);
        window.location.href = 'index.html';
    })

});