/* global EventTarget, sinon, setup, teardown */

/**
 * __init.test.js is run before every test case.
 */
window.debug = true;
var AScene = require('aframe').AScene;

/* WebXR Stub */
if (!navigator.xr) {
  navigator.xr = {};
}
navigator.xr.isSessionSupported = function (_sessionType) { return Promise.resolve(true); };
navigator.xr.requestSession = function (_mode) {
  const xrSession = new EventTarget();
  xrSession.supportedFrameRates = [90];
  xrSession.requestReferenceSpace = function () { return Promise.resolve(); };
  xrSession.end = function () { return Promise.resolve(); };
  return Promise.resolve(xrSession);
};

// Make sure WebGL context is not created since CI runs headless.
// Stubs below failed once in a while due to asynchronous test setup / teardown.
AScene.prototype.setupRenderer = function () {};

setup(function () {
  // Mock renderer.
  AScene.prototype.renderer = {
    xr: {
      isPresenting: function () { return true; },
      setSession: function () { return Promise.resolve(); },
      setFoveation: function () {},
      setPoseTarget: function () {},
      getCamera: function () {},
      dispose: function () {},
      setReferenceSpaceType: function () {},
      enabled: false
    },
    dispose: function () {},
    getContext: function () { return undefined; },
    render: function () {},
    setAnimationLoop: function () {},
    setOpaqueSort: function () {},
    setPixelRatio: function () {},
    setSize: function () {},
    setTransparentSort: function () {},
    shadowMap: {enabled: false}
  };

  this.sinon = sinon.createSandbox();
  // Stubs to not create a WebGL context since CI runs headless.
  this.sinon.stub(AScene.prototype, 'render');
  this.sinon.stub(AScene.prototype, 'setupRenderer');
});

teardown(function () {
  // Clean up any attached elements.
  var attachedEls = ['canvas', 'a-assets', 'a-scene'];
  var els = document.querySelectorAll(attachedEls.join(','));
  for (var i = 0; i < els.length; i++) {
    els[i].parentNode.removeChild(els[i]);
  }
  this.sinon.restore();
});
