/* global assert, setup, suite, test */
require('aframe');
require('../src/index');
var array = require('../src/lib/array');
var lib = require('../src/lib/');
var elFactory = require('./helpers').elFactory;
var entityFactory = require('./helpers').entityFactory;

var initialState = {
  color: 'red',
  colors: ['red', 'orange', 'yellow'],
  counter: 5,
  difficulties: [],
  enabled: false,
  shoppingList: [
    {name: 'eggs', amount: 12},
    {name: 'milk', amount: 2}
  ],
  nested: {
    enabled: false,
    enabled2: false
  },
  position: {x: 0, y: 0, z: 0},
  initialNull: null,
  initialUndefined: undefined
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
    },

    colorAdd: (state) => {
      state.colors.push('green');
    },

    colorShift: (state) => {
      state.colors.splice(0, 1);
    },

    colorReorder: (state) => {
      state.colors.length = 0;
      state.colors.push('yellow');
      state.colors.push('red');
      state.colors.push('orange');
    },

    colorReorderRemove: (state) => {
      state.colors.length = 0;
      state.colors.push('yellow');
      state.colors.push('orange');
    },

    colorReorderAdd: (state) => {
      state.colors.length = 0;
      state.colors.push('yellow');
      state.colors.push('orange');
      state.colors.push('red');
      state.colors.push('blue');
      state.colors.push('green');
    },

    colorReplace: (state) => {
      state.colors.length = 0;
      state.colors.push('blue');
      state.colors.push('indigo');
      state.colors.push('violet');
    },

    difficultyOne: (state) => {
      state.difficulties.push('Expert');
    },

    difficultyTwo: (state) => {
      state.difficulties.length = 0;
      state.difficulties.push('Easy');
      state.difficulties.push('Normal');
      state.difficulties.push('Hard');
      state.difficulties.push('Expert');
    },

    shoppingListAdd: (state) => {
      state.shoppingList.push({name: 'bananas', amount: 6});
    },

    shoppingListRemove: (state) => {
      state.shoppingList.splice(0, 1);
    },

    shoppingListUpdate: (state, payload) => {
      state.shoppingList.find(item => item.name === payload.name).amount = payload.amount;
      state.shoppingList.__dirty = true;
    },

    shoppingListReplace: (state) => {
      state.shoppingList.length = 0;
      state.shoppingList.push({name: 'bread', amount: 1});
      state.shoppingList.push({name: 'cheese', amount: 2});
      state.shoppingList.push({name: 'corn', amount: 3});
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
    elFactory().then(_el => {
      el = _el;
      system = el.sceneEl.systems.state;
      done();
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
      assert.notOk(el.getAttribute('visible'));
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

    test('binds multiple component with double underscore in ID in namespace', done => {
      // Components.
      AFRAME.registerComponent('bar', {
        schema: {
          barEnabled: {default: false}
        },

        multiple: true,
      });

      // Bind.
      el.setAttribute('bind__bar__foo', 'barEnabled: enabled');

      setTimeout(() => {
        // Assert initial state bind values.
        assert.equal(el.getAttribute('bar__foo').barEnabled, false);

        // Dispatch action.
        el.emit('fooEnable');

        setTimeout(() => {
          assert.equal(el.getAttribute('bar__foo').barEnabled, true);
          delete AFRAME.components.bar;
          done();
        });
      });
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
        delete AFRAME.components.test;
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

    test('can be binded via mixin', done => {
      var mixin;
      AFRAME.registerComponent('test', {
        schema: {counter: {default: 0}}
      });

      mixin = document.createElement('a-mixin');
      mixin.setAttribute('id', 'bindMixin');
      mixin.setAttribute('bind__test', 'counter: counter');
      el.sceneEl.appendChild(mixin);

      setTimeout(() => {
        el.setAttribute('mixin', 'bindMixin');
        assert.equal(el.getAttribute('test').counter, 5);
        el.emit('fooAdd', {number: 10});
        assert.equal(el.getAttribute('test').counter, 15);
        delete AFRAME.components.test;
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

  suite('bind-for (naive)', () => {
    setup(() => {
      var template;
      template = document.createElement('template');
      template.setAttribute('id', 'shoppingItemTemplate');
      template.innerHTML = `
        <a-entity class="shoppingItem" text="value: {{ shoppingItem.name }}"
                  data-amount="{{ shoppingItem.amount }}"></a-entity>
      `;
      el.sceneEl.appendChild(template);

      template = document.createElement('template');
      template.setAttribute('id', 'colorTemplate');
      template.innerHTML = `
        <a-entity>
          <a-entity class="color" text="value: {{ color }}" data-color="{{ color }}"></a-entity>
        </a-entity>
      `;
      el.sceneEl.appendChild(template);
    });

    teardown(() => {
      while (el.children.length !== 0) {
        el.removeChild(el.children[0]);
      }
    });

    test('renders from list of objects', done => {
      el.setAttribute('bind-for', {
        for: 'shoppingItem',
        in: 'shoppingList',
        template: '#shoppingItemTemplate',
        key: 'name'
      });
      setTimeout(() => {
        assert.ok(el.children.length, 2);
        assert.equal(el.children[0].getAttribute('text').value, 'eggs');
        assert.equal(el.children[0].dataset.amount, 12);
        assert.equal(el.children[1].getAttribute('text').value, 'milk');
        assert.equal(el.children[1].dataset.amount, 2);
        done();
      }, 50);
    });

    test('renders from list of strings', done => {
      el.setAttribute('bind-for', {
        for: 'color',
        in: 'colors',
        template: '#colorTemplate'
      });
      setTimeout(() => {
        assert.equal(el.children.length, 3);
        assert.equal(el.children[0].getAttribute('data-bind-for-key'), '0');
        assert.equal(el.children[1].getAttribute('data-bind-for-key'), '1');
        assert.equal(el.children[2].getAttribute('data-bind-for-key'), '2');
        assert.equal(el.children[0].children[0].getAttribute('text').value, 'red');
        assert.equal(el.children[1].children[0].getAttribute('text').value, 'orange');
        assert.equal(el.children[2].children[0].getAttribute('text').value, 'yellow');
        assert.equal(el.children[0].children[0].dataset.color, 'red');
        assert.equal(el.children[1].children[0].dataset.color, 'orange');
        assert.equal(el.children[2].children[0].dataset.color, 'yellow');
        done();
      });
    });

    test('can add to list of strings', done => {
      el.setAttribute('bind-for', {
        for: 'color',
        in: 'colors',
        template: '#colorTemplate'
      });
      setTimeout(() => {
        assert.equal(el.children.length, 3);
        el.emit('colorAdd');
        setTimeout(() => {
          assert.equal(el.children.length, 4);
          done();
        });
      });
    });

    test('reset simple list of strings', done => {
      el.setAttribute('bind-for', {
        for: 'color',
        in: 'colors',
        template: '#colorTemplate'
      });
      setTimeout(() => {
        assert.equal(el.children.length, 3);
        el.emit('colorReplace');
        setTimeout(() => {
          assert.equal(el.children.length, 3);
          assert.equal(el.children[0].children[0].getAttribute('text').value, 'blue');
          assert.equal(el.children[1].children[0].getAttribute('text').value, 'indigo');
          assert.equal(el.children[2].children[0].getAttribute('text').value, 'violet');
          done();
        });
      });
    });

    test('can remove from list of strings', done => {
      el.setAttribute('bind-for', {
        for: 'color',
        in: 'colors',
        template: '#colorTemplate'
      });
      setTimeout(() => {
        assert.equal(el.children.length, 3);
        el.emit('colorShift');
        setTimeout(() => {
          assert.equal(el.children.length, 2, 'what');
          assert.equal(el.children[0].children[0].getAttribute('text').value, 'orange');
          assert.equal(el.children[1].children[0].getAttribute('text').value, 'yellow');
          el.emit('colorAdd');
          setTimeout(() => {
            assert.equal(el.children[2].children[0].getAttribute('text').value, 'green');
            done();
          });
        });
      });
    });

    test('can reorder list of strings', done => {
      el.setAttribute('bind-for', {
        for: 'color',
        in: 'colors',
        template: '#colorTemplate'
      });
      setTimeout(() => {
        assert.equal(el.children.length, 3);
        assert.equal(el.children[0].dataset.bindForKey, '0');
        assert.equal(el.children[0].dataset.bindForValue, 'red');
        assert.equal(el.children[1].dataset.bindForKey, '1');
        assert.equal(el.children[1].dataset.bindForValue, 'orange');
        assert.equal(el.children[2].dataset.bindForKey, '2');
        assert.equal(el.children[2].dataset.bindForValue, 'yellow');
        el.emit('colorReorder');
        setTimeout(() => {
          assert.equal(el.children.length, 3);
          assert.equal(el.children[0].dataset.bindForKey, '1');
          assert.equal(el.children[0].dataset.bindForValue, 'red');
          assert.equal(el.children[1].dataset.bindForKey, '2');
          assert.equal(el.children[1].dataset.bindForValue, 'orange');
          assert.equal(el.children[2].dataset.bindForKey, '0');
          assert.equal(el.children[2].dataset.bindForValue, 'yellow');
          done();
        });
      });
    });

    test('can reorder list of strings with removals', done => {
      el.setAttribute('bind-for', {
        for: 'color',
        in: 'colors',
        template: '#colorTemplate'
      });
      setTimeout(() => {
        assert.equal(el.children.length, 3);
        el.emit('colorReorderRemove');
        setTimeout(() => {
          assert.equal(el.children.length, 2);
          done();
        });
      });
    });

    test('can reorder list of strings with additions', done => {
      el.setAttribute('bind-for', {
        for: 'color',
        in: 'colors',
        template: '#colorTemplate'
      });
      setTimeout(() => {
        assert.equal(el.children.length, 3);
        el.emit('colorReorderAdd');
        setTimeout(() => {
          assert.equal(el.children.length, 5);
          done();
        });
      });
    });

    test('can reorder list of strings (2)', done => {
      var template = document.createElement('template');
      template.innerHTML = '<a-entity data-difficulty="{{ difficulty }}"></a-entity>';
      el.appendChild(template);
      setTimeout(() => {
        el.setAttribute('bind-for', {
          for: 'difficulty',
          in: 'difficulties'
        });
        setTimeout(() => {
          el.sceneEl.emit('difficultyOne');
          setTimeout(() => {
            assert.equal(el.children.length, 2);
            el.sceneEl.emit('difficultyTwo');
            setTimeout(() => {
              assert.equal(el.children.length, 5);
              assert.ok(el.querySelector('[data-difficulty="Easy"][data-bind-for-key="0"]'), 'e');
              assert.ok(el.querySelector('[data-difficulty="Normal"][data-bind-for-key="1"]'), 'n');
              assert.ok(el.querySelector('[data-difficulty="Hard"][data-bind-for-key="2"]'), 'h');
              assert.ok(el.querySelector('[data-difficulty="Expert"][data-bind-for-key="3"]'), 'ex');
              done();
            });
          });
        });
      });
    });

    test('renders added list item', done => {
      el.setAttribute('bind-for', {
        for: 'shoppingItem',
        in: 'shoppingList',
        template: '#shoppingItemTemplate',
        key: 'name'
      });
      setTimeout(() => {
        el.sceneEl.emit('shoppingListAdd');
        setTimeout(() => {
          assert.ok(el.children.length, 3);
          assert.equal(el.children[2].getAttribute('text').value, 'bananas');
          assert.equal(el.children[2].dataset.amount, 6);
          done();
        });
      });
    });

    test('removes items', done => {
      el.setAttribute('bind-for', {
        for: 'shoppingItem',
        in: 'shoppingList',
        template: '#shoppingItemTemplate',
        key: 'name'
      });
      el.sceneEl.emit('shoppingListRemove');
      setTimeout(() => {
        assert.equal(el.children.length, 1);
        assert.equal(el.children[0].getAttribute('text').value, 'milk');
        done();
      });
    });
  });

  suite('bind-for (in place)', () => {
    setup(() => {
      var template;
      template = document.createElement('template');
      template.setAttribute('id', 'shoppingItemTemplate');
      template.innerHTML = `
        <a-entity class="shoppingItem"
                  bind-item__text="value: item.name"
                  bind-item__data-amount="item.amount"></a-entity>
      `;
      el.sceneEl.appendChild(template);

      template = document.createElement('template');
      template.setAttribute('id', 'shoppingItemTemplate2');
      template.innerHTML = `
        <a-entity class="shoppingItem"
                  bind-item__text="value: item.amount"
                  bind-item__data-type="item.name"></a-entity>
      `;
      el.sceneEl.appendChild(template);

      template = document.createElement('template');
      template.setAttribute('id', 'colorTemplate');
      template.innerHTML = `
        <a-entity>
          <a-entity class="color" bind-item__text="value: item" bind-item__data-color="item"></a-entity>
        </a-entity>
      `;
      el.sceneEl.appendChild(template);
    });

    teardown(() => {
      while (el.children.length !== 0) {
        el.removeChild(el.children[0]);
      }
    });

    test('renders from list of objects (in place)', done => {
      el.setAttribute('bind-for', {
        for: 'item',
        in: 'shoppingList',
        template: '#shoppingItemTemplate',
        key: 'name',
        updateInPlace: true
      });
      setTimeout(() => {
        assert.ok(el.children.length, 2);
        assert.equal(el.children[0].getAttribute('text').value, 'eggs');
        assert.equal(el.children[0].dataset.amount, 12);
        assert.equal(el.children[1].getAttribute('text').value, 'milk');
        assert.equal(el.children[1].dataset.amount, 2);
        done();
      }, 50);
    });

    test('updates in place (in place)', done => {
      el.setAttribute('bind-for', {
        for: 'item',
        in: 'shoppingList',
        template: '#shoppingItemTemplate',
        key: 'name',
        updateInPlace: true
      });
      setTimeout(() => {
        assert.ok(el.children.length, 2);
        el.emit('shoppingListReplace');
        setTimeout(() => {
          assert.ok(el.children.length, 3);
          assert.equal(el.children[0].getAttribute('data-bind-for-key'), 'bread');
          assert.equal(el.children[0].getAttribute('data-bind-for-active'), 'true');;
          assert.equal(el.children[0].getAttribute('text').value, 'bread');
          assert.equal(el.children[0].dataset.amount, 1);
          assert.ok(el.children[0].isPlaying);

          assert.equal(el.children[1].getAttribute('data-bind-for-key'), 'cheese');
          assert.equal(el.children[1].getAttribute('data-bind-for-active'), 'true');;
          assert.equal(el.children[1].getAttribute('text').value, 'cheese');
          assert.equal(el.children[1].dataset.amount, 2);
          assert.ok(el.children[1].isPlaying);

          assert.equal(el.children[2].getAttribute('data-bind-for-key'), 'corn');
          assert.equal(el.children[2].getAttribute('data-bind-for-active'), 'true');;
          assert.equal(el.children[2].getAttribute('text').value, 'corn');
          assert.equal(el.children[2].dataset.amount, 3);
          assert.ok(el.children[2].isPlaying);
          done();
        }, 50);
      }, 50);
    });

    test('renders from list of strings (in place)', done => {
      el.setAttribute('bind-for', {
        for: 'item',
        in: 'colors',
        template: '#colorTemplate',
        updateInPlace: true
      });
      setTimeout(() => {
        assert.equal(el.children.length, 3);
        assert.equal(el.children[0].getAttribute('data-bind-for-key'), '0');
        assert.equal(el.children[1].getAttribute('data-bind-for-key'), '1');
        assert.equal(el.children[2].getAttribute('data-bind-for-key'), '2');
        assert.equal(el.children[0].children[0].getAttribute('text').value, 'red');
        assert.equal(el.children[1].children[0].getAttribute('text').value, 'orange');
        assert.equal(el.children[2].children[0].getAttribute('text').value, 'yellow');
        assert.equal(el.children[0].children[0].dataset.color, 'red');
        assert.equal(el.children[1].children[0].dataset.color, 'orange');
        assert.equal(el.children[2].children[0].dataset.color, 'yellow');
        done();
      });
    });

    test('can add to list of strings (in place)', done => {
      el.setAttribute('bind-for', {
        for: 'item',
        in: 'colors',
        template: '#colorTemplate',
        updateInPlace: true
      });
      setTimeout(() => {
        assert.equal(el.children.length, 3);
        el.emit('colorAdd');
        setTimeout(() => {
          assert.equal(el.children.length, 4);
          done();
        });
      });
    });

    test('reset simple list of strings (in place)', done => {
      el.setAttribute('bind-for', {
        for: 'item',
        in: 'colors',
        template: '#colorTemplate',
        updateInPlace: true
      });
      setTimeout(() => {
        assert.equal(el.children.length, 3);
        el.emit('colorReplace');
        setTimeout(() => {
          assert.equal(el.children.length, 3);
          assert.equal(el.children[0].children[0].getAttribute('text').value, 'blue');
          assert.equal(el.children[1].children[0].getAttribute('text').value, 'indigo');
          assert.equal(el.children[2].children[0].getAttribute('text').value, 'violet');
          done();
        });
      });
    });

    test('can remove from list of strings (in place)', done => {
      el.setAttribute('bind-for', {
        for: 'item',
        in: 'colors',
        template: '#colorTemplate',
        updateInPlace: true
      });
      setTimeout(() => {
        assert.equal(el.children.length, 3);
        el.emit('colorShift');
        setTimeout(() => {
          assert.equal(el.children.length, 3);
          assert.equal(el.children[0].getAttribute('data-bind-for-active'), 'false');
          assert.equal(el.children[1].children[0].getAttribute('text').value, 'orange');
          assert.equal(el.children[2].children[0].getAttribute('text').value, 'yellow');
          el.emit('colorAdd');
          setTimeout(() => {
            assert.equal(el.children[0].getAttribute('data-bind-for-active'), 'true');
            assert.equal(el.children[0].children[0].getAttribute('text').value, 'green');
            done();
          });
        });
      });
    });

    test('can reorder list of strings (in place)', done => {
      el.setAttribute('bind-for', {
        for: 'item',
        in: 'colors',
        template: '#colorTemplate',
        updateInPlace: true
      });
      setTimeout(() => {
        assert.equal(el.children.length, 3);
        assert.equal(el.children[0].dataset.bindForKey, '0');
        assert.equal(el.children[0].dataset.bindForValue, 'red');
        assert.equal(el.children[1].dataset.bindForKey, '1');
        assert.equal(el.children[1].dataset.bindForValue, 'orange');
        assert.equal(el.children[2].dataset.bindForKey, '2');
        assert.equal(el.children[2].dataset.bindForValue, 'yellow');
        el.emit('colorReorder');
        setTimeout(() => {
          assert.equal(el.children.length, 3);
          assert.equal(el.children[0].dataset.bindForKey, '1', 'After reorder',);
          assert.equal(el.children[0].dataset.bindForValue, 'red');
          assert.equal(el.children[1].dataset.bindForKey, '2');
          assert.equal(el.children[1].dataset.bindForValue, 'orange');
          assert.equal(el.children[2].dataset.bindForKey, '0');
          assert.equal(el.children[2].dataset.bindForValue, 'yellow');
          done();
        });
      });
    });

    test('can reorder list of strings with removals (in place)', done => {
      el.setAttribute('bind-for', {
        for: 'item',
        in: 'colors',
        template: '#colorTemplate',
        updateInPlace: true
      });
      setTimeout(() => {
        assert.equal(el.children.length, 3);
        el.emit('colorReorderRemove');
        setTimeout(() => {
          assert.equal(el.children.length, 3);
          assert.equal(el.querySelectorAll('[data-bind-for-active="false"]').length, 1);
          done();
        });
      });
    });

    test('can reorder list of strings with additions (in place)', done => {
      el.setAttribute('bind-for', {
        for: 'item',
        in: 'colors',
        template: '#colorTemplate',
        updateInPlace: true
      });
      setTimeout(() => {
        assert.equal(el.children.length, 3);
        el.emit('colorReorderAdd');
        setTimeout(() => {
          assert.equal(el.children.length, 5);
          done();
        });
      });
    });

    test('can reorder list of strings (2) (in place)', done => {
      var template = document.createElement('template');
      template.innerHTML = '<a-entity data-difficulty="{{ difficulty }}"></a-entity>';
      el.appendChild(template);
      setTimeout(() => {
        el.setAttribute('bind-for', {
          for: 'difficulty',
          in: 'difficulties',
          updateInPlace: true
        });
        setTimeout(() => {
          el.sceneEl.emit('difficultyOne');
          setTimeout(() => {
            assert.equal(el.children.length, 2);
            el.sceneEl.emit('difficultyTwo');
            setTimeout(() => {
              assert.equal(el.children.length, 5);
              assert.ok(el.querySelector('[data-difficulty="Easy"][data-bind-for-key="0"]'), 'e');
              assert.ok(el.querySelector('[data-difficulty="Normal"][data-bind-for-key="1"]'), 'n');
              assert.ok(el.querySelector('[data-difficulty="Hard"][data-bind-for-key="2"]'), 'h');
              assert.ok(el.querySelector('[data-difficulty="Expert"][data-bind-for-key="3"]'), 'ex');
              done();
            });
          });
        });
      });
    });

    test('renders added list item (in place)', done => {
      el.setAttribute('bind-for', {
        for: 'item',
        in: 'shoppingList',
        template: '#shoppingItemTemplate',
        key: 'name',
        updateInPlace: true
      });
      setTimeout(() => {
        el.sceneEl.emit('shoppingListAdd');
        setTimeout(() => {
          assert.ok(el.children.length, 3);
          assert.equal(el.children[2].getAttribute('text').value, 'bananas');
          assert.equal(el.children[2].dataset.amount, 6);
          done();
        });
      });
    });

    test('removes items (in place)', done => {
      el.setAttribute('bind-for', {
        for: 'item',
        in: 'shoppingList',
        template: '#shoppingItemTemplate',
        key: 'name',
        updateInPlace: true
      });

      assert.equal(el.children[0].getAttribute('data-bind-for-active'), 'true');
      assert.equal(el.children[1].getAttribute('data-bind-for-active'), 'true');

      setTimeout(() => {
        el.sceneEl.emit('shoppingListRemove');

        setTimeout(() => {
          assert.equal(el.children.length, 2);

          const inactive = el.querySelector('[data-bind-for-active="false"]');
          assert.ok(!inactive.isPlaying);

          const active = el.children[0] === inactive ? el.children[1] : el.children[0];
          assert.equal(active.getAttribute('data-bind-for-active'), 'true');
          assert.equal(active.getAttribute('text').value, 'milk');

          done();
        });
      });
    });

    test('can bind to item (in place)', done => {
      el.setAttribute('bind-for', {
        for: 'item',
        in: 'shoppingList',
        template: '#shoppingItemTemplate2',
        key: 'name',
        updateInPlace: true
      });
      setTimeout(() => {
        var milkEl;
        milkEl = el.querySelector('[data-bind-for-key="milk"]');
        assert.equal(milkEl.getAttribute('text').value, '2');
        el.sceneEl.emit('shoppingListUpdate', {name: 'milk', amount: 20});
        setTimeout(() => {
          assert.equal(milkEl.getAttribute('text').value, '20');
          done();
        });
      });
    });

    test('can initialize pool (in place)', done => {
      const template = document.createElement('template');
      template.setAttribute('id', 'difficultyTemplate');
      template.innerHTML = '<a-entity class="difficulty" bind-item__text="value: item"></a-entity>';
      el.sceneEl.appendChild(template);

      setTimeout(() => {
        el.setAttribute('bind-for', {
          for: 'item',
          in: 'difficulties',
          template: '#difficultyTemplate',
          updateInPlace: true,
          pool: 3
        });

        setTimeout(() => {
          assert.equal(el.querySelectorAll('[data-bind-for-active="false"]').length, 3);
          el.sceneEl.emit('difficultyTwo');

          setTimeout(() => {
            assert.equal(el.querySelectorAll('[data-bind-for-active="true"]').length, 4);
            assert.ok(el.querySelector('[data-bind-for-value="Easy"]'));
            assert.ok(el.querySelector('[data-bind-for-value="Normal"]'));
            assert.ok(el.querySelector('[data-bind-for-value="Hard"]'));
            assert.ok(el.querySelector('[data-bind-for-value="Expert"]'));
            done();
          });
        });
      });
    });

    test('can render list with delay (in place)', done => {
      const template = document.createElement('template');
      template.setAttribute('id', 'difficultyTemplate');
      template.innerHTML = '<a-entity class="difficulty" bind-item__text="value: item"></a-entity>';
      el.sceneEl.appendChild(template);

      setTimeout(() => {
        el.setAttribute('bind-for', {
          for: 'item',
          in: 'difficulties',
          template: '#difficultyTemplate',
          updateInPlace: true,
          pool: 3,
          delay: 2
        });

        setTimeout(() => {
          assert.equal(el.querySelectorAll('[data-bind-for-active="false"]').length, 3);
          el.sceneEl.emit('difficultyTwo');

          setTimeout(() => {
            assert.equal(el.querySelectorAll('[data-bind-for-active="true"]').length, 4);
            assert.ok(el.querySelector('[data-bind-for-value="Easy"]'));
            assert.ok(el.querySelector('[data-bind-for-value="Normal"]'));
            assert.ok(el.querySelector('[data-bind-for-value="Hard"]'));
            assert.ok(el.querySelector('[data-bind-for-value="Expert"]'));
            done();
          }, 50);
        }, 10);
      });
    });
  });

  suite('select', () => {
    test('grabs value', () => {
      assert.equal(system.select({foo: 5}, 'foo'), 5);
      assert.equal(system.select({foo: {bar: 'red'}}, 'foo.bar'), 'red');
    });

    test('handles not', () => {
      assert.equal(system.select({foo: false}, 'foo'), false);
      assert.equal(system.select({foo: false}, '!foo'), true);
      assert.equal(system.select({foo: false}, '!!foo'), false);
      assert.equal(system.select({foo: 'red'}, '!foo'), false);
      assert.equal(system.select({foo: 'red'}, '!!foo'), true);
    });

    test('handles or', () => {
      assert.equal(system.select({foo: false, bar: false}, 'foo || bar'), false);
      assert.equal(system.select({foo: false, bar: true}, 'foo || bar'), true);
      assert.equal(system.select({foo: false, bar: true}, 'bar || foo'), true);
      assert.equal(system.select({foo: true, bar: false}, 'bar || foo'), true);
      assert.equal(system.select({foo: true, bar: false, qux: false}, 'qux || bar || foo'), true);
      assert.equal(system.select({foo: false, bar: {qux: true}}, 'bar.qux || foo'), true);
    });

    test('handles and', () => {
      assert.equal(system.select({foo: false, bar: false}, 'foo && bar'), false);
      assert.equal(system.select({foo: false, bar: true}, 'foo && bar'), false);
      assert.equal(system.select({foo: false, bar: true}, 'bar && foo'), false);
      assert.equal(system.select({foo: true, bar: true}, 'bar && foo'), true);
      assert.equal(system.select({foo: true, bar: true}, 'foo && bar'), true);
      assert.equal(system.select({foo: true, bar: {qux: true}}, 'bar.qux && foo'), true);
      assert.equal(system.select({foo: true, bar: true, qux: true}, 'qux && bar && foo'), true);
      assert.equal(system.select({foo: true, bar: {qux: false}}, 'bar.qux && foo'), false);
    });

    test('handles comparisons', () => {
      assert.equal(system.select({color: 'red'}, "color == 'red'"), true);
      assert.equal(system.select({color: 'red'}, "color === 'red'"), true);
      assert.equal(system.select({color: 'red'}, "color != 'blue'"), true);
      assert.equal(system.select({color: 'red'}, "color !== 'blue'"), true);
      assert.equal(system.select({color: 'red'}, "color == 'blue'"), false);
      assert.equal(system.select({color: 'red'}, "color === 'red' || color === 'blue'"), true);
      assert.equal(system.select({color: 'red', enabled: false}, "!enabled || color === 'blue'"), true);
      assert.strictEqual(system.select({color: 'red'}, "!color || color === 'blue'"), false);
      assert.strictEqual(system.select({color: 'red'}, "!color || color === 'red'"), true);
    });
  });

  test('keysToWatch', () => {
    el.setAttribute('bind__visible', "foo");
    assert.shallowDeepEqual(el.components['bind__visible'].keysToWatch, ['foo']);

    el.setAttribute('bind__foo', "!foo || foo === 'foo' && bar !== 'bar'");
    assert.shallowDeepEqual(
      el.components['bind__foo'].keysToWatch,
      ['foo', 'bar']);
  });

  suite('bind-item', () => {
    setup(done => {
      const template = document.createElement('template');
      template.setAttribute('id', 'shoppingItemTemplate');
      template.innerHTML = `<a-entity></a-entity>`;
      el.sceneEl.appendChild(template);
      el.setAttribute('bind-for', {
        for: 'item',
        in: 'shoppingList',
        key: 'name',
        updateInPlace: true,
        template: '#shoppingItemTemplate'
      });

      const itemEl = document.createElement('a-entity');
      itemEl.setAttribute('data-bind-for-key', '');
      el.appendChild(itemEl);

      const childEl = document.createElement('a-entity');
      itemEl.appendChild(childEl);
      el = childEl;
      setTimeout(() => { done(); });
    });

    test('handles comparisons', () => {
      el.sceneEl.systems.state.state.activeItem = 'eggs';
      el.setAttribute('data-bind-for-key', 'eggs');
      el.setAttribute('bind-item__visible', 'activeItem !== item.name');
      assert.equal(el.components['bind-item__visible'].select(
        {name: 'eggs'}, 'activeItem !== item.name'), false);
      assert.equal(el.components['bind-item__visible'].select(
        {name: 'eggs'}, 'activeItem === item.name'), true);
    });

    test('parses multi-prop', () => {
      var propertyMap;

      el.setAttribute('bind-item__material', 'color: item.color; opacity: item.values.opacity');
      propertyMap = el.components['bind-item__material'].propertyMap;
      assert.equal(propertyMap['material.color'], 'item.color');
      assert.equal(propertyMap['material.opacity'], 'item.values.opacity');

      el.setAttribute('bind-item__text', 'value: foo.bar !== bar.foo');
      propertyMap = el.components['bind-item__text'].propertyMap;
      assert.equal(propertyMap['text.value'], 'foo.bar !== bar.foo');
    });

    test('parses data-attribute', () => {
      el.setAttribute('bind-item__data-value', 'item.foo.bar.baz');
      const propertyMap = el.components['bind-item__data-value'].propertyMap;
      assert.equal(propertyMap['data-value'], 'item.foo.bar.baz');
    });
  });

  test('renderTemplate', () => {
    var rendered;

    rendered = system.renderTemplate('<a-entity foo="foo: {{ value }}"></a-entity>', {
      value: 'red'
    }, true);
    assert.equal(rendered, '<a-entity foo="foo: red"></a-entity>');
  });
});

suite('array', function () {
  test('wraps array to set __dirty', () => {
    var arr = [];
    assert.equal(arr.__dirty, undefined);
    arr.push(0);
    assert.equal(arr.__dirty, undefined);
    array.wrapArray(arr);
    arr.push(1);
    assert.equal(arr.__dirty, true);
    assert.equal(arr.length, 2);
  });
});

suite('generateExpression', function () {
  test('generates with basic selector', () => {
    assert.equal(lib.generateExpression('foo'), 'state["foo"]');
    assert.equal(lib.generateExpression('foo.bar'), 'state["foo"]["bar"]');
    assert.equal(lib.generateExpression('foo.bar.baz'), 'state["foo"]["bar"]["baz"]');
    assert.equal(lib.generateExpression('f1.f_2.f-3'), 'state["f1"]["f_2"]["f-3"]');
  });

  test('generates with ! and !!', () => {
    assert.equal(lib.generateExpression('!foo'), '!state["foo"]');
    assert.equal(lib.generateExpression('!!foo.bar'), '!!state["foo"]["bar"]');
    assert.equal(lib.generateExpression('!foo.bar.baz'), '!state["foo"]["bar"]["baz"]');
  });

  test('generates with booleans', () => {
    assert.equal(lib.generateExpression('foo || bar'), 'state["foo"] || state["bar"]');
    assert.equal(lib.generateExpression('foo && bar'), 'state["foo"] && state["bar"]');
    assert.equal(lib.generateExpression('foo.bar || qux.qaz'),
                 'state["foo"]["bar"] || state["qux"]["qaz"]');
  });

  test('generates with comparisons', () => {
    assert.equal(lib.generateExpression('foo === bar'), 'state["foo"] === state["bar"]');
    assert.equal(lib.generateExpression('foo.bar === qux.qaz'),
                 'state["foo"]["bar"] === state["qux"]["qaz"]');
  });

  test('generates with literal comparison', () => {
    assert.equal(lib.generateExpression('foo > 0'), 'state["foo"] > 0');
    assert.equal(lib.generateExpression('foo === 5'), 'state["foo"] === 5');
    assert.equal(lib.generateExpression('foo === "bar"'), 'state["foo"] === "bar"');
  });

  test('generates with ternaries', () => {
    assert.equal(lib.generateExpression('foo ? bar : "qaz"'),
                 'state["foo"] ? state["bar"] : "qaz"');
  });

  test('generates with length', () => {
    assert.equal(lib.generateExpression('a.length > 0'), 'state["a"]["length"] > 0');
  });

  test('generates with strings', () => {
    assert.equal(lib.generateExpression("'foo' + bar + 'qux'"), `'foo' + state["bar"] + 'qux'`);
  });

  test('generates with comparision and double null', () => {
    assert.equal(lib.generateExpression("a || b || c && !!d.length"), `state["a"] || state["b"] || state["c"] && !!state["d"]["length"]`);
  });

  test('preserves item selector', () => {
    assert.equal(lib.generateExpression('item'), 'item');
    assert.equal(lib.generateExpression('item.id'), 'item["id"]');
    assert.equal(lib.generateExpression('item.id + item.bar'), 'item["id"] + item["bar"]');
  });

  test('preserves booleans', () => {
    assert.equal(lib.generateExpression('true'), 'true');
    assert.equal(lib.generateExpression('false'), 'false');
    assert.equal(lib.generateExpression('a && true'), 'state["a"] && true');
    assert.equal(lib.generateExpression('a && true || false'), 'state["a"] && true || false');
  });

  test('preserves string whitespace', () => {
    assert.equal(lib.generateExpression('foo + "a b c"'), 'state["foo"] + "a b c"');
  });

  test('handles boolean with parens', () => {
    assert.equal(lib.generateExpression(
      '(a || b) && (c || d)'),
      '(state["a"] || state["b"]) && (state["c"] || state["d"])');
  });

  suite('parseKeysToWatch', () => {
    test('parses', () => {
      assert.shallowDeepEqual(
        lib.parseKeysToWatch([], 'foo'),
        ['foo']);
    });

    test('parses with boolean operators', () => {
      assert.shallowDeepEqual(
        lib.parseKeysToWatch([], 'foo && bar || baz'),
        ['foo', 'bar', 'baz']);
    });

    test('parses with parens', () => {
      assert.shallowDeepEqual(
        lib.parseKeysToWatch([], '(foo && bar) || (baz && qux)'),
        ['foo', 'bar', 'baz', 'qux']);
    });

    test('parses with ternary', () => {
      assert.shallowDeepEqual(
        lib.parseKeysToWatch([], `(foo && bar) ? '5' : '10'`),
        ['foo', 'bar']);
    });

    test('parses with not', () => {
      assert.shallowDeepEqual(
        lib.parseKeysToWatch([], `!foo || !!bar`),
        ['foo', 'bar']);
    });
  });
});
