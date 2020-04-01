import { GetInternalWorkOrdersItemsAPI } from "../api";
export const UPDATE_STATE = "WORK_ORDER/UPDATE_STATE";

export const UpdateState = (name, value) => {
  return {
    type: UPDATE_STATE,
    name,
    value
  };
};

export const GetInternalWorkOrdersItems = () => {
  return async dispatch => {
    try {
      const res = await GetInternalWorkOrdersItemsAPI();
      const { data } = res;
      dispatch(UpdateState("data", data));
    } catch (err) {
      console.log(err);
    }
  };
};
