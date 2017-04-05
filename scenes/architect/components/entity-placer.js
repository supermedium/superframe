AFRAME.registerComponent('entity-placer', {
  init: function () {
    var el = this.el;
    var grabEntity = el.querySelector('#grabSlot');

    var workaround = 0;
    el.addEventListener('primitivedragrelease', function (evt) {
      var newEntity;
      var rotation;

      workaround++;
      if (workaround % 2 !== 0) { return; }

      el.sceneEl.object3D.updateMatrixWorld();
      el.parentEl.object3D.updateMatrixWorld();
      grabEntity.object3D.updateMatrixWorld(true);
      rotation = grabEntity.object3D.getWorldRotation();

      // Create entity by copying selected primitive.
      newEntity = document.createElement('a-entity');
      newEntity.setAttribute('geometry', grabEntity.getAttribute('geometry'), true);
      newEntity.setAttribute('material',
        grabEntity.getAttribute('material') || {color: 'red'},
      true);
      newEntity.setAttribute('position', grabEntity.object3D.getWorldPosition());
      newEntity.setAttribute('rotation', {
        x: THREE.Math.radToDeg(rotation.x),
        y: THREE.Math.radToDeg(rotation.y),
        z: THREE.Math.radToDeg(rotation.z)
      });

      el.sceneEl.appendChild(newEntity);
      el.sceneEl.emit('entityplaced', newEntity);
      console.log('Primitive placed', newEntity);
    });
  }
});
