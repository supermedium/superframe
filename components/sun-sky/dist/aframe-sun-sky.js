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

	var vertexShader = __webpack_require__(1);
	var fragmentShader = __webpack_require__(2);

	AFRAME.registerShader('sunSky', {
	  schema: {
	    luminance: {default: 1, max: 0, min: 2, is: 'uniform'},
	    mieCoefficient: {default: 0.005, min: 0, max: 0.1, is: 'uniform'},
	    mieDirectionalG: {default: 0.8, min: 0, max: 1, is: 'uniform'},
	    rayleigh: {default: 1, max: 0, min: 4, is: 'uniform'},
	    sunPosition: {type: 'vec3', default: '0 0 -1', is: 'uniform'},
	    turbidity: {default: 2, max: 0, min: 20, is: 'uniform'}
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
	      shader: 'sunSky'
	    },
	    scale: '-1 1 1'
	  },

	  mappings: {
	    luminance: 'material.luminance',
	    mieCoefficient: 'material.mieCoefficient',
	    mieDirectionalG: 'material.mieDirectionalG',
	    rayleigh: 'material.rayleigh',
	    sunPosition: 'material.sunPosition',
	    turbidity: 'material.turbidity'
	  }
	});


/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = "varying vec3 vWorldPosition;\n\nvoid main() {\n  vec4 worldPosition = modelMatrix * vec4(position, 1.0);\n  vWorldPosition = worldPosition.xyz;\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n}\n"

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = "uniform sampler2D skySampler;\nuniform vec3 sunPosition;\nvarying vec3 vWorldPosition;\n\nvec3 cameraPos = vec3(0., 0., 0.);\n\nuniform float luminance;\nuniform float turbidity;\nuniform float rayleigh;\nuniform float mieCoefficient;\nuniform float mieDirectionalG;\n\n// constants for atmospheric scattering\nconst float e = 2.71828182845904523536028747135266249775724709369995957;\nconst float pi = 3.141592653589793238462643383279502884197169;\n\nconst float n = 1.0003; // refractive index of air\nconst float N = 2.545E25; // number of molecules per unit volume for air at\n// 288.15K and 1013mb (sea level -45 celsius)\nconst float pn = 0.035;  // depolatization factor for standard air\n\n// wavelength of used primaries, according to preetham\nconst vec3 lambda = vec3(680E-9, 550E-9, 450E-9);\n\n// mie stuff\n// K coefficient for the primaries\nconst vec3 K = vec3(0.686, 0.678, 0.666);\nconst float v = 4.0;\n\n// optical length at zenith for molecules\nconst float rayleighZenithLength = 8.4E3;\nconst float mieZenithLength = 1.25E3;\nconst vec3 up = vec3(0.0, 1.0, 0.0);\n\nconst float EE = 1000.0;\nconst float sunAngularDiameterCos = 0.999956676946448443553574619906976478926848692873900859324;\n// 66 arc seconds -> degrees, and the cosine of that\n\n// earth shadow hack\nconst float cutoffAngle = pi/1.95;\nconst float steepness = 1.5;\n\nvec3 totalRayleigh(vec3 lambda)\n{\n  return (8.0 * pow(pi, 3.0) * pow(pow(n, 2.0) - 1.0, 2.0) * (6.0 + 3.0 * pn)) / (3.0 * N * pow(lambda, vec3(4.0)) * (6.0 - 7.0 * pn));\n}\n\n// see http://blenderartists.org/forum/showthread.php?321110-Shaders-and-Skybox-madness\n// A simplied version of the total Rayleigh scattering to works on browsers that use ANGLE\nvec3 simplifiedRayleigh()\n{\n  return 0.0005 / vec3(94, 40, 18);\n}\n\nfloat rayleighPhase(float cosTheta)\n{\n  return (3.0 / (16.0*pi)) * (1.0 + pow(cosTheta, 2.0));\n}\n\nvec3 totalMie(vec3 lambda, vec3 K, float T)\n{\n  float c = (0.2 * T ) * 10E-18;\n  return 0.434 * c * pi * pow((2.0 * pi) / lambda, vec3(v - 2.0)) * K;\n}\n\nfloat hgPhase(float cosTheta, float g)\n{\n  return (1.0 / (4.0*pi)) * ((1.0 - pow(g, 2.0)) / pow(1.0 - 2.0*g*cosTheta + pow(g, 2.0), 1.5));\n}\n\nfloat sunIntensity(float zenithAngleCos)\n{\n  return EE * max(0.0, 1.0 - exp(-((cutoffAngle - acos(zenithAngleCos))/steepness)));\n}\n\n// Filmic ToneMapping http://filmicgames.com/archives/75\nfloat A = 0.15;\nfloat B = 0.50;\nfloat C = 0.10;\nfloat D = 0.20;\nfloat E = 0.02;\nfloat F = 0.30;\nfloat W = 1000.0;\n\nvec3 Uncharted2Tonemap(vec3 x)\n{\n   return ((x*(A*x+C*B)+D*E)/(x*(A*x+B)+D*F))-E/F;\n}\n\nvoid main()\n{\n  float sunfade = 1.0-clamp(1.0-exp((sunPosition.y/450000.0)),0.0,1.0);\n\n  float rayleighCoefficient = rayleigh - (1.0* (1.0-sunfade));\n\n  vec3 sunDirection = normalize(sunPosition);\n\n  float sunE = sunIntensity(dot(sunDirection, up));\n\n  // extinction (absorbtion + out scattering)\n  // rayleigh coefficients\n\n  vec3 betaR = simplifiedRayleigh() * rayleighCoefficient;\n\n  // mie coefficients\n  vec3 betaM = totalMie(lambda, K, turbidity) * mieCoefficient;\n\n  // optical length\n  // cutoff angle at 90 to avoid singularity in next formula.\n  float zenithAngle = acos(max(0.0, dot(up, normalize(vWorldPosition - cameraPos))));\n  float sR = rayleighZenithLength / (cos(zenithAngle) + 0.15 * pow(93.885 - ((zenithAngle * 180.0) / pi), -1.253));\n  float sM = mieZenithLength / (cos(zenithAngle) + 0.15 * pow(93.885 - ((zenithAngle * 180.0) / pi), -1.253));\n\n  // combined extinction factor\n  vec3 Fex = exp(-(betaR * sR + betaM * sM));\n\n  // in scattering\n  float cosTheta = dot(normalize(vWorldPosition - cameraPos), sunDirection);\n\n  float rPhase = rayleighPhase(cosTheta*0.5+0.5);\n  vec3 betaRTheta = betaR * rPhase;\n\n  float mPhase = hgPhase(cosTheta, mieDirectionalG);\n  vec3 betaMTheta = betaM * mPhase;\n\n  vec3 Lin = pow(sunE * ((betaRTheta + betaMTheta) / (betaR + betaM)) * (1.0 - Fex),vec3(1.5));\n  Lin *= mix(vec3(1.0),pow(sunE * ((betaRTheta + betaMTheta) / (betaR + betaM)) * Fex,vec3(1.0/2.0)),clamp(pow(1.0-dot(up, sunDirection),5.0),0.0,1.0));\n\n  //nightsky\n  vec3 direction = normalize(vWorldPosition - cameraPos);\n  float theta = acos(direction.y); // elevation --> y-axis, [-pi/2, pi/2]\n  float phi = atan(direction.z, direction.x); // azimuth --> x-axis [-pi/2, pi/2]\n  vec2 uv = vec2(phi, theta) / vec2(2.0*pi, pi) + vec2(0.5, 0.0);\n  // vec3 L0 = texture2D(skySampler, uv).rgb+0.1 * Fex;\n  vec3 L0 = vec3(0.1) * Fex;\n\n  // composition + solar disc\n  float sundisk = smoothstep(sunAngularDiameterCos,sunAngularDiameterCos+0.00002,cosTheta);\n  L0 += (sunE * 19000.0 * Fex)*sundisk;\n\n  vec3 whiteScale = 1.0/Uncharted2Tonemap(vec3(W));\n\n  vec3 texColor = (Lin+L0);\n  texColor *= 0.04 ;\n  texColor += vec3(0.0,0.001,0.0025)*0.3;\n\n  float g_fMaxLuminance = 1.0;\n  float fLumScaled = 0.1 / luminance;\n  float fLumCompressed = (fLumScaled * (1.0 + (fLumScaled / (g_fMaxLuminance * g_fMaxLuminance)))) / (1.0 + fLumScaled);\n\n  float ExposureBias = fLumCompressed;\n\n  vec3 curr = Uncharted2Tonemap((log2(2.0/pow(luminance,4.0)))*texColor);\n  vec3 color = curr*whiteScale;\n\n  vec3 retColor = pow(color,vec3(1.0/(1.2+(1.2*sunfade))));\n\n  gl_FragColor.rgb = retColor;\n\n  gl_FragColor.a = 1.0;\n}\n"

/***/ }
/******/ ]);
