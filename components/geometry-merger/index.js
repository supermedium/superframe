AFRAME.registerComponent('geometry-merger', {
  schema: {
    preserveOriginal: {default: false}
  },

  init: function () {
    var faceIndexEnd;
    var faceIndexStart;
    var self = this;

    this.mesh = this.el.getOrCreateObject3D('mesh', THREE.Mesh);
    this.geometry = this.mesh.geometry = new THREE.Geometry();

    this.faceIndex = {};  // Keep index of original entity UUID to new face array.
    this.vertexIndex = {};  // Keep index of original entity UUID to vertex array.

    this.el.object3D.traverse(function (mesh) {
      if (mesh.type !== 'Mesh') { return; }
      if (mesh === self.mesh) { return; }

      self.faceIndex[mesh.parent.uuid] = [
        self.geometry.faces.length,
        self.geometry.faces.length + mesh.geometry.faces.length - 1
      ];

      self.vertexIndex[mesh.parent.uuid] = [
        self.geometry.vertices.length,
        self.geometry.vertices.length + mesh.geometry.vertices.length - 1
      ];

      // Merge. Use parent's matrix due to A-Frame's <a-entity>(Group-Mesh) hierarchy.
      mesh.parent.updateMatrix();
      self.geometry.merge(mesh.geometry, mesh.parent.matrix);

      // Remove mesh if not preserving.
      if (!self.data.preserveOriginal) { mesh.parent.remove(mesh); }
    });
  }
});
