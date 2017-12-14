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
    var self = this;

    this.eventDetail = {name: this.attrName};

    this.animation = null;
    this.animationIsPlaying = false;
    this.pauseAnimationBound = this.pauseAnimation.bind(this);
    this.beginAnimationBound = this.beginAnimation.bind(this);
    this.restartAnimationBound = this.restartAnimation.bind(this);
    this.resumeAnimationBound = this.resumeAnimation.bind(this);

    this.config = {
      complete: function () {i
        self.el.emit('animationcomplete', self.eventDetail);
      }
    };
  },

  update: function () {
    var attrName = this.attrName;
    var config = this.config;
    var data = this.data;
    var el = this.el;
    var propType;
    var self = this;
    var updateConfig;

    this.animationIsPlaying = false;

    if (!data.property) { return; }

    // Base config.
    config.autoplay = false;
    config.direction = data.dir;
    config.duration = data.dur;
    config.easing = data.easing;
    config.elasticity = data.elasticity;
    config.loop = data.loop;

    // Check if vector config.
    propType = getPropertyType(el, data.property);
    if (propType === 'vec2' || propType === 'vec3' || propType === 'vec4') {
      this.updateConfigForVector();
    } else {
      this.updateConfigForDefault();
    }

    // Stop previous animation.
    this.pauseAnimation();

    // Start new animation.
    this.startAnimation();
  },

  tick: function (t) {
    if (!this.animationIsPlaying) { return; }
    this.animation.tick(t);
  },

  remove: function () {
    this.pauseAnimation();
    this.removeEventListeners();
  },

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
   * Stuff property into generic `property` key.
   */
  updateConfigForDefault: function () {
    var config = this.config;
    var data = this.data;
    var el = this.el;
    var from;

    from = data.from || getComponentProperty(el, data.property);
    config.targets = {aframeProperty: from};
    config.aframeProperty = data.to;
    config.update = function (anim) {
      setComponentProperty(el, data.property, anim.animatables[0].target.aframeProperty);
    }
  },

  /**
   * Extend x/y/z/w onto the config.
   * Update vector by modifying object3D.
   */
  updateConfigForVector: function () {
    var config = this.config;
    var data = this.data;
    var el = this.el;
    var key;
    var from;
    var to;

    // Parse coordinates.
    from = getComponentProperty(el, data.property);
    if (data.from) { from = AFRAME.utils.coordinates.parse(data.from); }
    to = AFRAME.utils.coordinates.parse(data.to);

    // Animate rotation through radians.
    if (data.property === 'rotation') {
      toRadians(from);
      toRadians(to);
    }

    // Set to and from.
    config.targets = [from];
    for (key in to) { config[key] = to[key]; }

    // Set update function.
    if (data.property === 'position' || data.property === 'rotation' ||
        data.property === 'scale') {
      // If animating object3D transformation, run more optimized updater.
      config.update = function (anim) {
        el.object3D[data.property].copy(anim.animatables[0].target);
      }
    } else {
      // Animating some vector.
      config.update = function (anim) {
        setComponentProperty(el, property, anim.animations[0].target);
      }
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
    this.animationIsPlaying = true;
    this.el.emit('animationbegin', this.eventDetail);
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
    addEventListeners(el, data.startEvents, this.beginAnimationBound);
    addEventListeners(el, data.pauseEvents, this.pauseAnimationBound);
    addEventListeners(el, data.resumeEvents, this.resumeAnimationBound);
    addEventListeners(el, data.restartEvents, this.restartAnimationBound);
  },

  removeEventListeners: function () {
    var data = this.data;
    var el = this.el;
    removeEventListeners(el, data.startEvents, this.beginAnimationBound);
    removeEventListeners(el, data.pauseEvents, this.pauseAnimationBound);
    removeEventListeners(el, data.resumeEvents, this.resumeAnimationBound);
    removeEventListeners(el, data.restartEvents, this.restartAnimationBound);
  }
});

/**
 * Given property name, check schema to see what type we are animating.
 * We just care whether the property is a vector.
 */
function getPropertyType (el, property) {
  var component;
  var componentName;
  var split;
  var propertyName;

  split = property.split('.');
  componentName = split[0];
  propertyName = split[1];
  component = el.components[componentName] || AFRAME.components[componentName];

  // Primitives.
  if (!component) { return null; }

  // Dynamic schema. We only care about vectors anyways.
  if (propertyName && !component.schema[propertyName]) { return null; }

  // Multi-prop.
  if (propertyName) { return component.schema[propertyName].type; }

  // Single-prop.
  return component.schema.type;
}

/**
 * Convert object to radians.
 */
function toRadians (obj) {
  obj.x = THREE.Math.degToRad(obj.x);
  obj.y = THREE.Math.degToRad(obj.y);
  obj.z = THREE.Math.degToRad(obj.z);
}

function addEventListeners (el, eventNames, handler) {
  var i;
  for (i = 0; i < eventNames.length; i++) {
    el.addEventListener(eventNames[i], handler);
  }
}

function removeEventListeners (el, eventNames, handler) {
  var i;
  for (i = 0; i < eventNames.length; i++) {
    el.removeEventListener(eventNames[i], handler);
  }
}
