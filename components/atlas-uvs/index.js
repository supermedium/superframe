var uvs = [new THREE.Vector2(), new THREE.Vector2(), new THREE.Vector2(), new THREE.Vector2()];

/**
 * 1-indexed.
 */
AFRAME.registerComponent('atlas-uvs', {
  dependencies: ['geometry'],

  schema: {
    totalColumns: {type: 'int', default: 1},
    totalRows: {type: 'int', default: 1},
    column: {type: 'int', default: 1},
    row: {type: 'int', default: 1}
  },

  init: function () {
    var geometry;
    geometry = this.el.getObject3D('mesh').geometry;
    geometry.faceVertexUvs[0][0] = [new THREE.Vector2(), new THREE.Vector2(), new THREE.Vector2()];
    geometry.faceVertexUvs[0][1] = [new THREE.Vector2(), new THREE.Vector2(), new THREE.Vector2()];
  },

  update: function () {
    var column;
    var columnWidth;
    var data = this.data;
    var geometry;
    var row;
    var rowHeight;

    column = data.column - 1;
    row = data.row - 1;
    columnWidth = 1 / data.totalRows;
    rowHeight = 1 / data.totalColumns;

    uvs[0].set(columnWidth * column,
               rowHeight * row + rowHeight);
    uvs[1].set(columnWidth * column,
               rowHeight * row);
    uvs[2].set(columnWidth * column + columnWidth,
               rowHeight * row);
    uvs[3].set(columnWidth * column + columnWidth,
               rowHeight * row + rowHeight);

    geometry = this.el.getObject3D('mesh').geometry;
    geometry.faceVertexUvs[0][0][0].copy(uvs[0]);
    geometry.faceVertexUvs[0][0][1].copy(uvs[1]);
    geometry.faceVertexUvs[0][0][2].copy(uvs[3]);
    geometry.faceVertexUvs[0][1][0].copy(uvs[1]);
    geometry.faceVertexUvs[0][1][1].copy(uvs[2]);
    geometry.faceVertexUvs[0][1][2].copy(uvs[3]);
    geometry.uvsNeedUpdate = true;
  }
});
