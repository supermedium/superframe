# text-animation

this component is used to animate *text-geometry* text,such as Chinese characters.

## Usage

```html
<body>
    <a-scene stats inspector="url: http://localhost:5500/components/aframe-inspector.min.js" background="color: #135">
        <a-assets>
            <a-asset-item id="myFont" src="./fonts/LXGW_WenKai_Lite_Regular.json"></a-asset-item>
        </a-assets>
        <a-camera>
            <!-- <a-entity cursor></a-entity>  -->
            <a-cursor></a-cursor>
        </a-camera>

        <a-entity text-animation="text: MSDF是计算机图形学中用于字体渲染和其他图形渲染的技术，特别是在需要高效率和可扩展性时。位图字体在放大时变模糊的问题在实现细节和渲染效果上有所不同。在AFrame中中文的渲染是意见困难的事情; font: #myFont; fontSize: 0.5 ; color: white; charsPerLine: 10; indent: 2; _function: textAnimation; position: -3 2 -7; letterSpacing: 0.2; lineHeight: 1.5;"></a-entity>
        <a-entity position="0 1.8 2">
            <a-entity camera look-controls wasd-controls></a-entity>
        </a-entity>
        <a-entity pico-controls="hand: left" id="primaryHand"></a-entity>
        <a-entity pico-controls="hand: right" id="secondaryHand"></a-entity>
    </a-scene>
</body>
```
and
```js
function textAnimation(textEl, index, position, data) {
  const baseDelay = 500; // 基础延迟
  setTimeout(() => {
    textEl.setAttribute('animation', {
      property: 'material.opacity',
      to: 1,
      dur: 500
    });
  }, index * 200 + baseDelay); // 延迟确保逐字显示的效果
}
```
we use the `textAnimation` function to animate the text, in this situation, we set the `property` to `material.opacity` and `to` to 1, and set the `dur` to 500, which means the opacity will change from 0 to 1 in 500ms.Chinese characters will be displayed one by one with a delay of 200ms.
you can customize the `textAnimation` function according to your needs.

## Tips

### font
you can use facetype.js to convert ttf or otf to json format, and then use the json file as the `font` attribute of the `text-geometry` component.
### text-geometry
text-geometry is a good choice for rendering Chinese characters, but it has some limitations, such as:

- It cannot reuse the same texture for different characters, which means the texture will be loaded multiple times.

so I edited the `text-geometry` component to support the reuse of the same texture for different characters:

```js
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
```