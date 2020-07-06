import React from "react";
import { Route, Switch } from "react-router-dom";
import RFQNew from "../components/rfq/new_rfq";
import RFQUndone from "../components/rfq/undone_rfq";
import RFQHistory from "../components/rfq/history_rfq";
import RFQSearch from "../components/rfq/search_rfq";

const RFQRoutes = () => {
  return (
    <Switch>
      <Route exact path="/rfq/new" component={RFQNew} />
      <Route exact path="/rfq/undone" component={RFQUndone} />
      <Route exact path="/rfq/history" component={RFQHistory} />
      <Route exact path="/rfq/search" component={RFQSearch} />
    </Switch>
  );
};

export default RFQRoutes;
