AFRAME.registerComponent('projectile', {
  schema: {
    direction: {type: 'vec3'},
    speed: {type: 'number'}
  },

  tick: function (t, dt) {
    var data = this.data;
    var direction;
    var el = this.el;
    var position;
    var seconds;
    var speed;

    direction = data.direction;
    seconds = dt / 1000;
    speed = data.speed;

    position = el.getComputedAttribute('position');
    position.x += direction.x * speed * seconds;
    position.y += direction.y * speed * seconds;
    position.z += direction.z * speed * seconds;
    el.setAttribute('position', position);
  }
});
