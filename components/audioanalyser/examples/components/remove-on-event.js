AFRAME.registerComponent('remove-on-event', {
  schema: {
    el: {type: 'selector'},
    event: {type: 'string'}
  },

  update: function () {
    var data = this.data;
    var el = this.el;
    data.el.addEventListener(data.event, function () {
      el.parentNode.removeChild(el);
    });
  }
});
