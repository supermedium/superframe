## aframe-thumb-controls-component

[![Version](http://img.shields.io/npm/v/aframe-thumb-controls-component.svg?style=flat-square)](https://npmjs.org/package/aframe-thumb-controls-component)
[![License](http://img.shields.io/npm/l/aframe-thumb-controls-component.svg?style=flat-square)](https://npmjs.org/package/aframe-thumb-controls-component)

An A-Frame component that provides and normalizes directional events for thumbpads and thumbsticks.

At the moment, A-Frame out of the box does not provide thumb-related
directional events, merely `axismove`/`trackpaddown`/`trackpadup`. We would
like events such as `thumbleftstart` and `thumbleftend`.

But also to solve the issue that the interaction between thumbpads (e.g., Vive)
and thumbsticks (Oculus) are different. Thumbpads operate on clicks.
Thumbsticks operate via pulls. This component normalizes the two to *start* and
*end* events:

- A *start* event for thumbpads is to press down.
- An *end* event for thumbpads is to release after a press down.
- A *start* event for thumbsticks is to pull the stick far enough in a direction.
- An *end* event for thumbsticks is to release the stick such that it snaps back to center.

The component provides start and end events in each direction (as well as plain
`thumbstart` and `thumbend` event indicating any direction).

### `thumb-controls` API

| Property       | Description                                                                                                        | Default Value |
| --------       | -----------                                                                                                        | ------------- |
| thresholdAngle | Degrees indicating size of target for up, left, right, down directions. Like a pie.                                | 70            |
| thresholdPad   | Minimum distance (from 0 to 1) that thumb needs to be from center to trigger event for thumbpads (e.g., Vive).     | 0.05          |
| thresholdStick | Minimum distance (from 0 to 1) that thumb needs to be from center to trigger event for thumbsticks (e.g., Oculus). | 0.75          |

#### Events

| Event Name      |
|-----------------|
| thumbstart      |
| thumbend        |
| thumbleftstart  |
| thumbleftend    |
| thumbrightstart |
| thumbrightend   |
| thumbupstart    |
| thumbupend      |
| thumbdownstart  |
| thumbdownend    |

### `thumb-controls-debug`

There is a helper component that provides a thumb emulator that can be used on
a 2D computer:

```html
<a-entity oculus-touch-controls="hand: left" thumb-controls="hand: left" thumb-controls-debug="enabled: true; controllerType: oculus">
```

![](https://user-images.githubusercontent.com/674727/40273062-13d5e5aa-5b6e-11e8-8d19-0d81da35c3de.gif)

### Installation

#### Browser

Install and use by directly including the [browser files](dist):

```html
<head>
  <title>My A-Frame Scene</title>
  <script src="https://aframe.io/releases/0.9.0/aframe.min.js"></script>
  <script src="https://unpkg.com/aframe-thumb-controls-component@1.1.0/dist/aframe-thumb-controls-component.min.js"></script>
</head>

<body>
  <a-scene>
    <a-entity oculus-touch-controls="hand: left" vive-controls="hand: left" thumb-controls="hand: left"></a-entity>
    <a-entity oculus-touch-controls="hand: right" vive-controls="hand: right" thumb-controls="hand: right"></a-entity>
  </a-scene>
</body>
```

#### npm

Install via npm:

```bash
npm install aframe-thumb-controls-component
```

Then require and use.

```js
require('aframe');
require('aframe-thumb-controls-component');
```
