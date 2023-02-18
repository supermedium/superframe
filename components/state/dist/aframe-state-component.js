(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
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
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// Pre-compiled functions.
var selectFunctions = {};

/**
 * Select value from store. Handles boolean operations, calls `selectProperty`.
 *
 * @param {object} state - State object.
 * @param {string} selector - Dot-delimited store keys (e.g., game.player.health).
 * @param {object} item - From bind-item.
 */
function select(state, selector, item) {
  if (!selectFunctions[selector]) {
    selectFunctions[selector] = new Function('state', 'item', 'return ' + generateExpression(selector) + ';');
  }
  return selectFunctions[selector](state, item);
}
module.exports.select = select;

var DOT_NOTATION_RE = /\.([A-Za-z][\w_-]*)/g;
var WHITESPACE_RE = /\s/g;
var STATE_SELECTOR_RE = /([=&|!?:+-])(\s*)([\(]?)([A-Za-z][\w_-]*)/g;
var ROOT_STATE_SELECTOR_RE = /^([\(]?)([A-Za-z][\w_-]*)/g;
var ITEM_RE = /state\["item"\]/g;
var BOOLEAN_RE = /state\["(true|false)"\]/g;
var STATE_STR = 'state';
function generateExpression(str) {
  str = str.replace(DOT_NOTATION_RE, '["$1"]');
  str = str.replace(ROOT_STATE_SELECTOR_RE, '$1state["$2"]');
  str = str.replace(STATE_SELECTOR_RE, '$1$2$3state["$4"]');
  str = str.replace(ITEM_RE, 'item');
  str = str.replace(BOOLEAN_RE, '$1');
  return str;
}
module.exports.generateExpression = generateExpression;

function clearObject(obj) {
  for (var key in obj) {
    delete obj[key];
  }
}
module.exports.clearObject = clearObject;

/**
 * Helper to compose object of handlers, merging functions handling same action.
 */
function composeHandlers() {
  var actionName;
  var i;
  var inputHandlers = arguments;
  var outputHandlers;

  outputHandlers = {};
  for (i = 0; i < inputHandlers.length; i++) {
    for (actionName in inputHandlers[i]) {
      if (actionName in outputHandlers) {
        // Initial compose/merge functions into arrays.
        if (outputHandlers[actionName].constructor === Array) {
          outputHandlers[actionName].push(inputHandlers[i][actionName]);
        } else {
          outputHandlers[actionName] = [outputHandlers[actionName], inputHandlers[i][actionName]];
        }
      } else {
        outputHandlers[actionName] = inputHandlers[i][actionName];
      }
    }
  }

  // Compose functions specified via array.
  for (actionName in outputHandlers) {
    if (outputHandlers[actionName].constructor === Array) {
      outputHandlers[actionName] = composeFunctions.apply(this, outputHandlers[actionName]);
    }
  }

  return outputHandlers;
}
module.exports.composeHandlers = composeHandlers;

function composeFunctions() {
  var functions = arguments;
  return function () {
    var i;
    for (i = 0; i < functions.length; i++) {
      functions[i].apply(this, arguments);
    }
  };
}
module.exports.composeFunctions = composeFunctions;

var NO_WATCH_TOKENS = ['||', '&&', '!=', '!==', '==', '===', '>', '<', '<=', '>='];
var WHITESPACE_PLUS_RE = /\s+/;
var SYMBOLS = /\(|\)|\!/g;
function parseKeysToWatch(keys, str, isBindItem) {
  var i;
  var tokens;
  tokens = split(str, WHITESPACE_PLUS_RE);
  for (i = 0; i < tokens.length; i++) {
    if (NO_WATCH_TOKENS.indexOf(tokens[i]) === -1 && !tokens[i].startsWith("'") && keys.indexOf(tokens[i]) === -1) {
      if (isBindItem && tokens[i] === 'item') {
        continue;
      }
      keys.push(parseKeyToWatch(tokens[i]).replace(SYMBOLS, ''));
    }
  }
  return keys;
}
module.exports.parseKeysToWatch = parseKeysToWatch;

function parseKeyToWatch(str) {
  var dotIndex;
  str = stripNot(str.trim());
  dotIndex = str.indexOf('.');
  if (dotIndex === -1) {
    return str;
  }
  return str.substring(0, str.indexOf('.'));
}

function stripNot(str) {
  if (str.indexOf('!!') === 0) {
    return str.replace('!!', '');
  } else if (str.indexOf('!') === 0) {
    return str.replace('!', '');
  }
  return str;
}

/**
 * Cached split.
 */
var SPLIT_CACHE = {};
function split(str, delimiter) {
  if (!SPLIT_CACHE[delimiter]) {
    SPLIT_CACHE[delimiter] = {};
  }
  if (SPLIT_CACHE[delimiter][str]) {
    return SPLIT_CACHE[delimiter][str];
  }
  SPLIT_CACHE[delimiter][str] = str.split(delimiter);
  return SPLIT_CACHE[delimiter][str];
}
module.exports.split = split;

function copyArray(dest, src) {
  var i;
  dest.length = 0;
  for (i = 0; i < src.length; i++) {
    dest[i] = src[i];
  }
}
module.exports.copyArray = copyArray;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

__webpack_require__(2);
var diff = __webpack_require__(3);
var lib = __webpack_require__(0);
var wrapArray = __webpack_require__(4).wrapArray;

// Singleton state definition.
var State = {
  initialState: {},
  nonBindedStateKeys: [],
  handlers: {},
  computeState: [function () {/* no-op */}]
};

var STATE_UPDATE_EVENT = 'stateupdate';
var TYPE_OBJECT = 'object';
var WHITESPACE_REGEX = /s+/;

AFRAME.registerState = function (definition) {
  var computeState = State.computeState;
  if (definition.computeState) {
    computeState.push(definition.computeState);
  }
  AFRAME.utils.extendDeep(State, definition);
  State.computeState = computeState;
};

AFRAME.registerSystem('state', {
  init: function init() {
    var _this = this;

    var key;

    this.arrays = [];
    this.dirtyArrays = [];
    this.diff = {};
    this.state = AFRAME.utils.clone(State.initialState);
    this.subscriptions = [];
    this.initEventHandlers();

    // Wrap array to detect dirty.
    for (key in this.state) {
      if (this.state[key] && this.state[key].constructor === Array) {
        this.arrays.push(key);
        this.state[key].__dirty = true;
        wrapArray(this.state[key]);
      }
    }

    this.lastState = AFRAME.utils.clone(this.state);

    this.eventDetail = {
      lastState: this.lastState,
      state: this.state
    };

    this.el.addEventListener('loaded', function () {
      var i;
      // Initial compute.
      for (i = 0; i < State.computeState.length; i++) {
        State.computeState[i](_this.state, '@@INIT');
      }
      // Initial dispatch.
      for (i = 0; i < _this.subscriptions.length; i++) {
        _this.subscriptions[i].onStateUpdate(_this.state);
      }
    });
  },

  /**
   * Dispatch action.
   */
  dispatch: function () {

    var toUpdate = [];

    return function (actionName, payload) {
      var dirtyArrays;
      var i;
      var key;
      var subscription;

      // Modify state.
      State.handlers[actionName](this.state, payload);

      // Post-compute.
      for (i = 0; i < State.computeState.length; i++) {
        State.computeState[i](this.state, actionName, payload);
      }

      // Get a diff to optimize bind updates.
      for (key in this.diff) {
        delete this.diff[key];
      }
      diff(this.lastState, this.state, this.diff, State.nonBindedStateKeys);

      this.dirtyArrays.length = 0;
      for (i = 0; i < this.arrays.length; i++) {
        if (this.state[this.arrays[i]].__dirty) {
          this.dirtyArrays.push(this.arrays[i]);
        }
      }

      // Notify subscriptions / binders.
      var currentUpdateCount = 0;
      for (i = 0; i < this.subscriptions.length; i++) {
        if (this.subscriptions[i].name === 'bind-for') {
          // For arrays and bind-for, check __dirty flag on array rather than the diff.
          if (!this.state[this.subscriptions[i].keysToWatch[0]].__dirty) {
            continue;
          }
        } else {
          if (!this.shouldUpdate(this.subscriptions[i].keysToWatch, this.diff, this.dirtyArrays)) {
            continue;
          }
        }

        // Keep track to only update subscriptions once.
        if (toUpdate.indexOf(this.subscriptions[i]) === -1) {
          toUpdate.push(this.subscriptions[i]);
          currentUpdateCount++;
        }
      }

      // Unset array dirty.
      for (key in this.state) {
        if (this.state[key] && this.state[key].constructor === Array) {
          this.state[key].__dirty = false;
        }
      }

      // Store last state.
      this.copyState(this.lastState, this.state);

      // Update subscriptions.
      for (i = 0; i < currentUpdateCount; i++) {
        var subscriber = toUpdate.pop();
        subscriber.onStateUpdate();
      }

      // Emit.
      this.eventDetail.action = actionName;
      this.eventDetail.payload = payload;
      this.el.emit(STATE_UPDATE_EVENT, this.eventDetail);
    };
  }(),

  /**
   * Store last state through a deep extend, but not for arrays.
   */
  copyState: function copyState(lastState, state, isRecursive) {
    var key;

    for (key in state) {
      // Don't copy pieces of state keys that are non-binded or untracked.
      if (!isRecursive && State.nonBindedStateKeys.indexOf(key) !== -1) {
        continue;
      }

      // Nested state.
      if (state[key] && state[key].constructor === Object) {
        if (!(key in lastState)) {
          // Clone object if destination does not exist.
          lastState[key] = AFRAME.utils.clone(state[key]);
          continue;
        }
        // Recursively copy state.
        this.copyState(lastState[key], state[key], true);
        continue;
      }

      // Copy by value.
      lastState[key] = state[key];
    }
  },

  subscribe: function subscribe(component) {
    this.subscriptions.push(component);
  },

  unsubscribe: function unsubscribe(component) {
    var i = this.subscriptions.indexOf(component);
    if (i > -1) this.subscriptions.splice(i, 1);
  },

  /**
   * Check if state changes were relevant to this binding. If not, don't call.
   */
  shouldUpdate: function shouldUpdate(keysToWatch, diff, dirtyArrays) {
    for (var i = 0; i < keysToWatch.length; i++) {
      if (keysToWatch[i] in diff || dirtyArrays.indexOf(keysToWatch[i]) !== -1) {
        return true;
      }
    }
    return false;
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
      // Only need to register one handler for each event.
      if (registeredActions.indexOf(actionName) !== -1) {
        continue;
      }
      registeredActions.push(actionName);
      registerListener(actionName);
    }

    function registerListener(actionName) {
      var _this2 = this;

      this.el.addEventListener(actionName, function (evt) {
        _this2.dispatch(actionName, evt.detail);
      });
    }
  },

  /**
   * Render template to string with item data.
   */
  renderTemplate: function () {
    // Braces, whitespace, optional item name, item key, whitespace, braces.
    var interpRegex = /{{\s*(\w*\.)?([\w.]+)\s*}}/g;

    return function (template, data, asString) {
      var match;
      var str;

      str = template;

      // Data will be null if initialize pool for bind-for.updateInPlace.
      if (data) {
        while (match = interpRegex.exec(template)) {
          str = str.replace(match[0], (typeof data === 'undefined' ? 'undefined' : _typeof(data)) === TYPE_OBJECT ? lib.select(data, match[2]) || '' : data);
        }
      }

      // Return as string.
      if (asString) {
        return str;
      }

      // Return as DOM.
      return document.createRange().createContextualFragment(str);
    };
  }(),

  select: lib.select
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
      properties = lib.split(value, ';');
      for (i = 0; i < properties.length; i++) {
        pair = lib.split(properties[i].trim(), ':');
        data[pair[0]] = pair[1].trim();
      }
      return data;
    }
  },

  multiple: true,

  init: function init() {
    var componentId;
    var data = this.data;
    var key;

    this.keysToWatch = [];
    this.onStateUpdate = this.onStateUpdate.bind(this);
    this.system = this.el.sceneEl.systems.state;

    // Whether we are binding by namespace (e.g., bind__foo="prop1: true").
    if (this.id) {
      componentId = lib.split(this.id, '__')[0];
    }

    this.isNamespacedBind = this.id && componentId in AFRAME.components && !AFRAME.components[componentId].isSingleProp || componentId in AFRAME.systems;

    this.lastData = {};
    this.updateObj = {};

    // Subscribe to store and register handler to do data-binding to components.
    this.system.subscribe(this);

    this.onStateUpdate = this.onStateUpdate.bind(this);
  },

  update: function update() {
    var data = this.data;
    var key;
    var property;

    // Index `keysToWatch` to only update state on relevant changes.
    this.keysToWatch.length = 0;
    if (typeof data === 'string') {
      lib.parseKeysToWatch(this.keysToWatch, data);
    } else {
      for (key in data) {
        lib.parseKeysToWatch(this.keysToWatch, data[key]);
      }
    }

    this.onStateUpdate();
  },

  /**
   * Handle state update.
   */
  onStateUpdate: function onStateUpdate() {
    // Update component with the state.
    var hasKeys = false;
    var el = this.el;
    var propertyName;
    var stateSelector;
    var state;
    var tempNode;
    var value;

    if (!el.parentNode) {
      return;
    }
    if (this.isNamespacedBind) {
      lib.clearObject(this.updateObj);
    }

    state = this.system.state;

    // Single-property bind.
    if (_typeof(this.data) !== TYPE_OBJECT) {
      try {
        value = lib.select(state, this.data);
      } catch (e) {
        throw new Error('[aframe-state-component] Key \'' + this.data + '\' not found in state.' + (' #' + this.el.getAttribute('id') + '[' + this.attrName + ']'));
      }

      if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) !== TYPE_OBJECT && _typeof(this.lastData) !== TYPE_OBJECT && this.lastData === value) {
        return;
      }

      AFRAME.utils.entity.setComponentProperty(el, this.id, value);
      this.lastData = value;
      return;
    }

    for (propertyName in this.data) {
      // Pointer to a value in the state (e.g., `player.health`).
      stateSelector = this.data[propertyName].trim();
      try {
        value = lib.select(state, stateSelector);
      } catch (e) {
        console.log(e);
        throw new Error('[aframe-state-component] Key \'' + stateSelector + '\' not found in state.' + (' #' + this.el.getAttribute('id') + '[' + this.attrName + ']'));
      }

      if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) !== TYPE_OBJECT && _typeof(this.lastData[propertyName]) !== TYPE_OBJECT && this.lastData[propertyName] === value) {
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
    this.system.unsubscribe(this);
  }
});

