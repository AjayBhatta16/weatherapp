const API_KEY = '26b35864c8ddbb442771417dc2e31470'

// Fields for data from API call
const cityName = document.querySelector('#city-name')
const icon = document.querySelector('.icon')
const temperature = document.querySelector('.temperature')
const weatherType = document.querySelector('#weather-type')
const feelsLike = document.querySelector('#feels > .wdata')
const minTemp = document.querySelector('#min > .wdata')
const maxTemp = document.querySelector('#max > .wdata')
const windSpeed = document.querySelector('#wind > .wdata')
const humidity = document.querySelector('#humid > .wdata')

const cities = data.map(city => `${city.name}, ${city.state}`.toLowerCase())
const goBtn = document.querySelector('#go')
const searchBar = document.querySelector('input[name="search"]')
const returnBtn = document.querySelector('#return')

let currentWeather = {}
let geoMode = true

// callback for navigator.geolocation.getCurrentPosition
// runs getDataByCoords with retrieved user coordinates
function locationSuccess(position) {
  getDataByCoords(position.coords.latitude,position.coords.longitude)
}

// displays weather data from JSON object
function displayCurrentData(obj) {
  cityName.textContent = `${obj.name} ${geoMode ? `(${obj.coord.lat}, ${obj.coord.lon})` : ''}`
  icon.src = `https://openweathermap.org/img/wn/${obj.weather[0].icon}@2x.png`
  temperature.textContent = `${Math.round(obj.main.temp)}\u00B0F`
  weatherType.textContent = obj.weather[0].description.toUpperCase()
  feelsLike.textContent = `${Math.round(obj.main.feels_like)}\u00B0F`
  minTemp.textContent = `${Math.round(obj.main.temp_min)}\u00B0F`
  maxTemp.textContent = `${Math.round(obj.main.temp_max)}\u00B0F`
  windSpeed.textContent = `${obj.wind.speed} MPH`
  humidity.textContent = `${obj.main.humidity}%`
}

// fetches data from API based on given coordinates, displays data on page
function getDataByCoords(lat,lon) {
  let apiQuery = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${API_KEY}`
  fetch(apiQuery)
    .then(res => res.json())
    .then(res => {
      currentWeather = res
      displayCurrentData(res)
    })
    .catch(error => alert(`ERROR: ${error}`))
}

// gets the user's geographic coordinates
function getUserLocation() {
  if (navigator.geolocation) {
    geoMode = true
    navigator.geolocation.getCurrentPosition(locationSuccess)
  } else {
    alert('ERROR: Unable to use geolocation API')
  }
}

function findCity() {
  let index = cities.indexOf(searchBar.value)
  if (index == -1) {
    alert('ERROR: City not found. Please make sure your input is formatted as follows: city name, state abbreviation')
  } else {
    let cityID = data[index].id 
    geoMode = false
    fetch(`https://api.openweathermap.org/data/2.5/weather?id=${cityID}&units=imperial&appid=${API_KEY}`)
      .then(res => res.json())
      .then(res => {
        currentWeather = res
        displayCurrentData(res) 
      })
  }
}

// resets display data every 5 minutes when viewing current location
let updater = window.setInterval(() => {
  if (geoMode) {
    getUserLocation()
  }
},300000)

goBtn.addEventListener('click', findCity)
returnBtn.addEventListener('click', getUserLocation)

getUserLocation()
