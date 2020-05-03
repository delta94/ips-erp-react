import commonReducer from "./common_reducer";

// const
const PREFIX = "CRAFT_SCHEDULE";

// default state
const defaultState = {
  search: "",
  data: "",
  materials: [],
  selected_material: { category: "", name: "", hardness: "" },
  dimension: { length: "", width: "", height: "", qty: "" },
  crafts: [],
};

const reducer = (state = defaultState, action) => {
  return commonReducer(PREFIX)(state, action, defaultState);
};

export { reducer };
