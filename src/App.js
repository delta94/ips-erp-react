import React from "react";
import { CssBaseline } from "@material-ui/core";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Header from "./components/header";
import Login from "./components/login";
import PurchaseOrder from "./components/purchase_order";

function App() {
  return (
    <React.Fragment>
      <BrowserRouter>
        <CssBaseline />
        <Header />
        <Switch>
          <Route exact path="/login" component={Login} />
          <Route exact path="/po" component={PurchaseOrder} />
        </Switch>
      </BrowserRouter>
    </React.Fragment>
  );
}

export default App;
