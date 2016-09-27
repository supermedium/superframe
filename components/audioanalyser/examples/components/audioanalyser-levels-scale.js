/**
 * Scale children based on audio frequency levels.
 */
AFRAME.registerComponent('audioanalyser-levels-scale', {
  schema: {
    analyserEl: {type: 'selector'},
    max: {default: 20},
    multiplier: {default: 100}
  },

  tick: function (time) {
    var analyserEl;
    var children;
    var data = this.data;
    var levels;

    analyserEl = data.analyserEl || this.el;
    levels = analyserEl.components.audioanalyser.levels;
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
