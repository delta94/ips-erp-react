import Cookies from "js-cookie";
import { push } from 'connected-react-router'
export const UPDATE_STATE = "HEADER/UPDATE_STATE";
export const TOGGLE_STATE = "HEADER/TOGGLE_STATE";
export const RESET_STATE = "HEADER/RESET_STATE"

export const UpdateState = (name, value) => {
  return {
    type: UPDATE_STATE,
    name,
    value,
  };
};

export const ToggleState = name => {
  return {
    type: TOGGLE_STATE,
    name,
  };
};

export const resetState = () => {
  return {
    type: RESET_STATE
  }
}

export const clickLogout = () => {
  return (dispatch) => {
    dispatch(resetState())
    dispatch(push("/login"))
    // window.location.replace("/login");
  };
};
