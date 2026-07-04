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
searchButton.addEventListener("click", async () => {
  const cityName = searchBox.value.trim();

  if (!cityName) return;

  try {
    const weatherData = await checkWeather(cityName);
    await getCityImage(cityName, weatherData.weather[0].description);
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
  const response = await fetch(`/api/weather?city=${encodeURIComponent(cityName)}`);
  const weatherData = await response.json();

  if (!response.ok || weatherData.cod != 200) {
    throw new Error(weatherData.message || "City not found");
  }

  city.textContent = weatherData.name;

  overlay.src = `images/${weatherData.weather[0].main.toLowerCase()}.gif`;
  overlay.title = weatherData.weather[0].description;

  temperature.textContent = weatherData.main.temp.toFixed(1);
  temperature.title = `Feels like ${weatherData.main.feels_like.toFixed(1)} °C`;

  humidity.textContent = weatherData.main.humidity;
  humidity.title = `Pressure: ${weatherData.main.pressure} hPa`;

  windSpeed.textContent = weatherData.wind.speed.toFixed(1);
  windSpeed.title = `Visibility: ${weatherData.visibility / 1000} km`;

  return weatherData;
}

async function getCityImage(cityName, weatherDescription = "") {
  const response = await fetch(
    `/api/image?city=${encodeURIComponent(cityName)}&description=${encodeURIComponent(weatherDescription)}`
  );

  const imageData = await response.json();

  if (!response.ok || !imageData.imageUrl) {
    throw new Error(imageData.error || "Image not found");
  }

  image.src = imageData.imageUrl;
  image.alt = imageData.alt || cityName;

  return imageData;
}