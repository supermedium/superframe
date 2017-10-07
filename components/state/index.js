var Redux = require('redux');

var REDUCERS = {};  // Registered reducers.
var Reducers = {};  // Reducer instances.

/**
 * Select value from store.
 *
 * @param {object} state - State object.
 * @param {string} selector - Dot-delimited store keys (e.g., game.player.health).
 */
var select = (function () {
  var splitSelectors = {};
  return function (state, selector) {
    var i;
    var split;
    split = splitSelectors[selector] || selector.split('.');
    splitSelectors[selector] = split;
    for (i = 0; i < split.length; i++) {
      state = state[split[i]];
    }
    split.length = 0;
    return value;
  };
}

function createStore () {
  var reducers = {};  // Reducer functions.
  var reducerName;

  // Instantiate registered reducers.
  for (reducerName in REDUCERS) {
    Reducers[reducerName] = new REDUCERS[reducerName].Reducer();
    reducers[reducerName] = Reducers[reducerName].reducer;
  });

  // Create store
  return Redux.createStore(
    Redux.combineReducers(reducers),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  );
}
module.exports.createStore = createStore;

/**
 * Dispatch action to store.
 *
 * @param {string} actionName
 * @param {object} payload
 */
function dispatch (store, actionName, payload) {
  store.dispatch(Object.assign({
    type: actionName,
    toJSON: function () {
      // toJSON just for redux-devtools-extension to serialize DOM elements.
      var key;
      var serializedPayload = {};
      for (key in payload) {
        if (payload[key].tagName) {
          serializedPayload[key] = 'element#' + payload[key].id;
        } else {
          serializedPayload[key] = payload[key];
        }
      }
      serializedPayload.type = actionName;
      return serializedPayload;
    }
  }, payload));
}
module.exports.dispatch = dispatch;

/**
 * Proxy events to action dispatches so components can just bubble actions up as events.
 * Reducers register which actions they handle. Go through all of them and
 * add event listeners.
 */
function initEventProxies (el, store) {
  var actionName;
  var reducerName;
  var registeredActions = [];

  for (reducerName in Reducers) {
    // Use reducer's declared handlers to know what events to listen to.
    for (actionName in Reducers[reducerName].handlers) {
      // Only need to register one handler for each event.
      if (registeredActions.indexOf(actionName) !== -1) { return; }
      registeredActions.push(actionName);

      el.addEventListener(actionName, function dispatchActionFromEvent (evt) {
        var key;
        var payload = {};

        for (key in evt.detail) {
          if (key === 'target') { return; }
          payload[key] = evt.detail[key];
        }
        dispatch(store, actionName, payload);
      });
    });
  });
}

/**
 * Base reducer prototype.
 */
var Reducer = function () { /* no-op */ };
Reducer.prototype = {
  initialState: {},
  handlers: {}
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
  // Combine all handlers into one reducer function.
  NewReducer.prototype.reducer = function (state, payload) {
    // Call reducer.
    state = Object.assign({}, state || NewReducer.prototype.initialState);
    if (!definition.handlers[payload.type]) { return state; }

    // Remove metadata properties from payload, not relevant to reducer.
    var toJSON = payload.toJSON;
    var type = payload.type;
    delete payload.toJSON;
    delete payload.type;

    // Call reducer.
    var newState = definition.handlers[type].call(NewReducer.prototype, state, payload);

    // Re-add metadata properties.
    payload.toJSON = toJSON;
    payload.type = type;

    return newState;
  };

  REDUCERS[name] = {
    Reducer: NewReducer,
    initialState: NewReducer.prototype.initialState,
    handlers: NewReducer.prototype.handlers,
    reducer: NewReducer.prototype.reducer
  };
  return NewReducer;
};

/**
 * State system using Redux.
 */
AFRAME.registerSystem('state', {
  init: function () {
    var store = this.store = createStore();
    this.state = store.getState();
    store.subscribe(() => {
      this.state = store.getState();
      this.el.emit('statechanged');
    });
    initEventProxies(this.el, this.store);
  },

  getState: function () {
    return this.state;
  }
});

/**
 * Bind component property to a value in state.
 *
 * bind="geometry.width: car.width""
 * bind__material="color: enemy.color; opacity: enemy.opacity"
 * bind__visible="player.visible"
 */
AFRAME.registerComponent('bind', {
  schema: {
    default: {},
    parse: function (value) {
      // Parse style-like object.
      var data;
      var i;
      var properties;
      var pair;

      // Using setAttribute with object, no need to parse.
      if (value.constructor === Object) { return value; }

      // Using instanced ID as component namespace for single-property component,
      // nothing to separate.
      if (value.indexOf(':') === -1) { return value; }

      // Parse style-like object as keys to values.
      data = {};
      properties = value.split(';');
      for (i = 0; i < properties.length; i++) {
        pair = properties[i].trim().split(':');
        data[pair[0]] = pair[1];
      }
      return data;
    }
  },

  multiple: true,

  init: function () {
    this.unsubscribe = null;

    // Whether we are binding by namespace (e.g., bind__foo="prop1: true").
    this.isNamespacedBind = this.id && this.id in AFRAME.components &&
                            !AFRAME.components[this.id].isSingleProp;

    this.updateObj = {};
  },

  update: function () {
    var el = this.el;
    var self = this;
    var store;

    // Reset handler.
    if (this.unsubscribe) { this.unsubscribe(); }

    // Subscribe to store and register handler to do data-binding to components.
    store = el.sceneEl.systems.state.store;
    this.unsubscribe = store.subscribe(handler);
    handler();

    function handler () {
      // Update component with the state.
      var propertyName;
      var state = el.sceneEl.systems.state.state;
      var stateSelector;
      var value;

      if (self.isNamespacedBind) { clearObject(self.updateObj); }

      if (typeof self.data !== 'object') {
        AFRAME.utils.entity.setComponentProperty(el, self.id, select(state, self.data));
        return;
      }

      for (propertyName in self.data) {
        // Pointer to a value in the state (e.g., `player.health`).
        stateSelector = self.data[propertyName].trim();
        value = select(state, stateSelector);

        // Remove component if value is `undefined`.
        if (propertyName in AFRAME.components && value === undefined) {
          el.removeAttribute(propertyName);
          return;
        }

        // Set using dot-delimited property name.
        if (self.isNamespacedBind) {
          // Batch if doing namespaced bind.
          self.updateObj[propertyName] = value;
        } else {
          AFRAME.utils.entity.setComponentProperty(el, propertyName, value);
        }
      }

      // Batch if doing namespaced bind.
      if (self.isNamespacedBind) {
        el.setAttribute(self.id, self.updateObj);
      }
    }
  },

  remove: function () {
    if (this.unsubscribe) { this.unsubscribe(); }
  }
});

function clearObject (obj) {
  var key;
  for (key in obj) { obj[key] = undefined; }
}
