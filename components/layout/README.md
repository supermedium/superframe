## aframe-layout-component

Layout component for [A-Frame](https://aframe.io).

![Layout](https://cloud.githubusercontent.com/assets/674727/21413536/eb325152-c7ac-11e6-8f1b-3a5f4714dfbe.png)

Automatically positions child entities in 3D space, with several layouts to
choose from. Define the layout on the parent entity:

```html
<a-entity layout="type: line; margin: 2">
  <a-box></a-box>
  <a-box></a-box>
  <a-box></a-box>
</a-entity>
```

And then the positions will automatically be calculated and set:

```html
<a-entity layout="type: line; margin: 2">
  <a-box position="0 0 0"></a-box>
  <a-box position="2 0 0"></a-box>
  <a-box position="4 0 0"></a-box>
</a-entity>
```

As entities are added or removed, the layout component will trigger a reflow on
the positions.

We move then entire group around while maintaining the layout:

```html
<a-entity layout="type: line; margin: 2" position="0 5 -5">
  <a-box position="0 0 0"></a-box>
  <a-box position="2 0 0"></a-box>
  <a-box position="4 0 0"></a-box>
</a-entity>
```

### Properties

| Property     | Description                                                                                        | Default Value |
|--------------|----------------------------------------------------------------------------------------------------|---------------|
| type         | Type of layout. Can be one of `box`, `circle`, `cube`, `dodecahedron`, `line`, `pyramid`.          | `line`        |
| columns      | Number of columns (for type `box`).                                                                | 1             |
| margin       | Margin in meters (for type `box`, `line`).                                                         | 1             |
| marginColumn | Margin in meters just for the columns (for type `box`). Defaults to `margin` value.                | 1             |
| marginRow    | Margin in meters just for the rows (for type `box`). Defaults to `margin` value.                   | 1             |
| plane        | Which plane direction for 2D layout. Can be `xy`, `yz`, or `xz` (for type `box`, `circle`, `line`) | `xy`          |
| radius       | Radius in meters (for type `circle`, `cube`, `dodecahedron`, `pyramid`.                            | 1             |
| reverse      | Whether to reverse direction of layout.                                                            | false         |
| angle        | For type `circle`, set this to position items `angle` degrees apart                                | false         |

### Usage

#### Browser Installation

Install and use by directly including the [browser files](dist):

```html
<head>
  <title>My A-Frame Scene</title>
  <script src="https://aframe.io/releases/0.5.0/aframe.min.js"></script>
  <script src="https://unpkg.com/aframe-layout-component@4.2/dist/aframe-layout-component.min.js"></script>
</head>

<body>
  <a-scene>
    <a-entity layout="type: circle; radius: 10">
      <a-entity geometry="primitive: box" material></a-entity>
      <a-entity geometry="primitive: box" material></a-entity>
      <a-entity geometry="primitive: box" material></a-entity>
      <a-entity geometry="primitive: box" material></a-entity>
      <a-entity geometry="primitive: box" material></a-entity>
      <a-entity geometry="primitive: box" material></a-entity>
      <a-entity geometry="primitive: box" material></a-entity>
      <a-entity geometry="primitive: box" material></a-entity>
    </a-entity>
  </a-scene>
</body>
```

#### NPM Installation

Install via NPM:

```bash
npm install aframe-layout-component
```

Then register and use.

```js
require('aframe');
require('aframe-layout-component');
```
