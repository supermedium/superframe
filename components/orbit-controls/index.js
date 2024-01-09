import { OrbitControls } from './lib/OrbitControls.js';
THREE.OrbitControls = OrbitControls

var bind = AFRAME.utils.bind;

AFRAME.registerComponent('orbit-controls', {
  dependencies: ['camera'],

  schema: {
    autoRotate: {type: 'boolean'},
    autoRotateSpeed: {default: 2},
    cursor: {type: 'vec3'},
    dampingFactor: {default: 0.1},
    enabled: {default: true},
    enableDamping: {default: true},
    enablePan: {default: true},
    enableRotate: {default: true},
    enableZoom: {default: true},
    initialPosition: {type: 'vec3'},
    keyPanSpeed: {default: 7},
    minAzimuthAngle: {type: 'number', default: - Infinity},
    maxAzimuthAngle: {type: 'number', default: Infinity},
    maxDistance: {default: 1000},
    maxPolarAngle: {default: AFRAME.utils.device.isMobile() ? 90 : 120},
    minDistance: {default: 1},
    minPolarAngle: {default: 0},
    minTargetRadius: {type: 'number', default: 0},
    maxTargetRadius: {type: 'number', default: Infinity},
    minZoom: {default: 0},
    maxZoom: {type: 'number', default: Infinity},
    panSpeed: {default: 1},
    rotateSpeed: {default: 0.05},
    screenSpacePanning: {default: false},
    target: {type: 'vec3'},
    zoomSpeed: {default: 0.5},
    zoomToCursor: {default: false}
  },

  init: function () {
    var el = this.el;
    this.oldPosition = new THREE.Vector3();

    this.bindMethods();
    el.sceneEl.addEventListener('enter-vr', this.onEnterVR);
    el.sceneEl.addEventListener('exit-vr', this.onExitVR);

    document.body.style.cursor = 'grab';
    document.addEventListener('mousedown', () => {
      document.body.style.cursor = 'grabbing';
    });
    document.addEventListener('mouseup', () => {
      document.body.style.cursor = 'grab';
    });

    this.target = new THREE.Vector3();
    this.cursor = new THREE.Vector3();
    el.getObject3D('camera').position.copy(this.data.initialPosition);
    if (el.hasAttribute('look-controls')) {
      el.setAttribute('look-controls', 'enabled', false);
    }
    if (el.hasAttribute('wasd-controls')) {
      el.setAttribute('wasd-controls', 'enabled', false);
    }
  },

  pause: function () {
    this.controls.dispose();
  },

  play: function () {
    const el = this.el;
    this.controls = new THREE.OrbitControls(el.getObject3D('camera'), el.sceneEl.renderer.domElement);
    this.update();
    this.controls.saveState();
  },

  onEnterVR: function() {
    var el = this.el;

    if (!AFRAME.utils.device.checkHeadsetConnected() &&
        !AFRAME.utils.device.isMobile()) { return; }
    this.controls.enabled = false;
    if (el.hasAttribute('look-controls')) {
      el.setAttribute('look-controls', 'enabled', true);
      this.oldPosition.copy(el.getObject3D('camera').position);
      el.getObject3D('camera').position.set(0, 0, 0);
    }
  },

  onExitVR: function() {
    var el = this.el;

    if (!AFRAME.utils.device.checkHeadsetConnected() &&
        !AFRAME.utils.device.isMobile()) { return; }
    this.controls.enabled = true;
    el.getObject3D('camera').position.copy(this.oldPosition);
    if (el.hasAttribute('look-controls')) {
      el.setAttribute('look-controls', 'enabled', false);
    }
  },

  bindMethods: function() {
    this.onEnterVR = bind(this.onEnterVR, this);
    this.onExitVR = bind(this.onExitVR, this);
  },

  update: function (oldData) {
    var controls = this.controls;
    var data = this.data;

    if (!controls) { return; }

    controls.target = this.target.copy(data.target);
    controls.cursor = this.cursor.copy(data.cursor);
    controls.autoRotate = data.autoRotate;
    controls.autoRotateSpeed = data.autoRotateSpeed;
    controls.dampingFactor = data.dampingFactor;
    controls.enabled = data.enabled;
    controls.enableDamping = data.enableDamping;
    controls.enablePan = data.enablePan;
    controls.enableRotate = data.enableRotate;
    controls.enableZoom = data.enableZoom;
    controls.keyPanSpeed = data.keyPanSpeed;
    controls.maxPolarAngle = THREE.MathUtils.degToRad(data.maxPolarAngle);
    controls.maxAzimuthAngle = THREE.MathUtils.degToRad(data.maxAzimuthAngle);
    controls.maxDistance = data.maxDistance;
    controls.minDistance = data.minDistance;
    controls.minPolarAngle = THREE.MathUtils.degToRad(data.minPolarAngle);
    controls.minTargetRadius = data.minTargetRadius;
    controls.maxTargetRadius = data.maxTargetRadius;
    controls.minAzimuthAngle = THREE.MathUtils.degToRad(data.minAzimuthAngle);
    controls.minZoom = data.minZoom;
    controls.maxZoom = data.maxZoom;
    controls.panSpeed = data.panSpeed;
    controls.rotateSpeed = data.rotateSpeed;
    controls.screenSpacePanning = data.screenSpacePanning;
    controls.zoomSpeed = data.zoomSpeed;
    controls.zoomToCursor = data.zoomToCursor;
  },

  tick: function (t, dt) {
    var controls = this.controls;
    var data = this.data;
    if (!data.enabled) { return; }
    if (controls.enabled && (controls.enableDamping || controls.autoRotate)) {
      this.controls.update(dt / 1000);
    }
  },

  remove: function() {
    this.controls.reset();
    this.controls.dispose();
    if (this.el.hasAttribute('look-controls')) {
      this.el.setAttribute('look-controls', 'enabled', true);
    }
    if (this.el.hasAttribute('wasd-controls')) {
      this.el.setAttribute('wasd-controls', 'enabled', true);
    }

    this.el.sceneEl.removeEventListener('enter-vr', this.onEnterVR);
    this.el.sceneEl.removeEventListener('exit-vr', this.onExitVR);
  }
});
