import React, { useEffect } from "react";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import Cookies from "js-cookie";
import { SnackbarProvider } from "notistack";
import { CssBaseline } from "@material-ui/core";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Header from "./components/header";
import Login from "./components/login";
import PurchaseOrder from "./components/purchase_order";
import WorkOrderStatus from "./components/work_orders";
import EngineerProcess from "./components/engineer_process";
import CraftSchedule from "./components/craft_schdeule";
import Notify from "./components/notify";

const defaultTheme = createMuiTheme();
const theme = createMuiTheme({
  typography: {
    body1: defaultTheme.typography.body2,
  },
  overrides: {
    MuiInput: {
      input: defaultTheme.typography.body2,
    },
    MuiButton: {
      root: {
        padding: "4px 12px",
      },
      label: defaultTheme.typography.body2,
    },
  },
});
function App() {
  useEffect(() => {
    if (!Cookies.get("CN")) {
      if (window.location.pathname !== "/login") {
        window.location.replace("/login");
      }
    }
  });

  return (
    <MuiThemeProvider theme={theme}>
      <BrowserRouter>
        <SnackbarProvider
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          maxSnack={1}
          autoHideDuration={3000}
        >
          <CssBaseline />
          <Notify />
          <Header />
          <Switch>
            <Route exact path="/" component={WorkOrderStatus} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/po" component={PurchaseOrder} />
            <Route exact path="/engineer_process" component={EngineerProcess} />
            <Route exact path="/craft_schedule" component={CraftSchedule} />
          </Switch>
        </SnackbarProvider>
      </BrowserRouter>
    </MuiThemeProvider>
  );
}

export default App;
