import { batch } from "react-redux";
import { push } from 'connected-react-router'
import { PostLoginAPI, ResetPwdAPI } from "../api";
import { UpdateState as HeaderUpdateState } from "./header_actions";
import { enqueueSnackbar } from "./notify_actions";

import Cookies from "js-cookie";
import { ERROR, SUCCESS } from "../utils/constants";

export const UPDATE_STATE = "LOGIN/UPDATE_STATE";

export const UpdateState = (name, value) => {
  return {
    type: UPDATE_STATE,
    name,
    value,
  };
};

export const PostLogin = (history) => {
  return async (dispatch, getState) => {
    const state = getState();
    const { username, password } = state.LoginReducer;

    if (username.length < 3 || password.length < 8) {
      dispatch(UpdateState("error", true));
    } else {
      try {
        const res = await PostLoginAPI({ username: username, password: password });
        const { data } = res;
        batch(() => {
          // Cookies.set("CN", data.CN, { 'samesite': 'strict' });
          // Cookies.set("OU", data.OU, { 'samesite': 'strict' });
          dispatch(UpdateState("username", ""));
          dispatch(UpdateState("password", ""));
          dispatch(UpdateState("error", false));
          dispatch(HeaderUpdateState("username", data.CN));
          dispatch(HeaderUpdateState("department", data.OU));
          dispatch(HeaderUpdateState("isAuthenticated", true));
          dispatch(push("/"))
        });
        // window.location.replace("/");
        // window.location.replace("/");
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
      dispatch(UpdateState("error", true));
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
