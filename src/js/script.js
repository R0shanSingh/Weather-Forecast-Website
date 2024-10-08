// http://api.weatherapi.com/v1/forecast.json?key=c7ebed48085847a5a7583708240310&q=UttarPara West Bengal&days=1&aqi=no&alerts=no

// let forcastData = fetch("https://api.weatherapi.com/v1/forecast.json?key=c7ebed48085847a5a7583708240310&q=London&days=3").then((response)=>{
// return response.json();
// }).then((data)=>{
//     console.log(data);
// });

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success, error);
} else {
    console.error('Geolocation is not supported by this browser.');
}

function success(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    console.log('Latitude:', latitude, 'Longitude:', longitude);
    fetchWeatherData(latitude, longitude);  // Call function to fetch weather data
}

function error() {
    console.error('Unable to retrieve your location');
}


function fetchWeatherData(latitude, longitude) {
    fetch(`https://api.weatherapi.com/v1/forecast.json?key=c7ebed48085847a5a7583708240310&q=${latitude},${longitude}&days=8`).then((response) => {
        return response.json();
    }).then((data) => {
        updateData(data);
    });
}

const searchBtn = document.getElementById("search-btn");

// async function fetchData (key){
//     const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=c7ebed48085847a5a7583708240310&q=${key}&days=8`);
//     response.json();
//     const data = undefined;
//     return data;
// }

searchBtn.addEventListener("click", () => {
    const searchBox = document.getElementById("search-box");
    fetch(`https://api.weatherapi.com/v1/forecast.json?key=c7ebed48085847a5a7583708240310&q=${searchBox.value}&days=8`).then((response) => {
        return response.json();
    }).then((data) => {
        updateData(data);
    }).catch((error) => {

    });
});

function updateData(data) {
    let code = data.current.condition.code;

    switch (code) {
        case 1000: data.current.is_day ? document.getElementById("logo").setAttribute("src", "./images/weather-icons/sun.gif") : document.getElementById("logo").setAttribute("src", "./images/weather-icons/night-clear.gif");
            break;
        case 1009: case 1003: data.current.is_day ? document.getElementById("logo").setAttribute("src", "./images/weather-icons/cloudy.gif") : document.getElementById("logo").setAttribute("src", "./images/weather-icons/cloudynight.gif");
            break;
        case 1006: document.getElementById("logo").setAttribute("src", "./images/weather-icons/clouds.gif");
            break;
        case 1087: document.getElementById("logo").setAttribute("src", "./images/weather-icons/storm.gif");
            break;
        case 1030: case 1135: case 1147: document.getElementById("logo").setAttribute("src", "./images/weather-icons/foggy.gif");
            break;
        case 1063: case 1180: case 1183: case 1186: case 1189: case 1192: case 1195: case 1198: case 1246: case 1243: case 1240: document.getElementById("logo").setAttribute("src", "./images/weather-icons/rain.gif");
            break;
        case 1066: case 1114: case 1210: case 1216: case 1219: case 1222: case 1225: case 1227: document.getElementById("logo").setAttribute("src", "./images/weather-icons/snow.gif");
            break;
    }

    document.getElementById("location").innerHTML = `${data.location.name}, ${data.location.country}`;
    document.getElementById('text').innerHTML = data.current.condition.text;
    document.getElementById('humidity').innerHTML = data.current.humidity;
    document.getElementById('temperature').innerHTML = data.current.temp_c;
    // document.getElementById('code').innerHTML= data.current.condition.code;
    document.getElementById('feels').innerHTML = data.current.feelslike_c;
    // document.getElementById('rain').innerHTML= data.current.
    document.getElementById('wind').innerHTML = data.current.wind_mph + " mph";
    document.getElementById('uv').innerHTML = data.current.uv;

    console.log(data);


    let day = document.getElementsByClassName("day");
    
    for (let i = 1;i<=5;i++){
        day[i-1].children[0].innerHTML = data.forecast.forecastday[i].date;
        day[i-1].children[1].children[0].setAttribute("src" , data.forecast.forecastday[i].day.condition.icon );
        day[i-1].children[2].innerHTML =`${data.forecast.forecastday[i].day.mintemp_c} / ${data.forecast.forecastday[i].day.maxtemp_c}`;

    }
}

// let data;
