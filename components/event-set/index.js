/* global AFRAME */

// AFRAME styleParse has one issue: it transforms hyphenated keys to camel-case.
// This is a problem when those keys are component names, as A-Frame component
// names often include hyphens, and are not converted internally to camel case.

// To compensate for this, we post-process the data from the parser:
// - analyze the first part of the string, represeting the component
// - if translating this out of camel case to a dashed value gives
//   a better match against known A-Frame components, then use the dashed value
//   for the component name.

// This solution is not 100% robust, but good enough for most circumstances.
// - Will not handle component names that have a mix of camel case and dashes
//   e.g. example-componentOne
// - Could give incorrect results in case where two components have names that
//   only differ by their casing.
//   e.g. example-component-two & exampleComponentTwo
var styleParser = AFRAME.utils.styleParser;
var styleParse = function(value) {

  function dashLowerCase (str) { return '-' + str[0].toLowerCase(); }

  function fromCamelCase (str) {
      return str.replace(/([A-Z])/g, dashLowerCase);
  }

  const data = AFRAME.utils.styleParser.parse(value);

  var key;
  var component;
  var remainder;
  var dashComponent;
  var dashKey;

  for (key in data) {
    component = key.split('.')[0];
    remainder = key.split('.').slice(1).join('.');
    dashComponent = fromCamelCase(component);
    if (component === dashComponent) { continue; }

    if (AFRAME.components[dashComponent] && !AFRAME.components[component]) {
        dashKey = dashComponent.concat('.', remainder);
        data[dashKey] = data[key];
        delete data[key];
      }
  }

  return(data);
}

if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.');
}

AFRAME.registerComponent('event-set', {
  schema: {
    default: '',
    parse: function (value) {
      return styleParse(value);
    }
  },

  multiple: true,

  init: function () {
    this.eventHandler = null;
    this.eventName = null;
  },

  update: function (oldData) {
    this.removeEventListener();
    this.updateEventListener();
    this.addEventListener();
  },

  remove: function () {
    this.removeEventListener();
  },

  pause: function () {
    this.removeEventListener();
  },

  play: function () {
    this.addEventListener();
  },

  /**
   * Update source-of-truth event listener registry.
   * Does not actually attach event listeners yet.
   */
  updateEventListener: function () {
    var data = this.data;
    var el = this.el;
    var event;
    var target;
    var targetEl;

    // Set event listener using `_event`.
    event = data._event || this.id;
    target = data._target;

    // Decide the target to `setAttribute` on.
    targetEl = target ? el.sceneEl.querySelector(target) : el;

    this.eventName = event;

    const handler = () => {
      var propName;
      // Set attributes.
      for (propName in data) {
        if (propName === '_event' || propName === '_target') { continue; }
        AFRAME.utils.entity.setComponentProperty.call(this, targetEl, propName,
                                                      data[propName]);
      }
    };

    if (!isNaN(data._delay)) {
      // Delay.
      this.eventHandler = () => { setTimeout(handler, parseFloat(data._delay)); };
    } else {
      this.eventHandler = handler;
    }
  },

  addEventListener: function () {
    this.el.addEventListener(this.eventName, this.eventHandler);
  },

  removeEventListener: function () {
    this.el.removeEventListener(this.eventName, this.eventHandler);
  }
});
