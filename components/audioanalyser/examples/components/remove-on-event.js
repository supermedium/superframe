AFRAME.registerComponent('remove-on-event', {
  schema: {
    el: {type: 'selector'},
    event: {type: 'string'}
  },

  init: function () {
    this._removeEntity = this._removeEntity.bind(this);
  },

  update: function () {
    var data = this.data;
    var el = data.el || this.el;
    this.removeEventListener();
    el.addEventListener(data.event, this._removeEntity);
  },

  remove: function () {
    this.removeEventListener();
  },

  removeEventListener: function () {
    var data = this.data;
    var el = this.el;
    el.removeEventListener(data.event, this._removeEntity);
  },

  _removeEntity: function () {
    var el = this.el;
    if (el.parentEl) {
      el.parentEl.removeChild(el);
    }
    if (el.parentNode) {
      el.parentNode.removeChild(el);
    }
  },
});
