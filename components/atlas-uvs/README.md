## aframe-atlas-uvs-component

[![Version](http://img.shields.io/npm/v/aframe-atlas-uvs-component.svg?style=flat-square)](https://npmjs.org/package/aframe-atlas-uvs-component)
[![License](http://img.shields.io/npm/l/aframe-atlas-uvs-component.svg?style=flat-square)](https://npmjs.org/package/aframe-atlas-uvs-component)

An A-Frame component to set UVs onto a plane geometry given a gridded texture atlas.

Does not support buffer geometries yet. Mostly for reference for people that
want to do UV mapping.

### API

| Property     | Description                                                                | Default Value |
| --------     | -----------                                                                | ------------- |
| column       | Column to select from atlas, 1-indexed, where `1` is the left-most column. | 1             |
| row          | Row to select from atlas, 1-indexed, where `1` is the bottom-most row.     | 1             |
| totalColumns | Total number of columns to divide the atlas.                               | 1             |
| totalRows    | Total number of rows to divide the atlas.                                  | 1             |

### Installation

#### Browser

Install and use by directly including the [browser files](dist):

```html
<head>
  <title>My A-Frame Scene</title>
  <script src="https://aframe.io/releases/0.7.0/aframe.min.js"></script>
  <script src="https://unpkg.com/aframe-atlas-uvs-component/dist/aframe-atlas-uvs-component.min.js"></script>
</head>

<body>
  <a-scene>
    <a-mixin id="myAtlas" atlas-uvs="totalRows: 4; totalColumns: 4" material="src: myAtlas.png" geometry="primitive: plane; buffer: false; skipCache: true"></a-mixin>

    <a-entity mixin="myAtlas" atlas-uvs="column: 1; row: 1"></a-entity>
    <a-entity mixin="myAtlas" atlas-uvs="column: 3; row: 2"></a-entity>
    <a-entity mixin="myAtlas" atlas-uvs="column: 2; row: 4"></a-entity>
  </a-scene>
</body>
```

#### npm

Install via npm:

```bash
npm install aframe-atlas-uvs-component
```

Then require and use.

```js
require('aframe');
require('aframe-atlas-uvs-component');
```
