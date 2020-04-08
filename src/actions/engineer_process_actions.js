import Cookies from "js-cookie";
import { GetInternalWorkOrdersItemAPI, PatchInternalWorkOrderItemAPI } from "../api";
export const UPDATE_STATE = "ENGINEER_PROCESS/UPDATE_STATE";

export const UpdateState = (name, value) => {
  return {
    type: UPDATE_STATE,
    name,
    value,
  };
};

export const GetInternalWorkOrderItem = (item_id) => {
  return async (dispatch) => {
    try {
      const res = await GetInternalWorkOrdersItemAPI(item_id);
      const { data } = res;
      dispatch(UpdateState("data", data));
    } catch (err) {
      console.log(err);
    }
  };
};

export const PatchInternalWorkOrderItem = (item_id) => {
  return async (dispatch) => {
    try {
      const params = { state: "工程处理", process_by: Cookies.get("CN") };
      const res = await PatchInternalWorkOrderItemAPI(item_id, params);
      const { data } = res;
      console.log(data);
      dispatch(GetInternalWorkOrderItem(item_id));
    } catch (err) {
      console.log(err);
    }
  };
};
