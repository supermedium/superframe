AFRAME.registerComponent('audio-visualizer-spectrum-scale', {
  dependencies: ['audio-visualizer'],

  schema: {
    max: {default: 20},
    multiplier: {default: 100}
  },

  tick: function (time) {
    var spectrum = this.el.components['audio-visualizer'].spectrum;
    if (!spectrum) { return; }

    var children = this.el.children;
    var data = this.data;

    for (var i = 0; i < children.length; i++) {
      children[i].setAttribute('scale', {
        x: 1,
        y: Math.min(data.max, Math.max(spectrum[i] * data.multiplier, 0.05)),
        z: 1
      });
    }
  }
});
