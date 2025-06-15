const apiKey = "ca73d327ef7400c95ebabf5fa43b407f";

async function fetchWeather() {
    const searchInput = document.getElementById("search").value.trim();
    const weatherDataSection = document.getElementById("weather-data");
    weatherDataSection.style.display = "block";

    if (searchInput === "") {
        weatherDataSection.innerHTML = `
  <div>
    <h2>Empty Input!</h2>
    <p>Please try again with a valid <u>city name</u>.</p>
  </div>
  `;
        return;
    }

    document.getElementById("search").value = "";
    const geocodeData = await getLonAndLat(searchInput, weatherDataSection);
    if (geocodeData) {
        getWeatherData(geocodeData.lon, geocodeData.lat, weatherDataSection);
    }
}

async function getLonAndLat(searchInput, weatherDataSection) {
    // Use 'ID' for Indonesia country code
    const countryCode = 'ID';
    const geocodeURL = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(searchInput)},${countryCode}&limit=1&appid=${apiKey}`;
    const response = await fetch(geocodeURL);
    if (!response.ok) {
        console.log("Bad response! ", response.status);
        weatherDataSection.innerHTML = `
  <div>
    <h2>Error!</h2>
    <p>Failed to fetch location data. Please try again.</p>
  </div>
  `;
        return;
    }

    const data = await response.json();
    if (data.length === 0) {
        weatherDataSection.innerHTML = `
  <div>
    <h2>Invalid Input: "${searchInput}"</h2>
    <p>Please try again with a valid <u>city name</u> in Indonesia.</p>
  </div>
  `;
        return;
    } else {
        return data[0];
    }
}

async function getWeatherData(lon, lat, weatherDataSection) {
    const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    const response = await fetch(weatherURL);
    if (!response.ok) {
        console.log("Bad response! ", response.status);
        weatherDataSection.innerHTML = `
  <div>
    <h2>Error!</h2>
    <p>Failed to fetch weather data. Please try again.</p>
  </div>
  `;
        return;
    }

    const data = await response.json();

    weatherDataSection.style.display = "flex";
    weatherDataSection.innerHTML = `
<img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="${data.weather[0].description}" width="100" />
<div>
  <h2>${data.name}, Indonesia</h2>
  <p><strong>Temperature:</strong> ${Math.round(data.main.temp - 273.15)}°C</p>
  <p><strong>Description:</strong> ${data.weather[0].description}</p>
</div>
`;
}
