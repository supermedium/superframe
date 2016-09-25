AFRAME.registerComponent('audioanalyser-volume-scale', {
  dependencies: ['audioanalyser'],

  schema: {
    multiplier: {type: 'number', default: 1}
  },

  tick: function () {
    var analyserComponent;
    var el = this.el;
    var volume;

    analyserComponent = el.components.audioanalyser;
    if (!analyserComponent.analyser) { return; }

    volume = analyserComponent.volume * this.data.multiplier;
    console.log(volume);
    el.setAttribute('scale', {
      x: volume,
      y: volume,
      z: volume
    });
  }
});
