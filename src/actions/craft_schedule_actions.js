import { batch } from "react-redux";
import differenceInMinutes from "date-fns/differenceInMinutes";
import parseISO from "date-fns/parseISO";
import { enqueueSnackbar } from "./notify_actions";
import { GetInternalWorkOrdersItemAPI, GetMaterialsAPI, GetCraftsAPI, PatchInternalWorkOrderItemAPI } from "../api";
import { propComparator } from "../utils/commons";
import { SUCCESS, ERROR } from "../utils/constants";
import action, { GetAPI } from "./common_actions";

// const
const PREFIX = "CRAFT_SCHEDULE";

// from common action
export const actions = action(PREFIX);
export const { updateArrayObjectState, updateObjectState, updateState } = actions;

export const GetMaterials = query => {
  return dispatch => {
    GetMaterialsAPI(query)
      .then(res => {
        dispatch(updateState("materials", res.data));
      })
      .catch(err => console.log(err));
  };
};

export const updateSelectMaterial = id => {
  return (dispatch, getState) => {
    const state = getState();
    const { materials } = state.CraftScheduleReducer;
    const selected_material = materials.find(el => el.id === id);
    batch(() => {
      dispatch(actions.updateState("selected_material", selected_material));
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
    dispatch(actions.updateState("crafts", crafts));
  };
};

export const GetInternalWorkOrderItem = item_id =>
  GetAPI(actions)("data", GetInternalWorkOrdersItemAPI, item_id, null, true, "读取工号成功! ");

// export const GetMaterials = () => GetAPI(actions)("materials", GetMaterialsAPI, null, null, false);

// const formatCrafts = data => {
//   data.forEach(element => {
//     element.check = false;
//     element.seq = "";
//     element.qty = "";
//     element.unit = "";
//     element.level = "";
//     element.estimate = "";
//     element.start_time = "";
//     element.end_time = "";
//   });
//   console.log(data);
// };

// export const GetCrafts = category => GetAPI(actions)("crafts", GetCraftsAPI, category, formatCrafts);

export const GetCrafts = category => {
  return async (dispatch, getState) => {
    const reducer = getState().CraftScheduleReducer;
    const internal_work_order_item = reducer.data;
    try {
      const res = await GetCraftsAPI(category);
      const { data } = res;
      data.forEach(element => {
        element.check = false;
        element.seq = "";
        element.qty = internal_work_order_item.qty;
        element.unit = internal_work_order_item.unit;
        element.level = "";
        element.estimate = "";
        element.start_time = "";
        element.end_time = "";
      });
      dispatch(updateState("crafts", data));
    } catch (err) {
      dispatch(enqueueSnackbar(err.message, ERROR));
    }
  };
};

export const clickSortCraftSchedule = crafts => {
  return dispatch => {
    const data = crafts.filter(el => el.check);
    data.sort(propComparator("seq"));
    dispatch(actions.updateState("crafts", data));
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
    dispatch(actions.updateState("crafts", crafts));
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
        dispatch(actions.resetState());
        dispatch(enqueueSnackbar("下发加工成功! ", SUCCESS));
      });
    } catch (err) {
      dispatch(enqueueSnackbar(err.message, ERROR));
    }
  };
};
