AFRAME.registerComponent('play-audio', {
  schema: {
    delay: {type: 'number'},
    audio: {type: 'selector'}
  },

  init: function () {
    var data = this.data;
    this.el.addEventListener('loaded', function () {
      setTimeout(function () {
        data.audio.play();
      }, data.delay);
    });
  }
});
