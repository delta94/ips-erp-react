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

export const GetMaterialsAPI = async query => {
  if (query) {
    return await axios.get(`/materials?query=${JSON.stringify(query)}`);
  } else {
    return await axios.get(`/materials`);
  }
};

export const GetCraftsAPI = async params => {
  return await axios.get(`/crafts?category=${params}`);
};

export const PatchItemAPI = async (item_id, collection, params) => {
  return await axios.patch(`/patch_item/${item_id}?collection=${collection}`, params);
};

export const PatchItemsAPI = async (collection, query, update) => {
  return await axios.patch(`/patch_items?collection=${collection}&query=${query}`, update);
};

export const RemoveItemAPI = async (item_id, collection) => {
  return await axios
    .delete(`/remove_item/${item_id}?collection=${collection}`)
    .then(res => res)
    .catch(err => console.log(err));
};

export const InsertItemAPI = async (collection, params) => {
  return await axios.post(`/insert_item?collection=${collection}`, params);
};

export const GetItemsAPI = async (collection, query) => {
  if (query) {
    return await axios.get(`/get_items?collection=${collection}&query=${query}`);
  }
  return await axios.get(`/get_items?collection=${collection}`);
};

export const GetItemsPipelineAPI = async (collection, query) => {
  return await axios.get(`/get_items_pipeline?collection=${collection}&query=${query}`);
};

// migration to antd
export const GetWorkOrderAPI = async queryParams => {
  if (queryParams) {
    return await axios.get(`/work_order?${queryParams}`);
  }
  return await axios.get(`/work_order`);
};

export const PostWorkOrderAPI = async params => {
  return await axios.post(`/work_order`, params);
};

export const PatchWorkOrderAPI = async (id, params) => {
  return await axios.patch(`/work_order/${id}`, params);
};

export const UpdateDispatchAPI = async params => {
  return await axios.post(`/work_order_update_dispatch`, params);
};

export const PostRFQAPI = async params => {
  return await axios.post(`/rfq`, params);
};

export const MatchRFQPriceAPI = async query => {
  return await axios.get(`/rfq_match?${query}`);
};

// spare part api
export const PostSparePartAPI = async params => {
  return await axios.post(`/spare_part`, params);
};

export const GetSparePartAPI = async query => {
  if (query) {
    return await axios.get(`/spare_part?store_type=${query}`);
  }
  return await axios.get(`/spare_part`);
};

export const PatchSparePartAPI = async (id, params) => {
  return await axios.patch(`/spare_part/${id}`, params);
};

export const GetSpareNumAPI = async part_num => {
  return await axios.get(`/spare_part/num/${part_num}`);
};
// work order api
export const ScheduleWorkOrderAPI = async params => {
  return await axios.post(`/schedule_work_order`, params);
};
