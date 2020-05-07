import { push } from "connected-react-router";
import { GetSidebarItemsAPI } from "../api";
import action, { GetAPI } from "./common_actions";

// const
const PREFIX = "HEADER";

// from common action
export const actions = action(PREFIX);
export const { toggleState } = actions;

export const clickLogout = () => {
  return dispatch => {
    dispatch(actions.resetState());
    dispatch(push("/login"));
  };
};

export const GetSidebarItems = () => GetAPI(actions)("sidebarItems", GetSidebarItemsAPI);
