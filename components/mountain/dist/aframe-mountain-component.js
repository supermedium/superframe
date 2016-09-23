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
/***/ function(module, exports, __webpack_require__) {

	var ImprovedNoise = __webpack_require__(1);

	/**
	 * Mountain component.
	 */
	AFRAME.registerComponent('mountain', {
	  schema: {
	    color: {default: 'rgb(92, 32, 0)'},
	    shadowColor: {default: 'rgb(128, 96, 96)'},
	    sunPosition: {type: 'vec3', default: {x: 1, y: 1, z: 1}}
	  },

	  update: function () {
	    var data = this.data;

	    var worldDepth = 256;
	    var worldWidth = 256;

	    // Generate heightmap.
	    var terrainData = generateHeight(worldWidth, worldDepth);

	    // Texture.
	    var canvas = generateTexture(
	      terrainData, worldWidth, worldDepth, new THREE.Color(data.color),
	      new THREE.Color(data.shadowColor), data.sunPosition);
	    var texture = new THREE.CanvasTexture(canvas);
			texture.wrapS = THREE.ClampToEdgeWrapping;
			texture.wrapT = THREE.ClampToEdgeWrapping;

	    // Create geometry.
	    var geometry = new THREE.PlaneBufferGeometry(7500, 7500, worldWidth - 1, worldDepth - 1);
	    geometry.rotateX(- Math.PI / 2);
			var vertices = geometry.attributes.position.array;
			for (var i = 0, j = 0, l = vertices.length; i < l; i ++, j += 3) {
			  vertices[j + 1] = terrainData[i] * 10;
	    }

	    // Lower geometry.
	    geometry.translate(
	      0, -1 * (terrainData[worldWidth / 2 + worldDepth / 2* worldWidth] * 10 + 500), 0
	    );

	    // Create material.
	    var material = new THREE.MeshBasicMaterial({map: texture});

	    // Create mesh.
	    var mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({map: texture}));
	    this.el.setObject3D('mesh', mesh);
	  }
	});

	function generateHeight (width, height) {
	  var size = width * height;
	  var data = new Uint8Array(size);
	  var perlin = new ImprovedNoise();
	  var quality = 1;
	  var z = Math.random() * 100;

	  for (var j = 0; j < 4; j ++) {
	    for (var i = 0; i < size; i ++) {
	      var x = i % width, y = ~~ (i / width);
	      data[i] += Math.abs(perlin.noise(x / quality, y / quality, z) * quality * 1.75);
	    }
	    quality *= 5;
	  }

	  return data;
	}

	function generateTexture (terrainData, width, height, color, colorShadow, sunPos) {
	  var sun = new THREE.Vector3(sunPos.x, sunPos.y, sunPos.z);
	  sun.normalize();

	  // Create canvas and context.
	  var canvas = document.createElement('canvas');
	  canvas.width = width;
	  canvas.height = height;
	  var context = canvas.getContext('2d');
	  context.fillStyle = '#000';
	  context.fillRect(0, 0, width, height);

	  var image = context.getImageData(0, 0, canvas.width, canvas.height);
	  var imageData = image.data;

	  // Convert three.js rgb to 256.
	  var red = color.r * 256;
	  var green = color.g * 256;
	  var blue = color.b * 256;
	  var redShadow = colorShadow.r * 256;
	  var greenShadow = colorShadow.g * 256;
	  var blueShadow = colorShadow.b * 256;

	  var shade;
	  var vector3 = new THREE.Vector3(0, 0, 0);
	  for (var i = 0, j = 0, l = imageData.length; i < l; i += 4, j ++) {
	    vector3.x = terrainData[j - 2] - terrainData[j + 2];
	    vector3.y = 2;
	    vector3.z = terrainData[j - width * 2] - terrainData[j + width * 2];
	    vector3.normalize();
	    shade = vector3.dot(sun);
	    imageData[i] = (red + shade * redShadow) * (0.5 + terrainData[j] * 0.007);
	    imageData[i + 1] = (green + shade * blueShadow) * (0.5 + terrainData[j] * 0.007);
	    imageData[i + 2] = (blue + shade * greenShadow) * (0.5 + terrainData[j] * 0.007);
	  }

	  context.putImageData(image, 0, 0);

	  // Scaled 4x.
	  var canvasScaled = document.createElement('canvas');
	  canvasScaled.width = width * 4;
	  canvasScaled.height = height * 4;

	  context = canvasScaled.getContext('2d');
	  context.scale(4, 4);
	  context.drawImage(canvas, 0, 0);

	  image = context.getImageData(0, 0, canvasScaled.width, canvasScaled.height);
	  imageData = image.data;

	  for (var i = 0, l = imageData.length; i < l; i += 4) {
	    var v = ~~ (Math.random() * 5);
	    imageData[i] += v;
	    imageData[i + 1] += v;
	    imageData[i + 2] += v;
	  }

	  context.putImageData(image, 0, 0);
	  return canvasScaled;
	}

	/**
	 * <a-mountain>
	 */
	AFRAME.registerPrimitive('a-mountain', {
	  defaultComponents: {
	    mountain: {}
	  },

	  mappings: {
	    color: 'mountain.color',
	    'shadow-color': 'mountain.shadowColor',
	    'sun-position': 'mountain.sunPosition'
	  }
	});


