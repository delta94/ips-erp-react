import axios from "../utils/axios";
import qs from "querystring";
import { LABEL_ENDPOINT } from "../utils/constants";

const formUrlEncodedConfig = {
  headers: {
    "Content-Type": "application/x-www-form-urlencoded"
  }
};

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
  return await axios.get(`/purchaser?company=${params}`);
};

export const GetCurrencyAPI = async () => {
  return await axios.get(`/currency`);
};

export const GetEmployeeAPI = async params => {
  return await axios.get(`/employee?bu=${params}`);
};

export const GetShippingCompanyAPI = async () => {
  return await axios.get(`/shipping_company`);
};

export const GetOutFactoryAPI = async () => {
  return await axios.get(`/out_factory`);
};

export const GetDeliverContactAPI = async () => {
  return await axios.get(`/deliver_contact`);
};

export const PostInternalWorkOrderAPI = async params => {
  return await axios.post(`/internal_work_order`, params);
};

export const PostInternalWorkOrderItemsAPI = async params => {
  return await axios.post(`/internal_work_order_items`, params);
};

export const GetInternalWorkOrdersItemsAPI = async () => {
  return await axios.get(`/internal_work_order_items`);
};

export const PrintLabelAPI = async body => {
  return await axios.post(LABEL_ENDPOINT, qs.stringify(body), formUrlEncodedConfig);
};
