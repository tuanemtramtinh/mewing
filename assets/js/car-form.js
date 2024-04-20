const type = document.querySelector('.car__type');
const departureDate = document.querySelector('.car__day');
const departureTime = document.querySelector('.car__time');
const departurePlace = document.querySelector('.car__start');
const arrivePlace = document.querySelector('.car__end');
const carForm = document.querySelector('.car__form form');

const startEndPrice =
[
    {
        start: 'TPHCM',
        end: 'VUNGTAU',
        price: '500.000 VND'
    },
    {
        start: 'TPHCM',
        end: 'NHATRANG',
        price: '1.000.000 VND'
    },
    {
        start: 'VUNGTAU',
        end: 'NHATRANG',
        price: '1.500.000 VND'
    },
    {
        start: 'VUNGTAU',
        end: 'TPHCM',
        price: '500.000 VND'
    },
    {
        start: 'NHATRANG',
        end: 'TPHCM',
        price: '1.000.000 VND'
    },
    {
        start: 'NHATRANG',
        end: 'VUNGTAU',
        price: '1.500.000 VND'
    }
]

let getDepartureDate;
let getDepartureTime;


let checkAllInput = function() {

    let outputPrice;
    let check;

    if (typeof getDepartureDate != 'undefined' && typeof getDepartureTime != 'undefined'){
        
        let checkStatus = startEndPrice.find(item => {
            if (item.start === departurePlace.value && item.end === arrivePlace.value && departurePlace.value !== arrivePlace.value){
                outputPrice = item.price;
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