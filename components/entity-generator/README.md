## aframe-entity-generator-component

An entity generator component for [A-Frame](https://aframe.io). Given a mixin,
generates a number of entities as children. Pairs well with [Randomizer
Components](https://www.npmjs.com/package/aframe-randomizer-components) for
a large number of entities with random elements.

### Properties

| Property | Description                                          | Default Value |
| -------- | -----------                                          | ------------- |
| mixin    | Mixin ID that will be applied to generated entities. | ''            |
| num      | Number of entities to generate.                      | 10            |

### Usage

#### Browser Installation

Install and use by directly including the browser files:

```html
<head>
  <title>My A-Frame Scene</title>
  <script src="https://aframe.io/releases/0.9.0/aframe.min.js"></script>
  <script src="https://unpkg.com/aframe-entity-generator-component@3.0.2/dist/aframe-entity-generator-component.min.js"></script>
</head>

<body>
  <a-scene>
    <a-assets>
      <a-mixin id="red" material="color: red"></a-mixin>
      <a-mixin id="candle" geometry="primitive: sphere" light></a-mixin>
    </a-assets>

    <a-entity entity-generator="mixin: red candle"></a-entity>
  </a-scene>
</body>
```

#### NPM Installation

Install via NPM:

```bash
npm install aframe-entity-generator-component
```

Then register and use.

```js
require('aframe');
require('aframe-entity-generator-component');
```
