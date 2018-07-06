/* global sinon, setup, teardown */

/**
 * __init.test.js is run before every test case.
 */
window.debug = true;

var AScene = require('aframe').AScene;

beforeEach(function () {
  this.sinon = sinon.sandbox.create();
  // Stub to not create a WebGL context since Travis CI runs headless.
  this.sinon.stub(AScene.prototype, 'attachedCallback');
});

afterEach(function () {
  this.sinon.restore();
});
