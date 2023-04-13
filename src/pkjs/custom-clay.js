module.exports = function(minified) {
  const clayConfig = this;
  // const _ = minified._;
  const $ = minified.$;
  // const HTML = minified.HTML;

  /**
   * Update the description of a ClayComponent
   * @param {ClayComponent} component component to update
   * @param {string} innerHTML text to place inside the description
   */
  function updateDesc(component, innerHTML) {
    component.config.description = innerHTML;
    const elm = component.$element[0];
    let desc = elm.querySelector('.description');
    if (desc !== null) {
      desc.remove();
    }
    if (innerHTML) {
      desc = document.createElement('div');
      desc.className = 'description';
      desc.innerHTML = innerHTML;
      elm.appendChild(desc);
    }
  }

  /**
   * Check if the 'Show Weather' switch is enabled, and only enable the
   * 'Show Condition' switch if it is.
   *
   * (Condition is only shown on the watchface if weather is enabled)
   */
  function enableConditionConfig() {
    const showWeather = clayConfig.getItemByMessageKey('weather');
    const showCondition = clayConfig.getItemByMessageKey('showcond');
    const enable = showWeather.get();
    if (enable) {
      showCondition.enable();
    } else {
      showCondition.disable();
    }
  }

  /**
   * Lock/unlock weather config options
   * @param {bool} enable true to unlock, false to lock
   */
  function enableWeatherConfig(enable) {
    const components = clayConfig.getItemsByGroup('weather');
    if (enable) {
      components.forEach(function(c) {
        c.enable();
      });
      enableConditionConfig();
    } else {
      components.forEach(function(c) {
        c.disable();
      });
    }
  }

  clayConfig.on(clayConfig.EVENTS.AFTER_BUILD, function() {
    const apiKey = clayConfig.getItemByMessageKey('apiKey');
    const apiKeyOk = clayConfig.getItemByMessageKey('apiKeyOk');
    const showWeather = clayConfig.getItemByMessageKey('weather');
    apiKeyOk.hide();

    /**
     * Check if the entered API key is valid and lock/unlock settings
     * accordingly
     */
    function isApiKeyValid() {
      const base = 'http://api.openweathermap.org/data/2.5/weather?lat=0&lon=0&appid=';
      const key = apiKey.get();
      const url = base + key;

      $.request('get', url).then(function(result) {
        const msg = '<span style="color: #09BC8A;">API key is valid</span>';
        apiKeyOk.set(true);
        updateDesc(apiKey, msg);
        enableWeatherConfig(true);
      }).error(function(status, statusText, responseText) {
        resp = JSON.parse(statusText);
        const msg = (
          '<span style="color: #D33E37;">' +
          'Error ' + status + ': ' + resp.message +
          '</span>'
        );
        apiKeyOk.set(false);
        updateDesc(apiKey, msg);
        enableWeatherConfig(false);
      });
    }

    isApiKeyValid();

    apiKey.on('change', isApiKeyValid);
    showWeather.on('change', enableConditionConfig);
  });
};
