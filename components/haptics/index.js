/* global AFRAME */

if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.');
}

/**
 * Haptics component for A-Frame.
 */
AFRAME.registerComponent('haptics', {
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
    var self = this;

    this.callPulse = function () { self.pulse(); };

    var doInit = function () {
      var controller = self.el.components['tracked-controls'].controller;
      if (controller.gamepad) {
         self.gamepad = controller.gamepad;
      }
      if (!self.gamepad || !self.gamepad.hapticActuators ||
          !self.gamepad.hapticActuators.length) { return; }
      self.addEventListeners();
    };

    // There may exist a tracked-controls when this component is initialized,
    // so call doInit() right away. We still register controllerconnected
    // listener in this case to be sure the gamepad reference is still valid
    // for this hand when the controllers reconnects.
    if (this.el.components['tracked-controls'] && this.el.components['tracked-controls'].controller) {
      doInit();
    }
    this.el.addEventListener('controllerconnected', function init () {
      doInit();
    });
  },

  remove: function () {
    this.removeEventListeners();
  },

  pulse: function (force, dur) {
    var actuator;
    var data = this.data;
    if (!data.enabled || !this.gamepad || !this.gamepad.hapticActuators) { return; }
    actuator = this.gamepad.hapticActuators[data.actuatorIndex];
    actuator.pulse(force || data.force, dur || data.dur);
  },

  addEventListeners: function () {
    var data = this.data;
    var i;
    var listenTarget;

    listenTarget = data.eventsFrom ? document.querySelector(data.eventsFrom) : this.el;
    for (i = 0; i < data.events.length; i++) {
      listenTarget.addEventListener(data.events[i], this.callPulse);
    }
  },

  removeEventListeners: function () {
    var data = this.data;
    var i;
    var listenTarget;

    listenTarget = data.eventsFrom ? document.querySelector(data.eventsFrom) : this.el;
    for (i = 0; i < data.events.length; i++) {
      listenTarget.removeEventListener(data.events[i], this.callPulse);
    }
  }
});
