/**
 * Set spotlight target.
 */
AFRAME.registerComponent('spotlight-target', {
  dependencies: ['light'],

  schema: {
    type: 'selector'
  },

  update: function () {
    this.el.components.light.light.target = this.data.object3D;
  }
});
