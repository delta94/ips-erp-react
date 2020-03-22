import { UPDATE_STATE } from "../actions/sidebar_actions";
const defaultState = {
  sidebarItems: []
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
