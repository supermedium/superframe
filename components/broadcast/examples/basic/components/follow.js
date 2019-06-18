AFRAME.registerComponent('follow', {
  schema: {
    target: {type: 'selector'},
  },
  init: function () {
    var el = this.el;
  },
  tick: function () {
    var targetPosition = this.data.target.object3D.position;
    this.el.setAttribute("position", targetPosition);
  }
});
