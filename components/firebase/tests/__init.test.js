/* global sinon, setup, teardown */
var AScene = require('aframe').AScene;

/**
 * __init.test.js is run before every test case.
 */
window.debug = true;

navigator.getVRDisplays = function () {
  var resolvePromise = Promise.resolve();
  var mockVRDisplay = {
    requestPresent: resolvePromise,
    exitPresent: resolvePromise
  };
  return new Promise(function (resolve) {
    resolve([mockVRDisplay]);
  });
};

setup(function () {
  this.sinon = sinon.sandbox.create();
});

teardown(function () {
  // Clean up any attached elements.
  ['canvas', 'a-assets', 'a-scene'].forEach(function (tagName) {
    var els = document.querySelectorAll(tagName);
    for (var i = 0; i < els.length; i++) {
      els[i].parentNode.removeChild(els[i]);
    }
  });
  this.sinon.restore();
});
