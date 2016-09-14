# kframe

![kframe](https://cloud.githubusercontent.com/assets/674727/15790659/69860590-2987-11e6-9511-65c28e583c6f.png)

Kevin's collection of A-Frame components and scenes.

[VIEW DEMOS](https://ngokevin.github.io/kframe/)

## Components

- [animation](components/animation)
- [audio-visualizer](components/audio-visualizer)
- [broadcast](components/broadcast)
- [entity-generator](components/entity-generator)
- [event-set](components/event-set)
- [firebase](components/firebase)
- [layout](components/layout)
- [look-at](components/look-at)
- [randomizer](components/randomizer)
- [redux](components/redux)
- [template](components/template)
- [text](components/text)

## Installation

K-Frame bundles most of the components together for easy usage. The `firebase`
component is excluded from this bundle.

### Browser

Install and use by directly including the [browser files](dist):

```html
<head>
  <title>My A-Frame Scene</title>
  <script src="https://aframe.io/releases/0.3.0/aframe.min.js"></script>
  <script src="https://rawgit.com/ngokevin/kframe/master/dist/kframe.min.js"></script>
</head>

<body>
  <a-scene>
    <!-- Refer to individual component documentation for specific usage. -->
  </a-scene>
</body>
```

### npm

Or install from npm. Requiring K-Frame will automatically register the
components and systems.

```js
require('kframe');
```

### Installing Individual Components

For documentation on installing individual components, see the [documentation
pages](#components) for each component.
