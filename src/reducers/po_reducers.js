import commonReducer from "./common_reducer";
import moment from "moment";

// const
const PREFIX = "PO";

// default state
const defaultState = () => ({
  // migration to antd
  query_type: "",
  work_order: {
    customer: "",
    po_num: "",
    submit_date: moment(),
    customer_deadline: moment(),
    internal_deadline: moment().add(-7, "days"),
    work_order_state: "",
  },
  work_order_items: [],
  work_order_states: [],
  // for po_info.js
  customers: [],
  work_order_created: false,
  editing: false,
  total_price: "",
  reedit: false,
});

const reducer = (state = defaultState(), action) => {
  return commonReducer(PREFIX)(state, action, defaultState());
};

export { reducer };
