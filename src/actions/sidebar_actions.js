import { GetSidebarItemsAPI } from "../api";

export const UPDATE_STATE = "SIDEBAR/UPDATE_STATE";

export const UpdateState = (name, value) => {
  return {
    type: UPDATE_STATE,
    name,
    value
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