/***/ },
/* 1 */
/***/ function(module, exports) {

	// http://mrl.nyu.edu/~perlin/noise/

	var ImprovedNoise = function () {

		var p = [ 151,160,137,91,90,15,131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,
			 23,190,6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,88,237,149,56,87,
			 174,20,125,136,171,168,68,175,74,165,71,134,139,48,27,166,77,146,158,231,83,111,229,122,60,211,
			 133,230,220,105,92,41,55,46,245,40,244,102,143,54,65,25,63,161,1,216,80,73,209,76,132,187,208,
			 89,18,169,200,196,135,130,116,188,159,86,164,100,109,198,173,186,3,64,52,217,226,250,124,123,5,
			 202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,223,183,170,213,119,
			 248,152,2,44,154,163,70,221,153,101,155,167,43,172,9,129,22,39,253,19,98,108,110,79,113,224,232,
			 178,185,112,104,218,246,97,228,251,34,242,193,238,210,144,12,191,179,162,241,81,51,145,235,249,
			 14,239,107,49,192,214,31,181,199,106,157,184,84,204,176,115,121,50,45,127,4,150,254,138,236,205,
			 93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180 ];

		for (var i = 0; i < 256 ; i ++) {

			p[256 + i] = p[i];

		}

		function fade(t) {

			return t * t * t * (t * (t * 6 - 15) + 10);

		}

		function lerp(t, a, b) {

			return a + t * (b - a);

		}

		function grad(hash, x, y, z) {

			var h = hash & 15;
			var u = h < 8 ? x : y, v = h < 4 ? y : h == 12 || h == 14 ? x : z;
			return ((h&1) == 0 ? u : -u) + ((h&2) == 0 ? v : -v);

		}

		return {

			noise: function (x, y, z) {

				var floorX = ~~x, floorY = ~~y, floorZ = ~~z;

				var X = floorX & 255, Y = floorY & 255, Z = floorZ & 255;

				x -= floorX;
				y -= floorY;
				z -= floorZ;

				var xMinus1 = x - 1, yMinus1 = y - 1, zMinus1 = z - 1;

				var u = fade(x), v = fade(y), w = fade(z);

				var A = p[X] + Y, AA = p[A] + Z, AB = p[A + 1] + Z, B = p[X + 1] + Y, BA = p[B] + Z, BB = p[B + 1] + Z;

				return lerp(w, lerp(v, lerp(u, grad(p[AA], x, y, z),
								grad(p[BA], xMinus1, y, z)),
							lerp(u, grad(p[AB], x, yMinus1, z),
								grad(p[BB], xMinus1, yMinus1, z))),
						lerp(v, lerp(u, grad(p[AA + 1], x, y, zMinus1),
								grad(p[BA + 1], xMinus1, y, z - 1)),
							lerp(u, grad(p[AB + 1], x, yMinus1, zMinus1),
								grad(p[BB + 1], xMinus1, yMinus1, zMinus1))));

			}
		}
	};

	module.exports = ImprovedNoise;


/***/ }
/******/ ]);