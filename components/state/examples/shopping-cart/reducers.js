AFRAME.registerReducer('shoppingCart', {
  actions: {
    ADD_ITEM: 'ADD_ITEM',
    REMOVE_ITEM: 'REMOVE_ITEM'
  },

  initialState: {
    cart: [],
    total: 0
  },

  reducer: function (state, action) {
    state = state || this.initialState;
    switch (action.type) {
      case this.actions.ADD_ITEM: {
        var newState = Object.assign({}, state);
        newState.cart.push(action.payload.item);
        newState.total -= action.payload.price;
        return newState;
      }
      case this.actions.REMOVE_ITEM: {
        var newState = Object.assign({}, state);
        newState.cart.splice(newCart.indexOf(action.payload.item), 1);
        newState.total -= action.payload.item;
        return newState;
      }
      default: {
        return state;
      }
    }
  }
});
