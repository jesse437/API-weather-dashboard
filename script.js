/* These are all the selected classes and IDs*/
const searchBtn = document.querySelector("#searchBtn");
const inputCityName = document.querySelector("#inputCityName");
const cityname = document.querySelector(".cityName");
const date = document.querySelector(".date");
const weatherImage = document.querySelector(".weatherIcon");
const temp = document.querySelector(".temp");
const wind = document.querySelector(".wind");
const humidity = document.querySelector(".humidity");
const cardDeck = document.querySelector(".card-deck");

var today = new Date();
const [day, month, year] = [
  today.getDate(),
  today.getMonth() + 1,
  today.getFullYear(),
];

var cityList = [];
var city_name;
localCityList();

/* This function is the searched city*/
searchBtn.addEventListener("click", function () {
  const cityName = document.querySelector("#inputCityName");
  var city_name = cityName.value.trim();
  console.log(city_name);
  if (city_name == "") {
    alert("Please enter the appropriate city name!");
  } else {
    cityList.push(city_name);
    console.log(cityList);
  }
  localStorage.setItem("cities", JSON.stringify(cityList));
  localStorage.setItem("currentCity", JSON.stringify(city_name));

  displayWeather(city_name);
  displayFiveDayForecast(city_name);
  displaySearchedCities();
  historyCities();
});

/* This function saves searched cities on local storage*/
function localCityList() {
  const savedData = JSON.parse(localStorage.getItem("cities"));
  if (savedData != null) {
    cityList = savedData;
    displaySearchedCities();
  } else {
    console.log("No data in searched city", cityList);
    localStorage.setItem("cities", JSON.stringify(cityList));
  }
}

/* this next function retrieves the searched city */
function displaySearchedCities() {
  const city_list = document.querySelector("#cityList");
  city_list.innerHTML = "";
  const savedData = JSON.parse(localStorage.getItem("cities"));
  if (savedData != null) {
    if (savedData.length > 0) {
      for (let i = 0; i < savedData.length; i++) {
        var searchedCity = document.createElement("button");
        searchedCity.classList.add(
          "btn",
          "btn-secondary",
          "btn-lg",
          "btn-block",
          "city"
        );
        searchedCity.setAttribute("data-name", savedData[i]);
        searchedCity.innerHTML = savedData[i];
        city_list.prepend(searchedCity);
      }
    }
  }
}

/* The following api fetches the weather data */

function displayWeather(city_name) {
  city_name = city_name.toLowerCase();
  let weatherData = fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${city_name}&limit=1&appid=5fed619e7304f60a938b70a219a457d0`
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      var lat = data[0]["lat"];
      var lon = data[0]["lon"];
      var cityName = data[0]["name"];
      cityname.innerHTML = cityName;
      date.innerHTML = `(${month}/${day}/${year})`;

      fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=5fed619e7304f60a938b70a219a457d0&units=imperial`
      )
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          var weatherIcon = data["list"][0]["weather"][0]["icon"];
          weatherImage.setAttribute(
            "src",
            `https://openweathermap.org/img/wn/${weatherIcon}@2x.png`
          );
          // Current Temperature
          var tempValue = data["list"][0]["main"]["temp"];
          console.log(tempValue);
          temp.innerHTML = `Temp: ${tempValue} °F`;

          // Current wind speed
          var windValue = data["list"][0]["wind"]["speed"];
          console.log(windValue);
          wind.innerHTML = `Wind: ${windValue} MPH`;

          // Current Humidity
          var humidityValue = data["list"][0]["main"]["humidity"];
          console.log(humidityValue);
          humidity.innerHTML = `Humidity: ${humidityValue} %`;
        });
    });
  historyCities();
}

function displayFiveDayForecast(city_name) {
  fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${city_name}&limit=1&appid=5fed619e7304f60a938b70a219a457d0`
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      var lat = data[0]["lat"];
      var lon = data[0]["lon"];

      fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=5fed619e7304f60a938b70a219a457d0&units=imperial`
      )
        .then((response) => response.json())
        .then((data) => {
          console.log(data["cnt"]);
          cardDeck.innerHTML = "";
          for (let i = 0; i < data["cnt"]; i = i + 8) {
            dt_txt = data["list"][i]["dt_txt"].slice(0, 10).split("-");
            var [yyyy, mm, dd] = dt_txt;
            var weatherIcon = data["list"][i]["weather"][0]["icon"];
            var tempValue = data["list"][i]["main"]["temp"];
            var windValue = data["list"][i]["wind"]["speed"];
            var humidityValue = data["list"][0]["main"]["humidity"];
            const template = `
                    <div class="card-body">
                        <h5 class="card-title">${mm}/${dd}/${yyyy}</h5>
                        <img src="https://openweathermap.org/img/wn/${weatherIcon}@2x.png">
                        <p class="card-text">Temp: ${tempValue} °F</p>
                        <p class="card-text">Wind: ${windValue} MPH</p>
                        <p class="card-text">Humidity: ${humidityValue} %</p>
                    </div>
                `;
            var card = document.createElement("div");
            card.classList.add("card");
            card.innerHTML = template;

            cardDeck.append(card);
          }
        });
    });
}

function historyCities() {
  const storedCitiesList = document.querySelectorAll(".city");
  storedCitiesList.forEach((storedCity) => {
    storedCity.addEventListener("click", function (event) {
      event.preventDefault();
      clickedCity = storedCity.getAttribute("data-name");
      displayWeather(clickedCity);
      displayFiveDayForecast(clickedCity);
    });
  });
}

displayWeather("San Diego");
displayFiveDayForecast("San Diego");
historyCities();
