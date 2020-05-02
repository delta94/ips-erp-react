import { GetCustomersAPI, GetCurrencyAPI } from "../api";
import { ERROR } from "../utils/constants";
import { enqueueSnackbar } from "./notify_actions";
export const UPDATE_STATE = "RFQ/UPDATE_STATE";
export const RESET_STATE = "PO/RESET_INPUT";
export const UPDATE_OBJECT_STATE = "RFQ/UPDATE_OBJECT_STATE";
export const UPDATE_ARRAY_OBJECT_STATE = "RFQ/UPDATE_ARRAY_OBJECT_STATE";
export const ADD_RFQ_ITEM = "RFQ/ADD_RFQ_ITEM";

export const resetState = () => {
  return {
    type: RESET_STATE,
  };
};

export const updateState = (name, value) => {
  return {
    type: UPDATE_STATE,
    name,
    value,
  };
};

export const updateObjectState = (name, key, value) => {
  return {
    type: UPDATE_OBJECT_STATE,
    name,
    key,
    value,
  };
};

export const updateArrayObjectState = (name, index, key, value) => {
  return {
    type: UPDATE_ARRAY_OBJECT_STATE,
    name,
    index,
    key,
    value,
  };
};

export const addRfqItem = () => {
  return {
    type: ADD_RFQ_ITEM,
  };
};
export const GetAPI = (name, api) => {
  return async dispatch => {
    try {
      const res = await api();
      const { data } = res;
      dispatch(updateState(name, data));
    } catch (err) {
      dispatch(enqueueSnackbar(err.message, ERROR));
    }
  };
};

export const GetCurrency = () => {
  return async dispatch => {
    dispatch(GetAPI("currencies", GetCurrencyAPI));
  };
};

export const GetCustomers = () => {
  return async dispatch => {
    dispatch(GetAPI("customers", GetCustomersAPI));
  };
};

export const uploadFile = data => {
  return dispatch => {
    const rfq_items = data.map(item => {
      return {
        seq: item.item,
        item_id: item.description,
        version: item.version,
        qty: item.qty,
        unit: item.unit,
        unit_price_foreign: item.price,
      };
    });
    dispatch(updateState("rfq_items", rfq_items));
    rfq_items.forEach((item, index) => {
      dispatch(updateArrayObjectState("rfq_items", index, "seq", index + 1));
    });
  };
};
