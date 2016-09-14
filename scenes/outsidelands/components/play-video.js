AFRAME.registerComponent('play-video', {
  schema: {
    target: {type: 'selector'},
    src: {type: 'string'},
    on: {default: 'click'},
  },

  multiple: true,

  init: function () {
    var data = this.data;

    this.el.addEventListener(data.on, function () {
      data.target.setAttribute('src', data.src);
      data.target.components.material.material.map.image.play();
    });
  }
});
