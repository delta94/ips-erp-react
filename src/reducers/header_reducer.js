import commonReducer from "./common_reducer";

// const
const PREFIX = "HEADER";

// default state
const defaultState = {
  openSidebar: false,
  // username: process.env.NODE_ENV === "development" ? "衡伟亮" : "",
  // department: process.env.NODE_ENV === "development" ? "IT部门" : "",
  // isAuthenticated: process.env.NODE_ENV === "development" ? true : false,
  username: "",
  department: "",
  isAuthenticated: false,
  sidebarItems: [],
};

const reducer = (state = defaultState, action) => {
  return commonReducer(PREFIX)(state, action, defaultState);
};

export { reducer };
