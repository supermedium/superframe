AFRAME.registerComponent('update-dressing-amount', {
  init: function () {
    var sceneEl = this.el.sceneEl;
    this.el.addEventListener('onChanged', function (evt) {
      sceneEl.setAttribute('environment', {dressingAmount: evt.detail.value});
    });
  }
});
