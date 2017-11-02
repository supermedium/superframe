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

	AFRAME.registerComponent('fps-counter', {
	  schema: {
	    enabled: {default: true},
	    for90fps: {default: true}
	  },

	  init: function () {
	    if (!this.data.enabled) {
	      this.el.sceneEl.removeBehavior(this);
	      return;
	    }
	    this.el.setAttribute('text', {align: 'center', side: 'double'});
	    this.el.sceneEl.setAttribute('stats', '');
	  },

	  tick: function (t, dt) {
	    var color;
	    var fps;
	    var self = this;

	    if (!this.fpsDiv) {
	      this.fpsDiv = document.querySelector('.rs-counter-base:nth-child(2) .rs-counter-value');
	      return;
	    }

	    fps = parseFloat(this.fpsDiv.innerHTML, 10);
	    if (this.data.for90fps) {
	      if (fps < 85) { color = 'yellow'; }
	      if (fps < 80) { color = 'orange'; }
	      if (fps < 75) { color = 'red'; }
	    } else {
	      if (fps < 55) { color = 'yellow'; }
	      if (fps < 50) { color = 'orange'; }
	      if (fps < 45) { color = 'red'; }
	    }

	    if (color) {
	      this.el.setAttribute('text', 'color', color);
	      setTimeout(function () {
	        self.el.setAttribute('text', 'color', 'white');
	      }, 500);
	    }

	    this.el.setAttribute('text', 'value', fps.toFixed(0));
	  }
	});


/***/ })
/******/ ]);