/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

eval("/**\r\n * TextGeometry component for A-Frame.\r\n */\r\n__webpack_require__(/*! ./lib/FontLoader */ \"./lib/FontLoader.js\")\r\n__webpack_require__(/*! ./lib/TextGeometry */ \"./lib/TextGeometry.js\")\r\n\r\nvar debug = AFRAME.utils.debug;\r\n\r\nvar error = debug('aframe-text-component:error');\r\n\r\nvar fontLoader = new THREE.FontLoader();\r\n\r\nAFRAME.registerComponent('text-geometry', {\r\n  schema: {\r\n    bevelEnabled: {default: false},\r\n    bevelSize: {default: 8, min: 0},\r\n    bevelThickness: {default: 12, min: 0},\r\n    curveSegments: {default: 12, min: 0},\r\n    font: {type: 'asset', default: 'https://rawgit.com/ngokevin/kframe/master/components/text-geometry/lib/helvetiker_regular.typeface.json'},\r\n    height: {default: 0.05, min: 0},\r\n    size: {default: 0.5, min: 0},\r\n    style: {default: 'normal', oneOf: ['normal', 'italics']},\r\n    weight: {default: 'normal', oneOf: ['normal', 'bold']},\r\n    value: {default: ''}\r\n  },\r\n\r\n  /**\r\n   * Called when component is attached and when component data changes.\r\n   * Generally modifies the entity based on the data.\r\n   */\r\n  update: function (oldData) {\r\n    var data = this.data;\r\n    var el = this.el;\r\n\r\n    var mesh = el.getOrCreateObject3D('mesh', THREE.Mesh);\r\n    if (data.font.constructor === String) {\r\n      // Load typeface.json font.\r\n      fontLoader.load(data.font, function (response) {\r\n        var textData = AFRAME.utils.clone(data);\r\n        textData.font = response;\r\n        mesh.geometry = new THREE.TextGeometry(data.value, textData);\r\n      });\r\n    } else if (data.font.constructor === Object) {\r\n      // Set font if already have a typeface.json through setAttribute.\r\n      mesh.geometry = new THREE.TextGeometry(data.value, data);\r\n    } else {\r\n      error('Must provide `font` (typeface.json) or `fontPath` (string) to text component.');\r\n    }\r\n  }\r\n});\r\n\n\n//# sourceURL=webpack://aframe-text-geometry-component/./index.js?");

/***/ }),

/***/ "./lib/FontLoader.js":
/*!***************************!*\
  !*** ./lib/FontLoader.js ***!
  \***************************/
