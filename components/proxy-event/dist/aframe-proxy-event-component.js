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

	/**
	 * Listen to event and forward to another entity or entities.
	 */
	AFRAME.registerComponent('proxy-event', {
	  schema: {
	    captureBubbles: {default: false},
	    enabled: {default: true},
	    event: {type: 'string'},
	    from: {type: 'string'},
	    to: {type: 'string'},
	    as: {type: 'string'},
	    bubbles: {default: false}
	  },

	  multiple: true,

	  init: function () {
	    var data = this.data;
	    var el = this.el;
	    var from;
	    var i;
	    var to;
	    var self = this;

	    if (data.from) {
	      if (data.from === 'PARENT') {
	        from = [el.parentNode];
	      } else {
	        from = document.querySelectorAll(data.from);
	      }
	    } else {
	      if (data.to === 'CHILDREN') {
	        to = el.querySelectorAll('*');
	      } else if (data.to === 'SELF') {
	        to = [el];
	      } else {
	        to = document.querySelectorAll(data.to);
	      }
	    }

	    if (data.from) {
	      for (i = 0; i < from.length; i++) {
	        this.addEventListenerFrom(from[i]);
	      }
	    } else {
	      el.addEventListener(data.event, function (evt) {
	        var data = self.data;
	        if (!data.enabled) { return; }
	        if (!data.captureBubbles && evt.target !== el) { return; }
	        for (i = 0; i < to.length; i++) {
	          to[i].emit(data.as || data.event, evt['detail'] ? evt.detail : null, data.bubbles);
	        }
	      });
	    }
	  },

	  addEventListenerFrom: function (fromEl) {
	    var data = this.data;
	    var self = this;
	    fromEl.addEventListener(data.event, function (evt) {
	      var data = self.data;
	      if (!data.enabled) { return; }
	      if (!data.captureBubbles && evt.target !== fromEl) { return; }
	      self.el.emit(data.as || data.event, evt['detail'] ? evt.detail : null, false);
	    });
	  }
	});


/***/ })
/******/ ]);