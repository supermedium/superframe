
AFRAME.registerComponent('vertex-colors-buffer', {
  schema: {
    baseColor: {type: 'color'},
    itemSize: {default: 3}
  },

  update: function (oldData) {
    var data = this.data;
    var el = this.el;
    var geometry;
    var mesh;
    var self = this;

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

    AFRAME.utils.setBufferGeometryColor(geometry, data.baseColor)

  }
});
