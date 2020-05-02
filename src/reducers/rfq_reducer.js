import {
  UPDATE_STATE,
  RESET_STATE,
  UPDATE_OBJECT_STATE,
  UPDATE_ARRAY_OBJECT_STATE,
  ADD_RFQ_ITEM,
} from "../actions/rfq_actions";

const defaultState = {
  customers: [],
  currencies: [],
  rfq: {
    customer: "",
    currency: "",
    email_rfq_num: "",
    customer_name: "",
    email_rfq_date: new Date(),
    rfq_num: "",
    delivery_date: "",
    shipping_fee_apply: false,
    discount_rate_apply: false,
    discount_rate: "",
    remark: "",
  },
  rfq_items: [
    {
      seq: 1,
      item_id: "",
      version: "",
      qty: "",
      unit: "",
      unit_price_foreign: "",
      item_total: "",
      unit_price: "",
      shipping_fee: "",
    },
  ],
};

const reducer = (state = defaultState, action) => {
  let { name, value, key, index } = action;
  switch (action.type) {
    case UPDATE_STATE:
      return { ...state, [name]: value };
    case UPDATE_OBJECT_STATE:
      let obj = state[name];
      obj[key] = value;
      if (key === "customer") {
        let currency = state.customers.find(el => el.internal === value).currency;
        obj["currency"] = currency;
      }
      return { ...state, [name]: { ...obj } };
    case UPDATE_ARRAY_OBJECT_STATE:
      let item = state[name][index];
      item[key] = value;
      if (name === "rfq_items") {
        let rate = state.currencies.find(el => el.name === state.rfq.currency).rate;
        let unit_price = item.unit_price_foreign * rate;
        let item_total = item.unit_price_foreign * item.qty * rate;
        item["item_total"] = item_total;
        item["unit_price"] = unit_price;
      }
      let arr = state[name];
      arr[index] = item;
      return { ...state, [name]: [...arr] };
    case ADD_RFQ_ITEM:
      let len = state.rfq_items.length;
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
      let rfq_items = state.rfq_items;
      rfq_items.push(rfq_item);
      return { ...state, rfq_items: [...rfq_items] };
    case RESET_STATE:
      return defaultState;
    default:
      return state;
  }
};

export { reducer };
