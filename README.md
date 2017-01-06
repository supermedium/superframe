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


## Component Usage

K-Frame no longer provides a bundle. Each component should be installed
individually. Each component is published individually to npm, generates its
own `dist/` builds in their folders, and has its own README. Components live
within the `components/` folder.

In general, you can install a component in one of several ways:

### Browser Installation

Install and use by directly including a component's `dist/` files. For example,
with the text geometry component:

```html
<head>
  <title>My A-Frame Scene</title>
  <script src="https://aframe.io/releases/0.4.0/aframe.min.js"></script>
  <script src="https://unpkg.com/aframe-text-component@0.4.x/dist/aframe-text-component.min.js"></script>
</head>
<body>
  <a-scene>
    <a-entity text="text: What's up"></a-entity>
  </a-scene>
</body>
```

### npm Installation

Install via npm. For example, with the text geometry component:

```bash
npm install aframe-text-component
```

Then register and use.

```js
require('aframe');
require('aframe-text-component');
```

## Local Development

```bash
git clone git@github.com:ngokevin/kframe
npm install  # Run npm install on all inner modules
npm run dev  # Webpack dev server that watches all component files
npm run dev -- text  # Webpack dev server that watches only one component
```
