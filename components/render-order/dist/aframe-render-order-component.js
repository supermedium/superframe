/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/***/ (() => {

eval("AFRAME.registerSystem('render-order', {\n  schema: {\n    type: 'array'\n  },\n  init: function () {\n    this.el.renderer.sortObjects = true;\n  },\n  update: function () {\n    this.order = {};\n    for (i = 0; i < this.data.length; i++) {\n      this.order[this.data[i]] = i;\n    }\n  }\n});\nAFRAME.registerComponent('render-order', {\n  schema: {\n    type: 'string'\n  },\n  multiple: true,\n  init: function () {\n    this.set = this.set.bind(this);\n    this.el.addEventListener('object3dset', evt => {\n      if (this.id !== 'nonrecursive') {\n        evt.detail.object.traverse(this.set);\n      }\n    });\n  },\n  update: function () {\n    if (this.id === 'nonrecursive') {\n      this.set(this.el.object3D);\n    } else {\n      this.el.object3D.traverse(this.set);\n    }\n  },\n  set: function (node) {\n    // String (named order).\n    if (isNaN(this.data)) {\n      node.renderOrder = this.system.order[this.data];\n    } else {\n      node.renderOrder = parseFloat(this.data);\n    }\n  }\n});\nAFRAME.registerComponent('render-order-recursive', {\n  init: function () {\n    this.el.addEventListener('child-attached', evt => {\n      evt.detail.el.setAttribute('render-order', this.el.getAttribute('render-order'));\n    });\n  }\n});\n\n//# sourceURL=webpack://aframe-render-order-component/./index.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./index.js"]();
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});