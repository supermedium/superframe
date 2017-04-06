AFRAME.registerComponent('primitive-deleter', {
  dependencies: ['controller-cursor'],

  init: function () {
    var cursorComponent = this.el.components['controller-cursor'];
    var el = this.el;
    var deleteSound = document.querySelector('#deleteSound');

    el.addEventListener('gripdown', function (evt) {
      var intersectedPrimitive = cursorComponent.intersectedEl;

      if (!intersectedPrimitive) { return; }

      console.log('Deleting primitive', cursorComponent.intersectedEl);
      intersectedPrimitive.parentNode.removeChild(intersectedPrimitive);

      deleteSound.volume = 0.3;
      deleteSound.play();
    });

    // TODO: Figure out why gripup not firing.
  }
});
