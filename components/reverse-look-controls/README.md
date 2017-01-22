## aframe-reverse-look-controls

### Usage

#### Browser Installation

Install and use by directly including the [browser files](dist):

```html
<head>
  <title>My A-Frame Scene</title>
  <script src="https://aframe.io/releases/0.3.0/aframe.min.js"></script>
  <script src="https://unpkg.com/reverse-look-controls-component@3.0.0/dist/aframe-reverse-look-controls.min.js"></script>
</head>

<body>
  <a-scene>
    <a-entity camera reverse-look-controls></a-entity>
  </a-scene>
</body>
```

#### NPM Installation

Install via NPM:

```bash
npm install aframe-reverse-look-controls
```

Then register and use.

```js
require('aframe');
require('aframe-reverse-look-controls');
```
