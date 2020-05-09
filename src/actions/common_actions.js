import { batch } from "react-redux";
import { enqueueSnackbar } from "./notify_actions";
import { SUCCESS, ERROR } from "../utils/constants";
export const UPDATE_STATE = "UPDATE_STATE";
export const UPDATE_OBJECT_STATE = "UPDATE_OBJECT_STATE";
export const UPDATE_ARRAY_OBJECT_STATE = "UPDATE_ARRAY_OBJECT_STATE";
export const TOGGLE_STATE = "TOGGLE_STATE";
export const RESET_STATE = "RESET_STATE";
export const NOTIFICATION = "NOTIFICATION";

// https://medium.com/@regalius/writing-reusable-redux-like-a-boss-d3780e7ecbf0
// code taken from here. thanks to the author

const typeGenerator = (name, type) => `${name !== "" ? `${name}/` : ""}${type}`;

// export const actionHandlerGenerator = (name, actionHandler) =>
//   Object.keys(actionHandler).reduce((result, key) => {
//     const actionType = typeGenerator(name, key);
//     result[actionType] = actionHandler[key];
//     return result;
//   }, {});

// export const reducerGenerator = (name = "", defaultActionHandler, initialState) => {
//   /* Memoize the action handler so we won't generate it again every reducer call */
//   const actionHandler = actionHandlerGenerator(name, defaultActionHandler);
//   /* Return the reducer */
//   return (state = initialState, action) =>
//     actionHandler[action.type] ? actionHandler[action.type](state, action) : state;
// };

const actionCreatorGenerator = (name, actionCreators, params) =>
  Object.keys(actionCreators).reduce((result, key) => {
    result[key] = actionCreators[key](name, params);
    return result;
  }, {});

const updateState = prefix => (name, value) => {
  return {
    type: typeGenerator(prefix, UPDATE_STATE),
    name,
    value,
  };
};

const notify = prefix => () => {
  return {
    type: typeGenerator(prefix, NOTIFICATION),
  };
};

const toggleState = prefix => name => {
  return {
    type: typeGenerator(prefix, TOGGLE_STATE),
    name,
  };
};

const updateObjectState = prefix => (name, key, value) => {
  return {
    type: typeGenerator(prefix, UPDATE_OBJECT_STATE),
    name,
    key,
    value,
  };
};

const updateArrayObjectState = prefix => (name, index, key, value) => {
  return {
    type: typeGenerator(prefix, UPDATE_ARRAY_OBJECT_STATE),
    name,
    index,
    key,
    value,
  };
};

const resetState = prefix => () => {
  return {
    type: typeGenerator(prefix, RESET_STATE),
  };
};

const action = (prefix, params) =>
  actionCreatorGenerator(
    prefix,
    {
      updateState,
      updateObjectState,
      toggleState,
      updateArrayObjectState,
      resetState,
      notify,
    },
    params
  );

export default action;

export const GetAPI = action => (
  name,
  api,
  params,
  optional,
  notify = false,
  successText = "加载成功! ",
  errText = "加载失败! "
) => {
  return async dispatch => {
    try {
      const res = await api(params);
      const { data } = res;
      if (optional) {
        optional(data);
      }
      batch(() => {
        dispatch(action.updateState(name, data));
        if (notify) {
          dispatch(enqueueSnackbar(successText, SUCCESS));
        }
      });
    } catch (err) {
      dispatch(enqueueSnackbar(errText, ERROR));
    }
  };
};
