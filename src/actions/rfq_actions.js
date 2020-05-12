import { GetCustomersAPI, GetCurrencyAPI, PostRFQAPI } from "../api";
import action, { GetAPI, GetItems } from "./common_actions";
import { ERROR, SUCCESS, INFO } from "../utils/constants";
import { batch } from "react-redux";

// const
const PREFIX = "RFQ";

// from common action
export const actions = action(PREFIX);
export const { updateArrayObjectState, updateObjectState, notify, resetState } = actions;

export const GetCustomers = () => GetItems(actions)("customers");
export const GetCurrency = () => GetItems(actions)("currencies");

export const updateCustomer = value => {
  return (dispatch, getState) => {
    const { rfq, customers } = getState().RFQReducer;
    rfq["customer"] = value;
    const currency = customers.find(el => el.internal === value).currency;
    rfq["currency"] = currency;
    dispatch(actions.updateState("rfq", rfq));
  };
};

export const updateRFQItems = (seq, key, value) => {
  return (dispatch, getState) => {
    const index = seq - 1;
    let { rfq_items, currencies, rfq } = getState().RFQReducer;
    const { discount_rate } = rfq;
    let rfq_item = rfq_items[index];
    rfq_item[key] = value;
    const rate = currencies.find(el => el.name === rfq.currency).rate;
    const unit_price_rmb = rfq_item.unit_price_foreign * rate;
    let total_price = 0;
    if (discount_rate) {
      total_price = rfq_item.unit_price_foreign * rfq_item.qty * rate * ((100 - discount_rate) / 100);
    } else {
      total_price = rfq_item.unit_price_foreign * rfq_item.qty * rate;
    }
    rfq_item["total_price"] = total_price % 1 === 0 ? total_price : parseFloat(parseFloat(total_price).toFixed(3));
    rfq_item["unit_price_rmb"] =
      unit_price_rmb % 1 === 0 ? unit_price_rmb : parseFloat(parseFloat(unit_price_rmb).toFixed(3));
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
      part_number: "",
      version: "",
      qty: "",
      unit: "",
      unit_price_foreign: "",
      total_price_: "",
      unit_price_rmb: "",
    };
    rfq_items.push(rfq_item);
    dispatch(actions.updateState("rfq_items", rfq_items));
  };
};

export const uploadFile = data => {
  return dispatch => {
    const rfq_items = data.map(item => {
      return {
        seq: item["#"],
        part_number: item.part_number,
        version: item.version,
        qty: item.qty,
        unit: item.unit,
        unit_price_foreign: item.unit_price_foreign,
      };
    });
    dispatch(actions.updateState("rfq_items", rfq_items));
    rfq_items.forEach((item, index) => {
      dispatch(updateRFQItems(index + 1, "qty", item.qty));
    });
  };
};

export const newRFQ = () => {
  return dispatch => {
    batch(() => {
      dispatch(resetState());
      dispatch(GetCurrency());
      dispatch(GetCustomers());
      dispatch(notify(INFO, "新报价， 页面内容清空! "));
    });
  };
};

export const PostRFQ = () => {
  return (dispatch, getState) => {
    const { rfq, rfq_items } = getState().RFQReducer;
    PostRFQAPI({ ...rfq, rfq_items })
      .then(() => {
        dispatch(notify(SUCCESS, "初次报价成功! "));
      })
      .catch(err => dispatch(notify(ERROR, err.message)));
  };
};
