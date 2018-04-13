/**
 * Listen to event and forward to another entity or entities.
 */
AFRAME.registerComponent('proxy-event', {
  schema: {
    captureBubbles: {default: false},
    event: {type: 'string'},
    to: {type: 'string'},
    as: {type: 'string'},
    bubbles: {default: false}
  },

  multiple: true,

  init: function () {
    var data = this.data;
    var el = this.el;
    var to;
    var self = this;

    if (data.to === 'CHILDREN') {
      to = el.querySelectorAll('*');
    } else if (data.to === 'SELF') {
      to = [el];
    } else {
      to = document.querySelectorAll(data.to);
    }

    el.addEventListener(data.event, function (evt) {
      var data = self.data;
      var i;
      if (!data.captureBubbles && evt.target !== el) { return; }
      for (i = 0; i < to.length; i++) {
        to[i].emit(data.as || data.event, evt['detail'] ? evt.detail : null, data.bubbles);
      }
    });
  }
});
