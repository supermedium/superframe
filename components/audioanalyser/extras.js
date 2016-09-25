/**
 * Scale children based on audio frequency levels.
 */
AFRAME.registerComponent('audioanalyser-levels-scale', {
  dependencies: ['audioanalyser'],

  schema: {
    max: {default: 20},
    multiplier: {default: 100}
  },

  tick: function (time) {
    var children;
    var data = this.data;
    var levels;

    levels = this.el.components.audioanalyser.levels;
    if (!levels) { return; }

    children = this.el.children;
    for (var i = 0; i < children.length; i++) {
      children[i].setAttribute('scale', {
        x: 1,
        y: Math.min(data.max, Math.max(levels[i] * data.multiplier, 0.05)),
        z: 1
      });
    }
  }
});
