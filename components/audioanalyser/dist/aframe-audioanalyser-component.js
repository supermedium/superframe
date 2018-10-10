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

	if (typeof AFRAME === 'undefined') {
	  throw new Error('Component attempted to register before AFRAME was available.');
	}

	// Single audio context.
	var context;

	/**
	 * Audio visualizer system for A-Frame. Share AnalyserNodes between components that share the
	 * the `src`.
	 */
	AFRAME.registerSystem('audioanalyser', {
	  init: function () {
	    this.analysers = {};
	  },

	  getOrCreateAnalyser: function (data) {
	    if (!context) { context = new AudioContext(); }
	    var analysers = this.analysers;
	    var analyser = context.createAnalyser();
	    var audioEl = data.src;
	    var src = audioEl.getAttribute('src');

	    if (!data.unique && analysers[src]) { return analysers[src]; }

	    var source = context.createMediaElementSource(audioEl)
	    source.connect(analyser);
	    analyser.connect(context.destination);
	    analyser.smoothingTimeConstant = data.smoothingTimeConstant;
	    analyser.fftSize = data.fftSize;

	    // Store.
	    analysers[src] = analyser;
	    return {
	      analyser: analysers[src],
	      source: source
	    };
	  }
	});

	/**
	 * Audio visualizer component for A-Frame using AnalyserNode.
	 */
	AFRAME.registerComponent('audioanalyser', {
	  schema: {
	    beatDetectionDecay: {default: 0.99},
	    beatDetectionMinVolume: {default: 15},
	    beatDetectionThrottle: {default: 250},
	    enableBeatDetection: {default: true},
	    enableLevels: {default: true},
	    enableWaveform: {default: true},
	    enableVolume: {default: true},
	    fftSize: {default: 2048},
	    smoothingTimeConstant: {default: 0.8},
	    src: {type: 'selector'},
	    unique: {default: false}
	  },

	  init: function () {
	    this.analyser = null;
	    this.levels = null;
	    this.waveform = null;
	    this.volume = 0;
	  },

	  update: function () {
	    var data = this.data;
	    var self = this;
	    var system = this.system;

	    if (!data.src) { return; }

	    // Get or create AnalyserNode.
	    init(system.getOrCreateAnalyser(data).analyser);

	    function init (analyser) {
	      self.analyser = analyser;
	      self.levels = new Uint8Array(self.analyser.frequencyBinCount);
	      self.waveform = new Uint8Array(self.analyser.fftSize);
	      self.el.emit('audioanalyser-ready', analyser, false);
	    }
	  },

	  /**
	   * Update spectrum on each frame.
	   */
	  tick: function (t, dt) {
	    var data = this.data;
	    if (!this.analyser) { return; }

	    // Levels (frequency).
	    if (data.enableLevels || data.enableVolume) {
	      this.analyser.getByteFrequencyData(this.levels);
	    }

	    // Waveform.
	    if (data.enableWaveform) {
	      this.analyser.getByteTimeDomainData(this.waveform);
	    }

	    // Average volume.
	    if (data.enableVolume || data.enableBeatDetection) {
	      var sum = 0;
	      for (var i = 0; i < this.levels.length; i++) {
	        sum += this.levels[i];;
	      }
	      this.volume = sum / this.levels.length;
	    }

	    // Beat detection.
	    if (data.enableBeatDetection) {
	      volume = this.volume;
	      if (!this.beatCutOff) { this.beatCutOff = volume; }
	      if (volume > this.beatCutOff && volume > this.data.beatDetectionMinVolume) {
	        console.log('[audioanalyser] Beat detected.');
	        this.el.emit('audioanalyser-beat', null, false);
	        this.beatCutOff = volume * 1.5;
	        this.beatTime = 0;
	      } else {
	        if (this.beatTime <= this.data.beatDetectionThrottle) {
	          this.beatTime += dt;
	        } else {
	          this.beatCutOff *= this.data.beatDetectionDecay;
	          this.beatCutOff = Math.max(this.beatCutOff, this.data.beatDetectionMinVolume);
	        }
	      }
	    }
	  }
	});


/***/ })
/******/ ]);