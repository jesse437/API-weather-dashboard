let searchButton = document.querySelector("#search-button");
let input = document.querySelector("#search-input");

console.log(input);

function getCoords(cityname) {
  let geoUrl =
    "http://api.openweathermap.org/geo/1.0/direct?q=" +
    cityname +
    "&limit=1&appid=5fed619e7304f60a938b70a219a457d0";

  fetch(geoUrl)
    .then(function (response) {
      return response.json();
    })
    // Traversing
    .then(function (data) {
      // console.log(data);
      // console.log(data[0]);
      // console.log(data[0].lat);
      // console.log(data[0].lon);

      getForcast(data[0].lat, data[0].lon);
    });
}

function getForcast(latitude, longitude) {
  let forcast =
    "https://api.openweathermap.org/data/2.5/forecast?lat=" +
    latitude +
    "&lon=" +
    longitude +
    "&appid=5fed619e7304f60a938b70a219a457d0&units=imperial";

  fetch(forcast)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log("here is the weather forecast ==== ", data);
      console.log(data.list);
      console.log(data.list[0]);
      console.log(data.list[0].main);
      console.log(data.list[0].main.temp);
      let tempEl = document.getElementById("currentTemp");
      let windEl = document.getElementById("currentWind");
      let humidityEl = document.getElementById("currentHumidity");
      tempEl.textContent = "Temp is: " + data.list[0].main.temp;
      windEl.textContent = "Wind is: " + data.list[0].main.wind;
      humidityEl.textContent = "Humidity is: " + data.list[0].main.humidity;
    });
}

searchButton.addEventListener("click", function () {
  //console.log(input.value);
  getCoords(input.value);
});
