import { GetCustomersAPI, GetPurchaserAPI } from "../api";
export const UPDATE_STATE = "PO/UPDATE_STATE";

export const UpdateState = (name, value) => {
  return {
    type: UPDATE_STATE,
    name,
    value
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
