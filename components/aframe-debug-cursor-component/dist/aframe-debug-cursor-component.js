(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(factory());
}(this, (function () { 'use strict';

/**
 * Log cursor events.
 */
AFRAME.registerComponent('debug-cursor', {
  schema: {
    enabled: {default: true}
  },

  init: function () {
    var self = this;

    this.el.addEventListener('mouseenter', function (evt) {
      self.log('mouseenter', evt.detail.intersectedEl, 'green');
    });

    this.el.addEventListener('mouseleave', function (evt) {
      self.log('mouseleave', evt.detail.intersectedEl, 'red');
    });
  },

  log: function (event, intersectedEl, color) {
    if (!this.data.enabled) { return; }

    if (intersectedEl.id) {
      console.log(`%c[${event}] ${intersectedEl.id}`, `color: ${color}`);
    } else {
      console.log(`%c[${event}]`, `color: ${color}`);
      console.log(intersectedEl);
    }
  }
});

})));
