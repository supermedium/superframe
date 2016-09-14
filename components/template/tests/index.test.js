var Aframe = require('aframe-core');
var example = require('../index.js').component;
var entityFactory = require('./helpers').entityFactory;

Aframe.registerComponent('example', example);

describe('example', function () {
  beforeEach(function (done) {
    this.el = entityFactory();
    this.el.addEventListener('loaded', function () {
      done();
    });
  });

  describe('example property', function () {
    it('is good', function () {
      assert.equal(1, 1);
    });
  });
});
