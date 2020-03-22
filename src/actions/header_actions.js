export const UPDATE_STATE = "HEADER/UPDATE_STATE";
export const TOGGLE_STATE = "HEADER/TOGGLE_STATE";

export const UpdateState = (name, value) => {
  return {
    type: UPDATE_STATE,
    name,
    value
  };
};

export const ToggleState = name => {
  return {
    type: TOGGLE_STATE,
    name
  };
};