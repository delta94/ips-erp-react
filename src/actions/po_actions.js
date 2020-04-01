import { batch } from "react-redux";
// for po_info.js
import {
  GetCustomersAPI,
  GetPurchaserAPI,
  GetCurrencyAPI,
  PostInternalWorkOrderAPI,
  PostInternalWorkOrderItemsAPI
} from "../api";
// for po_internal.js
import { GetEmployeeAPI, GetShippingCompanyAPI, GetOutFactoryAPI, GetDeliverContactAPI } from "../api";
import { BU_PLACE_ORDER } from "../utils/constants";
export const UPDATE_STATE = "PO/UPDATE_STATE";
export const TOGGLE_STATE = "PO/TOGGLE_STATE";
export const UPDATE_WORK_ORDER_ITEM = "PO/UPDATE_WORK_ORDER_ITEM";
export const ADD_WORK_ORDER_ITEM = "PO/ADD_WORK_ORDER_ITEM";
export const RESET_STATE = "PO/RESET_INPUT";

export const ResetState = () => {
  return {
    type: RESET_STATE
  };
};

export const UpdateState = (name, value) => {
  return {
    type: UPDATE_STATE,
    name,
    value
  };
};

export const ToggleState = name => {
  return {
    type: TOGGLE_STATE,
    name
  };
};

export const GetCustomers = () => {
  return async dispatch => {
    try {
      const res = await GetCustomersAPI();
      const { data } = res;
      dispatch(UpdateState("customers", data));
    } catch (err) {
      console.log(err);
    }
  };
};

export const GetPurchaser = company => {
  return async dispatch => {
    try {
      const res = await GetPurchaserAPI(company);
      const { data } = res;
      dispatch(UpdateState("purchasers", data));
    } catch (err) {
      console.log(err);
    }
  };
};

export const GetCurrency = () => {
  return async dispatch => {
    try {
      const res = await GetCurrencyAPI();
      const { data } = res;
      dispatch(UpdateState("currencies", data));
    } catch (err) {
      console.log(err);
    }
  };
};

export const GetBUEmployee = () => {
  return async dispatch => {
    try {
      const res = await GetEmployeeAPI("bu");
      const { data } = res;
      dispatch(UpdateState("buEmployees", data));
    } catch (err) {
      console.log(err);
    }
  };
};

export const GetShippingCompany = () => {
  return async dispatch => {
    try {
      const res = await GetShippingCompanyAPI();
      const { data } = res;
      dispatch(UpdateState("shippingCompanies", data));
    } catch (err) {
      console.log(err);
    }
  };
};

export const GetOutFactory = () => {
  return async dispatch => {
    try {
      const res = await GetOutFactoryAPI();
      const { data } = res;
      dispatch(UpdateState("outFactories", data));
    } catch (err) {
      console.log(err);
    }
  };
};

export const GetDeliverContact = () => {
  return async dispatch => {
    try {
      const res = await GetDeliverContactAPI();
      const { data } = res;
      dispatch(UpdateState("deliverContacts", data));
    } catch (err) {
      console.log(err);
    }
  };
};

export const PostInternalWorkOrder = () => {
  return async (dispatch, getState) => {
    const state = getState();
    const {
      customer,
      customer_po,
      po_submit_date,
      customer_dateline,
      internal_dateline,
      delivery_dateline
    } = state.POReducer;

    const params = {
      customer,
      customer_po,
      po_submit_date,
      customer_dateline,
      internal_dateline,
      delivery_dateline,
      state: BU_PLACE_ORDER
    };

    try {
      const res = await PostInternalWorkOrderAPI(params);
      const { data } = res;
      batch(() => {
        dispatch(UpdateState("work_order_created", true));
        dispatch(UpdateState("internal_work_num", data.internal_work_num));
        dispatch(
          UpdateState("work_order_items", [
            { item_id: `${data.internal_work_num}-1`, item_num: "", unit: "", qty: "", unit_price: "", cad_dir: "" }
          ])
        );
      });
    } catch (err) {
      // console.log(err.message);
      batch(() => {
        dispatch(UpdateState("openAlert", true));
        dispatch(UpdateState("alertMessage", err.message));
        dispatch(UpdateState("alertSeverity", "error"));
      });
    }
  };
};

export const UpdateWorkOrderItem = (index, name, value) => {
  return {
    type: UPDATE_WORK_ORDER_ITEM,
    index,
    name,
    value
  };
};

export const AddWorkOrderItem = () => {
  return {
    type: ADD_WORK_ORDER_ITEM
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
      internal_dateline,
      delivery_dateline
    } = state.POReducer;
    work_order_items.forEach(element => {
      element.qty = parseInt(element.qty);
      element.unit_price = parseFloat(element.unit_price);
      element.total_price = parseFloat(element.unit_price * element.qty);
      element.cad_dir = work_order_items[0].cad_dir;
      element.state = BU_PLACE_ORDER;
      element.internal_work_order = {
        internal_work_num,
        customer,
        customer_po,
        po_submit_date,
        customer_dateline,
        internal_dateline,
        delivery_dateline
      };
    });
    const params = { work_order_items };
    try {
      const res = await PostInternalWorkOrderItemsAPI(params);
      const { data } = res;
      batch(() => {
        dispatch(UpdateState("openAlert", true));
        dispatch(UpdateState("alertMessage", data));
        dispatch(UpdateState("alertSeverity", "success"));
        dispatch(ResetState());
      });
    } catch (err) {
      batch(() => {
        console.log(err);
        dispatch(UpdateState("openAlert", true));
        dispatch(UpdateState("alertMessage", err.message));
        dispatch(UpdateState("alertSeverity", "error"));
      });
    }
  };
};
