var debug = AFRAME.utils.debug;
var io = require('socket.io-client');

var info = debug('aframe-broadcast-component:info');

if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.');
}

AFRAME.registerSystem('broadcast', {
  init: function () {
    var sceneEl = this.sceneEl;
    var url = sceneEl.getAttribute('broadcast').url;

    if (!url) { return; }

    this.socket = io(url);

    this.socket.on('connect', function () {
      info('Connected', url);
    });

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
          el.setAttribute(component[0], component[1]);
        });
      });
    });

    this.sendQueue = [];
  },

  addSend: function (el, sendComponents) {
    if (!el.getAttribute('id')) {
      el.setAttribute('id', guid());
    }

    this.sendQueue.push(function send () {
      return {
        id: el.getAttribute('id'),
        parentId: el.parentNode.getAttribute('id'),
        components: sendComponents.map(function getAttribute (componentName) {
          return [componentName, el.getComputedAttribute(componentName)];
        })
      };
    });
  },

  tick: function (time, dt) {
    if (time - this.time < 10) { return; }
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
