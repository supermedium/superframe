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
	 * Layout component for A-Frame.
	 * Some layouts adapted from http://www.vb-helper.com/tutorial_platonic_solids.html
	 */
	AFRAME.registerComponent('layout', {
	  schema: {
	    angle: {type: 'number', default: false, min: 0, max: 360, if: {type: ['circle']}},
	    columns: {default: 1, min: 0, if: {type: ['box']}},
	    margin: {default: 1, min: 0, if: {type: ['box', 'line']}},
	    marginColumn: {default: 1, min: 0, if: {type: ['box']}},
	    marginRow: {default: 1, min: 0, if: {type: ['box']}},
	    plane: {default: 'xy'},
	    radius: {default: 1, min: 0, if: {type: ['circle', 'cube', 'dodecahedron', 'pyramid']}},
	    reverse: {default: false},
	    type: {default: 'line', oneOf: ['box', 'circle', 'cube', 'dodecahedron', 'line',
	                                    'pyramid']},
	    fill: {default: true, if: {type: ['circle']}}
	  },

	  /**
	   * Store initial positions in case need to reset on component removal.
	   */
	  init: function () {
	    var self = this;
	    var el = this.el;

	    this.children = el.getChildEntities();
	    this.initialPositions = [];

	    this.children.forEach(function getInitialPositions (childEl) {
	      if (childEl.hasLoaded) { return _getPositions(); }
	      childEl.addEventListener('loaded', _getPositions);
	      function _getPositions () {
	        var position = childEl.getAttribute('position');
	        self.initialPositions.push([position.x, position.y, position.z]);
	      }
	    });

	    el.addEventListener('child-attached', function (evt) {
	      // Only update if direct child attached.
	      if (evt.detail.el.parentNode !== el) { return; }
	      self.children.push(evt.detail.el);
	      self.update();
	    });

	    el.addEventListener('child-detached', function (evt) {
	      // Only update if direct child detached.
	      if (self.children.indexOf(evt.detail.el) === -1) { return; }
	      self.children.splice(self.children.indexOf(evt.detail.el), 1);
	      self.initialPositions.splice(self.children.indexOf(evt.detail.el), 1);
	      self.update();
	    });
	  },

	  /**
	   * Update child entity positions.
	   */
	  update: function (oldData) {
	    var children = this.children;
	    var data = this.data;
	    var el = this.el;
	    var numChildren = children.length;
	    var positionFn;
	    var positions;

	    // Calculate different positions based on layout shape.
	    switch (data.type) {
	      case 'box': {
	        positionFn = getBoxPositions;
	        break;
	      }
	      case 'circle': {
	        positionFn = getCirclePositions;
	        break;
	      }
	      case 'cube': {
	        positionFn = getCubePositions;
	        break;
	      }
	      case 'dodecahedron': {
	        positionFn = getDodecahedronPositions;
	        break;
	      }
	      case 'pyramid': {
	        positionFn = getPyramidPositions;
	        break;
	      }
	      default: {
	        // Line.
	        positionFn = getLinePositions;
	      }
	    }

	    positions = positionFn(data, numChildren, 'margin' in el.getDOMAttribute('layout'));
	    if (data.reverse) { positions.reverse(); }
	    setPositions(children, positions);
	  },

	  /**
	   * Reset positions.
	   */
	  remove: function () {
	    this.el.removeEventListener('child-attached', this.childAttachedCallback);
	    setPositions(this.children, this.initialPositions);
	  }
	});

	/**
	 * Get positions for `box` layout.
	 */
	function getBoxPositions (data, numChildren, marginDefined) {
	  var marginColumn;
	  var marginRow;
	  var position;
	  var positions = [];
	  var rows = Math.ceil(numChildren / data.columns);

	  marginColumn = data.marginColumn;
	  marginRow = data.marginRow;
	  if (marginDefined) {
	    marginColumn = data.margin;
	    marginRow = data.margin;
	  }

	  for (var row = 0; row < rows; row++) {
	    for (var column = 0; column < data.columns; column++) {
	      position = [0, 0, 0];
	      if (data.plane.indexOf('x') === 0) {
	        position[0] = column * marginColumn;
	      }
	      if (data.plane.indexOf('y') === 0) {
	        position[1] = column * marginColumn;
	      }
	      if (data.plane.indexOf('y') === 1) {
	        position[1] = row * marginRow;
	      }
	      if (data.plane.indexOf('z') === 1) {
	        position[2] = row * marginRow;
	      }
	      positions.push(position);
	    }
	  }

	  return positions;
	}
	module.exports.getBoxPositions = getBoxPositions;

	/**
	 * Get positions for `circle` layout.
	 */
	function getCirclePositions (data, numChildren) {
	  var positions = [];

	  for (var i = 0; i < numChildren; i++) {
	    var rad;

	    if (isNaN(data.angle)) {
	      rad = i * (2 * Math.PI) / numChildren;
	    } else {
	      rad = i * data.angle * 0.01745329252;  // Angle to radian.
	    }

	    var position = [];
	    if (data.plane.indexOf('x') === 0) {
	      position[0] = data.radius * Math.cos(rad);
	    }
	    if (data.plane.indexOf('y') === 0) {
	      position[1] = data.radius * Math.cos(rad);
	    }
	    if (data.plane.indexOf('y') === 1) {
	      position[1] = data.radius * Math.sin(rad);
	    }
	    if (data.plane.indexOf('z') === 1) {
	      position[2] = data.radius * Math.sin(rad);
	    }
	    positions.push(position);
	  }
	  return positions;
	}
	module.exports.getCirclePositions = getCirclePositions;

	/**
	 * Get positions for `line` layout.
	 * TODO: 3D margins.
	 */
	function getLinePositions (data, numChildren) {
	  data.columns = numChildren;
	  return getBoxPositions(data, numChildren, true);
	}
	module.exports.getLinePositions = getLinePositions;

	/**
	 * Get positions for `cube` layout.
	 */
	function getCubePositions (data, numChildren) {
	  return transform([
	    [1, 0, 0],
	    [0, 1, 0],
	    [0, 0, 1],
	    [-1, 0, 0],
	    [0, -1, 0],
	    [0, 0, -1],
	  ], data.radius / 2);
	}
	module.exports.getCubePositions = getCubePositions;

	/**
	 * Get positions for `dodecahedron` layout.
	 */
	function getDodecahedronPositions (data, numChildren) {
	  var PHI = (1 + Math.sqrt(5)) / 2;
	  var B = 1 / PHI;
	  var C = 2 - PHI;
	  var NB = -1 * B;
	  var NC = -1 * C;

	  return transform([
	    [-1, C, 0],
	    [-1, NC, 0],
	    [0, -1, C],
	    [0, -1, NC],
	    [0, 1, C],
	    [0, 1, NC],
	    [1, C, 0],
	    [1, NC, 0],
	    [B, B, B],
	    [B, B, NB],
	    [B, NB, B],
	    [B, NB, NB],
	    [C, 0, 1],
	    [C, 0, -1],
	    [NB, B, B],
	    [NB, B, NB],
	    [NB, NB, B],
	    [NB, NB, NB],
	    [NC, 0, 1],
	    [NC, 0, -1],
	  ], data.radius / 2);
	}
	module.exports.getDodecahedronPositions = getDodecahedronPositions;

	/**
	 * Get positions for `pyramid` layout.
	 */
	function getPyramidPositions (data, numChildren) {
	  var SQRT_3 = Math.sqrt(3);
	  var NEG_SQRT_1_3 = -1 / Math.sqrt(3);
	  var DBL_SQRT_2_3 = 2 * Math.sqrt(2 / 3);

	  return transform([
	    [0, 0, SQRT_3 + NEG_SQRT_1_3],
	    [-1, 0, NEG_SQRT_1_3],
	    [1, 0, NEG_SQRT_1_3],
	    [0, DBL_SQRT_2_3, 0]
	  ], data.radius / 2);
	}
	module.exports.getPyramidPositions = getPyramidPositions;

	/**
	 * Multiply all coordinates by a scale factor and add translate.
	 *
	 * @params {array} positions - Array of coordinates in array form.
	 * @returns {array} positions
	 */
	function transform (positions, scale) {
	  return positions.map(function (position) {
	    return position.map(function (point, i) {
	      return point * scale;
	    });
	  });
	};

	/**
	 * Set position on child entities.
	 *
	 * @param {array} els - Child entities to set.
	 * @param {array} positions - Array of coordinates.
	 */
	function setPositions (els, positions) {
	  els.forEach(function (el, i) {
	    var position = positions[i];
	    el.setAttribute('position', {
	      x: position[0],
	      y: position[1],
	      z: position[2]
	    });
	  });
	}


/***/ })
/******/ ]);