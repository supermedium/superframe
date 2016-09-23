AFRAME.registerComponent('punch-emit', {
  schema: {type: 'string'},

  init: function () {
    this.oldPosition = new AFRAME.THREE.Vector3();
    this.oldPosition.copy(this.el.object3D.position);
  },

  tick: function (t, dt) {
    var newPosition = this.el.object3D.position;
    var distance = this.oldPosition.sub(newPosition).length();

    var speed = distance / (dt / 1000);
    console.log(speed);
    if (speed > 4.4) {
      var newEl = document.createElement('a-entity');
      newEl.setAttribute('mixin', this.data);
      newEl.setAttribute('position', this.el.getComputedAttribute('position'));
      this.el.sceneEl.appendChild(newEl);
    }
    this.oldPosition.copy(newPosition);
  }
});
