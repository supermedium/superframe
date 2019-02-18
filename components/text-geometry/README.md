## aframe-text-geometry-component

A text geometry component for [A-Frame](https://aframe.io). The text geometry
component wraps
[THREE.TextGeometry](https://threejs.org/docs/?q=textge#Reference/Geometries/TextGeometry).

![screenshot](https://cloud.githubusercontent.com/assets/674727/21373560/c4c7507c-c6d4-11e6-86a5-88cb3ae8d0cb.png)

## Properties

| Property       | Description                                                   | Default Value                                                                                           |
| --------       | -----------                                                   | -------------                                                                                           |
| bevelEnabled   |                                                               | false                                                                                                   |
| bevelSize      |                                                               | 8                                                                                                       |
| bevelThickness |                                                               | 12                                                                                                      |
| curveSegments  |                                                               | 12                                                                                                      |
| font           | Path to a typeface.json file or selector to `<a-asset-item>`. | https://rawgit.com/supermedium/superframe/master/components/text-geometry/lib/helvetiker_regular.typeface.json |
| height         |                                                               | 0.05                                                                                                    |
| size           |                                                               | 0.5                                                                                                     |
| style          |                                                               | normal                                                                                                  |
| value          |                                                               | ''                                                                                                      |

### Usage

#### Browser Installation

Install and use by directly including the [browser files](dist):

```html
<head>
  <title>My A-Frame Scene</title>
  <script src="https://aframe.io/releases/0.9.0/aframe.min.js"></script>
  <script src="https://unpkg.com/aframe-text-geometry-component@0.5.1/dist/aframe-text-geometry-component.min.js"></script>
</head>

<body>
  <a-scene>
    <a-assets>
      <a-asset-item id="optimerBoldFont" src="https://rawgit.com/mrdoob/three.js/dev/examples/fonts/optimer_bold.typeface.json"></a-asset-item>
    </a-assets>

    <a-entity text-geometry="value: What's up"></a-entity>
    <a-entity text-geometry="value: Dog?; font: #optimerBoldFont"></a-entity>
  </a-scene>
</body>
```

#### NPM Installation

Install via NPM:

```bash
npm install aframe-text-geometry-component
```

Then register and use.

```js
require('aframe');
require('aframe-text-geometry-component');
```

## Using Different Fonts

The text component uses `typeface.json` files, which are Web Fonts converted to
JSON for three.js.  Typeface fonts can be generated from fonts using this
**[typeface font generator](http://gero3.github.io/facetype.js/)**. Select JSON
format and we recommend restricting the character set to only the characters
you need. You may also have to check *reverse font direction* if you get odd font results.

You can also find some sample generated fonts in the `examples/fonts` directory
in the [three.js repository](https://github.com/mrdoob/three.js).

By default, the text geometry component points to Helvetiker (Regular). Each
font is fairly large, from at least 60KB to hundreds of KBs.

To include a font for use with the text component, it is recommended to define
it in `<a-asset-item>` and point at it with a selector.

For example in HTML:

```html
<html>
  <head>
    <title>My A-Frame Scene</title>
    <script src="https://aframe.io/releases/0.9.0/aframe.min.js"></script>
    <script src="https://unpkg.com/aframe-text-geometry-component/dist/aframe-text-geometry-component.min.js"></script>
    <script src="myfont.typeface.js"></script>
  </head>
  <body>
    <a-scene>
      <a-assets>
        <a-asset-item id="optimerBoldFont" src="https://rawgit.com/mrdoob/three.js/dev/examples/fonts/optimer_bold.typeface.json"></a-asset-item>
        <a-mixin id="boldFont" text="font: #optimerBoldFont"></a-mixin>
      </a-assets>

      <a-entity mixin="boldFont" text-geometry="value: What's up"></a-entity>
      <a-entity text-geometry="value: Dog?; font: #optimerBoldFont"></a-entity>
    </a-scene>
  </body>
</html>
```

Or in JS, we can bundle and set a font directly with `setAttribute` such that
we don't have to XHR the font file separately at runtime:

```js
require('aframe');
require('aframe-text-geometry-component');

var fontJson = require('./fonts/myfont.typeface.json');
var el = document.createElement('a-entity');
el.setAttribute('text', {font: fontJson});
```

## Applying a Material

The text geometry component defines just the geometry. We can apply any
three.js material to the geometry:

```html
<a-entity text="value: HELLO" material="color: red; src: #texture"></a-entity>
```

See the [Vaporwave
Example](https://supermedium.com/superframe/components/text-geometry/examples/vaporwave/)
by [Ada Rose Edwards](https://twitter.com/lady_ada_king) for an example on applying
materials.
