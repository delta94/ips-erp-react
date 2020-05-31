import React, { useEffect, useState } from "react";
import "./App.css";
import { push, ConnectedRouter } from "connected-react-router";
import { connect } from "react-redux";
import { Switch, Route } from "react-router";
import Login from "./components/login";
import Sidebar from "./components/header";
// import PO from "./components/purchase_order";
// import PurchaseOrderEdit from "./components/purchase_order/po_edit";
import WorkOrderStatus from "./components/work_orders";
import EngineerProcess from "./components/engineer_process";
import CraftSchedule from "./components/craft_schdeule";
import AdminCustomer from "./components/admin/customer";
import AdminCurrency from "./components/admin/currency";
// import PO from "./components/purchase_order/new_purchase_order";

import { Layout, Breadcrumb } from "antd";
import RFQRoutes from "./routes/rfq_routes";
import PORoutes from "./routes/po_routes";

const { Content, Footer, Sider } = Layout;

function App(props) {
  const [collapsed, setCollapsed] = useState(true);
  const { history } = props;

  const onCollapse = collapsed => {
    setCollapsed(collapsed);
  };
  const { isAuthenticated, currentPath } = props;

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
              <Breadcrumb style={{ margin: "16px 0" }} separator=">">
                {currentPath.map(item => (
                  <Breadcrumb.Item key={item}>{item}</Breadcrumb.Item>
                ))}
              </Breadcrumb>
            )}
            <Switch>
              <Route exact path="/login" component={Login} />
              <Route exact path="/" component={WorkOrderStatus} />
              <Route exact path="/work_orders" component={WorkOrderStatus} />
              {/* <Route exact path="/po" component={PO} /> */}
              {/* <Route exact path="/po_edit" component={PurchaseOrderEdit} /> */}
              <Route exact path="/engineer_process" component={EngineerProcess} />
              <Route exact path="/craft_schedule" component={CraftSchedule} />
              <Route exact path="/admin/customer" component={AdminCustomer} />
              <Route exact path="/admin/currency" component={AdminCurrency} />
            </Switch>
            <PORoutes />
            <RFQRoutes />
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
    currentPath: HeaderReducer.currentPath,
  };
};

const mapDispatchToProps = dispatch => ({
  push: url => dispatch(push(url)),
});
export default connect(mapStateToProps, mapDispatchToProps)(App);
