import { UPDATE_STATE } from "../actions/engineer_process_actions";

const defaultState = {
  search: "",
  data: "",
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