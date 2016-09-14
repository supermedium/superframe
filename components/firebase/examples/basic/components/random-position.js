/**
 * Set random position within bounds.
 */
AFRAME.registerComponent('random-position', {
  dependencies: ['position'],

  schema: {
    min: {default: {x: -10, y: -10, z: -10}, type: 'vec3'},
    max: {default: {x: 10, y: 10, z: 10}, type: 'vec3'}
  },

  update: function () {
    var data = this.data;
    var max = data.max;
    var min = data.min;
    var el = this.el;

    setTimeout(function () {
      el.setAttribute('position', {
        x: Math.random() * (max.x - min.x) + min.x,
        y: Math.random() * (max.y - min.y) + min.y,
        z: Math.random() * (max.z - min.z) + min.z
      });
    });
  }
});
