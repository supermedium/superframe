var FirebaseWrapper = require('./firebaseWrapper');

var getComponentProperty = AFRAME.utils.entity.getComponentProperty;
var setComponentProperty = AFRAME.utils.entity.setComponentProperty;

if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.');
}

/**
 * Firebase system.
 */
AFRAME.registerSystem('firebase', {
  schema: {
    apiKey: {type: 'string'},
    authDomain: {type: 'string'},
    channel: {type: 'string'},
    databaseURL: {type: 'string'},
    interval: {type: 'number'},
    storageBucket: {type: 'string'}
  },

  init: function () {
    // Get config.
    var config = this.data;

    // TODO: https://github.com/aframevr/aframe/pull/1670
    if (!config.apiKey && !window.debug) { return; }

    this.broadcastingEntities = {};
    this.entities = {};
    this.interval = config.interval || 10;

    // Set up Firebase.
    var firebaseWrapper = this.firebaseWrapper = new FirebaseWrapper();
    firebaseWrapper.init(config);
    this.firebase = firebaseWrapper.firebase;
    this.database = firebaseWrapper.database;
    firebaseWrapper.getAllEntities().then(this.handleInitialSync.bind(this));
    firebaseWrapper.onEntityAdded(this.handleEntityAdded.bind(this));
    firebaseWrapper.onEntityChanged(this.handleEntityChanged.bind(this));
    firebaseWrapper.onEntityRemoved(this.handleEntityRemoved.bind(this));
  },

  /**
   * Initial sync.
   */
  handleInitialSync: function (data) {
    var self = this;
    var broadcastingEntities = this.broadcastingEntities;
    Object.keys(data).forEach(function (entityId) {
      self.handleEntityAdded(entityId, data[entityId]);
    });
  },

  /**
   * Entity added.
   */
  handleEntityAdded: function (id, data) {
    // Already added.
    if (this.entities[id] || this.broadcastingEntities[id]) { return; }

    // Handle parent-child relationships.
    var parentId = data.parentId;
    var parentEl = this.sceneEl;
    if (parentId) {
      parentEl = this.entities[parentId] || this.sceneEl.querySelector('#' + parentId);
      if (!parentEl) {
        // Wait for parent to attach. (TODO: use Promises).
        var self = this;
        return setTimeout(function () {
          self.handleEntityAdded(id, data);
        });
      }
    }
    delete data.parentId;

    // Create and reference entity.
    var entity = document.createElement('a-entity');
    this.entities[id] = entity;

    // Components.
    Object.keys(data).forEach(function setComponent (componentName) {
      setComponentProperty(entity, componentName, data[componentName]);
    });

    parentEl.appendChild(entity);
  },

  /**
   * Entity updated.
   */
  handleEntityChanged: function (id, components) {
    // Don't sync if already broadcasting to self-updating loops.
    if (this.broadcastingEntities[id]) { return; }

    var entity = this.entities[id];
    Object.keys(components).forEach(function setComponent (componentName) {
      if (componentName === 'parentId') { return; }
      setComponentProperty(entity, componentName, components[componentName]);
    });
  },

  /**
   * Entity removed. Detach.
   */
  handleEntityRemoved: function (id) {
    var entity = this.entities[id];
    if (!entity) { return; }
    entity.parentNode.removeChild(entity);
    delete this.entities[id];
  },

  /**
   * Register.
   */
  registerBroadcast: function (el) {
    var broadcastingEntities = this.broadcastingEntities;

    // Initialize entry, get assigned a Firebase ID.
    var id = this.firebaseWrapper.createEntity();

    setTimeout(function () {
      broadcastingEntities[id] = el;
      el.setAttribute('firebase-broadcast', 'id', id);
    });

    // Remove entry when client disconnects.
    this.firebaseWrapper.removeEntityOnDisconnect(id);
  },

  /**
   * Broadcast.
   */
  tick: function (time) {
    if (!this.firebase) { return; }

    var broadcastingEntities = this.broadcastingEntities;
    var firebaseWrapper = this.firebaseWrapper;
    var sceneEl = this.sceneEl;

    if (time - this.time < this.interval) { return; }
    this.time = time;

    Object.keys(broadcastingEntities).forEach(function broadcast (id) {
      var el = broadcastingEntities[id];
      var components = el.getAttribute('firebase-broadcast').components;
      var data = {};

      // Add components to broadcast once.
      if (!el.firebaseBroadcastOnce && el.getAttribute('firebase-broadcast').componentsOnce) {
        components = components.concat(el.getAttribute('firebase-broadcast').componentsOnce);
        el.firebaseBroadcastOnce = true;
      }

      // Parent.
      if (el.parentNode !== sceneEl) {
        var broadcastData = el.parentNode.getAttribute('firebase-broadcast');
        if (!broadcastData) { return; }  // Wait for parent to initialize.
        data.parentId = broadcastData.id;
      }

      // Build data.
      components.forEach(function getData (componentName) {
        data[componentName] = getComponentProperty(el, componentName, '|');
      });

      // Update entry.
      firebaseWrapper.updateEntity(id, data);
    });
  }
});

/**
 * Broadcast.
 */
AFRAME.registerComponent('firebase-broadcast', {
  schema: {
    id: {default: ''},
    components: {default: ['position', 'rotation']},
    componentsOnce: {default: [], type: 'array'}
  },

  init: function (oldData) {
    var data = this.data;
    var el = this.el;
    var system = el.sceneEl.systems.firebase;

    if (data.components.length) {
      system.registerBroadcast(el);
    }
  }
});
