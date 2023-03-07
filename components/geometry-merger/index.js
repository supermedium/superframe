if (!THREE.BufferGeometryUtils) {
  require('./lib/BufferGeometryUtils');
}

AFRAME.utils.setBufferGeometryColor = function () {
    
  const colorHelper = new THREE.Color();

  return function (geometry, color, start, end) {

    // ES5 compatible default parameters
    if (start === undefined) start = 0;
    if (end === undefined) end = Infinity;

    var i;
    const colors = geometry.getAttribute('color')
    const itemSize = colors.itemSize;
    const array = colors.array

    colorHelper.set(color);
    const verticesEnd = Math.min(end, colors.count) * itemSize
    for (i = start * itemSize; i <= verticesEnd; i += itemSize) {
      array[i] = colorHelper.r;
      array[i + 1] = colorHelper.g;
      array[i + 2] = colorHelper.b;
    }
    colors.needsUpdate = true;
  }

}()

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

    this.geometry = THREE.BufferGeometryUtils.mergeBufferGeometries(geometries);
    this.mesh = new THREE.Mesh(this.geometry);
    this.el.setObject3D('mesh', this.mesh);

    // dereference original geometries (so they can be freed when no longer needed)
    geometries.length = 0;
  },

  getColor: function (uuid, color) {

    const colors = this.geometry.getAttribute('color')
    color.fromBufferAttribute(colors, this.vertexIndex[uuid][0]);

    return color;

  },

  setColor: function (uuid, color) {

    const vertexData = this.vertexIndex[uuid];
    AFRAME.utils.setBufferGeometryColor(this.geometry, color, vertexData[0], vertexData[1]);

  }
});
