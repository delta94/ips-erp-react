import { batch } from "react-redux";
import { enqueueSnackbar } from "./notify_actions";
import { GetInternalWorkOrdersItemAPI, PatchInternalWorkOrderItemAPI } from "../api";
import { SUCCESS, ERROR } from "../utils/constants";
import action, { GetAPI } from "./common_actions";

// const
const PREFIX = "ENGINEER_PROCESS";

// from common action
export const actions = action(PREFIX);
export const { updateState } = actions;

export const GetInternalWorkOrderItem = item_id =>
  GetAPI(actions)("data", GetInternalWorkOrdersItemAPI, item_id, null, true, "读取工号成功! ");

export const PatchInternalWorkOrderItem = item_id => {
  return async (dispatch, getState) => {
    const { username } = getState().HeaderReducer;
    try {
      const params = { state: "工程处理", process_by: username };
      const res = await PatchInternalWorkOrderItemAPI(item_id, params);
      const { data } = res;
      batch(() => {
        dispatch(actions.updateState("data", data));
        dispatch(enqueueSnackbar("处理成功! ", SUCCESS));
      });
    } catch (err) {
      dispatch(enqueueSnackbar(err.message, ERROR));
    }
  };
};
