import React, { useEffect } from "react";
import clsx from "clsx";
import { push } from "connected-react-router";
import { connect } from "react-redux";
import { ConnectedRouter } from "connected-react-router";
import { MuiThemeProvider, createMuiTheme, makeStyles } from "@material-ui/core/styles";
import { SnackbarProvider } from "notistack";
import { CssBaseline } from "@material-ui/core";
import { Switch, Route } from "react-router";
import Header from "./components/header";
// import Sidebar from "./components/sidebar";
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

const useStyle = makeStyles(theme => ({
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    // marginLeft: -240,
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    // marginLeft: 0,
    paddingLeft: 240,
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
  },
}));

function App(props) {
  const classes = useStyle();
  const { history } = props;

  const { isAuthenticated, openSidebar } = props;

  useEffect(() => {
    if (!isAuthenticated) {
      props.push("/login");
    }
  });

  return (
    <ConnectedRouter history={history}>
      <MuiThemeProvider theme={theme}>
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
          {/* <Sidebar /> */}
          <div
            className={clsx(classes.content, {
              [classes.contentShift]: openSidebar,
            })}
          >
            <div className={classes.drawerHeader} />
            <Switch>
              <Route exact path="/login" component={Login} />
              <Route exact path="/work_orders" component={WorkOrderStatus} />
              <Route exact path="/po" component={PurchaseOrder} />
              <Route exact path="/engineer_process" component={EngineerProcess} />
              <Route exact path="/craft_schedule" component={CraftSchedule} />
            </Switch>
          </div>
        </SnackbarProvider>
      </MuiThemeProvider>
    </ConnectedRouter>
  );
}
const mapStateToProps = ({ HeaderReducer }) => {
  return {
    isAuthenticated: HeaderReducer.isAuthenticated,
    openSidebar: HeaderReducer.openSidebar,
  };
};

const mapDispatchToProps = dispatch => ({
  push: url => dispatch(push(url)),
});
export default connect(mapStateToProps, mapDispatchToProps)(App);
