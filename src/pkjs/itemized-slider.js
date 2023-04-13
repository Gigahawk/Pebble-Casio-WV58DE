/**
 * # Itemized Slider
 *
 * This component is a copy of the default slider component, except instead of
 * defining a min, max, and step, this component takes a list of string values
 * to be printed into the text box.
 *
 * Note that the value returned by this component is the integer index of the
 * selection in the array. It should technically be possible to return an
 * arbitrary value similar to the `select` component, however this is not
 * implemented.
 *
 * ## Properties
 *
 * +--------------+----------+-------------------------------------------------+
 * | Property     | Type     | Description                                     |
 * +==============+==========+=================================================+
 * | type         | string   | Set to `itemizedSlider`                         |
 * +--------------+----------+-------------------------------------------------+
 * | id           | string   | REQUIRED: you must assign a unique ID for the   |
 * |              | (unique) | options to get picked up properly. Set this to  |
 * |              |          | a unique string to allow this item to be looked |
 * |              |          | up using `Clay.getItemById()` in your custom    |
 * |              |          | function.                                       |
 * +--------------+----------+-------------------------------------------------+
 * | messageKey   | string   | The AppMessage key matching the messageKey item |
 * |              | (unique) | defined in your package.json. Set this to a     |
 * |              |          | unique string to allow this item to be looked   |
 * |              |          | up using `Clay.getItemsByMessageKey()` in your  |
 * |              |          | custom function. You must set this if you wish  |
 * |              |          | for the value of this item to be persisted      |
 * |              |          | after the user closes the config page.          |
 * +--------------+----------+-------------------------------------------------+
 * | label        | string   | The label that should appear next to this item. |
 * +--------------+----------+-------------------------------------------------+
 * | defaultValue | int      | The default index of the slider                 |
 * +--------------+----------+-------------------------------------------------+
 * | description  | string   | Optional sub-text to include below the          |
 * |              |          | component                                       |
 * +--------------+----------+-------------------------------------------------+
 * | options      | array of | The options you want to appear in the text box  |
 * |              | strings  |                                                 |
 * +--------------+----------+-------------------------------------------------+
 * | capabilities | array    | Array of features that the connected watch must |
 * |              |          | have for this item to be present                |
 * +--------------+----------+-------------------------------------------------+
 * | group        | string   | Set this to allow this item, along with other   |
 * |              |          | items sharing the same group to be looked up    |
 * |              |          | using `Clay.getItemsByGroup()` in your custom   |
 * |              |          | function                                        |
 * +--------------+----------+-------------------------------------------------+
 *
 * ### Example
 * ```
 * {
 *   "type": "itemizedSlider",
 *   "id": "speedItemizedSlider",
 *   "messageKey": "speed",
 *   "defaultValue": 0,
 *   "label": "Label",
 *   "options": [
 *     "slow",
 *     "medium",
 *     "fast",
 *   ]
 * }
 * ```
 *
 */
