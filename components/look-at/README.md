## aframe-look-at-component

A component for [A-Frame](https://aframe.io) to tell an entity to face towards
another entity or position. Uses three.js's
[Object3D](http://threejs.org/docs/#Reference/Core/Object3D) `.lookAt()`

The look-at component defines the behavior for an entity to dynamically rotate
or face towards another entity or position. The rotation of the entity will be
updated on every tick. The `look-at` component can take either a vec3 position
or a [query selector][mdn-queryselector] to another entity.

## Values

| Type     | Description                                                                                                                                   |
|----------|-----------------------------------------------------------------------------------------------------------------------------------------------|
| selector | A query selector indicating another entity to track. If the other entity is moving then the `look-at` component will track the moving entity. |
| vec3     | An XYZ coordinate. The entity will face towards a static position.                                                                            |

### Usage

#### Browser Installation

Install and use by directly including the [browser files](dist):

```html
<head>
  <title>My A-Frame Scene</title>
  <script src="https://aframe.io/releases/0.2.0/aframe.min.js"></script>
  <script src="https://unpkg.com/aframe-look-at-component@^0.1.2/aframe-look-at-component.min.js"></script>
</head>

<body>
  <a-scene>
    <a-entity id="monster" geometry="primitive: box" material="src: url(monster.png)"
              look-at="[camera]"></a-entity>
    <a-entity id="player" camera></a-entity>

    <a-entity id="dog" geometry="primitive: box" material="src: url(dog.png)"
              look-at="#squirrel"></a-entity>
    <a-entity id="squirrel">
      <a-animation id="running" attribute="position" to="100 0 0"></a-animation>
    </a-entity>
  </a-scene>
</body>
```

#### NPM Installation

Install via NPM:

```bash
npm install aframe-look-at-component
```

Then register and use.

```js
require('aframe');
require('aframe-look-at-component');
```

[mdn-queryselector]: https://developer.mozilla.org/docs/Web/API/Document/querySelector
