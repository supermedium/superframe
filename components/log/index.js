/* global AFRAME */

if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.');
}

AFRAME.registerPrimitive('a-log', {
  defaultComponents: {
    geometry: {primitive: 'plane'},
    material: {color: '#111'},
    text: {color: 'lightgreen'}
  }
});

AFRAME.registerSystem('log', {
  init: function () {
    var loggers = this.loggers = [];

    // Register global function to adding logs.
    AFRAME.log = function (message, channel) {
      loggers.forEach(function (loggerComponent) {
        loggerComponent.receiveLog(message, channel);
      });
    };
  },

  registerLogger: function (component) {
    this.loggers.push(component);
  },

  unregisterLogger: function (component) {
    this.loggers.splice(this.loggers.indexOf(component), 1);
  }
});

/**
 * In-VR logging using text component.
 */
AFRAME.registerComponent('log', {
  schema: {
    channel: {type: 'string'},
    filter: {type: 'string'},
    max: {default: 100}
  },

  init: function () {
    this.logs = [];
    this.system.registerLogger(this);
  },

  play: function () {
    var self = this;

    // Listen for `<a-scene>.emit('log')`.
    this.el.sceneEl.addEventListener('log', function (evt) {
      if (!evt.detail) { return; }
      self.receiveLog(evt.detail.message, evt.detail.channel);
    });
  },

  receiveLog: function (message, channel) {
    var data = this.data;

    // Coerce to string.
    if (typeof message !== 'string') {
      message = JSON.stringify(message);
    }

    // Match with ID if defined in data or event detail.
    if (data.channel && channel && data.channel !== channel) { return; }

    // Apply filter if `filter` defined.
    if (data.filter && message.indexOf(data.filter) === -1) { return; }

    // Add log.
    this.logs.push(message);

    // Truncate logs if `max` defined.
    if (data.max && this.logs.length > data.max) { this.logs.shift(); }

    // Update text. Each log gets its own line.
    this.el.setAttribute('text', {value: this.logs.join('\n')});
  },

  remove: function () {
    this.el.removeAttribute('text');
    this.system.unregisterLogger(this);
  }
});
