## aframe-webvr-recorder-component

A webvr-recorder component for [A-Frame](https://aframe.io) for development.
Record movements and events of the VR headset and controllers with a shortcut.
Save them to a JSON file or `localStorage`. Then replay them without having to
enter VR again, even on the go from a laptop or on a non-WebVR browser!

### Usage

Attach the component to your scene. Specify selectors to your two controllers
if any to differentiate between the two.

```html
<a-scene webvr-recorder="controller1: #controller1; controller2: #controller2">
  <a-entity id="controller1" hand-controls"></a-entity>
  <a-entity id="controller2" hand-controls"></a-entity>
</a-scene>
```

By default, the recording will be saved and replayed from `localStorage`.
Specify a `source` to read from a file:

```html
<a-scene webvr-recorder="source: recording.json; controller1: #controller1; controller2: #controller2">
```

#### Recording

Hit **`r`** on your keyboard to begin recording.

Hit **`r`** on your keyboard again to stop recording.

The recording will be currently stored in `localStorage`

#### Replaying

With the recording in `localStorage` or pointed to by a JSON file, hit **`r`**
to begin replaying.

Run `localStorage.clear()` to clear the recording if not using a JSON file.

### Installation

#### Browser

Install and use by directly including the [browser files](dist):

```html
<head>
  <title>My A-Frame Scene</title>
  <script src="https://aframe.io/releases/0.4.0/aframe.min.js"></script>
  <script src="https://unpkg.com/aframe-webvr-recorder-component/dist/aframe-webvr-recorder-component.min.js"></script>
</head>

<body>
  <a-scene webvr-recorder>
  </a-scene>
</body>
```

#### npm

Install via npm:

```bash
npm install aframe-webvr-recorder-component
```

Then require and use.

```js
require('aframe');
require('aframe-webvr-recorder-component');
```
