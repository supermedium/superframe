/**
 * Swap template with mask animation.
 */
AFRAME.registerComponent('template-looper', {
  schema: {type: 'array'},

  init: function () {
    this.maskEl = this.el.sceneEl.querySelector('#mask');
    this.index = 0;
  },

  tick: function (time) {
    // Swap every second.
    var self = this;
    if (time - this.time < 2000) { return; }
    this.time = time;

    // Set template.
    this.maskEl.emit('fade');
    setTimeout(function () {
      self.el.setAttribute('template', 'src', self.data[self.index++]);
      self.maskEl.emit('fade');
      if (self.index === self.data.length) { self.index = 0; }
    }, 200);
  }
});
