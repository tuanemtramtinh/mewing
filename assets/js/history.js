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


let historyOrder = [];
let userAccount = null;
const carRef = collection(db, 'carOrders');

const fetchData = async () => {

    const carQuery  = query(carRef, where('userId', '==', userAccount.uid));
    let array = [];
    const carSnapshot = await getDocs(carQuery);
    const promises = carSnapshot.docs.map(async (doc) => {
        const driverQuery = query(collection(db, 'drivers'));
        const driverSnapshot = await getDocs(driverQuery);
        // console.log(doc.data().driverId);
        const drivers = driverSnapshot.docs.map(i => ({ id: i.id, fullName: i.data().fullName }));
        const driver = drivers.find(i => i.id == doc.data().driverId);
        if (driver){
            array.push({ ...doc.data(), id: doc.id, driver: driver.fullName });
        }
    });
    await Promise.all(promises);
    return array;
};

const compareTime = (a, b) => {
    if (a.createdAt.seconds !== b.createdAt.seconds){
        return a.createdAt.seconds - b.createdAt.seconds;
    }

    return a.createdAt.nanoseconds - b.createdAt.nanoseconds;
}

const timeConvert = (a) => {
    const {seconds, nanoseconds} = a.createdAt;
    const totalMiliseconds = (seconds * 1000) + (nanoseconds / 1e6);
    const date = new Date(totalMiliseconds);
    date.setUTCHours(date.getUTCHours() + 7);
    // Extract year, month, and day
    const year = date.getUTCFullYear();
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const day = date.getUTCDate().toString().padStart(2, '0');
    // Extract hours and minutes
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}`;
    return formattedDateTime;
}

const carImageSource = 'assets/images/product-car.png';
const truckImageSource = 'assets/images/product-truck.png';
const containerImageSource = 'assets/images/product-container.png';

onAuthStateChanged(auth, (user) => {
    if(user){
        userAccount = user;
        fetchData()
        .then(async (array) => {
            historyOrder = array;
            historyOrder.sort(compareTime);
            historyOrder = historyOrder.map((value) => {
                const time = timeConvert(value).split(" ");
                return {
                    ...value,
                    orderDate: time[0],
                    orderTime: time[1],
                };
            });

            const orderHistoryList = document.querySelector('.orderHistory__list');

            console.log(historyOrder);

            historyOrder.forEach((value) => {
                
                //Item
                const orderHistoryItem = document.createElement('div');
                orderHistoryItem.classList.add('orderHistory__item');

                //Intro
                const orderHistoryIntro = document.createElement('ul');
                orderHistoryIntro.classList.add('orderHistory__intro');
                const orderId = document.createElement('li');
                orderId.innerHTML = `<div>Mã đơn hàng</div> <div>${value.id}</div>`;
                const orderDate = document.createElement('li');
                orderDate.innerHTML = `<div>Ngày đặt</div> <div>${value.orderDate}</div>`;
                const orderTime = document.createElement('li');
                orderTime.innerHTML = `<div>Thời gian</div> <div>${value.orderTime}</div>`;
                const price = document.createElement('li');
                price.innerHTML = `<div>Giá tiền</div> <div>${value.price}</div>`;
                orderHistoryIntro.appendChild(orderId);
                orderHistoryIntro.appendChild(orderDate);
                orderHistoryIntro.appendChild(orderTime);
                orderHistoryIntro.appendChild(price);

                //Desc
                const orderHistoryDesc = document.createElement('div');
                orderHistoryDesc.classList.add('orderHistory__desc');

                //Image
                const orderHistoryImage = document.createElement('div');
                orderHistoryImage.classList.add('orderHistory__image');
                const imageElement = document.createElement('img');
                const orderHistoryCarName = document.createElement('div');
                orderHistoryCarName.classList.add('orderHistory__carName');
                if (value.type === 'Xe khách'){
                    imageElement.src = carImageSource;
                    orderHistoryCarName.innerHTML = 'Xe khách';
                } 
                else if (value.type === 'Xe tải'){
                    imageElement.src = truckImageSource;
                    orderHistoryCarName.innerHTML = 'Xe tải';
                }
                else if (value.type === 'Xe container'){
                    imageElement.src = containerImageSource;
                    orderHistoryCarName.innerHTML = 'Xe container';
                }
                orderHistoryImage.appendChild(imageElement);
                orderHistoryImage.appendChild(orderHistoryCarName);

                //Content

                const orderHistoryContent = document.createElement('ul');
                orderHistoryContent.classList.add('orderHistory__content');
                orderHistoryContent.classList.add('grid');
                orderHistoryContent.classList.add('grid-cols-3');
                orderHistoryContent.classList.add('gap-[20px]');
                
                let orderContent;
                if (value.type === 'Xe khách'){
                    orderContent = {
                        driver: {
                            title : 'Tên tài xế',
                            driver : value.driver
                        },
                        type : {
                            title : 'Loại xe đặt',
                            type : value.type
                        },
                        size : {
                            title : 'Kích thước',
                            size : value.carSize,
                        },
                        seatType : {
                            title : 'Loại ghế',
                            seatType : value.carSeatType
                        },
                        feature : {
                            title : 'Tiện nghi',
                            feature : value.carFeature
                        },
                        departurePlace : {
                            title : 'Nơi đi',
                            departurePlace : value.departurePlace
                        },
                        arrivePlace : {
                            title : 'Nơi đến',
                            arrivePlace : value.arrivePlace
                        },
                        departureDate : {
                            title : 'Ngày đi',
                            departureDate : `${value.departureDate} - ${value.departureTime}`
                        },
                        arriveDate: {
                            title : 'Ngày đến',
                            arriveDate : `${value.arriveDate} - ${value.arriveTime}`
                        },
                        carId : {
                            title : 'Biển số xe',
                            carId : value.carId
                        }
                        
                    };
                }
                else if (value.type === 'Xe tải'){
                    orderContent = {
                        driver: {
                            title : 'Tên tài xế',
                            driver : value.driver
                        },
                        type : {
                            title : 'Loại xe đặt',
                            type : value.type
                        },
                        weight : {
                            title : 'Trọng lượng',
                            weight : value.carWeight,
                        },
                        boxType : {
                            title : 'Loại hộp',
                            boxType : value.carBoxType
                        },
                        departurePlace : {
                            title : 'Nơi đi',
                            departurePlace : value.departurePlace
                        },
                        arrivePlace : {
                            title : 'Nơi đến',
                            arrivePlace : value.arrivePlace
                        },
                        departureDate : {
                            title : 'Ngày đi',
                            departureDate : `${value.departureDate} - ${value.departureTime}`
                        },
                        arriveDate: {
                            title : 'Ngày đến',
                            arriveDate : `${value.arriveDate} - ${value.arriveTime}`
                        },
                        carId : {
                            title : 'Biển số xe',
                            carId : value.carId
                        }
                        
                    };
                }
                else{
                    orderContent = {
                        driver: {
                            title : 'Tên tài xế',
                            driver : value.driver
                        },
                        type : {
                            title : 'Loại xe đặt',
                            type : value.type
                        },
                        size : {
                            title : 'Kích thước',
                            size : value.carSize,
                        },
                        goodsType : {
                            title : 'Loại hàng hoá',
                            goodsType : value.carGoodsType
                        },
                        structure : {
                            title : 'Cấu trúc',
                            structure : value.carStructure
                        },
                        departurePlace : {
                            title : 'Nơi đi',
                            departurePlace : value.departurePlace
                        },
                        arrivePlace : {
                            title : 'Nơi đến',
                            arrivePlace : value.arrivePlace
                        },
                        departureDate : {
                            title : 'Ngày đi',
                            departureDate : `${value.departureDate} - ${value.departureTime}`
                        },
                        arriveDate: {
                            title : 'Ngày đến',
                            arriveDate : `${value.arriveDate} - ${value.arriveTime}`
                        },
                        carId : {
                            title : 'Biển số xe',
                            carId : value.carId
                        }
                    };
                }

                for (var key in orderContent){
                    const liElement = document.createElement('li');
                    const divFirstElement = document.createElement('div');
                    const divSecondElement = document.createElement('div'); 
                    divFirstElement.innerHTML = orderContent[key].title;
                    divSecondElement.innerHTML = orderContent[key][key];
                    liElement.appendChild(divFirstElement);
                    liElement.appendChild(divSecondElement);
                    orderHistoryContent.appendChild(liElement);
                }

                orderHistoryDesc.appendChild(orderHistoryImage);
                orderHistoryDesc.appendChild(orderHistoryContent);
                
                orderHistoryItem.appendChild(orderHistoryIntro);
                orderHistoryItem.appendChild(orderHistoryDesc);

                console.log(orderHistoryItem);
               
                orderHistoryList.appendChild(orderHistoryItem);


            });

            
            
            
        });
    }
})




