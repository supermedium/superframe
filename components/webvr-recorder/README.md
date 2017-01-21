## aframe-webvr-recorder-component

A-Frame component to record WebVR pose and events to localStorage or JSON. Then
replay them without needing VR. Primarily for development.

Record movements and events of the VR headset and controllers with a shortcut.
Save them to a JSON file or `localStorage`. Then replay them without having to
enter VR again, even on the go from a laptop or on a non-WebVR browser!

### Usage

Attach the component to your scene. Specify selectors to your two controllers
if any to differentiate between the two.

```html
<a-scene webvr-recorder="controller1: #controller1; controller2: #controller2">
  <a-entity id="controller1" hand-controls="left"></a-entity>
  <a-entity id="controller2" hand-controls="right"></a-entity>
</a-scene>
```

By default, the recording will be downloadable and replayed through a file
called `webvr-recorder.json`. You can specify the `source` file name from which
the component will save and from which the component will replay:

```html
<a-scene webvr-recorder="source: myRecording.json; controller1: #controller1; controller2: #controller2">
```

#### Recording

Hit **`r`** on your keyboard to begin recording.

Hit **`r`** on your keyboard again to stop recording.

The recording will be stored in `localStorage` and printed out on the console
as JSON. A button will also pop up to download the recording JSON.

#### Replaying

With the recording in `localStorage` or pointed to by a JSON file, hit **`r`**
to begin replaying.

Hit **`r`** again on your keyboard to pause recording.

To re-record, run `localStorage.clear()` or remove the JSON file. Refresh, then
record again.

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
