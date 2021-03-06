import moment from "moment";
import commonReducer from "./common_reducer";
// import { deepCopy } from "../utils/commons";

// const
const PREFIX = "RFQ";

// default state
// const defaultState = {
//   customers: [],
//   currencies: [],
//   rfq: {
//     customer: "",
//     currency: "",
//     email_rfq_num: "",
//     email_rfq_date: moment(),
//     rfq_num: "",
//     delivery_date: "",
//     shipping_fee_apply: false,
//     shipping_fee: 0,
//     discount_rate_apply: false,
//     discount_rate: 0,
//     remark: "",
//   },
//   rfq_items: [
//     {
//       seq: 1,
//       part_number: "",
//       qty: "",
//       unit: "",
//       unit_price_foreign: "",
//       total_price: "",
//       unit_price_rmb: "",
//     },
//   ],
// };

const defaultState = () => ({
  customers: [],
  currencies: [],
  rfqs: [],
  rfq: {
    customer: "",
    currency: "",
    email_rfq_num: "",
    email_rfq_date: moment(),
    rfq_num: "",
    customer_name: "",
    // delivery_date: "",
    price_set: false,
    shipping_fee_apply: false,
    shipping_fee: 0,
    discount_rate_apply: false,
    discount_rate: 0,
    remark: "",
  },
  rfq_items: [
    {
      seq: 1,
      part_number: "",
      qty: "",
      unit: "",
      unit_price_foreign: 0,
      total_price: 0,
      unit_price_rmb: 0,
      remark: "",
    },
  ],
  query_type: "",
  showContent: false,
});

const reducer = (state = defaultState(), action) => {
  return commonReducer(PREFIX)(state, action, defaultState());
};

export { reducer };
