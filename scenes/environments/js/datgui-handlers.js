AFRAME.registerComponent('env-subscribe', {
  init: function () {
    var sceneEl = this.el.sceneEl;
    NAF.connection.subscribeToDataChannel('environment', function (id, type, data) {
      sceneEl.setAttribute('environment', data);
    });
  }
});

AFRAME.registerComponent('update-dressing', {
  init: function () {
    var sceneEl = this.el.sceneEl;
    var onChanged = debounce(function (evt) {
      sceneEl.setAttribute('environment', {dressing: evt.detail.value});
      NAF.connection.broadcastDataGuaranteed(
        'environment', sceneEl.getAttribute('environment'));
    }, 250);
    this.el.addEventListener('onChanged', onChanged);
  }
});

AFRAME.registerComponent('update-dressing-amount', {
  init: function () {
    var sceneEl = this.el.sceneEl;
    var onChanged = debounce(function (evt) {
      sceneEl.setAttribute('environment', {dressingAmount: evt.detail.value});
      NAF.connection.broadcastDataGuaranteed(
        'environment', sceneEl.getAttribute('environment'));
    }, 250);
    this.el.addEventListener('onChanged', onChanged);
  }
});

AFRAME.registerComponent('update-dressing-scale', {
  init: function () {
    var sceneEl = this.el.sceneEl;
    var onChanged = debounce(function (evt) {
      sceneEl.setAttribute('environment', {dressingScale: evt.detail.value});
      NAF.connection.broadcastDataGuaranteed(
        'environment', sceneEl.getAttribute('environment'));
    }, 250);
    this.el.addEventListener('onChanged', onChanged);
  }
});

AFRAME.registerComponent('update-ground-texture', {
  init: function () {
    var sceneEl = this.el.sceneEl;
    var onChanged = debounce(function (evt) {
      console.log("YEH");
      sceneEl.setAttribute('environment', {groundTexture: evt.detail.value});
      NAF.connection.broadcastDataGuaranteed(
        'environment', sceneEl.getAttribute('environment'));
    }, 250);
    this.el.addEventListener('onChanged', onChanged);
  }
});

AFRAME.registerComponent('gui-inputs', {
  dependencies: ['datgui'],

  init: function () {
    var sceneEl = this.el.sceneEl;
    var input = dat.GUIVR.addInputObject(sceneEl.camera);
    sceneEl.object3D.add(input);
    document.addEventListener('mousedown', function() {
      input.pressed(true);
    });
    document.addEventListener('mouseup', function() {
      input.pressed(false);
    });
  }
});

function debounce (func, wait, immediate) {
  var timeout;
  return function () {
    var context = this, args = arguments;
    var later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};
