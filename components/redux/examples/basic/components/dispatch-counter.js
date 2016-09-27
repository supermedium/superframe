AFRAME.registerComponent('dispatch-counter', {
  tick: function () {
    this.systems.redux.store.dispatch({
      type: 'COUNTER__INCREASE'
    });
  }
});
