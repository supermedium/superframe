AFRAME.registerComponent('punch-emit', {
  schema: {type: 'string'},

  init: function () {
    this.oldPosition = new AFRAME.THREE.Vector3();
    this.oldPosition.copy(this.el.object3D.position);
  },

  tick: function (t, dt) {
    var difference;
    var distance;
    var newPosition = this.el.object3D.position;
    var speed;

    difference = this.oldPosition.sub(newPosition);
    distance = difference.length();
    difference.normalize().multiplyScalar(-1);
    speed = distance / (dt / 1000);  // meters per second.

    if (speed > 1.6) {  // 4.4
      var newEl = document.createElement('a-entity');
      newEl.setAttribute('mixin', this.data);
      newEl.setAttribute('projectile', {
        direction: {x: difference.x, y: difference.y, z: difference.z},
        speed: speed / 2
      });
      newEl.setAttribute('position', this.el.getComputedAttribute('position'));
      this.el.sceneEl.appendChild(newEl);
    }

    this.oldPosition.copy(newPosition);
  }
});
