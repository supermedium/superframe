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
/***/ (function(module, exports, __webpack_require__) {

	var vertexShader = __webpack_require__(1);
	var fragmentShader = __webpack_require__(2);

	AFRAME.registerShader('sunSky', {
	  schema: {
	    luminance: {default: 1, min: 0, max: 2, is: 'uniform'},
	    mieCoefficient: {default: 0.005, min: 0, max: 0.1, is: 'uniform'},
	    mieDirectionalG: {default: 0.8, min: 0, max: 1, is: 'uniform'},
	    reileigh: {default: 1, min: 0, max: 4, is: 'uniform'},
	    sunPosition: {type: 'vec3', default: '0 0 -1', is: 'uniform'},
	    turbidity: {default: 2, min: 0, max: 20, is: 'uniform'}
	  },
	  vertexShader: vertexShader,
	  fragmentShader: fragmentShader
	});

	AFRAME.registerPrimitive('a-sun-sky', {
	  defaultComponents: {
	    geometry: {
	      primitive: 'sphere',
	      radius: 5000,
	      segmentsWidth: 64,
	      segmentsHeight: 20
	    },
	    material: {
	      shader: 'sunSky',
	      side: 'back'
	    },
	    scale: '-1 1 1'
	  },

	  mappings: {
	    luminance: 'material.luminance',
	    mieCoefficient: 'material.mieCoefficient',
	    mieDirectionalG: 'material.mieDirectionalG',
	    reileigh: 'material.reileigh',
	    sunPosition: 'material.sunPosition',
	    turbidity: 'material.turbidity'
	  }
	});


/***/ }),
/* 1 */
/***/ (function(module, exports) {

	module.exports = "varying vec3 vWorldPosition;\r\n\r\nvoid main() {\r\n  vec4 worldPosition = modelMatrix * vec4(position, 1.0);\r\n  vWorldPosition = worldPosition.xyz;\r\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\r\n}\r\n"

/***/ }),
/* 2 */
/***/ (function(module, exports) {

	module.exports = "uniform sampler2D skySampler;\r\nuniform vec3 sunPosition;\r\nvarying vec3 vWorldPosition;\r\n\r\nvec3 cameraPos = vec3(0., 0., 0.);\r\n\r\nuniform float luminance;\r\nuniform float turbidity;\r\nuniform float reileigh;\r\nuniform float mieCoefficient;\r\nuniform float mieDirectionalG;\r\n\r\n// constants for atmospheric scattering\r\nconst float e = 2.71828182845904523536028747135266249775724709369995957;\r\nconst float pi = 3.141592653589793238462643383279502884197169;\r\n\r\nconst float n = 1.0003; // refractive index of air\r\nconst float N = 2.545E25; // number of molecules per unit volume for air at\r\n// 288.15K and 1013mb (sea level -45 celsius)\r\nconst float pn = 0.035;  // depolatization factor for standard air\r\n\r\n// wavelength of used primaries, according to preetham\r\nconst vec3 lambda = vec3(680E-9, 550E-9, 450E-9);\r\n\r\n// mie stuff\r\n// K coefficient for the primaries\r\nconst vec3 K = vec3(0.686, 0.678, 0.666);\r\nconst float v = 4.0;\r\n\r\n// optical length at zenith for molecules\r\nconst float rayleighZenithLength = 8.4E3;\r\nconst float mieZenithLength = 1.25E3;\r\nconst vec3 up = vec3(0.0, 1.0, 0.0);\r\n\r\nconst float EE = 1000.0;\r\nconst float sunAngularDiameterCos = 0.999956676946448443553574619906976478926848692873900859324;\r\n// 66 arc seconds -> degrees, and the cosine of that\r\n\r\n// earth shadow hack\r\nconst float cutoffAngle = pi/1.95;\r\nconst float steepness = 1.5;\r\n\r\nvec3 totalRayleigh(vec3 lambda)\r\n{\r\n  return (8.0 * pow(pi, 3.0) * pow(pow(n, 2.0) - 1.0, 2.0) * (6.0 + 3.0 * pn)) / (3.0 * N * pow(lambda, vec3(4.0)) * (6.0 - 7.0 * pn));\r\n}\r\n\r\n// see http://blenderartists.org/forum/showthread.php?321110-Shaders-and-Skybox-madness\r\n// A simplied version of the total Rayleigh scattering to works on browsers that use ANGLE\r\nvec3 simplifiedRayleigh()\r\n{\r\n  return 0.0005 / vec3(94, 40, 18);\r\n}\r\n\r\nfloat rayleighPhase(float cosTheta)\r\n{\r\n  return (3.0 / (16.0*pi)) * (1.0 + pow(cosTheta, 2.0));\r\n}\r\n\r\nvec3 totalMie(vec3 lambda, vec3 K, float T)\r\n{\r\n  float c = (0.2 * T ) * 10E-18;\r\n  return 0.434 * c * pi * pow((2.0 * pi) / lambda, vec3(v - 2.0)) * K;\r\n}\r\n\r\nfloat hgPhase(float cosTheta, float g)\r\n{\r\n  return (1.0 / (4.0*pi)) * ((1.0 - pow(g, 2.0)) / pow(1.0 - 2.0*g*cosTheta + pow(g, 2.0), 1.5));\r\n}\r\n\r\nfloat sunIntensity(float zenithAngleCos)\r\n{\r\n  return EE * max(0.0, 1.0 - exp(-((cutoffAngle - acos(zenithAngleCos))/steepness)));\r\n}\r\n\r\n// Filmic ToneMapping http://filmicgames.com/archives/75\r\nfloat A = 0.15;\r\nfloat B = 0.50;\r\nfloat C = 0.10;\r\nfloat D = 0.20;\r\nfloat E = 0.02;\r\nfloat F = 0.30;\r\nfloat W = 1000.0;\r\n\r\nvec3 Uncharted2Tonemap(vec3 x)\r\n{\r\n   return ((x*(A*x+C*B)+D*E)/(x*(A*x+B)+D*F))-E/F;\r\n}\r\n\r\nvoid main()\r\n{\r\n  float sunfade = 1.0-clamp(1.0-exp((sunPosition.y/450000.0)),0.0,1.0);\r\n\r\n  float reileighCoefficient = reileigh - (1.0* (1.0-sunfade));\r\n\r\n  vec3 sunDirection = normalize(sunPosition);\r\n\r\n  float sunE = sunIntensity(dot(sunDirection, up));\r\n\r\n  // extinction (absorbtion + out scattering)\r\n  // rayleigh coefficients\r\n\r\n  vec3 betaR = simplifiedRayleigh() * reileighCoefficient;\r\n\r\n  // mie coefficients\r\n  vec3 betaM = totalMie(lambda, K, turbidity) * mieCoefficient;\r\n\r\n  // optical length\r\n  // cutoff angle at 90 to avoid singularity in next formula.\r\n  float zenithAngle = acos(max(0.0, dot(up, normalize(vWorldPosition - cameraPos))));\r\n  float sR = rayleighZenithLength / (cos(zenithAngle) + 0.15 * pow(93.885 - ((zenithAngle * 180.0) / pi), -1.253));\r\n  float sM = mieZenithLength / (cos(zenithAngle) + 0.15 * pow(93.885 - ((zenithAngle * 180.0) / pi), -1.253));\r\n\r\n  // combined extinction factor\r\n  vec3 Fex = exp(-(betaR * sR + betaM * sM));\r\n\r\n  // in scattering\r\n  float cosTheta = dot(normalize(vWorldPosition - cameraPos), sunDirection);\r\n\r\n  float rPhase = rayleighPhase(cosTheta*0.5+0.5);\r\n  vec3 betaRTheta = betaR * rPhase;\r\n\r\n  float mPhase = hgPhase(cosTheta, mieDirectionalG);\r\n  vec3 betaMTheta = betaM * mPhase;\r\n\r\n  vec3 Lin = pow(sunE * ((betaRTheta + betaMTheta) / (betaR + betaM)) * (1.0 - Fex),vec3(1.5));\r\n  Lin *= mix(vec3(1.0),pow(sunE * ((betaRTheta + betaMTheta) / (betaR + betaM)) * Fex,vec3(1.0/2.0)),clamp(pow(1.0-dot(up, sunDirection),5.0),0.0,1.0));\r\n\r\n  //nightsky\r\n  vec3 direction = normalize(vWorldPosition - cameraPos);\r\n  float theta = acos(direction.y); // elevation --> y-axis, [-pi/2, pi/2]\r\n  float phi = atan(direction.z, direction.x); // azimuth --> x-axis [-pi/2, pi/2]\r\n  vec2 uv = vec2(phi, theta) / vec2(2.0*pi, pi) + vec2(0.5, 0.0);\r\n  // vec3 L0 = texture2D(skySampler, uv).rgb+0.1 * Fex;\r\n  vec3 L0 = vec3(0.1) * Fex;\r\n\r\n  // composition + solar disc\r\n  float sundisk = smoothstep(sunAngularDiameterCos,sunAngularDiameterCos+0.00002,cosTheta);\r\n  L0 += (sunE * 19000.0 * Fex)*sundisk;\r\n\r\n  vec3 whiteScale = 1.0/Uncharted2Tonemap(vec3(W));\r\n\r\n  vec3 texColor = (Lin+L0);\r\n  texColor *= 0.04 ;\r\n  texColor += vec3(0.0,0.001,0.0025)*0.3;\r\n\r\n  float g_fMaxLuminance = 1.0;\r\n  float fLumScaled = 0.1 / luminance;\r\n  float fLumCompressed = (fLumScaled * (1.0 + (fLumScaled / (g_fMaxLuminance * g_fMaxLuminance)))) / (1.0 + fLumScaled);\r\n\r\n  float ExposureBias = fLumCompressed;\r\n\r\n  vec3 curr = Uncharted2Tonemap((log2(2.0/pow(luminance,4.0)))*texColor);\r\n  vec3 color = curr*whiteScale;\r\n\r\n  vec3 retColor = pow(color,vec3(1.0/(1.2+(1.2*sunfade))));\r\n\r\n  gl_FragColor.rgb = retColor;\r\n\r\n  gl_FragColor.a = 1.0;\r\n}\r\n"

/***/ })
/******/ ]);