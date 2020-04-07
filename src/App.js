import React from "react";
import { CssBaseline } from "@material-ui/core";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Header from "./components/header";
import Login from "./components/login";
import PurchaseOrder from "./components/purchase_order";
import WorkOrderStatus from "./components/work_orders";
import EngineerProcess from "./components/engineer_process";
import CraftSchedule from "./components/craft_schdeule";

function App() {
  return (
    <React.Fragment>
      <BrowserRouter>
        <CssBaseline />
        <Header />
        <Switch>
          <Route exact path="/login" component={Login} />
          <Route exact path="/po" component={PurchaseOrder} />
          <Route exact path="/engineer_process" component={EngineerProcess} />
          <Route exact path="/work_orders" component={WorkOrderStatus} />
          <Route exact path="/craft_schedule" component={CraftSchedule} />
        </Switch>
      </BrowserRouter>
    </React.Fragment>
  );
}

export default App;
