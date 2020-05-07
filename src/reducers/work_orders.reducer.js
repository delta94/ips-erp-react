import commonReducer from "./common_reducer";

// const
const PREFIX = "WORK_ORDERS";

// default state
const defaultState = {
  data: [],
};

const reducer = (state = defaultState, action) => {
  return commonReducer(PREFIX)(state, action, defaultState);
};

export { reducer };
