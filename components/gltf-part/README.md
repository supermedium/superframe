## aframe-gltf-part-component

[![Version](http://img.shields.io/npm/v/aframe-gltf-part-component.svg?style=flat-square)](https://npmjs.org/package/aframe-gltf-part-component)
[![License](http://img.shields.io/npm/l/aframe-gltf-part-component.svg?style=flat-square)](https://npmjs.org/package/aframe-gltf-part-component)

A component to extract parts from a GLTF model into their own A-Frame entities. Enables:

- Having one glTF file contain all models for the application versus loading and parsing multiple glTF files.
- Extracting individual parts from a glTF scene to manipulate individually and separately.
- Defining glTF parts as individual A-Frame entities to be able to apply
  components to (e.g., material, animation, position).
- Ease of defining your own materials for optimization (e.g., one shared
  material for everything with vertex colors) versus having the loader create them.

For [A-Frame](https://aframe.io).

### API

| Property | Description                                                                                                                        | Default Value |
| -------- | -----------                                                                                                                        | ------------- |
| buffer   | Whether to load the geometry as a BufferGeometry (versus Geometry). Set to `false` if we need access to vertices, faces, UVs, etc. | true          |
| part     | Name of the part to look for (specified in the glTF file as `name="<NAME>"`.                                                       | ''            |
| src      | Path to the glTF file (or selector to `<a-asset-item>`).                                                                           | ''            |

### Installation

#### Browser

Install and use by directly including the [browser files](dist):

```html
<head>
  <title>My A-Frame Scene</title>
  <script src="https://aframe.io/releases/0.7.1/aframe.min.js"></script>
  <script src="https://unpkg.com/aframe-gltf-part-component/dist/aframe-gltf-part-component.min.js"></script>
</head>

<body>
  <a-scene>
    <a-assets>
      <a-asset-item id="office" src="office.gltf"></a-asset-item>
    </a-assets>

    <a-entity gltf-part="src: #office; part: chair" material="color: black" position="0 0 -1"></a-entity>
    <a-entity gltf-part="src: #office; part: desk" material="color: brown" position="0 1 -2"></a-entity>
    <a-entity gltf-part="src: #office; part: wall1" material="color: white" position="-1 0 -3"></a-entity>
    <a-entity gltf-part="src: #office; part: wall2" material="color: white" position="1 0 -3"></a-entity>
  </a-scene>
</body>
```

#### npm

Install via npm:

```bash
npm install aframe-gltf-part-component
```

Then require and use.

```js
require('aframe');
require('aframe-gltf-part-component');
```
