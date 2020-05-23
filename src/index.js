import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import zhCN from "antd/es/locale/zh_CN";
import { ConfigProvider } from "antd";

import { Provider } from "react-redux";
// import store from "./store";
// import { history } from './store'

import configureStore, { history } from "./store";

const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <ConfigProvider locale={zhCN}>
      <App history={history} />
    </ConfigProvider>
  </Provider>,
  document.getElementById("root")
);
