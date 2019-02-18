/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

	/* global AFRAME */
	var styleParser = AFRAME.utils.styleParser;
	
	if (typeof AFRAME === 'undefined') {
	  throw new Error('Component attempted to register before AFRAME was available.');
	}
	
	AFRAME.registerComponent('event-set', {
	  schema: {
	    default: '',
	    parse: function (value) {
	      return styleParser.parse(value);
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
	
	  remove: function () {
	    this.removeEventListener();
	  },
	
	  pause: function () {
	    this.removeEventListener();
	  },
	
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
	    var event;
	    var target;
	    var targetEl;
	
	    // Set event listener using `_event`.
	    event = data._event || this.id;
	    target = data._target;
	
	    // Decide the target to `setAttribute` on.
	    targetEl = target ? el.sceneEl.querySelector(target) : el;
	
	    this.eventName = event;
	
	    const handler = () => {
	      var propName;
	      // Set attributes.
	      for (propName in data) {
	        if (propName === '_event' || propName === '_target') { continue; }
	        AFRAME.utils.entity.setComponentProperty.call(this, targetEl, propName,
	                                                      data[propName]);
	      }
	    };
	
	    if (!isNaN(data._delay)) {
	      // Delay.
	      this.eventHandler = () => { setTimeout(handler, parseFloat(data._delay)); };
	    } else {
	      this.eventHandler = handler;
	    }
	  },
	
	  addEventListener: function () {
	    this.el.addEventListener(this.eventName, this.eventHandler);
	  },
	
	  removeEventListener: function () {
	    this.el.removeEventListener(this.eventName, this.eventHandler);
	  }
	});


/***/ })
/******/ ]);