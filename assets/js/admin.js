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


//History--------------------------------------------------------------------------

const fetchData = async (userAccount) => {

    const carQuery  = query(collection(db, 'carOrders'), where('userId', '==', userAccount));
    let array = [];
    const carSnapshot = await getDocs(carQuery);
    const promises = carSnapshot.docs.map(async (doc) => {
        const driverQuery = query(collection(db, 'drivers'));
        const driverSnapshot = await getDocs(driverQuery);
        // console.log(doc.data().driverId);
        const drivers = driverSnapshot.docs.map(i => ({ id: i.id, fullName: i.data().fullName, tel: i.data().tel }));
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


//History--------------------------------------------------------------------------
const carImageSource = 'assets/images/product-car.png';
const truckImageSource = 'assets/images/product-truck.png';
const containerImageSource = 'assets/images/product-container.png';
const userListButton = document.querySelector('.adminSection1__userListButton');
const driverListButton = document.querySelector('.adminSection1__userListDriver');
const addDriverButton = document.querySelector('.adminSection1__addDriverButton');
const statisticButton = document.querySelector('.adminSection1__statistic');
const repairButton = document.querySelector('.adminSection1__repairButton');
const repairListButton = document.querySelector('.adminSection1__repairListButton');

const userListFunc = document.querySelector('.adminSection1__userList');

const addDriver = document.querySelector('.adminSection1__addDriver');

const driverListFunc = document.querySelector('.adminSection1__driverList');

const maintainListFunc = document.querySelector('.adminSection1__repairCarList');

const statisticList = document.querySelector('.adminSection1__statisticList');

const repair = document.querySelector('.adminSection1__repair');

const adminSection1__repairCarItemList = document.querySelector('.adminSection1__repairCarItemList');

const popupHistory = document.querySelector('.popupHistory');

const popupHistoryCancelButton = document.querySelector('.popupHistory__cancel-button');

popupHistoryCancelButton.addEventListener('click', () => {
    popupHistory.style.display = 'none';
});

userListButton.addEventListener('click', () => {
    userListButton.classList.add('adminSection1__button-modified');
    driverListButton.className = 'adminSection1__userListDriver';
    addDriverButton.className = 'adminSection1__addDriverButton';
    statisticButton.className = 'adminSection1__statistic';
    repairButton.className = 'adminSection1__repairButton';
    repairListButton.className = 'adminSection1__repairListButton';
    adminSection1__repairCarItemList.innerHTML = '';
    userListFunc.innerHTML = '';
    userListFunc.style.display = "block";
    addDriver.style.display = "none";
    driverListFunc.style.display = "none";
    driverListFunc.innerHTML ='';
    statisticList.style.display = 'none';
    repair.style.display = 'none';
    maintainListFunc.style.display = 'none';

    const userRef = collection(db, 'users');

    getCountFromServer(userRef).then((snapshot) => {
        const numOfUserDiv = document.createElement('div');
        numOfUserDiv.classList.add('adminSection1__userCount')
        numOfUserDiv.innerHTML = `<span>Tổng số lượng người dùng: </span><span>${snapshot.data().count}</span>`;
        userListFunc.appendChild(numOfUserDiv);
    })
    .then(() => {
        let userList = [];
        getDocs(userRef)
        .then((snapshot) => {

            snapshot.docs.forEach((doc) => {
                userList.push({...doc.data(), id : doc.id});
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
                const button = document.createElement('i');
                button.classList.add("fa-solid");
                button.classList.add("fa-chevron-right");
                button.classList.add("popupHistory-button");
                
                let ulElement = document.createElement('ul');
                ulElement.classList.add('adminSection1__userInfo');
                ulElement.appendChild(username);
                ulElement.appendChild(fullname);
                ulElement.appendChild(tel);
                ulElement.appendChild(email);
                ulElement.appendChild(button);
                ulUserList.push(ulElement);
            });
            const userListDiv = document.querySelector('.adminSection1__userList');
            ulUserList.forEach((element) => {
                userListDiv.appendChild(element);
            });


            const popupHistoryButtons = document.querySelectorAll('.popupHistory-button');

            popupHistoryButtons.forEach((button, index) => {
                button.addEventListener('click', () => {
                    document.querySelector('.orderHistory__list').innerHTML = '';
                    popupHistory.style.display = 'flex';
                    fetchData(userList[index].id)
                    .then((array) => {
                        let historyOrder = [];
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
                        historyOrder = historyOrder.reverse();
                        const orderHistoryList = document.querySelector('.orderHistory__list');

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
                                    driverTel: {
                                        title : 'Số điện thoại tài xế',
                                        driverTel : value.driverTel
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
                                    driverTel: {
                                        title : 'Số điện thoại tài xế',
                                        driverTel : value.driverTel
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
                                    driverTel: {
                                        title : 'Số điện thoại tài xế',
                                        driverTel : value.driverTel
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

                            orderHistoryList.appendChild(orderHistoryItem);
                        });           
                    });
                });
            });
        });
    });
});

addDriverButton.addEventListener('click', () => {

    userListButton.className='adminSection1__userListButton';
    driverListButton.className = 'adminSection1__userListDriver';
    addDriverButton.classList.add('adminSection1__button-modified');
    statisticButton.className = 'adminSection1__statistic';
    repairButton.className = 'adminSection1__repairButton';
    repairListButton.className = 'adminSection1__repairListButton';
    adminSection1__repairCarItemList.innerHTML = '';
    userListFunc.style.display = "none";
    userListFunc.innerHTML = '';
    addDriver.style.display = "flex";
    driverListFunc.style.display = "none";
    driverListFunc.innerHTML ='';
    statisticList.style.display = 'none';
    repair.style.display = 'none';
    maintainListFunc.style.display = 'none';

    const fullname = document.querySelector('#adminSection1__driverName');
    const id = document.querySelector('#adminSection1__driverID');
    const tel = document.querySelector('#adminSection1__driverTel');
    const carType = document.querySelector('#adminSection1__driverCarType');

    const car = document.querySelector('.adminSection1__driverCarTypeCar');
    const truck = document.querySelector('.adminSection1__driverCarTypeTruck');
    const container = document.querySelector('.adminSection1__driverCarTypeContainer');

    const updateDisplay = () => {
        if (carType.value === 'Xe khách'){
            car.style.display = "flex";
            truck.style.display = "none";
            container.style.display = "none";
        }
        else if (carType.value === 'Xe tải'){
            car.style.display = "none";
            truck.style.display = "flex";
            container.style.display = "none";
        }
        else{
            car.style.display = "none";
            truck.style.display = "none";
            container.style.display = "flex";
        }
    };
    
    carType.addEventListener('change', updateDisplay);
    updateDisplay();    

});

const add__Driver_button = document.querySelector("#add__Driver");
const adminSection1__driverName = document.querySelector("#adminSection1__driverName");
const adminSection1__driverTel = document.querySelector("#adminSection1__driverTel");
const adminSection1__driverCarType = document.querySelector("#adminSection1__driverCarType");
const adminSection1__driverCarTypeCarSize = document.querySelector("#adminSection1__driverCarTypeCarSize");
const adminSection1__driverCarTypeTruckWeight = document.querySelector("#adminSection1__driverCarTypeTruckWeight");
const adminSection1__driverCarTypeContainerSize = document.querySelector("#adminSection1__driverCarTypeContainerSize");
const adminSection1__driverLicense = document.querySelector("#adminSection1__driverLicense");
const adminSection1__driverCarId = document.querySelector("#adminSection1__driverCarId");

function create_UUID(){
    var dt = new Date().getTime();
    var uuid = '';
    for (var i = 0; i < 8; i++) {
        var r = Math.floor(Math.random() * 10);
        uuid += r; 
    }
    return uuid;
}


add__Driver_button.addEventListener('click', async (event) => {
    event.preventDefault();
    const driver_collection = collection(db, 'drivers');
    const driver_Name = adminSection1__driverName.value;
    const driver_ID = create_UUID();
    const driver_Tel = adminSection1__driverTel.value;
    const car_Type = adminSection1__driverCarType.value;
    const driver_License = adminSection1__driverLicense.value;
    let car_Size;
    const car_ID = adminSection1__driverCarId.value;;
    let truck_Weight;
    let container_Size;

    try {
        await setDoc(doc(db, 'drivers', driver_ID), {
            fullName: driver_Name,
            tel: driver_Tel,
            license: driver_License,
            schedule: [],
        });

        let subCollectionRef = collection(db, `drivers/${driver_ID}/Vehicles`);

        let vehicleData;

        switch(car_Type) {
            case "Xe khách":
                car_Size = adminSection1__driverCarTypeCarSize.value;
                
                vehicleData = { Type: car_Type, Size: car_Size, ID: car_ID , maintaince:[]};
                break;
            case "Xe tải":
                truck_Weight = adminSection1__driverCarTypeTruckWeight.value;
                vehicleData = { Type: car_Type, Weight: truck_Weight, ID: car_ID , maintaince:[]};
                break;
            case "Xe container":
                container_Size = adminSection1__driverCarTypeContainerSize.value;
                vehicleData = { Type: car_Type, Size: container_Size, ID: car_ID , maintaince:[]};
                break;
            default:
                throw new Error("Invalid car type");
        }

        await addDoc(subCollectionRef, vehicleData);
        alert(`Thêm tài xế thành công, mã định danh của tài xế là ${driver_ID}`);
        console.log('Vehicle data added successfully');
        
        window.location.reload(); 

    } catch (error) {
        console.error("Error adding driver or vehicle data: ", error);
    }
});

const fetchDataDriver = async (driverID) => {

    const carQuery  = query(collection(db, 'carOrders'), where('driverId', '==', driverID));
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


driverListButton.addEventListener('click', async () => {

    userListButton.className='adminSection1__userListButton';
    driverListButton.classList.add('adminSection1__button-modified');
    addDriverButton.className = 'adminSection1__addDriverButton';
    statisticButton.className = 'adminSection1__statistic';
    repairButton.className = 'adminSection1__repairButton';
    repairListButton.className = 'adminSection1__repairListButton';
    adminSection1__repairCarItemList.innerHTML = '';
    driverListFunc.innerHTML = '';
    driverListFunc.style.display = "block";
    addDriver.style.display = "none";
    userListFunc.style.display = 'none';
    userListFunc.innerHTML = '';
    statisticList.style.display = 'none';
    repair.style.display = 'none';
    maintainListFunc.style.display = 'none';

    try {
        const driverRef = collection(db, 'drivers');
        const driverCount = await getCountFromServer(driverRef);
        const numOfDriverDiv = document.createElement('div');
        numOfDriverDiv.classList.add('adminSection1__userCount')
        numOfDriverDiv.innerHTML = `<span>Tổng số lượng tài xế: </span><span>${driverCount.data().count}</span>`;
        driverListFunc.appendChild(numOfDriverDiv);


        const driverSnapshot = await getDocs(driverRef);
        const driverList = driverSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        let ulDriverList = [];

        for (const driver of driverList) {
            const fullName = document.createElement('li');
            fullName.innerHTML = `<span>Họ và tên: </span><span>${driver.fullName}</span>`;
            const tel = document.createElement('li');
            tel.innerHTML = `<span>Số điện thoại: </span><span>${driver.tel}</span>`;
            

            let ulElement = document.createElement('ul');
            ulElement.classList.add('adminSection1__driverInfo');
            ulElement.appendChild(fullName);
            ulElement.appendChild(tel);

            const vehiclesRef = collection(db, `drivers/${driver.id}/Vehicles`);
            const vehiclesSnapshot = await getDocs(vehiclesRef);
            const vehicleList = vehiclesSnapshot.docs.map(doc => doc.data());

            if (vehicleList.length > 0) {
                for (const vehicle of vehicleList) {
                    const vehicleType = document.createElement('li');
                    vehicleType.innerHTML = `<span>Loại xe: </span><span>${vehicle.Type}</span>`;
                    const vehicleWeight = document.createElement('li');
                    
                    if (vehicle.Type == 'Xe khách' || vehicle.Type == 'Xe container'){
                        vehicleWeight.innerHTML = `<span>Kích thước: </span><span>${vehicle.Size}</span>`;
                    }
                    else{
                        vehicleWeight.innerHTML = `<span>Trọng lượng: </span><span>${vehicle.Weight}</span>`;
                    }
                    const vehicleId = document.createElement('li');
                    vehicleId.innerHTML = `<span>Biển số xe: </span><span>${vehicle.ID}</span>`;
                    // let ulVehicleElement = document.createElement('ul');
                    // ulVehicleElement.classList.add('adminSection1__driverInfo');
                    ulElement.appendChild(vehicleType);
                    ulElement.appendChild(vehicleWeight);
                    ulElement.appendChild(vehicleId);

                    // ulElement.appendChild(ulVehicleElement);
                }
            }
            const license = document.createElement('li');
            license.innerHTML = `<span>Giấy phép lái xe: </span><span>${driver.license}</span>`;
            ulElement.appendChild(license);
            const button = document.createElement('i');
            button.classList.add("fa-solid");
            button.classList.add("fa-chevron-right");
            button.classList.add("popupHistory-button");
            ulElement.appendChild(button);
            ulDriverList.push(ulElement);
        }

        const driverListDiv = document.querySelector('.adminSection1__driverList');
        ulDriverList.forEach((element) => {
            driverListDiv.appendChild(element);
        });

        console.log(driverList);

        const popupHistoryButtons = document.querySelectorAll('.popupHistory-button');
        popupHistoryButtons.forEach((button, index) => {
            button.addEventListener('click', () => {
                document.querySelector('.orderHistory__list').innerHTML = '';
                popupHistory.style.display = 'flex';
                fetchDataDriver(driverList[index].id)
                .then((array) => {
                    let historyOrder = [];
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
                    historyOrder = historyOrder.reverse();
                    const orderHistoryList = document.querySelector('.orderHistory__list');

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
                                customer: {
                                    title : 'Tên khách hàng',
                                    customer : value.fullName
                                },
                                tel: {
                                    title : 'Số điện thoại khách',
                                    tel : value.tel
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
                            };
                        }
                        else if (value.type === 'Xe tải'){
                            orderContent = {
                                customer: {
                                    title : 'Tên khách hàng',
                                    customer : value.fullName
                                },
                                tel: {
                                    title : 'Số điện thoại khách',
                                    tel : value.tel
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
                            };
                        }
                        else{
                            orderContent = {
                                customer: {
                                    title : 'Tên khách hàng',
                                    customer : value.fullName
                                },
                                tel: {
                                    title : 'Số điện thoại khách',
                                    tel : value.tel
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

                        orderHistoryList.appendChild(orderHistoryItem);
                    });  
                })
            });
        })


    } catch (error) {
        console.error("Error fetching driver or vehicle data: ", error);
    }
});

const sortByMonth = (async () => {
    const carQuery = query(collection(db, 'carOrders'));
    const carSnapshot = await getDocs(carQuery);
    const currentYear = new Date().getFullYear();
    let groupedData = {
        January : {
            count: 0,
            price: 0
        },
        Feburary : {
            count: 0,
            price: 0
        },
        March: {
            count: 0,
            price: 0
        },
        April: {
            count: 0,
            price: 0
        },
        May: {
            count: 0,
            price: 0
        },
        June: {
            count: 0,
            price: 0
        },
        July: {
            count: 0,
            price: 0
        },
        August: {
            count: 0,
            price: 0
        },
        September: {
            count: 0,
            price: 0
        },
        October: {
            count: 0,
            price: 0
        },
        November: {
            count: 0,
            price: 0
        },
        December: {
            count: 0,
            price: 0
        }
    }; // Change the variable name to groupedData

    carSnapshot.forEach((doc) => {
        const getDate = new Date(doc.data().createdAt.seconds * 1000 + doc.data().createdAt.nanoseconds / 1000000);
        const month = getDate.toLocaleString('default', { month: 'long' }); // Get the month name (e.g., January, February)
        if (getDate.getFullYear() == currentYear){
            let price = parseInt(doc.data().price.split(' ')[0].replace(/\./g, '')); //Bỏ dấu . trong giá
            groupedData[month].price += price;
            groupedData[month].count += 1;
        }
    });

    let monthlyRevenue = [];
    for (const item in groupedData){
        monthlyRevenue.push({
            month: item,
            price : groupedData[item].price,
            count: groupedData[item].count
        })
    }
    return monthlyRevenue;
})

const sortByWeek = (async () => {
    const carQuery = query(collection(db, 'carOrders'));
    const carSnapshot = await getDocs(carQuery);
    let array = [];
    const today = new Date();
    const currentWeekStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
    const currentWeekEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate() + (6 - today.getDay()));;
    let groupedData = {
        Sunday: {
            price: 0,
            count: 0
        },
        Monday : {
            price: 0,
            count: 0
        },
        Tuesday: {
            price: 0,
            count: 0
        },
        Wednesday: {
            price: 0,
            count: 0
        },
        Thursday: {
            price: 0,
            count: 0
        },
        Friday: {
            price: 0,
            count: 0
        },
        Saturday: {
            price: 0,
            count: 0
        },
    };
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    carSnapshot.forEach((doc) => {
        const getDate = new Date(doc.data().createdAt.seconds * 1000 + doc.data().createdAt.nanoseconds / 1000000);
        const day = getDate.getDay();
        if (getDate >= currentWeekStart && getDate <= currentWeekEnd){
            let price = parseInt(doc.data().price.split(' ')[0].replace(/\./g, '')); //Bỏ dấu . trong giá
            groupedData[daysOfWeek[day]].price += price;
            groupedData[daysOfWeek[day]].count += 1;
        }
    });
    let weeklyRevenue = [];
    for (const day in groupedData){
        weeklyRevenue.push({
            day: day,
            price: groupedData[day].price,
            count: groupedData[day].count,
        });
    }
    return weeklyRevenue;
});

const sortByMonthAndWeek = (async () => {
    const monthlyRevenue = await sortByMonth();
    const weeklyRevenue = await sortByWeek();
    return {monthlyRevenue, weeklyRevenue};
});

let myChart;

sortByMonthAndWeek()
.then(({ monthlyRevenue, weeklyRevenue }) => {
    statisticButton.addEventListener('click', async () => {

        userListButton.className='adminSection1__userListButton';
        driverListButton.className='adminSection1__userListDriver';
        addDriverButton.className = 'adminSection1__addDriverButton';
        statisticButton.classList.add('adminSection1__button-modified');
        repairButton.className = 'adminSection1__repairButton';
        repairListButton.className = 'adminSection1__repairListButton';
        adminSection1__repairCarItemList.innerHTML = '';
        statisticList.style.display = 'block';
        userListFunc.style.display = 'none';
        userListFunc.innerHTML = '';
        driverListFunc.style.display = 'none';
        driverListFunc.innerHTML = '';
        addDriver.style.display = 'none';
        repair.style.display = 'none';
        maintainListFunc.style.display = 'none';

        const ctx = document.getElementById('myChart').getContext('2d');
        if (myChart == null){
            myChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: [''],
                    datasets: [{
                        label: '',
                        data: [],
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',  // Red
                            'rgba(54, 162, 235, 0.2)',  // Blue
                            'rgba(255, 206, 86, 0.2)',  // Yellow
                            'rgba(75, 192, 192, 0.2)',  // Green
                            'rgba(153, 102, 255, 0.2)', // Purple
                            'rgba(255, 159, 64, 0.2)',  // Orange
                            'rgba(220, 20, 60, 0.2)',   // Crimson
                            'rgba(0, 128, 0, 0.2)',     // Green (Dark)
                            'rgba(255, 0, 255, 0.2)',   // Magenta
                            'rgba(255, 140, 0, 0.2)',   // Dark Orange
                            'rgba(0, 0, 128, 0.2)',     // Navy
                            'rgba(128, 0, 128, 0.2)'    // Purple (Dark)
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',   // Border color for Red
                            'rgba(54, 162, 235, 1)',   // Border color for Blue
                            'rgba(255, 206, 86, 1)',   // Border color for Yellow
                            'rgba(75, 192, 192, 1)',   // Border color for Green
                            'rgba(153, 102, 255, 1)',  // Border color for Purple
                            'rgba(255, 159, 64, 1)',   // Border color for Orange
                            'rgba(220, 20, 60, 1)',    // Border color for Crimson
                            'rgba(0, 128, 0, 1)',      // Border color for Green (Dark)
                            'rgba(255, 0, 255, 1)',    // Border color for Magenta
                            'rgba(255, 140, 0, 1)',    // Border color for Dark Orange
                            'rgba(0, 0, 128, 1)',      // Border color for Navy
                            'rgba(128, 0, 128, 1)'     // Border color for Purple (Dark)
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        x: {
                            beginAtZero: true
                        }
                    },
                    maintainAspectRatio: false,
                }
            });
        }   
        const statisticSectionItem = document.querySelectorAll('.adminSection1__statisticSectionItem');
        const chartFunctionItem = document.querySelectorAll('.adminSection1__chartFunctionItem');
        const chartLeft = document.querySelector('.adminSection1__chartLeft');
        const chartRight = document.querySelector('.adminSection1__chartRight');
        statisticSectionItem.forEach(async (item, index, arr) => {
            item.addEventListener('click', async () => {
                if (index == 0){ //User
                    
                    chartFunctionItem.forEach((x) => {
                        x.className = 'adminSection1__chartFunctionItem';
                    })

                    item.classList.add('adminSection1__button-modified');
                    arr[1].className = 'adminSection1__statisticSectionItem';
                    arr[2].className = 'adminSection1__statisticSectionItem';

                    chartLeft.style.display = 'none';
                    chartRight.style.display = 'block';
                    chartRight.style.width = '100%';

                    const userRef = collection(db, "users");
                    const userSnapshot = await getCountFromServer(userRef);
                    const userCount = userSnapshot.data().count;
    
                    const driverRef = collection(db, "drivers");
                    const driverSnapshot = await getCountFromServer(driverRef);
                    const driverCount = driverSnapshot.data().count;

                    myChart.data.labels = ['Users', 'Drivers'];
                    myChart.data.datasets[0].label = 'Số lượng tài xế và người dùng';
                    myChart.data.datasets[0].data = [userCount, driverCount];
                    myChart.update();
                }
                else if (index == 1){ //Revenue

                    chartFunctionItem[0].classList.add('adminSection1__button-modified');
                    chartFunctionItem[1].className = 'adminSection1__chartFunctionItem';
                    const dayArray = weeklyRevenue.map(item => item.day);
                    const Revenue = weeklyRevenue.map(item => item.price);
                    if (myChart){
                        myChart.data.labels = dayArray;
                        myChart.data.datasets[0].label = 'Doanh thu theo tuần';
                        myChart.data.datasets[0].data = Revenue;

                        myChart.update();
                    }

                    item.classList.add('adminSection1__button-modified');
                    arr[0].className = 'adminSection1__statisticSectionItem';
                    arr[2].className = 'adminSection1__statisticSectionItem';

                    chartLeft.style.display = 'block';
                    chartRight.style.display = 'block';
                    chartRight.style.width = 'calc(80% - 20px)';
                    chartFunctionItem.forEach((value, i, arrChart) => {
                        value.addEventListener('click', () => {
                            if(i == 0){

                                value.classList.add('adminSection1__button-modified');
                                arrChart[1].className = 'adminSection1__chartFunctionItem';

                                const dayArray = weeklyRevenue.map(item => item.day);
                                const Revenue = weeklyRevenue.map(item => item.price);
                                if (myChart){
                                    myChart.data.labels = dayArray;
                                    myChart.data.datasets[0].label = 'Doanh thu theo tuần';
                                    myChart.data.datasets[0].data = Revenue;

                                    myChart.update();
                                }
                            }
                            else if (i == 1){

                                value.classList.add('adminSection1__button-modified');
                                arrChart[0].className = 'adminSection1__chartFunctionItem';

                                const monthArray = monthlyRevenue.map(item => item.month);
                                const Revenue = monthlyRevenue.map(item => item.price);
                                if (myChart){
                                    myChart.data.labels = monthArray;
                                    myChart.data.datasets[0].label = 'Doanh thu theo tháng';
                                    myChart.data.datasets[0].data = Revenue;

                                    myChart.update();
                                }
                            }
                        });
                    });
                }
                else{ //OrderNum

                    chartFunctionItem[0].classList.add('adminSection1__button-modified');
                    chartFunctionItem[1].className = 'adminSection1__chartFunctionItem';
                    const dayArray = weeklyRevenue.map(item => item.day);
                    const Count = weeklyRevenue.map(item => item.count);
                    if (myChart){
                        myChart.data.labels = dayArray;
                        myChart.data.datasets[0].label = 'Lượng xe đặt theo tuần';
                        myChart.data.datasets[0].data = Count;
                        myChart.update();
                    }

                    item.classList.add('adminSection1__button-modified');
                    arr[0].className = 'adminSection1__statisticSectionItem';
                    arr[1].className = 'adminSection1__statisticSectionItem';

                    chartLeft.style.display = 'block';
                    chartRight.style.display = 'block';
                    chartRight.style.width = 'calc(80% - 20px)';
                    chartFunctionItem.forEach((value, i, arrChart) => {
                        value.addEventListener('click', () => {
                            if(i == 0){

                                value.classList.add('adminSection1__button-modified');
                                arrChart[1].className = 'adminSection1__chartFunctionItem';

                                const dayArray = weeklyRevenue.map(item => item.day);
                                const Count = weeklyRevenue.map(item => item.count);
                                if (myChart){
                                    myChart.data.labels = dayArray;
                                    myChart.data.datasets[0].label = 'Lượng xe đặt theo tuần';
                                    myChart.data.datasets[0].data = Count;
                                    myChart.update();
                                }
                            }
                            else if (i == 1){

                                value.classList.add('adminSection1__button-modified');
                                arrChart[0].className = 'adminSection1__chartFunctionItem';

                                const monthArray = monthlyRevenue.map(item => item.month);
                                const Count = monthlyRevenue.map(item => item.count);
                                if (myChart){
                                    myChart.data.labels = monthArray;
                                    myChart.data.datasets[0].label = 'Lượng xe đặt theo tháng';
                                    myChart.data.datasets[0].data = Count;
                                    myChart.update();
                                }
                            }
                        });
                    });
                }
            });
        });
    });
});


repairButton.addEventListener('click', () => {
    userListButton.className='adminSection1__userListButton';
    driverListButton.className='adminSection1__userListDriver';
    addDriverButton.className = 'adminSection1__addDriverButton';
    statisticButton.className = 'adminSection1__statistic';
    repairButton.classList.add('adminSection1__button-modified');
    repairListButton.className = 'adminSection1__repairListButton';
    adminSection1__repairCarItemList.innerHTML = '';
    statisticList.style.display = 'none';
    userListFunc.style.display = 'none';
    userListFunc.innerHTML = '';
    driverListFunc.style.display = 'none';
    driverListFunc.innerHTML = '';
    addDriver.style.display = 'none';
    repair.style.display = 'block';
    maintainListFunc.style.display = 'none';
});


//-> For maintaince
const maintainceTime = new Map();
maintainceTime.set('Bảo dưỡng cơ bản', '6:00');
maintainceTime.set('Bảo dưỡng trung bình', '12:00');
maintainceTime.set('Bảo dưỡng nặng', '24:00');


const adminSection1__repairCar = document.querySelector("#adminSection1__repairCair");
const adminSection1__repairCarOwner = document.querySelector(".adminSection1__repairCarOwner").children[1];
const adminSection1__repairCarWeight = document.querySelector(".adminSection1__repairCarWeight").children[1];
const adminSection1__repairCarID = document.querySelector(".adminSection1__repairCarID").children[1];
const adminSection1__repairButton = document.querySelector(".adminSection1__repairButton");
const adminSection1__repairType = document.querySelector("#adminSection1__repairType");
const adminSection1__repairDate = document.querySelector("#adminSection1__repairDate");
const adminSection1__repairButtonSubmit = document.querySelector(".adminSection1__repairButtonSubmit");
const adminSection1__repairCarImage = document.querySelector(".adminSection1__repairCarImage img");
const allDriverRef = await getDocs(collection(db, 'drivers'));
const mapVehicle = new Map();
let isFirstOption = true;
allDriverRef.forEach(async (driver) => {
    const fullName = driver.data().fullName;
    const driver_ID = driver.id;
    const allVehicleRef = await getDocs(collection(db, `drivers/${driver.id}/Vehicles`));
    allVehicleRef.forEach(async (vehicle) => {
        const vehicle_ID = vehicle.data().ID;
        const vehicle_id = vehicle.id;
        const vehicle_Size = vehicle.data().Type === "Xe tải" ? vehicle.data().Weight : vehicle.data().Size;
        const append_Vehicle = document.createElement('option');
        mapVehicle.set(`${fullName}_${vehicle_ID}_${vehicle_Size}`, `${driver_ID}_${vehicle_id}`);
        append_Vehicle.style.value = `${fullName}_${vehicle_ID}_${vehicle_Size}`;
        append_Vehicle.innerText = `${fullName}_${vehicle_ID}_${vehicle_Size}`;
        if(isFirstOption){
            append_Vehicle.setAttribute('selected', 'selected');
            isFirstOption = false;
        }
        adminSection1__repairCar.appendChild(append_Vehicle);
    });
});

function update_admin__repairInfo(){
    const string_split = adminSection1__repairCar.value.split('_');
    adminSection1__repairCarOwner.innerText = `${string_split[0]}`;
    adminSection1__repairCarWeight.innerText = `${string_split[2]}`;
    adminSection1__repairCarID.innerText = `${string_split[1]}`;
    
    console.log(string_split);
    const carType = string_split[2].split(' ');
    if (carType[1] == 'khách'){
        adminSection1__repairCarImage.src = carImageSource;
    }
    else if (carType[1] == 'tải'){
        adminSection1__repairCarImage.src = truckImageSource;
    }
    else{
        adminSection1__repairCarImage.src = containerImageSource;
    }
}

adminSection1__repairCar.addEventListener('change', (event) => {
    event.preventDefault();
    update_admin__repairInfo();
});

adminSection1__repairButton.addEventListener('click', () => {
    update_admin__repairInfo();
});

adminSection1__repairButtonSubmit.addEventListener('click', async (event) => {
    event.preventDefault();

    try{
        const getIDs = () => {
            const ids = mapVehicle.get(adminSection1__repairCar.value).split('_');
            return ids;
        }
        const addupEndTime = (startDate, maintenanceType) => {
            const maintenanceDuration = maintainceTime.get(maintenanceType);
            const [hours, minutes] = maintenanceDuration.split(':').map(Number);
    
            startDate.setHours(startDate.getHours() + hours);
            startDate.setMinutes(startDate.getMinutes() + minutes);
    
            return startDate.getFullYear() +
                '-' + String(startDate.getMonth() + 1).padStart(2, '0') +
                '-' + String(startDate.getDate()).padStart(2, '0') +
                'T' + String(startDate.getHours()).padStart(2, '0') +
                ':' + String(startDate.getMinutes()).padStart(2, '0');
        };
        const isScheduleAvailable = (vehicle_data, new_start, new_end) => {
            var flag = true;
            vehicle_data.maintaince.forEach((element) => {
                const start = element.time_start;
                const end = element.time_end;
                if(new_start <= end && new_end >= start){
                    flag = false;
                }
            });
            return flag;
        }
    
        const isDriverScheduleAvailable = (driver_data, new_start, new_end) => {
            var flag = true;
            driver_data.schedule.forEach((element) => {
                const end = element.arriveTime;
                const start = element.departureTime;
                if(new_start < end && new_end > start){
                    flag = false;
                }
            })
            return flag;
        }

        const [driver_ID, vehicle_ID] = getIDs();
        const type_maintain = adminSection1__repairType.value;
        const timeStart = `${adminSection1__repairDate.value}T07:00`;
        const timeEnd = addupEndTime(new Date(timeStart), type_maintain);

        const vehicleRef = doc(db, `drivers/${driver_ID}/Vehicles/${vehicle_ID}`);
        const driverRef = doc(db, `drivers/${driver_ID}`);

        const [vehicle_data, driver_data] = await Promise.all([
            getDoc(vehicleRef).then(doc => doc.data()),
            getDoc(driverRef).then(doc => doc.data())
        ]);

        if (isScheduleAvailable(vehicle_data, timeStart, timeEnd) && isDriverScheduleAvailable(driver_data, timeStart, timeEnd)) {

            if (vehicle_data.Type === "Xe tải"){
                await addDoc(collection(db, 'maintainOrders'), {
                    driver: driver_data.fullName,
                    carID: vehicle_data.ID,
                    maintainType: type_maintain,
                    carType: vehicle_data.Type,
                    carWeight: vehicle_data.Weight,
                    timeStart: timeStart,
                    timeEnd: timeEnd
                });    
            }
            else{
                await addDoc(collection(db, 'maintainOrders'), {
                    driver: driver_data.fullName,
                    carID: vehicle_data.ID,
                    maintainType: type_maintain,
                    carType: vehicle_data.Type,
                    carSize: vehicle_data.Size,
                    timeStart: timeStart,
                    timeEnd: timeEnd
                });    
            }
            
            await updateDoc(vehicleRef, {
                maintaince: arrayUnion({
                    maintaince_type: type_maintain,
                    time_start: timeStart,
                    time_end: timeEnd
                })
            });
            alert("Bạn đã đăng ký lịch bảo trì thành công");
            window.location.reload();
        } else {
            alert("Trùng lịch");
        }
    }catch (error) {
        console.error("Lỗi khi tạo lịch: ", error);
        alert("Xảy ra lỗi khi tạo lịch");
    }
})


//Maintain List


repairListButton.addEventListener('click', async () => {


    userListButton.className='adminSection1__userListButton';
    addDriverButton.className = 'adminSection1__addDriverButton';
    statisticButton.className = 'adminSection1__statistic';
    repairButton.className = 'adminSection1__repairButton';
    repairListButton.classList.add('adminSection1__button-modified');
    driverListButton.className = 'adminSection1__userListDriver';
    adminSection1__repairCarItemList.innerHTML = '';
    driverListFunc.innerHTML = '';
    driverListFunc.style.display = "block";
    addDriver.style.display = "none";
    userListFunc.style.display = 'none';
    userListFunc.innerHTML = '';
    statisticList.style.display = 'none';
    repair.style.display = 'none';
    maintainListFunc.style.display = 'block';
    


    const maintainOrdersQuery = query(collection(db, 'maintainOrders'));
    const maintainOrdersSnapshot = await getDocs(maintainOrdersQuery);

    let maintainArray = [];
    
    maintainOrdersSnapshot.forEach((doc) => {
        maintainArray.push({...doc.data()});
    });

    console.log(maintainArray.length);

    maintainArray.forEach((item) => {
        const repairCarInfo = document.createElement('div');
        repairCarInfo.classList.add('adminSection1__repairCarInfo');

        let imageLink;
        let carSize;

        if (item.carType === 'Xe khách'){
            imageLink = carImageSource;
            carSize = item.carSize;
        }
        else if (item.carType === 'Xe tải'){
            imageLink = truckImageSource;
            carSize = item.carWeight;
        }
        else{
            imageLink = containerImageSource;
            carSize = item.carSize;
        }

        repairCarInfo.innerHTML =
        `<div class="adminSection1__repairCarMaintainList">
            <h3 class="adminSection1__repairCarInfoTitle">Thông tin xe được bảo dưỡng</h3>
            <div class="adminSection1__repairCarInfoList">
                <div class="adminSection1__repairCarLeft">
                    <div class="adminSection1__repairCarType">
                        <div class="adminSection1__repairCarImage">
                            <img src=${imageLink} alt=""> 
                            <!-- Xe tải thì truyền hình xe tải, ô tô truyền hình ô tô and so on. -->
                        </div>
                        <div class="adminSection1__repairCarDesc">
                            <!-- Loại xe -->
                            <span>${item.carType}</span>
                        </div>
                    </div>
                </div>
                <div class="adminSection1__repairCarRight">
                    <div class="adminSection1__repairCarOwner">
                        <span>Chủ sở hữu: </span>
                        <span>${item.driver}</span>
                    </div>
                    <div class="adminSection1__repairCarWeight">
                        <span>Kích thước: </span>
                        <span>${carSize}</span>
                    </div>
                    <div class="adminSection1__repairCarID">
                        <span>Biển số xe: </span>
                        <span>${item.carID}</span>
                    </div>
                    <div class="adminSection1__repairCarType">
                        <span>Loại xe: </span>
                        <span>${item.carType}</span>
                    </div>
                    <div class="adminSection1__repairCarType">
                        <span>Loại bảo dưỡng:</span>
                        <span>${item.maintainType}</span>
                    </div>
                    <div class="adminSection1__repairStartTime">
                        <span>Ngày bắt đầu bảo dưỡng: </span>
                        <span>${item.timeStart.replace('T', '-')}</span>
                    </div>
                    <div class="adminSection1__repairSectionEnd">
                        <span>Ngày kết thúc bảo dưỡng:</span>
                        <span>${item.timeEnd.replace('T', '-')}</span>
                    </div>
                </div>
            </div>
        </div>`;

        adminSection1__repairCarItemList.appendChild(repairCarInfo);
    });
});