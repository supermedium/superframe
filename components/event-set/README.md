## aframe-event-set-component

An [A-Frame](https://aframe.io) component to register event listeners that set
properties. Replacement for old undocumented Declarative Events API.

### Properties

The Event Set component can register multiple event handlers that set multiple
properties. Use double-underscores (`__`) to namespace individual instances of
the component:

```html
<a-entity event-set__1="_event: click; material.color: red; scale: 2 2 2,
          event-set__2="_event: mouseenter; material.color: blue">
```

| Property | Description                                           | Default Value |
| -------- | -----------                                           | ------------- |
| _event   | Event name.                                           | ''            |
| _target  | Query selector if setting property on another entity. | ''            |

`_event` and `_target` are prefixed with underscores to avoid name collisions
if case another component has `event` or `target` properties. Any key-value
property pairs provided beyond `_event` and `_target` will be what is set once
the event is emitted.

### Usage

#### Browser Installation

Install and use by directly including the [browser files](dist):

```html
<head>
  <title>My A-Frame Scene</title>
  <script src="https://aframe.io/releases/0.3.0/aframe.min.js"></script>
  <script src="https://unpkg.com/aframe-event-set-component@^3.0.0/dist/aframe-event-set-component.min.js"></script>
</head>

<body>
  <a-scene>
    <a-box color="green"
           event-set__1="_event: click; material.color: red; scale: 2 2 2"
           event-set__2="_event: mouseenter; material.color: blue"></a-box>
    <a-camera><a-cursor></a-cursor></a-camera>
  </a-scene>
</body>
```

#### NPM Installation

Install via NPM:

```bash
npm install aframe-event-set-component
```

Then register and use.

```js
require('aframe');
require('aframe-event-set-component');
```
