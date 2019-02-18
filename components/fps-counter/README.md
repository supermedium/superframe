## aframe-fps-counter-component

[![Version](http://img.shields.io/npm/v/aframe-fps-counter-component.svg?style=flat-square)](https://npmjs.org/package/aframe-fps-counter-component)
[![License](http://img.shields.io/npm/l/aframe-fps-counter-component.svg?style=flat-square)](https://npmjs.org/package/aframe-fps-counter-component)

A simple FPS counter component to measure performance in VR for A-Frame.

This component copies the FPS value from the `stats` component panel and
displays using simple text component. It will display different colors if frame
rate drops below certain levels.

### API

| Property | Description                                                           | Default Value |
| -------- | -----------                                                           | ------------- |
| enabled  | Whether to show the counter.                                          | true          |
| for90fps | Whether the colors indicate performance level for 90fps versus 60fps. For example, if `for90fps`, frame rates below 80fps will be shown as red. | true          |

### Installation

#### Browser

Install and use by directly including the [browser files](dist):

```html
<head>
  <title>My A-Frame Scene</title>
  <script src="https://aframe.io/releases/0.9.0/aframe.min.js"></script>
  <script src="https://unpkg.com/aframe-fps-counter-component@1.0.1/dist/aframe-fps-counter-component.min.js"></script>
</head>

<body>
  <a-scene>
    <!-- Attach to hand. -->
    <a-entity hand-controls>
      <a-entity fps-counter></a-entity>
    </a-entity>
  </a-scene>
</body>
```

#### npm

Install via npm:

```bash
npm install aframe-fps-counter-component
```

Then require and use.

```js
require('aframe');
require('aframe-fps-counter-component');
```
