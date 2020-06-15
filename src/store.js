// import { createStore, compose, applyMiddleware } from "redux";
import thunk from "redux-thunk";
// import reducer from "./reducers";

// import { createBrowserHistory } from 'history'
// import { routerMiddleware } from 'connected-react-router'

// export const history = createBrowserHistory()

// const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
// const store = createStore(reducer(history), composeEnhancers(applyMiddleware(routerMiddleware(history), thunk)));

// export default store;

import { createBrowserHistory } from "history";
import { applyMiddleware, compose, createStore } from "redux";
import { routerMiddleware } from "connected-react-router";
import createRootReducer from "./reducers";

export const history = createBrowserHistory();

function configureStore(preloadedState) {
  const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const store = createStore(
    createRootReducer(history),
    preloadedState,
    composeEnhancer(applyMiddleware(routerMiddleware(history), thunk))
  );
  return store;
}

const store = configureStore();
export default store;
