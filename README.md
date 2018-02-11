# kframe

![kframe](https://cloud.githubusercontent.com/assets/674727/15790659/69860590-2987-11e6-9511-65c28e583c6f.png)

Kevin's collection of A-Frame components and scenes.

[VIEW DEMOS](https://ngokevin.github.io/kframe/)

## Components

See documentation for individual components:

- [aabb-collider](https://github.com/ngokevin/kframe/tree/master/components/aabb-collider/) - An axis-aligned bounding box component for A-Frame.
- [animation](https://github.com/ngokevin/kframe/tree/master/components/animation/) - Animations in A-Frame using anime.js
- [animation-timeline](https://github.com/ngokevin/kframe/tree/master/components/animation-timeline/) - A timeline component to use with the A-Frame animation component.
- [atlas-uvs](https://github.com/ngokevin/kframe/tree/master/components/atlas-uvs/) - An A-Frame component to set UVs onto a plane geometry given a gridded texture atlas.
- [audioanalyser](https://github.com/ngokevin/kframe/tree/master/components/audioanalyser/) - Audio visualizations in A-Frame using Web Audio (AnalyserNode)
- [broadcast](https://github.com/ngokevin/kframe/tree/master/components/broadcast/) - Multi-user in A-Frame using raw websockets
- [entity-generator](https://github.com/ngokevin/kframe/tree/master/components/entity-generator/) - Generate a number of entities in A-Frame given a mixin
- [event-set](https://github.com/ngokevin/kframe/tree/master/components/event-set/) - Set properties in response to events in A-Frame
- [firebase](https://github.com/ngokevin/kframe/tree/master/components/firebase/) - Multi-user in A-Frame using Firebase
- [fps-counter](https://github.com/ngokevin/kframe/tree/master/components/fps-counter/) - A simple FPS counter component to measure performance in VR for A-Frame.
- [geometry-merger](https://github.com/ngokevin/kframe/tree/master/components/geometry-merger/) - An A-Frame component to merge geometries to reduce draw calls.
- [gltf-part](https://github.com/ngokevin/kframe/tree/master/components/gltf-part/) - A component to extract parts from a GLTF model into their own A-Frame entities.
- [haptics](https://github.com/ngokevin/kframe/tree/master/components/haptics/) - A controller haptics (vibrations) component for A-Frame.
- [layout](https://github.com/ngokevin/kframe/tree/master/components/layout/) - Position and layout child entities in 3D space for A-Frame
- [log](https://github.com/ngokevin/kframe/tree/master/components/log/) - In-VR console logs for A-Frame.
- [look-at](https://github.com/ngokevin/kframe/tree/master/components/look-at/) - Rotate an entity to face towards another entity in A-Frame
- [mountain](https://github.com/ngokevin/kframe/tree/master/components/mountain/) - Mountain terrain in A-Frame using randomly-generated height maps
- [proxy-event](https://github.com/ngokevin/kframe/tree/master/components/proxy-event/) - A component to declaratively proxy events for A-Frame.
- [randomizer](https://github.com/ngokevin/kframe/tree/master/components/randomizer/) - Randomize color, position, rotation, and scale in A-Frame
- [state](https://github.com/ngokevin/kframe/tree/master/components/state/) - State management for A-Frame using single global state modified through actions. State flows down to application via declarative binding.
- [sun-sky](https://github.com/ngokevin/kframe/tree/master/components/sun-sky/) - Gradient sky with adjustable sun in A-Frame
- [template](https://github.com/ngokevin/kframe/tree/master/components/template/) - Encapsulate groups of entities, use templating engines, and do string interpolations in A-Frame
- [text-geometry](https://github.com/ngokevin/kframe/tree/master/components/text-geometry/) - Geometry-based text for A-Frame


## Local Installation

Go to the folder of the component or scene you wish to develop and check out
its README. The steps generally involve:

```bash
git clone git@github.com:ngokevin/kframe && cd kframe
# Head to the folder to develop (e.g., `cd components/foo`, `cd scenes/foo`).
npm install
npm run dev  # (or sometimes `npm run start`)
```

A page should open in your browser. You can develop on the source code and the
server will handle live compilation and bundling.
