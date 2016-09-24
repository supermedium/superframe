AFRAME.registerComponent('time-to-live', {
  schema: {type: 'number'},

  init: function () {
    var el = this.el;
    setTimeout(function () {
      el.parentNode.removeChild(el);
    }, this.data);
  }
});
