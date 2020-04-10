import { batch } from "react-redux";
import { PostLoginAPI } from "../api";
import { UpdateState as HeaderUpdateState } from "./header_actions";
import { enqueueSnackbar } from "./notify_actions";

import Cookies from "js-cookie";
import { ERROR } from "../utils/constants";

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
        console.log(data);
        batch(() => {
          Cookies.set("CN", data.CN);
          Cookies.set("OU", data.OU);
          dispatch(UpdateState("username", ""));
          dispatch(UpdateState("password", ""));
          dispatch(UpdateState("error", false));
          dispatch(HeaderUpdateState("isAuthenticated", true));
        });
        // history.push("/");
        window.location.replace("/");
      } catch (error) {
        dispatch(enqueueSnackbar(error.message, ERROR));
      }
    }
  };
};
