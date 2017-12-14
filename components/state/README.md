## aframe-state-component

> v2 requires A-Frame master branch (0.8.0 milestone).

State management for [A-Frame](https://aframe.io) using single global state
modified through actions. Features declarative bindings to easily bind state to
application. By separating state from components and being able to bind state
to component properties, components can be decoupled from the application, not
needing to know about its state.

No dependencies and tailored for A-Frame. Bindings will only update their
entities if relevant pieces of the global state are modified.

### Usage

#### Defining State

The application state is a singleton defining an initial state and handler
functions that modify the state.

```js
AFRAME.registerState({
  initialState: {
    score: 0
  },

  handlers: {
    decreaseScore: function (state, action) {
      state.score -= action.points;
    },

    increaseScore: function (state, action) {
      state.score += action.points;
    }
  }
});
```

#### Binding State

Then we can declarative bind pieces of the state into the A-Frame application
with the `bind` component. The components will be automatically updated when
the state changes.

```html
<a-scene>
  <a-entity bind__text="value: app.score"></a-entity>
  <!-- Or <a-entity bind="text.value: score"> -->
</a-scene>
```

The `bind` component offers boolean expressions with `!` and `!!` operators
(and only boolean expressions to stay simple):

```html
<a-entity bind="visible: !enabled"></a-entity>
<a-entity bind__visible="!!enabled"></a-entity>
```

There's also a `bind-toggle` component which will attach and detach a component
entirely based on a boolean value.

```html
<a-entity bind__raycastable="isRaycastable"></a-entity>
```

#### Modifying State

To update the state, we can dispatch an action using an event:

```js
AFRAME.scenes[0].emit('increaseScore', {points: 50});

// Or manually dispatched:
// AFRAME.scenes[0].systems.state.dispatch('increaseScore', {points: 50});
```

The binding components will automatically and selectively update the entities
in response to state changes.

A `stateupdate` event will be fired, but we probably don't need to use it. The
event might later be useful if we develop a debugging front-end for the state.

#### Computed State

To attach additional computed state after the action is processed, specify a
`computeState` function to update the state:

```js
AFRAME.registerState({
  // ...

  computeState: function (newState, payload) {
    newState.isRedOrBlue = newState.isRed || newState.isBlue;
  }
});
```

#### Utils

The component exports utilities to help organize the state definition by
helping to split up handlers and compute state functions into separate
modules.

`composeHandlers (handlers1, handlers2, ...)`

Combines together objects containing handlers. If two objects have a handler
function for the same action name, those two handler functions will be composed
together.

```js
var composeHandlers = require('aframe-state-component').composeHandlers;
AFRAME.registerState({
  computeHandlers: composeHandlers(
    {
      quxAction: state => { state.counter++; }
      qazAction: state => { state.counter--; }
    },
    require('./fooState').handlers,
    require('./barState').handlers
  )
});
```

`composeFunctions (fn1, fn2, ...)`

Combines functions together. Useful for combining multiple `computeState`
functions together.

```js
var composeFunctions = require('aframe-state-component').composeFunctions;
AFRAME.registerState({
  computeState: composeFunctions(
    require('./fooState').composeState,
    require('./barState').composeState
  )
});
```

### Installation

#### Browser

Install and use by directly including the [browser files](dist):

```html
<head>
  <title>My A-Frame Scene</title>
  <script src="https://aframe.io/releases/0.8.0/aframe.min.js"></script>
  <script src="https://unpkg.com/aframe-state-component/dist/aframe-state-component.min.js"></script>
  <script>
    AFRAME.registerState({
      initialState: {
        enemyPosition: {x: 0, y: 1, z: 2}
      },

      handlers: {
        enemyMoved: function (state, action) {
          state.enemyPosition = action.newPosition;
        }
      },
    });
  </script>
</head>
<body>
  <a-scene>
    <a-entity bind__position="enemyPosition"></a-entity>
  </a-scene>
</body>
```

#### npm

Install via npm:

```bash
npm install aframe-state-component
```

Then register and use.

```js
require('aframe');
require('aframe-state-component');
```
