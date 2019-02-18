## aframe-debug-cursor-component

[![Version](http://img.shields.io/npm/v/aframe-debug-cursor-component.svg?style=flat-square)](https://npmjs.org/package/aframe-debug-cursor-component)
[![License](http://img.shields.io/npm/l/aframe-debug-cursor-component.svg?style=flat-square)](https://npmjs.org/package/aframe-debug-cursor-component)

A component to pretty-log cursor events.

For [A-Frame](https://aframe.io).

![](https://user-images.githubusercontent.com/674727/36452637-30ab2b7c-164a-11e8-9e0c-3eeb2f9b9191.png)

### API

| Property | Description     | Default Value |
| -------- | -----------     | ------------- |
| enabled  | Whether to log. | true          |

### Installation

#### Browser

Install and use by directly including the [browser files](dist):

```html
<head>
  <title>My A-Frame Scene</title>
  <script src="https://aframe.io/releases/0.9.0/aframe.min.js"></script>
  <script src="https://unpkg.com/aframe-debug-cursor-component/dist/aframe-debug-cursor-component.min.js"></script>
</head>

<body>
  <a-scene>
    <a-entity id="mouseCursor" cursor="rayOrigin: mouse" debug-cursor></a-entity>
  </a-scene>
</body>
```

#### npm

Install via npm:

```bash
npm install aframe-debug-cursor-component
```

Then require and use.

```js
require('aframe');
require('aframe-debug-cursor-component');
```
