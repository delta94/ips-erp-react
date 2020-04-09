import React from "react";
// import { useDispatch } from "react-redux";
import { SnackbarProvider } from "notistack";
import { CssBaseline } from "@material-ui/core";
import { BrowserRouter, Switch, Route } from "react-router-dom";
// import IconButton from "@material-ui/core/IconButton";
// import Close from "@material-ui/icons/Close";
import Header from "./components/header";
import Login from "./components/login";
import PurchaseOrder from "./components/purchase_order";
import WorkOrderStatus from "./components/work_orders";
import EngineerProcess from "./components/engineer_process";
import CraftSchedule from "./components/craft_schdeule";
import Notify from "./components/notify";

// import { closeSnackbar as closeSnackbarAction } from "./actions/notify_actions";

function App() {
  // const dispatch = useDispatch();
  // const closeSnackbar = (...args) => dispatch(closeSnackbarAction(...args));

  return (
    <SnackbarProvider
      anchorOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
      // action={
      //   <IconButton component="span" color="inherit" size="small" onClick={() => closeSnackbar()}>
      //     <Close />
      //   </IconButton>
      // }
      maxSnack={1}
      autoHideDuration={3000}
    >
      <React.Fragment>
        <BrowserRouter>
          <CssBaseline />
          <Notify />
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
    </SnackbarProvider>
  );
}

export default App;
