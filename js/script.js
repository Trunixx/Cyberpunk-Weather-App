/* API */
const apiWeatherKey = process.env.OPENWEATHER_KEY;
const apiWeatherUrl =
  "https://api.openweathermap.org/data/2.5/weather?appid=" +
  apiWeatherKey +
  "&units=metric";

const apiImageKey = process.env.UNSPLASH_KEY;

/* SEARCH */
const searchBox = document.querySelector(".search input");
const searchButton = document.querySelector(".search button");

/* HTML TO CHANGE */
const city = document.getElementById("city");
const temperature = document.getElementById("temperature");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("wind_speed");

const image = document.getElementById("image");
const overlay = document.getElementById("overlay");

/* LISTENER */
searchButton.addEventListener("click", () => {
  const cityName = searchBox.value.trim();

  if (!cityName) return;
  try {
    checkWeather(cityName);
    getCityImage(cityName);
  } catch (error) {
    city.textContent = "ERR";
    temperature.textContent = "ERR";
    humidity.textContent = "ERR";
    windSpeed.textContent = "ERR";
    image.src = "img/placeholder.png";
    image.alt = "City placeholder image";
    overlay.removeAttribute("src");
    overlay.removeAttribute("title");
    console.error(error.message);
  }
});

searchBox.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    searchButton.click();
  }
});

/* UTILITY FUNCTIONS */
async function checkWeather(cityName) {
  const response = await fetch(
    apiWeatherUrl + `&q=${encodeURIComponent(cityName)}`,
  );
  const weatherData = await response.json();

  if (!response.ok || weatherData.cod != 200) {
    throw new Error(weatherData.message || "City not found");
  }

  city.innerHTML = weatherData.name;

  overlay.src = `images/${weatherData.weather[0].main.toLowerCase()}.gif`;
  overlay.title = `${weatherData.weather[0].description}`;

  temperature.innerHTML = weatherData.main.temp.toFixed(1);
  temperature.title = `Feels like ${weatherData.main.feels_like.toFixed(1)} °C`;

  humidity.innerHTML = weatherData.main.humidity;
  humidity.title = `Pressure: ${weatherData.main.pressure} hPa`;

  windSpeed.innerHTML = weatherData.wind.speed.toFixed(1);
  windSpeed.title = `Visibility: ${weatherData.visibility / 1000} km`;

  return weatherData;
}

async function getCityImage(cityName) {
  const response = await fetch(
    `https://api.unsplash.com/search/photos?query=${encodeURIComponent(cityName + " city while weatherData.weather[0].description")}&per_page=1`,
    {
      headers: {
        Authorization: `Client-ID ${apiImageKey}`,
      },
    },
  );

  const imageData = await response.json();
  image.src = imageData.results[0].urls.regular;
  image.alt = imageData.results[0].alt_description || cityName;

  return imageData.results[0];
}
