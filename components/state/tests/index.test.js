/* global assert, setup, suite, test */
require('aframe');
require('../index.js');
var entityFactory = require('./helpers').entityFactory;

var initialState = {
  color: 'red',
  counter: 5,
  enabled: false,
  nested: {
    enabled: false,
    enabled2: false
  },
  position: {x: 0, y: 0, z: 0}
};

AFRAME.registerState({
  initialState: initialState,

  handlers: {
    fooAdd: (state, payload) => {
      state.counter += payload.number;
    },

    fooAddPropertyToNested: (state, payload) => {
      state.nested.item = payload.item;
    },

    fooDisable: (state, payload) => {
      state.enabled = false;
    },

    fooEnable: (state, payload) => {
      state.enabled = true;
    },

    fooEnableNested: (state, payload) => {
      state.nested.enabled = true;
    },

    fooEnableNested2: (state, payload) => {
      state.nested.enabled2 = true;
    },

    fooSubtract: (state, payload) => {
      state.counter -= payload.number;
    },

    fooColor: (state, payload) => {
      state.color = payload.color;
    },

    fooPosition: (state, payload) => {
      state.position.x = payload.position.x;
      state.position.y = payload.position.y;
      state.position.z = payload.position.z;
    }
  },

  computeState: function (state) {
    state.colorCounter = `${state.color}${state.counter}`;
  }
});

AFRAME.registerComponent('raycastable', {});

