import { batch } from "react-redux";
import { enqueueSnackbar } from "./notify_actions";
import { GetInternalWorkOrdersItemAPI, PatchInternalWorkOrderItemAPI } from "../api";
import { SUCCESS, ERROR } from "../utils/constants";
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
      batch(() => {
        dispatch(UpdateState("data", data));
        dispatch(enqueueSnackbar("读取工号成功! ", SUCCESS));
      });
    } catch (err) {
      dispatch(enqueueSnackbar(err.message, ERROR));
    }
  };
};

export const PatchInternalWorkOrderItem = (item_id) => {
  return async (dispatch, getState) => {
    const { username } = getState().HeaderReducer
    try {
      const params = { state: "工程处理", process_by: username };
      const res = await PatchInternalWorkOrderItemAPI(item_id, params);
      const { data } = res;
      batch(() => {
        dispatch(UpdateState("data", data));
        dispatch(enqueueSnackbar("处理成功! ", SUCCESS));
      });
    } catch (err) {
      dispatch(enqueueSnackbar(err.message, ERROR));
    }
  };
};
