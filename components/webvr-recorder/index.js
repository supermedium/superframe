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

const EVENTS_DECODE = {
  0: 'axismove',
  1: 'buttonchanged',
  2: 'buttondown',
  3: 'touchstart',
  4: 'touchend'
};

/**
 * WebVR Recorder component for A-Frame.
 */
AFRAME.registerComponent('webvr-recorder', {
  schema: {
    controller1: {default: '#controller1', type: 'string'},
    controller2: {default: '#controller2', type: 'string'},
    source: {default: 'webvr-recorder.json'}
  },

  init: function () {
    const data = this.data;
    const sceneEl = this.el;

    this.record = [];
    this.replayRecord = null;
    this.camera = null;
    this.controller1 = null;
    this.controller2 = null;
    this.controller1Events = [];
    this.controller2Events = [];

    this.downloadLink = createDownloadLink();
    this.downloadLink.setAttribute('download', data.source);
    document.body.appendChild(this.downloadLink);

    // Grab WebVR objects to record.
    sceneEl.addEventListener('renderstart', () => {
      this.camera = sceneEl.camera.el;
      this.controller1 = sceneEl.querySelector(data.controller1);
      this.controller2 = sceneEl.querySelector(data.controller2);
    });

    if (localStorage.getItem('webvr-recorder')) {
      console.log('Loaded recording from localStorage[\'webvr-recorder\'].');
      this.record = JSON.parse(localStorage.getItem('webvr-recorder'));
    } else {
      new THREE.XHRLoader().load(data.source, data => {
        console.log('Loaded recording from', data.source + '.');
        this.record = JSON.parse(data);
      }, () => {}, err => {
        console.log('No recording found at', data.source,
                    '. Press `r` to start recording.');
      });
    }

    window.addEventListener('keyup', evt => {
      // Listen for `r` key.
      if (evt.keyCode !== 82) { return; }

      if (!sceneEl.hasLoaded) { return; }

      // Stop recording if second press.
      if (this.isRecording) {
        var serializedRecord = JSON.stringify(this.record);
        console.log('Stopped recording.');
        this.isRecording = false;
        // Save.
        console.log(serializedRecord);
        console.log('Saving to localStorage and ', data.source);
        localStorage.setItem('webvr-recorder', serializedRecord);
        this.downloadLink.setAttribute(
          'href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(serializedRecord));
        this.downloadLink.style.display = 'block';
        return;
      }

      // Pause replay.
      if (this.isReplaying) {
        console.log('Paused replay.');
        this.isReplaying = false;
        return;
      }

      // Resume replay.
      if (this.replayRecord && this.replayRecord.length) {
        console.log('Resuming replay.');
        this.isReplaying = true;
        return;
      }

      // Start replaying if record exists.
      if (this.record.length) {
        console.log('Starting replay!');
        this.isReplaying = true;
        this.replayRecord = AFRAME.utils.clone(this.record);
        return;
      }

      attachControllerEvents(this.controller1, this.controller1Events);
      attachControllerEvents(this.controller2, this.controller2Events);

      // Tell tick to begin recording.
      console.log('Starting recording!');
      console.log(this.camera, this.controller1, this.controller2);
      this.isRecording = true;
    });
  },

  tick: function (t, dt) {
    if (this.isRecording) {
      this.recordTick(t);
    } else if (this.isReplaying) {
      this.replayTick(t);
    }
  },

  recordTick: function (t) {
    this.record.push({
      c: {
        // Camera.
        p: serializeVec3(this.camera.getAttribute('position')),
        r: serializeVec3(this.camera.getAttribute('rotation'))
      },
      c1: {
        // Controller 1.
        e: this.controller1Events,
        p: serializeVec3(this.controller1.getAttribute('position')),
        r: serializeVec3(this.controller1.getAttribute('rotation'))
      },
      c2: {
        // Controller 2.
        e: this.controller2Events,
        p: serializeVec3(this.controller2.getAttribute('position')),
        r: serializeVec3(this.controller2.getAttribute('rotation'))
      }
    });

    // Reset events array.
    this.controller1Events.length = 0;
    this.controller2Events.length = 0;
  },

  replayTick: function (t) {
    const record = this.replayRecord.shift();

    if (!record) {
      console.log('Finished replaying.');
      this.isReplaying = false;
      return;
    }

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
      console.log('Recorded event', eventName + '.');
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
function emitEvents (el, events) {
  events.forEach(event => {
    const eventName = EVENTS_DECODE[event[0]];

    // Decode event details.
    const eventProps = event[1];
    const eventDetail = {};
    eventProps.forEach((val, i) => {
      eventDetail[EVENTS[eventName].props[i]] = val;
    });

    // Emit.
    console.log('Replay emitted', eventName + '.');
    el.emit(eventName, eventDetail);
  });
}

function createDownloadLink () {
  var link = document.createElement('a');
  link.innerHTML = 'Download Recording';
  link.style.background = '#333';
  link.style.color = '#FAFAFA';
  link.style.display = 'none';
  link.style.padding = '10px';
  link.style.position = 'fixed';
  link.style.bottom = 0;
  link.style.left = 0;
  link.style.zIndex = 9999;
  return link;
}

function serializeVec3 (vec3) {
  return vec3.x + ' ' + vec3.y + ' ' + vec3.z;
}
