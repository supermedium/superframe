/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

// Singleton state definition.
var State = {
  initialState: {},
  handlers: {},
  computeState: function computeState() {/* no-op */}
};

AFRAME.registerState = function (definition) {
  AFRAME.utils.extend(State, definition);
};

AFRAME.registerSystem('state', {
  init: function init() {
    this.diff = {};
    this.lastState = {};
    this.state = AFRAME.utils.clone(State.initialState);
    this.subscriptions = [];
    this.initEventHandlers();
  },

  dispatch: function dispatch(actionName, payload) {
    var i;
    var subscription;

    // Store last state.
    AFRAME.utils.extendDeep(this.lastState, this.state);

    // Calculate new state.
    State.handlers[actionName](this.state, payload);

    // Post-compute.
    State.computeState(this.state);

    // Get a diff to optimize bind updates.
    AFRAME.utils.diff(this.lastState, this.state, this.diff);

    // Notify subscriptions / binders.
    for (i = 0; i < this.subscriptions.length; i++) {
      this.subscriptions[i](this.state, this.diff, actionName, payload);
    }
  },

  subscribe: function subscribe(fn) {
    this.subscriptions.push(fn);
  },

  unsubscribe: function unsubscribe(fn) {
    this.subscriptions.splice(this.subscriptions.indexOf(fn), 1);
  },

  /**
   * Proxy events to action dispatches so components can just bubble actions up as events.
   * Handlers define which actions they handle. Go through all and add event listeners.
   */
  initEventHandlers: function initEventHandlers() {
    var actionName;
    var registeredActions = [];
    var self = this;

    registerListener = registerListener.bind(this);

    // Use declared handlers to know what events to listen to.
    for (actionName in State.handlers) {
      actionNameClosure = actionName;
      // Only need to register one handler for each event.
      if (registeredActions.indexOf(actionName) !== -1) {
        continue;
      }
      registeredActions.push(actionName);
      registerListener(actionName);
    }

    function registerListener(actionName) {
      var _this = this;

      this.el.addEventListener(actionName, function (evt) {
        _this.dispatch(actionName, evt.detail);
      });
    }
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
    parse: function parse(value) {
      // Parse style-like object.
      var data;
      var i;
      var properties;
      var pair;

      // Using setAttribute with object, no need to parse.
      if (value.constructor === Object) {
        return value;
      }

      // Using instanced ID as component namespace for single-property component,
      // nothing to separate.
      if (value.indexOf(':') === -1) {
        return value;
      }

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

  init: function init() {
    this.system = this.el.sceneEl.systems.state;
    this.keysToWatch = [];
    this.onStateUpdate = this.onStateUpdate.bind(this);

    // Whether we are binding by namespace (e.g., bind__foo="prop1: true").
    this.isNamespacedBind = this.id && this.id in AFRAME.components && !AFRAME.components[this.id].isSingleProp || this.id in AFRAME.systems;

    this.lastData = {};
    this.updateObj = {};

    // Subscribe to store and register handler to do data-binding to components.
    this.system.subscribe(this.onStateUpdate);
  },

  update: function update() {
    var data = this.data;
    var dotIndex;
    var key;
    var property;

    this.keysToWatch.length = 0;

    // Index `keysToWatch` to only update state on relevant changes.
    for (key in data) {
      property = key;
      dotIndex = data[key].indexOf('.');
      if (dotIndex !== -1) {
        property = data[key].substring(0, data[key].indexOf('.'));
      }
      this.keysToWatch.push(property);
    }
  },

  /**
   * Handle state update.
   */
  onStateUpdate: function onStateUpdate(state, diff) {
    // Update component with the state.
    var hasChanges = false;
    var hasKeys = false;
    var el = this.el;
    var propertyName;
    var stateKey;
    var stateSelector;
    var value;

    // Check if state changes were relevant to this binding.
    for (stateKey in diff) {
      if (this.keysToWatch.indexOf(stateKey)) {
        hasChanges = true;
      }
      if (hasChanges) {
        break;
      }
    }
    if (!hasChanges) {
      return;
    }

    if (this.isNamespacedBind) {
      clearObject(this.updateObj);
    }

    // Single-property bind.
    if (_typeof(this.data) !== 'object') {
      value = select(state, this.data);

      if (typeof value !== 'object ' && _typeof(this.lastData) !== 'object' && this.lastData === value) {
        return;
      }

      AFRAME.utils.entity.setComponentProperty(el, this.id, value);
      this.lastData = value;
      return;
    }

    for (propertyName in this.data) {
      // Pointer to a value in the state (e.g., `player.health`).
      stateSelector = this.data[propertyName].trim();
      value = select(state, stateSelector);

      if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) !== 'object' && _typeof(this.lastData[propertyName]) !== 'object' && this.lastData[propertyName] === value) {
        continue;
      }

      // Remove component if value is `undefined`.
      if (propertyName in AFRAME.components && value === undefined) {
        el.removeAttribute(propertyName);
        return;
      }

      // Set using dot-delimited property name.
      if (this.isNamespacedBind) {
        // Batch if doing namespaced bind.
        this.updateObj[propertyName] = value;
      } else {
        AFRAME.utils.entity.setComponentProperty(el, propertyName, value);
      }

      this.lastData[propertyName] = value;
    }

    // Batch if doing namespaced bind.
    for (hasKeys in this.updateObj) {
      // See if object is empty.
    }
    if (this.isNamespacedBind && hasKeys) {
      el.setAttribute(this.id, this.updateObj);
    }
  },

  remove: function remove() {
    this.system.unsubscribe(this.onStateUpdate);
  }
});

/**
 * Select value from store.
 *
 * @param {object} state - State object.
 * @param {string} selector - Dot-delimited store keys (e.g., game.player.health).
 */
function select(state, selector) {
  var i;
  var split;
  var value = state;
  split = selector.split('.');
  for (i = 0; i < split.length; i++) {
    value = value[split[i]];
  }
  split.length = 0;
  return value;
}

function clearObject(obj) {
  var key;
  for (key in obj) {
    delete obj[key];
  }
}

/***/ })
/******/ ]);