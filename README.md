# kframe

![kframe](https://cloud.githubusercontent.com/assets/674727/15790659/69860590-2987-11e6-9511-65c28e583c6f.png)

Kevin's collection of A-Frame components and scenes.

[VIEW DEMOS](https://ngokevin.github.io/kframe/)

## Components

- [animation](https:/github.com/ngokevin/kframe/tree/master/components/animation/) - Animation component for A-Frame.
- [audio-visualizer](https:/github.com/ngokevin/kframe/tree/master/components/audio-visualizer/) - Audio visualizer components for A-Frame.
- [broadcast](https:/github.com/ngokevin/kframe/tree/master/components/broadcast/) - Broadcast component for A-Frame.
- [entity-generator](https:/github.com/ngokevin/kframe/tree/master/components/entity-generator/) - Entity Generator component for A-Frame.
- [event-set](https:/github.com/ngokevin/kframe/tree/master/components/event-set/) - Component to set properties in response to events.
- [firebase](https:/github.com/ngokevin/kframe/tree/master/components/firebase/) - Firebase component for multiuser A-Frame.
- [layout](https:/github.com/ngokevin/kframe/tree/master/components/layout/) - Layout component for A-Frame.
- [look-at](https:/github.com/ngokevin/kframe/tree/master/components/look-at/) - Look-at component for A-Frame.
- [mountain](https:/github.com/ngokevin/kframe/tree/master/components/mountain/) - Mountain component for A-Frame.
- [randomizer](https:/github.com/ngokevin/kframe/tree/master/components/randomizer/) - A-Frame Randomizer Components for A-Frame.
- [redux](https:/github.com/ngokevin/kframe/tree/master/components/redux/) - Redux component for A-Frame.
- [template](https:/github.com/ngokevin/kframe/tree/master/components/template/) - Template component for A-Frame.
- [text](https:/github.com/ngokevin/kframe/tree/master/components/text/) - Text geometry component for A-Frame.


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
