/* global AFRAME */
AFRAME.registerComponent('gamestate', {
  schema: {
    // Initial state.
    activePrimitive: {
      default: {
        material: {color: 'red'}
      },
      parse: function (val) {
        return val;
      }
    },
    entityId: {default: 0},
    entities: {type: 'array', default: []},
    stagedPrimitives: {type: 'array', default: []}
  },

  init: function () {
    var self = this;
    var el = this.el;
    var initialState = this.initialState;
    var state = this.data;

    // Initial state.
    if (!initialState) { initialState = state; }

    el.emit('gamestateinitialized', {state: initialState});

    // Add primitive to staged primitives.
    registerHandler('primitiveplace', function (newState, data) {
      var entity = data.detail;
      entity.id = newState.entityId++;
      entity.classList.add('stagedPrimitive');
      newState.stagedPrimitives.push({
        id: entity.id,
        geometry: entity.getDOMAttribute('geometry'),
        material: entity.getDOMAttribute('material'),
        position: entity.getAttribute('position'),
        rotation: entity.getAttribute('rotation'),
        scale: entity.getAttribute('scale')
      });
      return newState;
    });

    // Update active primitive geometry.
    registerHandler('paletteprimitiveselect', function (newState, data) {
      data = data.detail;
      newState.activePrimitive.geometry = data.geometry;
      newState.activePrimitive.scale = data.scale;
      return newState;
    });

    // Update active primitive material.
    registerHandler('palettecolorselect', function (newState, data) {
      data = data.detail;
      newState.activePrimitive.material = {color: data.color};
      return newState;
    });

    // Update active primitive material.
    registerHandler('createthingbuttonpress', function (newState, data) {
      // Move staged primitives to entities.
      newState.entities.push(newState.stagedPrimitives.slice());

      // Reset staged primitives.
      newState.stagedPrimitives.length = 0;
      return newState;
    });

    // Delete primitive.
    registerHandler('primitivedelete', function (newState, data) {
      var deletedEntityId = data.detail.id;
      var i;
      var stagedPrimitive;

      // Clone array for clean state.
      newState.stagedPrimitives = newState.stagedPrimitives.slice();

      // Remove from stagedPrimitives array.
      for (i = 0; i < newState.stagedPrimitives.length; i++) {
        stagedPrimitive = newState.stagedPrimitives[i];
        if (stagedPrimitive.id === deletedEntityId) {
          newState.stagedPrimitives.splice(i, 1);
          break;
        }
      }

      // TODO: If not in stagedPrimitives, but in entities, then delete the group.
      return newState;
    });

    /**
     * TODO: Synchronous option for triggering a handler.
     * Pass entire event detail into handler.
     */
    function registerHandler (event, handler) {
      el.addEventListener(event, function (param) {
        var newState = handler(AFRAME.utils.extend({}, state), param);
        publishState(event, newState);
      });
    }

    function publishState (event, newState) {
      var oldState = AFRAME.utils.extend({}, state);
      el.setAttribute('gamestate', newState);
      state = newState;
      el.emit('gamestatechanged', {
        event: event,
        diff: AFRAME.utils.diff(oldState, newState),
        state: newState
      });
    }
  }
});

/**
 * Bind game state to a component property.
 */
AFRAME.registerComponent('gamestatebind', {
  schema: {
    default: {},
    parse: AFRAME.utils.styleParser.parse
  },

  update: function () {
    var sceneEl = this.el.closestScene();
    if (sceneEl.hasLoaded) {
      this.updateBinders();
    }
    sceneEl.addEventListener('loaded', this.updateBinders.bind(this));
  },

  updateBinders: function () {
    var data = this.data;
    var el = this.el;
    var subscribed = Object.keys(this.data);

    el.sceneEl.addEventListener('gamestatechanged', function (evt) {
      syncState(evt.detail.diff);
    });

    el.sceneEl.addEventListener('gamestateinitialized', function (evt) {
      syncState(evt.detail.state);
    });

    function syncState (state) {
      Object.keys(state).forEach(function updateIfNecessary (stateProperty) {
        var targetProperty = data[stateProperty];
        var value = state[stateProperty];
        if (subscribed.indexOf(stateProperty) === -1) { return; }
        AFRAME.utils.entity.setComponentProperty(el, targetProperty, value);
      });
    }
  }
});
