/* global AFRAME */
var redux = require('redux');

var styleParse = AFRAME.utils.styleParser.parse;
var setComponentProperty = AFRAME.utils.entity.setComponentProperty;
var combineReducers = redux.combineReducers;
var createStore = redux.createStore;

if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.');
}

var REDUCERS = {};

/**
 * API for registering reducers.
 */
AFRAME.registerReducer = function (name, definition) {
  REDUCERS[name] = definition.reducer;
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

    // Combine reducers sourced from reducer components.
    this.reducer = combineReducers(data.reducers.map(function (reducerName) {
      return REDUCERS[reducerName];
    }));

    // Create store.
    this.store = createStore(this.reducer);
  }
});

/**
 * Redux component for A-Frame.
 */
AFRAME.registerComponent('redux', {
  schema: {
    default: {},
    parse: styleParse
  },

  init: function () {
    this.unsubscribe = null;
  },

  update: function () {
    var data = this.data;
    var el = this.el;
    var store = this.system.store;

    if (this.unsubscribe) { this.unsubscribe(); }

    // Subscribe to store and register handler to do data-binding to components.
    this.unsubscribe = store.subscribe(function handler () {
      var state = store.getState();
      Object.keys(data).forEach(function syncComponent (selector) {
        var propertyName = data[selector];
        setComponentProperty(el, propertyName, select(state, selector));
      });
    });
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
  selector.split('.').forEach(function (key) {
    value = store[key];
  });
  return value;
}
