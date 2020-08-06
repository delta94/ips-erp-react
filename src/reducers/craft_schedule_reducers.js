import commonReducer from "./common_reducer";

// const
const PREFIX = "CRAFT_SCHEDULE";

// default state
const defaultState = {
  search: "",
  data: "",
  materials: [],
  // selected_material: { category: "", name: "", hardness: "" },
  selected_material: null,
  dimension: "",
  qty: "",
  crafts: [],
};

const reducer = (state = defaultState, action) => {
  return commonReducer(PREFIX)(state, action, defaultState);
};

export { reducer };
