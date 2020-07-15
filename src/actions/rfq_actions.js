import { GetCustomersAPI, GetCurrencyAPI, PostRFQAPI, PatchItemAPI, MatchRFQPriceAPI } from "../api";
import action, { GetAPI, GetItems, GetItemsPipelinem, GetItemsPipeline } from "./common_actions";
import { ERROR, SUCCESS, INFO } from "../utils/constants";
import { batch } from "react-redux";
import { openNotification } from "../utils/commons";

// const
const PREFIX = "RFQ";

// from common action
export const actions = action(PREFIX);
export const { updateArrayObjectState, updateObjectState, notify, resetState, updateState } = actions;

export const GetCustomers = () => GetItems(actions)("customers");
// export const GetCurrency = () => GetItems(actions)("currencies");

export const GetRFQs = query => GetItems(actions)("rfqs", query);
export const GetRFQsPipeline = query => GetItemsPipeline(actions)("rfqs", query);

export const updateCustomer = value => {
  return (dispatch, getState) => {
    const { rfq, customers } = getState().RFQReducer;
    const currency = customers.find(el => el.internal === value).currency;
    rfq["customer"] = value;
    rfq["currency"] = currency;
    // const currency = customers.find(el => el.internal === value).currency;
    // rfq["currency"] = currency;
    dispatch(updateState("rfq", rfq));
  };
};

export const updateRFQItems = (seq, key, value) => {
  return (dispatch, getState) => {
    const index = seq - 1;
    // let { rfq_items, currencies, rfq } = getState().RFQReducer;
    let { rfq_items, rfq, customers } = getState().RFQReducer;
    const { discount_rate } = rfq;
    let rfq_item = rfq_items[index];
    rfq_item[key] = value;
    // const rate = currencies.find(el => el.name === rfq.currency).rate;
    const rate = customers.find(el => el.internal === rfq.customer).rate;
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
    // let { rfq, rfq_items, currencies } = getState().RFQReducer;
    let { rfq, rfq_items, customers } = getState().RFQReducer;
    // const rate = currencies.find(el => el.name === rfq.currency).rate;
    const rate = customers.find(el => el.internal === rfq.customer).rate;
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

export const uploadFile = (data, form) => {
  return dispatch => {
    let rfq_items = [];
    for (let index = 1; index <= data.length; index++) {
      rfq_items.push({
        seq: index,
        part_number: "",
        qty: "",
        unit: "",
        unit_price_foreign: 0,
        total_price: 0,
        unit_price_rmb: 0,
        remark: "",
      });
    }
    dispatch(updateState("rfq_items", rfq_items));
    for (let index = 0; index < data.length; index++) {
      for (let key in data[index]) {
        let n = `${index + 1}-${key}`;
        form.setFieldsValue({ [n]: data[index][key] });
      }
    }
  };
};

export const newRFQ = () => {
  return dispatch => {
    batch(() => {
      dispatch(resetState());
      // dispatch(GetCurrency());
      dispatch(GetCustomers());
      dispatch(notify(INFO, "新报价， 页面内容清空! "));
    });
  };
};

export const PostRFQ = rfq_items => {
  return (dispatch, getState) => {
    const { rfq } = getState().RFQReducer;
    PostRFQAPI({ ...rfq, rfq_items })
      .then(res => {
        const electron = process.env.NODE_ENV !== "development" && window.require("electron");
        process.env.NODE_ENV !== "development" && electron.shell.openItem(res.data.rfq_folder);
        dispatch(notify(SUCCESS, "保存成功! "));
      })
      .catch(err => dispatch(notify(ERROR, err)));
  };
};

export const PatchRFQ = () => {
  return (dispatch, getState) => {
    let { rfq, rfq_items } = getState().RFQReducer;
    rfq.price_set = true;
    const requirement_not_meet = rfq_items.filter(el => {
      return (!el.no_price && el.unit_price_rmb === 0) || (el.no_price && el.reason === "");
    });
    if (requirement_not_meet.length !== 0) {
      rfq.price_set = false;
    }
    const { _id, ...new_rfq } = rfq;
    PatchItemAPI(_id, "rfqs", { ...new_rfq, rfq_items })
      .then(() => {
        GetRFQs();
        dispatch(notify(SUCCESS, "保存成功! "));
      })
      .catch(err => notify(ERROR, err));
  };
};

export const MatchRFQPrice = (partNumbers, rfq_items) => {
  return (dispatch, getState) => {
    // const { currencies, rfq } = getState().RFQReducer;
    const { customers, rfq } = getState().RFQReducer;
    const query = partNumbers.reduce((acc, el) => acc + `&part_numbers=${el}`, "");
    MatchRFQPriceAPI(query)
      .then(res => {
        if (res.data !== null) {
          rfq_items.forEach(element => {
            res.data.forEach(el => {
              if (element.part_number === el.part_number) {
                // const rate = currencies.find(el => el.name === rfq.currency).rate;
                const rate = customers.find(el => el.internal === rfq.customer).rate;
                element.unit_price_rmb = el.unit_price_rmb;
                element.unit_price_foreign = Math.round(element.unit_price_rmb / rate);
                element.total_price = element.unit_price_foreign * element.qty;
              }
            });
          });
          dispatch(updateState("rfq_items", rfq_items));
        }
      })
      .catch(err => openNotification(ERROR, err));
  };
};
