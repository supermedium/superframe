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
/***/ function(module, exports) {

	if (typeof AFRAME === 'undefined') {
	  throw new Error('Component attempted to register before AFRAME was available.');
	}

	/**
	 * Set random color within bounds.
	 */
	AFRAME.registerComponent('random-color', {
	  schema: {
	    min: {default: {x: 0, y: 0, z: 0}, type: 'vec3'},
	    max: {default: {x: 1, y: 1, z: 1}, type: 'vec3'}
	  },

	  update: function () {
	    var data = this.data;
	    var max = data.max;
	    var min = data.min;
	    this.el.setAttribute('material', 'color', '#' + new THREE.Color(
	      Math.random() * max.x + min.x,
	      Math.random() * max.y + min.y,
	      Math.random() * max.z + min.z
	    ).getHexString());
	  }
	});

	/**
	 * Set random position within bounds.
	 */
	AFRAME.registerComponent('random-position', {
	  schema: {
	    min: {default: {x: -10, y: -10, z: -10}, type: 'vec3'},
	    max: {default: {x: 10, y: 10, z: 10}, type: 'vec3'}
	  },

	  update: function () {
	    var data = this.data;
	    var max = data.max;
	    var min = data.min;
	    this.el.setAttribute('position', {
	      x: Math.random() * (max.x - min.x) + min.x,
	      y: Math.random() * (max.y - min.y) + min.y,
	      z: Math.random() * (max.z - min.z) + min.z
	    });
	  }
	});

	/**
	 * Set random position within spherical bounds.
	 */
	AFRAME.registerComponent('random-spherical-position', {
	  schema: {
	    radius: {default: 10},
	    startX: {default: 0},
	    lengthX: {default: 360},
	    startY: {default: 0},
	    lengthY: {default: 360}
	  },

	  update: function () {
	    var data = this.data;

	    var xAngle = THREE.Math.degToRad(Math.random() * data.lengthX + data.startX);
	    var yAngle = THREE.Math.degToRad(Math.random() * data.lengthY + data.startY);

	    this.el.setAttribute('position', {
	      x: data.radius * Math.cos(xAngle) * Math.sin(yAngle),
	      y: data.radius * Math.sin(xAngle) * Math.sin(yAngle),
	      z: data.radius * Math.cos(yAngle)
	    });
	  }
	});

	/**
	 * Set random rotation within bounds.
	 */
	AFRAME.registerComponent('random-rotation', {
	  schema: {
	    min: {default: {x: 0, y: 0, z: 0}, type: 'vec3'},
	    max: {default: {x: 360, y: 360, z: 360}, type: 'vec3'}
	  },

	  update: function () {
	    var data = this.data;
	    var max = data.max;
	    var min = data.min;
	    this.el.setAttribute('rotation', {
	      x: Math.random() * max.x + min.x,
	      y: Math.random() * max.y + min.y,
	      z: Math.random() * max.z + min.z
	    });
	  }
	});

	/**
	 * Set random scale within bounds.
	 */
	AFRAME.registerComponent('random-scale', {
	  schema: {
	    min: {default: {x: 0, y: 0, z: 0}, type: 'vec3'},
	    max: {default: {x: 2, y: 2, z: 2}, type: 'vec3'}
	  },

	  update: function () {
	    var data = this.data;
	    var max = data.max;
	    var min = data.min;
	    this.el.setAttribute('scale', {
	      x: Math.random() * max.x + min.x,
	      y: Math.random() * max.y + min.y,
	      z: Math.random() * max.z + min.z
	    });
	  }
	});


/***/ }
/******/ ]);