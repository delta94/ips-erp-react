import React, { useEffect } from "react";
import { push } from 'connected-react-router'
import { connect } from 'react-redux'
import Cookies from 'js-cookie'
import { ConnectedRouter } from 'connected-react-router'
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { SnackbarProvider } from "notistack";
import { CssBaseline } from "@material-ui/core";
import { Switch, Route } from "react-router";
import Header from "./components/header";
import Login from "./components/login";
import PurchaseOrder from "./components/purchase_order";
import WorkOrderStatus from "./components/work_orders";
import EngineerProcess from "./components/engineer_process";
import CraftSchedule from "./components/craft_schdeule";
import Notify from "./components/notify";

const defaultTheme = createMuiTheme();
const theme = createMuiTheme({
  //    MuiTypography: {
  //    content: {
  //         fontSize: '14px',
  //         fontWeight: 'bold',
  //       }
  //  },
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
    MuiTableCell: {
      root: {
        borderBottom: 0,
        borderRight: "1px solid black",
        borderLeft: "1px solid black",
      },
    },
    MuiTableRow: {
      head: {
        borderBottom: "1px solid black",
      },
    },
  },
});
function App(props) {

  const { history } = props

  const { isAuthenticated } = props

  useEffect(() => {
    if (!isAuthenticated) {
      props.push("/login")
    }
  })

  return (
    <ConnectedRouter history={history}>
      <MuiThemeProvider theme={theme}>
        {/* <BrowserRouter> */}
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
        {/* </BrowserRouter> */}
      </MuiThemeProvider>
    </ConnectedRouter>
  );


}
const mapStateToProps = ({ HeaderReducer }) => {
  return {
    isAuthenticated: HeaderReducer.isAuthenticated,
  };
};


const mapDispatchToProps = dispatch => ({
  push: (url) => dispatch(push(url))
})
export default connect(null, mapDispatchToProps)(App)
