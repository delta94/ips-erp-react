import { UPDATE_STATE, UPDATE_OBJECT_STATE, UPDATE_ARRAY_OBJECT_STATE } from "../actions/craft_schedule_actions";

const defaultState = {
  search: "",
  data: "",
  materials: [],
  selected_material: { category: "", name: "", hardness: "" },
  dimension: { length: "", width: "", height: "", qty: "" },
  crafts: [],
};

const reducer = (state = defaultState, action) => {
  let { name, index, key, value } = action;
  switch (action.type) {
    case UPDATE_STATE:
      if (value instanceof Array) {
        return { ...state, [name]: [...value] };
      } else if (value instanceof Object) {
        return { ...state, [name]: { ...value } };
      } else {
        return { ...state, [name]: value };
      }
    case UPDATE_OBJECT_STATE:
      let obj = state[name];
      obj[key] = value;
      return { ...state, [name]: { ...obj } };
    case UPDATE_ARRAY_OBJECT_STATE:
      let item = state[name][index];
      item[key] = value;
      let arr = state[name];
      arr[index] = item;
      return { ...state, [name]: [...arr] };
    default:
      return state;
  }
};

export { reducer };
