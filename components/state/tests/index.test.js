/* global assert, setup, suite, test */
require('aframe');
require('../index.js');
var entityFactory = require('./helpers').entityFactory;

AFRAME.registerReducer('foo', {
  initialState: {
    counter: 5,
    enabled: false,
    color: 'red',
    position: {x: 0, y: 0, z: 0}
  },

  handlers: {
    fooAdd: (newState, payload) => {
      newState.counter += payload.number;
      return newState;
    },

    fooEnable: (newState, payload) => {
      newState.enabled = true;
      return newState;
    },

    fooSubtract: (newState, payload) => {
      newState.counter -= payload.number;
      return newState;
    },

    fooColor: (newState, payload) => {
      newState.color = payload.color;
      return newState;
    },

    fooPosition: (newState, payload) => {
      newState.position.x = payload.position.x;
      newState.position.y = payload.position.y;
      newState.position.z = payload.position.z;
      return newState;
    }
  },

  postAction: function (newState) {
    newState.colorCounter = `${newState.color}${newState.counter}`;
    return newState;
  }
});

suite('state', function () {
  var el;

  setup(function (done) {
    el = entityFactory();
    setTimeout(() => {
      if (el.sceneEl.hasLoaded) {
        done();
        return;
      }
      el.sceneEl.addEventListener('loaded', () => { done(); });
    });
  });

  suite('reducer', () => {
    test('runs postAction', done => {
      el.emit('fooColor', {color: 'red'});
      setTimeout(() => {
        el.emit('fooAdd', {number: 5});
        setTimeout(() => {
          assert.equal(el.sceneEl.systems.state.state.foo.colorCounter, 'red10');
          done();
        });
      });
    });
  });

  suite('bind', () => {
    test('binds single-property component', done => {
      el.setAttribute('bind', 'visible: foo.enabled');
      assert.notOk(el.getAttribute('visible'));
      el.emit('fooEnable');
      setTimeout(() => {
        assert.ok(el.getAttribute('visible'));
        done();
      });
    });

    test('binds single-property component with namespace', done => {
      el.setAttribute('bind__visible', 'foo.enabled');
      assert.notOk(el.getAttribute('visible'));
      el.emit('fooEnable');
      setTimeout(() => {
        assert.ok(el.getAttribute('visible'));
        done();
      });
    });

    test('binds system', done => {
      AFRAME.registerSystem('test-system', {
        schema: {
          counter: {default: 100}
        }
      });
      el.sceneEl.setAttribute('bind__test-system', 'counter: foo.counter');
      assert.equal(el.sceneEl.getAttribute('test-system').counter, 5);
      el.emit('fooAdd', {number: 10});
      setTimeout(() => {
        assert.equal(el.sceneEl.getAttribute('test-system').counter, 15);
        delete AFRAME.systems['test-system'];
        done();
      });
    });

    test('binds multi-property components', done => {
      // Components.
      AFRAME.registerComponent('bar', {schema: {barCounter: {default: 0}}});
      AFRAME.registerComponent('baz', {schema: {bazCounter: {default: 0}}});

      // Assert unbinded value.
      el.setAttribute('bar', '');
      assert.equal(el.getAttribute('bar').barCounter, 0);

      // Bind.
      el.setAttribute('bind', {'bar.barCounter': 'foo.counter', 'baz.bazCounter': 'foo.counter'});

      // Assert initial state bind values.
      assert.equal(el.getAttribute('bar').barCounter, 5);
      assert.equal(el.getAttribute('baz').bazCounter, 5);

      // Dispatch action.
      el.emit('fooAdd', {number: 10});

      setTimeout(() => {
        assert.equal(el.getAttribute('bar').barCounter, 15);
        assert.equal(el.getAttribute('baz').bazCounter, 15);
        delete AFRAME.components.bar;
        delete AFRAME.components.baz;
        done();
      });
    });

    test('binds multi-property component with namespace', done => {
      // Components.
      AFRAME.registerComponent('bar', {
        schema: {
          barCounter: {default: 0},
          barEnabled: {default: true}
        }
      });

      // Bind.
      el.setAttribute('bind__bar', {'barCounter': 'foo.counter', 'barEnabled': 'foo.enabled'});

      // Assert initial state bind values.
      assert.equal(el.getAttribute('bar').barCounter, 5);
      assert.equal(el.getAttribute('bar').barEnabled, false);

      // Dispatch action.
      el.emit('fooAdd', {number: 10});
      el.emit('fooEnable');

      setTimeout(() => {
        assert.equal(el.getAttribute('bar').barCounter, 15);
        assert.equal(el.getAttribute('bar').barEnabled, true);
        delete AFRAME.components.bar;
        done();
      });
    });

    test('batches update for multi-property component with namespace', () => {
      var spy = sinon.spy(el, 'setAttribute');

      // Components.
      AFRAME.registerComponent('bar', {
        schema: {
          barCounter: {default: 0},
          barEnabled: {default: true}
        }
      });

      // Bind.
      el.setAttribute('bind__bar', {'barCounter': 'foo.counter', 'barEnabled': 'foo.enabled'});


      assert.equal(spy.getCalls().length, 2);
      assert.shallowDeepEqual(spy.getCalls()[1].args[1],
                              {barCounter: 5, barEnabled: false});
      delete AFRAME.components.bar;
    });

    test('binds non-component attribute', done => {
      el.setAttribute('bind', 'data-enabled: foo.enabled');
      assert.equal(el.getAttribute('data-enabled'), 'false');
      el.emit('fooEnable');
      setTimeout(() => {
        assert.equal(el.getAttribute('data-enabled'), 'true');
        done();
      });
    });

    test('binds non-component attribute with namespace', done => {
      el.setAttribute('bind__data-enabled', 'foo.enabled');
      assert.equal(el.getAttribute('data-enabled'), 'false');
      el.emit('fooEnable');
      setTimeout(() => {
        assert.equal(el.getAttribute('data-enabled'), 'true');
        done();
      });
    });

    test('avoids calling setAttribute if data has not changed', function (done) {
      var setAttributeSpy;
      el.setAttribute('bind', 'data-counter: foo.counter; visible: foo.enabled');
      el.emit('fooAdd', {number: 10});
      setTimeout(() => {
        setAttributeSpy = this.sinon.spy(el, 'setAttribute');
        el.emit('fooAdd', {number: 15});
        setTimeout(() => {
          assert.equal(setAttributeSpy.getCalls().length, 1);
          assert.equal(setAttributeSpy.getCalls()[0].args[0], 'data-counter');
          done();
        });
      });
    });

    test('avoids setAttribute if data has not changed for namespace', function (done) {
      var setAttributeSpy;

      AFRAME.registerComponent('test', {
        schema: {
          counter: {default: 0},
          enabled: {default: false}
        }
      });

      el.setAttribute('bind__test', 'counter: foo.counter; enabled: foo.enabled');

      setAttributeSpy = this.sinon.spy(el, 'setAttribute');
      el.emit('fooColor', {color: 'orange'});
      setTimeout(() => {
        assert.equal(setAttributeSpy.getCalls().length, 0);
        done();
      });
    });

    test('binds vector', done => {
      el.setAttribute('bind__position', 'foo.position');
      el.emit('fooPosition', {position: {x: 1, y: 2, z: 3}});
      setTimeout(() => {
        assert.equal(el.getAttribute('position').x, 1);
        assert.equal(el.getAttribute('position').y, 2);
        assert.equal(el.getAttribute('position').z, 3);
        done();
      });
    });
  });
});
