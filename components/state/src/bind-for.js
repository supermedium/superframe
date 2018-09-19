var lib = require('./lib/');

/**
 * Render array from state.
 */
AFRAME.registerComponent('bind-for', {
  schema: {
    for: {type: 'string'},
    in: {type: 'string'},
    key: {type: 'string'},
    template: {type: 'string'}
  },

  init: function () {
    // Subscribe to store and register handler to do data-binding to components.
    this.system = this.el.sceneEl.systems.state;
    this.onStateUpdate = this.onStateUpdate.bind(this);

    this.keysToWatch = [];
    this.renderedKeys = [];  // Keys that are currently rendered.
    this.system.subscribe(this);
  },

  update: function () {
    this.keysToWatch[0] = lib.split(this.data.in, '.')[0];
    if (this.el.children[0] && this.el.children[0].tagName === 'TEMPLATE') {
      this.template = this.el.children[0].innerHTML.trim();
    } else {
      this.template = document.querySelector(this.data.template).innerHTML.trim();
    }
    this.onStateUpdate();
  },

  /**
   * Handle state update.
   */
  onStateUpdate: (function () {
    var keys = [];
    var toRemove = [];

    return function () {
      var bindForKey;
      var child;
      var data = this.data;
      var el = this.el;
      var i;
      var isSimpleList;
      var list;
      var key;
      var keyValue;
      var item;
      var needsAddition;

      try {
        list = lib.select(this.system.state, data.in);
      } catch (e) {
        throw new Error(`[aframe-state-component] Key '${data.in}' not found in state.` +
                        ` #${el.getAttribute('id')}[${this.attrName}]`);
      }

      keys.length = 0;
      for (i = 0; i < list.length; i++) {
        item = list[i];

        // If key not defined, use index (e.g., array of strings).
        bindForKey = data.key ? item[data.key].toString() : i.toString();
        keyValue = data.key ? item[data.key].toString() : item.toString();
        keys.push(keyValue);

        // Add item.
        if (this.renderedKeys.indexOf(keyValue) === -1) {
          el.appendChild(this.system.renderTemplate(this.template, item));
          el.children[el.children.length - 1].setAttribute('data-bind-for-key', bindForKey);
          if (!data.key) {
            el.children[el.children.length - 1].setAttribute('data-bind-for-value', item);
          }
          this.renderedKeys.push(keyValue);
        }
      }

      // Remove items.
      toRemove.length = 0;
      for (i = 0; i < el.children.length; i++) {
        if (el.children[i].tagName === 'TEMPLATE') { continue; }
        key = data.key ?
          el.children[i].getAttribute('data-bind-for-key') :
          el.children[i].getAttribute('data-bind-for-value');
        if (keys.indexOf(key) === -1) {
          toRemove.push(el.children[i]);
          this.renderedKeys.splice(this.renderedKeys.indexOf(key), 1);
        }
      }
      for (i = 0; i < toRemove.length; i++) {
        toRemove[i].parentNode.removeChild(toRemove[i]);
      }

      // Update bind-for-key indices for list of strings in case of re-order.
      if (list.length && list[0].constructor === String) {
        for (i = 0; i < list.length; i++) {
          child = el.querySelector('[data-bind-for-value="' + list[i] + '"]');
          if (child) {
            child.setAttribute('data-bind-for-key', i.toString());
          }
        }
      }

      this.el.emit('bindforrender', null, false);
    };
  })()
});

