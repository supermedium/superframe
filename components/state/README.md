## aframe-state-component

[A-Frame](https://aframe.io) state management using declarative binding, pure
function state transitions, and event-based action dispatchers, currently based
on Redux.

### Usage

Reducers are functions that take the current state and an action (a JavaScript
object), and returns the new state. To register reducers, use
`AFRAME.registerReducer`:

```js
AFRAME.registerReducer('app', {
  initialState: {
    score: 0
  },

  handlers: {
    decreaseScore: function (state, action) {
      state.score -= action.points;
      return state;
    },

    increaseScore: function (state, action) {
      state.score += action.points;
      return state;
    }
  }
});
```

Then we can declarative bind pieces of the state into the A-Frame application with the `bind` component:

```html
<a-scene>
  <a-entity bind__text="value: app.score"></a-entity>
  <!-- Or <a-entity bind="text.value: app.score"> -->
</a-scene>
```

To update the state, we can dispatch an action using an event:

```js
AFRAME.scenes[0].emit('increaseScore', {points: 50});
```

And the binding components will automatically update the entities.

### Installation

#### Browser

Install and use by directly including the [browser files](dist):

```html
<head>
  <title>My A-Frame Scene</title>
  <script src="https://aframe.io/releases/0.6.1/aframe.min.js"></script>
  <script src="https://unpkg.com/aframe-state-component/dist/aframe-state-component.min.js"></script>
  <script>
    AFRAME.registerReducer('foo', {
      initialState: {
        enemyPosition: {x: 0, y: 1, z: 2}
      },
      handlers: {
        enemyMoved: function (state, action) {
          state.enemyPosition = action.newPosition;
          return state;
        }
      },
    });
  </script>
</head>
<body>
  <a-scene>
    <a-entity bind__position="foo.enemyPosition"></a-entity>
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
