import { batch } from "react-redux";
import { push } from "connected-react-router";
import { PostLoginAPI, ResetPwdAPI } from "../api";
import { actions as headerActions } from "./header_actions";
import { enqueueSnackbar } from "./notify_actions";
import { ERROR, SUCCESS } from "../utils/constants";
import action from "./common_actions";

// const
const LOGIN = "LOGIN";

// from common action
const actions = action(LOGIN);
const headerUpdateState = headerActions.updateState;
export const { updateState, notify } = actions;

export const PostLogin = params => {
  return async dispatch => {
    try {
      const res = await PostLoginAPI(params);
      const { data } = res;
      batch(() => {
        dispatch(headerUpdateState("username", data.CN));
        dispatch(headerUpdateState("department", data.OU));
        dispatch(headerUpdateState("isAuthenticated", true));
        dispatch(push("/"));
      });
    } catch (error) {
      dispatch(enqueueSnackbar(error.message, ERROR));
    }
  };
};

export const ResetPwd = params => {
  return async dispatch => {
    try {
      const res = await ResetPwdAPI(params);
      const { data } = res;
      console.log(data);

      batch(() => {
        dispatch(enqueueSnackbar("密码重置为Passw0rd", SUCCESS));
      });
    } catch (err) {
      // dispatch(enqueueSnackbar(err.message, ERROR));
      dispatch(notify(ERROR, err.message));
    }
  };
};
