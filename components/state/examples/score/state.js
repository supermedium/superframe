AFRAME.registerReducer('app', {
  initialState: {
    score: 0
  },

  handlers: {
    decreasescore: function (state, action) {
      state.score -= action.points;
      return state;
    },

    increasescore: function (state, action) {
      state.score += action.points;
      return state;
    }
  }
});
