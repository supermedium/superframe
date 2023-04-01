(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
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
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/* global AFRAME, THREE */

if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.');
}

// Configuration for the MutationObserver used to refresh the whitelist.
// Listens for addition/removal of elements and attributes within the scene.
var OBSERVER_CONFIG = {
  childList: true,
  attributes: true,
  subtree: true
};

/**
 * Implement AABB collision detection for entities with a mesh.
 * https://en.wikipedia.org/wiki/Minimum_bounding_box#Axis-aligned_minimum_bounding_box
 *
 * @property {string} objects - Selector of entities to test for collision.
 */
AFRAME.registerComponent('aabb-collider', {
  schema: {
    collideNonVisible: { default: false },
    debug: { default: false },
    enabled: { default: true },
    interval: { default: 80 },
    objects: { default: '' }
  },

  init: function init() {
    this.centerDifferenceVec3 = new THREE.Vector3();
    this.clearedIntersectedEls = [];
    this.closestIntersectedEl = null;
    this.boundingBox = new THREE.Box3();
    this.boxCenter = new THREE.Vector3();
    this.boxHelper = new THREE.BoxHelper();
    this.boxMax = new THREE.Vector3();
    this.boxMin = new THREE.Vector3();
    this.hitClosestClearEventDetail = {};
    this.hitClosestEventDetail = {};
    this.intersectedEls = [];
    this.objectEls = [];
    this.newIntersectedEls = [];
    this.prevCheckTime = undefined;
    this.previousIntersectedEls = [];

    this.setDirty = this.setDirty.bind(this);
    this.observer = new MutationObserver(this.setDirty);
    this.dirty = true;

    this.hitStartEventDetail = { intersectedEls: this.newIntersectedEls };
  },

  play: function play() {
    this.observer.observe(this.el.sceneEl, OBSERVER_CONFIG);
    this.el.sceneEl.addEventListener('object3dset', this.setDirty);
    this.el.sceneEl.addEventListener('object3dremove', this.setDirty);
  },

  remove: function remove() {
    this.observer.disconnect();
    this.el.sceneEl.removeEventListener('object3dset', this.setDirty);
    this.el.sceneEl.removeEventListener('object3dremove', this.setDirty);
    if (this.data.debug) {
      if (this.boxHelper) {
        this.el.sceneEl.object3D.remove(this.boxHelper);
        this.boxHelper.dispose && this.boxHelper.dispose();
        this.boxHelper = null;
      }
      for (var i = 0; i < this.objectEls.length; i++) {
        var boxHelper = this.objectEls[i].object3D.boxHelper;
        if (boxHelper) {
          this.el.sceneEl.object3D.remove(boxHelper);
          this.objectEls[i].object3D.boxHelper = null;
          boxHelper.dispose && boxHelper.dispose();
        }
      }
    }
  },

  tick: function tick(time) {
    var boundingBox = this.boundingBox;
    var centerDifferenceVec3 = this.centerDifferenceVec3;
    var clearedIntersectedEls = this.clearedIntersectedEls;
    var el = this.el;
    var intersectedEls = this.intersectedEls;
    var newIntersectedEls = this.newIntersectedEls;
    var objectEls = this.objectEls;
    var prevCheckTime = this.prevCheckTime;
    var previousIntersectedEls = this.previousIntersectedEls;

    var closestCenterDifference = void 0;
    var newClosestEl = void 0;
    var i = void 0;

    if (!this.data.enabled) {
      return;
    }

    // Only check for intersection if interval time has passed.
    if (prevCheckTime && time - prevCheckTime < this.data.interval) {
      return;
    }
    // Update check time.
    this.prevCheckTime = time;

    if (this.dirty) {
      this.refreshObjects();
    }

    // Update the bounding box to account for rotations and position changes.
    boundingBox.setFromObject(el.object3D);
    this.boxMin.copy(boundingBox.min);
    this.boxMax.copy(boundingBox.max);
    boundingBox.getCenter(this.boxCenter);

    if (this.data.debug) {
      this.boxHelper.setFromObject(el.object3D);
      if (!this.boxHelper.parent) {
        el.sceneEl.object3D.add(this.boxHelper);
      }
    }

    copyArray(previousIntersectedEls, intersectedEls);

    // Populate intersectedEls array.
    intersectedEls.length = 0;
    for (i = 0; i < objectEls.length; i++) {
      if (objectEls[i] === this.el) {
        continue;
      }

      // Don't collide with non-visible if flag set.
      if (!this.data.collideNonVisible && !objectEls[i].getAttribute('visible')) {
        // Remove box helper if debug flag set and has box helper.
        if (this.data.debug) {
          var boxHelper = objectEls[i].object3D.boxHelper;
          if (boxHelper) {
            el.sceneEl.object3D.remove(boxHelper);
            objectEls[i].object3D.boxHelper = null;
            boxHelper.dispose && boxHelper.dispose();
          }
        }
        continue;
      }

      // Check for interection.
      if (this.isIntersecting(objectEls[i])) {
        intersectedEls.push(objectEls[i]);
      }
    }

    // Get newly intersected entities.
    newIntersectedEls.length = 0;
    for (i = 0; i < intersectedEls.length; i++) {
      if (previousIntersectedEls.indexOf(intersectedEls[i]) === -1) {
        newIntersectedEls.push(intersectedEls[i]);
      }
    }

    // Emit cleared events on no longer intersected entities.
    clearedIntersectedEls.length = 0;
    for (i = 0; i < previousIntersectedEls.length; i++) {
      if (intersectedEls.indexOf(previousIntersectedEls[i]) !== -1) {
        continue;
      }
      if (!previousIntersectedEls[i].hasAttribute('aabb-collider')) {
        previousIntersectedEls[i].emit('hitend');
      }
      clearedIntersectedEls.push(previousIntersectedEls[i]);
    }

    // Emit events on intersected entities. Do this after the cleared events.
    for (i = 0; i < newIntersectedEls.length; i++) {
      if (newIntersectedEls[i] === this.el) {
        continue;
      }
      if (newIntersectedEls[i].hasAttribute('aabb-collider')) {
        continue;
      }
      newIntersectedEls[i].emit('hitstart');
    }

    // Calculate closest intersected entity based on centers.
    for (i = 0; i < intersectedEls.length; i++) {
      if (intersectedEls[i] === this.el) {
        continue;
      }
      centerDifferenceVec3.copy(intersectedEls[i].object3D.boundingBoxCenter).sub(this.boxCenter);
      if (closestCenterDifference === undefined || centerDifferenceVec3.length() < closestCenterDifference) {
        closestCenterDifference = centerDifferenceVec3.length();
        newClosestEl = intersectedEls[i];
      }
    }

    // Emit events for the new closest entity and the old closest entity.
    if (!intersectedEls.length && this.closestIntersectedEl) {
      // No intersected entities, clear any closest entity.
      this.hitClosestClearEventDetail.el = this.closestIntersectedEl;
      this.closestIntersectedEl.emit('hitclosestclear');
      this.closestIntersectedEl = null;
      el.emit('hitclosestclear', this.hitClosestClearEventDetail);
    } else if (newClosestEl !== this.closestIntersectedEl) {
      // Clear the previous closest entity.
      if (this.closestIntersectedEl) {
        this.hitClosestClearEventDetail.el = this.closestIntersectedEl;
        this.closestIntersectedEl.emit('hitclosestclear', this.hitClosestClearEventDetail);
      }
      if (newClosestEl) {
        // Emit for the new closest entity.
        newClosestEl.emit('hitclosest');
        this.closestIntersectedEl = newClosestEl;
        this.hitClosestEventDetail.el = newClosestEl;
        el.emit('hitclosest', this.hitClosestEventDetail);
      }
    }

    if (clearedIntersectedEls.length) {
      el.emit('hitend');
    }

    if (newIntersectedEls.length) {
      el.emit('hitstart', this.hitStartEventDetail);
    }
  },

  /**
   * AABB collision detection.
   * 3D version of https://www.youtube.com/watch?v=ghqD3e37R7E
   */
  isIntersecting: function () {
    var boundingBox = new THREE.Box3();

    return function (el) {
      var box = void 0;

      // Dynamic, recalculate each tick.
      if (el.dataset.aabbColliderDynamic !== undefined) {
        // Box.
        boundingBox.setFromObject(el.object3D);
        box = boundingBox;
        // Center.
        el.object3D.boundingBoxCenter = el.object3D.boundingBoxCenter || new THREE.Vector3();
        box.getCenter(el.object3D.boundingBoxCenter);
      }

      // Static, reuse box and centers.
      if (el.dataset.aabbColliderDynamic === undefined) {
        if (!el.object3D.aabbBox) {
          // Box.
          el.object3D.updateWorldMatrix(true, false);
          el.object3D.aabbBox = new THREE.Box3().setFromObject(el.object3D);
          // Center.
          el.object3D.boundingBoxCenter = new THREE.Vector3();
          el.object3D.aabbBox.getCenter(el.object3D.boundingBoxCenter);
        }
        box = el.object3D.aabbBox;
      }

      if (this.data.debug) {
        if (!el.object3D.boxHelper) {
          el.object3D.boxHelper = new THREE.BoxHelper(el.object3D, new THREE.Color(Math.random(), Math.random(), Math.random()));
          el.sceneEl.object3D.add(el.object3D.boxHelper);
        }
        el.object3D.boxHelper.setFromObject(el.object3D);
      }

      var boxMin = box.min;
      var boxMax = box.max;
      return this.boxMin.x <= boxMax.x && this.boxMax.x >= boxMin.x && this.boxMin.y <= boxMax.y && this.boxMax.y >= boxMin.y && this.boxMin.z <= boxMax.z && this.boxMax.z >= boxMin.z;
    };
  }(),

  /**
   * Mark the object list as dirty, to be refreshed before next raycast.
   */
  setDirty: function setDirty() {
    this.dirty = true;
  },

  /**
   * Update list of objects to test for intersection.
   */
  refreshObjects: function refreshObjects() {
    var data = this.data;
    // If objects not defined, intersect with everything.
    this.objectEls = data.objects ? this.el.sceneEl.querySelectorAll(data.objects) : this.el.sceneEl.children;
    this.dirty = false;
  }
});

function copyArray(dest, source) {
  dest.length = 0;
  for (var i = 0; i < source.length; i++) {
    dest[i] = source[i];
  }
}

/***/ })
/******/ ]);
});