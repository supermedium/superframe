/**
 * Listen to event and forward to another entity or entities.
 */
AFRAME.registerComponent('proxy-event', {
  schema: {
    captureBubbles: {default: false},
    enabled: {default: true},
    event: {type: 'string'},
    from: {type: 'string'},
    to: {type: 'string'},
    as: {type: 'string'},
    bubbles: {default: false},
    delay: {default: 0, type: 'int'}
  },

  multiple: true,

  init: function () {
    var data = this.data;
    var el = this.el;
    var from;
    var i;
    var to;
    var self = this;

    if (data.from) {
      if (data.from === 'PARENT') {
        from = [el.parentNode];
      } else {
        from = document.querySelectorAll(data.from);
      }
    } else {
      if (data.to === 'CHILDREN') {
        to = el.querySelectorAll('*');
      } else if (data.to === 'SELF') {
        to = [el];
      } else {
        to = document.querySelectorAll(data.to);
      }
    }

    if (data.from) {
      for (i = 0; i < from.length; i++) {
        this.addEventListenerFrom(from[i]);
      }
    } else {
      el.addEventListener(data.event, function (evt) {
        setTimeout(() => {
          var data = self.data;
          if (!data.enabled) { return; }
          if (!data.captureBubbles && evt.target !== el) { return; }
          for (i = 0; i < to.length; i++) {
            to[i].emit(data.as || data.event, evt['detail'] ? evt.detail : null, data.bubbles);
          }
        }, data.delay);
      });
    }
  },

  addEventListenerFrom: function (fromEl) {
    var data = this.data;
    var self = this;
    fromEl.addEventListener(data.event, function (evt) {
      setTimeout(() => {
        var data = self.data;
        if (!data.enabled) { return; }
        if (!data.captureBubbles && evt.target !== fromEl) { return; }
        self.el.emit(data.as || data.event, evt['detail'] ? evt.detail : null, false);
      }, data.delay);
    });
  }
});
