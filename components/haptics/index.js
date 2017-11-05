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
    eventsFrom: {type: 'string'},
    force: {default: 1}
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
      this.el.addEventListener('controllerconnected', function init () {
        setTimeout(function () {
          self.gamepad = self.el.components['tracked-controls'].controller;
          if (!self.gamepad.hapticActuators.length) { return; }
          self.addEventListeners();
        }, 150);
      });
    }
  },

  remove: function () {
    this.removeEventListeners();
  },

  pulse: function () {
    var actuator;
    var data = this.data;
    if (!data.enabled || !this.gamepad || !this.gamepad.hapticActuators) { return; }
    actuator = this.gamepad.hapticActuators[data.actuatorIndex];
    actuator.pulse(data.force, data.dur);
  },

  addEventListeners: function () {
    var data = this.data;
    var i;
    var listenTarget;

    listenTarget = data.eventsFrom ? document.querySelector(data.eventsFrom) : this.el;
    for (i = 0; i < data.events.length; i++) {
      listenTarget.addEventListener(data.events[i], this.pulse);
    }
  },

  removeEventListeners: function () {
    var data = this.data;
    var i;
    var listenTarget;

    listenTarget = data.eventsFrom ? document.querySelector(data.eventsFrom) : this.el;
    for (i = 0; i < data.events.length; i++) {
      listenTarget.removeEventListener(data.events[i], this.pulse);
    }
  }
});
