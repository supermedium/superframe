/**
 * Change color to match when another entity changes its color.
 */
AFRAME.registerComponent('color-copy', {
  schema: {type: 'selector'},

  init: function () {
    var el = this.el;
    this.data.addEventListener('componentchanged', function changeColor (event) {
      if (event.detail.name !== 'material') { return; }
      el.setAttribute('material', 'color', event.detail.newData.color);
    });
  }
});
