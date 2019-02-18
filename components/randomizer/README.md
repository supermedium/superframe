## aframe-randomizer-components

Randomizer components for [A-Frame](https://aframe.io).

### Properties

#### random-color

| Property | Description         | Default Value |
|----------|---------------------|---------------|
| min      | Minimum RGB vector. | 0 0 0         |
| max      | Maximum RGB vector. | 1 1 1         |

#### random-position

| Property | Description              | Default Value |
|----------|--------------------------|---------------|
| min      | Minimum position bounds. | -10 -10 -10   |
| max      | Maximum position bounds. | 10 10 10      |

#### random-spherical-position

Random position that maps to a surface of a bounding sphere.

| Property | Description               | Default Value |
|----------|---------------------------|---------------|
| radius   | Radius of bounding sphere | 10            |
| startX   | Start angle.              | 0             |
| lengthX  | Sweep or arc angle.       | 360           |
| startY   | Start angle.              | 0             |
| lengthY  | Sweep or arc angle.       | 360           |

#### random-rotation

| Property | Description              | Default Value |
|----------|--------------------------|---------------|
| min      | Minimum rotation angles. | 0 0 0         |
| max      | Maximum rotation angles. | 360 360 360   |

#### random-scale

| Property | Description               | Default Value |
|----------|---------------------------|---------------|
| min      | Minimum scale components. | 1 1 1         |
| max      | Maximum scale components. | 2 2 2         |

### Usage

#### Browser Installation

Install and use by directly including the [browser files](dist):

```html
<head>
  <title>My A-Frame Scene</title>
  <script src="https://aframe.io/releases/0.9.0/aframe.min.js"></script>
  <script src="https://unpkg.com/aframe-randomizer-components@3.0.2/dist/aframe-randomizer-components.min.js"></script>
</head>

<body>
  <a-scene>
    <a-entity geometry="primitive: box"
              random-position random-rotation random-scale></a-entity>
  </a-scene>
</body>
```

#### NPM Installation

Install via NPM:

```bash
npm install aframe-randomizer-components
```

Then register and use.

```js
require('aframe');
require('aframe-randomizer-components');
```