/***/ (() => {

eval("/* From: https://github.com/mrdoob/three.js/blob/master/examples/jsm/loaders/FontLoader.js\r\n   with alternatons from ESM-style exports to CommonJS-style.\r\n\r\nThe MIT License\r\n\r\nCopyright © 2010-2023 three.js authors\r\n\r\nPermission is hereby granted, free of charge, to any person obtaining a copy\r\nof this software and associated documentation files (the \"Software\"), to deal\r\nin the Software without restriction, including without limitation the rights\r\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\r\ncopies of the Software, and to permit persons to whom the Software is\r\nfurnished to do so, subject to the following conditions:\r\n\r\nThe above copyright notice and this permission notice shall be included in\r\nall copies or substantial portions of the Software.\r\n\r\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\r\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\r\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\r\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\r\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\r\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN\r\nTHE SOFTWARE. */\r\n\r\nconst {\r\n\tFileLoader,\r\n\tLoader,\r\n\tShapePath\r\n} = THREE;\r\n\r\nclass FontLoader extends Loader {\r\n\r\n\tconstructor( manager ) {\r\n\r\n\t\tsuper( manager );\r\n\r\n\t}\r\n\r\n\tload( url, onLoad, onProgress, onError ) {\r\n\r\n\t\tconst scope = this;\r\n\r\n\t\tconst loader = new FileLoader( this.manager );\r\n\t\tloader.setPath( this.path );\r\n\t\tloader.setRequestHeader( this.requestHeader );\r\n\t\tloader.setWithCredentials( this.withCredentials );\r\n\t\tloader.load( url, function ( text ) {\r\n\r\n\t\t\tconst font = scope.parse( JSON.parse( text ) );\r\n\r\n\t\t\tif ( onLoad ) onLoad( font );\r\n\r\n\t\t}, onProgress, onError );\r\n\r\n\t}\r\n\r\n\tparse( json ) {\r\n\r\n\t\treturn new Font( json );\r\n\r\n\t}\r\n\r\n}\r\n\r\n//\r\n\r\nclass Font {\r\n\r\n\tconstructor( data ) {\r\n\r\n\t\tthis.isFont = true;\r\n\r\n\t\tthis.type = 'Font';\r\n\r\n\t\tthis.data = data;\r\n\r\n\t}\r\n\r\n\tgenerateShapes( text, size = 100 ) {\r\n\r\n\t\tconst shapes = [];\r\n\t\tconst paths = createPaths( text, size, this.data );\r\n\r\n\t\tfor ( let p = 0, pl = paths.length; p < pl; p ++ ) {\r\n\r\n\t\t\tshapes.push( ...paths[ p ].toShapes() );\r\n\r\n\t\t}\r\n\r\n\t\treturn shapes;\r\n\r\n\t}\r\n\r\n}\r\n\r\nfunction createPaths( text, size, data ) {\r\n\r\n\tconst chars = Array.from( text );\r\n\tconst scale = size / data.resolution;\r\n\tconst line_height = ( data.boundingBox.yMax - data.boundingBox.yMin + data.underlineThickness ) * scale;\r\n\r\n\tconst paths = [];\r\n\r\n\tlet offsetX = 0, offsetY = 0;\r\n\r\n\tfor ( let i = 0; i < chars.length; i ++ ) {\r\n\r\n\t\tconst char = chars[ i ];\r\n\r\n\t\tif ( char === '\\n' ) {\r\n\r\n\t\t\toffsetX = 0;\r\n\t\t\toffsetY -= line_height;\r\n\r\n\t\t} else {\r\n\r\n\t\t\tconst ret = createPath( char, scale, offsetX, offsetY, data );\r\n\t\t\toffsetX += ret.offsetX;\r\n\t\t\tpaths.push( ret.path );\r\n\r\n\t\t}\r\n\r\n\t}\r\n\r\n\treturn paths;\r\n\r\n}\r\n\r\nfunction createPath( char, scale, offsetX, offsetY, data ) {\r\n\r\n\tconst glyph = data.glyphs[ char ] || data.glyphs[ '?' ];\r\n\r\n\tif ( ! glyph ) {\r\n\r\n\t\tconsole.error( 'THREE.Font: character \"' + char + '\" does not exists in font family ' + data.familyName + '.' );\r\n\r\n\t\treturn;\r\n\r\n\t}\r\n\r\n\tconst path = new ShapePath();\r\n\r\n\tlet x, y, cpx, cpy, cpx1, cpy1, cpx2, cpy2;\r\n\r\n\tif ( glyph.o ) {\r\n\r\n\t\tconst outline = glyph._cachedOutline || ( glyph._cachedOutline = glyph.o.split( ' ' ) );\r\n\r\n\t\tfor ( let i = 0, l = outline.length; i < l; ) {\r\n\r\n\t\t\tconst action = outline[ i ++ ];\r\n\r\n\t\t\tswitch ( action ) {\r\n\r\n\t\t\t\tcase 'm': // moveTo\r\n\r\n\t\t\t\t\tx = outline[ i ++ ] * scale + offsetX;\r\n\t\t\t\t\ty = outline[ i ++ ] * scale + offsetY;\r\n\r\n\t\t\t\t\tpath.moveTo( x, y );\r\n\r\n\t\t\t\t\tbreak;\r\n\r\n\t\t\t\tcase 'l': // lineTo\r\n\r\n\t\t\t\t\tx = outline[ i ++ ] * scale + offsetX;\r\n\t\t\t\t\ty = outline[ i ++ ] * scale + offsetY;\r\n\r\n\t\t\t\t\tpath.lineTo( x, y );\r\n\r\n\t\t\t\t\tbreak;\r\n\r\n\t\t\t\tcase 'q': // quadraticCurveTo\r\n\r\n\t\t\t\t\tcpx = outline[ i ++ ] * scale + offsetX;\r\n\t\t\t\t\tcpy = outline[ i ++ ] * scale + offsetY;\r\n\t\t\t\t\tcpx1 = outline[ i ++ ] * scale + offsetX;\r\n\t\t\t\t\tcpy1 = outline[ i ++ ] * scale + offsetY;\r\n\r\n\t\t\t\t\tpath.quadraticCurveTo( cpx1, cpy1, cpx, cpy );\r\n\r\n\t\t\t\t\tbreak;\r\n\r\n\t\t\t\tcase 'b': // bezierCurveTo\r\n\r\n\t\t\t\t\tcpx = outline[ i ++ ] * scale + offsetX;\r\n\t\t\t\t\tcpy = outline[ i ++ ] * scale + offsetY;\r\n\t\t\t\t\tcpx1 = outline[ i ++ ] * scale + offsetX;\r\n\t\t\t\t\tcpy1 = outline[ i ++ ] * scale + offsetY;\r\n\t\t\t\t\tcpx2 = outline[ i ++ ] * scale + offsetX;\r\n\t\t\t\t\tcpy2 = outline[ i ++ ] * scale + offsetY;\r\n\r\n\t\t\t\t\tpath.bezierCurveTo( cpx1, cpy1, cpx2, cpy2, cpx, cpy );\r\n\r\n\t\t\t\t\tbreak;\r\n\r\n\t\t\t}\r\n\r\n\t\t}\r\n\r\n\t}\r\n\r\n\treturn { offsetX: glyph.ha * scale, path: path };\r\n\r\n}\r\n\r\nTHREE.FontLoader = FontLoader;\n\n//# sourceURL=webpack://aframe-text-geometry-component/./lib/FontLoader.js?");

/***/ }),

