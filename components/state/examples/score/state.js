AFRAME.registerState({
  initialState: {
    score: 0
  },

  handlers: {
    decreasescore: function (state, action) {
      state.score -= action.points;
    },

    increasescore: function (state, action) {
      state.score += action.points;
    }
  }
});
