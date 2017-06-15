/* global AFRAME, assert, setup, suite, test */
require('aframe');
require('../index.js');
var entityFactory = require('./helpers').entityFactory;

suite('log component', function () {
  var component;
  var el;
  var system;

  setup(function (done) {
    el = entityFactory();
    el.addEventListener('componentinitialized', function (evt) {
      if (evt.detail.name !== 'log') { return; }
      component = el.components['log'];
      system = el.sceneEl.systems.log;
      done();
    });
    el.setAttribute('log', {});
  });

  suite('system', function () {
    test('registers logger', function () {
      assert.equal(system.loggers[0], component);
    });

    test('unregisters logger', function (done) {
      el.parentNode.removeChild(el);
      setTimeout(() => {
        assert.equal(system.loggers.length, 0);
        done();
      });
    });

    test('sends previous logs to logger upon registration', function (done) {
      var loggerEl;

      AFRAME.log('hello');

      loggerEl = document.createElement('a-entity');

      loggerEl.addEventListener('componentinitialized', function (evt) {
        if (evt.detail.name !== 'log') { return; }
        assert.equal(loggerEl.components.log.logs[0], 'hello');
        done();
      });

      loggerEl.setAttribute('log', '');
      el.sceneEl.appendChild(loggerEl);
    });
  });

  suite('logging', function () {
    test('adds to component log', function () {
      AFRAME.log('hello');
      assert.equal(component.logs.length, 1);
      assert.equal(component.logs[0], 'hello');
    });

    test('filters by channel', function () {
      el.setAttribute('log', {channel: 'thischannel'});
      AFRAME.log('hello', 'thatchannel');
      assert.equal(component.logs.length, 0);
      AFRAME.log('hello', 'thischannel');
      assert.equal(component.logs.length, 1);
    });

    test('filters by filter', function () {
      el.setAttribute('log', {filter: 'foo'});
      AFRAME.log('bar');
      assert.equal(component.logs.length, 0);
      AFRAME.log('foobar');
      assert.equal(component.logs.length, 1);
    });

    test('listens to event', function (done) {
      el.sceneEl.emit('log', {message: 'hello'});
      setTimeout(() => {
        assert.equal(component.logs[0], 'hello');
        done();
      });
    });
  });

  suite('text', function () {
    test('sets text', function () {
      AFRAME.log('foo');
      assert.equal(el.getAttribute('text').value, 'foo');
      AFRAME.log('bar');
      assert.equal(el.getAttribute('text').value, 'foo\nbar');
    });
  });
});
