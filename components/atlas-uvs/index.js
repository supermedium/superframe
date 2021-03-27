// For aux use.
var uvs = [
  new THREE.Vector2(),
  new THREE.Vector2(),
  new THREE.Vector2(),
  new THREE.Vector2()
];

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

  update: function () {
    const data = this.data;
    const uvs = getGridUvs(data.row - 1, data.column - 1, data.totalRows, data.totalColumns);

    const geometry = this.el.getObject3D('mesh').geometry;

    var float32Array = new Float32Array([uvs[0].x, uvs[0].y, uvs[3].x, uvs[3].y, uvs[1].x, uvs[1].y, uvs[2].x, uvs[2].y]);
    geometry.setAttribute('uv', new THREE.BufferAttribute(float32Array, 2));
    geometry.uvsNeedUpdate = true;
  }
});

AFRAME.registerComponent('dynamic-texture-atlas', {
  schema: {
    canvasId: {default: 'dynamicAtlas'},
    canvasHeight: {default: 1024},
    canvasWidth: {default: 1024},
    debug: {default: false},
    numColumns: {default: 8},
    numRows: {default: 8}
  },

  multiple: true,

  init: function () {
    const canvas = this.canvas = document.createElement('canvas');
    canvas.id = this.data.canvasId;
    canvas.height = this.data.canvasHeight;
    canvas.width = this.data.canvasWidth;
    this.ctx = canvas.getContext('2d');
    document.body.appendChild(canvas);

    if (this.data.debug) {
      canvas.style.left = 0;
      canvas.style.top = 0;
      canvas.style.position = 'fixed';
      canvas.style.zIndex = 9999999999;
    }
  },

  drawTexture: function (image, row, column, width, height) {
    const canvas = this.canvas;
    const data = this.data;

    if (!image.complete) {
      image.onload = () => { this.drawTexture(image, row, column); }
    }

    const gridHeight = height || (canvas.height / data.numRows);
    const gridWidth = width || (canvas.width / data.numColumns);

    // image, dx, dy, dwidth, dheight
    this.ctx.drawImage(image, gridWidth * row, gridWidth * column, gridWidth, gridHeight);

    // Return UVs.
    return getGridUvs(row, column, data.numRows, data.numColumns);
  }
});

/**
 * Return UVs for an texture within an atlas, given the row and column info.
 */
function getGridUvs (row, column, totalRows, totalColumns) {
  const columnWidth = 1 / totalColumns;
  const rowHeight = 1 / totalRows;

  // create a Map called `uvs` to hold the 4 UV pairs
  uvs[0].set(columnWidth * column,
             rowHeight * row + rowHeight);
  uvs[1].set(columnWidth * column,
             rowHeight * row);
  uvs[2].set(columnWidth * column + columnWidth,
             rowHeight * row);
  uvs[3].set(columnWidth * column + columnWidth,
             rowHeight * row + rowHeight);
  return uvs;
}
module.exports.getGridUvs = getGridUvs;
