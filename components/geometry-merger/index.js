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
    this.colorHelper = new THREE.Color();

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

    this.geometry = THREE.BufferGeometryUtils.mergeBufferGeometries(geometries);
    this.mesh = new THREE.Mesh(this.geometry);
    this.el.setObject3D('mesh', this.mesh);
  },

  getColor: function (uuid, color) {

    const colors = this.geometry.getAttribute('color')
    color.fromBufferAttribute(colors, this.vertexIndex[uuid][0]);

  },

  setColor: function (uuid, color) {

    const vertexData = this.vertexIndex[uuid];
    this.setColorOverVertexRange(vertexData[0], vertexData[1], color);

  },

  setColorOverVertexRange: function (start, end, color) {

    var colorHelper = this.colorHelper
    var geometry = this.geometry;
    var i;
    const colors = geometry.getAttribute('color')
    const itemSize = colors.itemSize;
    const array = colors.array

    colorHelper.set(color);
    for (i = start * 3; i <= end * 3; i += itemSize) {
      array[i] = colorHelper.r;
      array[i + 1] = colorHelper.g;
      array[i + 2] = colorHelper.b;
    }
    colors.needsUpdate = true;
  }
});
