/* global assert, setup, suite, test */
require('aframe');
require('../index.js');
var entityFactory = require('./helpers').entityFactory;

suite('animation', function () {
  var component;
  var el;

  setup(function (done) {
    this.done = false;
    el = entityFactory();
    el.setAttribute('animation', '');
    el.addEventListener('componentinitialized', function (evt) {
      if (evt.detail.name !== 'animation' || this.done) { return; }
      component = el.components.animation;
      this.done = true;
      done();
    });
  });

  suite('startAnimation', function () {
    test('plays by default', function () {
      el.setAttribute('animation', {property: 'position'});
      assert.ok(component.animationIsPlaying);
    });

    test('plays on delay', function (done) {
      el.setAttribute('animation', {property: 'position', delay: 100});
      assert.notOk(component.animationIsPlaying);
      setTimeout(() => {
        assert.ok(component.animationIsPlaying);
        done();
      }, 100);
    });

    test('plays on startEvents', function (done) {
      el.setAttribute('animation', {property: 'position', startEvents: ['foo']});
      assert.notOk(component.animationIsPlaying);
      el.addEventListener('foo', function () {
        assert.ok(component.animationIsPlaying);
        done();
      });
      el.emit('foo');
    });
  });

  suite('events', function () {
    test('emits animationbegin event', function (done) {
      el.addEventListener('animationbegin', evt => { done(); });
      el.setAttribute('animation', {property: 'position', to: '2 2 2'});
    });

    test('emits animationcomplete event', function (done) {
      el.addEventListener('animationbegin', evt => {
        el.addEventListener('animationcomplete', evt => { done(); });
        component.tick(1, 1);
        component.tick(100000, 99999);
      });
      el.setAttribute('animation', {property: 'position', to: '2 2 2'});
    });

    test('emits animationcomplete event twice', function (done) {
      var calledOnce = false;
      el.addEventListener('animationbegin', evt => {
        component.tick(1, 1);
        component.tick(100000, 99999);
      });

      el.addEventListener('animationcomplete', evt => {
        if (calledOnce) {
          done();
        } else {
          calledOnce = true;
          component.el.emit('startAnimation');
        }
      });

      el.setAttribute('animation', {
        property: 'position',
        to: '2 2 2',
        startEvents: 'startAnimation'
      });
      component.el.emit('startAnimation');
    });
  });
});
