window.download = require('./lib/download');
window.GIF = require('./lib/gif').GIF;
var Capture = require('./lib/CCapture.js');

/* global AFRAME */
if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.');
}

/**
 * Camera recorder component for A-Frame.
 *
 * tilt, pan, dolly
 */
AFRAME.registerComponent('camera-recorder', {
  dependencies: ['camera'],

  schema: {
    dur: {default: 3000},
    enabled: {default: true},
    framerate: {default: 60},
    lookAt: {type: 'vec3'},
    holdTimeAfter: {default: 250},
    motionBlurEnabled: {default: true},
    name: {default: ''},
    quality: {default: 10},
    positionFrom: {type: 'vec3'},
    positionTo: {type: 'vec3'},
    rotationFrom: {type: 'vec3'},
    rotationTo: {type: 'vec3'},
    showControls: {default: true},
    workers: {default: 8},
    workerPath: {default: './'}
  },

  multiple: true,

  init: function () {
    var data = this.data;

    // Bind.
    this.startRecordingBound = () => { this.startRecording(false); };
    this.startPreviewingBound = () => { this.startRecording(true); };

    if (this.data.showControls) {
      this.injectRecordButton();
      this.injectDryRunButton();
    }

    // Create CCapture.
    this.capture = new Capture({
      format: 'gif',
      name: data.name || undefined,
      motionBlurFrames: data.motionBlurEnabled ? 1 : 0,
      onProgress: progress => {
        this.el.emit('camerarecorderprogress', progress, false);
      },
      quality: data.quality,
      workers: data.workers,
      workersPath: data.workerPath
    });

    this.lookAt = new THREE.Vector3();
    this.originalPosition = new THREE.Vector3();
    this.originalQuaternion = new THREE.Quaternion();
    this.originalCameraPosition = new THREE.Vector3();
    this.originalCameraQuaternion = new THREE.Quaternion();
  },

  update: function () {
    var data = this.data;
    var domAttributes;
    var el = this.el;

    this.time = 0;

    // To tell what is developer-defined.
    domAttributes = this.el.getDOMAttribute('camera-recorder');

    if ('positionTo' in domAttributes) {
      el.setAttribute('animation__recorderposition', {
        property: 'position',
        dur: data.dur,
        easing: 'linear',
        from: 'positionFrom' in domAttributes
          ? data.positionFrom
          : el.getAttribute('position'),
        startEvents: 'camerarecorderanimationstart',
        pauseEvents: 'camerarecorderanimationstop',
        to: data.positionTo,
      });
    }

    if ('rotationTo' in domAttributes) {
      el.setAttribute('animation__recorderrotation', {
        property: 'rotation',
        dur: data.dur,
        easing: 'linear',
        from: 'rotationFrom' in domAttributes
          ? data.rotationFrom
          : el.getAttribute('rotation'),
        startEvents: 'camerarecorderanimationstart',
        pauseEvents: 'camerarecorderanimationstop',
        to: data.rotationTo
      });
    }

    if ('lookAt' in domAttributes) {
      this.lookAt.copy(data.lookAt);
    }
  },

  play: function () {
    var el = this.el;
    el.addEventListener('camerarecorderstart', this.startRecordingBound);
    el.addEventListener('camerarecorderdrystart', this.startPreviewingBound);

    // Toggle off controls and set flag to see if we need to remove later.
    if (el.hasAttribute('look-controls') && el.getAttribute('look-controls').enabled) {
      el.setAttribute('look-controls', 'enabled', false);
      this.flippedLookControls = true;
    }

    if (el.hasAttribute('orbit-controls') && el.getAttribute('orbit-controls').enabled) {
      el.setAttribute('orbit-controls', 'enabled', false);
      this.flippedOrbitControls = true;
    }

    this.resetPose();
  },

  remove: function () {
    var el = this.el;
    el.emit('camerarecorderanimationstop', null, false);

    el.removeEventListener('camerarecorderstart', this.startRecordingBound);
    el.removeEventListener('camerarecorderdrystart', this.startPreviewingBound);

    // Re-enable controls if they were enabled before.
    if (this.flippedLookControls) {
      el.setAttribute('look-controls', 'enabled', true);
    }
    if (this.flippedOrbitControls) {
      el.setAttribute('orbit-controls', 'enabled', true);
    }

    setTimeout(() => {
      el.object3D.position.copy(this.originalPosition);
      el.object3D.quaternion.copy(this.originalQuaternion);
      el.getObject3D('camera').position.copy(this.originalCameraPosition);
      el.getObject3D('camera').quaternion.copy(this.originalCameraQuaternion);
    });
  },

  tick: function () {
    if (!this.isRecording && !this.isPreviewing) { return; }
    if (this.lookAt) {
      this.el.object3D.lookAt(this.lookAt);
    }
  },

  tock: function (t, dt) {
    if (!this.isRecording && !this.isPreviewing) { return; }

    this.time += dt;

    // Finished.
    if (this.time > this.data.dur + this.data.holdTimeAfter) {
      this.time = 0;

      setTimeout(() => {
        this.resetPose();
      }, this.data.holdTimeAfter + 100);

      if (this.isPreviewing) {
        this.isPreviewing = false;
        return;
      }

      this.isRecording = false;
      this.capture.stop();
      this.capture.save();
      if (this.recordButton) {
        this.recordButton.setAttribute('disabled', '');
        this.recordButton.innerHTML = 'Processing...';
      }
      return;
    }

    if (this.isRecording) {
      this.capture.capture(this.el.sceneEl.canvas);
    }
  },

  resetPose: function () {
    this.originalPosition.copy(this.el.object3D.position);
    this.originalQuaternion.copy(this.el.object3D.quaternion);
    this.originalCameraPosition.copy(this.el.getObject3D('camera').position);
    this.originalCameraQuaternion.copy(this.el.getObject3D('camera').quaternion);
  },

  startRecording: function (isDryRun) {
    this.el.emit('camerarecorderanimationstart');

    this.el.object3D.position.set(0, 0, 0);
    this.el.object3D.rotation.set(0, 0, 0);

    setTimeout(() => {
      if ('lookAt' in this.el.getDOMAttribute('camera-recorder')) {
        this.el.getObject3D('camera').rotation.y = Math.PI;
      }
      if (isDryRun) {
        this.isPreviewing = true;
        return;
      }

      this.capture.start();
      this.isRecording = true;
    });
  },

  injectRecordButton: function () {
    var button;
    button = document.createElement('button');
    button.innerHTML = 'Start recording';
    button.style.left = '5px';
    button.style.position = 'fixed';
    button.style.top = '5px';
    button.style.zIndex = 999999999999;
    document.body.appendChild(button);

    button.addEventListener('click', () => {
      this.startRecording();
    });

    this.recordButton = button;
  },

  injectDryRunButton: function () {
    var button;
    button = document.createElement('button');
    button.innerHTML = 'Preview recording';
    button.style.left = '5px';
    button.style.position = 'fixed';
    button.style.top = '30px';
    button.style.zIndex = 999999999999;
    document.body.appendChild(button);

    button.addEventListener('click', () => {
      this.startRecording(true);
    });
  }
});
