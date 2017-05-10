/* global AFRAME */

var anime = require('animejs');

if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.');
}

var utils = AFRAME.utils;
var getComponentProperty = utils.entity.getComponentProperty;
var setComponentProperty = utils.entity.setComponentProperty;
var styleParser = utils.styleParser.parse;

/**
 * Animation component for A-Frame.
 *
 * @member {object} animation - anime.js instance.
 * @member {boolean} animationIsPlaying - Control if animation is playing.
 */
AFRAME.registerComponent('animation', {
  schema: {
    delay: {default: 0},
    dir: {default: ''},
    dur: {default: 1000},
    easing: {default: 'easeInQuad'},
    elasticity: {default: 400},
    from: {default: ''},
    loop: {
      default: 0,
      parse: function (value) {
        // Boolean or integer.
        if (value === 'true') { return true; }
        if (value === 'false') { return false; }
        return parseInt(value, 10);
      }
    },
    property: {default: ''},
    startEvents: {type: 'array'},
    pauseEvents: {type: 'array'},
    resumeEvents: {type: 'array'},
    restartEvents: {type: 'array'},
    to: {default: ''}
  },

  multiple: true,

  init: function () {
    this.animation = null;
    this.animationIsPlaying = false;
    this.config = null;
    this.pauseAnimationBound = this.pauseAnimation.bind(this);
    this.beginAnimationBound = this.beginAnimation.bind(this);
    this.restartAnimationBound = this.restartAnimation.bind(this);
    this.resumeAnimationBound = this.resumeAnimation.bind(this);
  },

  update: function () {
    var attrName = this.attrName;
    var config;
    var data = this.data;
    var el = this.el;
    var propType = getPropertyType(el, data.property);
    var self = this;
    var updateConfig;

    this.animationIsPlaying = false;

    if (!data.property) { return; }

    // Base config.
    config = {
      autoplay: false,
      complete: function () {
        el.emit('animationcomplete', config);
        el.emit(attrName + '-complete', config);
      },
      direction: data.dir,
      duration: data.dur,
      easing: data.easing,
      elasticity: data.elasticity,
      loop: data.loop
    };

    // Customize config based on property type.
    updateConfig = configDefault;
    if (propType === 'vec2' || propType === 'vec3' || propType === 'vec4') {
      updateConfig = configVector;
    }

    // Create config.
    this.config = updateConfig(el, data, config);

    // Stop previous animation.
    this.pauseAnimation();

    // Start new animation.
    this.startAnimation();
  },

  tick: function (t) {
    if (!this.animationIsPlaying) { return; }
    this.animation.tick(t);
  },

  /**
   * `remove` handler.
   */
  remove: function () {
    this.pauseAnimation();
    this.removeEventListeners();
  },

  /**
   * `pause` handler.
   */
  pause: function () {
    this.paused = true;
    this.pausedWasPlaying = true;
    this.pauseAnimation();
    this.removeEventListeners();
  },

  /**
   * `play` handler only for resuming scene.
   */
  play: function () {
    if (!this.paused) { return; }
    this.paused = false;
    this.addEventListeners();
    if (this.pausedWasPlaying) {
      this.resumeAnimation();
      this.pausedWasPlaying = false;
    }
  },

  /**
   * Start animation from scratch.
   */
  startAnimation: function () {
    var data = this.data;
    var el = this.el;
    var self = this;

    this.animationIsPlaying = false;
    this.animation = anime(this.config);

    this.removeEventListeners();
    this.addEventListeners();

    // Delay animation.
    if (data.delay) {
      setTimeout(this.beginAnimationBound, data.delay);
      return;
    }

    // Wait for start events for animation.
    if (data.startEvents && data.startEvents.length) { return; }

    // Play animation.
    this.beginAnimation();
  },

  pauseAnimation: function () {
    this.animationIsPlaying = false;
  },

  beginAnimation: function () {
    var el = this.el;
    this.animationIsPlaying = true;
    el.emit('animationbegin');
    el.emit(this.attrName + '-begin');
  },

  restartAnimation: function () {
    this.animation.restart();
  },

  resumeAnimation: function () {
    this.animationIsPlaying = true;
  },

  addEventListeners: function () {
    var data = this.data;
    var el = this.el;
    var self = this;
    data.startEvents.map(function (eventName) {
      el.addEventListener(eventName, self.beginAnimationBound);
    });
    data.pauseEvents.map(function (eventName) {
      el.addEventListener(eventName, self.pauseAnimationBound);
    });
    data.resumeEvents.map(function (eventName) {
      el.addEventListener(eventName, self.resumeAnimationBound);
    });
    data.restartEvents.map(function (eventName) {
      el.addEventListener(eventName, self.restartAnimationBound);
    });
  },

  removeEventListeners: function () {
    var data = this.data;
    var el = this.el;
    var self = this;
    data.startEvents.map(function (eventName) {
      el.removeEventListener(eventName, self.beginAnimationBound);
    });
    data.pauseEvents.map(function (eventName) {
      el.removeEventListener(eventName, self.pauseAnimationBound);
    });
    data.resumeEvents.map(function (eventName) {
      el.removeEventListener(eventName, self.resumeAnimationBound);
    });
    data.restartEvents.map(function (eventName) {
      el.removeEventListener(eventName, self.restartAnimationBound);
    });
  }
});

/**
 * Stuff property into generic `property` key.
 */
function configDefault (el, data, config) {
  var from = data.from || getComponentProperty(el, data.property);
  return AFRAME.utils.extend({}, config, {
    targets: {aframeProperty: from},
    aframeProperty: data.to,
    update: function (anim) {
      setComponentProperty(el, data.property, anim.animatables[0].target.aframeProperty);
    }
  });
}

/**
 * Extend x/y/z/w onto the config.
 */
function configVector (el, data, config) {
  var from = getComponentProperty(el, data.property);
  if (data.from) { from = AFRAME.utils.coordinates.parse(data.from); }
  var to = AFRAME.utils.coordinates.parse(data.to);
  return AFRAME.utils.extend({}, config, {
    targets: [from],
    update: function (anim) {
      setComponentProperty(el, data.property, anim.animatables[0].target);
    }
  }, to);
}

function getPropertyType (el, property) {
  var split = property.split('.');
  var componentName = split[0];
  var propertyName = split[1];
  var component = el.components[componentName] || AFRAME.components[componentName];

  // Primitives.
  if (!component) { return null; }

  if (propertyName) {
    return component.schema[propertyName].type;
  }
  return component.schema.type;
}