/**
 * Toggle component attach and detach based on boolean value.
 *
 * bind-toggle__raycastable="isRaycastable""
 */
AFRAME.registerComponent('bind-toggle', {
  schema: { type: 'string' },

  multiple: true,

  init: function init() {
    this.system = this.el.sceneEl.systems.state;
    this.keysToWatch = [];
    this.onStateUpdate = this.onStateUpdate.bind(this);

    // Subscribe to store and register handler to do data-binding to components.
    this.system.subscribe(this);

    this.onStateUpdate();
  },

  update: function update() {
    this.keysToWatch.length = 0;
    lib.parseKeysToWatch(this.keysToWatch, this.data);
  },

  /**
   * Handle state update.
   */
  onStateUpdate: function onStateUpdate() {
    var el = this.el;
    var state;
    var value;

    state = this.system.state;

    try {
      value = lib.select(state, this.data);
    } catch (e) {
      throw new Error('[aframe-state-component] Key \'' + this.data + '\' not found in state.' + (' #' + this.el.getAttribute('id') + '[' + this.attrName + ']'));
    }

    if (value) {
      el.setAttribute(this.id, '');
    } else {
      el.removeAttribute(this.id);
    }
  },

  remove: function remove() {
    this.system.unsubscribe(this);
  }
});

