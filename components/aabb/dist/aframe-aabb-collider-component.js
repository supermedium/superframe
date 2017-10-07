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

	/* global AFRAME, THREE */

	if (typeof AFRAME === 'undefined') {
	  throw new Error('Component attempted to register before AFRAME was available.');
	}

	/**
	 * Implement AABB collision detection for entities with a mesh.
	 * https://en.wikipedia.org/wiki/Minimum_bounding_box#Axis-aligned_minimum_bounding_box
	 *
	 * @property {string} objects - Selector of entities to test for collision.
	 */
	AFRAME.registerComponent('aabb-collider', {
	  schema: {
	    interval: {default: 80},
	    objects: {default: ''}
	  },

	  init: function () {
	    this.clearedIntersectedEls = [];
	    this.boundingBox = new THREE.Box3();
	    this.boxMax = new THREE.Vector3();
	    this.boxMin = new THREE.Vector3();
	    this.intersectedEls = [];
	    this.objectEls = [];
	    this.newIntersectedEls = [];
	    this.prevCheckTime = undefined;
	    this.previousIntersectedEls = [];

	    this.hitStartEventDetail = {intersectedEls: this.newIntersectedEls};
	  },

	  /**
	   * Update list of entities to test for collision.
	   */
	  update: function (oldData) {
	    var el = this.el;
	    var data = this.data;
	    var objectEls;
	    var els;

	    // Push entities into list of els to intersect.
	    if (oldData.objects !== data.objects) {
	      els = el.sceneEl.querySelectorAll(data.objects);
	      for (i = 0; i < els.length; i++) {
	        if (els[i] === el) { continue; }
	        this.objectEls.push(els[i]);
	      }
	    } else {
	      // If objects not defined, intersect with everything.
	      this.objectEls = el.sceneEl.children;
	    }
	  },

	  tick: function (time) {
	    var boundingBox = this.boundingBox;
	    var clearedIntersectedEls = this.clearedIntersectedEls;
	    var intersectedEls = this.intersectedEls;
	    var el = this.el;
	    var i;
	    var mesh;
	    var newIntersectedEls = this.newIntersectedEls;
	    var objectEls = this.objectEls;
	    var prevCheckTime = this.prevCheckTime;
	    var previousIntersectedEls = this.previousIntersectedEls;
	    var self = this;

	    // Only check for intersection if interval time has passed.
	    if (prevCheckTime && (time - prevCheckTime < data.interval)) { return; }
	    // Update check time.
	    this.prevCheckTime = time;

	    // No mesh, no collisions
	    mesh = el.getObject3D('mesh');
	    if (!mesh) { return; }

	    // Update the bounding box to account for rotations and position changes.
	    boundingBox.setFromObject(mesh);
	    this.boxMin.copy(boundingBox.min);
	    this.boxMax.copy(boundingBox.max);

	    copyArray(previousIntersectedEls, intersectedEls);

	    // Populate intersectedEls array.
	    intersectedEls.length = 0;
	    for (i = 0; i < objectEls.length; i++) {
	      if (this.isIntersecting(objectEls[i])) {
	        intersectedEls.push(objectEls[i]);
	      }
	    }

	    newIntersectedEls.length = 0;
	    for (i = 0; i < intersectedEls.length; i++) {
	      if (previousIntersectedEls.indexOf(intersectedEls[i]) === -1) {
	        newIntersectedEls.push(intersectedEls[i]);
	      }
	    }


	    // Emit cleared events on no longer intersected entities.
	    clearedIntersectedEls.length = 0;
	    for (i = 0; i < previousIntersectedEls.length; i++) {
	      if (intersectedEls.indexOf(previousIntersectedEls[i]) === -1) {
	        if (!previousIntersectedEls[i].hasAttribute('aabb-collider')) {
	          previousIntersectedEls[i].emit('hitend');
	          previousIntersectedEls[i].emit('raycaster-intersected-cleared');
	        }
	        clearedIntersectedEls.push(previousIntersectedEls[i]);
	      }
	    }

	    // Emit events on intersected entities.
	    for (i = 0; i < newIntersectedEls.length; i++) {
	      if (!newIntersectedEls[i].hasAttribute('aabb-collider')) {
	        newIntersectedEls[i].emit('hitstart');
	        newIntersectedEls[i].emit('raycaster-intersected');
	      }
	    }

	    if (clearedIntersectedEls.length) {
	      el.emit('hitend');
	      el.emit('raycaster-intersection-cleared');
	    }

	    if (newIntersectedEls.length) {
	      el.emit('hitstart', this.hitStartEventDetail);
	      el.emit('raycaster-intersection');
	    }
	  },

	  /**
	   * AABB collision detection.
	   * 3D version of https://www.youtube.com/watch?v=ghqD3e37R7E
	   */
	  isIntersecting: (function () {
	    var boundingBox = new THREE.Box3();

	    return function (el) {
	      var isIntersecting;
	      var mesh;
	      var boxMin;
	      var boxMax;

	      mesh = el.getObject3D('mesh');
	      if (!mesh) { return; }

	      boundingBox.setFromObject(mesh);
	      boxMin = boundingBox.min;
	      boxMax = boundingBox.max;
	      return (this.boxMin.x <= boxMax.x && this.boxMax.x >= boxMin.x) &&
	             (this.boxMin.y <= boxMax.y && this.boxMax.y >= boxMin.y) &&
	             (this.boxMin.z <= boxMax.z && this.boxMax.z >= boxMin.z);
	    };
	  })()
	});

	function copyArray (dest, source) {
	  var i;
	  dest.length = 0;
	  for (i = 0; i < source.length; i++) {
	    dest[i] = source[i];
	  }
	}


/***/ })
/******/ ]);