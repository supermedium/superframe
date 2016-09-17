/**
 * Put text above entity.
 */
AFRAME.registerComponent('label', {
  schema: {type: 'string'},

  init: function () {
    var text = document.createElement('a-entity');
    text.setAttribute('bmfont-text', {text: this.data});
    text.setAttribute('position', {x: 0, y: 1, z: 0});
    text.setAttribute('scale', {x: 3, y: 3, z: 3});
    this.el.appendChild(text);
  }
});
