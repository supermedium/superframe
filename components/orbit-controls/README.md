## aframe-orbit-controls

[![Version](http://img.shields.io/npm/v/aframe-orbit-controls-component.svg?style=flat-square)](https://npmjs.org/package/aframe-orbit-controls-component)
[![License](http://img.shields.io/npm/l/aframe-orbit-controls-component.svg?style=flat-square)](https://npmjs.org/package/aframe-orbit-controls-component)

Orbit controls for [A-Frame](https://aframe.io).

![](https://user-images.githubusercontent.com/674727/41206637-d58d7ec0-6cbb-11e8-8161-966396f45b79.gif)

Automatically toggles `look-controls` on and off when entering and exiting VR.

Great for using as a viewer, better and easier than using WASD + mouse-drag,
or being stuck in the same position on mobile.

The other A-Frame orbit controls components were weird since they fully ported
the `THREE.OrbitControls` logic into a component. This component just straight
up uses `THREE.OrbitControls` in a clean and performant way.

### API

Same API as
[`THREE.OrbitControls`](https://threejs.org/docs/#examples/controls/OrbitControls),
supports all the properties.

| Property           | Description                                                                                                                                                                              | Default Value                        |
| --------           | -----------                                                                                                                                                                              | -------------                        |
| autoRotate         | Set to true to automatically rotate around the target.                                                                                                                                   | false                                |
| autoRotateSpeed    | How fast to rotate around the target.                                                                                                                                                    | 2 (30 seconds per rotation at 60fps) |
| cursor             | The focus point of the `minTargetRadius` and `maxTargetRadius` limits. It can be updated manually at any point to change the center of interest for the `target`.                        | 0 0 0                                |
| dampingFactor      | Damping inertia if `enableDamping`.                                                                                                                                                      | 0.1                                  |
| enabled            | Whether enabled. You can also call `.pause()` on the entity. | true                                 |
| enableDamping      | Set to true to enable damping (inertia), which can be used to give a sense of weight to the controls.                                                                                    | true                                 |
| enablePan          | Enable panning (i.e., right click drag or three finger drag).                                                                                                                            | true                                 |
| enableRotate       | Enable rotation (i.e., left click drag or single finger drag). Use Azimuth angles to constrain to single axis.                                                                           | true                                 |
| enableZoom         | Enable zoom (i.e., scroll or pinch).                                                                                                                                                     | true                                 |
| initialPosition    | Initial position of the camera. Set this rather than `position`.                                                                                                                         | 0 0 0                                |
| keyPanSpeed        | How fast to pan the camera when the keyboard is used. Default is 7.0 pixels per keypress.                                                                                                | 7 (pixels per keypress)              |
| minAzimuthAngle    | How far you can orbit horizontally, lower limit. From -180 to 180 degrees.                                                                                                               | Infinity (no limit)                  |
| maxAzimuthAngle    | How far you can orbit horizontally, upper limit. From -180 to 180 degrees.                                                                                                               | Infinity (no limit)                  |
| maxDistance        | How far you can dolly out.                                                                                                                                                               | Infinity                             |
| maxPolarAngle      | How far you can orbit vertically, upper limit. Range is 0 to 180 degrees.                                                                                                                | 90                                   |
| minDistance        | How far you can dolly in.                                                                                                                                                                | 0                                    |
| minPolarAngle      | How far you can orbit vertically, lower limit. Range is 0 to 180 degrees.                                                                                                                | 0                                    |
| minTargetRadius    | How close you can get the target to the 3D `cursor`.                                                                                                                                    | 0                                     |
| maxTargetRadius    | How far you can move the target from the 3D `cursor`.                                                                                                                                   | Infinity (no limit)                   |
| minZoom            | How far you can zoom in (OrthographicCamera only).                                                                                                                                       | 0                                    |
| maxZoom            | How far you can zoom out (OrthographicCamera only).                                                                                                                                      | Infinity (no limit)                  |
| panSpeed           | Speed of panning.                                                                                                                                                                        | 1                                    |
| rotateSpeed        | Speed of rotation.                                                                                                                                                                       | 1                                    |
| screenSpacePanning | Defines how the camera's position is translated when panning. If true, the camera pans in screen space. Otherwise, the camera pans in the plane orthogonal to the camera's up direction. | false                                |
| target             | Focus point of controls. look-at vector.                                                                                                                                                 | 0 0 0                                |
| zoomSpeed          | Speed of zooming / dollying.                                                                                                                                                             | 1                                    |
| zoomToCursor       | Setting this property to true allows to zoom to the cursor's position.                                                                                                                   | false                                |

### Installation

#### Browser

Install and use by directly including the [browser files](dist):

```html
<head>
  <title>My A-Frame Scene</title>
  <script src="https://aframe.io/releases/1.5.0/aframe.min.js"></script>
  <script src="https://unpkg.com/aframe-environment-component@1.3.3/dist/aframe-environment-component.min.js"></script>
  <script src="https://unpkg.com/aframe-orbit-controls@1.3.2/dist/aframe-orbit-controls.min.js"></script>
</head>

<body>
  <a-scene environment="preset: forest">
    <a-torus-knot position="0 2 0"></a-torus-knot>
    <a-entity camera look-controls="enabled: false" orbit-controls="target: 0 2 0; minDistance: 2; maxDistance: 180; initialPosition: 0 3 5; rotateSpeed: 0.5"></a-entity>
  </a-scene>
</body>
```

#### npm

Install via npm:

```bash
npm install aframe-orbit-controls
```

Then require and use.

```js
require('aframe');
require('aframe-orbit-controls');
```
