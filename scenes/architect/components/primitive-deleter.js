AFRAME.registerComponent('primitive-deleter', {
  dependencies: ['controller-cursor'],

  init: function () {
    var cursorComponent = this.el.components['controller-cursor'];
    var el = this.el;
    var deleteSound = document.querySelector('#deleteSound');

    el.addEventListener('gripdown', function (evt) {
      var intersectedPrimitive = cursorComponent.intersectedEl;

      if (!intersectedPrimitive) { return; }

      if (!intersectedPrimitive.classList.contains('stagedPrimitive')) { return; }

      console.log('Deleting primitive', cursorComponent.intersectedEl);
      intersectedPrimitive.parentNode.removeChild(intersectedPrimitive);

      deleteSound.volume = 0.1;
      deleteSound.play();

      el.emit('primitivedelete', {id: intersectedPrimitive.id});
    });

    // TODO: Figure out why gripup not firing.
  }
});
