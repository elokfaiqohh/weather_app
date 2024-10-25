class Weather {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.apiUrlCurrent = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
        this.apiUrlForecast = "https://api.openweathermap.org/data/2.5/forecast?units=metric&q=";
    }

    async fetchWeather(city) {
        const response = await fetch(this.apiUrlCurrent + city + `&appid=${this.apiKey}`);
        if (!response.ok) {
            throw new Error("Kota tidak ditemukan");
        }
        return await response.json();
    }

    async fetchForecast(city) {
        const response = await fetch(this.apiUrlForecast + city + `&appid=${this.apiKey}`);
        if (!response.ok) {
            throw new Error("Kota tidak ditemukan");
        }
        return await response.json();
    }
}

class CurrentWeather extends Weather {
    constructor(apiKey) {
        super(apiKey);
    }

    displayWeather(data) {
        document.querySelector(".city").innerHTML = data.name;
        document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
        document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
        document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";
    }

    displayForecast(data) {
        const forecastContainer = document.querySelector(".forecast");
        forecastContainer.innerHTML = ""; // Clear previous forecast

        // Group forecast data by day
        const dailyForecast = {};
        data.list.forEach(item => {
            const date = new Date(item.dt * 1000).toLocaleDateString();
            if (!dailyForecast[date]) {
                dailyForecast[date] = {
                    temp: Math.round(item.main.temp),
                    humidity: item.main.humidity,
                    wind: item.wind.speed
                };
            }
        });

        // Display forecast for the next 7 days
        for (const date in dailyForecast) {
            const forecastItem = document.createElement("div");
            forecastItem.classList.add("forecast-item");
            forecastItem.innerHTML = `
                <h3>${date}</h3>
                <p>Temp: ${dailyForecast[date].temp}°C</p>
                <p>Humidity: ${dailyForecast[date].humidity}%</p>
                <p>Wind Speed: ${dailyForecast[date].wind} km/h</p>
            `;
            forecastContainer.appendChild(forecastItem);
        }
    }
}

const apiKey = "455ab5f619809c5f5b1a5729eb24bd97"; 
const weatherApp = new CurrentWeather(apiKey);

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const themeToggleBtn = document.getElementById("theme-toggle");

searchBtn.addEventListener("click", async () => {
    const city = searchBox.value.trim();
    if (city) {
        try {
            const currentData = await weatherApp.fetchWeather(city);
            weatherApp.displayWeather(currentData);

            // Fetch and display forecast data
            const forecastData = await weatherApp.fetchForecast(city);
            weatherApp.displayForecast(forecastData);
        } catch (error) {
            alert(error.message);
        }
    } else {
        alert("Silakan masukkan nama kota");
    }
});

// Toggle theme
themeToggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-theme");
    themeToggleBtn.textContent = document.body.classList.contains("dark-theme") ? "☀️" : "🌙";
});