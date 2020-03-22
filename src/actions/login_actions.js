import { batch } from "react-redux";
import { PostLoginAPI } from "../api";
import { UpdateState as HeaderUpdateState } from "./header_actions";

export const UPDATE_STATE = "LOGIN/UPDATE_STATE";

export const UpdateState = (name, value) => {
  return {
    type: UPDATE_STATE,
    name,
    value
  };
};

export const PostLogin = history => {
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
          dispatch(UpdateState("username", ""));
          dispatch(UpdateState("password", ""));
          dispatch(UpdateState("error", false));
          dispatch(HeaderUpdateState("isAuthenticated", true));
          dispatch(HeaderUpdateState("displayName", data.CN));
        });
        history.push("/");
      } catch (error) {
        console.log(error);
      }
    }
  };
};
