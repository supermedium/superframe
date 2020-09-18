require('./bind-for');
var diff = require('./lib/diff');
var lib = require('./lib/index');
var wrapArray = require('./lib/array').wrapArray;

// Singleton state definition.
var State = {
  initialState: {},
  nonBindedStateKeys: [],
  handlers: {},
  computeState: [function () { /* no-op */ }]
};

var STATE_UPDATE_EVENT = 'stateupdate';
var TYPE_OBJECT = 'object';
var WHITESPACE_REGEX = /s+/;

AFRAME.registerState = function (definition) {
  const computeState = State.computeState;
  if (definition.computeState) {
    computeState.push(definition.computeState);
  }
  AFRAME.utils.extendDeep(State, definition);
  State.computeState = computeState;
}

AFRAME.registerSystem('state', {
  init: function () {
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

    this.el.addEventListener('loaded', () => {
      var i;
      // Initial compute.
      for (i = 0; i < State.computeState.length; i++) {
        State.computeState[i](this.state, '@@INIT');
      }
      // Initial dispatch.
      for (i = 0; i < this.subscriptions.length; i++) {
        this.subscriptions[i].onStateUpdate(this.state);
      }
    });
  },

  /**
   * Dispatch action.
   */
  dispatch: (function () {

    const toUpdate = [];

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
      for (key in this.diff) { delete this.diff[key]; }
      diff(this.lastState, this.state, this.diff, State.nonBindedStateKeys);

      this.dirtyArrays.length = 0;
      for (i = 0; i < this.arrays.length; i++) {
        if (this.state[this.arrays[i]].__dirty) {
          this.dirtyArrays.push(this.arrays[i]);
        }
      }

      // Notify subscriptions / binders.
      let currentUpdateCount = 0;
      for (i = 0; i < this.subscriptions.length; i++) {
        if (this.subscriptions[i].name === 'bind-for') {
          // For arrays and bind-for, check __dirty flag on array rather than the diff.
          if (!this.state[this.subscriptions[i].keysToWatch[0]].__dirty) { continue; }
        } else {
          if (!this.shouldUpdate(this.subscriptions[i].keysToWatch, this.diff,
                                 this.dirtyArrays)) { continue; }
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
        let subscriber = toUpdate.pop();
        subscriber.onStateUpdate();
      }

      // Emit.
      this.eventDetail.action = actionName;
      this.eventDetail.payload = payload;
      this.el.emit(STATE_UPDATE_EVENT, this.eventDetail);
    };
  })(),

  /**
   * Store last state through a deep extend, but not for arrays.
   */
  copyState: function (lastState, state, isRecursive) {
    var key;

    for (key in state) {
      // Don't copy pieces of state keys that are non-binded or untracked.
      if (!isRecursive && State.nonBindedStateKeys.indexOf(key) !== -1) { continue; }

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

  subscribe: function (component) {
    this.subscriptions.push(component);
  },

  unsubscribe: function (component) {
    var i = this.subscriptions.indexOf(component);
    if (i > -1)
      this.subscriptions.splice(i, 1);
  },

  /**
   * Check if state changes were relevant to this binding. If not, don't call.
   */
  shouldUpdate: function (keysToWatch, diff, dirtyArrays) {
    for (let i = 0; i < keysToWatch.length; i++) {
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
  initEventHandlers: function () {
    var actionName;
    var registeredActions = [];
    var self = this;

    registerListener = registerListener.bind(this);

    // Use declared handlers to know what events to listen to.
    for (actionName in State.handlers) {
      // Only need to register one handler for each event.
      if (registeredActions.indexOf(actionName) !== -1) { continue; }
      registeredActions.push(actionName);
      registerListener(actionName);
    }

    function registerListener (actionName) {
      this.el.addEventListener(actionName, evt => {
        this.dispatch(actionName, evt.detail);
      });
    }
  },

  /**
   * Render template to string with item data.
   */
  renderTemplate: (function () {
    // Braces, whitespace, optional item name, item key, whitespace, braces.
    var interpRegex = /{{\s*(\w*\.)?([\w.]+)\s*}}/g;

    return function (template, data, asString) {
      var match;
      var str;

      str = template;

      // Data will be null if initialize pool for bind-for.updateInPlace.
      if (data) {
        while (match = interpRegex.exec(template)) {
          str = str.replace(
            match[0],
            typeof data === TYPE_OBJECT
              ? lib.select(data, match[2]) || ''
              : data);
        }
      }

      // Return as string.
      if (asString) { return str; }

      // Return as DOM.
      return document.createRange().createContextualFragment(str);
    };
  })(),

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
      properties = lib.split(value, ';');
      for (i = 0; i < properties.length; i++) {
        pair = lib.split(properties[i].trim(), ':');
        data[pair[0]] = pair[1].trim();
      }
      return data;
    }
  },

  multiple: true,

  init: function () {
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

    this.isNamespacedBind =
      this.id &&
      (componentId in AFRAME.components && !AFRAME.components[componentId].isSingleProp) ||
      componentId in AFRAME.systems;

    this.lastData = {};
    this.updateObj = {};

    // Subscribe to store and register handler to do data-binding to components.
    this.system.subscribe(this);

    this.onStateUpdate = this.onStateUpdate.bind(this);
  },

  update: function () {
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
  onStateUpdate: function () {
    // Update component with the state.
    var hasKeys = false;
    var el = this.el;
    var propertyName;
    var stateSelector;
    var state;
    var tempNode;
    var value;

    if (!el.parentNode) { return; }
    if (this.isNamespacedBind) { lib.clearObject(this.updateObj); }

    state = this.system.state;

    // Single-property bind.
    if (typeof this.data !== TYPE_OBJECT) {
      try {
        value = lib.select(state, this.data);
      } catch (e) {
        throw new Error(`[aframe-state-component] Key '${this.data}' not found in state.` +
                        ` #${this.el.getAttribute('id')}[${this.attrName}]`);
      }

      if (typeof value !== TYPE_OBJECT &&
          typeof this.lastData !== TYPE_OBJECT &&
          this.lastData === value) { return; }

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
        throw new Error(`[aframe-state-component] Key '${stateSelector}' not found in state.` +
                        ` #${this.el.getAttribute('id')}[${this.attrName}]`);
      }

      if (typeof value !== TYPE_OBJECT &&
          typeof this.lastData[propertyName] !== TYPE_OBJECT &&
          this.lastData[propertyName] === value) { continue; }

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

  remove: function () {
    this.system.unsubscribe(this);
  }
});

/**
 * Toggle component attach and detach based on boolean value.
 *
 * bind-toggle__raycastable="isRaycastable""
 */
AFRAME.registerComponent('bind-toggle', {
  schema: {type: 'string'},

  multiple: true,

  init: function () {
    this.system = this.el.sceneEl.systems.state;
    this.keysToWatch = [];
    this.onStateUpdate = this.onStateUpdate.bind(this);

    // Subscribe to store and register handler to do data-binding to components.
    this.system.subscribe(this);

    this.onStateUpdate();
  },

  update: function () {
    this.keysToWatch.length = 0;
    lib.parseKeysToWatch(this.keysToWatch, this.data);
  },

  /**
   * Handle state update.
   */
  onStateUpdate: function () {
    var el = this.el;
    var state;
    var value;

    state = this.system.state;

    try {
      value = lib.select(state, this.data);
    } catch (e) {
      throw new Error(`[aframe-state-component] Key '${this.data}' not found in state.` +
                      ` #${this.el.getAttribute('id')}[${this.attrName}]`);
    }

    if (value) {
      el.setAttribute(this.id, '');
    } else {
      el.removeAttribute(this.id);
    }
  },

  remove: function () {
    this.system.unsubscribe(this);
  }
});

module.exports = {
  composeFunctions: lib.composeFunctions,
  composeHandlers: lib.composeHandlers,
  select: lib.select
};
