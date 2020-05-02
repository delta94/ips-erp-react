import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";

import { reducer as HeaderReducer } from "./header_reducer";
import { reducer as LoginReducer } from "./login_reducer";
// import { reducer as SidebarReducer } from "./sidebar_reducer";
import { reducer as POReducer } from "./po_reducers";
import { reducer as WorkOrderReducer } from "./work_orders.reducer";
import { reducer as EngineerProcessReducer } from "./engineer_process_reducers";
import { reducer as CraftScheduleReducer } from "./craft_schedule_reducers";
import { reducer as NotifyReducer } from "./notify_reducers";
import { reducer as RFQReducer } from "./rfq_reducer";

// const reducer = (history) => combineReducers({
//   router: connectRouter(history),
//   HeaderReducer,
//   LoginReducer,
//   SidebarReducer,
//   POReducer,
//   WorkOrderReducer,
//   EngineerProcessReducer,
//   CraftScheduleReducer,
//   NotifyReducer,
// });

// export default reducer;

const rootReducer = history =>
  combineReducers({
    router: connectRouter(history),
    HeaderReducer,
    LoginReducer,
    // SidebarReducer,
    POReducer,
    WorkOrderReducer,
    EngineerProcessReducer,
    CraftScheduleReducer,
    NotifyReducer,
    RFQReducer,
  });

export default rootReducer;
