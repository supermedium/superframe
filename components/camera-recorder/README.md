## aframe-camera-recorder-component

[![Version](http://img.shields.io/npm/v/aframe-camera-recorder-component.svg?style=flat-square)](https://npmjs.org/package/aframe-camera-recorder-component)
[![License](http://img.shields.io/npm/l/aframe-camera-recorder-component.svg?style=flat-square)](https://npmjs.org/package/aframe-camera-recorder-component)

A component to smoothly film and record A-Frame scenes to GIF with a controlled
camera using [ccapture.js](https://github.com/spite/ccapture.js/).

![](https://user-images.githubusercontent.com/674727/42717535-8f4f1896-86b6-11e8-9093-0cdeaa3c5557.gif)

[Demo](https://supermedium.com/superframe/components/camera-recorder/)

### API

| Property          | Description                                                                                 | Default Value                                                         |
| --------          | -----------                                                                                 | -------------                                                         |
| dur               | Length of video.                                                                            | 3000                                                                  |
| enabled           | Whether to listen to play events.                                                           | true                                                                  |
| framerate         | Framerate of capture. More takes longer to process.                                         | 60                                                                    |
| lookAt            | Point (vec3) for camera to focus on (optional).                                             | null                                                                  |
| holdTimeAfter     | Duration to keep recording after camera animation finishes.                                 | 250                                                                   |
| motionBlurEnabled | Not sure if this does anything, parameter passed to CCapture.js.                            | true                                                                  |
| name              | Download file name.                                                                         | ''                                                                    |
| quality           | Quality...I think this goes from 0 to 10?                                                   | 10                                                                    |
| positionFrom      | Camera starting position to animate from.                                                   | 0 0 0                                                                 |
| positionTo        | Camera starting position to animate to .                                                    | 0 0 0                                                                 |
| rotationFrom      | Camera starting rotation.                                                                   | 0 0 0                                                                 |
| rotationTo        | Camera end rotation.                                                                        | 0 0 0                                                                 |
| showControls      | Whether to inject buttons to control the recording (e.g., preview, record).                 | true                                                                  |
| workers           | Number of workers used to process the GIF. Best to use the same amount of cores as the CPU. | 8                                                                     |
| workerPath        | Path to the required worker JS file to process the GIF.                                     | https://rawgit.com/supermedium/superframe/master/components/camera-recorder/ |

### Converting to Video

The GIF will be large file size that can be reduced to like 70x smaller file
size to mp4. Here is an ffmpeg command:

`ffmpeg -i mygif.gif -movflags faststart -pix_fmt yuv420p -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" myvideo.mp4`

### Installation

#### Browser

Include the worker file on a path that can be referenced. Defaults to hosted version
at `https://rawgit.com/supermedium/superframe/master/components/camera-recorder/gif.worker.js`.

Install and use by directly including the [browser files](dist):

```html
<head>
  <title>My A-Frame Scene</title>
  <script src="https://aframe.io/releases/0.9.0/aframe.min.js"></script>
  <script src="https://unpkg.com/aframe-camera-recorder-component@1.5.0/dist/aframe-camera-recorder-component.min.js"></script>
</head>

<body>
  <a-scene>
    <a-entity camera camera-recorder="positionTo: -1 1.6 -7; lookAt: -8 5 8" position="5 1.6 0"></a-entity>
  </a-scene>
</body>
```

#### npm

Install via npm:

```bash
npm install aframe-camera-recorder-component
```

Then require and use.

```js
require('aframe');
require('aframe-camera-recorder-component');
```
