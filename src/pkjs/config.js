module.exports = [
  {
    'type': 'heading',
    'defaultValue': 'Casio WV-58DE v2.10 Configuration',
  },
  {
    'type': 'section',
    'items': [
      {
        'type': 'heading',
        'defaultValue': 'Visual',
      },
      {
        'type': 'select',
        'messageKey': 'inv',
        'defaultValue': 'no',
        'label': 'Inverter',
        'options': [
          {
            'label': 'Yes',
            'value': 'yes',
          },
          {
            'label': 'No',
            'value': 'no',
          },
        ],
      },
      {
        'type': 'select',
        'messageKey': 'vibr',
        'defaultValue': 'no',
        'label': 'Hourly vibrate',
        'options': [
          {
            'label': 'Yes',
            'value': 'yes',
          },
          {
            'label': 'No',
            'value': 'no',
          },
        ],
      },
      {
        'type': 'select',
        'messageKey': 'battdgt',
        'defaultValue': 'yes',
        'label': 'Battery Digits',
        'options': [
          {
            'label': 'Yes',
            'value': 'yes',
          },
          {
            'label': 'No',
            'value': 'no',
          },
        ],
      },
      {
        'type': 'select',
        'messageKey': 'showsec',
        'defaultValue': 'all',
        'label': 'Show seconds interval',
        'options': [
          {
            'label': 'always',
            'value': 'all',
          },
          {
            'label': 'never',
            'value': 'nev',
          },
          {
            'label': 'every 5s',
            'value': '05s',
          },
          {
            'label': 'every 10s',
            'value': '10s',
          },
          {
            'label': 'every 15s',
            'value': '15s',
          },
          {
            'label': 'every 30s',
            'value': '30s',
          },
        ],
      },
      {
        'type': 'select',
        'messageKey': 'vibr_bt',
        'defaultValue': 'yes',
        'label': 'BT loss vibrate',
        'options': [
          {
            'label': 'Yes',
            'value': 'yes',
          },
          {
            'label': 'No',
            'value': 'no',
          },
        ],
      },
      {
        'type': 'select',
        'messageKey': 'showbatt',
        'defaultValue': '100',
        'label': 'Show battery below',
        'options': [
          {
            'label': 'always',
            'value': '100',
          },
          {
            'label': '90%',
            'value': '90',
          },
          {
            'label': '80%',
            'value': '80',
          },
          {
            'label': '70%',
            'value': '70',
          },
          {
            'label': '60%',
            'value': '60',
          },
          {
            'label': '50%',
            'value': '50',
          },
          {
            'label': '40%',
            'value': '40',
          },
          {
            'label': '30%',
            'value': '30',
          },
          {
            'label': '20%',
            'value': '20',
          },
          {
            'label': '10%',
            'value': '10',
          },
          {
            'label': 'never',
            'value': '0',
          },
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
        'type': 'select',
        'messageKey': 'units',
        'defaultValue': 'c',
        'label': 'Units',
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
        'type': 'select',
        'messageKey': 'weather',
        'defaultValue': 'yes',
        'label': 'Show Weather',
        'options': [
          {
            'label': 'Yes',
            'value': 'yes',
          },
          {
            'label': 'No',
            'value': 'no',
          },
        ],
      },
      {
        'type': 'select',
        'messageKey': 'showcond',
        'defaultValue': 'yes',
        'label': 'Show Condition',
        'options': [
          {
            'label': 'Yes',
            'value': 'yes',
          },
          {
            'label': 'No',
            'value': 'no',
          },
        ],
      },
      {
        'type': 'input',
        'messageKey': 'cityid',
        'label': 'OpenWeatherMap City ID',
        'description': 'Use 0 for auto location',
        'defaultValue': '0',
      },
    ],
  },
  {
    'type': 'submit',
    'defaultValue': 'Save Settings',
  },
];
