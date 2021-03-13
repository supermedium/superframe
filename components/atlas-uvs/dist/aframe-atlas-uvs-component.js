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


// For aux use.
var uvs = [new THREE.Vector2(), new THREE.Vector2(), new THREE.Vector2(), new THREE.Vector2()];

/**
 * 1-indexed.
 */
AFRAME.registerComponent('atlas-uvs', {
  dependencies: ['geometry'],

  schema: {
    totalColumns: { type: 'int', default: 1 },
    totalRows: { type: 'int', default: 1 },
    column: { type: 'int', default: 1 },
    row: { type: 'int', default: 1 }
  },

  update: function update() {
    var data = this.data;
    var uvs = getGridUvs(data.row - 1, data.column - 1, data.totalRows, data.totalColumns);

    var geometry = this.el.getObject3D('mesh').geometry;

    var float32Array = new Float32Array([uvs[0].x, uvs[0].y, uvs[3].x, uvs[3].y, uvs[1].x, uvs[1].y, uvs[2].x, uvs[2].y]);
    geometry.setAttribute('uv', new THREE.BufferAttribute(float32Array, 2));
    geometry.uvsNeedUpdate = true;
  }
});

AFRAME.registerComponent('dynamic-texture-atlas', {
  schema: {
    canvasId: { default: 'dynamicAtlas' },
    canvasHeight: { default: 1024 },
    canvasWidth: { default: 1024 },
    debug: { default: false },
    numColumns: { default: 8 },
    numRows: { default: 8 }
  },

  multiple: true,

  init: function init() {
    var canvas = this.canvas = document.createElement('canvas');
    canvas.id = this.data.canvasId;
    canvas.height = this.data.canvasHeight;
    canvas.width = this.data.canvasWidth;
    this.ctx = canvas.getContext('2d');
    document.body.appendChild(canvas);

    if (this.data.debug) {
      canvas.style.left = 0;
      canvas.style.top = 0;
      canvas.style.position = 'fixed';
      canvas.style.zIndex = 9999999999;
    }
  },

  drawTexture: function drawTexture(image, row, column, width, height) {
    var _this = this;

    var canvas = this.canvas;
    var data = this.data;

    if (!image.complete) {
      image.onload = function () {
        _this.drawTexture(image, row, column);
      };
    }

    var gridHeight = height || canvas.height / data.numRows;
    var gridWidth = width || canvas.width / data.numColumns;

    // image, dx, dy, dwidth, dheight
    this.ctx.drawImage(image, gridWidth * row, gridWidth * column, gridWidth, gridHeight);

    // Return UVs.
    return getGridUvs(row, column, data.numRows, data.numColumns);
  }
});

/**
 * Return UVs for an texture within an atlas, given the row and column info.
 */
function getGridUvs(row, column, totalRows, totalColumns) {
  var columnWidth = 1 / totalColumns;
  var rowHeight = 1 / totalRows;

  // create a Map called `uvs` to hold the 4 UV pairs
  uvs[0].set(columnWidth * column, rowHeight * row + rowHeight);
  uvs[1].set(columnWidth * column, rowHeight * row);
  uvs[2].set(columnWidth * column + columnWidth, rowHeight * row);
  uvs[3].set(columnWidth * column + columnWidth, rowHeight * row + rowHeight);
  return uvs;
}
module.exports.getGridUvs = getGridUvs;

/***/ })
/******/ ]);
});