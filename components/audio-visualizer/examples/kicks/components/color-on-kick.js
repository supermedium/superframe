AFRAME.registerComponent('color-on-kick', {
  init: function () {
    var el = this.el;
    el.addEventListener('audio-visualizer-kick-start', function () {
      el.setAttribute('material', 'color', '#' + new THREE.Color(
        Math.random(), Math.random(), Math.random()
      ).getHexString());
    });
  }
});
