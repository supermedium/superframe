AFRAME.registerComponent('palette-handler', {
  init: function () {
    var el = this.el;
    var grabSlot = el.querySelector('#grabSlot');
    this.hasSelectedPrimitive = false;

    // Select primitive from palette with mousedown.
    el.addEventListener('mousedown', function (evt) {
      var targetEl = evt.detail.intersectedEl;

      if (!targetEl) { return; }

      // Select primitive.
      if (targetEl.getAttribute('mixin').indexOf('primitive') !== -1) {
        grabSlot.setAttribute('geometry', targetEl.getAttribute('geometry'), true);
        grabSlot.setAttribute('scale', {x: 3, y: 3, z: 3});
      }

      // Select color.
      if (targetEl.getAttribute('mixin').indexOf('color') !== -1) {
        grabSlot.setAttribute('material', targetEl.getAttribute('material'), true);
      }

      this.hasSelectedPrimitive = true;
    });

    // Release primitive, pass off to entity-placer.
    el.addEventListener('triggerup', function (evt) {
      if (!this.hasSelectedPrimitive) { return; }
      el.emit('primitivedragrelease');
    });

    // Reset grabSlot once primitive is placed.
    el.parentNode.addEventListener('entityplaced', function (evt) {
      this.hasSelectedPrimitive = false;
      grabSlot.removeAttribute('geometry');
      grabSlot.removeAttribute('material');
    });
  }
});
