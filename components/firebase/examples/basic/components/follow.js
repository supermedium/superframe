AFRAME.registerComponent('follow', {
  schema: {type: 'selector'},

  init: function () {
    var el = this.el;
    this.data.addEventListener('componentchanged', function (evt) {
      if (evt.detail.name !== 'position') { return; }
      el.setAttribute('position', evt.detail.newData);
    });
  }
});
