## aframe-log-component

[![Version](http://img.shields.io/npm/v/aframe-log-component.svg?style=flat-square)](https://npmjs.org/package/aframe-log-component)
[![License](http://img.shields.io/npm/l/aframe-log-component.svg?style=flat-square)](https://npmjs.org/package/aframe-log-component)

In-VR console logs for [A-Frame](https://aframe.io).

![logging](https://user-images.githubusercontent.com/674727/27067447-d875c6ac-4fbf-11e7-94ed-b127d7468dd3.gif)

### API

#### AFRAME.log (message, channel)

Provided global function to `console.log` a message into VR.

```html
<a-scene>
  <a-entity position="0 0 -3">
    <a-entity log geometry="primitive: plane" material></a-entity>
    <a-entity log="channel: foo" geometry="primitive: plane" material></a-entity>
  </a-entity>
</a-scene>
```

```js
AFRAME.log('hello to all log entities');
AFRAME.log('hello to foo', 'foo');
```

#### Properties

| Property   | Description                                                                                 | Default Value |
| --------   | -----------                                                                                 | ------------- |
| channel    | String to specify to only render logs that are sent with a specific channel.                | ''            |
| filter     | Plain-text string filter. (e.g., `filter: bar` would match log messages with `bar` in them. | ''            |
| max        | Max number of logs to show at a time.                                                       | 100           |
| showErrors | Whether to show JS errors.                                                                  | true          |

#### `<a-log>`

Primitive with a default plane geometry, black material, and light green text.

```html
<script>
  AFRAME.registerComponent('main', {
    AFRAME.log('talking to <a-log>');
  });
</script>

<a-scene>
  <a-log position="0 0 -4"></a-log>
</a-scene>
```

#### Logging Via Events

```js
document.querySelector('a-scene').emit('log', {message: 'hello', channel: 'bar'});
```

#### Disabling copy of output to Javascript `console.log`

By default a copy of the in-VR log is also sent to the normal Javascript console via `console.log`. To disable this add `log` system to your `a-scene` and set `console` parameter to `false` (default: `true`).

```js
<a-scene log="console: false">
  <a-log position="0 0 -4"></a-log>
</a-scene>
```

### Installation

#### Browser

Install and use by directly including the [browser files](dist):

```html
<head>
  <title>My A-Frame Scene</title>
  <script src="https://aframe.io/releases/0.9.0/aframe.min.js"></script>
  <script src="https://unpkg.com/aframe-log-component/dist/aframe-log-component.min.js"></script>
</head>

<body>
  <a-scene>
    <!-- Or <a-log position="0 0 -4"></a-log>. -->
    <a-entity log geometry="primitive: plane" material="color: #111" text="color: lightgreen" position="0 0 -4"></a-entity>
  </a-scene>
</body>
```

#### npm

Install via npm:

```bash
npm install aframe-log-component
```

Then require and use.

```js
require('aframe');
require('aframe-log-component');
```

### Roadmap

- Allow listening and outputting from vanilla `console.log`s.
