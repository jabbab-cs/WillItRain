function getlocation() {
  const cached = localStorage.getItem("cachedLocation");
  if (cached) {
    try {
      const obj = JSON.parse(cached);
      if (obj && typeof obj.lat === "number" && typeof obj.lon === "number") {
        console.log("Using cached location", obj);
        getWeather(obj.lat, obj.lon);
        return;
      }
    } catch (e) {}
  }

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success, error, { timeout: 5000 });
  } else {
    document.getElementById("result").innerHTML = "Location not supported :(";
  }
}

function success(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;

  try {
    localStorage.setItem(
      "cachedLocation",
      JSON.stringify({ lat: lat, lon: lon, ts: Date.now() }),
    );
  } catch (e) {}

  console.log(`Latitude: ${lat}, Longitude: ${lon}`);
  getWeather(lat, lon);
}

function error() {
  document.getElementById("result").innerHTML =
    "Unable to retrieve your location :(";
}

function getWeather(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=precipitation_probability&current_weather=true`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const currentHour = new Date().getHours();
      const hoursLeft = 24 - currentHour;
      const todaysForecast = data.hourly.precipitation_probability.slice(
        0,
        hoursLeft,
      );
      const willRain = todaysForecast.some((prob) => prob > 50);

      if (willRain) {
        document.getElementById("result").innerHTML = "Yes☔";
      } else {
        document.getElementById("result").innerHTML = "No☀️";
      }
    });
}

getlocation();
