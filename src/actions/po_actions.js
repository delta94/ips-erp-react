import { batch } from "react-redux";
import moment from "moment";
// for po_info.js
import {
  GetCustomersAPI,
  PostInternalWorkOrderAPI,
  PostInternalWorkOrderItemsAPI,
  PrintLabelAPI,
  GetInternalWorkOrdersItemAPI,
  PatchInternalWorkOrderItemAPI,
  GetWorkOrderAPI,
  PostWorkOrderAPI,
  PatchWorkOrderAPI,
} from "../api";
import { enqueueSnackbar } from "./notify_actions";
import { SUCCESS, ERROR, INFO } from "../utils/constants";
import action, { GetAPI, GetItems } from "./common_actions";

// const
const PREFIX = "PO";

// from common action
export const actions = action(PREFIX);
export const { updateArrayObjectState, updateObjectState, updateState, resetState, notify } = actions;

export const GetCustomers = () => GetItems(actions)("customers");
export const GetWorkOrderStates = () => GetItems(actions)("work_order_states");

export const UpdateWorkOrderItem = (identifier, name, value) => {
  return (dispatch, getState) => {
    let { work_order_items } = getState().POReducer;
    let selectedIndex = work_order_items.findIndex(el => el.sub_work_order_num === identifier);
    work_order_items[selectedIndex][name] = value;
    work_order_items[selectedIndex]["total_price"] =
      work_order_items[selectedIndex].qty * work_order_items[selectedIndex].unit_price;
    const total_price = work_order_items.reduce((acc, el) => acc + el.qty * el.unit_price, 0);
    batch(() => {
      dispatch(updateState("work_order_items", work_order_items));
      dispatch(updateState("total_price", total_price));
    });
  };
};

export const addWorkOrderItem = () => {
  return (dispatch, getState) => {
    let { work_order_num, work_order_items } = getState().POReducer;
    const len = work_order_items.length;
    const item = {
      sub_work_order_num: `${work_order_num}-${len + 1}`,
      part_number: "",
      unit: "",
      qty: "",
      unit_price: "",
    };
    work_order_items.push(item);
    dispatch(updateState("work_order_items", work_order_items));
  };
};

export const PrintLabel = () => {
  return async (dispatch, getState) => {
    const state = getState();
    const { work_order, work_order_items } = state.POReducer;

    const data = work_order_items.map(element => {
      return {
        item_id: element.sub_work_order_num,
        po_submit_date: work_order.submit_date,
        internal_dateline: work_order.internal_deadline,
        qty: element.qty,
        item_num: element.part_number,
        unit: element.unit,
      };
    });
    data.forEach(element => {
      PrintLabelAPI(element)
        .then(res => console.log(res))
        .catch(err => console.log(err));
    });

    dispatch(notify(SUCCESS, "打印成功! "));
  };
};

export const uploadFile = data => {
  return (dispatch, getState) => {
    const state = getState();
    const { work_order } = state.POReducer;
    let total_price = 0;
    const work_order_items = data.map(item => {
      return {
        sub_work_order_num: `${work_order.work_order_num}-${item["#"]}`,
        part_number: item.part_number,
        unit: item.unit,
        qty: item.qty,
        unit_price: item.unit_price,
        total_price: item.unit_price * item.qty,
      };
    });
    total_price = work_order_items.reduce((acc, el) => acc + el.qty * el.unit_price, total_price);
    batch(() => {
      dispatch(updateState("work_order_items", work_order_items));
      dispatch(updateState("total_price", total_price));
    });
  };
};

// migration to antd

export const GetWorkOrder = queryParams => {
  return dispatch => {
    GetWorkOrderAPI(queryParams)
      .then(res => {
        const data = res.data[0];
        data.submit_date = moment(data.submit_date);
        data.customer_deadline = moment(data.customer_deadline);
        data.internal_deadline = moment(data.internal_deadline);
        dispatch(updateState("work_order", data));
        dispatch(updateState("work_order_items", data.work_order_items));
        dispatch(updateState("work_order_created", true));
      })
      .catch(err => dispatch(notify(ERROR, err.message)));
  };
};

export const PostWorkOrder = () => {
  return async (dispatch, getState) => {
    const { username } = getState().HeaderReducer;
    let { work_order, work_order_created } = getState().POReducer;

    if (!work_order_created) {
      work_order["submit_by"] = username;

      try {
        const res = await PostWorkOrderAPI(work_order);
        let { data } = res;
        data.submit_date = moment(data.submit_date);
        data.customer_deadline = moment(data.customer_deadline);
        data.internal_deadline = moment(data.internal_deadline);
        batch(() => {
          dispatch(updateState("new", false));
          dispatch(updateState("work_order_created", true));
          dispatch(updateState("editing", true));
          dispatch(updateState("work_order_num", data.work_order_num));
          dispatch(updateState("cad_dir", data.cad_dir));
          dispatch(updateState("work_order", data));
          dispatch(
            updateState("work_order_items", [
              { sub_work_order_num: `${data.work_order_num}-1`, part_number: "", unit: "", qty: "", unit_price: "" },
            ])
          );
        });
      } catch (err) {
        dispatch(notify(ERROR, err.message));
      }
    } else {
      batch(() => {
        dispatch(resetState());
        dispatch(GetCustomers());
        dispatch(notify(INFO, "新下单， 页面内容清空! "));
      });
    }
  };
};

export const InsertWorkOrderItems = () => {
  return async (dispatch, getState) => {
    let { work_order_items, work_order, reedit } = getState().POReducer;
    let flag = true;
    // work_order_items.forEach(ele => {
    //   for (let value of Object.values(ele)) {
    //     if (value === "") {
    //       flag = false;
    //       return flag;
    //     }
    //   }
    // });
    work_order_items.forEach(element => {
      element.current_department = "业务部";
    });

    if (flag) {
      try {
        const res = await PatchWorkOrderAPI(work_order.id, {
          work_order_state: work_order.work_order_state,
          work_order_items: work_order_items,
        });
        const electron = process.env.NODE_ENV !== "development" && window.require("electron");
        process.env.NODE_ENV !== "development" && electron.shell.openItem(work_order.cad_dir);
        if (reedit) {
          dispatch(notify(SUCCESS, "修改成功! "));
        } else {
          dispatch(notify(SUCCESS, "下单成功! "));
        }
        console.log(res);
      } catch (err) {
        dispatch(notify(ERROR, err.message));
      }
    } else {
      dispatch(notify(ERROR, "订单内容不能有空值! "));
    }
  };
};
