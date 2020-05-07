import commonReducer from "./common_reducer";

// const
const PREFIX = "RFQ";

// default state
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
  return commonReducer(PREFIX)(state, action, defaultState);
};

export { reducer };
