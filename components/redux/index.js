/* global AFRAME */
var redux = require('redux');

var setComponentProperty = AFRAME.utils.entity.setComponentProperty;
var combineReducers = redux.combineReducers;
var createStore = redux.createStore;

if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.');
}

// All reducers.
var REDUCERS = {};

/**
 * Base reducer prototype.
 */
var Reducer = function () { };
Reducer.prototype = {
  actions: {},
  initialState: {},
  reducer: function (state, action) {
    return state || this.initialState;
  }
};

/**
 * API for registering reducers.
 */
AFRAME.registerReducer = function (name, definition) {
  var NewReducer;
  var proto;

  if (REDUCERS[name]) {
    throw new Error('The reducer `' + name + '` has been already registered. ' +
                    'Check that you are not loading two versions of the same reducer ' +
                    'or two different reducers of the same name.');
  }

  // Format definition object to prototype object.
  proto = {};
  Object.keys(definition).forEach(function convertToPrototype (key) {
    proto[key] = {
      value: definition[key],
      writable: true
    };
  });

  // Extend base prototype.
  NewReducer = function () { Reducer.call(this); };
  NewReducer.prototype = Object.create(Reducer.prototype, proto);
  NewReducer.prototype.name = name;
  NewReducer.prototype.constructor = NewReducer;

  // Wrap reducer to bind `this` to prototype. Redux would bind `window`.
  NewReducer.prototype.reducer = function (state, action) {
    return definition.reducer.call(NewReducer.prototype, state, action);
  };

  REDUCERS[name] = {
    Reducer: NewReducer,
    actions: NewReducer.prototype.actions,
    initialState: NewReducer.prototype.initialState,
    reducer: NewReducer.prototype.reducer
  };
  return NewReducer;
};

/**
 * Redux system for A-Frame.
 */
AFRAME.registerSystem('redux', {
  schema: {
    reducers: {type: 'array'}
  },

  init: function () {
    var data = this.data;
    var el = this.sceneEl;
    var reducers = {};

    // Combine reducers sourced from reducer components.
    data.reducers.forEach(function addReducer (reducerName) {
      reducers[reducerName] = new REDUCERS[reducerName].Reducer().reducer;
    });
    this.reducer = combineReducers(reducers);

    // Create store.
    this.store = createStore(this.reducer);
  }
});

/**
 * Bind Redux state to a component property.
 */
AFRAME.registerComponent('redux-bind', {
  schema: {
    default: {},
    parse: function (value) {
      var data;
      var properties;

      if (value.constructor === Object) { return value; }

      data = {};
      properties = value.split(';');
      properties.forEach(function parsePairs (pairStr) {
        var pair = pairStr.trim().split(':');
        data[pair[0]] = pair[1];
      });
      return data;
    }
  },

  init: function () {
    this.unsubscribe = null;
  },

  update: function () {
    var data = this.data;
    var el = this.el;
    var store;

    // Reset handler.
    if (this.unsubscribe) { this.unsubscribe(); }

    // Subscribe to store and register handler to do data-binding to components.
    store = el.sceneEl.systems.redux.store;
    this.unsubscribe = store.subscribe(handler);
    handler();

    function handler () {
      var state = store.getState();
      Object.keys(data).forEach(function syncComponent (stateSelector) {
        var propertyName = data[stateSelector].trim();
        setComponentProperty(el, propertyName, select(state, stateSelector));
      });
    }
  },

  remove: function () {
    if (this.unsubscribe) { this.unsubscribe(); }
  }
});

/**
 * Select value from store.
 *
 * @param {object} state - Redux store state.
 * @param {string} selector - Dot-delimited store keys (e.g., game.player.health).
 */
function select (state, selector) {
  var value = state;
  selector.split('.').forEach(function dig (key) {
    value = value[key];
  });
  return value.toString();
}
