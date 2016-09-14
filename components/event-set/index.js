/* global AFRAME */
var styleParser = AFRAME.utils.styleParser;

if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.');
}

AFRAME.registerComponent('event-set', {
  schema: {
    default: '',
    parse: function (value) {
      var obj = styleParser.parse(value);
      // Convert camelCase keys from styleParser to hyphen.
      var convertedObj = {};
      Object.keys(obj).forEach(function (key) {
        var hyphened = key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
        convertedObj[hyphened] = obj[key];
      });
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

  /**
   * Called when a component is removed (e.g., via removeAttribute).
   * Generally undoes all modifications to the entity.
   */
  remove: function () {
    this.removeEventListener();
  },

  /**
   * Called when entity pauses.
   * Use to stop or remove any dynamic or background behavior such as events.
   */
  pause: function () {
    this.removeEventListener();
  },

  /**
   * Called when entity resumes.
   * Use to continue or add any dynamic or background behavior such as events.
   */
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

    // Set event listener using `_event`.
    var event = data._event;
    var target = data._target;
    delete data._event;
    delete data._target;

    // Decide the target to `setAttribute` on.
    var targetEl = target ? el.sceneEl.querySelector(target) : el;

    this.eventName = event;
    this.eventHandler = function handler () {
      // Set attributes.
      Object.keys(data).forEach(function setAttribute (propName) {
        AFRAME.utils.entity.setComponentProperty.call(this, targetEl, propName,
                                                      data[propName]);
      });
    };
  },

  addEventListener: function () {
    this.el.addEventListener(this.eventName, this.eventHandler);
  },

  removeEventListener: function () {
    this.el.removeEventListener(this.eventName, this.eventHandler);
  }
});
