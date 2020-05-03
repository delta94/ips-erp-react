import { GetCustomersAPI, GetCurrencyAPI } from "../api";
import action, { GetAPI } from "./common_actions";

// const
const PREFIX = "RFQ";

// from common action
export const actions = action(PREFIX);
export const { updateArrayObjectState, updateObjectState } = actions;

export const updateCustomer = value => {
  return (dispatch, getState) => {
    const { rfq, customers } = getState().RFQReducer;
    rfq["customer"] = value;
    const currency = customers.find(el => el.internal === value).currency;
    rfq["currency"] = currency;
    dispatch(actions.updateState("rfq", rfq));
  };
};

export const updateRFQItems = (index, key, value) => {
  return (dispatch, getState) => {
    const { rfq_items, currencies, rfq } = getState().RFQReducer;
    let rfq_item = rfq_items[index];
    rfq_item[key] = value;
    const rate = currencies.find(el => el.name === rfq.currency).rate;
    const unit_price = rfq_item.unit_price_foreign * rate;
    const item_total = rfq_item.unit_price_foreign * rfq_item.qty * rate;
    rfq_item["item_total"] = item_total % 1 === 0 ? item_total : parseFloat(item_total).toFixed(3);
    rfq_item["unit_price"] = unit_price % 1 === 0 ? unit_price : parseFloat(unit_price).toFixed(3);
    rfq_items[index] = rfq_item;
    dispatch(actions.updateState("rfq_items", rfq_items));
  };
};

export const addRfqItem = () => {
  return (dispatch, getState) => {
    let { rfq_items } = getState().RFQReducer;
    const len = rfq_items.length;
    let rfq_item = {
      seq: len + 1,
      item_id: "",
      version: "",
      qty: "",
      unit: "",
      unit_price_foreign: "",
      item_total: "",
      unit_price: "",
      shipping_fee: "",
    };
    rfq_items.push(rfq_item);
    dispatch(actions.updateState("rfq_items", rfq_items));
  };
};

export const GetCurrency = () => GetAPI(actions)("currencies", GetCurrencyAPI);
export const GetCustomers = () => GetAPI(actions)("customers", GetCustomersAPI);

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
    dispatch(actions.updateState("rfq_items", rfq_items));
    rfq_items.forEach((item, index) => {
      dispatch(updateRFQItems(index, "seq", index + 1));
    });
  };
};
