# kframe

![kframe](https://cloud.githubusercontent.com/assets/674727/15790659/69860590-2987-11e6-9511-65c28e583c6f.png)

Kevin's collection of A-Frame components and scenes.

[VIEW DEMOS](https://ngokevin.github.io/kframe/)

## Components

{% for component in components -%}
- [{{ component.name }}]({{ component.github }}) - {{ component.description }}
{% endfor %}

## Installation

K-Frame bundles some components together to `kframe.js` for convenience:

{% for component in bundled -%}
- {{ component }}
{% endfor %}

### Browser

Install and use by directly including the [browser files](dist):

```html
<head>
  <title>My A-Frame Scene</title>
  <script src="https://aframe.io/releases/0.3.0/aframe.min.js"></script>
  <script src="https://rawgit.com/ngokevin/kframe/master/dist/kframe.min.js"></script>
</head>

<body>
  <a-scene>
    <!-- Refer to individual component documentation for specific usage. -->
  </a-scene>
</body>
```

### npm

Or install from npm. Requiring K-Frame will automatically register the
components and systems.

```js
require('kframe');
```

### Installing Individual Components

For documentation on installing individual components, see the [documentation
pages](#components) for each component.

## Local Installation

```bash
git clone git@github.com:ngokevin/kframe
npm install  # Run npm install on all inner modules
npm run dev  # Webpack dev server that watches all component files
```
