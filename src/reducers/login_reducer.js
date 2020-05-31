import commonReducer from "./common_reducer";

// const
const LOGIN = "LOGIN";

// default state
const defaultState = () => ({
  username: "",
  password: "",
  reset: false,
  error: false,
});

const reducer = (state = defaultState(), action) => {
  return commonReducer(LOGIN)(state, action, defaultState());
};

export { reducer };
