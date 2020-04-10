import {
  UPDATE_STATE,
  TOGGLE_STATE,
  UPDATE_WORK_ORDER_ITEM,
  ADD_WORK_ORDER_ITEM,
  RESET_STATE,
} from "../actions/po_actions";

const defaultState = {
  // for po_info.js
  customers: [],
  customer: "",
  customer_po: "",
  po_submit_date: new Date(),
  customer_dateline: new Date(),
  internal_dateline: new Date(),
  delivery_dateline: new Date(),
  work_order_created: false,
  internal_work_num: "",
  cad_dir: "",
  // for alert
  // openAlert: false,
  // alertMessage: "",
  // alertSeverity: "error",
  // for po_internal.js
  buEmployees: [],
  selectedBUEmployee: "",
  shippingCompanies: [],
  selectedShipping: "",
  outFactories: [],
  selectedOutFactory: "",
  deliverContacts: [],
  selectedDeliverContact: "",
  // for po_items.js
  work_order_items: [],
  total_price: "",
};

const reducer = (state = defaultState, action) => {
  let { name, value, index } = action;
  let work_order_items = state.work_order_items;
  switch (action.type) {
    case UPDATE_STATE:
      return { ...state, [name]: value };
    case TOGGLE_STATE:
      return { ...state, [name]: !state[name] };
    case UPDATE_WORK_ORDER_ITEM:
      work_order_items[index][name] = value;
      let total_price = 0;
      total_price = work_order_items.reduce((acc, el) => acc + el.qty * el.unit_price, total_price);
      return { ...state, work_order_items: [...work_order_items], total_price: total_price };
    case ADD_WORK_ORDER_ITEM:
      let len = state.work_order_items.length;
      let item = {
        item_id: `${state.internal_work_num}-${len + 1}`,
        item_num: "",
        unit: "",
        qty: "",
        unit_price: "",
        cad_dir: "",
      };
      work_order_items.push(item);
      return { ...state, work_order_items: [...work_order_items] };
    case RESET_STATE:
      return { ...state, customer: "", customer_po: "", work_order_created: false, work_order_items: [] };
    default:
      return state;
  }
};

export { reducer };
