## aframe-state-component

State management for [A-Frame](https://aframe.io) using single global state
modified through actions. Features declarative bindings to easily bind state to
application. By separating state from components and being able to bind state
to component properties, components can be decoupled from the application, not
needing to know about its state.

No dependencies and tailored for A-Frame. Bindings will only update their
entities if relevant pieces of the global state are modified.

v2 requires A-Frame v0.8.0.

### Examples

- [Building UI Guide](https://glitch.com/~aframe-building-ui)
- [Moon Rider](https://github.com/supermedium/moonrider)
- [BeatSaver Viewer](https://github.com/supermedium/beatsaver-viewer)

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

Best practices is to keep the state purely state (numbers, strings, booleans)
and functions that act on the state. Don't store or work upon entities in state
(store IDs instead). State should be serializable and bindable.

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

There's a `bind-toggle` component which will attach and detach a component
entirely based on a boolean value.

```html
<a-entity bind-toggle__raycastable="isRaycastable"></a-entity>
```

#### Expressions

Simple expressions are supported in binding.

NOT (`!`) and BOOL (`!!`):

```html
<a-entity bind="visible: !enabled"></a-entity>
<a-entity bind__visible="!!enabled"></a-entity>
```

OR (`||`) and AND (`&&`):

```html
<a-entity bind__menu="active: menuOpened && controllerEnabled"></a-entity>
<a-entity bind__gun="enabled: gunGrabbed && !!bullets || isRobot"></a-entity>
```

Comparisons (`==`, `===`, `!=`, `!==`):

```html
<a-entity bind__fly="enabled: animal === 'bird'"></a-entity>
<a-entity bind__legs="enabled: animal !== 'snake'"></a-entity>
```

#### Rendering Lists

The state component comes with a `bind-for` component that can render an array
in state from a template. Say we have an array in state (currently must be at
the root of the state):

```js
AFRAME.registerState({
  initialState: {
    shoppingList: [
      {name: 'milk', amount: 2},
      {name: 'eggs', amount: 12}
    ]
  }
});
```

Note when updating the array in state, use array methods. Don't rewrite the
array because the state component has wrapped the array to detect changes.

We use `bind-for`. We provide `for` (the iterator variable name), `in` (pointer
to the array in state), and `name` (name of key representing unique identifier
between every element). Then we have a `<template>` which will be used to
render each individual item.

Then we can bind properties to the individual array element either using the
`bind-item` component, using the `for` value as the pointer (i.e.,
`shoppingItem.name`). Or we can use braces (`{{ }}`), which the `bind-for`
component will statically interpolate the variable. We are moving to
`updateInPlace: true` which will be more performant and caches entities:

```html
<a-entity bind-for="for: item; in: shoppingList; key: name; updateInPlace: true">
  <template>
    <a-entity bind-item__text="value: item.name"
              data-amount="{{ amount }}"></a-entity>
  </template>
</a-entity>
```

This will result in:

```html
<a-entity bind-for="for: item; in: shoppingList; key: name">
  <template>
    <!-- ... -->
  </template>
  <a-entity bind-item__text="value: item.name"
            data-amount="2"
            text="value: milk"
            data-bind-for-key="milk"></a-entity>
  <a-entity bind__text="value: item.name"
            bind-item__data-amount="item.amount"
            text="value: eggs"
            data-amount="12"
            data-bind-for-key="eggs"></a-entity>
</a-entity>
```

`bind-for` will automatically render new entities, deactivate old entities
respective to changes in the array in the state. Updates are handled through
individual `bind`s.

#### Detecting Changes in Arrays

Arrays are references so the state system tries to detect when a change is made
before re-rendering. Changes to the array itself are detecting by wrapping
array methods and setting the `__dirty` flag.

Although detecting changes to objects within an array is a bit harder. For now,
I developed a dirty solution. If you touch an object within an array, set
`state.myArray.__dirty = true;`. Perhaps in the future, we will have dedicated
methods for modifying arrays and objects in a way the state component can
detect.

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

#### Optimizing State

If you are storing objects in state that don't need to be checked for changes
nor binded to entities, then you can optimize the state component on updates as it
checks for changes. By setting `nonBindedStateKeys` array, on state updates,
these keys will be skipped when doing state diffing and copying.

```js
AFRAME.registerState({
  nonBindedStateKeys: ['starMap'],

  state: {
    starMap: {
      alphaCentari: {
        // ...
      },
      // ...
    }
  }
});
```

### Installation

#### Browser

Install and use by directly including the [browser files](dist):

```html
<head>
  <title>My A-Frame Scene</title>
  <script src="https://aframe.io/releases/1.0.4/aframe.min.js"></script>
  <script src="https://unpkg.com/aframe-state-component@7.1.0/dist/aframe-state-component.min.js"></script>
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
