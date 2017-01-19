/* global AFRAME */

if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.');
}

const EVENTS = {
  axismove: {id: 0, props: ['axis']},
  buttonchanged: {id: 1, props: ['id', 'state']},
  buttondown: {id: 2, props: ['id', 'state']},
  touchstart: {id: 3, props: ['id', 'state']},
  touchend: {id: 4, props: ['id', 'state']},
};

/**
 * WebVR Recorder component for A-Frame.
 */
AFRAME.registerComponent('webvr-recorder', {
  schema: {
    controller1: {type: 'string'},
    controller2: {type: 'string'},
    source: {default: 'LOCAL_STORAGE'}
  },

  init: function () {
    const sceneEl = this.el;

    this.record = [];
    this.camera = null;
    this.controller1 = null;
    this.controller2 = null;
    this.controller1Events = [];
    this.controller2Events = [];

    // Grab WebVR objects to record.
    sceneEl.addEventListener('renderstarted', () => {
      this.camera = sceneEl.camera.el;
      this.controller1 = sceneEl.querySelector(this.data.controller1);
      this.controller2 = sceneEl.querySelector(this.data.controller2);
    });

    if (localStorage.getItem('webvr-recorder')) {
      this.record = JSON.parse(localStorage.getItem('webvr-recorder'));
    }

    window.addEventListener('keyup', evt => {
      // Listen for `r` key.
      if (evt.keyCode !== 82) { return; }

      if (!sceneEl.hasLoaded) { return; }

      // Start replaying if record exists.
      if (this.record.length) {
        this.isReplaying = true;
        return;
      }

      // Stop recording if second press.
      if (this.isRecording) {
        this.isRecording = false;
        localStorage.setItem('webvr-recorder', JSON.stringify(this.record));
        return;
      }

      attachControllerEvents(this.controller1, this.controller1Events);
      attachControllerEvents(this.controller2, this.controller2Events);

      // Tell tick to begin recording.
      this.isRecording = true;
    });
  },

  tick: function (t, dt) {
    if (this.isRecording) {
      this.recordTick();
    } else if (this.isReplaying) {
      this.replayTick();
    }
  },

  recordTick: function () {
    this.record.push({
      time: t,
      c: {
        // Camera.
        p: this.camera.getAttribute('position'),
        r: this.camera.getAttribute('rotation')
      },
      c1: {
        // Controller 1.
        e: this.controller1Events,
        p: this.controller1.getAttribute('position'),
        r: this.controller1.getAttribute('rotation')
      },
      c2: {
        // Controller 2.
        e: this.controller2Events,
        p: this.controller2.getAttribute('position'),
        r: this.controller2.getAttribute('rotation')
      }
    });

    // Reset events array.
    this.controller1Events = [];
    this.controller2Events = [];
  },

  replayTick: function () {
    const record = this.record.shift();

    // Camera.
    syncPose(this.camera, record.c);

    // Controller 1.
    syncPose(this.controller1, record.c1);
    emitEvents(this.controller1, record.c1.e);

    // Controller 2.
    syncPose(this.controller2, record.c2);
    emitEvents(this.controller2, record.c2.e);
  }
});

/**
 * Attach controller event listeners specified in `EVENTS`.
 *
 * @param {Element} controller - Controller entity.
 * @param {Element} controller - Controller events array.
 */
function attachControllerEvents (controller, events) {
  if (!controller) { return; }

  Object.keys(EVENTS).forEach(eventName => {
    controller.addEventListener(eventName, evt => {
      // Pull event details.
      const details = [];
      EVENTS[eventName].props.forEach(propName => {
        details.push(evt.detail[propName]);
      });
      // Add to events array using encoded event name.
      events.push([EVENTS[eventName].id, details]);
    });
  });
}

/**
 * Set pose given the format of the record.
 */
function syncPose (el, elRecord) {
  el.setAttribute('position', elRecord.p);
  el.setAttribute('rotation', elRecord.r);
}

/**
 * Emit events given the format of the record.
 */
function syncPose (el, events) {
  events.forEach(event => {
    const eventName = event[0];

    // Decode event details.
    const eventProps = event[1];
    const eventDetail = {};
    eventProps.forEach((val, i) => {
      eventDetail[EVENTS[eventName].props[i]] = val;
    });

    // Emit.
    el.emit(eventName, eventDetail);
  });
}
