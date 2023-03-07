
AFRAME.registerComponent('vertex-colors-buffer', {
  schema: {
    baseColor: {type: 'color'},
    itemSize: {default: 3}
  },

  update: function (oldData) {
    var colors;
    var data = this.data;
    var i;
    var el = this.el;
    var geometry;
    var mesh;
    var self = this;
    this.colorHelper = new THREE.Color();

    mesh = this.el.getObject3D('mesh');

    if (!mesh || !mesh.geometry) {
      el.addEventListener('object3dset', function reUpdate (evt) {
        if (evt.detail.type !== 'mesh') { return; }
        el.removeEventListener('object3dset', reUpdate);
        self.update(oldData);
      });
      return;
    }

    geometry = mesh.geometry;

    // Empty geometry.
    if (!geometry.attributes.position) {
      console.warn('Geometry has no vertices', el);
      return;
    }

    if (!geometry.attributes.color) {
      geometry.setAttribute('color',
        new THREE.BufferAttribute(
          new Float32Array(geometry.attributes.position.array.length), 3
        )
      );
    }

    colors = geometry.attributes.color.array;

    // TODO: For some reason, incrementing loop by 3 doesn't work. Need to do by 4 for glTF.
    this.colorHelper.set(data.baseColor);
    for (i = 0; i < colors.length; i += data.itemSize) {
      colors[i] = this.colorHelper.r;
      colors[i + 1] = this.colorHelper.g;
      colors[i + 2] = this.colorHelper.b;
    }

    geometry.attributes.color.needsUpdate = true;

    //mesh.material.color = new THREE.Color('#fff')
    //mesh.material.vertexColors = true
  }
});
