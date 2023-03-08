## aframe-haptics-component

[![Version](http://img.shields.io/npm/v/aframe-haptics-component.svg?style=flat-square)](https://npmjs.org/package/aframe-haptics-component)
[![License](http://img.shields.io/npm/l/aframe-haptics-component.svg?style=flat-square)](https://npmjs.org/package/aframe-haptics-component)

A controller haptics (vibrations) component for A-Frame. Supported by
experimental [Gamepad
Extensions](https://w3c.github.io/gamepad/extensions.html#dom-gamepadhapticactuator). [Read about browser support](https://developer.mozilla.org/en-US/docs/Web/API/Gamepad/hapticActuators).

[Demo](https://supermedium.com/superframe/components/haptics/)

### API

| Property      | Description                                                                       | Default Value |
| --------      | -----------                                                                       | ------------- |
| actuatorIndex | Index of the actuator from the gamepad's array of actuators.                      | 0             |
| dur           | Duration of vibration pulse (milliseconds).                                       | 100           |
| enabled       | Whether the component should pulse on the event.                                  | true          |
| events        | Array of events to listen for to trigger a pulse (e.g., `triggerdown, triggerup`) | []            |
| eventsFrom    | Target entity to listen for `events` if other than the controller entity.         | `this.el`     |
| force         | Intensity of pulse (from 0 to 1)                                                  | 1             |

#### Methods

| Name  | Description                                                                                                         |
|-------|---------------------------------------------------------------------------------------------------------------------|
| pulse | Manually trigger pulse (can pass in `force` and `duration` as arguments, defaults data-defined duration and force). |

```js
this.el.components.haptics.pulse();

// function pulse (force, duration)
this.el.components.haptics.pulse(0.5, 200);
```

### Installation

#### Browser

Install and use by directly including the [browser files](dist):

```html
<head>
  <title>My A-Frame Scene</title>
  <script src="https://aframe.io/releases/1.4.1/aframe.min.js"></script>
  <script src="https://unpkg.com/aframe-haptics-component/dist/aframe-haptics-component.min.js"></script>
</head>

<body>
  <a-scene>
    <a-entity hand-controls="hand:left"  haptics="events: triggerdown; dur: 1000; force: 0.5"></a-entity>
    <a-entity hand-controls="hand:right" haptics="events: triggerdown; dur: 500; force: 1.0"></a-entity>
  </a-scene>
</body>
```

#### npm

Install via npm:

```bash
npm install aframe-haptics-component
```

Then require and use.

```js
require('aframe');
require('aframe-haptics-component');
```
