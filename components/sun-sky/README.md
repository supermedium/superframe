## aframe-sun-sky

<img width="1060" alt="screen shot 2016-09-22 at 5 58 20 pm" src="https://cloud.githubusercontent.com/assets/674727/18770774/2c775afa-80ee-11e6-9a0a-648cea864415.png">

### Usage

#### Browser Installation

Install and use by directly including the [browser files](dist):

```html
<head>
  <title>My A-Frame Scene</title>
  <script src="https://aframe.io/releases/0.9.0/aframe.min.js"></script>
  <script src="https://unpkg.com/aframe-sun-sky@3.0.3/dist/aframe-sun-sky.min.js"></script>
</head>

<body>
  <a-scene>
    <a-sun-sky></a-sun-sky>
    // <a-entity material="shader: sunSky"></a-entity>
  </a-scene>
</body>
```

#### NPM Installation

Install via NPM:

```bash
npm install aframe-sun-sky
```

Then register and use.

```js
require('aframe');
require('aframe-sun-sky');
```