suite('state', function () {
  var el;
  var system;

  setup(function (done) {
    el = entityFactory();
    setTimeout(() => {
      if (el.sceneEl.hasLoaded) {
        system = el.sceneEl.systems.state;
        done();
        return;
      }
      el.sceneEl.addEventListener('loaded', () => {
        system = el.sceneEl.systems.state;
        done();
      });
    });
  });

  suite('last state', () => {
    test('initializes last state to initial state', () => {
      assert.shallowDeepEqual(system.lastState, initialState);
      assert.notOk(system.lastState === system.state);
    });

    test('updates last state', () => {
      el.emit('fooEnable');
      assert.ok(system.lastState.enabled);
      assert.notOk(system.lastState === system.state);
    });

    test('copies nested object values by value not reference', () => {
      el.emit('fooEnableNested');
      assert.notOk(system.lastState.nested === system.state.nested);
      assert.shallowDeepEqual(system.lastState.nested, system.state.nested);
    });

    test('clones object to last state if does not exist', done => {
      var obj = {foo: 'bar'};
      el.emit('fooAddPropertyToNested', {item: obj});
      setTimeout(() => {
        assert.equal(system.lastState.nested.item.foo, 'bar');
        assert.ok(system.lastState.nested.item !== system.state.nested.item);
        done();
      });
    });
  });

  test('runs computeState', done => {
    el.emit('fooColor', {color: 'red'});
    setTimeout(() => {
      el.emit('fooAdd', {number: 5});
      setTimeout(() => {
        assert.equal(el.sceneEl.systems.state.state.colorCounter, 'red10');
        done();
      });
    });
  });

  suite('bind', () => {
    test('binds single-property component', done => {
      el.setAttribute('bind', 'visible: enabled');
      assert.notOk(el.getAttribute('visible'));
      el.emit('fooEnable');
      setTimeout(() => {
        assert.ok(el.getAttribute('visible'));
        done();
      });
    });

    test('binds single-property component with !(not) operator', done => {
      el.setAttribute('bind', 'visible: !enabled');
      assert.ok(el.getAttribute('visible'));
      el.emit('fooEnable');
      setTimeout(() => {
        assert.notOk(el.getAttribute('visible'));
        done();
      });
    });

    test('binds single-property component with !!(bool) operator', () => {
      el.setAttribute('visible', false);
      el.setAttribute('bind', 'visible: !!enabled');
      assert.ok(el.getAttribute('visible'));
    });

    test('binds single-property component with namespace', done => {
      el.setAttribute('bind__visible', 'enabled');
      assert.notOk(el.getAttribute('visible'));
      el.emit('fooEnable');
      setTimeout(() => {
        assert.ok(el.getAttribute('visible'));
        done();
      });
    });

    test('binds single-property component with namespae with !(not)', done => {
      el.setAttribute('bind__visible', '!enabled');
      assert.ok(el.getAttribute('visible'));
      el.emit('fooEnable');
      setTimeout(() => {
        assert.notOk(el.getAttribute('visible'));
        done();
      });
    });

    test('binds single-property component with namespace and nested state', done => {
      el.setAttribute('bind__visible', 'nested.enabled');
      assert.notOk(el.getAttribute('visible'));
      el.emit('fooEnableNested');
      setTimeout(() => {
        assert.ok(el.getAttribute('visible'));
        done();
      });
    });

    test('binds single-property component with namespace/nested/!', done => {
      el.setAttribute('bind__visible', '!nested.enabled');
      assert.ok(el.getAttribute('visible'));
      el.emit('fooEnableNested');
      setTimeout(() => {
        assert.notOk(el.getAttribute('visible'));
        done();
      });
    });

    test('binds single-property component with namespace/nested/!!', done => {
      el.setAttribute('bind__visible', '!!nested.enabled');
      assert.notOk(el.getAttribute('visible'));
      el.emit('fooEnableNested');
      setTimeout(() => {
        assert.ok(el.getAttribute('visible'));
        done();
      });
    });

    test('binds single-property component with namespace and nested state 2', done => {
      el.setAttribute('bind__visible', 'nested.enabled2');
      assert.notOk(el.getAttribute('visible'));
      el.emit('fooEnableNested2');
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
      el.sceneEl.setAttribute('bind__test-system', 'counter: counter');
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
      el.setAttribute('bind', {'bar.barCounter': 'counter', 'baz.bazCounter': 'counter'});

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
      el.setAttribute('bind__bar', {'barCounter': 'counter', 'barEnabled': 'enabled'});

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
      el.setAttribute('bind__bar', {'barCounter': 'counter', 'barEnabled': 'enabled'});


      assert.equal(spy.getCalls().length, 2);
      assert.shallowDeepEqual(spy.getCalls()[1].args[1],
                              {barCounter: 5, barEnabled: false});
      delete AFRAME.components.bar;
    });

    test('binds non-component attribute', done => {
      el.setAttribute('bind', 'data-enabled: enabled');
      assert.equal(el.getAttribute('data-enabled'), 'false');
      el.emit('fooEnable');
      setTimeout(() => {
        assert.equal(el.getAttribute('data-enabled'), 'true');
        done();
      });
    });

    test('binds non-component attribute with namespace', done => {
      el.setAttribute('bind__data-enabled', 'enabled');
      assert.equal(el.getAttribute('data-enabled'), 'false');
      el.emit('fooEnable');
      setTimeout(() => {
        assert.equal(el.getAttribute('data-enabled'), 'true');
        done();
      });
    });

    test('avoids calling setAttribute if data has not changed', function (done) {
      var setAttributeSpy;
      el.setAttribute('bind', 'data-counter: counter; visible: enabled');
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

      el.setAttribute('bind__test', 'counter: counter; enabled: enabled');

      setAttributeSpy = this.sinon.spy(el, 'setAttribute');
      el.emit('fooColor', {color: 'orange'});
      setTimeout(() => {
        assert.equal(setAttributeSpy.getCalls().length, 0);
        done();
      });
    });

    test('binds vector', done => {
      el.setAttribute('bind__position', 'position');
      el.emit('fooPosition', {position: {x: 1, y: 2, z: 3}});
      setTimeout(() => {
        assert.equal(el.getAttribute('position').x, 1);
        assert.equal(el.getAttribute('position').y, 2);
        assert.equal(el.getAttribute('position').z, 3);
        done();
      });
    });
  });

  suite('bind-toggle', () => {
    test('toggles component', done => {
      el.setAttribute('bind-toggle__raycastable', 'enabled');
      assert.notOk('raycastable' in el.components);
      el.emit('fooEnable');
      setTimeout(() => {
        assert.ok('raycastable' in el.components);
        el.emit('fooDisable');
        setTimeout(() => {
          assert.notOk('raycastable' in el.components);
          done();
        });
      });
    });

    test('toggles component via nested state', done => {
      el.setAttribute('bind-toggle__raycastable', 'nested.enabled');
      assert.notOk('raycastable' in el.components);
      el.emit('fooEnableNested');
      setTimeout(() => {
        assert.ok('raycastable' in el.components);
        done();
      });
    });
  });
});
