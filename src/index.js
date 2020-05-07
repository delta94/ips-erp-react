import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "element-theme-default";

import { Provider } from "react-redux";
// import store from "./store";
// import { history } from './store'

import configureStore, { history } from "./store";

const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <App history={history} />
  </Provider>,
  document.getElementById("root")
);
