import { GetInternalWorkOrdersItemsAPI } from "../api";
import action, { GetAPI } from "./common_actions";

// const
const PREFIX = "WORK_ORDERS";

// from common action
export const actions = action(PREFIX);

export const GetInternalWorkOrdersItems = () =>
  GetAPI(actions)("data", GetInternalWorkOrdersItemsAPI, null, null, true);
