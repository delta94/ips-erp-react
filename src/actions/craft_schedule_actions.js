import { batch } from "react-redux";
import differenceInMinutes from "date-fns/differenceInMinutes";
import parseISO from "date-fns/parseISO";
import { GetInternalWorkOrdersItemAPI, GetMaterialsAPI, GetCraftsAPI, ScheduleWorkOrderAPI } from "../api";
import { propComparator } from "../utils/commons";
import { SUCCESS, ERROR } from "../utils/constants";
import action, { GetAPI } from "./common_actions";
import moment from "moment";
import { openNotification } from "../utils/commons";

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
      openNotification(ERROR, err);
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

export const clickCalWorkHour = (workOrder, form) => {
  const crafts = form.getFieldsValue().crafts;
  return dispatch => {
    const difInternalDeadlineSubmitDate = differenceInMinutes(
      parseISO(workOrder.internal_deadline.split("T")[0]),
      parseISO(workOrder.submit_date.split("T")[0])
    );

    let totalHour = 0;
    const roundDateHour = date => {
      date.setHours(date.getHours() + Math.round(date.getMinutes() / 60));
      date.setMinutes(0, 0, 0); // Resets also seconds and milliseconds
      return date;
    };
    totalHour = crafts.reduce((acc, el) => acc + el.estimate, totalHour);
    crafts.forEach(el => {
      el.estimateFractionMinute = (el.estimate / totalHour) * difInternalDeadlineSubmitDate;
    });
    crafts.forEach((element, index) => {
      if (index === 0) {
        element.start_time = roundDateHour(new Date());
        element.start_time_display = moment(element.start_time).format("YYYY-MM-DD h:mm:ss a");
      } else {
        element.start_time = new Date(crafts[index - 1].end_time);
        element.start_time_display = moment(element.start_time).format("YYYY-MM-DD h:mm:ss a");
      }
      element.end_time = new Date(element.start_time);
      element.end_time = new Date(
        element.end_time.setMinutes(element.start_time.getMinutes() + element.estimateFractionMinute)
      );
      element.end_time_display = moment(element.end_time).format("YYYY-MM-DD h:mm:ss a");
    });
    dispatch(actions.updateState("crafts", crafts));
    form.setFieldsValue({ crafts: crafts });
  };
};

export const clickSubmitCraftSchedule = (workOrder, resetUseState) => {
  return async (dispatch, getState) => {
    const { crafts, selected_material, dimension, qty } = getState().CraftScheduleReducer;
    const { username } = getState().HeaderReducer;
    crafts.forEach(element => {
      element.qty = parseInt(element.qty);
      element.level = parseInt(element.level);
      element.estimate = parseInt(element.estimate);
    });
    try {
      const params = {
        id: workOrder._id,
        index: workOrder.work_order_items.index,
        craft_schedule_by: username,
        attach_crafts: crafts,
        selected_material: { ...selected_material, dimension, qty },
      };
      const res = await ScheduleWorkOrderAPI(params);
      openNotification(SUCCESS, "下发加工成功! ");
      batch(() => {
        dispatch(actions.resetState());
        dispatch(GetMaterials());
      });
      resetUseState();
    } catch (err) {
      openNotification(ERROR, err);
    }
  };
};
