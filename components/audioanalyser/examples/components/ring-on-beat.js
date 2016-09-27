/**
 * Create expanding ring on audioanalyser beat.
 */
AFRAME.registerComponent('ring-on-beat', {
  schema: {
    analyserEl: {type: 'selector'}
  },

  init: function () {
    var analyserEl = this.data.analyserEl || this.el;
    var el = this.el;
    var rings = this.rings = [];

    analyserEl.addEventListener('audioanalyser-beat', function () {
      var ringEl = document.createElement('a-ring');
      ringEl.setAttribute('material', 'opacity', '0.6');
      ringEl.setAttribute('position', '0 0.1 0');
      ringEl.setAttribute('rotation', '-90 0 0');
      el.appendChild(ringEl);

      ringEl.addEventListener('loaded', function () {
        rings.push(ringEl);
        setTimeout(function () {
          el.removeChild(ringEl);
          rings.splice(rings.indexOf(ringEl), 1);
        }, 2000);
      });
    });
  },

  /**
   * Expand ring radii.
   */
  tick: function () {
    this.rings.forEach(function (ringEl) {
      var scale = ringEl.getComputedAttribute('scale');
      ringEl.setAttribute('scale', {
        x: scale.x * 1.06 + .05,
        y: scale.y * 1.06 + .05,
        z: scale.z
      });
    });
  }
});
