import { GetCustomersAPI, GetCurrencyAPI, PostRFQAPI, PatchItemAPI, MatchRFQPriceAPI } from "../api";
import action, { GetAPI, GetItems, GetItemsPipelinem, GetItemsPipeline } from "./common_actions";
import { ERROR, SUCCESS, INFO } from "../utils/constants";
import { batch } from "react-redux";

// const
const PREFIX = "RFQ";

// from common action
export const actions = action(PREFIX);
export const { updateArrayObjectState, updateObjectState, notify, resetState, updateState } = actions;

export const GetCustomers = () => GetItems(actions)("customers");
export const GetCurrency = () => GetItems(actions)("currencies");

export const GetRFQs = query => GetItems(actions)("rfqs", query);
export const GetRFQsPipeline = query => GetItemsPipeline(actions)("rfqs", query);

export const updateCustomer = value => {
  return (dispatch, getState) => {
    const { rfq, customers } = getState().RFQReducer;
    rfq["customer"] = value;
    const currency = customers.find(el => el.internal === value).currency;
    rfq["currency"] = currency;
    dispatch(updateState("rfq", rfq));
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
    // const unit_price_rmb = rfq_item.unit_price_foreign * rate;
    const unit_price_foreign = Math.round(rfq_item.unit_price_rmb / rate);
    let total_price = 0;
    if (discount_rate) {
      total_price = unit_price_foreign * rfq_item.qty * ((100 - discount_rate) / 100);
    } else {
      total_price = unit_price_foreign * rfq_item.qty;
    }
    rfq_item["total_price"] = total_price;
    rfq_item["unit_price_foreign"] = unit_price_foreign;
    rfq_items[index] = rfq_item;
    dispatch(updateState("rfq_items", rfq_items));
  };
};

export const updateRFQ = () => {
  return (dispatch, getState) => {
    let { rfq, rfq_items, currencies } = getState().RFQReducer;
    const rate = currencies.find(el => el.name === rfq.currency).rate;
    const { shipping_fee, discount_rate } = rfq;
    rfq_items.forEach(element => {
      if (element.unit_price_foreign !== 0) {
        if (discount_rate) {
          element.unit_price_foreign = Math.round(
            ((element.unit_price_rmb + shipping_fee) / rate) * ((100 - discount_rate) / 100)
          );

          element.total_price = element.unit_price_foreign * element.qty;
        } else {
          element.unit_price_foreign = Math.round((element.unit_price_rmb + shipping_fee) / rate);
          element.total_price = element.unit_price_foreign * element.qty;
        }
      }
    });
    dispatch(updateState("rfq_items", rfq_items));
  };
};

export const addRfqItem = () => {
  return (dispatch, getState) => {
    let { rfq_items } = getState().RFQReducer;
    const len = rfq_items.length;
    let rfq_item = {
      seq: len + 1,
      part_number: "",
      qty: "",
      unit: "",
      remark: "",
    };
    rfq_items.push(rfq_item);
    dispatch(updateState("rfq_items", rfq_items));
  };
};

export const uploadFile = data => {
  return dispatch => {
    const rfq_items = data.map(item => {
      return {
        seq: item["#"],
        part_number: item.part_number,
        qty: item.qty,
        unit: item.unit,
        remark: item.remark,
      };
    });
    dispatch(updateState("rfq_items", rfq_items));
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
      .then(res => {
        const electron = process.env.NODE_ENV !== "development" && window.require("electron");
        process.env.NODE_ENV !== "development" && electron.shell.openItem(res.data.rfq_folder);
        dispatch(notify(SUCCESS, "保存成功! "));
      })
      .catch(err => dispatch(notify(ERROR, err.message)));
  };
};

export const PatchRFQ = () => {
  return (dispatch, getState) => {
    let { rfq, rfq_items } = getState().RFQReducer;
    rfq_items.forEach(element => {
      if (element.unit_price_rmb !== 0) {
        rfq.price_set = true;
      }
    });
    const { _id, ...new_rfq } = rfq;
    PatchItemAPI(_id, "rfqs", { ...new_rfq, rfq_items })
      .then(() => {
        GetRFQs();
        dispatch(notify(SUCCESS, "保存成功! "));
      })
      .catch(err => console.log(err));
  };
};

export const MatchRFQPrice = (partNumbers, rfq_items) => {
  return dispatch => {
    const query = partNumbers.reduce((acc, el) => acc + `&part_numbers=${el}`, "");
    MatchRFQPriceAPI(query)
      .then(res => {
        rfq_items.forEach(element => {
          res.data.forEach(el => {
            if (element.part_number === el.part_number) {
              element.unit_price_rmb = el.unit_price_rmb;
            }
          });
        });
        dispatch(updateState("rfq_items", rfq_items));
      })
      .catch(err => err.message);
  };
};
