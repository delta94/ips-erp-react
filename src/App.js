import React, { useEffect, useState } from "react";
import "./App.css";
// import clsx from "clsx";
import { push, ConnectedRouter } from "connected-react-router";
import { connect } from "react-redux";
// import { ConnectedRouter } from "connected-react-router";
// import { MuiThemeProvider, createMuiTheme, makeStyles } from "@material-ui/core/styles";
// import { SnackbarProvider } from "notistack";
// import { CssBaseline } from "@material-ui/core";
import { Switch, Route } from "react-router";
// import Sidebar from "./components/sidebar";
import Login from "./components/login/login";
import PurchaseOrder from "./components/purchase_order";
import PurchaseOrderEdit from "./components/purchase_order/po_edit";
import WorkOrderStatus from "./components/work_orders";
import EngineerProcess from "./components/engineer_process";
import CraftSchedule from "./components/craft_schdeule";
import RFQ from "./components/rfq";
import AdminCustomer from "./components/admin/customer";
import AdminCurrency from "./components/admin/currency";
// import { DRAWER_WIDTH } from "./utils/constants";

// const defaultTheme = createMuiTheme();
// const theme = createMuiTheme({
//   // props: {
//   //   MuiListItem: {
//   //     disableRipple: true,
//   //   },
//   // },
//   typography: {
//     body1: defaultTheme.typography.body2,
//   },
//   overrides: {
//     MuiInput: {
//       input: defaultTheme.typography.body2,
//     },
//     MuiSelect: {
//       root: {
//         marginBottom: "-3px",
//       },
//     },
//     MuiButton: {
//       root: {
//         padding: "4px 12px",
//       },
//       label: defaultTheme.typography.body2,
//     },
//     MuiTableCell: {
//       root: {
//         borderBottom: 0,
//         borderRight: "1px solid black",
//         borderLeft: "1px solid black",
//       },
//       sizeSmall: {
//         padding: 2,
//       },
//     },
//     MuiTableRow: {
//       root: {
//         borderBottom: "1px solid black",
//       },
//     },
//     MuiExpansionPanel: {
//       root: {
//         "&$expanded": {
//           margin: 0,
//         },
//       },
//     },
//     MuiExpansionPanelSummary: {
//       root: {
//         padding: 0,
//         "&$expanded": {
//           minHeight: 0,
//         },
//       },
//       content: {
//         margin: 0,
//         padding: 0,
//         "&$expanded": {
//           margin: 0,
//           minHeight: 0,
//         },
//       },
//     },
//   },
// });

// const useStyle = makeStyles(theme => ({
//   content: {
//     flexGrow: 1,
//     // padding: theme.spacing(3),
//     transition: theme.transitions.create("margin", {
//       easing: theme.transitions.easing.sharp,
//       duration: theme.transitions.duration.leavingScreen,
//     }),
//     // marginLeft: -240,
//   },
//   contentShift: {
//     transition: theme.transitions.create("margin", {
//       easing: theme.transitions.easing.easeOut,
//       duration: theme.transitions.duration.enteringScreen,
//     }),
//     // marginLeft: 0,
//     paddingLeft: DRAWER_WIDTH,
//   },
//   drawerHeader: {
//     display: "flex",
//     alignItems: "center",
//     padding: theme.spacing(0, 1),
//     // necessary for content to be below app bar
//     ...theme.mixins.toolbar,
//     justifyContent: "flex-end",
//   },
// }));

// function App(props) {
//   const classes = useStyle();
//   const { history } = props;

//   const { isAuthenticated, openSidebar } = props;

//   useEffect(() => {
//     if (!isAuthenticated) {
//       props.push("/login");
//     }
//   });

//   return (
//     <ConnectedRouter history={history}>
//       <MuiThemeProvider theme={theme}>
//         <SnackbarProvider
//           anchorOrigin={{
//             vertical: "top",
//             horizontal: "center",
//           }}
//           maxSnack={1}
//           autoHideDuration={3000}
//         >
//           <CssBaseline />
//           <Notify />
//           <Header />
//           <div
//             className={clsx(classes.content, {
//               [classes.contentShift]: openSidebar,
//             })}
//           >
//             <div className={classes.drawerHeader} />
//             <Switch>
//               <Route exact path="/" component={WorkOrderStatus} />
//               <Route exact path="/login" component={Login} />
//               <Route exact path="/work_orders" component={WorkOrderStatus} />
//               <Route exact path="/rfq" component={RFQ} />
//               <Route exact path="/po" component={PurchaseOrder} />
//               <Route exact path="/po_edit" component={PurchaseOrderEdit} />
//               <Route exact path="/engineer_process" component={EngineerProcess} />
//               <Route exact path="/craft_schedule" component={CraftSchedule} />
//               <Route exact path="/admin/customer" component={AdminCustomer} />
//               <Route exact path="/admin/currency" component={AdminCurrency} />
//             </Switch>
//           </div>
//         </SnackbarProvider>
//       </MuiThemeProvider>
//     </ConnectedRouter>
//   );
// }

import { Layout, Breadcrumb } from "antd";

import Sidebar from "./components/header/sidebar";

const { Content, Footer, Sider } = Layout;

function App(props) {
  const [collapsed, setCollapsed] = useState(false);
  const { history } = props;

  const onCollapse = collapsed => {
    console.log(collapsed);
    setCollapsed(collapsed);
  };
  const { isAuthenticated } = props;

  useEffect(() => {
    if (!isAuthenticated) {
      props.push("/login");
    }
  });

  return (
    <ConnectedRouter history={history}>
      <Layout style={{ minHeight: "100vh" }}>
        {isAuthenticated && (
          <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
            <Sidebar />
          </Sider>
        )}
        <Layout className="site-layout">
          <Content style={{ margin: "0 16px" }}>
            {isAuthenticated && (
              <Breadcrumb style={{ margin: "16px 0" }}>
                <Breadcrumb.Item>User</Breadcrumb.Item>
                <Breadcrumb.Item>Bill</Breadcrumb.Item>
              </Breadcrumb>
            )}
            <Switch>
              <Route exact path="/" component={WorkOrderStatus} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/work_orders" component={WorkOrderStatus} />
              <Route exact path="/rfq" component={RFQ} />
              <Route exact path="/po" component={PurchaseOrder} />
              <Route exact path="/po_edit" component={PurchaseOrderEdit} />
              <Route exact path="/engineer_process" component={EngineerProcess} />
              <Route exact path="/craft_schedule" component={CraftSchedule} />
              <Route exact path="/admin/customer" component={AdminCustomer} />
              <Route exact path="/admin/currency" component={AdminCurrency} />
            </Switch>
          </Content>
          <Footer style={{ textAlign: "center" }}>IPSMOLD ErP ©2020 Created by wudaown</Footer>
        </Layout>
      </Layout>
    </ConnectedRouter>
  );
}

const mapStateToProps = ({ HeaderReducer }) => {
  return {
    isAuthenticated: HeaderReducer.isAuthenticated,
  };
};

const mapDispatchToProps = dispatch => ({
  push: url => dispatch(push(url)),
});
export default connect(mapStateToProps, mapDispatchToProps)(App);
