import { UPDATE_STATE, TOGGLE_STATE } from "../actions/header_actions";

const defaultState = {
  isAuthenticated: false,
  displayName: "",
  openSidebar: false
};

const reducer = (state = defaultState, action) => {
  let { name, value } = action;
  switch (action.type) {
    case UPDATE_STATE:
      return { ...state, [name]: value };
    case TOGGLE_STATE:
      return { ...state, [name]: !state[name] };
    default:
      return state;
  }
};

export { reducer };
