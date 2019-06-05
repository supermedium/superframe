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


if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.');
}

var audioBufferCache = {};

/**
 * Audio visualizer component for A-Frame using AnalyserNode.
 */
AFRAME.registerComponent('audioanalyser', {
  schema: {
    buffer: { default: false },
    beatDetectionDecay: { default: 0.99 },
    beatDetectionMinVolume: { default: 15 },
    beatDetectionThrottle: { default: 250 },
    cache: { default: false },
    enabled: { default: true },
    enableBeatDetection: { default: true },
    enableLevels: { default: true },
    enableWaveform: { default: true },
    enableVolume: { default: true },
    fftSize: { default: 2048 },
    smoothingTimeConstant: { default: 0.8 },
    src: {
      parse: function parse(val) {
        if (val.constructor !== String) {
          return val;
        }
        if (val.startsWith('#') || val.startsWith('.')) {
          return document.querySelector(val);
        }
        return val;
      }
    },
    unique: { default: false }
  },

  init: function init() {
    this.audioEl = null;
    this.levels = null;
    this.waveform = null;
    this.volume = 0;
    this.xhr = null;

    this.initContext();
  },

  update: function update(oldData) {
    var analyser = this.analyser;
    var data = this.data;

    // Update analyser stuff.
    if (oldData.fftSize !== data.fftSize || oldData.smoothingTimeConstant !== data.smoothingTimeConstant) {
      analyser.fftSize = data.fftSize;
      analyser.smoothingTimeConstant = data.smoothingTimeConstant;
      this.levels = new Uint8Array(analyser.frequencyBinCount);
      this.waveform = new Uint8Array(analyser.fftSize);
    }

    if (!data.src) {
      return;
    }
    this.refreshSource();
  },

  /**
   * Update spectrum on each frame.
   */
  tick: function tick(t, dt) {
    var data = this.data;
    var volume;

    if (!data.enabled) {
      return;
    }

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
      if (!this.beatCutOff) {
        this.beatCutOff = volume;
      }
      if (volume > this.beatCutOff && volume > this.data.beatDetectionMinVolume) {
        this.el.emit('audioanalyserbeat', null, false);
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
  },

  initContext: function initContext() {
    var data = this.data;
    var analyser;
    var gainNode;

    this.context = new (window.webkitAudioContext || window.AudioContext)();
    analyser = this.analyser = this.context.createAnalyser();
    gainNode = this.gainNode = this.context.createGain();
    gainNode.connect(analyser);
    analyser.connect(this.context.destination);
    analyser.fftSize = data.fftSize;
    analyser.smoothingTimeConstant = data.smoothingTimeConstant;
    this.levels = new Uint8Array(analyser.frequencyBinCount);
    this.waveform = new Uint8Array(analyser.fftSize);
  },

  refreshSource: function refreshSource() {
    var _this = this;

    var analyser = this.analyser;
    var data = this.data;

    if (data.buffer && data.src.constructor === String) {
      this.getBufferSource().then(function (source) {
        _this.source = source;
        _this.source.connect(_this.gainNode);
      });
    } else {
      this.source = this.getMediaSource();
      this.source.connect(this.gainNode);
    }
  },

  suspendContext: function suspendContext() {
    this.context.suspend();
  },

  resumeContext: function resumeContext() {
    this.context.resume();
  },

  /**
   * Fetch and parse buffer to audio buffer. Resolve a source.
   */
  fetchAudioBuffer: function fetchAudioBuffer(src) {
    var _this2 = this;

    // From cache.
    if (audioBufferCache[src]) {
      if (audioBufferCache[src].constructor === Promise) {
        return audioBufferCache[src];
      } else {
        return Promise.resolve(audioBufferCache[src]);
      }
    }

    if (!this.data.cache) {
      Object.keys(audioBufferCache).forEach(function (src) {
        delete audioBufferCache[src];
      });
    }

    audioBufferCache[src] = new Promise(function (resolve) {
      // Fetch if does not exist.
      var xhr = _this2.xhr = new XMLHttpRequest();
      xhr.open('GET', src);
      xhr.responseType = 'arraybuffer';
      xhr.addEventListener('load', function () {
        // Support Webkit with callback.
        function cb(audioBuffer) {
          audioBufferCache[src] = audioBuffer;
          resolve(audioBuffer);
        }
        var res = _this2.context.decodeAudioData(xhr.response, cb);
        if (res && res.constructor === Promise) {
          res.then(cb).catch(console.error);
        }
      });
      xhr.send();
    });
    return audioBufferCache[src];
  },

  getBufferSource: function getBufferSource() {
    var _this3 = this;

    var data = this.data;
    return this.fetchAudioBuffer(data.src).then(function () {
      var source;
      source = _this3.context.createBufferSource();
      source.buffer = audioBufferCache[data.src];
      _this3.el.emit('audioanalyserbuffersource', source, false);
      return source;
    }).catch(console.error);
  },

  getMediaSource: function () {
    var nodeCache = {};

    return function () {
      var src = this.data.src.constructor === String ? this.data.src : this.data.src.src;
      if (nodeCache[src]) {
        return nodeCache[src];
      }

      if (this.data.src.constructor === String) {
        this.audio = document.createElement('audio');
        this.audio.crossOrigin = 'anonymous';
        this.audio.setAttribute('src', this.data.src);
      } else {
        this.audio = this.data.src;
      }
      var node = this.context.createMediaElementSource(this.audio);

      nodeCache[src] = node;
      return node;
    };
  }()
});

/***/ })
/******/ ]);
});