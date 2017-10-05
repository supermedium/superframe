/* global AFRAME */
var styleParser = AFRAME.utils.styleParser;

if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.');
}

AFRAME.registerComponent('event-set', {
  schema: {
    default: '',
    parse: function (value) {
      var convertedObj;
      var hyphened;
      var key;
      var obj;
      obj = styleParser.parse(value);
      // Convert camelCase keys from styleParser to hyphen.
      convertedObj = {};
      for (key in obj) {
        hyphened = key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
        convertedObj[hyphened] = obj[key];
      }
      return convertedObj;
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
    delete data._event;
    delete data._target;

    // Decide the target to `setAttribute` on.
    targetEl = target ? el.sceneEl.querySelector(target) : el;

    this.eventName = event;
    this.eventHandler = function handler () {
      var propName;
      // Set attributes.
      for (propName in data) {
        AFRAME.utils.entity.setComponentProperty.call(this, targetEl, propName,
                                                      data[propName]);
      }
    };
  },

  addEventListener: function () {
    this.el.addEventListener(this.eventName, this.eventHandler);
  },

  removeEventListener: function () {
    this.el.removeEventListener(this.eventName, this.eventHandler);
  }
});
