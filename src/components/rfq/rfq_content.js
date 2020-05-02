import React from "react";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, Grid, Paper, TextField } from "@material-ui/core";

import { updateArrayObjectState } from "../../actions/rfq_actions";

const useStyle = makeStyles(() => ({
  root: {
    margin: 10,
    padding: 10,
  },
}));

const RFQContent = props => {
  const classes = useStyle();

  // vars from reducers
  const { rfq, rfq_items } = props;

  // methods from actions
  const { updateArrayObjectState } = props;

  const renderHeader = () => {
    return (
      <>
        <Grid item xs={1}>
          <Typography color="primary">序号</Typography>
        </Grid>
        <Grid item xs={rfq.shipping_fee_apply ? 4 : 5}>
          <Typography color="primary">图号</Typography>
        </Grid>
        <Grid item xs={1}>
          <Typography color="primary">版本</Typography>
        </Grid>
        <Grid item xs={1}>
          <Typography color="primary">数量</Typography>
        </Grid>
        <Grid item xs={1}>
          <Typography color="primary">单位</Typography>
        </Grid>
        <Grid item xs={1}>
          <Typography color="primary">单价 {rfq.currency && `(${rfq.currency})`}</Typography>
        </Grid>
        <Grid item xs={1}>
          <Typography color="primary">小计</Typography>
        </Grid>
        <Grid item xs={1}>
          <Typography color="primary">单价 (RMB)</Typography>
        </Grid>
        {rfq.shipping_fee_apply && (
          <Grid item xs={1}>
            <Typography color="primary">运费 (RMB)</Typography>
          </Grid>
        )}
      </>
    );
  };

  const renderContent = () => {
    return rfq_items.map((item, index) => {
      return (
        <React.Fragment key={index}>
          <Grid item xs={1}>
            <Typography>{item.seq}</Typography>
          </Grid>
          <Grid item xs={rfq.shipping_fee_apply ? 4 : 5}>
            <TextField
              fullWidth
              value={item.item_id}
              onChange={e => updateArrayObjectState("rfq_items", index, "item_id", e.target.value)}
            />
          </Grid>
          <Grid item xs={1}>
            <TextField
              fullWidth
              value={item.version}
              onChange={e => updateArrayObjectState("rfq_items", index, "version", e.target.value)}
            />
          </Grid>
          <Grid item xs={1}>
            <TextField
              fullWidth
              value={item.qty}
              onChange={e => updateArrayObjectState("rfq_items", index, "qty", e.target.value)}
            />
          </Grid>
          <Grid item xs={1}>
            <TextField
              fullWidth
              value={item.unit}
              onChange={e => updateArrayObjectState("rfq_items", index, "unit", e.target.value)}
            />
          </Grid>
          <Grid item xs={1}>
            <TextField
              fullWidth
              value={item.unit_price_foreign}
              onChange={e => updateArrayObjectState("rfq_items", index, "unit_price_foreign", e.target.value)}
            />
          </Grid>
          <Grid item xs={1}>
            {/* <TextField
              fullWidth
              value={item.item_total}
              onChange={e => updateArrayObjectState("rfq_items", index, "item_total", e.target.value)}
            /> */}
            <Typography>{item.item_total}</Typography>
          </Grid>
          <Grid item xs={1}>
            {/* <TextField
              fullWidth
              value={item.unit_price}
              onChange={e => updateArrayObjectState("rfq_items", index, "unit_price", e.target.value)}
            /> */}
            <Typography>{item.unit_price}</Typography>
          </Grid>
          {rfq.shipping_fee_apply && (
            <Grid item xs={1}>
              {/* <Typography>{item.shipping_fee}</Typography> */}
              <TextField
                fullWidth
                value={item.shipping_fee}
                onChange={e => updateArrayObjectState("rfq_items", index, "shipping_fee", e.target.value)}
              />
            </Grid>
          )}
        </React.Fragment>
      );
    });
  };

  return (
    <>
      {rfq.customer && (
        <Paper className={classes.root}>
          <Grid container alignItems="center" justify="space-around" spacing={4}>
            {renderHeader()}
            {renderContent()}
          </Grid>
        </Paper>
      )}
    </>
  );
};

const mapStateToProps = ({ RFQReducer }) => {
  return {
    rfq: RFQReducer.rfq,
    rfq_items: RFQReducer.rfq_items,
  };
};

const mapDispatchToProps = dispatch => ({
  updateArrayObjectState: (name, index, key, value) => dispatch(updateArrayObjectState(name, index, key, value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RFQContent);
