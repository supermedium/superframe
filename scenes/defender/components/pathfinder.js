/**
 * Tell entity to go towards another entity.
 */
AFRAME.registerComponent('pathfinder', {
  schema: {
    target: {type: 'selector'},
    speed: {default: 1}  // meters per second.
  },

  init: function () {
    this.targetPosition = this.data.target.object3D.position;
  },

  tick: function (t, dt) {
    var currentPosition = this.el.object3D.position;

    // Already reached target.
    if (this.targetPosition.equals(currentPosition)) { return; }

    // Calculate direction to go on the X-Z plane.
    var direction = this.targetPosition.clone().sub(currentPosition);
    direction.y = 0;

    // Scale down direction vector to the speed we want to travel in meters per second.
    var magnitude = direction.length();
    var factor = this.data.speed / magnitude;
    direction.x = direction.x * factor;
    direction.z = direction.z * factor * (dt / 1000);

    // Set position.
    this.el.setAttribute('position', {
      x: currentPosition.x + direction.x,
      y: currentPosition.y,
      z: currentPosition.z + direction.z
    });
  }
});