const itemizedSlider = {
  name: 'itemizedSlider',
  template: `
    <div class="component component-slider">
      <label class="tap-highlight">
        <span class="label-container">
          <span class="label">{{{label}}}</span>
          <span class="value-wrap">
            <span class="value-pad"></span>
            <input type="text" class="value" disabled/>
          </span>
        </span>
        <span class="input">
          <input
            data-manipulator-target
            class="slider"
            type="range"
            min="{{min}}"
            max="{{max}}"
            id="{{id}}"
            step="{{step}}"
            {{each key: attributes}}{{key}}="{{this}}"{{/each}}
            />
        </span>
      </label>
      {{if description}}
      <div class="description">{{{description}}}</div>
      {{/if}}
    </div>`,
  style: `
    .section .component-slider {
      padding: 0;
    }
    .component-slider label {
      display: block;
    }
    .component-slider .label-container {
      display: -webkit-box;
      display: -webkit-flex;
      display: flex;
      -webkit-box-align: center;
      -webkit-align-items: center;
      align-items: center;
      width: 100%;
      padding-bottom: 0.7rem;
    }
    .component-slider .label {
      -webkit-box-flex: 1;
      -webkit-flex: 1;
      flex: 1;
      min-width: 1rem;
      display: block;
      padding-right: 0.75rem;
    }
    .component-slider .value-wrap {
      display: block;
      position: relative;
    }
    .component-slider .value, .component-slider .value-pad {
      display: block;
      background: #333333;
      border-radius: 0.25rem;
      padding: 0.35rem 0.375rem;
      border: none;
      vertical-align: baseline;
      color: #ffffff;
      text-align: right;
      margin: 0;
      min-width: 1rem;
    }
    .component-slider .value-pad {
      visibility: hidden;
    }
    .component-slider .value-pad:before {
      content: ' ';
      display: inline-block;
    }
    .component-slider .value {
      max-width: 100%;
      position: absolute;
      left: 0;
      top: 0;
    }
    .component-slider .input-wrap {
      padding: 0 0.75rem 0.7rem;
    }.component-slider .input {
      display: block;
      position: relative;
      min-width: 100%;
      height: 1.4rem;
      overflow: hidden;
      margin-left: 0;
    }
    .component-slider .input:before {
      content: '';
      display: block;
      position: absolute;
      height: 0.17647rem;
      background: #666666;
      width: 100%; top: 0.61176rem;
    }
    .component-slider .input .slider {
      display: block;
      width: 100%;
      -webkit-appearance: none;
      appearance: none;
      position: relative;
      height: 1.4rem;
      margin: 0;
      background-color: transparent;
    }.component-slider .input .slider:focus {
      outline: none;
    }
    .component-slider .input .slider::-webkit-slider-runnable-track {
      border: none;
      height: 1.4rem;
      width: 100%;
      background-color: transparent;
    }
    .component-slider .input .slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      position: relative;
      height: 1.4rem;
      width: 1.4rem;
      background-color: #ff4700;
      border-radius: 50%;
    }
    .component-slider .input .slider::-webkit-slider-thumb:before {
      content: "";
      position: absolute;
      left: -1000px;
      top: 0.61176rem;
      height: 0.17647rem;
      width: 1001px;
      background: #ff4700;
    }`,
  manipulator: 'slider',
  defaults: {
    label: '',
    description: '',
    min: 0,
    max: 100,
    step: 1,
    id: '',
    options: [],
    attributes: {},
  },
  initialize: function(minified, clayConfig) {
    /**
     * Find the object from a Clay config containing the specified id
     * @param {Array} data the clay config object
     * @param {string} id the id to find
     * @return {Object} the component with the matching id
     */
    function findDictById(data, id) {
      for (let i = 0; i < data.length; i++) {
        const dict = data[i];
        if (dict.id === id) {
          return dict;
        }
        for (const key in dict) {
          if (Object.hasOwn(dict, key)) {
            const value = dict[key];
            if (Array.isArray(value)) {
              const result = findDictById(value, id);
              if (result !== null) {
                return result;
              }
            }
          }
        }
      }
      return null;
    }
    const self = this;

    const $value = self.$element.select('.value');
    const $valuePad = self.$element.select('.value-pad');
    const $slider = self.$manipulatorTarget;

    // There's no way to get the config for this particular item, we have to
    // store the id somewhere and retrieve it here
    const id = $slider[0].getAttribute('id');
    // For some reason the .getItem functions don't seem to work, we need to
    // search through the config manually
    const config = findDictById(clayConfig.config, id);
    const options = config.options;

    // Set the slider range to match the option indices
    $slider[0].setAttribute('max', (options.length - 1).toString());

    /**
     * Sets the value display
     * @return {void}
     */
    function setValueDisplay() {
      const value = self.get();
      const label = options[value];
      $value.set('value', label);
      $valuePad.set('innerHTML', label);
    }

    self.on('change', setValueDisplay);
    $slider.on('|input', setValueDisplay);
    setValueDisplay();

    $value.on('|input', function() {
      $valuePad.set('innerHTML', this.get('value'));
    });

    $value.on('|change', function() {
      const val = this.get('value');
      const idx = options.indexOf(val);
      if (idx >= 0) {
        self.set(idx);
      }
      setValueDisplay();
    });
  },
};

module.exports = itemizedSlider;
