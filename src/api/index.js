import axios from "../utils/axios";

export const PostLoginAPI = async params => {
  return await axios.post(`/login`, params);
};

export const GetSidebarItemsAPI = async () => {
  return await axios.get(`/sidebar`);
};

export const GetCustomersAPI = async () => {
  return await axios.get(`/customer`);
};

export const GetPurchaserAPI = async params => {
  return await axios.get(`/purchaser?company=${params}`)
}