/**
 * TextGeometry component for A-Frame.
 */
var debug = AFRAME.utils.debug;

var error = debug('aframe-text-component:error');

var fontLoader = new THREE.FontLoader();

AFRAME.registerComponent('text', {
  schema: {
    bevelEnabled: {default: false},
    bevelSize: {default: 8, min: 0},
    bevelThickness: {default: 12, min: 0},
    curveSegments: {default: 12, min: 0},
    font: {type: 'asset', default: 'https://rawgit.com/ngokevin/kframe/master/components/text/lib/helvetiker_regular.typeface.json'},
    height: {default: 0.05, min: 0},
    size: {default: 0.5, min: 0},
    style: {default: 'normal', oneOf: ['normal', 'italics']},
    text: {default: ''},
    weight: {default: 'normal', oneOf: ['normal', 'bold']}
  },

  /**
   * Called when component is attached and when component data changes.
   * Generally modifies the entity based on the data.
   */
  update: function (oldData) {
    var data = this.data;
    var el = this.el;

    var mesh = el.getOrCreateObject3D('mesh', THREE.Mesh);
    if (data.font.constructor === String) {
      // Load typeface.json font.
      fontLoader.load(data.font, function (response) {
        var textData = AFRAME.utils.clone(data);
        textData.font = response;
        mesh.geometry = new THREE.TextGeometry(data.text, textData);
      });
    } else if (data.font.constructor === Object) {
      // Set font if already have a typeface.json through setAttribute.
      mesh.geometry = new THREE.TextGeometry(data.text, data);
    } else {
      error('Must provide `font` (typeface.json) or `fontPath` (string) to text component.');
    }
  }
});
