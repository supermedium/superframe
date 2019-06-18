var debug = AFRAME.utils.debug;
var io = require('socket.io-client');

var info = debug('aframe-broadcast-component:info');

if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.');
}

AFRAME.registerSystem('broadcast', {
  schema: {
    url: {type: 'string', default: 'http://localhost:12000'},
    interval: {type: 'number', default: 10}
  },
  init: function () {
    var sceneEl = this.el.sceneEl;
    var url = this.data.url;
    if (!url) { return; }

    this.socket = io(url);

    this.socket.on('connect', function () {
      info('Connected', url);
    });

    this.sendQueue = [];
    this.helperQuaternionReceive = new THREE.Quaternion();
    this.helperQuaternionSend = new THREE.Quaternion();

    var that = this;

    this.socket.on('broadcast', function (data) {
      data.forEach(function syncState (entity) {
        var el = sceneEl.querySelector('#' + entity.id);

        if (!el) {
          var parentEl = sceneEl.querySelector('#' + entity.parentId) || sceneEl;
          el = document.createElement('a-entity');
          el.setAttribute('id', entity.id);
          parentEl.appendChild(el);
        }

        entity.components.forEach(function setAttribute (component) {
          if (component[0] === "rotation") {
            that.helperQuaternionReceive.fromArray(component[1]);
            el.object3D.setRotationFromQuaternion(that.helperQuaternionReceive);
          } else {
            el.setAttribute(component[0], component[1]);
          };
        });
      });
    });
  },

  addSend: function (el, sendComponents) {
    if (!el.getAttribute('id')) {
      el.setAttribute('id', guid());
    }
    var that = this;
    this.sendQueue.push(function send () {
      return {
        id: el.getAttribute('id'),
        parentId: el.parentNode.getAttribute('id'),
        components: sendComponents.map(function getAttribute (componentName) {
          if (componentName === "rotation") {
            that.helperQuaternionSend.copy(el.object3D.quaternion);
            return [componentName, that.helperQuaternionSend.toArray()];
          } else {
            return [componentName, el.getAttribute(componentName)];
          };
        })
      };
    });
  },

  tick: function (time, dt) {
    if (time - this.time < this.data.interval) { return; }
    this.time = time;

    this.socket.emit('broadcast', this.sendQueue.map(function call (getSend) {
      return getSend();
    }));
  }
});

/**
 * Broadcast component for A-Frame.
 */
AFRAME.registerComponent('broadcast', {
  schema: {
    url: {type: 'string'},
    send: {type: 'array', default: ['position', 'rotation']}
  },

  init: function () {
    var data = this.data;
    var el = this.el;
    var system = this.system;

    if (el.isScene || !data.send.length) { return; }
    system.addSend(el, data.send);
  }
});

function guid() {
  var text = '';
  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  for (var i = 0; i < 5; i++) {
    text += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return text;
}
