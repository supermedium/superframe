/**
 * Put text above entity.
 */
AFRAME.registerComponent('label', {
  schema: {
    level: {default: 1},
    text: {type: 'string'}
  },

  multiple: true,

  init: function () {
    var textEl = this.textEl = document.createElement('a-entity');
    textEl.setAttribute('scale', {x: 3, y: 3, z: 3});
    this.el.appendChild(textEl);
  },

  update: function () {
    this.textEl.setAttribute('bmfont-text', {text: this.data.text});
    this.textEl.setAttribute('position', {x: 0, y: this.data.level, z: 0});
  },

  remove: function () {
    this.el.removeChild(this.textEl);
  }
});
