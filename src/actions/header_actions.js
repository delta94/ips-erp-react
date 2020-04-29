import { push } from "connected-react-router";
import { GetSidebarItemsAPI } from "../api";
export const UPDATE_STATE = "HEADER/UPDATE_STATE";
export const TOGGLE_STATE = "HEADER/TOGGLE_STATE";
export const RESET_STATE = "HEADER/RESET_STATE";

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
    type: RESET_STATE,
  };
};

export const clickLogout = () => {
  return dispatch => {
    dispatch(resetState());
    dispatch(push("/login"));
    // window.location.replace("/login");
  };
};

export const GetSidebarItems = () => {
  return async dispatch => {
    try {
      const res = await GetSidebarItemsAPI();
      const { data } = res;
      dispatch(UpdateState("sidebarItems", data));
    } catch (error) {
      console.log(error);
    }
  };
};
