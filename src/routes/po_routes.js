import React from "react";
import { Route, Switch } from "react-router-dom";
import PONew from "../components/purchase_order/new_purchase_order";
import POHistory from "../components/purchase_order/history_purchase_order";
import POStatistics from "../components/purchase_order/statistics_purchase_order";
import POPost from "../components/purchase_order/post_purchase_order";

const PORoutes = () => {
  return (
    <Switch>
      <Route exact path="/po/new" component={PONew} />
      <Route exact path="/po/history" component={POHistory} />
      <Route exact path="/po/statistics" component={POStatistics} />
      <Route exact path="/po/post-po" component={POPost} />
    </Switch>
  );
};

export default PORoutes;
