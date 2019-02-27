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

/* global AFRAME */

if (typeof AFRAME === 'undefined') {
	throw new Error('Component attempted to register before AFRAME was available.');
}

AFRAME.registerShader('ring', {
	schema: {
		blur: { default: 0.01, is: 'uniform' },
		color: { type: 'color', is: 'uniform' },
		progress: { default: 0, is: 'uniform' },
		radiusInner: { default: 0.6, is: 'uniform' },
		radiusOuter: { default: 1, is: 'uniform' }
	},

	vertexShader: __webpack_require__(1),

	fragmentShader: __webpack_require__(2)
});

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = "varying vec2 vUv;\n\nvoid main () {\n  vUv = uv;\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n}\n"

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = "#extension GL_OES_standard_derivatives : enable\n#define PI 3.14159265358979\nuniform float blur;\nuniform float progress;\nuniform float radiusInner;\nuniform float radiusOuter;\nuniform vec3 color;\n\nvarying vec2 vUv;\n\nvoid main () {\n  // make uvs go from -1 to 1\n  vec2 uv = vec2(vUv.x * 2.0 - 1.0, vUv.y * 2.0 - 1.0);\n  // calculate distance of fragment to center\n  float r = uv.x * uv.x + uv.y * uv.y;\n  // calculate antialias\n  float aa = fwidth(r);\n  // make full circle (radiusOuter - radiusInner)\n  float col = (1.0 - smoothstep(radiusOuter - aa, radiusOuter + blur + aa, r)) * smoothstep(radiusInner - aa, radiusInner + blur + aa, r);\n  // radial gradient\n  float a = smoothstep(-PI-aa, PI+aa, atan(uv.y, uv.x));\n  // progress angle\n  float p = 1.0 - progress - blur;\n  // apply progress to full circle (1 for done part, 0 for part to go)\n  col *= smoothstep(p, p + blur, a);\n  // multiply by user color\n  gl_FragColor = vec4(color * col, col);\n}\n"

/***/ })
/******/ ]);
});