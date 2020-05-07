import { batch } from "react-redux";
// for po_info.js
import {
  GetCustomersAPI,
  PostInternalWorkOrderAPI,
  PostInternalWorkOrderItemsAPI,
  PrintLabelAPI,
  GetInternalWorkOrdersItemAPI,
  PatchInternalWorkOrderItemAPI,
} from "../api";
import { enqueueSnackbar } from "./notify_actions";
import { SUCCESS, ERROR } from "../utils/constants";
import { BU_PLACE_ORDER } from "../utils/constants";
import action, { GetAPI } from "./common_actions";
export const UPDATE_WORK_ORDER_ITEM = "PO/UPDATE_WORK_ORDER_ITEM";

// const
const PREFIX = "PO";

// from common action
export const actions = action(PREFIX);
export const { updateArrayObjectState, updateObjectState, updateState, resetState } = actions;

export const GetInternalWorkOrderItem = item_id =>
  GetAPI(actions)("data", GetInternalWorkOrdersItemAPI, item_id, null, true, "读取工号成功! ");

export const GetCustomers = () => GetAPI(actions)("customers", GetCustomersAPI);

export const PostInternalWorkOrder = () => {
  return async (dispatch, getState) => {
    const state = getState();
    const { customer, customer_po, po_submit_date, customer_dateline } = state.POReducer;

    const params = {
      customer,
      customer_po,
      po_submit_date,
      customer_dateline,
      internal_dateline: new Date(new Date().setDate(customer_dateline.getDate() - 7)),
      state: BU_PLACE_ORDER,
    };

    try {
      const res = await PostInternalWorkOrderAPI(params);
      const { data } = res;
      batch(() => {
        dispatch(updateState("new", false));
        dispatch(updateState("work_order_created", true));
        dispatch(updateState("internal_work_num", data.internal_work_num));
        dispatch(updateState("cad_dir", data.cad_dir));
        dispatch(
          updateState("work_order_items", [
            { item_id: `${data.internal_work_num}-1`, item_num: "", unit: "", qty: "", unit_price: "" },
          ])
        );
      });
    } catch (err) {
      dispatch(enqueueSnackbar(err.message, ERROR));
    }
  };
};

export const UpdateWorkOrderItem = (index, name, value) => {
  return {
    type: UPDATE_WORK_ORDER_ITEM,
    index,
    name,
    value,
  };
};

export const AddWorkOrderItem = () => {
  return (dispatch, getState) => {
    const { internal_work_num, work_order_items } = getState().POReducer;
    const len = work_order_items.length;
    const item = {
      item_id: `${internal_work_num}-${len + 1}`,
      item_num: "",
      unit: "",
      qty: "",
      unit_price: "",
    };
    work_order_items.push(item);
    dispatch(updateState("work_order_items", work_order_items));
  };
};

export const newWorkOrder = () => {
  return dispatch => {
    batch(() => {
      dispatch(resetState());
      dispatch(GetCustomers());
      dispatch(updateState("newOrder", false));
    });
  };
};

export const editInternalWorkOrderItem = () => {
  return async (dispatch, getState) => {
    const state = getState();
    const { username } = state.HeaderReducer;
    let { data: item } = state.POReducer;
    delete item.internal_dateline;
    delete item.po_submit_date;
    delete item.customer_dateline;
    item.qty = parseFloat(item.qty);
    item.unit_price = parseFloat(item.unit_price);
    item.submit_by = username;
    try {
      const { data } = await PatchInternalWorkOrderItemAPI(item.item_id, item);
      batch(() => {
        dispatch(updateState("data", data));
        dispatch(enqueueSnackbar("修改成功! ", SUCCESS));
      });
    } catch (err) {
      dispatch(enqueueSnackbar(err.message, ERROR));
    }
  };
};
export const PostInternalWorkOrderItems = () => {
  return async (dispatch, getState) => {
    const state = getState();
    const {
      work_order_items,
      internal_work_num,
      customer,
      customer_po,
      po_submit_date,
      customer_dateline,
      cad_dir,
    } = state.POReducer;
    const { username } = state.HeaderReducer;
    let flag = true;
    work_order_items.forEach(ele => {
      for (let value of Object.values(ele)) {
        if (value === "") {
          flag = false;
          return flag;
        }
      }
    });
    if (flag) {
      work_order_items.forEach(element => {
        element.qty = parseInt(element.qty);
        element.unit_price = parseFloat(element.unit_price);
        element.total_price = parseFloat(element.unit_price * element.qty);
        element.cad_dir = cad_dir;
        element.submit_by = username;
        element.state = BU_PLACE_ORDER;
        element.internal_work_num = internal_work_num;
        element.customer = customer;
        element.customer_po = customer_po;
        element.po_submit_date = po_submit_date;
        element.customer_dateline = customer_dateline;
        element.internal_dateline = new Date(new Date().setDate(customer_dateline.getDate() - 7));
        element.ng = false;
      });
      const params = { work_order_items };
      try {
        const res = await PostInternalWorkOrderItemsAPI(params);
        const { data } = res;
        batch(() => {
          // dispatch(resetState());
          const electron = process.env.NODE_ENV !== "development" && window.require("electron");
          process.env.NODE_ENV !== "development" && electron.shell.openItem(cad_dir);
          dispatch(updateState("newOrder", true));
          dispatch(enqueueSnackbar(data, SUCCESS));
        });
      } catch (err) {
        dispatch(enqueueSnackbar(err.message, ERROR));
      }
    } else {
      dispatch(enqueueSnackbar("所有输入不能为空! ", ERROR));
    }
  };
};

export const PrintLabel = () => {
  return async (dispatch, getState) => {
    const state = getState();
    const { po_submit_date, work_order_items, customer_dateline } = state.POReducer;

    const data = work_order_items.map(element => {
      return {
        item_id: element.item_id,
        po_submit_date: po_submit_date,
        internal_dateline: new Date(new Date().setDate(customer_dateline.getDate() - 7)),
        qty: element.qty,
        item_num: element.item_num,
        unit: element.unit,
      };
    });
    data.forEach(element => {
      PrintLabelAPI(element)
        .then(res => console.log(res))
        .catch(err => console.log(err));
    });

    dispatch(enqueueSnackbar("打印成功! ", SUCCESS));
  };
};

export const uploadFile = data => {
  return (dispatch, getState) => {
    const state = getState();
    const { internal_work_num } = state.POReducer;
    let total_price = 0;
    const work_order_items = data.map(item => {
      return {
        item_id: `${internal_work_num}-${item.Item}`,
        item_num: item.Description,
        unit: item.Unit,
        qty: item.Quantity,
        unit_price: item["UNIT PRICE"],
      };
    });
    total_price = work_order_items.reduce((acc, el) => acc + el.qty * el.unit_price, total_price);
    batch(() => {
      dispatch(updateState("work_order_items", work_order_items));
      dispatch(updateState("total_price", total_price));
    });
  };
};
