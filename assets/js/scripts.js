const searchField = document.getElementById('city-search');
const searchForm = document.getElementById('search-form');
const cityButtons = document.getElementById('past-searches');
const currentWeather = document.getElementById('today');
const forecast = document.getElementById('five-day');
const fiveDay = document.getElementById('forecast-title');

let cityList = JSON.parse(localStorage.getItem('city-list'));
if (!cityList) {
    cityList = [];
}

const getWeather = function(city) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${city.lat}&lon=${city.lon}&units=imperial&appid=004776ae84be50af5d8f084120b08652`)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        console.log(data);
        currentWeather.innerHTML = `<div><h2>${data.city.name} and date \$${data.list[1].weather[0].icon}</h2><p>Temp: ${data.list[0].main.temp}</p><p>Wind: ${data.list[0].wind.speed}</p><p>Humidity: ${data.list[0].main.humidity}</p></div>`;
        fiveDay.textContent = '5-Day Forecast:';
        // for (i = )
    })
}

const cityParse = function(cityName) {
    fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=004776ae84be50af5d8f084120b08652`)
    .then(function (response){
        return response.json();
    })
    .then(function(data) {
        const coordinates = {
            cityName: data[0].name,
            lon: data[0].lon,
            lat: data[0].lat
        }
        getWeather(coordinates);
    })
}

const cityInput = function(event) {
    event.preventDefault();
    let coordinates;
    if (event.type === 'submit'){
        const searchItem = searchField.value.trim();
        coordinates = cityParse(searchItem);
        cityList.push(coordinates);
        localStorage.setItem('city-list', JSON.stringify(cityList));
    } else if (!event.target.dataset.lon || !event.target.dataset.lat) {
        const buttonName = event.target.textContent;
        coordinates = cityParse(buttonName);
    } else {
        coordinates = {
            cityName: event.target.textContent,
            lon: event.target.dataset.lon,
            lat: event.target.dataset.lat
        }
        getWeather(coordinates);
    }
}


searchForm.addEventListener('submit', cityInput);
cityButtons.addEventListener('click', cityInput);