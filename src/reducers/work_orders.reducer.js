import { UPDATE_STATE } from "../actions/work_orders_actions";

const defaultState = {
  data: []
};

const reducer = (state = defaultState, action) => {
  let { name, value } = action;
  switch (action.type) {
    case UPDATE_STATE:
      return { ...state, [name]: value };
    default:
      return state;
  }
};

export { reducer };