module.exports = {
  composeFunctions: lib.composeFunctions,
  composeHandlers: lib.composeHandlers,
  select: lib.select
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var lib = __webpack_require__(0);

var ITEM_RE = /item/;
var ITEM_PREFIX_RE = /item./;
var ITEM_SELECTOR_RE = /item.(\w+)/;

/**
 * Render array from state.
 */
AFRAME.registerComponent('bind-for', {
  schema: {
    delay: { default: 0 },
    for: { type: 'string', default: 'item' },
    in: { type: 'string' },
    key: { type: 'string' },
    pool: { default: 0 },
    template: { type: 'string' },
    updateInPlace: { default: false }
  },

  init: function init() {
    // Subscribe to store and register handler to do data-binding to components.
    this.system = this.el.sceneEl.systems.state;
    this.onStateUpdate = this.onStateUpdate.bind(this);

    this.keysToWatch = [];
    this.renderedKeys = []; // Keys that are currently rendered.
    this.system.subscribe(this);

    if (this.el.children[0] && this.el.children[0].tagName === 'TEMPLATE') {
      this.template = this.el.children[0].innerHTML.trim();
    } else {
      this.template = document.querySelector(this.data.template).innerHTML.trim();
    }

    for (var i = 0; i < this.data.pool; i++) {
      this.el.appendChild(this.generateFromTemplate(null, i));
    }
  },

  update: function update() {
    this.keysToWatch[0] = lib.split(this.data.in, '.')[0];
    this.onStateUpdate();
  },

  /**
   * When items are swapped out, the old ones are removed, and new ones are added. All
   * entities will be reinitialized.
   */
  onStateUpdateNaive: function () {
    var activeKeys = [];

    return function () {
      var child;
      var data = this.data;
      var el = this.el;
      var list;
      var key;
      var keyValue;

      try {
        list = lib.select(this.system.state, data.in);
      } catch (e) {
        throw new Error('[aframe-state-component] Key \'' + data.in + '\' not found in state.' + (' #' + el.getAttribute('id') + '[' + this.attrName + ']'));
      }

      activeKeys.length = 0;
      for (var i = 0; i < list.length; i++) {
        var item = list[i];
        // If key not defined, use index (e.g., array of strings).
        activeKeys.push(data.key ? item[data.key].toString() : item.toString());
      }

      // Remove items by removing entities.
      var toRemoveEls = this.getElsToRemove(activeKeys, this.renderedKeys);
      for (var _i = 0; _i < toRemoveEls.length; _i++) {
        toRemoveEls[_i].parentNode.removeChild(toRemoveEls[_i]);
      }

      if (list.length) {
        this.renderItems(list, activeKeys, 0);
      }
    };
  }(),

  /**
   * Add or update item with delay support.
   */
  renderItems: function renderItems(list, activeKeys, i) {
    var _this = this;

    var data = this.data;
    var el = this.el;
    var itemEl;
    var item = list[i];

    // If key not defined, use index (e.g., array of strings).
    var keyValue = data.key ? item[data.key].toString() : item.toString();

    if (this.renderedKeys.indexOf(keyValue) === -1) {
      // Add.
      itemEl = this.generateFromTemplate(item, i);
      el.appendChild(itemEl);
      this.renderedKeys.push(keyValue);
    } else {
      // Update.
      if (list.length && list[0].constructor === String) {
        // Update index for simple list.
        var _keyValue = data.key ? item[data.key].toString() : item.toString();
        itemEl = el.querySelector('[data-bind-for-value="' + _keyValue + '"]');
        itemEl.setAttribute('data-bind-for-key', i);
      } else {
        var bindForKey = this.getBindForKey(item, i);
        itemEl = el.querySelector('[data-bind-for-key="' + bindForKey + '"]');
      }
      itemEl.emit('bindforupdate', item, false);
    }

    if (!list[i + 1]) {
      return;
    }

    if (this.data.delay) {
      setTimeout(function () {
        _this.renderItems(list, activeKeys, i + 1);
      }, this.data.delay);
    } else {
      this.renderItems(list, activeKeys, i + 1);
    }
  },

  /**
   * When items are swapped out, this algorithm will update component values in-place using
   * bind-item.
   */
  onStateUpdateInPlace: function () {
    var activeKeys = [];

    return function () {
      var data = this.data;
      var el = this.el;
      var list;
      var key;
      var keyValue;

      try {
        list = lib.select(this.system.state, data.in);
      } catch (e) {
        console.log(e);
        throw new Error('[aframe-state-component] Key \'' + data.in + '\' not found in state.' + (' #' + el.getAttribute('id') + '[' + this.attrName + ']'));
      }

      // Calculate keys that should be active.
      activeKeys.length = 0;
      for (var i = 0; i < list.length; i++) {
        var item = list[i];
        keyValue = data.key ? item[data.key].toString() : item.toString();
        activeKeys.push(keyValue);
      }

      // Remove items by pooling. Do before adding.
      var toRemoveEls = this.getElsToRemove(activeKeys, this.renderedKeys);
      for (var _i2 = 0; _i2 < toRemoveEls.length; _i2++) {
        toRemoveEls[_i2].object3D.visible = false;
        toRemoveEls[_i2].setAttribute('data-bind-for-active', 'false');
        toRemoveEls[_i2].removeAttribute('data-bind-for-key');
        toRemoveEls[_i2].removeAttribute('data-bind-for-value');
        toRemoveEls[_i2].emit('bindfordeactivate', null, false);
        toRemoveEls[_i2].pause();
      }

      if (list.length) {
        this.renderItemsInPlace(list, activeKeys, 0);
      }
    };
  }(),

  /**
   * Add, takeover, or update item with delay support.
   */
  renderItemsInPlace: function renderItemsInPlace(list, activeKeys, i) {
    var _this2 = this;

    var data = this.data;
    var el = this.el;
    var itemEl;

    var item = list[i];
    var bindForKey = this.getBindForKey(item, i);
    var keyValue = data.key ? item[data.key].toString() : item.toString();

    // Add item.
    if (this.renderedKeys.indexOf(keyValue) === -1) {
      if (!el.querySelector(':scope > [data-bind-for-active="false"]')) {
        // No items available in pool. Generate new entity.
        var _itemEl = this.generateFromTemplate(item, i);
        _itemEl.addEventListener('loaded', function () {
          _itemEl.emit('bindforupdateinplace', item, false);
        });
        el.appendChild(_itemEl);
      } else {
        // Take over inactive item.
        itemEl = el.querySelector('[data-bind-for-active="false"]');
        itemEl.setAttribute('data-bind-for-key', bindForKey);
        itemEl.setAttribute('data-bind-for-value', keyValue);
        itemEl.object3D.visible = true;
        itemEl.play();
        itemEl.setAttribute('data-bind-for-active', 'true');
        itemEl.emit('bindforupdateinplace', item, false);
      }
      this.renderedKeys.push(keyValue);
    } else if (activeKeys.indexOf(keyValue) !== -1) {
      // Update item.
      if (list.length && list[0].constructor === String) {
        // Update index for simple list.
        itemEl = el.querySelector('[data-bind-for-value="' + keyValue + '"]');
        itemEl.setAttribute('data-bind-for-key', i);
      } else {
        itemEl = el.querySelector('[data-bind-for-key="' + bindForKey + '"]');
      }
      itemEl.emit('bindforupdateinplace', item, false);
    }

    if (!list[i + 1]) {
      return;
    }

    if (this.data.delay) {
      setTimeout(function () {
        _this2.renderItemsInPlace(list, activeKeys, i + 1);
      }, this.data.delay);
    } else {
      this.renderItemsInPlace(list, activeKeys, i + 1);
    }
  },

  /**
   * Generate entity from template.
   */
  generateFromTemplate: function generateFromTemplate(item, i) {
    var data = this.data;

    this.el.appendChild(this.system.renderTemplate(this.template, item));
    var newEl = this.el.children[this.el.children.length - 1];;

    // From pool.true
    if (!item) {
      newEl.setAttribute('data-bind-for-key', '');
      newEl.setAttribute('data-bind-for-active', 'false');
      return newEl;
    }

    var bindForKey = this.getBindForKey(item, i);
    newEl.setAttribute('data-bind-for-key', bindForKey);
    if (!data.key) {
      newEl.setAttribute('data-bind-for-value', item);
    }

    // Keep track of pooled and non-pooled entities if updating in place.
    newEl.setAttribute('data-bind-for-active', 'true');
    return newEl;
  },

  /**
   * Get entities marked for removal.
   *
   * @param {array} activeKeys - List of key values that should be active.
   * @param {array} renderedKeys - List of key values currently rendered.
   */
  getElsToRemove: function () {
    var toRemove = [];

    return function (activeKeys, renderedKeys) {
      var data = this.data;
      var el = this.el;

      toRemove.length = 0;
      for (var i = 0; i < el.children.length; i++) {
        if (el.children[i].tagName === 'TEMPLATE') {
          continue;
        }
        var key = data.key ? el.children[i].getAttribute('data-bind-for-key') : el.children[i].getAttribute('data-bind-for-value');
        if (activeKeys.indexOf(key) === -1 && renderedKeys.indexOf(key) !== -1) {
          toRemove.push(el.children[i]);
          renderedKeys.splice(renderedKeys.indexOf(key), 1);
        }
      }
      return toRemove;
    };
  }(),

  /**
   * Get value to use as the data-bind-for-key.
   * For items, will be value specified by `bind-for.key`.
   * For simple list, will be the index.
   */
  getBindForKey: function getBindForKey(item, i) {
    return this.data.key ? item[this.data.key].toString() : i.toString();
  },

  /**
   * Handle state update.
   */
  onStateUpdate: function onStateUpdate() {
    if (this.data.updateInPlace) {
      this.onStateUpdateInPlace();
    } else {
      this.onStateUpdateNaive();
    }
  },

  remove: function remove() {
    this.el.sceneEl.systems.state.unsubscribe(this);
  }
});

/**
 * Handle parsing and update in-place updates under bind-for.
 */
AFRAME.registerComponent('bind-item', {
  schema: {
    type: 'string'
  },

  multiple: true,

  init: function init() {
    this.itemData = null;
    this.keysToWatch = [];
    this.prevValues = {};

    // Listen to root item for events.
    var rootEl = this.rootEl = this.el.closest('[data-bind-for-key]');
    if (!rootEl) {
      throw new Error('bind-item component must be attached to entity under a bind-for item.');
    }
    rootEl.addEventListener('bindforupdateinplace', this.updateInPlace.bind(this));
    rootEl.addEventListener('bindfordeactivate', this.deactivate.bind(this));

    this.el.sceneEl.systems.state.subscribe(this);
  },

  update: function update() {
    this.parseSelector();
  },

  /**
   * Run with bind-for tells to via event `bindforupdateinplace`, passing item data.
   */
  updateInPlace: function updateInPlace(evt) {
    var propertyMap = this.propertyMap;

    if (this.rootEl.getAttribute('data-bind-for-active') === 'false') {
      return;
    }

    if (evt) {
      this.itemData = evt.detail;
    }

    for (var property in propertyMap) {
      // Get value from item.
      var value = this.select(this.itemData, propertyMap[property]);

      // Diff against previous value.
      if (value === this.prevValues[property]) {
        continue;
      }

      // Update.
      AFRAME.utils.entity.setComponentProperty(this.el, property, value);

      this.prevValues[property] = value;
    }
  },

  onStateUpdate: function onStateUpdate() {
    this.updateInPlace();
  },

  select: function select(itemData, selector) {
    return lib.select(this.el.sceneEl.systems.state.state, selector, itemData);
  },

  deactivate: function deactivate() {
    this.prevValues = {};
  },

  parseSelector: function parseSelector() {
    var propertyMap = this.propertyMap = {};
    this.keysToWatch.length = 0;

    var componentName = lib.split(this.id, '__')[0];

    // Different parsing for multi-prop components.
    if (componentName in AFRAME.components && !AFRAME.components[componentName].isSingleProp) {
      var propertySplitList = lib.split(this.data, ';');
      for (var i = 0; i < propertySplitList.length; i++) {
        var propertySplit = lib.split(propertySplitList[i], ':');
        propertyMap[this.id + '.' + propertySplit[0].trim()] = propertySplit[1].trim();
        lib.parseKeysToWatch(this.keysToWatch, propertySplit[1].trim(), true);
      }
      return;
    }

    propertyMap[this.id] = this.data;
    lib.parseKeysToWatch(this.keysToWatch, this.data, true);
  },

  remove: function remove() {
    this.el.sceneEl.systems.state.unsubscribe(this);
  }
});

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Computes the difference between two objects with ability to ignore keys.
 *
 * @param {object} a - First object to compare (e.g., oldData).
 * @param {object} b - Second object to compare (e.g., newData).
 * @returns {object}
 *   Difference object where set of keys note which values were not equal, and values are
 *   `b`'s values.
 */
module.exports = function () {
  var keys = [];

  return function (a, b, targetObject, ignoreKeys) {
    var aVal;
    var bVal;
    var bKey;
    var diff;
    var key;
    var i;
    var isComparingObjects;

    diff = targetObject || {};

    // Collect A keys.
    keys.length = 0;
    for (key in a) {
      keys.push(key);
    }

    if (!b) {
      return diff;
    }

    // Collect B keys.
    for (bKey in b) {
      if (keys.indexOf(bKey) === -1) {
        keys.push(bKey);
      }
    }

    for (i = 0; i < keys.length; i++) {
      key = keys[i];

      // Ignore specified keys.
      if (ignoreKeys && ignoreKeys.indexOf(key) !== -1) {
        continue;
      }

      aVal = a[key];
      bVal = b[key];
      isComparingObjects = aVal && bVal && aVal.constructor === Object && bVal.constructor === Object;
      if (isComparingObjects && !AFRAME.utils.deepEqual(aVal, bVal) || !isComparingObjects && aVal !== bVal) {
        diff[key] = bVal;
      }
    }
    return diff;
  };
}();

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var fns = ['push', 'pop', 'shift', 'unshift', 'splice'];

function wrapArray(arr) {
  var i;
  if (arr.__wrapped) {
    return;
  }
  for (i = 0; i < fns.length; i++) {
    makeCallDirty(arr, fns[i]);
  }
  arr.__wrapped = true;
}
module.exports.wrapArray = wrapArray;

function makeCallDirty(arr, fn) {
  var originalFn = arr[fn];
  arr[fn] = function () {
    originalFn.apply(arr, arguments);
    arr.__dirty = true;
  };
}

/***/ })
/******/ ]);
});