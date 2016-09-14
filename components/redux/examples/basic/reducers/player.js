AFRAME.registerReducer('player', {
  actions: {
    DAMAGE: 'PLAYER__DAMAGE'
  },

  initialState: {
    health: 100
  },

  reducer: function (state, action) {
    state = state || this.initialState;
    switch (action.type) {
      case this.actions.DAMAGE: {
        var newState = Object.assign({}, state);
        newState.health -= action.payload;
        return newState;
      }
    }
  }
});
