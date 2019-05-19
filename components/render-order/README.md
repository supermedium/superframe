## aframe-render-order-component

[![Version](http://img.shields.io/npm/v/aframe-render-order-component.svg?style=flat-square)](https://npmjs.org/package/aframe-render-order-component)
[![License](http://img.shields.io/npm/l/aframe-render-order-component.svg?style=flat-square)](https://npmjs.org/package/aframe-render-order-component)

A component that enables sorting and manually defining render order for
transparent objects. A-Frame currently defaults to transparency order based on
the order of objects added to the scene.

For [A-Frame](https://aframe.io).

### API

#### System

The `render-order` system takes a comma-delimited list of strings that name the
render order layers. The render order layers will map to a number starting from
0 and counting up from there.

**Example:**

```html
<a-scene render-order="background, menu, menubutton, menutext, foreground, hud">
```

#### Component

Then the `render-order` component can be applied to specify the layer or render
order. The value modify the three.js Object3D's `renderOrder` property. The
value can either be a number or the name of a layer defined in the system.

```html
<a-scene render-order="background, menu, menubutton, menutext, hud">
  <a-entity geometry="primitive: plane" material="transparent: true; opacity: 0.5" render-order="foreground"></a-entity>

  <a-entity geometry="primitive: plane" material="transparent: true; opacity: 0.5" render-order="5.5"></a-entity>
```

##### Non-Recursive

The component will apply render order recursively by default. To define to be
not recursive, set the nonrecursive ID:

```html
<a-entity render-order__nonrecursive="hud"></a-entity>
```

### Installation

#### Browser

Install and use by directly including the [browser files](dist):

```html
<head>
  <title>My A-Frame Scene</title>
  <script src="https://aframe.io/releases/0.9.0/aframe.min.js"></script>
  <script src="https://unpkg.com/aframe-render-order-component@1.1.0/dist/aframe-render-order-component.min.js"></script>
</head>

<body>
  <a-scene environment="preset: forest" render-order="layer1, layer2, layer3">
    <a-entity geometry="primitive: plane" material="color: red; opacity: 0.5; transparent: true" position="0 1 -1" render-order="layer3"></a-entity>
    <a-entity geometry="primitive: plane" material="color: blue; opacity: 0.5; transparent: true" position="-0.25 1 -2" render-order="layer2"></a-entity>
    <a-entity geometry="primitive: plane" material="color: green; opacity: 0.5; transparent: true" position="-0.5 1 -3" render-order="layer1"></a-entity>
  </a-scene>
</body>
```

#### npm

Install via npm:

```bash
npm install aframe-render-order-component
```

Then require and use.

```js
require('aframe');
require('aframe-render-order-component');
```
