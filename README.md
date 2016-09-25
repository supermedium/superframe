# kframe

![kframe](https://cloud.githubusercontent.com/assets/674727/15790659/69860590-2987-11e6-9511-65c28e583c6f.png)

Kevin's collection of A-Frame components and scenes.

[VIEW DEMOS](https://ngokevin.github.io/kframe/)

## Components

- [animation](https://github.com/ngokevin/kframe/tree/master/components/animation/) - Animations in A-Frame using anime.js
- [audioanalyser](https://github.com/ngokevin/kframe/tree/master/components/audioanalyser/) - Audio visualizations in A-Frame using Web Audio (AnalyserNode)
- [broadcast](https://github.com/ngokevin/kframe/tree/master/components/broadcast/) - Multi-user in A-Frame using raw websockets
- [entity-generator](https://github.com/ngokevin/kframe/tree/master/components/entity-generator/) - Generate a number of entities in A-Frame given a mixin
- [event-set](https://github.com/ngokevin/kframe/tree/master/components/event-set/) - Set properties in response to events in A-Frame
- [firebase](https://github.com/ngokevin/kframe/tree/master/components/firebase/) - Multi-user in A-Frame using Firebase
- [layout](https://github.com/ngokevin/kframe/tree/master/components/layout/) - Position and layout child entities in 3D space for A-Frame
- [look-at](https://github.com/ngokevin/kframe/tree/master/components/look-at/) - Rotate an entity to face towards another entity in A-Frame
- [mountain](https://github.com/ngokevin/kframe/tree/master/components/mountain/) - Mountain terrain in A-Frame using randomly-generated height maps
- [randomizer](https://github.com/ngokevin/kframe/tree/master/components/randomizer/) - Randomize color, position, rotation, and scale in A-Frame
- [redux](https://github.com/ngokevin/kframe/tree/master/components/redux/) - Hook in Redux reducers, data bindings, and action dispatches for A-Frame
- [reverse-look-controls](https://github.com/ngokevin/kframe/tree/master/components/reverse-look-controls/) - Fork of A-Frame v0.3.0 look controls component with reversed mouse drag.
- [sun-sky](https://github.com/ngokevin/kframe/tree/master/components/sun-sky/) - Gradient sky with adjustable sun in A-Frame
- [template](https://github.com/ngokevin/kframe/tree/master/components/template/) - Encapsulate groups of entities, use templating engines, and do string interpolations in A-Frame
- [text](https://github.com/ngokevin/kframe/tree/master/components/text/) - Geometry-based text in A-Frame


## Installation

K-Frame bundles some components together to `kframe.js` for convenience:

- animation
- audio-visualizer
- entity-generator
- event-set
- layout
- look-at
- mountain
- randomizer
- sun-sky
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
