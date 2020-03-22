import { UPDATE_STATE } from "../actions/po_actions";

const defaultState = {
  customers: [],
  selectedCustomer: "",
  customerPO: "",
  purchasers: []
};

const reducer = (state = defaultState, action) => {
  let { name, value } = action;
  switch (action.type) {
    case UPDATE_STATE:
      return { ...state, [name]: value };
    default:
      return state;
  }
};

export { reducer };
