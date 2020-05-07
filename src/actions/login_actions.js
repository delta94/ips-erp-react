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
export const { updateState } = actions;

export const PostLogin = () => {
  return async (dispatch, getState) => {
    const state = getState();
    const { username, password } = state.LoginReducer;

    if (username.length < 3 || password.length < 8) {
      dispatch(updateState("error", true));
    } else {
      try {
        const res = await PostLoginAPI({ username: username, password: password });
        const { data } = res;
        batch(() => {
          dispatch(updateState("username", ""));
          dispatch(updateState("password", ""));
          dispatch(updateState("error", false));
          dispatch(headerUpdateState("username", data.CN));
          dispatch(headerUpdateState("department", data.OU));
          dispatch(headerUpdateState("isAuthenticated", true));
          dispatch(push("/"));
        });
      } catch (error) {
        dispatch(enqueueSnackbar(error.message, ERROR));
      }
    }
  };
};

export const ResetPwd = () => {
  return async (dispatch, getState) => {
    const state = getState();
    const { username } = state.LoginReducer;
    if (username.length < 3) {
      dispatch(updateState("error", true));
    } else {
      try {
        const res = await ResetPwdAPI({ username: username });
        const { data } = res;
        console.log(data);

        batch(() => {
          dispatch(enqueueSnackbar("密码重置为Passw0rd", SUCCESS));
        });
      } catch (err) {
        dispatch(enqueueSnackbar(err.message, ERROR));
      }
    }
  };
};
