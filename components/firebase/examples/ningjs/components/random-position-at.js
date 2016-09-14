/**
 * Set random position at one of the entities specified by `selector` with optional `offset`.
 */
AFRAME.registerComponent('random-position-at', {
  dependencies: ['position'],

  schema: {
    offset: {type: 'vec3'},
    selector: {type: 'string'}
  },

  update: function () {
    var data = this.data;
    var el = this.el;

    if (window.location.hash.indexOf('presenter') !== -1) {
      return;
    }

    setTimeout(function () {
      var entities = el.sceneEl.querySelectorAll(data.selector);
      var entity = entities[Math.floor(Math.random() * entities.length)];
      var position = entity.getComputedAttribute('position');
      var parentPosition = entity.parentNode.getComputedAttribute('position');

      el.setAttribute('position', {
        x: position.x + parentPosition.x + data.offset.x,
        y: position.y + parentPosition.y + data.offset.y,
        z: position.z + parentPosition.z + data.offset.z
      });
    }, 100);
  }
});
