
/*Key Functions:

    currentLocationForecast(): Fetches and displays weather data based on the user's current location.
    fetchWeatherData(latitude, longitude): Fetches weather data from the Weather API using geographic coordinates.
    updateData(data): Updates the UI elements with weather data (temperature, humidity, condition, etc.).
    updateRecentList(location): Stores recent search terms in localStorage and updates the dropdown list.

    Event Listeners
        Form Submit: Prevents default form submission and triggers a search based on input.
        Search Button: Executes a new search using the inputted city or city + country.
        Location Button: Gets weather data based on the current GPS location.
*/



var apiKey = '6ef1661516834707b28142724242510'; //api key

currentLocationForecast();// function call to fetch current location forecast

let recentSearchList = JSON.parse(localStorage.getItem('recentList')) || [];

if(recentSearchList.length>0){
    addDropEvent();
    document.getElementById("locations").innerHTML ="";
    for(let i = 0;i<recentSearchList.length;i++ ){
        let newListItem = document.createElement('li');
        newListItem.classList.add("cursor-pointer");
        newListItem.classList.add("hover:text-blue-600");
        newListItem.innerHTML = `${recentSearchList[i]}`;
        newListItem.addEventListener("click",()=>{
            document.getElementById("search-box").value = newListItem.innerHTML;
            document.getElementById("drop-up-btn").click();
        })
        document.getElementById("locations").appendChild(newListItem);
    }
}

function addDropEvent(){
    document.getElementById("drop-down-btn").style.display = "inline";
    document.getElementById("drop-down-btn").addEventListener("click",()=>{
        document.getElementById("dropdown").style.display="block";
        document.getElementById("drop-down-btn").style.display="none";
        document.getElementById("drop-down-btn").style.pointerEvents="none";
        document.getElementById("drop-up-btn").style.display="inline";
        document.getElementById("drop-up-btn").style.pointerEvents="all";
    })
    document.getElementById("drop-up-btn").addEventListener("click",()=>{
        document.getElementById("dropdown").style.display="none";
        document.getElementById("drop-down-btn").style.display="inline";
        document.getElementById("drop-down-btn").style.pointerEvents="all";
        document.getElementById("drop-up-btn").style.display="none";
        document.getElementById("drop-up-btn").style.pointerEvents="none";
    })

    let recentSearchList = JSON.parse(localStorage.getItem('recentList')) || [];
    if(recentSearchList.length>4){
        // document.getElementById("dropdown").classList.add("overflow-scroll");
    }

}


const currentLocationBtn = document.getElementById("current-location"); // adding eventlistner for location button
currentLocationBtn.addEventListener("click",()=>{
    currentLocationForecast();
});


function currentLocationForecast(){ // function to fetch current location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, error);
        document.getElementById("main").style.display = "block";
        document.getElementById("default").style.display = "none";
    } else {
        alert('Geolocation is not supported by this browser.');
        document.getElementById("main").style.display = "none";
        document.getElementById("default").style.display = "block";
    }
    
    function success(position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
    
        console.log('Latitude:', latitude, 'Longitude:', longitude);
        fetchWeatherData(latitude, longitude);  // function call to fetch weather data
    }
    
    function error() {
        alert('Unable to retrieve your location');
        document.getElementById("main").style.display = "none";
        document.getElementById("default").style.display = "block";
    }
    
    
    function fetchWeatherData(latitude, longitude) { // function to fetch weather data
        fetch(`http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${latitude},${longitude}&days=6`).then((response) => {
            return response.json();
        }).then((data) => {
            updateData(data);
        });
    }
}

document.getElementById("form").addEventListener("submit",(event)=>{
    event.preventDefault();
});

const searchBtn = document.getElementById("search-btn"); 

searchBtn.addEventListener("click", () => { // adding eventlistner for search button.
    const searchBox = document.getElementById("search-box");
    if(searchBox.value===""){
        alert("Search Box must not be empty");
        return;
    }
    fetch(`http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${searchBox.value}&days=6`)
    .then((response) => {
        if (!response.ok) {
            throw new Error("Invalid Location");
        }
        return response.json();
    })
    .then((data) => {
        updateRecentList(searchBox.value);
        updateData(data);
    })
    .catch((error) => {
        alert("Invalid Location");
    });
});

function updateRecentList(location){ // updating recent searchlist
    
    let recentSearchList = JSON.parse(localStorage.getItem('recentList')) || [];
    if(recentSearchList.includes(location)){
        return;
    }
    recentSearchList.push(location);
    addDropEvent();
    document.getElementById("drop-up-btn").click();
    let dataListBox = document.getElementById("locations");
    // let newListItem = document.createElement('option');
    let newListItem = document.createElement('li');
    newListItem.classList.add("cursor-pointer");
    newListItem.classList.add("hover:text-blue-600");
    // newListItem.value = location;
    newListItem.innerHTML = location;
    newListItem.addEventListener("click",()=>{
        document.getElementById("search-box").value = newListItem.innerHTML;
        document.getElementById("drop-up-btn").click();
    })
    dataListBox.appendChild(newListItem);
    localStorage.setItem('recentList', JSON.stringify(recentSearchList));
}

function updateData(data) {
    document.getElementById("search-box").value = "";
    document.getElementById("main").style.display = "block";
    document.getElementById("default").style.display = "none";
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
    document.getElementById('feels').innerHTML = data.current.feelslike_c;
    document.getElementById('wind').innerHTML = data.current.wind_mph + " mph";
    document.getElementById('uv').innerHTML = data.current.uv;

    let day = document.getElementsByClassName("day");
    
    for (let i = 1;i<=5;i++){
        day[i-1].children[0].innerHTML = `${data.forecast.forecastday[i].date} <br><span class="flex"> <img class="w-6" src="./images/weather-icons/wind-speed.gif" alt=""> &nbsp;${data.forecast.forecastday[i].day.maxwind_mph} mph</span>`;
        day[i-1].children[1].children[0].setAttribute("src" , data.forecast.forecastday[i].day.condition.icon );
        day[i-1].children[2].innerHTML =`${data.forecast.forecastday[i].day.mintemp_c} / ${data.forecast.forecastday[i].day.maxtemp_c} <br> <span class="flex p-2"><img class="w-6" src="./images/weather-icons/drop.gif" alt="">&nbsp; ${data.forecast.forecastday[i].day.avghumidity} RH</span>`;
    }
}



