import { batch } from "react-redux";
import { enqueueSnackbar } from "./notify_actions";
import { GetInternalWorkOrdersItemAPI, GetMaterialsAPI, GetCraftsAPI } from "../api";
import { propComparator, calEndTime } from "../utils/commons";
import { SUCCESS, ERROR } from "../utils/constants";
export const UPDATE_STATE = "CRAFT_SCHEDULE/UPDATE_STATE";
export const UPDATE_OBJECT_STATE = "CRAFT_SCHEDULE/UPDATE_OBJECT_STATE";
export const UPDATE_ARRAY_OBJECT_STATE = "CRAFT_SCHEDULE/UPDATE_ARRAY_OBJECT_STATE";

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
      let materials = [];
      let hardness = [];
      data.forEach(element => {
        element.name.forEach(item => {
          materials.push(`${item} ^ ${element.category}`);
        });
        element.hardness.forEach(item => {
          hardness.push(`${item} ^ ${element.category}`);
        });
      });
      batch(() => {
        dispatch(UpdateState("materials", materials));
        dispatch(UpdateState("hardness", hardness));
      });
    } catch (err) {
      dispatch(enqueueSnackbar(err.message, ERROR));
    }
  };
};

export const filterHardness = name => {
  return (dispatch, getState) => {
    const state = getState();
    const { hardness, selected_material, selected_replacement_material } = state.CraftScheduleReducer;
    let category;
    if (name.includes("replacement")) {
      category = selected_replacement_material.split("^")[1];
      const filter_replacement_hardness = hardness.filter(el => el.includes(category));
      dispatch(UpdateState("filter_replacement_hardness", filter_replacement_hardness));
    } else {
      category = selected_material.split("^")[1].trim();
      const filter_hardness = hardness.filter(el => el.includes(category));
      batch(() => {
        dispatch(GetCrafts(category));
        dispatch(UpdateState("filter_hardness", filter_hardness));
      });
    }
  };
};

export const GetCrafts = category => {
  return async dispatch => {
    try {
      const res = await GetCraftsAPI(category);
      const { data } = res;
      data.forEach(element => {
        element.check = false;
        element.seq = "";
        element.qty = "";
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

// 白班：
// 08:00-12:00
// 13:30-17:30
// 18:00-20:00
// 夜班：
// 20:00-00:00
// 00:30-04:30
// 04:30-07:00（加班情况）

export const clickCalWorkHour = crafts => {
  return dispatch => {
    crafts.forEach((element, index) => {
      if (index === 0) {
        element.start_time = new Date();
      } else {
        let start_time = new Date(crafts[index - 1].end_time);
        element.start_time = new Date(start_time.setMinutes(start_time.getMinutes() + 30));
      }
      let end_time = new Date(element.start_time);
      end_time = calEndTime(end_time, element.estimate);
      // element.end_time = new Date(end_time.setHours(end_time.getHours() + parseInt(element.estimate)));
      element.end_time = new Date(end_time);
    });
    crafts.forEach(el => {
      el.start_time = el.start_time.toLocaleString();
      el.end_time = el.end_time.toLocaleString();
    });
    dispatch(UpdateState("crafts", crafts));
  };
};
