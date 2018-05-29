## aframe-camera-recorder-component

[![Version](http://img.shields.io/npm/v/aframe-camera-recorder-component.svg?style=flat-square)](https://npmjs.org/package/aframe-camera-recorder-component)
[![License](http://img.shields.io/npm/l/aframe-camera-recorder-component.svg?style=flat-square)](https://npmjs.org/package/aframe-camera-recorder-component)

A component to film and record A-Frame scenes with a controlled camera (pans, dollies, tilts).

For [A-Frame](https://aframe.io).

### API

| Property | Description | Default Value |
| -------- | ----------- | ------------- |
|          |             |               |

### Installation

#### Browser

Install and use by directly including the [browser files](dist):

```html
<head>
  <title>My A-Frame Scene</title>
  <script src="https://aframe.io/releases/0.8.2/aframe.min.js"></script>
  <script src="https://unpkg.com/aframe-camera-recorder-component/dist/aframe-camera-recorder-component.min.js"></script>
</head>

<body>
  <a-scene>
    <a-entity camera-recorder="foo: bar"></a-entity>
  </a-scene>
</body>
```

#### npm

Install via npm:

```bash
npm install aframe-camera-recorder-component
```

Then require and use.

```js
require('aframe');
require('aframe-camera-recorder-component');
```
