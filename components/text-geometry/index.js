/**
 * TextGeometry component for A-Frame.
 */
require('./lib/FontLoader')
require('./lib/TextGeometry')
var debug = AFRAME.utils.debug;
var error = debug('aframe-text-component:error');
var fontLoader = new THREE.FontLoader();
var fontCache = {}; // cache for loaded fonts
AFRAME.registerComponent('text-geometry', {
  schema: {
    bevelEnabled: { default: false },
    bevelSize: { default: 8, min: 0 },
    bevelThickness: { default: 12, min: 0 },
    curveSegments: { default: 12, min: 0 },
    font: { type: 'asset', default: 'https://rawgit.com/ngokevin/kframe/master/components/text-geometry/lib/helvetiker_regular.typeface.json' },
    height: { default: 0.05, min: 0 },
    size: { default: 0.5, min: 0 },
    style: { default: 'normal', oneOf: ['normal', 'italics'] },
    weight: { default: 'normal', oneOf: ['normal', 'bold'] },
    value: { default: '' }
  },

  /**
   * Called when component is attached and when component data changes.
   * Generally modifies the entity based on the data.
   */
  update: function (oldData) {
    var data = this.data;
    var el = this.el;

    // check if font is already cached
    if (fontCache[data.font]) {
      this.createTextGeometry(fontCache[data.font]);
    } else {
      if (data.font.constructor === String) {
        fontLoader.load(data.font, (response) => {
          fontCache[data.font] = response; // cache font
          this.createTextGeometry(response);
        });
      } else if (data.font.constructor === Object) {
        this.createTextGeometry(data.font);
      } else {
        error('Must provide `font` (typeface.json) or `fontPath` (string) to text component.');
      }
    }
  },

  createTextGeometry: function (font) {
    var data = this.data;
    var el = this.el;

    var textData = AFRAME.utils.clone(data);
    textData.font = font;
    el.getOrCreateObject3D('mesh', THREE.Mesh).geometry = new THREE.TextGeometry(data.value, textData);
  }
});
