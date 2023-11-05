$(document).ready(function() {
    function showHome() {
        $("#content").empty();
        $("#content").append("<p class='descripcion'>Bienvenido a la Aplicación del Tiempo. Obtén el pronóstico del tiempo para tu ubicación o busca otras ciudades.</p>");
    }
    

    function showCitySearch() {
        $("#content").empty();
        $("#content").append(`
            <h2>Buscar Ciudad</h2>
            <input type="text" id="city-input" class="form-control" placeholder="Ingrese el nombre de la ciudad">
            <button id="search-city-button" class="btn btn-primary">Obtener el tiempo</button>
            <div id="weather-result"></div>
        `);

        $("#search-city-button").click(function() {
            var city = $("#city-input").val();
            getWeatherByCity(city);
        });
    }
    
    function getWeatherByCity(city) {
        $.ajax({
            url: `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=5255e3b0ab845fe95e547fcda722d3fc&units=metric`,
            type: "GET",
            dataType: "json",
            success: function(data) {
                var weatherDescription = data.list[0].weather[0].main;
                var weatherImage = imagenesTiempo[weatherDescription];
                let weatherInfo = `
                    <div class="container">
                        <div class="row justify-content-center">
                            <div class="col-md-6">
                                <div class="card">
                                    <img src="${weatherImage}" alt="${weatherDescription}" class="card-img-top" style="max-width: 100px; max-height: 100px;">
                                    <div class="card-body">
                                        <h3 class="card-title">Información del Tiempo en ${data.city.name}</h3>
                                        <p class="card-text">Descripción: ${weatherDescription}</p>
                                        <p class="card-text">Temperatura: ${Math.round(data.list[0].main.temp)} °C</p>
                                        <p class="card-text">Humedad: ${data.list[0].main.humidity}%</p>
                                        <p class="card-text">Velocidad del viento: ${data.list[0].wind.speed} m/s</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <h2>Pronóstico para los próximos 5 días:</h2>
                `;
                $("#weather-result").html(weatherInfo);
                showFiveDayForecast(data);
               
            },
            error: function(error) {
                $("#weather-result").html("<p>Error al obtener la información del tiempo.</p>");
                $("#forecast-row").empty();
            }
        });
    }

    function showFiveDayForecast(data) {
        $("#content").append('<div class="row" id="forecast-row">');
        $("#forecast-row").empty();

        for (let i = 0; i < data.list.length; i += 8) {
            var forecast = data.list[i];
            var date = new Date(forecast.dt * 1000);
            var forecastDate = date.toDateString();
            var temperature = forecast.main.temp;
            var description = forecast.weather[0].main;
            var humidity = forecast.main.humidity;
            var windSpeed = forecast.wind.speed;
            var weatherImage = imagenesTiempo[description];

            var forecastCard = `
                <div class="col-md-2">
                    <div class="card">
                        <img src="${weatherImage}" alt="${description}" class="card-img-top" style="max-width: 60px; max-height: 60px;">
                        <div class="card-body">
                            <h5 class="card-title">${forecastDate}</h5>
                            <p class="card-text">Descripción: ${description}</p>
                            <p class="card-text">Temperatura: ${Math.round(temperature)} °C</p>
                            <p class="card-text">Humedad: ${humidity}%</p>
                             <p class="card-text">Velocidad del viento: ${windSpeed} m/s</p>
                        </div>
                    </div>
                </div>
            `;
        
            $("#forecast-row").append(forecastCard);
        }

        $("#content").append('</div>');
    }
    
    function getWeatherByLocation(lat, lon) {
        $.ajax({
            
            url: `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=5255e3b0ab845fe95e547fcda722d3fc&units=metric`,
            type: "GET",
            dataType: "json",
            success: function(data) {
                    var weatherDescription = data.weather[0].main;
                    var weatherImage = imagenesTiempo[weatherDescription]; // Asegúrate de que tengas un objeto imagenesTiempo definido.

                    let weatherInfo = `
                        <div class="container">
                            <div class="row justify-content-center">
                                <div class="col-md-6">
                                    <div class="card">
                                        <img src="${weatherImage}" alt="${weatherDescription}" class="card-img-top" style="max-width: 100px; max-height: 100px;">
                                        <div class="card-body">
                                            <h3 class="card-title">Información del Tiempo en ${data.name}</h3>
                                            <p class="card-text">Descripción: ${data.weather[0].description}</p>
                                            <p class="card-text">Temperatura: ${Math.round(data.main.temp)} °C</p>
                                            <p class="card-text">Humedad: ${data.main.humidity}%</p>
                                            <p class="card-text">Velocidad del viento: ${data.wind.speed} m/s</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                $("#content").html(weatherInfo);
            
            },
            error: function(error) {
                $("#content").html("<p>Error al obtener la información del tiempo.</p>");
            }
        });
    }
    
    function showLocationWeather() {
        $("#content").empty();
        $("#content").append("<h2>Obtener Tiempo por Ubicación Actual</h2>");
        if ("geolocation" in navigator) {
            $("#content").append("<p>Obteniendo tu ubicación...</p>");
            navigator.geolocation.getCurrentPosition(function(position) {
                 lat = position.coords.latitude;
                 lon = position.coords.longitude;
                 getWeatherByLocation(lat, lon);
            });
        } else {
            $("#content").append("<p>Tu navegador no admite geolocalización.</p>");
        }
    }

    $("#home-button").click(showHome);
    $("#search-button").click(showCitySearch);
    $("#location-button").click(showLocationWeather);

    showHome();
});
