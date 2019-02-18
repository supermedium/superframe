## aframe-firebase-component

> Learn [how to get started with Firebase](https://firebase.google.com/docs/web/setup).

A Firebase component for [A-Frame](https://aframe.io).

![](https://cloud.githubusercontent.com/assets/674727/24439774/2640bef6-1405-11e7-90d7-c39b4f876ce1.png)

Comes with a Firebase broadcast component for multiuser experiences
out-of-the-box by syncing entities' component data to Firebase realtime
database. The parent-child relationships between entities are maintained as
well as long as all entities in the hierarchy have the `broadcast` component
attached.

To deploy with GitHub pages when setting up Firebase with the [Firebase
Console](https://firebase.google.com/console/), go into *Auth*, and add your
GitHub pages domain (e.g., `ngokevin.github.io`). This will whitelist your
domain.

If you want to allow unauthenticated users (most should), then go into
*Database*, click on *Rules*, and set both the `.read` and `.write` to `true`.

### Properties

#### firebase

Firebase configuration component for `<a-scene>`.  The `apiKey`, `authDomain`,
`databaseURL`, and `storageBucket` are provided by Firebase (go to the Firebase
console for your app and click on "Add Firebase to your web app").

The optional `channel` name allows multiple A-Frame apps, or multiple
instances/rooms of the same app, to share one Firebase bucket. If no channel is
given, 'default' is used. The channel name can also be specified in the URL:
`mysite.com?aframe-firebase-channel=oahu`

The optional `interval` sets how often (in milliseconds) data is sent to Firebase.
Default interval is 10 milliseconds.

| Property      | Description                     | Required
| --------      | -----------                     | --------
| apiKey        | API key for Firebase.           | yes
| authDomain    | Firebase authentication domain. | yes
| channel       | Name of room/namespace.         | no
| databaseURL   | Firebase database URL.          | yes
| interval      | Milliseconds between broadcasts.| no
| storageBucket | Firebase storage bucket URL.    | yes


#### firebase-broadcast

Broadcast component data to be synced across all clients using Firebase realtime database.

| Property   | Description                                          | Default Value      |
| --------   | -----------                                          | -------------      |
| components | List of comma-delimited component names to broadcast | position, rotation |
| componentsOnce | Sync initial value only; for components that don't change |

For example:

```html
<a-entity firebase-broadcast="components: material, geometry"><a-entity>
```

To broadcast individual component properties, use the `component|property` syntax:

```html
<a-entity firebase-broadcast="components: material|color, geometry|width"><a-entity>
```

### Accessing the Firebase Object

You can access the Firebase object:

```js
document.querySelector('a-scene').systems.firebase.firebase
```

If you wanted to add game logic or features such as chat.

### Usage

#### Browser Installation

Install and use by directly including the [browser files](dist):

```html
<head>
  <title>My A-Frame Scene</title>
  <script src="https://aframe.io/releases/0.9.0/aframe.min.js"></script>
  <script src="https://unpkg.com/aframe-firebase-component@4.0.3/dist/aframe-firebase-component.min.js"></script>
</head>

<body>
  <a-scene firebase="apiKey: abc;
                     authDomain: mysite.firebaseapp.com;
                     databaseURL: https://mysite.firebaseio.com;
                     storageBucket: mysite.appspot.com">
    <a-assets>
      <!-- Using mixins to decrease amount of data send over the wire. -->
      <a-mixin id="avatar-head"
              geometry="primitive: box; depth: 0.3; height: 0.3; width: 0.3"
              material="color: #222"></a-mixin>
    </a-assets>

    <a-entity id="avatar" mixin="avatar-head"
              camera look-controls wasd-controls
              firebase-broadcast="components: mixin, position, rotation"
              position="0 1.8 5">
    </a-entity>
  </a-scene>
</body>
```

#### NPM Installation

Install via NPM:

```bash
npm install aframe-firebase-component
```

Then register and use.

```js
require('aframe');
require('aframe-firebase-component');
```

#### FAQ

*Why can't I see anyone else?*

Try positioning everyone at a different start point. In
`examples/presentation/components/`, there is a `random-position-at` component
that starts everyone at a different position (more specifically at one of the
chairs).

## Authors

- [Kevin Ngo](https://twitter.com/andgokevin), Mozilla
- [Amber Roy](https://twitter.com/amberroyvr), AltspaceVR
