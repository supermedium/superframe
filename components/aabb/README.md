## aframe-aabb-collider-component

[![Version](http://img.shields.io/npm/v/aframe-aabb-collider-component.svg?style=flat-square)](https://npmjs.org/package/aframe-aabb-collider-component)
[![License](http://img.shields.io/npm/l/aframe-aabb-collider-component.svg?style=flat-square)](https://npmjs.org/package/aframe-aabb-collider-component)

An axis-aligned bounding box component for A-Frame. Provides collision
detection. Developed to be the volume-equivalent of the line-based raycaster
component, emitting the same events, and compatible with the cursor component.

For [A-Frame](https://aframe.io).

### API

| Property          | Description                                                   | Default Value |
| --------          | -----------                                                   | ------------- |
| collideNonVisible | Whether to check for collisions against non-visible entities. | false         |
| debug             | Whether to draw bounding box helpers.                         | false         |
| objects           | Selector of entities to intersection test against.            | ''            |
| interval          | Milliseconds in between intersection checks.                  | 80            |

#### Events

| Event    | Description                                                                                                                              |
| -----    | -----------                                                                                                                              |
| hitstart | Also emits raycaster-intersection for compatibility with cursor. Emitted on both source and target if target does not have AABB.         |
| hitend   | Also emits raycaster-intersection-cleared for compatibility with cursor. Emitted on both source and target if target does not have AABB. |

### Installation

#### Browser

Install and use by directly including the [browser files](dist):

```html
<head>
  <title>My A-Frame Scene</title>
  <script src="https://aframe.io/releases/0.7.0/aframe.min.js"></script>
  <script src="https://unpkg.com/aframe-aabb-collider-component/dist/aframe-aabb-collider-component.min.js"></script>
</head>

<body>
  <a-scene>
    <a-entity hand-controls="right" aabb-collider="objects: .box"></a-entity>
    <a-box class="box" color="blue" position="0 1 -5'></a-box>
  </a-scene>
</body>
```

#### npm

Install via npm:

```bash
npm install aframe-aabb-collider-component
```

Then require and use.

```js
require('aframe');
require('aframe-aabb-collider-component');
```
