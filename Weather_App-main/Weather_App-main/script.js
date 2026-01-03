if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(async position=> {
    const long = position.coords.longitude;
    const lat = position.coords.latitude;
    console.log("long: "+long + " lat: " + lat);
    const data =await getWeatherData(lat,long)
    console.log("data",data)   

    var map = L.map('map').setView([lat,long], 5);
  
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);
  
          var marker = L.marker([lat, long]).addTo(map);
          marker.bindPopup(data.name).openPopup();
   
   
          map.on('click', async function (e) {
              console.log("Lat, Lon : " + e.latlng.lat + ", " + e.latlng.lng)
   
              const data = await getWeatherData(e.latlng.lat, e.latlng.lng);
   
              marker.setLatLng([e.latlng.lat, e.latlng.lng]);
              marker.bindPopup(data.name).openPopup();
          });
      })
  }
  
  async function getWeatherData(lat,long){
    const api = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&units=metric&appid=ddfaba4398b491fa4ef3e29a5e934c6e`;
    let response = await fetch(api);
    let data = await response.json();
    WeatherDataHandler(data);
    return data;
  }
  let temperatureDescription = document.querySelector('.temperature-description');
  let temperatureDegree = document.querySelector('.temperature-degree');
  let locationtimezone = document.querySelector('.location-timezone');
  let maxTemperature = document.querySelector('.maxTemp');
  let minTemperature = document.querySelector('.minTemp');
  let windSpeed = document.querySelector('.windspeed');
  
  function WeatherDataHandler(data){
    const {temp}= data.main;
    const {description} = data.weather[0];
    const {temp_max} = data.main;
    const {temp_min}=data.main;
    const {speed} = data.wind;
    
    temperatureDegree.innerHTML = temp +"\xB0" + "C" ;
    temperatureDescription.textContent = description;
    locationtimezone.textContent = data.name;
    maxTemperature.textContent = 'Max: ' + temp_max + "\xB0" + "C";
    minTemperature.textContent = 'Min: ' + temp_min + "\xB0" + "C";
    windSpeed.textContent = 'Wind Speed:' + speed + "m/s";
  }
