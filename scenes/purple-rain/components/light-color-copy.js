/**
 * Change light color to match when another entity changes its color.
 */
AFRAME.registerComponent('light-color-copy', {
  schema: {
    mute: {default: true},
    target: {type: 'selector'}
  },

  init: function () {
    var el = this.el;
    this.data.target.addEventListener('componentchanged', function changeColor (event) {
      if (event.detail.name !== 'material') { return; }
      el.setAttribute('light', 'color', muteColor(event.detail.newData.color));
    });
  }
});

function muteColor (hexString) {
  var color = new THREE.Color(hexString);
  return '#' + new THREE.Color(color.r * 0.3, color.g * 0.3, color.b * 0.3).getHexString();
}
