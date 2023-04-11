const Clay = require('pebble-clay');
const clayConfig = require('./config');
const clay = new Clay(clayConfig); // eslint-disable-line no-unused-vars
let CityID = 0;
let posLat = '0';
let posLon = '0';
let lang = 'en';
const weatherIcon = {
  '01d': 'I', // clear sky (day)
  '02d': '"', // few clouds (day)
  '03d': '!', // scattered clouds
  '04d': 'k', // broken clouds
  '09d': '$', // shower rain
  '10d': '+', // rain (day)
  '11d': 'F', // thunderstorm
  '13d': '9', // snow
  '50d': '=', // mist (day)
  '01n': 'N', // clear sky (night)
  '02n': '#', // few clouds (night)
  '03n': '!', // scattered clouds
  '04n': 'k', // broken clouds
  '09n': '$', // shower rain
  '10n': ',', // rain (night)
  '11n': 'F', // thunderstorm
  '13n': '9', // snow
  '50n': '>', // mist (night)
};
const locationOptions = {
  enableHighAccuracy: true,
  maximumAge: 10000,
  timeout: 10000,
};

Pebble.addEventListener('ready', function() {
  let pebbleLang = 'en_US';

  // Get pebble language
  if (Pebble.getActiveWatchInfo) {
    try {
      const watch = Pebble.getActiveWatchInfo();
      pebbleLang = watch.language;
    } catch (err) {
      console.log('Pebble.getActiveWatchInfo(); Error!');
    }
  }

  // Choose language
  const sub = pebbleLang.substring(0, 2);
  if (sub === 'de') {
    lang = 'de';
  } else if (sub === 'es') {
    lang = 'es';
  } else if (sub === 'fr') {
    lang = 'fr';
  } else if (sub === 'it') {
    lang = 'it';
  } else {
    lang = 'en';
  }

  console.log(
      'JavaScript app ready and running! Pebble lang: ' + pebbleLang +
    ', using for Weather: ' + lang);
  sendMessageToPebble({'JS_READY': 1});
});

/**
 * Send a payload to the watch
 * @param {Object} payload a dictionary containing the payload
 */
function sendMessageToPebble(payload) {
  Pebble.sendAppMessage(payload,
      function(e) {
        console.log(
            'Successfully delivered message (' + e.payload +
          ') with transactionId='+ e.data.transactionId);
      },
      function(e) {
        console.log(
            'Unable to deliver message with transactionId=' +
          e.data.transactionId + ' Error is: ' + e.error.message);
      });
}

/**
 * Callback for successful location query
 * @param {GeolocationPosition} pos position
 */
function locationSuccess(pos) {
  // Get current location:
  // http://forums.getpebble.com/discussion/21755/pebble-js-location-to-url
  console.log('lat= ' + pos.coords.latitude + ' lon= ' + pos.coords.longitude);
  posLat = (pos.coords.latitude).toFixed(3);
  posLon = (pos.coords.longitude).toFixed(3);

  updateWeather();
}

/**
 * Callback for failed location query
 * @param {GeolocationPositionError} err error
 */
function locationError(err) {
  posLat = '0';
  posLon = '0';
  console.log('location error (' + err.code + '): ' + err.message);
}

Pebble.addEventListener('appmessage', function(e) {
  console.log('Got message: ' + JSON.stringify(e));
  if ('cityid' in e.payload) { // Weather Download
    CityID = e.payload.cityid;
    if (CityID === 0) {
      navigator.geolocation.getCurrentPosition(
          locationSuccess, locationError, locationOptions);
    } else {
      updateWeather();
    }
  }
});

/**
 * Request weather from OpenWeatherMap and push it to the watch
 */
function updateWeather() {
  console.log('Updating weather');
  const req = new XMLHttpRequest();
  let URL = 'http://api.openweathermap.org/data/2.5/weather?APPID=9a4eed6c813f6d55d0699c148f7b575a&';

  if (CityID !== 0) {
    URL += 'id='+CityID.toString();
  } else if (posLat != '0' && posLon != '0') {
    URL += 'lat=' + posLat + '&lon=' + posLon;
  } else {
    return;
  } // Error, no position data

  URL += '&units=metric&lang=' + lang + '&type=accurate';
  console.log('UpdateURL: ' + URL);
  req.open('GET', URL, true);
  req.onload = function(e) {
    if (req.readyState == 4) {
      if (req.status == 200) {
        const response = JSON.parse(req.responseText);
        const temp = Math.round(response.main.temp);// -273.15
        const icon = response.weather[0].icon;
        const cond = response.weather[0].description;
        const name = response.name;
        console.log(
            'Got Weather Data for City: ' + name +
          ', Temp: ' + temp +
          ', Icon:' + icon + '/' + weatherIcon[icon] +
          ', Cond:'+cond);
        sendMessageToPebble({
          'w_temp': temp,
          'w_icon': weatherIcon[icon],
          'w_cond': cond,
        });
      }
    }
  };
  req.send(null);
}
