AFRAME.registerComponent('palette-handler', {
  init: function () {
    var el = this.el;
    var activePrimitiveEl = el.querySelector('#activePrimitive');
    this.hasSelectedPrimitive = false;

     // Hook up to game state.
     var activePrimitive;
     el.sceneEl.addEventListener('gamestateinitialized', function (evt) {
       activePrimitive = el.sceneEl.getAttribute('gamestate').activePrimitive;
     });

    // Select primitive from palette with mousedown.
    el.addEventListener('mousedown', function (evt) {
      var targetEl = evt.detail.intersectedEl;

      if (!targetEl) { return; }

      // Select primitive.
      if (targetEl.classList.contains('primitive')) {
        var geometry = targetEl.getDOMAttribute('geometry');
        // Set.
        activePrimitiveEl.setAttribute('geometry', geometry);
        activePrimitiveEl.setAttribute('material', activePrimitive.material);
        // Emit.
        el.emit('paletteprimitiveselect', {
          geometry: geometry,
          // TODO: Larger scale.
          scale: {x: 3, y: 3, z: 3}
        });
        this.hasSelectedPrimitive = true;
      }

      // Select color.
      if (targetEl.classList.contains('color')) {
        var color = targetEl.getAttribute('material').color;
        // Emit.
        el.emit('palettecolorselect', {color: color});
      }
    });

    // Release primitive, pass off to entity-placer.
    el.addEventListener('triggerup', function (evt) {
      if (!this.hasSelectedPrimitive) { return; }
      el.emit('primitivedragrelease');
    });

    // Reset activePrimitiveEl once primitive is placed.
    el.parentNode.addEventListener('primitiveplace', function (evt) {
      this.hasSelectedPrimitive = false;
      activePrimitiveEl.removeAttribute('geometry');
      activePrimitiveEl.removeAttribute('material');
    });
  }
});
