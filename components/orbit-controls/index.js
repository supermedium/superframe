require('./lib/OrbitControls');

var bind = AFRAME.utils.bind;

AFRAME.registerComponent('orbit-controls', {
  dependencies: ['camera'],

  schema: {
    autoRotate: {type: 'boolean'},
    autoRotateSpeed: {default: 2},
    dampingFactor: {default: 0.1},
    enabled: {default: true},
    enableDamping: {default: true},
    enableKeys: {default: true},
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
    minZoom: {default: 0},
    panSpeed: {default: 1},
    rotateSpeed: {default: 0.05},
    screenSpacePanning: {default: false},
    target: {type: 'vec3'},
    zoomSpeed: {default: 0.5}
  },

  init: function () {
    var el = this.el;
    var oldPosition;

    oldPosition = new THREE.Vector3();

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
    el.getObject3D('camera').position.copy(this.data.initialPosition);
  },

  pause: function () {
    this.controls.dispose();
  },

  play: function () {
    const el = this.el;
    this.controls = new THREE.OrbitControls(el.getObject3D('camera'), el.sceneEl.renderer.domElement);
    this.update();
  },

  onEnterVR: function() {
    var el = this.el;

    if (!AFRAME.utils.device.checkHeadsetConnected() &&
        !AFRAME.utils.device.isMobile()) { return; }
    this.controls.enabled = false;
    if (el.hasAttribute('look-controls')) {
      el.setAttribute('look-controls', 'enabled', true);
      oldPosition.copy(el.getObject3D('camera').position);
      el.getObject3D('camera').position.set(0, 0, 0);
    }
  },

  onExitVR: function() {
    var el = this.el;

    if (!AFRAME.utils.device.checkHeadsetConnected() &&
        !AFRAME.utils.device.isMobile()) { return; }
    this.controls.enabled = true;
    el.getObject3D('camera').position.copy(oldPosition);
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
    controls.autoRotate = data.autoRotate;
    controls.autoRotateSpeed = data.autoRotateSpeed;
    controls.dampingFactor = data.dampingFactor;
    controls.enabled = data.enabled;
    controls.enableDamping = data.enableDamping;
    controls.enableKeys = data.enableKeys;
    controls.enablePan = data.enablePan;
    controls.enableRotate = data.enableRotate;
    controls.enableZoom = data.enableZoom;
    controls.keyPanSpeed = data.keyPanSpeed;
    controls.maxPolarAngle = THREE.Math.degToRad(data.maxPolarAngle);
    controls.maxAzimuthAngle = THREE.Math.degToRad(data.maxAzimuthAngle);
    controls.maxDistance = data.maxDistance;
    controls.minDistance = data.minDistance;
    controls.minPolarAngle = THREE.Math.degToRad(data.minPolarAngle);
    controls.minAzimuthAngle = THREE.Math.degToRad(data.minAzimuthAngle);
    controls.minZoom = data.minZoom;
    controls.panSpeed = data.panSpeed;
    controls.rotateSpeed = data.rotateSpeed;
    controls.screenSpacePanning = data.screenSpacePanning;
    controls.zoomSpeed = data.zoomSpeed;
  },

  tick: function () {
    var controls = this.controls;
    var data = this.data;
    if (!data.enabled) { return; }
    if (controls.enabled && (controls.enableDamping || controls.autoRotate)) {
      this.controls.update();
    }
  },

  remove: function() {
    this.controls.reset();
    this.controls.dispose();

    this.el.sceneEl.removeEventListener('enter-vr', this.onEnterVR);
    this.el.sceneEl.removeEventListener('exit-vr', this.onExitVR);
  }
});
