if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.');
}

require('./extras');

// Single context.
var context;

/**
 * Audio visualizer system for A-Frame. Share AnalyserNodes between components that share the
 * the `src`.
 */
AFRAME.registerSystem('audio-visualizer', {
  init: function () {
    this.analysers = {};
  },

  getOrCreateAnalyser: function (data) {
    if (!context) { context = new AudioContext(); }
    var analysers = this.analysers;
    var analyser = context.createAnalyser();
    var audioEl = data.src;
    var src = audioEl.getAttribute('src');

    if (analysers[src]) { return analysers[src]; }

    var source = context.createMediaElementSource(audioEl)
    source.connect(analyser);
    analyser.connect(context.destination);
    analyser.smoothingTimeConstant = data.smoothingTimeConstant;
    analyser.fftSize = data.fftSize;

    // Store.
    analysers[src] = analyser;
    return analysers[src];
  }
});

/**
 * Audio visualizer component for A-Frame using AnalyserNode.
 */
AFRAME.registerComponent('audio-visualizer', {
  schema: {
    fftSize: {default: 2048},
    smoothingTimeConstant: {default: 0.8},
    src: {type: 'selector'},
    unique: {default: false}
  },

  init: function () {
    this.analyser = null;
    this.spectrum = null;
  },

  update: function () {
    var self = this;
    var data = this.data;
    var system = this.system;

    if (!data.src) { return; }

    // Get or create AnalyserNode.
    if (data.unique) {
      emit(system.createAnalyser(data));
    } else {
      emit(system.getOrCreateAnalyser(data));
    }

    function emit (analyser) {
      self.analyser = analyser;
      self.spectrum = new Uint8Array(self.analyser.frequencyBinCount);
      self.el.emit('audio-analyser-ready', {analyser: analyser});
    }
  },

  /**
   * Update spectrum on each frame.
   */
  tick: function () {
    if (!this.analyser) { return; }
    this.analyser.getByteFrequencyData(this.spectrum);
  }
});

/**
 * Component that triggers an event when frequency surprasses a threshold (e.g., a beat).
 *
 * @member {boolean} kicking - Whether component has just emitted a kick.
 */
AFRAME.registerComponent('audio-visualizer-kick', {
  dependencies: ['audio-visualizer'],

  schema: {
    decay: {default: 0.02},
    frequency: {default: [0, 10]},
    threshold: {default: 0.3}
  },

  init: function () {
    this.currentThreshold = this.data.threshold;
    this.kicking = false;
  },

  tick: function () {
    var data = this.data;
    var el = this.el;

    if (!el.components['audio-visualizer'].spectrum) { return; }

    var magnitude = this.maxAmplitude(data.frequency);

    if (magnitude > this.currentThreshold && magnitude > data.threshold) {
      // Already kicking.
      if (this.kicking) { return; }

      // Was under the threshold, but now kicking.
      this.kicking = true;
      el.emit('audio-visualizer-kick-start', {
        currentThreshold: this.currentThreshold,
        magnitude: magnitude
      });
    } else {
      // Update threshold.
      this.currentThreshold -= data.decay;

      // Was kicking, but now under the threshold
      if (this.kicking) {
        this.kicking = false;
        el.emit('audio-visualizer-kick-end', {
          currentThreshold: this.currentThreshold,
          magnitude: magnitude
        });
      }
    }
  },

  /**
   * Adapted from dancer.js.
   */
  maxAmplitude: function (frequency) {
    var max = 0;
    var spectrum = this.el.components['audio-visualizer'].spectrum;

    if (!frequency.length) {
      return frequency < spectrum.length ? spectrum[~~frequency] : null;
    }

    for (var i = frequency[0], l = frequency[1]; i <= l; i++) {
      if (spectrum[i] > max) {
        max = spectrum[i];
      }
    }
    return max;
  }
});
