## aframe-template-component

A template component for [A-Frame](https://aframe.io) VR.

Features:

- Simple ES6-style templating
- Defining context variables via data attributes or from components
- Agnostic template engine support, choose from popular templating engines
- Rendering templates before, at the beginning, at the end, or after entities
- Loading templates defined within script tags
- Loading external templates
- Lazy-loading template engines

![template](https://cloud.githubusercontent.com/assets/674727/13244577/23d4991e-d9bc-11e5-99dc-589cf771e372.gif)

Supports:

- Vanilla HTML (with [basic ES6 templating](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals))
- [Handlebars.js](https://http://handlebarsjs.com/)
- [Jade](http://jade-lang.com/)
- [mustache.js](https://mustache.github.io/)
- [Nunjucks](https://mozilla.github.io/nunjucks/)

### Basic Example

```html
<a-scene>
  <a-assets>
    <script id="boxesTemplate">
      <a-box color="${box1color}" position="-1 0 -5"></a-box>
      <a-box color="${box2color}" position="0 1 -5"></a-box>
      <a-box color="${box3color}" position="1 0 -5"></a-box>
    </script>
  </a-assets>

  <a-entity template="src: #boxesTemplate"
            data-box1color="red" data-box2color="green" data-box3color="blue"></a-entity>
</a-scene>
```

### Properties

#### template

| Property   | Description                                                                                                                           |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| src        | Selector to a `<script template>` element or a URL to an external template file.                                                      |
| data       | Pass a component name to use the component's data as the dataset for the template context variables.                                  |
| insert     | Where to insert the rendered HTML using [insertAdjacentHTML](https://developer.mozilla.org/docs/Web/API/Element/insertAdjacentHTML)   |
| type       | To explicitly define the type of templating engine to use (handlebars, jade, mustache, nunjucks, html).                               |

Local context variables for the template are passed through the element's
[dataset](https://developer.mozilla.org/docs/Web/API/HTMLElement/dataset) or
through the `data` property. If both are defined, they will be combined.

#### template-set

| Property   | Description                                                                                                                           |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| on         | Event name to listen to before initializing template component.                                                                       |
| data       | What to set `template.data` to once event is fired.                                                                                   |
| src        | What to set `template.src` to once event is fired.                                                                                    |

### Vanilla HTML

If `type` is not defined and we are loading it from an external template, then
the component will render raw HTML.

### Script Tag Type

If loading from a script tag, it must have the `type` attribute defined. The
component will try to infer it from the script tag `type` attribute. It will
look within the attribute string for one of `handlebars`, `jade`, `mustache`,
`nunjucks`, or `html`:

```html
<script type="text/x-nunjucks-template">
```

### Usage

#### Browser Installation

Install and use by directly including the [browser files](dist):

```html
<head>
  <title>My A-Frame Scene</title>
  <script src="https://aframe.io/releases/0.3.0/aframe.min.js"></script>
  <script src="https://unpkg.com/aframe-template-component@^3.1.1/dist/aframe-template-component.min.js"></script>
</head>

<body>
  <a-scene>
    <a-assets>
      <script id="butterflies" type="text/x-nunjucks-template">
        {% for x in range(0, 10) %}
          {% for z in range(0, 10) %}
            <a-entity template="src: butterfly.template; type: handlebars"
                      data-position="{{ x * 10 }} 1 {{ z * 10 }}"></a-entity>
          {% endfor %}
        {% endfor %}
      </script>

      <script id="forest" type="text/x-nunjucks-template">
        {% for x in range(0, 10) %}
          {% for z in range(0, 10) %}
            <a-entity template="src: tree.template; type: handlebars; data: tree-data"
                      data-position="{{ x * 10 }} 0 {{ z * 10 }}"
                      tree-data="trunkColor: #623B1C; leaves: 500"></a-entity>
          {% endfor %}
        {% endfor %}
      </script>

      <script id="clouds" type="text/x-jade-template">
        - for (var x = 0; x < 5; x++) {
          - for (var z = 0; z < 5; z++) {
            a-entity(geometry="primitive: box; depth: 8; height: 1; width: 6", material="opacity: 0.2", position="#{x * 20} 15 #{z * 20}")
          - }
        - }
      </script>
    </a-assets>

    <a-entity template="src: #forest"></a-entity>
    <a-entity template="src: #butterflies"></a-entity>
    <a-entity template="src: #clouds"></a-entity>
  </a-scene>
</body>
```

#### NPM Installation

Install via NPM:

```bash
npm install aframe-template-component
```

Then register and use.

```js
require('aframe');
require('aframe-template-component');
```

### Troubleshooting

Note if using this within React, make sure the template is defined outside of
React's root. React will treat the template as actual DOM rather than a string.
