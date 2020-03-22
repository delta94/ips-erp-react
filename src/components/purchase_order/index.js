import React from "react";
import { Grid, Typography, Button } from "@material-ui/core";
import SearchBar from "material-ui-search-bar";
import POInfo from "./po_info";
import POInternal from "./po_internal";
import POItems from "./po_items";

export default function PurchaseOrder() {
  return (
    <React.Fragment>
      {/* <Grid container>
        <Grid item xs={4}>
          <Typography>客户PO#</Typography>
          <SearchBar />
          <Button variant="contained" color="primary">
            加载PO#
          </Button>
          <Button variant="contained" color="primary">
            新PO#
          </Button>
        </Grid>
        <Grid item xs={4}></Grid>
        <Grid item xs={4}></Grid>
      </Grid> */}
      <POInfo />
      <POInternal />
      <POItems />
    </React.Fragment>
  );
}
