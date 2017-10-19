/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

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

	    this.el.addEventListener('controllerconnected', function () {
	      setTimeout(function () {
	        self.gamepad = self.el.components['tracked-controls'].controller;
	        if (!self.gamepad.hapticActuators.length) { return; }
	        self.addEventListeners();
	      });
	    });
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


/***/ })
/******/ ]);