# kframe

![kframe](https://cloud.githubusercontent.com/assets/674727/15790659/69860590-2987-11e6-9511-65c28e583c6f.png)

Kevin's collection of A-Frame components and scenes.

[VIEW DEMOS](https://ngokevin.github.io/kframe/)

## Components

- [animation](tree/components/animation/) - Animations using anime.js
- [audio-visualizer](tree/components/audio-visualizer/) - Audio visualizations using WebAudio
- [broadcast](tree/components/broadcast/) - Multi-user using raw websockets
- [entity-generator](tree/components/entity-generator/) - Generate a number of entities given a mixin
- [event-set](tree/components/event-set/) - Set properties in response to events
- [firebase](tree/components/firebase/) - Multi-user using Firebase
- [layout](tree/components/layout/) - Position and layout child entities in 3D space
- [look-at](tree/components/look-at/) - Rotate an entity to face towards another entity
- [randomizer](tree/components/randomizer/) - Randomize color, position, rotation, scale
- [redux](tree/components/redux/) - Hook in Redux reducers, data bindings, and action dispatches (WIP)
- [template](tree/components/template/) - Encapsulate groups of entities, use templating engines, and do string interpolations
- [text](tree/components/text/) - Geometry-based text

## Installation

K-Frame bundles some components together for convenience:

- animation
- audio-visualizer
- entity-generator
- event-set
- layout
- randomizer
- template
- text

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

## Local Installation

```bash
git clone git@github.com:ngokevin/kframe
npm install  # Run npm install on all inner modules
npm run dev  # Webpack dev server that watches all component files
```
