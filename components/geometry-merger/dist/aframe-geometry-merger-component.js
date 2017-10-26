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

	AFRAME.registerComponent('geometry-merger', {
	  schema: {
	    preserveOriginal: {default: false}
	  },

	  init: function () {
	    var faceIndexEnd;
	    var faceIndexStart;
	    var self = this;

	    this.geometry = new THREE.Geometry();
	    this.mesh = new THREE.Mesh(this.geometry);
	    this.el.setObject3D('mesh', this.mesh);

	    this.faceIndex = {};  // Keep index of original entity UUID to new face array.
	    this.vertexIndex = {};  // Keep index of original entity UUID to vertex array.

	    this.el.object3D.traverse(function (mesh) {
	      if (mesh.type !== 'Mesh') { return; }
	      if (mesh === self.mesh) { return; }

	      self.faceIndex[mesh.parent.uuid] = [
	        self.geometry.faces.length,
	        self.geometry.faces.length + mesh.geometry.faces.length - 1
	      ];

	      self.vertexIndex[mesh.parent.uuid] = [
	        self.geometry.vertices.length,
	        self.geometry.vertices.length + mesh.geometry.vertices.length - 1
	      ];

	      // Merge. Use parent's matrix due to A-Frame's <a-entity>(Group-Mesh) hierarchy.
	      mesh.parent.updateMatrix();
	      self.geometry.merge(mesh.geometry, mesh.parent.matrix);

	      // Remove mesh if not preserving.
	      if (!self.data.preserveOriginal) { mesh.parent.remove(mesh); }
	    });
	  }
	});


/***/ })
/******/ ]);