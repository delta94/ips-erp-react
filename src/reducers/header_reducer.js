import { UPDATE_STATE, TOGGLE_STATE, RESET_STATE } from "../actions/header_actions";

const defaultState = {
  openSidebar: false,
  username: process.env.NODE_ENV === "development" ? "衡伟亮" : "",
  department: process.env.NODE_ENV === "development" ? "IT" : "",
  isAuthenticated: process.env.NODE_ENV === "development" ? true : false,
  sidebarItems: [],
};

const reducer = (state = defaultState, action) => {
  let { name, value } = action;
  switch (action.type) {
    case UPDATE_STATE:
      return { ...state, [name]: value };
    case TOGGLE_STATE:
      return { ...state, [name]: !state[name] };
    case RESET_STATE:
      return defaultState;
    default:
      return state;
  }
};

export { reducer };
