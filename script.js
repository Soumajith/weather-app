const userTab = document.querySelector("[data-userweather]");
const searchTab = document.querySelector("[data-searchweather]");
const usercontainer = document.querySelector(".weather-container");
const grantPermission = document.querySelector(".grant-location-container");
const grantaccess = document.querySelector("[data-grantaccess]");
const formContainer = document.querySelector("[data-searchform]");
const searchInput = document.querySelector("[data-searchinput]");
const loadingScreen = document.querySelector(".loading");
const userInfo = document.querySelector(".weather-card");


// Intialization of Variables
let currentTab = userTab;
const API_KEY = "8ae6cd7be72eae7e4a53f34855226417";

currentTab.classList.add("current-tab");
getFromSessionStorage();

userTab.addEventListener("click", () => {
    switchTab(userTab);
})

searchTab.addEventListener("click", () => {
    switchTab(searchTab);
})

1
function switchTab(clickedTab) {
    if (clickedTab != currentTab) {
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");

        if (!formContainer.classList.contains("active")) {
            // We are in your weather section display the form

            userInfo.classList.remove("active");
            grantPermission.classList.remove("active");
            formContainer.classList.add("active");
        }
        else {
            // we are in search weather section display user weather

            formContainer.classList.remove("active");
            userInfo.classList.remove("active");
            // get details of coordinates from local storage if defined
            getFromSessionStorage();
        }
    }
}

function getFromSessionStorage() {
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if (!localCoordinates) {
        // coordinates not present
        // show grant permission

        grantPermission.classList.add("active");
    }
    else {
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}


async function fetchUserWeatherInfo(coordinates) {

    const { lat, lon } = coordinates;
    // const lat = 28, lon = 79;

    grantPermission.classList.remove("active");
    loadingScreen.classList.add("active");

    // Api call
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
        const data = await response.json();

        loadingScreen.classList.remove("active");
        userInfo.classList.add("active");

        renderUserInfo(data);
    }
    catch (e) {
        console.log(e);
    }
}

function renderUserInfo(weatherInfo) {


    //Fetch Attributes
    const cityName = document.querySelector("[data-cityname]");
    const flagIcon = document.querySelector("[data-countryflag]");
    const weatherDesc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const tempreture = document.querySelector("[data-tempreture]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const clouds = document.querySelector("[data-clouds]");

    // Fetch data from the userData(object file)
    cityName.innerText = weatherInfo?.name;
    flagIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    weatherDesc.innerText = weatherInfo?.weather[0]?.description;
    weatherIcon.src = `https://openweathermap.org/img/w/${weatherInfo?.weather[0]?.icon}.png`;
    tempreture.innerText = (parseFloat(weatherInfo?.main?.temp) - 273.5).toFixed(2).toString() + "  \u00B0" + "C";
    windspeed.innerText = weatherInfo?.wind?.speed + " m/s";
    humidity.innerText = weatherInfo?.main?.humidity + "%";
    clouds.innerText = weatherInfo?.clouds?.all + "%";
}


function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else {
        alert("Location Permission not granted");
    }
}

function showPosition(position) {

    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }
    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));

    fetchUserWeatherInfo(userCoordinates);
}
grantaccess.addEventListener("click", getLocation)

formContainer.addEventListener("submit", (e) => {
    e.preventDefault();

    let cityName = searchInput.value;

    if (cityName == "")
        return;
    else
        fetchSearchWeatherInfo(cityName);

})

async function fetchSearchWeatherInfo(cityName) {

    loadingScreen.classList.add("active");
    userInfo.classList.remove("active");
    grantPermission.classList.remove("active");

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}`);
        const data = await response.json();

        loadingScreen.classList.remove("active");
        userInfo.classList.add("active");
        renderUserInfo(data);
    } catch (e) {
        alert("Some Error Occured");
    }
}