/***/ "./lib/TextGeometry.js":
/*!*****************************!*\
  !*** ./lib/TextGeometry.js ***!
  \*****************************/
/***/ (() => {

eval("/* From: https://github.com/mrdoob/three.js/blob/master/examples/jsm/geometries/TextGeometry.js\r\n   with alternatons from ESM-style exports to CommonJS-style.\r\n\r\nThe MIT License\r\n\r\nCopyright © 2010-2023 three.js authors\r\n\r\nPermission is hereby granted, free of charge, to any person obtaining a copy\r\nof this software and associated documentation files (the \"Software\"), to deal\r\nin the Software without restriction, including without limitation the rights\r\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\r\ncopies of the Software, and to permit persons to whom the Software is\r\nfurnished to do so, subject to the following conditions:\r\n\r\nThe above copyright notice and this permission notice shall be included in\r\nall copies or substantial portions of the Software.\r\n\r\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\r\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\r\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\r\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\r\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\r\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN\r\nTHE SOFTWARE. */\r\n\r\n/**\r\n * Text = 3D Text\r\n *\r\n * parameters = {\r\n *  font: <THREE.Font>, // font\r\n *\r\n *  size: <float>, // size of the text\r\n *  height: <float>, // thickness to extrude text\r\n *  curveSegments: <int>, // number of points on the curves\r\n *\r\n *  bevelEnabled: <bool>, // turn on bevel\r\n *  bevelThickness: <float>, // how deep into text bevel goes\r\n *  bevelSize: <float>, // how far from text outline (including bevelOffset) is bevel\r\n *  bevelOffset: <float> // how far from text outline does bevel start\r\n * }\r\n */\r\n\r\nconst {\r\n\tExtrudeGeometry\r\n} = THREE;\r\n\r\nclass TextGeometry extends ExtrudeGeometry {\r\n\r\n\tconstructor( text, parameters = {} ) {\r\n\r\n\t\tconst font = parameters.font;\r\n\r\n\t\tif ( font === undefined ) {\r\n\r\n\t\t\tsuper(); // generate default extrude geometry\r\n\r\n\t\t} else {\r\n\r\n\t\t\tconst shapes = font.generateShapes( text, parameters.size );\r\n\r\n\t\t\t// translate parameters to ExtrudeGeometry API\r\n\r\n\t\t\tparameters.depth = parameters.height !== undefined ? parameters.height : 50;\r\n\r\n\t\t\t// defaults\r\n\r\n\t\t\tif ( parameters.bevelThickness === undefined ) parameters.bevelThickness = 10;\r\n\t\t\tif ( parameters.bevelSize === undefined ) parameters.bevelSize = 8;\r\n\t\t\tif ( parameters.bevelEnabled === undefined ) parameters.bevelEnabled = false;\r\n\r\n\t\t\tsuper( shapes, parameters );\r\n\r\n\t\t}\r\n\r\n\t\tthis.type = 'TextGeometry';\r\n\r\n\t}\r\n\r\n}\r\n\r\n\r\nTHREE.TextGeometry = TextGeometry;\n\n//# sourceURL=webpack://aframe-text-geometry-component/./lib/TextGeometry.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./index.js");
/******/ 	
/******/ })()
;