import axios from "../utils/axios";
import { LABEL_ENDPOINT } from "../utils/constants";

const formUrlEncodedConfig = {
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
};

export const PostLoginAPI = async params => {
  return await axios.post(`/login`, params);
};

export const ResetPwdAPI = async params => {
  return await axios.post(`/reset_pwd`, params);
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
  return await axios.post(LABEL_ENDPOINT, JSON.stringify(body), formUrlEncodedConfig);
};

export const GetInternalWorkOrdersItemAPI = async params => {
  return await axios.get(`/internal_work_order_item?item_id=${params}`);
};

export const PatchInternalWorkOrderItemAPI = async (item_id, params) => {
  return await axios.patch(`/internal_work_order_item/${item_id}`, params);
};

export const GetMaterialsAPI = async () => {
  return await axios.get(`/materials`);
};

export const GetCraftsAPI = async params => {
  return await axios.get(`/crafts?category=${params}`);
};

export const PatchItemAPI = async (item_id, collection, params) => {
  return await axios
    .patch(`/patch_item/${item_id}?collection=${collection}`, params)
    .then(res => res)
    .catch(err => console.log(err));
};

export const RemoveItemAPI = async (item_id, collection) => {
  return await axios
    .delete(`/remove_item/${item_id}?collection=${collection}`)
    .then(res => res)
    .catch(err => console.log(err));
};

export const InsertItemAPI = async (collection, params) => {
  return await axios
    .post(`/insert_item?collection=${collection}`, params)
    .then(res => res)
    .catch(err => console.log(err));
};

export const GetItemsAPI = async collection => {
  return await axios.get(`/get_items?collection=${collection}`);
};

// migration to antd
export const GetWorkOrderAPI = async queryParams => {
  return await axios.get(`/work_order?${queryParams}`);
};

export const PostWorkOrderAPI = async params => {
  return await axios.post(`/work_order`, params);
};

export const PatchWorkOrderAPI = async (id, params) => {
  return await axios.patch(`/work_order/${id}`, params);
};

export const PostRFQAPI = async params => {
  return await axios.post(`/rfq`, params);
};
