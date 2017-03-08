## aframe-animation-component

An animation component for [A-Frame](https://aframe.io) using
[anime.js](https://github.com/juliangarnier/anime).

![animation](https://cloud.githubusercontent.com/assets/674727/23724348/3991d594-0401-11e7-9b90-31ef43ee7e54.gif)

### Why?

A-Frame has an `<a-animation>` API out of the box. Why build a component version?

- **Imperative Ergonomics:** Imperatively set animations and all of its
  properties with a single `setAttribute` call. With `<a-animation>`, we must
  do `createElement`, multiple `setAttribute`s, `appendChild`, and
  `addEventListener('loaded')`.
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
  not being tied to A-Frame versions, we can add things quickly such as timeline support.
- **anime.js**: anime.js has great performance over Tween.js and tons of great animation features.

### API

#### Component Name

Base name is `animation`. Although we can attach multiple animations to one
entity by name-spacing the component with double underscores (`__`):

```html
<a-entity animation="property: rotation"
          animation__2="property: position"
          animation__color="property: material.color"></a-entity>
```

#### Properties

| Property    | Description                                                                                                                           | Default Value | Values                  |
| --------    | -----------                                                                                                                           | ------------- | ------                  |
| delay       | How long (milliseconds) to wait before starting.                                                                                      | 0             |                         |
| dir         | Which dir to go from `from` to `to`.                                                                                            | normal        | alternate, reverse      |
| dur         | How long (milliseconds) each cycle of the animation is.                                                                               | 1000          |                         |
| easing      | Easing function of animation. To ease in, ease out, ease in and out.                                                                  | easeInQuad    | See [easings](#easings) |
| elasticity  | How much to bounce (higher is stronger).                                                                                              | 400           |                         |
| loop        | Whether to repeat animation indefinitely.                                                                                             | false         |                         |
| pauseEvents | Comma-separated list of events to listen to to pause.                                                                                 | null          |
| property    | Property to animate. Can be a component name, a dot-delimited property of a component (e.g., `material.color`), or a plain attribute. |               |                         |
| round       | Whether to round values.                                                                                                              | false         |                         |
| startEvents | Comma-separated list of events to listen to before playing. Animation will not autoplay if specified.                                 | null          |


#### Easings

Choose one type from the `Type` column, and combine it with one function from
the `Function` column. For example: `easeInOutElastic`. The only exception is
`linear` which stands on its own.

| Type      | Function |
| --------  | -------- |
| easeIn    | Quad     |
| easeOut   | Cubic    |
| easeInOut | Quart    |
|           | Quint    |
|           | Expo     |
|           | Sine     |
|           | Circ     |
|           | Elastic  |
|           | Back     |
|           | Bounce   |

#### Events

| Property                 | Description                                                               |
| --------                 | -----------                                                               |
| animationbegin           | Animation began.                                                          |
| animationcomplete        | Animation completed.                                                      |
| animation__[ID]-begin    | Animation completed. Different event emitted depending on animation name. |
| animation__[ID]-complete | Animation completed. Different event emitted depending on animation name. |

### Installation

#### Browser

Install and use by directly including the [browser files](dist):

```html
<head>
  <title>My A-Frame Scene</title>
  <script src="https://aframe.io/releases/0.3.0/aframe.min.js"></script>
  <script src="https://unpkg.com/aframe-animation-component@^3.2.0/dist/aframe-animation-component.min.js"></script>
</head>

<body>
  <a-scene>
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
