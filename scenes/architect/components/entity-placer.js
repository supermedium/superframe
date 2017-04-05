AFRAME.registerComponent('entity-placer', {
  init: function () {
    var el = this.el;
    var grabEntity = el.querySelector('#grabSlot');

    el.addEventListener('triggerdown', function (evt) {
      var newEntity;
      var rotation;

      if (!grabEntity.getAttribute('geometry')) { return; }

      el.sceneEl.object3D.updateMatrixWorld();
      el.parentEl.object3D.updateMatrixWorld();
      grabEntity.object3D.updateMatrixWorld(true);
      rotation = grabEntity.object3D.getWorldRotation();

      newEntity = document.createElement('a-entity');
      newEntity.setAttribute('geometry', grabEntity.getAttribute('geometry'), true);
      newEntity.setAttribute('material', grabEntity.getAttribute('material'), true);
      newEntity.setAttribute('position', grabEntity.object3D.getWorldPosition());
      newEntity.setAttribute('rotation', {
        x: THREE.Math.radToDeg(rotation.x),
        y: THREE.Math.radToDeg(rotation.y),
        z: THREE.Math.radToDeg(rotation.z)
      });
      el.sceneEl.appendChild(newEntity);

      el.sceneEl.emit('entityplaced', newEntity);
    });
  }
});
