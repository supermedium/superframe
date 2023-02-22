if (!THREE.BufferGeometryUtils) {
  require('./lib/BufferGeometryUtils');
}

AFRAME.registerComponent('geometry-merger', {
  schema: {
    preserveOriginal: {default: false}
  },

  init: function () {
    var geometries = [];
    this.vertexIndex = {};
    var self = this;
    var vertexCount = 0;

    this.el.object3D.updateMatrixWorld()
    this.el.object3D.traverse(function (mesh) {
      if (mesh.type !== 'Mesh' || mesh.el === self.el) { return; }
      var geometry = mesh.geometry.clone();
      var currentMesh = mesh;
      while (currentMesh !== self.el.object3D) {
        geometry.applyMatrix4(currentMesh.parent.matrix);
        currentMesh = currentMesh.parent;
      }
      geometries.push(geometry);

      meshPositions = mesh.geometry.getAttribute('position');

      self.vertexIndex[mesh.parent.uuid] = [
        vertexCount,
        vertexCount + meshPositions.count - 1
      ];

      vertexCount += meshPositions.count;

      // Remove mesh if not preserving.
      if (!self.data.preserveOriginal) { mesh.parent.remove(mesh); }
    });

    var geometry = THREE.BufferGeometryUtils.mergeBufferGeometries(geometries);
    this.mesh = new THREE.Mesh(geometry);
    this.el.setObject3D('mesh', this.mesh);
  }
});
