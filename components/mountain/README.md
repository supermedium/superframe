## aframe-mountain-component

Mountain component and primitive for A-Frame.

![Screenshot](https://cloud.githubusercontent.com/assets/674727/18611595/c98bc48e-7cf2-11e6-8e2a-2110fbfe0ff0.png)

Uses Perlin noise to create a height map, create a shaded texture from that
height map using a `<canvas>`, and using the height map to create vertices on a
BufferGeometry.

## Properties

| Property    | Description                     | Default Value    |
| --------    | -----------                     | -------------    |
| color       | Base color of mountain.         | rgb(92, 32, 0)   |
| shadowColor | Diffuse color of mountain.      | rgb(128, 96, 96) |
| sunPosition | Sun position to shade mountain. | 1, 1, 1          |

### Usage

#### Browser Installation

Install and use by directly including the [browser files](dist):

```html
<head>
  <title>My A-Frame Scene</title>
  <script src="https://aframe.io/releases/0.3.0/aframe.min.js"></script>
  <script src="https://rawgit.com/ngokevin/kframe/tree/master/components/mountain/dist/aframe-mountain-component.min.js"></script>
</head>

<body>
  <a-scene>
    <a-mountain color="red"></a-mountain>
    <!-- <a-entity mountain="color: red"></a-entity> -->
  </a-scene>
</body>
```

#### NPM Installation

Install via NPM:

```bash
npm install aframe-mountain-component
```

Then register and use.

```js
require('aframe');
require('aframe-mountain-component');
```
