/* global AFRAME */
AFRAME.registerComponent('gamestate', {
  schema: {
    entities: {type: 'array'}
  },

  init: function () {
    var self = this;
    var el = this.el;
    var initialState = this.initialState;
    var state = this.data;

    // Initial state.
    if (!initialState) { initialState = state; }

    el.emit('gamestateinitialized', {state: initialState});

    registerHandler('entityplaced', function (newState, data) {
      // Modify newState.
      var entity = data.detail;
      newState.entities.push({
        geometry: entity.getAttribute('geometry'),
        material: entity.getAttribute('material'),
        position: entity.getAttribute('position'),
        rotation: entity.getAttribute('rotation'),
        scale: entity.getAttribute('scale')
      });
      return newState;
    });

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
