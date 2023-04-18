module.exports = [
  {
    'type': 'heading',
    'defaultValue': 'Casio WV-58DE v2.11 Configuration',
  },
  {
    'type': 'section',
    'items': [
      {
        'type': 'heading',
        'defaultValue': 'Visual',
      },
      {
        'type': 'toggle',
        'messageKey': 'inv',
        'defaultValue': false,
        'label': 'Dark Mode',
      },
      {
        'type': 'toggle',
        'messageKey': 'vibr_bt',
        'defaultValue': true,
        'label': 'Vibrate on Disconnect',
      },
      {
        'type': 'toggle',
        'messageKey': 'vibr',
        'defaultValue': false,
        'label': 'Hourly Vibration',
      },
      {

        'type': 'itemizedSlider',
        'messageKey': 'showsec',
        'id': 'showSecSlider',
        'label': 'Seconds Refresh Interval',
        'defaultValue': 0,
        'options': [
          '1s',
          '5s',
          '10s',
          '15s',
          '30s',
          'off',
        ],
      },
      {
        'type': 'select',
        'messageKey': 'datefmt',
        'defaultValue': 'usa',
        'label': 'Date format',
        'options': [
          {
            'label': 'dd.mm.yyyy',
            'value': 'ger',
          },
          {
            'label': 'dd-mm-yyyy',
            'value': 'fra',
          },
          {
            'label': 'dd/mm/yyyy',
            'value': 'eng',
          },
          {
            'label': 'mm/dd/yyyy',
            'value': 'usa',
          },
        ],
      },
      {
        'type': 'toggle',
        'messageKey': 'battdgt',
        'defaultValue': true,
        'label': 'Battery Digits',
      },
      {
        'type': 'itemizedSlider',
        'messageKey': 'showbatt',
        'id': 'showBatSlider',
        'defaultValue': 10,
        'label': 'Show battery below',
        'options': [
          'never',
          '10%',
          '20%',
          '30%',
          '40%',
          '50%',
          '60%',
          '70%',
          '80%',
          '90%',
          'always',
        ],
      },
    ],
  },
  {
    'type': 'section',
    'items': [
      {
        'type': 'heading',
        'defaultValue': 'Weather',
      },
      {
        'type': 'input',
        'messageKey': 'apiKey',
        'label': 'OpenWeatherMap API Key',
      },
      {
        'type': 'select',
        'messageKey': 'units',
        'defaultValue': 'c',
        'label': 'Units',
        'group': 'weather',
        'options': [
          {
            'label': '°C',
            'value': 'c',
          },
          {
            'label': '°F',
            'value': 'f',
          },
        ],
      },
      {
        'type': 'toggle',
        'messageKey': 'weather',
        'defaultValue': false,
        'group': 'weather',
        'label': 'Show Weather',
      },
      {
        'type': 'toggle',
        'messageKey': 'showcond',
        'defaultValue': false,
        'group': 'weather',
        'label': 'Show Condition',
      },
      {
        'type': 'input',
        'messageKey': 'cityid',
        'label': 'OpenWeatherMap City ID',
        'description': 'Use 0 for auto location',
        'defaultValue': '0',
        'group': 'weather',
      },
      {
        // hidden
        'type': 'toggle',
        'messageKey': 'apiKeyOk',
        'defaultValue': false,
      },
    ],
  },
  {
    'type': 'submit',
    'defaultValue': 'Save Settings',
  },
];
