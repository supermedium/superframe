/******/ (function(modules) { // webpackBootstrap
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
/***/ (function(module, exports) {

var uvs = [new THREE.Vector2(), new THREE.Vector2(), new THREE.Vector2(), new THREE.Vector2()];

/**
 * 1-indexed.
 */
AFRAME.registerComponent('atlas-uvs', {
  dependencies: ['geometry'],

  schema: {
    totalColumns: {type: 'int', default: 1},
    totalRows: {type: 'int', default: 1},
    column: {type: 'int', default: 1},
    row: {type: 'int', default: 1}
  },

  init: function () {
    var geometry;
    geometry = this.el.getObject3D('mesh').geometry;
    geometry.faceVertexUvs[0][0] = [new THREE.Vector2(), new THREE.Vector2(), new THREE.Vector2()];
    geometry.faceVertexUvs[0][1] = [new THREE.Vector2(), new THREE.Vector2(), new THREE.Vector2()];
  },

  update: function () {
    var column;
    var columnWidth;
    var data = this.data;
    var geometry;
    var row;
    var rowHeight;

    column = data.column - 1;
    row = data.row - 1;
    columnWidth = 1 / data.totalRows;
    rowHeight = 1 / data.totalColumns;

    uvs[0].set(columnWidth * column,
               rowHeight * row + rowHeight);
    uvs[1].set(columnWidth * column,
               rowHeight * row);
    uvs[2].set(columnWidth * column + columnWidth,
               rowHeight * row);
    uvs[3].set(columnWidth * column + columnWidth,
               rowHeight * row + rowHeight);

    geometry = this.el.getObject3D('mesh').geometry;
    geometry.faceVertexUvs[0][0][0].copy(uvs[0]);
    geometry.faceVertexUvs[0][0][1].copy(uvs[1]);
    geometry.faceVertexUvs[0][0][2].copy(uvs[3]);
    geometry.faceVertexUvs[0][1][0].copy(uvs[1]);
    geometry.faceVertexUvs[0][1][1].copy(uvs[2]);
    geometry.faceVertexUvs[0][1][2].copy(uvs[3]);
    geometry.uvsNeedUpdate = true;
  }
});


/***/ })
/******/ ]);