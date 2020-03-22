import { UPDATE_STATE, TOGGLE_STATE } from "../actions/po_actions";

const defaultState = {
  // for po_info.js
  customers: [],
  selectedCustomer: "",
  customerPO: "",
  purchasers: [],
  selectedPurchaser: "",
  customerContract: "",
  currencies: [],
  selectedCurrency: "",
  exchangeRate: "",
  tax: false,
  taxRate: "",
  customerSubmitDate: new Date(),
  deliveryDate: new Date()
};

const reducer = (state = defaultState, action) => {
  let { name, value } = action;
  switch (action.type) {
    case UPDATE_STATE:
      return { ...state, [name]: value };
    case TOGGLE_STATE:
      return { ...state, [name]: !state[name] };
    default:
      return state;
  }
};

export { reducer };
