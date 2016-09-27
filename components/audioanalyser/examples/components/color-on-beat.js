AFRAME.registerComponent('color-on-beat', {
  schema: {
    analyserEl: {type: 'selector'}
  },

  init: function () {
    var analyserEl = this.data.analyserEl || this.el;
    var el = this.el;

    analyserEl.addEventListener('audioanalyser-beat', function () {
      el.setAttribute('material', 'color', '#' + new THREE.Color(
        Math.random(), Math.random(), Math.random()
      ).getHexString());
    });
  }
});
