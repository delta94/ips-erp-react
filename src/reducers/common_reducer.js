import {
  UPDATE_STATE,
  UPDATE_OBJECT_STATE,
  UPDATE_ARRAY_OBJECT_STATE,
  RESET_STATE,
  TOGGLE_STATE,
} from "../actions/common_actions";

const commonReducer = PREFIX => {
  return (state, action, defaultState) => {
    let { name, index, key, value } = action;
    switch (action.type) {
      case `${PREFIX}/${UPDATE_STATE}`:
        if (value instanceof Array) {
          return { ...state, [name]: [...value] };
        } else if (value instanceof Date) {
          return { ...state, [name]: value };
        } else if (value instanceof Object) {
          return { ...state, [name]: { ...value } };
        } else {
          return { ...state, [name]: value };
        }
      case `${PREFIX}/${TOGGLE_STATE}`:
        return { ...state, [name]: !state[name] };
      case `${PREFIX}/${UPDATE_OBJECT_STATE}`:
        let obj = state[name];
        obj[key] = value;
        return { ...state, [name]: { ...obj } };
      case `${PREFIX}/${UPDATE_ARRAY_OBJECT_STATE}`:
        let item = state[name][index];
        item[key] = value;
        let arr = state[name];
        arr[index] = item;
        return { ...state, [name]: [...arr] };
      case `${PREFIX}/${RESET_STATE}`:
        return defaultState;
      default:
        return state;
    }
  };
};

export default commonReducer;
