AFRAME.registerComponent('color-on-beat', {
  init: function () {
    var el = this.el;
    el.addEventListener('audioanalyser-beat', function () {
      el.setAttribute('material', 'color', '#' + new THREE.Color(
        Math.random(), Math.random(), Math.random()
      ).getHexString());
    });
  }
});
