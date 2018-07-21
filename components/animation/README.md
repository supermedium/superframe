## aframe-animation-component

[animationtimeline]: https://github.com/ngokevin/kframe/tree/master/components/animation-timeline

An animation component for [A-Frame](https://aframe.io) using
[anime.js](https://github.com/juliangarnier/anime).

Also check out the [animation-timeline component][animationtimeline] for
defining and orchestrating timelines of animations.

![animation](https://cloud.githubusercontent.com/assets/674727/23724348/3991d594-0401-11e7-9b90-31ef43ee7e54.gif)

Latest version requires A-Frame v0.8.0.

### API

#### Properties

| Property      | Description                                                                                                                                                                                                                                                                                  | Default Value | Values                  |
| --------      | -----------                                                                                                                                                                                                                                                                                  | ------------- | ------                  |
| property      | Property to animate. Can be a component name, a dot-delimited property of a component (e.g., `material.color`), or a plain attribute.                                                                                                                                                        |               |                         |
| isRawProperty | Flag to animate an arbitrary object property outside of A-Frame components for better performance. If set to true, for example, we can set `property` to like `components.material.material.opacity`. If `property` starts with `components` or `object3D`, this will be inferred to `true`. | false         |                         |
| from          | Initial value at start of animation. If not specified, the current property value of the entity will be used (will be sampled on each animation start). It is best to specify a `from` value when possible for stability.                                                                    | null          |                         |
| to            | Target value at end of animation.                                                                                                                                                                                                                                                            | null          |                         |
| type          | Right now only supports `color` for tweening `isRawProperty` color XYZ/RGB vector  values.                                                                                                                                                                                                   | ''            |                         |
| delay         | How long (milliseconds) to wait before starting.                                                                                                                                                                                                                                             | 0             |                         |
| dir           | Which dir to go from `from` to `to`.                                                                                                                                                                                                                                                         | normal        | alternate, reverse      |
| dur           | How long (milliseconds) each cycle of the animation is.                                                                                                                                                                                                                                      | 1000          |                         |
| easing        | Easing function of animation. To ease in, ease out, ease in and out.                                                                                                                                                                                                                         | easeInQuad    | See [easings](#easings) |
| elasticity    | How much to bounce (higher is stronger).                                                                                                                                                                                                                                                     | 400           |                         |
| loop          | How many times the animation should repeat. If the value is `true`, the animation will repeat infinitely.                                                                                                                                                                                    | 0             |                         |
| round         | Whether to round values.                                                                                                                                                                                                                                                                     | false         |                         |
| startEvents   | Comma-separated list of events to listen to trigger play/restart. Animation will not autoplay if specified.                                                                                                                                                                                  | null          |                         |
| pauseEvents   | Comma-separated list of events to listen to trigger pause. Can be resumed with `resumeEvents`.                                                                                                                                                                                               | null          |                         |
| resumeEvents  | Comma-separated list of events to listen to trigger resume after pausing.                                                                                                                                                                                                                    | null          |                         |
| autoplay      | Whether or not the animation should `autoplay`. Should be specified if the animation is defined for the [`animation-timeline` component][animationtimeline].                                                                                                                                 | null          |                         |
| enabled       | Toggle startEvents effect.                                                                                                                                                                                                                                                                   | true          |

#### Multiple Animations

Base name is `animation`. We can attach multiple animations to one entity by
name-spacing the component with double underscores (`__`):

```html
<a-entity animation="property: rotation"
          animation__2="property: position"
          animation__color="property: material.color"></a-entity>
```

#### Easings

| easeIn        | easeOut        | easeInOut
|---------------|----------------|------------------|
| easeInQuad    | easeOutQuad    | easeInOutQuad    |
| easeInCubic   | easeOutCubic   | easeInOutCubic   |
| easeInQuart   | easeOutQuart   | easeInOutQuart   |
| easeInQuint   | easeOutQuint   | easeInOutQuint   |
| easeInSine    | easeOutSine    | easeInOutSine    |
| easeInExpo    | easeOutExpo    | easeInOutExpo    |
| easeInCirc    | easeOutCirc    | easeInOutCirc    |
| easeInBack    | easeOutBack    | easeInOutBack    |
| easeInElastic | easeOutElastic | easeInOutElastic |

#### Events

| Property          | Description                                                     |
| --------          | -----------                                                     |
| animationbegin    | Animation began. Event detail contains `name` of animation.     |
| animationcomplete | Animation completed. Event detail contains `name` of animation. |

#### Members

| Member    | Description      |
|-----------|------------------|
| animation | anime.js object. |

#### Using anime.js Directly

anime is a popular and powerful animation engine. The component prefers to do
just basic tweening and touches only the surface of what anime can do (e.g.,
timelines, motion paths, progress, seeking). If we need more animation
features, create a separate component that uses anime.js directly. anime is
accessible via **`AFRAME.anime`**.

Read through and explore the [anime.js
documentation](https://github.com/juliangarnier/anime) and
[website](https://animejs.com).

### Installation

#### Browser

Install and use by directly including the [browser files](dist):

```html
<head>
  <title>My A-Frame Scene</title>
  <script src="https://aframe.io/releases/0.8.0/aframe.min.js"></script>
  <script src="https://unpkg.com/aframe-animation-component@^4.1.2/dist/aframe-animation-component.min.js"></script>
</head>

<body>
  <a-scene>
    <a-entity geometry="primitive: box" material="color: black"
              animation__color="property: material.color; dir: alternate; dur: 1000;
                                easing: easeInSine; loop: true; to: #FFF">
    </a-entity>

    <a-entity geometry="primitive: box" material="color: orange"
              animation__fadein="property: material.opacity; dur: 100;
                                  easing: linear; from 0; to: 1; startEvents: fadein"
              animation__fadeout="property: material.opacity; dur: 100;
                                  easing: linear; from 1; to: 0; startEvents: fadeout"
    </a-entity>

    <a-cylinder color="#F55" radius="0.1"
                animation="property: color; dir: alternate; dur: 1000;
                           easing: easeInSine; loop: true; to: #5F5"
                animation__scale="property: scale; dir: alternate; dur: 200;
                           easing: easeInSine; loop: true; to: 1.2 1 1.2"
                animation__yoyo="property: position; dir: alternate; dur: 1000;
                                 easing: easeInSine; loop: true; to: 0 2 0">
    </a-cylinder>

  </a-scene>
</body>
```

#### npm

Install via npm:

```bash
npm install aframe-animation-component
```

Then register and use.

```js
require('aframe');
require('aframe-animation-component');
```

### Versus `<a-animation>`

I expect to deprecate `<a-animation>` in favor for this component.

- **Imperative Ergonomics:** Imperatively set animations and all of its
  properties with a single `setAttribute` call. With `<a-animation>`, we must
  do `createElement`, multiple `setAttribute`s, `appendChild`, and
  `addEventListener('loaded')`.
- **Performance:** The animation component takes advantage of shortcut updates of
  positions, rotations, and scales. In later versions of A-Frame, A-Frame allows
  us to performantly modify these transformation properties without going
  through the whole `.setAtttribute` flow.
- **Synchronous:** Setting a component is synchronous, meaning it takes effect
  immediately. With `<a-animation>`, we must wait for it to append to the DOM
  and register a callback listener.
- **Consistency with the Framework:** The animation component fits into
  A-Frame's entity-component-system framework. The `<a-animation>` tag is the
  only outlier in which we must use a DOM element to modify an entity.
- **Simpler API:** The animation component uses anime.js, a popular and simple
  JavaScript animation library. `<a-animation>`'s API is loosely based off of
  Web Animations draft specification which is overly complex.
- **Easier Maintenance:** The animation component uses A-Frame's component API
  as well as anime.js. `<a-animation>` uses the Custom Element polyfill directly
  with tween.js. anime.js's features makes the animation codebase much slimmer
  (140 vs 550 lines of code).
- **Features:** The animation component has the features of the newly popular
  anime.js library (e.g., color interpolation).
- **Faster Development:** Being detached from the A-Frame core library means faster
  iteration of features. Due to being easier to maintain, having more features, and
  not being tied to A-Frame versions, we can add things quickly such as
  timeline support.
- **anime.js**: anime.js has great performance over Tween.js and tons of great
  animation features.
- **Less Bugs**: `<a-animation>` has not been touched in ages. This component
  has lesss issues filed against it, and people usually end up switching to the
  component once they run into issues with `<a-animation>`.
