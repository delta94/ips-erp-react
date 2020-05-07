import commonReducer from "./common_reducer";

// const
const PREFIX = "ENGINEER_PROCESS";

// default state
const defaultState = {
  search: "",
  data: "",
};

const reducer = (state = defaultState, action) => {
  return commonReducer(PREFIX)(state, action, defaultState);
};

export { reducer };
