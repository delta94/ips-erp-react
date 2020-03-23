// for po_info.js
import { GetCustomersAPI, GetPurchaserAPI, GetCurrencyAPI } from "../api";
// for po_internal.js
import { GetEmployeeAPI, GetShippingCompanyAPI, GetOutFactoryAPI, GetDeliverContactAPI } from "../api";
export const UPDATE_STATE = "PO/UPDATE_STATE";
export const TOGGLE_STATE = "PO/TOGGLE_STATE";

export const UpdateState = (name, value) => {
  return {
    type: UPDATE_STATE,
    name,
    value
  };
};

export const ToggleState = name => {
  return {
    type: TOGGLE_STATE,
    name
  };
};

export const GetCustomers = () => {
  return async dispatch => {
    try {
      const res = await GetCustomersAPI();
      const { data } = res;
      dispatch(UpdateState("customers", data));
    } catch (err) {
      console.log(err);
    }
  };
};

export const GetPurchaser = company => {
  return async dispatch => {
    try {
      const res = await GetPurchaserAPI(company);
      const { data } = res;
      dispatch(UpdateState("purchasers", data));
    } catch (err) {
      console.log(err);
    }
  };
};

export const GetCurrency = () => {
  return async dispatch => {
    try {
      const res = await GetCurrencyAPI();
      const { data } = res;
      dispatch(UpdateState("currencies", data));
    } catch (err) {
      console.log(err);
    }
  };
};

export const GetBUEmployee = () => {
  return async dispatch => {
    try {
      const res = await GetEmployeeAPI("bu");
      const { data } = res;
      dispatch(UpdateState("buEmployees", data));
    } catch (err) {
      console.log(err);
    }
  };
};

export const GetShippingCompany = () => {
  return async dispatch => {
    try {
      const res = await GetShippingCompanyAPI();
      const { data } = res;
      dispatch(UpdateState("shippingCompanies", data));
    } catch (err) {
      console.log(err);
    }
  };
};

export const GetOutFactory = () => {
  return async dispatch => {
    try {
      const res = await GetOutFactoryAPI();
      const { data } = res;
      dispatch(UpdateState("outFactories", data));
    } catch (err) {
      console.log(err);
    }
  };
};

export const GetDeliverContact = () => {
  return async dispatch => {
    try {
      const res = await GetDeliverContactAPI();
      const { data } = res;
      dispatch(UpdateState("deliverContacts", data));
    } catch (err) {
      console.log(err);
    }
  };
};
