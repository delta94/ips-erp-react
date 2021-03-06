import { batch } from "react-redux";
import moment from "moment";
// for po_info.js
import { PrintLabelAPI, GetWorkOrderAPI, PostWorkOrderAPI, PatchWorkOrderAPI } from "../api";
import { SUCCESS, ERROR } from "../utils/constants";
import action, { GetItems, GetItemsPipeline } from "./common_actions";

// const
const PREFIX = "PO";

// from common action
export const actions = action(PREFIX);
export const { updateArrayObjectState, updateObjectState, updateState, resetState, notify } = actions;

export const GetCustomers = () => GetItems(actions)("customers");
export const GetWorkOrderStates = () => GetItems(actions)("work_order_states");
export const GetWOPipeline = query => GetItemsPipeline(actions)("work_orders", query);

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

export const updateWorkOrderItemRemark = (work_order, items, remark) => {
  return dispatch => {
    work_order.work_order_items.forEach(el => {
      items.forEach(element => {
        if (element === el.sub_work_order_num) {
          el.remark = remark;
        }
      });
    });
    batch(() => {
      dispatch(updateState("work_order", work_order));
      // dispatch(updateState("work_order_items", work_order.work_order_items));
    });
  };
};

export const addWorkOrderItem = () => {
  return (dispatch, getState) => {
    let { work_order_items } = getState().POReducer;
    const len = work_order_items.length;
    const item = {
      sub_work_order_num: `seq-${len + 1}`,
      part_number: "",
      unit: "",
      qty: "",
      unit_price: "",
    };
    work_order_items.push(item);
    dispatch(updateState("work_order_items", work_order_items));
  };
};

export const PrintLabel = (printPartNum, selectedRows) => {
  return async (dispatch, getState) => {
    const state = getState();
    const { work_order } = state.POReducer;
    let work_order_items = [];
    if (selectedRows.length) {
      work_order_items = work_order.work_order_items.filter(el => selectedRows.includes(el.sub_work_order_num));
    } else {
      work_order_items = work_order.work_order_items;
    }

    let submit_date = "";
    let internal_deadline = "";
    try {
      submit_date = work_order.submit_date.format("YYYY-MM-DD");
      internal_deadline = work_order.internal_deadline.format("YYYY-MM-DD");
    } catch (err) {
      submit_date = work_order.submit_date.split("T")[0];
      internal_deadline = work_order.internal_deadline.split("T")[0];
    }

    let obj = {};
    let data = [];
    work_order_items.forEach((element, index) => {
      if ((index + 1) % 2 === 0) {
        obj.sub_work_order_num1 = element.sub_work_order_num;
        obj.submit_date1 = submit_date;
        obj.internal_deadline1 = internal_deadline;
        obj.qty1 = element.qty;
        obj.unit1 = element.unit;
        if (printPartNum) {
          obj.part_number1 = element.part_number;
        } else {
          obj.part_number1 = "  ";
        }
        data.push(obj);
        obj = {};
      } else {
        obj.sub_work_order_num = element.sub_work_order_num;
        obj.submit_date = submit_date;
        obj.internal_deadline = internal_deadline;
        obj.qty = element.qty;
        obj.unit = element.unit;
        if (printPartNum) {
          obj.part_number = element.part_number;
        } else {
          obj.part_number = "  ";
        }

        if (index + 1 === work_order_items.length) {
          {
            data.push(obj);
          }
        }
      }
    });
    data.forEach(element => {
      PrintLabelAPI(element)
        .then(res => console.log(res))
        .catch(err => console.log(err));
    });
    console.log(data);
    dispatch(notify(SUCCESS, "打印成功! "));
  };
};

export const uploadFile = (data, form) => {
  return dispatch => {
    let total_price = 0;
    data.forEach(item => {
      let nPrefix = `seq-${item["#"]}`;
      let pn = `${nPrefix}-part_number`;
      let unit = `${nPrefix}-unit`;
      let qty = `${nPrefix}-qty`;
      let unitPrice = `${nPrefix}-unit_price`;
      form.setFieldsValue({
        [pn]: item.part_number,
        [unit]: item.unit,
        [qty]: item.qty,
        [unitPrice]: item.unit_price,
      });
    });
    const work_order_items = data.map(item => {
      return {
        sub_work_order_num: `seq-${item["#"]}`,
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
      .catch(err => dispatch(notify(ERROR, err)));
  };
};

export const GetWOs = queryParams => {
  return dispatch => {
    GetWorkOrderAPI(queryParams)
      .then(res => {
        const data = res.data;
        data.forEach(el => {
          el.done = el.work_order_items.reduce((flag, el) => flag && el.shipping_num !== "", true) ? "完成" : "未完成";
        });
        data.sort((a, b) => (a.po_num < b.po_num ? 1 : -1));
        dispatch(updateState("work_orders", data));
      })
      .catch(err => dispatch(notify(ERROR, err)));
  };
};

export const PostWorkOrder = (work_order, form) => {
  return async (dispatch, getState) => {
    const { username } = getState().HeaderReducer;
    const { work_order_items } = getState().POReducer;

    work_order["submit_by"] = username;
    work_order_items.forEach(element => {
      element.remark = "";
    });
    try {
      const res = await PostWorkOrderAPI({ ...work_order, work_order_items });
      let { data } = res;
      data.submit_date = moment(data.submit_date);
      data.customer_deadline = moment(data.customer_deadline);
      data.internal_deadline = moment(data.internal_deadline);
      batch(() => {
        // dispatch(updateState("new", false));
        dispatch(updateState("work_order_created", true));
        // dispatch(updateState("editing", true));
        // dispatch(updateState("work_order_num", data.work_order_num));
        dispatch(updateState("cad_dir", data.cad_dir));
        dispatch(updateState("work_order", data));
        // dispatch(updateState("work_order_items", data.work_order_items));
        dispatch(notify(SUCCESS, "新订单创建成功! "));
      });
      const electron = process.env.NODE_ENV !== "development" && window.require("electron");
      process.env.NODE_ENV !== "development" && electron.shell.openItem(data.cad_dir);
    } catch (err) {
      dispatch(notify(ERROR, err));
    }
  };
};

export const InsertWorkOrderItems = openFolder => {
  return async (dispatch, getState) => {
    // let { work_order_items, work_order } = getState().POReducer;
    let { work_order } = getState().POReducer;
    // work_order_items.forEach(element => {
    //   element.current_department = "业务部";
    // });
    const { _id, ...work_order_edit } = work_order;
    delete work_order_edit.submit_date;
    delete work_order_edit.customer_deadline;
    delete work_order_edit.internal_deadline;
    try {
      const res = await PatchWorkOrderAPI(_id, {
        ...work_order_edit,
        work_order_state: work_order.work_order_state,
      });
      if (openFolder) {
        const electron = process.env.NODE_ENV !== "development" && window.require("electron");
        process.env.NODE_ENV !== "development" && electron.shell.openItem(work_order.cad_dir);
      }
      dispatch(notify(SUCCESS, "保存成功! "));
    } catch (err) {
      dispatch(notify(ERROR, err));
    }
  };
};
