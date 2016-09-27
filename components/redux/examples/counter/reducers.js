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
