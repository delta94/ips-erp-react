import { UPDATE_STATE } from "../actions/login_actions";

const defaultState = {
  username: "",
  password: "",
  error: false
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
