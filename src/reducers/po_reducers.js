import commonReducer from "./common_reducer";
import { UPDATE_WORK_ORDER_ITEM } from "../actions/po_actions";

// const
const PREFIX = "PO";

// default state
const defaultState = {
  // for po_info.js
  customers: [],
  customer: "",
  customer_po: "",
  po_submit_date: new Date(),
  customer_dateline: new Date(),
  internal_dateline: new Date(),
  work_order_created: false,
  internal_work_num: "",
  cad_dir: "",
  // for po_items.js
  work_order_items: [],
  total_price: "",
  newOrder: false,
  search: "",
  data: "",
};

const reducer = (state = defaultState, action) => {
  state = commonReducer(PREFIX)(state, action, defaultState);
  let { name, value, index } = action;
  let work_order_items = state.work_order_items;
  switch (action.type) {
    case UPDATE_WORK_ORDER_ITEM:
      work_order_items[index][name] = value;
      const total_price = work_order_items.reduce((acc, el) => acc + el.qty * el.unit_price, 0);
      return { ...state, work_order_items: [...work_order_items], total_price: total_price };
    default:
      return state;
  }
};

export { reducer };
