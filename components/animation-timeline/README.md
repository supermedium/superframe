## aframe-animation-timeline-component

[![Version](http://img.shields.io/npm/v/aframe-animation-timeline-component.svg?style=flat-square)](https://npmjs.org/package/aframe-animation-timeline-component)
[![License](http://img.shields.io/npm/l/aframe-animation-timeline-component.svg?style=flat-square)](https://npmjs.org/package/aframe-animation-timeline-component)

[animation]: https://github.com/ngokevin/kframe/tree/master/components/animation

A timeline component to use with my [A-Frame animation component][animation].
For [A-Frame](https://aframe.io).

### Example

```html
<a-scene animation-timeline__1="timeline: #myTimeline">
  <a-assets>
    <a-timeline id="myTimeline">
      <a-timeline-animation select="#welcomeText" name="fadein"></a-timeline-animation>
      <a-timeline-animation select="#welcomeText" name="fadeout" offset="500"></a-timeline-animation>

      <a-timeline-group>
        <a-timeline-animation select=".box" name="scale"></a-timeline-animation>
        <a-timeline-animation select=".sphere" name="rotate"></a-timeline-animation>
      </a-timeline-group>
    </a-timeline>

    <a-mixin id="boxScale" animation__scale="property: scale; to: 1.2 1.2 1.2; loop: true; direction: alternate; startEvents: null"></a-mixin>
    <a-mixin id="sphereRotate" animation__scale="property: rotation; to: 360 360 360; loop: true; startEvents: null"></a-mixin>
  </a-assets>

  <a-entity id="welcomeText"
            animation-timeline__fadein="property: text.opacity; from: 0; to: 1; startEvents: null"
            animation-timeline__fadeout="property: text.opacity; from: 1; to 0; startEvents: null"
            text="opacity: 0; value: Welcome to the dankest timeline."
            position="0 0 -3"></a-entity>

  <a-box class="box" mixin="boxScale" color="red" position="-2 0 0"></a-box>
  <a-box class="box" mixin="boxScale" color="red"></a-box>
  <a-box class="box" miixn="boxScale" color="red" position="2 0 0"></a-box>

  <a-sphere class="sphere" mixin="sphereScale" color="blue" opacity="0.5" position="-2 0 0"></a-sphere>
  <a-sphere class="sphere" mixin="sphereScale" color="blue" opacity="0.5"></a-sphere>
  <a-sphere class="sphere" miixn="sphereScale" color="blue" opacity="0.5" position="2 0 0"></a-sphere>
</a-scene>
```

### API

#### Elements

The timeline component provides `<a-timeline>`, `<a-timeline-group>`, and
`<a-timeline-animation>` to declaratively define the animation timeline.

**`<a-timeline id>">`**

Container element. Note `<a-timeline>` is just a data container. It is not an
entity, primitive, nor does it do anything on its own. It's meant to be selected
like `<a-entity animation-timeline="timeline: #myTimeline">`. Animation and
animation groups under `<a-timeline>` play sequentially in order, one after
another once the previous animation or animation group is finished..

| Attribute | Description                                                                        |
|-----------|------------------------------------------------------------------------------------|
| id        | Should be specified in order to select it from the `animation-timeline` component. |

**`<a-timeline-animation select name offset>`**

`<a-timeline-animation>` is used to add animations to the timeline via
reference, either directly under `<a-timeline>` or under `<a-timeline-group>`.

Note that `<a-timeline-animation>` does **not** define the actual animation
parameters. Animations are defined using the `animation` component on the
entity or entities. `<a-timeline-animation>` merely points to them and adds
their animation configurations to the timeline object.

| Attribute | Description                                                                                                                                                                                           |
|-----------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| select    | Selector to entity or entities to animate (e.g., `.boxes` or `#sphere`).                                                                                                                              |
| name      | ID of the animation component instance defined on the entity or entities. If the entity has an animation component `animation__fadein="property: material.opacity` then we would set `name="fadein"`. |
| offset    | Optional additional time offset in milliseconds to wait for the previous animation in the timeline to finish.                                                                                         |

**`<a-timeline-group [offset]">`**

`<a-timeline-group>` groups together `<a-timeline-animation>`s that we want to
start at the same time. Only once every animation in the group finishes will
the timeline move onto the next animation or animation group.

| Attribute | Description                                                                                                                                                                                           |
|-----------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| offset    | Optional additional time offset in milliseconds to wait for the previous animation in the timeline to finish.                                                                                         |

#### Properties

Pairing with the `<a-timeline>` container is the `animation-timeline`
component. It doesn't really matter which entity (or on `<a-scene>`) the
`animation-timeline` component is set on since it doesn't operate on any single
entity.

| Property    | Description                                                                                                                     | Default Value |
| --------    | -----------                                                                                                                     | ------------- |
| timeline    | Selector to `<a-timeline>` element.                                                                                             | ''            |
| direction   | Direction of animation (`normal`, `reverse`, `alternate`).                                                                      | normal        |
| loop        | Number of times to loop. Set `true` to loop infinitely.                                                                         | 0             |
| startEvents | Comma-separated list of events to wait that will trigger the timeline animation. If not specified, the animation will autoplay. | ''            |

### Installation

#### Browser

Install and use by directly including the [browser files](dist):

```html
<head>
  <title>My A-Frame Scene</title>
  <script src="https://aframe.io/releases/0.7.1/aframe.min.js"></script>
  <script src="https://unpkg.com/aframe-animation-timeline-component/dist/aframe-animation-timeline-component.min.js"></script>
</head>

<body>
  <a-scene animation-timeline__1="timeline: #myTimeline">
    <a-assets>
      <a-timeline id="myTimeline">
        <a-timeline-animation select="#welcomeText" name="fadein"></a-timeline-animation>
        <a-timeline-animation select="#welcomeText" name="fadeout" offset="500"></a-timeline-animation>

        <a-timeline-group>
          <a-timeline-animation select=".box" name="scale"></a-timeline-animation>
          <a-timeline-animation select=".sphere" name="rotate"></a-timeline-animation>
        </a-timeline-group>
      </a-timeline>

      <a-mixin id="boxScale" animation__scale="property: scale; to: 1.2 1.2 1.2; loop: true; direction: alternate; startEvents: null"></a-mixin>
      <a-mixin id="sphereRotate" animation__scale="property: rotation; to: 360 360 360; loop: true; startEvents: null"></a-mixin>
    </a-assets>

    <a-entity id="welcomeText"
              animation-timeline__fadein="property: text.opacity; from: 0; to: 1; startEvents: null"
              animation-timeline__fadeout="property: text.opacity; from: 1; to 0; startEvents: null"
              text="opacity: 0; value: Welcome to the dankest timeline."
              position="0 0 -3"></a-entity>

    <a-box class="box" mixin="boxScale" color="red" position="-2 0 0"></a-box>
    <a-box class="box" mixin="boxScale" color="red"></a-box>
    <a-box class="box" miixn="boxScale" color="red" position="2 0 0"></a-box>

    <a-sphere class="sphere" mixin="sphereScale" color="blue" opacity="0.5" position="-2 0 0"></a-sphere>
    <a-sphere class="sphere" mixin="sphereScale" color="blue" opacity="0.5"></a-sphere>
    <a-sphere class="sphere" miixn="sphereScale" color="blue" opacity="0.5" position="2 0 0"></a-sphere>
  </a-scene>
</body>
```

#### npm

Install via npm:

```bash
npm install aframe-animation-timeline-component
```

Then require and use.

```js
require('aframe');
require('aframe-animation-timeline-component');
```
