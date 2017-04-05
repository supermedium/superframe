AFRAME.registerComponent('create-thing-button', {
  init: function () {
    var el = this.el;
    el.addEventListener('click', function () {
      el.emit('createthingbuttonpress');
    });
  }
});
