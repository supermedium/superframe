## aframe-proxy-event-component

[![Version](http://img.shields.io/npm/v/aframe-proxy-event-component.svg?style=flat-square)](https://npmjs.org/package/aframe-proxy-event-component)
[![License](http://img.shields.io/npm/l/aframe-proxy-event-component.svg?style=flat-square)](https://npmjs.org/package/aframe-proxy-event-component)

A component to declaratively proxy events for A-Frame.

For [A-Frame](https://aframe.io).

### API

| Property       | Description                                                                                                          | Default Value |
| --------       | -----------                                                                                                          | ------------- |
| captureBubbles | Whether to capture children's bubble events.                                                                         | false         |
| enabled        | Boolean used to toggle. If false, event will not be proxied.                                                         | true          |
| event          | Event name to proxy.                                                                                                 | ''            |
| from           | Selector of entities to proxy event from. If set to `PARENT`, then will listen to parent for event.                  | ''            |
| to             | Selector of entities to proxy event to. If set to `CHILDREN`, then the event is recursively proxied to all children. | ''            |
| as             | Optional. Rename the event as the event is proxied to its target(s).                                                 | ''            |
| bubbles        | Whether to bubble the proxied event.                                                                                 | false         |

### Installation

#### Browser

Install and use by directly including the [browser files](dist):

```html
<head>
  <title>My A-Frame Scene</title>
  <script src="https://aframe.io/releases/0.9.0/aframe.min.js"></script>
  <script src="https://unpkg.com/aframe-proxy-event-component/dist/aframe-proxy-event-component.min.js"></script>
</head>

<body>
  <a-scene>
    <a-entity proxy-event="event: foo; to: a-scene; as: bar"></a-entity>
  </a-scene>
</body>
```

#### npm

Install via npm:

```bash
npm install aframe-proxy-event-component
```

Then require and use.

```js
require('aframe');
require('aframe-proxy-event-component');
```
