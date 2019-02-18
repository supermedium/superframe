## aframe-animation-timeline-component

[![Version](http://img.shields.io/npm/v/aframe-animation-timeline-component.svg?style=flat-square)](https://npmjs.org/package/aframe-animation-timeline-component)
[![License](http://img.shields.io/npm/l/aframe-animation-timeline-component.svg?style=flat-square)](https://npmjs.org/package/aframe-animation-timeline-component)

[animation]: https://github.com/supermedium/superframe/tree/master/components/animation

A timeline component for A-Frame to use with the [animation
component][animation] for declaratively defining and orchestrating timelines of
animations. The animation timeline component depends on the animation
component. Make sure to include that.

[View Demo](https://supermedium.com/superframe/components/animation-timeline/)

![GIF](https://user-images.githubusercontent.com/674727/34067163-d0b3af9c-e1d2-11e7-9b3a-c9c207001e6c.gif)

Latest version requires A-Frame v0.8.0.

### Example

```html
<a-scene animation-timeline__1="timeline: #myTimeline; loop: true">
  <a-assets timeout="10000">
    <a-asset-item src="https://cdn.aframe.io/fonts/Roboto-msdf.json"></a-asset-item>

    <a-timeline id="myTimeline">
      <a-timeline-animation select="#text1" name="togglevisible"></a-timeline-animation>
      <a-timeline-animation select="#text1" name="fadein"></a-timeline-animation>
      <a-timeline-animation select="#text1" name="fadeout"></a-timeline-animation>
      <a-timeline-animation select="#text1" name="togglevisibleoff"></a-timeline-animation>

      <a-timeline-group>
        <a-timeline-animation select="a-entity[mixin~=box]" name="fadein"></a-timeline-animation>
        <a-timeline-animation select="a-entity[mixin~=box]" name="scale"></a-timeline-animation>
        <a-timeline-animation select="a-entity[mixin~=box]" name="color"></a-timeline-animation>
      </a-timeline-group>

      <a-timeline-group>
        <a-timeline-animation select="#text2" name="togglevisible"></a-timeline-animation>
        <a-timeline-animation select="#text2" name="fadein"></a-timeline-animation>
        <a-timeline-animation select="#text2" name="textcolor"></a-timeline-animation>
      </a-timeline-group>

      <a-timeline-animation select="#text2" name="fadeout"></a-timeline-animation>
      <a-timeline-animation select="#text2" name="togglevisibleoff"></a-timeline-animation>

      <a-timeline-animation select="#text3" name="togglevisible"></a-timeline-animation>
      <a-timeline-group>
        <a-timeline-animation select="a-entity[mixin~=box]" name="color"></a-timeline-animation>
        <a-timeline-animation select="a-entity[mixin~=box]" name="rotate"></a-timeline-animation>
        <a-timeline-animation select="a-entity[mixin~=box]" name="position"></a-timeline-animation>
        <a-timeline-animation select="#text3" name="fadein"></a-timeline-animation>
        <a-timeline-animation select="#text3" name="positionin"></a-timeline-animation>
      </a-timeline-group>

      <a-timeline-animation select="#text3" name="positionout"></a-timeline-animation>
      <a-timeline-animation select="#text3" name="togglevisibleoff"></a-timeline-animation>

      <a-timeline-animation select="#text4" name="togglevisible"></a-timeline-animation>

      <a-timeline-group>
        <a-timeline-animation select="#sky" name="color"></a-timeline-animation>
        <a-timeline-animation select="#text4" name="fadein"></a-timeline-animation>
      </a-timeline-group>

      <a-timeline-animation select="#text4" name="fadeout" offset="500"></a-timeline-animation>
    </a-timeline>

    <a-mixin id="box"
      geometry="primitive: box"
      material="color: #AAA; opacity: 0"
      animation__fadein="property: material.opacity; dur: 2000; from: 0; to: 1; autoplay: false"
      animation__scale="property: scale; to: 2 20 2; dur: 2000; easing: easeInOutElastic; autoplay: false"
      animation__position="property: position; to: 0 30 -3; dur: 2000; autoplay: false"
      animation__color="property: material.color; from: #AAA; to: #222; dur: 2500; autoplay: false"
      animation__rotate="property: rotation; to: 0 360; dur: 1000; easing: easeInQuad; autoplay: false"
      scale="0.0001 0.0001 0.0001"
    ></a-mixin>

    <a-mixin id="text"
      text="align: center; color: #333; width: 6; opacity: 0"
      animation__fadein="property: text.opacity; from: 0; to: 1; dur: 3000; easing: linear; autoplay: false"
      animation__fadeout="property: text.opacity; from: 1; to: 0; dur: 3000; easing: linear; autoplay: false"
      animation__togglevisible="property: visible; from: false; to: true; dur: 1; autoplay: false"
      animation__togglevisibleoff="property: visible; from: true; to: false; dur: 1; autoplay: false"
      position="0 2 -3"
      visible="false"></a-mixin>
  </a-assets>

  <a-entity id="text1" mixin="text" text="value: Is this real life?"></a-entity>
  <a-entity id="text2" mixin="text" text="value: Is this just fantasy?; opacity: 0"
            animation__textcolor="property: text.color; from: #FAFAFA; to: #8C200E; dur: 2500; autoplay: false"></a-entity>
  <a-entity id="text3" mixin="text" text="value: Caught in a landslide." position="0 -10 0"
            animation__positionin="property: position; to: 0 2 -3; dur: 2500; autoplay: false"
            animation__positionout="property: position; from: 0 2 -3; to: -10 2 -3; dur: 3500; autoplay: false"></a-entity>
  <a-entity id="text4" mixin="text" text="value: No escape from reality."></a-entity>

  <a-entity position="0 -0.5 -10">
    <a-entity id="box1" mixin="box" position="-4 0 0"></a-entity>
    <a-entity mixin="box"></a-entity>
    <a-entity mixin="box" position="4 0 0"></a-entity>
  </a-entity>

  <a-sky id="sky" color="#FAFAFA" animation__color="property: material.color; from: #FAFAFA; to: #111; dur: 2000; autoplay: false"></a-sky>
</a-scene>
```

### API

#### Elements

The timeline component provides `<a-timeline>`, `<a-timeline-group>`, and
`<a-timeline-animation>` to declaratively define the animation timeline.

**`<a-timeline id>`**

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

Make sure **`autoplay: false`** is set on all timelined animations, and I recommend
specifying `from` on each on of those animations. The timeline will not attempt
to grab from values dynamically.

| Attribute | Description                                                                                                                                                                                           |
|-----------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| select    | Selector to entity or entities to animate (e.g., `.boxes` or `#sphere`).                                                                                                                              |
| name      | ID of the animation component instance defined on the entity or entities. If the entity has an animation component `animation__fadein="property: material.opacity` then we would set `name="fadein"`. |
| offset    | Optional additional time offset in milliseconds to wait for the previous animation in the timeline to finish.                                                                                         |

**`<a-timeline-group [offset]>`**

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

#### Events

| Event                     | Description                                                                                                                  |
|---------------------------|------------------------------------------------------------------------------------------------------------------------------|
| animationtimelinecomplete | Emitted when animation timeline is complete. Event detail contains animation `name` (`__<ID>`). Not emitted if `loop: true`. |


### Installation

#### Browser

Install and use by directly including the [browser files](dist):

```html
<head>
  <title>My A-Frame Scene</title>
  <script src="https://aframe.io/releases/0.9.0/aframe.min.js"></script>
  <script src="https://unpkg.com/aframe-animation-component@^4.1.1/dist/aframe-animation-timeline-component.min.js"></script>
  <script src="https://unpkg.com/aframe-animation-timeline-component@1.6.0/dist/aframe-animation-timeline-component.min.js"></script>
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
npm install aframe-animation-component
npm install aframe-animation-timeline-component
```

Then require and use.

```js
require('aframe');
require('aframe-animation-component');
require('aframe-animation-timeline-component');
```
