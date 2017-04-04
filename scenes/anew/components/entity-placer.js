AFRAME.registerComponent('entity-placer', {
  init: function () {
    var el = this.el;
    var grabEntity = el.querySelector('#grabSlot');

    var positionHelper = new THREE.Vector3();
    var quaternionHelper = new THREE.Quaternion();
    var scaleHelper = new THREE.Vector3();

    el.addEventListener('triggerdown', function (evt) {
      if (!grabEntity.getAttribute('geometry')) { return; }

      el.sceneEl.object3D.updateMatrixWorld();
      el.parentEl.object3D.updateMatrixWorld();
      grabEntity.object3D.updateMatrixWorld(true);
      grabEntity.object3D.matrixWorld.decompose(positionHelper, quaternionHelper, scaleHelper);
      var rotation = new THREE.Euler().setFromQuaternion(quaternionHelper, 'XYZ');

      var newEntity = document.createElement('a-entity');
      newEntity.setAttribute('geometry', grabEntity.getAttribute('geometry'), true);
      newEntity.setAttribute('material', grabEntity.getAttribute('material'), true);
      newEntity.setAttribute('position', positionHelper);

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
