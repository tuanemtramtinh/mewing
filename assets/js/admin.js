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
const addDriverButton = document.querySelector('.adminSection1__addDriverButton');

const userListFunc = document.querySelector('.adminSection1__userList');

const addDriver = document.querySelector('.adminSection1__addDriver');

const driverListFunc = document.querySelector('.adminSection1__driverList');

userListButton.addEventListener('click', () => {
    userListFunc.innerHTML = '';
    userListFunc.style.display = "block";
    addDriver.style.display = "none";
    userListFunc.innerHTML = '';
    driverListFunc.innerHTML ='';

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
        const userListDiv = document.querySelector('.adminSection1__userList');
        ulUserList.forEach((element) => {
            userListDiv.appendChild(element);
        });
    })
});

addDriverButton.addEventListener('click', () => {

    userListFunc.style.display = "none";
    addDriver.style.display = "flex";

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
            schedule: []
        });

        let subCollectionRef = collection(db, `drivers/${driver_ID}/Vehicles`);

        let vehicleData;

        switch(car_Type) {
            case "Xe khách":
                car_Size = adminSection1__driverCarTypeCarSize.value;
                
                vehicleData = { Type: car_Type, Size: car_Size, ID: car_ID };
                break;
            case "Xe tải":
                truck_Weight = adminSection1__driverCarTypeTruckWeight.value;
                vehicleData = { Type: car_Type, Weight: truck_Weight, ID: car_ID };
                break;
            case "Xe container":
                container_Size = adminSection1__driverCarTypeContainerSize.value;
                vehicleData = { Type: car_Type, Size: container_Size, ID: car_ID };
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


driverListButton.addEventListener('click', async () => {
    driverListFunc.innerHTML = '';
    driverListFunc.style.display = "block";
    addDriver.style.display = "none";
    driverListFunc.innerHTML = '';

    try {
        const driverRef = collection(db, 'drivers');
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
                    vehicleWeight.innerHTML = `<span>Kích thước: </span><span>${vehicle.Size}</span>`;

                    let ulVehicleElement = document.createElement('ul');
                    ulVehicleElement.classList.add('adminSection1__driverInfo');
                    ulVehicleElement.appendChild(vehicleType);
                    ulVehicleElement.appendChild(vehicleWeight);

                    ulElement.appendChild(ulVehicleElement);
                }
            }
            const license = document.createElement('li');
            license.innerHTML = `<span>Giấy phép lái xe: </span><span>${driver.license}</span>`;
            ulElement.appendChild(license);
            
            ulDriverList.push(ulElement);
        }

        const driverListDiv = document.querySelector('.adminSection1__driverList');
        ulDriverList.forEach((element) => {
            driverListDiv.appendChild(element);
        });
    } catch (error) {
        console.error("Error fetching driver or vehicle data: ", error);
    }
});



carListButton.addEventListener('click', () => {
    
});