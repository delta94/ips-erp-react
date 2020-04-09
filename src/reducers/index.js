import { combineReducers } from "redux";

import { reducer as HeaderReducer } from "./header_reducer";
import { reducer as LoginReducer } from "./login_reducer";
import { reducer as SidebarReducer } from "./sidebar_reducer";
import { reducer as POReducer } from "./po_reducers";
import { reducer as WorkOrderReducer } from "./work_orders.reducer";
import { reducer as EngineerProcessReducer } from "./engineer_process_reducers";
import { reducer as NotifyReducer } from "./notify_reducers";

const reducer = combineReducers({
  HeaderReducer,
  LoginReducer,
  SidebarReducer,
  POReducer,
  WorkOrderReducer,
  EngineerProcessReducer,
  NotifyReducer,
});

export default reducer;
