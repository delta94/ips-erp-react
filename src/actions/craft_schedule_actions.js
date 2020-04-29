import { batch } from "react-redux";
import differenceInMinutes from "date-fns/differenceInMinutes";
import parseISO from "date-fns/parseISO";
import { enqueueSnackbar } from "./notify_actions";
import { GetInternalWorkOrdersItemAPI, GetMaterialsAPI, GetCraftsAPI, PatchInternalWorkOrderItemAPI } from "../api";
import { propComparator } from "../utils/commons";
import { SUCCESS, ERROR } from "../utils/constants";
export const UPDATE_STATE = "CRAFT_SCHEDULE/UPDATE_STATE";
export const UPDATE_OBJECT_STATE = "CRAFT_SCHEDULE/UPDATE_OBJECT_STATE";
export const UPDATE_ARRAY_OBJECT_STATE = "CRAFT_SCHEDULE/UPDATE_ARRAY_OBJECT_STATE";
export const RESET_STATE = "CRAFT_SCHEDULE/RESET_STATE";

export const UpdateState = (name, value) => {
  return {
    type: UPDATE_STATE,
    name,
    value,
  };
};

export const UpdateObjectState = (name, key, value) => {
  return {
    type: UPDATE_OBJECT_STATE,
    name,
    key,
    value,
  };
};

export const UpdateArrayObjectState = (name, index, key, value) => {
  return {
    type: UPDATE_ARRAY_OBJECT_STATE,
    name,
    index,
    key,
    value,
  };
};

export const resetState = () => {
  return {
    type: RESET_STATE,
  };
};
export const updateSelectMaterial = name => {
  return (dispatch, getState) => {
    const state = getState();
    const { materials } = state.CraftScheduleReducer;
    const selected_material = materials.filter(el => el.name === name)[0];
    batch(() => {
      dispatch(UpdateState("selected_material", selected_material));
      dispatch(GetCrafts(selected_material.category));
    });
  };
};

export const clickSeqCheckbox = id => {
  return (dispatch, getState) => {
    const state = getState();
    const { crafts } = state.CraftScheduleReducer;
    crafts.forEach(el => {
      if (el.id === id) {
        el.check = !el.check;
        const seq = crafts
          .map(el => el.seq)
          .sort()
          .slice(-1)[0];
        if (el.check) {
          el.seq = seq === "" ? 1 : seq + 1;
        } else {
          if (el.seq === 1) {
            crafts.forEach(e => {
              if (e.seq !== "") {
                e.seq = e.seq - 1;
              }
            });
          } else if (el.seq === seq - 1) {
            crafts.forEach(e => {
              if (e.seq >= seq) {
                e.seq = e.seq - 1;
              }
            });
          }
          el.seq = "";
        }
      }
    });
    dispatch(UpdateState("crafts", crafts));
  };
};
export const GetInternalWorkOrderItem = item_id => {
  return async dispatch => {
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

export const GetMaterials = () => {
  return async dispatch => {
    try {
      const res = await GetMaterialsAPI();
      const { data } = res;
      batch(() => {
        dispatch(UpdateState("materials", data));
      });
    } catch (err) {
      dispatch(enqueueSnackbar(err.message, ERROR));
    }
  };
};

export const GetCrafts = category => {
  return async (dispatch, getState) => {
    try {
      const res = await GetCraftsAPI(category);
      const { data } = res;
      data.forEach(element => {
        element.check = false;
        element.seq = "";
        element.qty = "";
        element.unit = "";
        element.level = "";
        element.estimate = "";
        element.start_time = "";
        element.end_time = "";
      });
      dispatch(UpdateState("crafts", data));
    } catch (err) {
      dispatch(enqueueSnackbar(err.message, ERROR));
    }
  };
};

export const clickSortCraftSchedule = crafts => {
  return dispatch => {
    const data = crafts.filter(el => el.check);
    data.sort(propComparator("seq"));
    dispatch(UpdateState("crafts", data));
  };
};

export const clickCalWorkHour = crafts => {
  return (dispatch, getState) => {
    const { data } = getState().CraftScheduleReducer;
    const difInternalDeadlineSubmitDate = differenceInMinutes(
      parseISO(data.internal_dateline),
      parseISO(data.po_submit_date)
    );
    let totalTimeHour = 0;
    totalTimeHour = crafts.reduce((acc, el) => acc + el.estimate * 60, totalTimeHour);
    crafts.forEach(el => {
      el.estimateFractionMinute = ((el.estimate * 60) / totalTimeHour) * difInternalDeadlineSubmitDate - 60;
    });
    crafts.forEach((element, index) => {
      if (index === 0) {
        let start_time = new Date();
        element.start_time = new Date(start_time.setMinutes(start_time.getMinutes() + 30));
      } else {
        let start_time = new Date(crafts[index - 1].end_time);
        element.start_time = new Date(start_time.setMinutes(start_time.getMinutes() + 30));
      }
      let end_time = new Date(element.start_time).setMinutes(
        new Date(element.start_time).getMinutes() + element.estimateFractionMinute
      );
      element.end_time = new Date(end_time);
    });
    // crafts.forEach(el => {
    //   el.start_time = el.start_time.toLocaleString();
    //   el.end_time = el.end_time.toLocaleString();
    // });
    dispatch(UpdateState("crafts", crafts));
  };
};

export const clickSubmitCraftSchedule = () => {
  return async (dispatch, getState) => {
    const { data, crafts, selected_material, dimension } = getState().CraftScheduleReducer;
    const { username } = getState().HeaderReducer;
    crafts.forEach(element => {
      element.qty = parseInt(element.qty);
      element.level = parseInt(element.level);
      element.estimate = parseInt(element.estimate);
    });
    try {
      const params = {
        state: "下发加工",
        craft_schedule_by: username,
        attach_crafts: crafts,
        selected_material: { ...selected_material, ...dimension },
      };
      const res = await PatchInternalWorkOrderItemAPI(data.item_id, params);
      console.log(res);
      batch(() => {
        dispatch(resetState());
        dispatch(enqueueSnackbar("下发加工成功! ", SUCCESS));
      });
    } catch (err) {
      dispatch(enqueueSnackbar(err.message, ERROR));
    }
  };
};
