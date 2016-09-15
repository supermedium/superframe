AFRAME.registerComponent('svg-extrude-geometry', {
  schema: {
    amount: {default: 2},
    bevelEnabled: {default: true},
    bevelSegments: {default: 3},
    bevelSize: {default: 0.5},
    bevelThickness: {default: 2},
    curveSegments: {default: 12},
    steps: {default: 1},
    src: {type: 'src'}
  },

  update: function () {
    var data = this.data;
    var mesh = this.el.getOrCreateObject3D('mesh', THREE.Mesh);

    new THREE.SVGLoader().load(data.src, function createGeometry (svg) {
      var path = svg.querySelectorAll('path')[0].getAttribute('d');
      var shape = transformSVGPathExposed(path);
      mesh.geometry = new THREE.ExtrudeGeometry(shape[1], data)
    });
  }
});
