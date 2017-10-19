/* global AFRAME */

if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.');
}

/**
 * Haptics component for A-Frame.
 */
AFRAME.registerComponent('haptics', {
  dependencies: ['tracked-controls'],

  schema: {
    actuatorIndex: {default: 0},
    dur: {default: 100},
    enabled: {default: true},
    events: {type: 'array'},
    intensity: {default: 1}
  },

  multiple: true,

  init: function () {
    var data = this.data;
    var i;
    var self = this;

    this.pulse = this.pulse.bind(this);

    if (this.el.components['tracked-controls'].controller) {
      this.gamepad = this.el.components['tracked-controls'].controller;
      if (!this.gamepad.hapticActuators.length) { return; }
      this.addEventListeners();
    } else {
      this.el.addEventListener('controllerconnected', function () {
        setTimeout(function () {
          self.gamepad = self.el.components['tracked-controls'].controller;
          if (!self.gamepad.hapticActuators.length) { return; }
          self.addEventListeners();
        });
      });
    }
  },

  remove: function () {
    this.removeEventListeners();
  },

  pulse: function () {
    var actuator;
    var data = this.data;
    if (!data.enabled) { return; }
    actuator = this.gamepad.hapticActuators[data.actuatorIndex];
    actuator.pulse(data.intensity, data.dur);
  },

  addEventListeners: function () {
    var data = this.data;
    var i;
    for (i = 0; i < data.events.length; i++) {
      this.el.addEventListener(data.events[i], this.pulse);
    }
  },

  removeEventListeners: function () {
    var data = this.data;
    var i;
    for (i = 0; i < data.events.length; i++) {
      this.el.removeEventListener(data.events[i], this.pulse);
    }
  }
});
