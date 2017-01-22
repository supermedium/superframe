## aframe-redux-component

Hook in [Redux](http://redux.js.org/) reducers, data bindings, and action
dispatches for [A-Frame](https://aframe.io).

This component provides simple hooks into A-Frame for creating reducers,
setting up component data-bindings to the state, and dispatching actions. All
without React. What's cooler than Redux VR?

### Usage

The Redux system will create the store by combining registered reducers:

```html
<a-scene redux="reducers: counter"></a-scene>
```

To register reducers, use `AFRAME.registerReducer`:

```js
AFRAME.registerReducer('counter', {
  actions: {
    DECREASE: 'COUNTER__DECREASE',
    INCREASE: 'COUNTER__INCREASE'
  },

  initialState: {
    number: 0
  },

  reducer: function (state, action) {
    state = state || this.initialState;
    switch (action.type) {
      case this.actions.DECREASE: {
        var newState = Object.assign({}, state);
        newState.number--;
        return newState;
      }
      case this.actions.INCREASE: {
        var newState = Object.assign({}, state);
        newState.number++;
        return newState;
      }
      default: {
        return state;
      }
    }
  }
});
```

The `redux-bind` component handles data binding. The component subscribes to
the store to update an entity's components on every change. The keys of the
component are state selectors, using dot-delimitation to reach deeper into the
state. The values of the component define what components to data-bind the
state property to.

This will bind `reduxState.counter.number` to the `bmfont-text.text` component
property.

```html
<a-entity redux="counter.number: bmfont-text"></a-entity>
```

To dispatch an action, we can use the Redux system's `dispatch` method.

```js
AFRAME.registerComponent('increase-counter', {
  tick: function () {
    this.el.sceneEl.systems.redux.store.dispatch({
      type: 'COUNTER__INCREASE'
    });
  }
});
```

### API

#### `redux` System

| Property | Description                                  |
| -------- | -----------                                  |
| reducers | Comma-separated list of registered reducers. |

#### `redux-bind` Component

| Property Description          | Value Description                 |
| --------                      | -----------                       |
| Dot-separated state selector. | Target component to data-bind to. |

### Installation

#### Browser

Install and use by directly including the [browser files](dist):

```html
<head>
  <title>My A-Frame Scene</title>
  <script src="https://aframe.io/releases/0.3.0/aframe.min.js"></script>
  <script src="https://unpkg.com/aframe-bmfont-text-component/dist/aframe-bmfont-text-component.min.js"></script>
  <script src="https://unpkg.com/aframe-redux-component@^3.0.1/dist/aframe-redux-component.min.js"></script>
</head>

<body>
  <a-scene redux="reducers: counter">
    <a-entity redux-bind="counter.number: bmfont-text.text"></a-entity>
  </a-scene>
</body>
```

#### npm

Install via npm:

```bash
npm install aframe-redux-component
```

Then register and use.

```js
require('aframe');
require('aframe-redux-component');
```
