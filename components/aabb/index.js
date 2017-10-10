/* global AFRAME, THREE */

if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.');
}

// Configuration for the MutationObserver used to refresh the whitelist.
// Listens for addition/removal of elements and attributes within the scene.
var OBSERVER_CONFIG = {
  childList: true,
  attributes: true,
  subtree: true
};

/**
 * Implement AABB collision detection for entities with a mesh.
 * https://en.wikipedia.org/wiki/Minimum_bounding_box#Axis-aligned_minimum_bounding_box
 *
 * @property {string} objects - Selector of entities to test for collision.
 */
AFRAME.registerComponent('aabb-collider', {
  schema: {
    collideNonVisible: {default: false},
    debug: {default: false},
    enabled: {default: true},
    interval: {default: 80},
    objects: {default: ''}
  },

  init: function () {
    this.clearedIntersectedEls = [];
    this.boundingBox = new THREE.Box3();
    this.boxHelper = new THREE.BoxHelper();
    this.boxMax = new THREE.Vector3();
    this.boxMin = new THREE.Vector3();
    this.intersectedEls = [];
    this.objectEls = [];
    this.newIntersectedEls = [];
    this.prevCheckTime = undefined;
    this.previousIntersectedEls = [];

    this.setDirty = this.setDirty.bind(this);
    this.observer = new MutationObserver(this.setDirty);
    this.dirty = true;

    this.hitStartEventDetail = {intersectedEls: this.newIntersectedEls};
  },

  play: function () {
    this.observer.observe(this.el.sceneEl, OBSERVER_CONFIG);
    this.el.sceneEl.addEventListener('object3dset', this.setDirty);
    this.el.sceneEl.addEventListener('object3dremove', this.setDirty);
  },

  remove: function () {
    this.observer.disconnect();
    this.el.sceneEl.removeEventListener('object3dset', this.setDirty);
    this.el.sceneEl.removeEventListener('object3dremove', this.setDirty);
  },

  tick: function (time) {
    var boxHelper;
    var boundingBox = this.boundingBox;
    var clearedIntersectedEls = this.clearedIntersectedEls;
    var intersectedEls = this.intersectedEls;
    var el = this.el;
    var i;
    var mesh;
    var newIntersectedEls = this.newIntersectedEls;
    var objectEls = this.objectEls;
    var prevCheckTime = this.prevCheckTime;
    var previousIntersectedEls = this.previousIntersectedEls;
    var self = this;

    if (!this.data.enabled) { return; }

    // Only check for intersection if interval time has passed.
    if (prevCheckTime && (time - prevCheckTime < this.data.interval)) { return; }
    // Update check time.
    this.prevCheckTime = time;

    // No mesh, no collisions
    mesh = el.getObject3D('mesh');
    if (!mesh) { return; }

    if (this.dirty) { this.refreshObjects(); }

    // Update the bounding box to account for rotations and position changes.
    boundingBox.setFromObject(mesh);
    this.boxMin.copy(boundingBox.min);
    this.boxMax.copy(boundingBox.max);

    if (this.data.debug) {
      this.boxHelper.setFromObject(mesh);
      if (!this.boxHelper.parent) { el.sceneEl.object3D.add(this.boxHelper); }
    }

    copyArray(previousIntersectedEls, intersectedEls);

    // Populate intersectedEls array.
    intersectedEls.length = 0;
    for (i = 0; i < objectEls.length; i++) {
      // Don't collide with non-visible if flag set.
      if (!this.data.collideNonVisible && !objectEls[i].getAttribute('visible')) {
        // Remove box helper if debug flag set and has box helper.
        if (this.data.debug) {
          boxHelper = objectEls[i].getObject3D('mesh').boxHelper;
          if (boxHelper) {
            el.sceneEl.object3D.remove(boxHelper);
            objectEls[i].getObject3D('mesh').boxHelper = null;
          }
        }
        continue;
      }

      // Check for interection.
      if (this.isIntersecting(objectEls[i])) { intersectedEls.push(objectEls[i]); }
    }

    newIntersectedEls.length = 0;
    for (i = 0; i < intersectedEls.length; i++) {
      if (previousIntersectedEls.indexOf(intersectedEls[i]) === -1) {
        newIntersectedEls.push(intersectedEls[i]);
      }
    }

    // Emit cleared events on no longer intersected entities.
    clearedIntersectedEls.length = 0;
    for (i = 0; i < previousIntersectedEls.length; i++) {
      if (intersectedEls.indexOf(previousIntersectedEls[i]) === -1) {
        if (!previousIntersectedEls[i].hasAttribute('aabb-collider')) {
          previousIntersectedEls[i].emit('hitend');
          previousIntersectedEls[i].emit('raycaster-intersected-cleared');
        }
        clearedIntersectedEls.push(previousIntersectedEls[i]);
      }
    }

    // Emit events on intersected entities.
    for (i = 0; i < newIntersectedEls.length; i++) {
      if (!newIntersectedEls[i].hasAttribute('aabb-collider')) {
        newIntersectedEls[i].emit('hitstart');
        newIntersectedEls[i].emit('raycaster-intersected');
      }
    }

    if (clearedIntersectedEls.length) {
      el.emit('hitend');
      el.emit('raycaster-intersection-cleared');
    }

    if (newIntersectedEls.length) {
      el.emit('hitstart', this.hitStartEventDetail);
      el.emit('raycaster-intersection');
    }
  },

  /**
   * AABB collision detection.
   * 3D version of https://www.youtube.com/watch?v=ghqD3e37R7E
   */
  isIntersecting: (function () {
    var boundingBox = new THREE.Box3();

    return function (el) {
      var isIntersecting;
      var mesh;
      var boxHelper;
      var boxMin;
      var boxMax;

      mesh = el.getObject3D('mesh');
      if (!mesh) { return; }

      boundingBox.setFromObject(mesh);

      if (this.data.debug) {
        if (!mesh.boxHelper) {
          mesh.boxHelper = new THREE.BoxHelper(
            mesh, new THREE.Color(Math.random(), Math.random(), Math.random()));
          el.sceneEl.object3D.add(mesh.boxHelper);
        }
        mesh.boxHelper.setFromObject(mesh);
        console.log("YEH");
      }

      boxMin = boundingBox.min;
      boxMax = boundingBox.max;
      return (this.boxMin.x <= boxMax.x && this.boxMax.x >= boxMin.x) &&
             (this.boxMin.y <= boxMax.y && this.boxMax.y >= boxMin.y) &&
             (this.boxMin.z <= boxMax.z && this.boxMax.z >= boxMin.z);
    };
  })(),

  /**
   * Mark the object list as dirty, to be refreshed before next raycast.
   */
  setDirty: function () {
    this.dirty = true;
  },

  /**
   * Update list of objects to test for intersection.
   */
  refreshObjects: function () {
    var data = this.data;
    // If objects not defined, intersect with everything.
    this.objectEls = data.objects
      ? this.el.sceneEl.querySelectorAll(data.objects)
      : this.el.sceneEl.children;
    this.dirty = false;
  }
});

function copyArray (dest, source) {
  var i;
  dest.length = 0; for (i = 0; i < source.length; i++) {
    dest[i] = source[i];
  }
}
