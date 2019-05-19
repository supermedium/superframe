AFRAME.registerSystem('render-order', {
  schema: {type: 'array'},

  init: function () {
    this.el.renderer.sortObjects = true;
  },

  update: function () {
    this.order = {};
    for (i = 0; i < this.data.length; i++) {
      this.order[this.data[i]] = i;
    }
  }
});

AFRAME.registerComponent('render-order', {
  schema: {type: 'string'},

  multiple: true,

  init: function () {
    this.set = this.set.bind(this);
    this.el.addEventListener('object3dset', evt => {
      if (this.id !== 'nonrecursive') {
        evt.detail.object.traverse(this.set);
      }
    });
  },

  update: function () {
    if (this.id === 'nonrecursive') {
      this.set(this.el.object3D);
    } else {
      this.el.object3D.traverse(this.set);
    }
  },

  set: function (node) {
    // String (named order).
    if (isNaN(this.data)) {
      node.renderOrder = this.system.order[this.data];
    } else {
      node.renderOrder = parseFloat(this.data);
    }
  }
});

AFRAME.registerComponent('render-order-recursive', {
  init: function () {
    this.el.addEventListener('child-attached', evt => {
      evt.detail.el.setAttribute('render-order', this.el.getAttribute('render-order'));
    });
  }
});
