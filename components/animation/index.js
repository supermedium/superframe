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
 */
AFRAME.registerComponent('animation', {
  schema: {
    delay: {default: 0},
    dir: {default: ''},
    dur: {default: 1000},
    easing: {default: 'easeInQuad'},
    elasticity: {default: 400},
    from: {default: ''},
    loop: {default: false},
    property: {default: ''},
    repeat: {default: 0},
    startEvents: {type: 'array'},
    pauseEvents: {type: 'array'},
    to: {default: ''}
  },

  multiple: true,

  init: function () {
    this.animation = null;
    this.animationIsPlaying = false;
    this.config = null;
    this.playAnimationBound = this.playAnimation.bind(this);
    this.pauseAnimationBound = this.pauseAnimation.bind(this);
    this.repeat = 0;
  },

  update: function () {
    var attrName = this.attrName;
    var data = this.data;
    var el = this.el;
    var propType = getPropertyType(el, data.property);
    var self = this;

    // Base config.
    this.repeat = data.repeat;
    var config = {
      autoplay: false,
      begin: function () {
        el.emit('animation-begin');
        el.emit(attrName + '-begin');
      },
      complete: function () {
        el.emit('animation-complete');
        el.emit(attrName + '-complete');
        // Repeat.
        if (--self.repeat > 0) { self.animation.play(); }
      },
      direction: data.dir,
      duration: data.dur,
      easing: data.easing,
      elasticity: data.elasticity,
      loop: data.loop
    };

    // Customize config based on property type.
    var updateConfig = configDefault;
    if (propType === 'vec2' || propType === 'vec3' || propType === 'vec4') {
      updateConfig = configVector;
    }

    // Stop previous animation.
    this.pauseAnimation();

    // Config.
    this.config = updateConfig(el, data, config);
    this.animation = anime(this.config);

    if (!this.data.startEvents.length) { this.animationIsPlaying = true; }

    // Play animation if no holding event.
    this.removeEventListeners();
    this.addEventListeners();
  },

  remove: function () {
    this.pauseAnimation();
    this.removeEventListeners();
  },

  pause: function () {
    this.pauseAnimation();
    this.removeEventListeners();
  },

  /**
   * Called after update.
   */
  play: function () {
    if (!this.animation || !this.animationIsPlaying) { return; }
    this.playAnimation();
    this.addEventListeners();
  },

  addEventListeners: function () {
    var self = this;
    var data = this.data;
    var el = this.el;
    data.startEvents.map(function (eventName) {
      el.addEventListener(eventName, self.playAnimationBound);
    });
    data.pauseEvents.map(function (eventName) {
      el.addEventListener(eventName, self.pauseAnimationBound);
    });
  },

  removeEventListeners: function () {
    var self = this;
    var data = this.data;
    var el = this.el;
    data.startEvents.map(function (eventName) {
      el.removeEventListener(eventName, self.playAnimationBound);
    });
    data.pauseEvents.map(function (eventName) {
      el.removeEventListener(eventName, self.pauseAnimationBound);
    });
  },

  playAnimation: function () {
    if (!this.animation) { return; }
    this.animation.restart();
    this.animationIsPlaying = true;
  },

  pauseAnimation: function () {
    if (!this.animation) { return; }
    this.animation.pause();
    this.animationIsPlaying = false;
  }
});

/**
 * Stuff property into generic `property` key.
 */
function configDefault (el, data, config) {
  var from = data.from || getComponentProperty(el, data.property);
  return AFRAME.utils.extend({}, config, {
    targets: [{aframeProperty: from}],
    aframeProperty: data.to,
    update: function () {
      setComponentProperty(el, data.property, this.targets[0].aframeProperty);
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
    update: function () {
      setComponentProperty(el, data.property, this.targets[0]);
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
