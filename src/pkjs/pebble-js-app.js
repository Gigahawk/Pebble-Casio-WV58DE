
const messageKeys = require('message_keys');
const itemizedSlider = require('./itemized-slider');
const Clay = require('pebble-clay');
const customClay = require('./custom-clay');
const clayConfig = require('./config');
const clay = new Clay(clayConfig, customClay, {autoHandleEvents: false});
clay.registerComponent(itemizedSlider);

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

Pebble.addEventListener('showConfiguration', function(e) {
  Pebble.openURL(clay.generateUrl());
});

Pebble.addEventListener('webviewclosed', function(e) {
  if (e && !e.response) {
    return;
  }

  const dict = clay.getSettings(e.response);
  console.log('Sending settings to watch');
  console.log(JSON.stringify(dict));
  if (!dict[messageKeys.apiKeyOk]) {
    console.log('Invalid API key, disabling weather');
    dict.weather = false;
  }

  // Remove phone only settings
  delete dict[messageKeys.apiKey];
  delete dict[messageKeys.apiKeyOk];

  // TODO: Watchapp uses city id as a weather reload trigger, remove?
  // if (dict[messageKeys.apiKeyOk]) {
  //  updateWeather()
  // }
  // delete dict[messageKeys.cityid];

  // Send settings values to watch side
  Pebble.sendAppMessage(dict, function(e) {
    console.log('Sent config data to Pebble');
    console.log(JSON.stringify(dict));
  }, function(e) {
    console.log('Failed to send config data!');
    console.log(JSON.stringify(e));
  });
});

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
  args = {
    'lat': (pos.coords.latitude).toFixed(3),
    'lon': (pos.coords.longitude).toFixed(3),
  };
  fetchWeather(args);
}

/**
 * Callback for failed location query
 * @param {GeolocationPositionError} err error
 */
function locationError(err) {
  console.log('location error (' + err.code + '): ' + err.message);
}

Pebble.addEventListener('appmessage', function(e) {
  console.log('Got message: ' + JSON.stringify(e));
  if ('commandType' in e.payload) {
    switch (e.payload.commandType) {
      case 'weather':
        updateWeather();
        break;
    }
  }
});

/**
 * Trigger a weather update
 */
function updateWeather() {
  console.log('Updating weather');
  cityId = JSON.parse(localStorage.getItem('clay-settings')).cityid;
  console.log('City ID is ' + cityId);
  if (cityId !== '0') {
    fetchWeather({'cityId': cityId});
  } else {
    navigator.geolocation.getCurrentPosition(
        locationSuccess, locationError, locationOptions);
  }
}

/**
 * Fetch weather from OpenWeatherMap and push it to the watch
 * @param {Object} args arguments dict, either containing a cityId,
 *                      or lat lon pair
 */
function fetchWeather(args) {
  apiKey = JSON.parse(localStorage.getItem('clay-settings')).apiKey;
  const req = new XMLHttpRequest();
  let url = 'http://api.openweathermap.org/data/2.5/weather?';
  if ('cityId' in args) {
    console.log('Fetching weather for city ID ' + args.cityId);
    url += 'id='+ args.cityId;
  } else if (('lat' in args) && ('lon' in args)) {
    console.log(
        'Fetching weather for lat: ' + args.lat + ' lon: ' + args.lon);
    url += 'lat=' + args.lat + '&lon=' + args.lon;
  } else {
    console.log('Invalid fetchWeather args');
    console.log(JSON.stringify(args, null, 4));
    return;
  }
  url += '&units=metric&lang=' + lang + '&type=accurate';
  url += '&appid=' + apiKey;
  console.log('UpdateURL: ' + url);
  req.open('GET', url, true);
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
