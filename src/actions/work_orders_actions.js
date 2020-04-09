import { batch } from "react-redux";
import { GetInternalWorkOrdersItemsAPI } from "../api";
import { enqueueSnackbar } from "./notify_actions";
import { SUCCESS, ERROR } from "../utils/constants";
export const UPDATE_STATE = "WORK_ORDER/UPDATE_STATE";

export const UpdateState = (name, value) => {
  return {
    type: UPDATE_STATE,
    name,
    value,
  };
};

export const GetInternalWorkOrdersItems = () => {
  return async (dispatch) => {
    try {
      const res = await GetInternalWorkOrdersItemsAPI();
      const { data } = res;
      batch(() => {
        dispatch(UpdateState("data", data));
        dispatch(enqueueSnackbar("加载成功! ", SUCCESS));
      });
    } catch (err) {
      dispatch(enqueueSnackbar("加载失败! ", ERROR));
    }
  };
};
