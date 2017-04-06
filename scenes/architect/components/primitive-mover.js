AFRAME.registerComponent('primitive-mover', {
  init: function () {
    var handEl = this.el;
    this.activePrimitive = null;
    this.previousHandPosition = null;

    handEl.addEventListener('mousedown', evt => {
      var intersectedPrimitive = evt.detail.intersectedEl;
      if (!intersectedPrimitive) { return; }
      if (!intersectedPrimitive.classList.contains('stagedPrimitive')) { return; }
      // Set active primitive.
      this.activePrimitive = intersectedPrimitive;
      console.log('Moving primitive', intersectedPrimitive);
    });

    handEl.addEventListener('mouseup', () => {
      if (!this.activePrimitive) { return; }
      console.log('No longer moving primitive', this.activePrimitive);
      // Reset.
      this.activePrimitive = null;
      this.previousHandPosition = null;
    });
  },

  tick: function () {
    var activePrimitive = this.activePrimitive;
    var handEl = this.el;  // Hand.
    var currentHandPosition;

    if (!activePrimitive) { return; }

    // Update transforms.
    handEl.sceneEl.object3D.updateMatrixWorld();
    handEl.parentEl.object3D.updateMatrixWorld();
    activePrimitive.object3D.updateMatrixWorld(true);

    currentHandPosition = handEl.object3D.getWorldPosition();
    previousHandPosition = this.previousHandPosition || currentHandPosition;

    // Calculate delta.
    deltaPosition = {
      x: currentHandPosition.x - previousHandPosition.x,
      y: currentHandPosition.y - previousHandPosition.y,
      z: currentHandPosition.z - previousHandPosition.z
    },

    // Update primitive position.
    primitivePosition = activePrimitive.object3D.getWorldPosition();
    activePrimitive.setAttribute('position', {
      x: primitivePosition.x + deltaPosition.x,
      y: primitivePosition.y + deltaPosition.y,
      z: primitivePosition.z + deltaPosition.z
    });

    this.previousHandPosition = currentHandPosition;

    // TODO: Consider using physics constraint for rotation.
  }
});
