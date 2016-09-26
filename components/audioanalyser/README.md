## aframe-audioanalyser-component

Audio visualizations for [A-Frame](https://aframe.io) using Web Audio (`AnalyserNode`).

![analyser](https://cloud.githubusercontent.com/assets/674727/18812560/9ad8acf6-828d-11e6-9cea-a39487e5ffdc.gif)

These components mostly provide processed Web Audio data (beat detection,
levels, volume, waveform). How that is visualized is up to you (by writing
components that use this data to have a visual effect). Components will generally
implement the `tick` handler and read the analyser data. See the examples for
some example visualization components.

Not tested on mobile.

### Properties

| Property              | Description                                                          | Default Value |
| --------              | -----------                                                          | ------------- |
| enableBeatDetection   | Whether or not to detect beats. Disable if not using.                | true          |
| enableLevels          | Whether or not to store frequency data. Disable if not using.        | true          |
| enableVolume          | Whether or not to calculate average volume. Disable if not using.    | true          |
| enableWaveform        | Whether or not to store waveform data. Disable if not using.         | true          |
| fftSize               | Frequency domain.                                                    | 2048          |
| smoothingTimeConstant | How smooth the frequency data is returned.                           | 0.8           |
| unique                | Whether to share the audio instance with other visualizing entities. | false         |

### Members

| Member   | Description                                                       | Type          |
| -------- | -----------                                                       | ------------- |
| analyser | Web Audio AnalyserNode                                            | AnalyserNode  |
| volume   | Whether or not to store frequency data. Disable if not using.     | number        |
| waveform | Whether or not to calculate average volume. Disable if not using. | Uint8Array    |
| levels   | Whether or not to store waveform data. Disable if not using.      | Uint8Array    |

To access the analyser node:

```
el.components.audioanalyser.analyser;
```

### Events

| Event Name          | Description                        |
| --------            | -----------                        |
| audioanalyser-beat  | Beat detected with beat detection. |
| audioanalyser-ready | AnalyserNode initialized.          |

### Usage

#### Browser Installation

Install and use by directly including the [browser files](dist):

```html
<head>
  <title>Audio Visualizer</title>
  <script src="https://aframe.io/releases/0.3.1/aframe.min.js"></script>
  <script src="https://unpkg.com/aframe-audioanalyser-component/dist/aframe-audioanalyser-components.min.js"></script>
</head>

<body>
  <a-scene>
    <a-assets>
      <audio id="song" src="rickroll.mp3" autoplay loop></audio>
    </a-assets>
    <a-entity
      audio-analyser="#song"
      component-that-does-stuff-with-audio-analyser-data
    ></a-entity>
  </a-scene>
</body>
```

#### NPM Installation

Install via NPM:

```bash
npm install aframe-audioanalyser-component
```

Then register and use.

```js
require('aframe');
require('aframe-audioanalyser-component');
```
