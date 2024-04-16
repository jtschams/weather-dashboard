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

// To create shortcut buttons
const makeButtons = function(cities) {
    for (city of cities) {
        const newButton = document.createElement("button");
        newButton.setAttribute('class', 'city-shortcut');
        newButton.dataset.lat = city.lat;
        newButton.dataset.lon = city.lon;
        newButton.textContent = city.cityName;
        cityButtons.appendChild(newButton);
    }
}

// To get weather for city with coordinates
const getWeather = function(city) {
    // Today's Weather
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${city.lat}&lon=${city.lon}&units=imperial&appid=004776ae84be50af5d8f084120b08652`)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        console.log(data);
        currentWeather.innerHTML = `<div><h2>${data.name} (${dayjs().format("MM/DD/YYYY")})</h2><img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png"><p>Temp: ${data.main.temp} °F</p><p>Wind: ${data.wind.speed} MPH</p><p>Humidity: ${data.main.humidity}%</p></div>`;
    });
    // 5-Day Forecast
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${city.lat}&lon=${city.lon}&units=imperial&appid=004776ae84be50af5d8f084120b08652`)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        fiveDay.textContent = '5-Day Forecast:';
        forecast.innerHTML = '';
        for (i = 4; i < data.list.length; i += 8) {
            const daily = document.createElement('article')
            daily.innerHTML = `<h3>${dayjs(data.list[i].dt_txt).format("MM/DD/YYYY")}</h3><img src="https://openweathermap.org/img/wn/${data.list[i].weather[0].icon}@2x.png"><p>Temp: ${data.list[i].main.temp} °F</p><p>Wind: ${data.list[i].wind.speed} MPH</p><p>Humidity: ${data.list[i].main.humidity}%</p>`;
            forecast.appendChild(daily);
        }
    });
}

// Creates city objects and sends to getWeather
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
        // Adds city object to city list and creates new button
        cityList.push(coordinates);
        localStorage.setItem('city-list', JSON.stringify(cityList));
        const newButton = document.createElement("button");
        newButton.setAttribute('class', 'city-shortcut');
        newButton.dataset.lat = coordinates.lat;
        newButton.dataset.lon = coordinates.lon;
        newButton.textContent = coordinates.cityName;
        cityButtons.appendChild(newButton);
    })
}


// Sorts searches and shortcut clicks to cityParse or getWeather
const cityInput = function(event) {
    event.preventDefault();
    let coordinates;
    if (event.type === 'submit'){
        const searchItem = searchField.value.trim();
        coordinates = cityParse(searchItem);
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

makeButtons(cityList);
searchForm.addEventListener('submit', cityInput);
cityButtons.addEventListener('click', cityInput);