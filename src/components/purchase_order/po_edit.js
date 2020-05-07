import React from "react";
import { connect } from "react-redux";
import { Paper, Grid, InputLabel, Typography, TextField, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { updateObjectState, editInternalWorkOrderItem } from "../../actions/po_actions";
import POSearch from "./po_search";

const useStyles = makeStyles(() => ({
  root: {
    margin: 10,
    paddingTop: 10,
  },
  typo: {
    marginTop: 10,
  },

  tableHeader: {
    paddingTop: 10,
    paddingBottom: 10,
  },
  tableRow: {
    paddingBottom: 4,
  },
}));

function POEdit(props) {
  const classes = useStyles();

  // vars from reducers
  const { data } = props;

  const { updateObjectState, editInternalWorkOrderItem } = props;
  const renderContent = () => {
    return (
      <Grid container justify="space-around" className={classes.tableRow} spacing={2}>
        <Grid item xs={2}>
          <TextField value={data.item_id} />
        </Grid>
        <Grid item xs={4}>
          <TextField
            name="item_num"
            value={data.item_num}
            fullWidth
            onChange={e => updateObjectState("data", e.target.name, e.target.value)}
          />
        </Grid>
        <Grid item xs={1}>
          <TextField
            name="qty"
            value={data.qty}
            onChange={e => updateObjectState("data", e.target.name, e.target.value)}
          />
        </Grid>
        <Grid item xs={1}>
          <TextField
            name="unit"
            value={data.unit}
            onChange={e => updateObjectState("data", e.target.name, e.target.value)}
          />
        </Grid>
        <Grid item xs={1}>
          <TextField
            name="unit_price"
            value={data.unit_price}
            onChange={e => updateObjectState("data", e.target.name, e.target.value)}
          />
        </Grid>
        <Grid item xs={1}>
          <TextField name="total_price" value={data.unit_price * data.qty ? data.unit_price * data.qty : ""} />
        </Grid>
      </Grid>
    );
  };

  const renderHeader = () => {
    return (
      <Grid container justify="space-around" className={classes.tableHeader} spacing={2}>
        <Grid item xs={2}>
          <Typography color="primary">工号</Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography color="primary">品名/图号</Typography>
        </Grid>
        <Grid item xs={1}>
          <Typography color="primary">数量</Typography>
        </Grid>
        <Grid item xs={1}>
          <Typography color="primary">单位</Typography>
        </Grid>
        <Grid item xs={1}>
          <Typography color="primary">单价</Typography>
        </Grid>
        <Grid item xs={1}>
          <Typography color="primary">总价</Typography>
        </Grid>
      </Grid>
    );
  };

  return (
    <>
      <POSearch />
      {data && (
        <React.Fragment>
          <Paper className={classes.root}>
            <Grid container alignItems="center" justify="space-around" spacing={2}>
              <Grid item xs={2}>
                <InputLabel shrink>客户</InputLabel>
                <Typography className={classes.typo}>{data.customer}</Typography>
              </Grid>
              <Grid item xs={2}>
                <InputLabel shrink>客户PO#</InputLabel>
                <Typography className={classes.typo}>{data.customer_po}</Typography>
              </Grid>

              <Grid item xs={2}>
                <InputLabel shrink>下单日期</InputLabel>
                <Typography className={classes.typo}>{data.po_submit_date.split("T")[0]}</Typography>
              </Grid>
              <Grid item xs={2}>
                <InputLabel shrink>客户交期</InputLabel>
                <Typography className={classes.typo}>{data.customer_dateline.split("T")[0]}</Typography>
              </Grid>

              <Grid item xs={2}>
                <InputLabel shrink>厂内交期</InputLabel>
                <Typography className={classes.typo}>{data.internal_dateline.split("T")[0]}</Typography>
              </Grid>
            </Grid>
          </Paper>
          <Paper className={classes.root}>
            {renderHeader()}
            {renderContent()}
          </Paper>

          <Grid container justify="center">
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                editInternalWorkOrderItem();
              }}
            >
              提交修改
            </Button>
          </Grid>
        </React.Fragment>
      )}
    </>
  );
}

const mapStateToProps = ({ POReducer }) => {
  return {
    data: POReducer.data,
  };
};

export default connect(mapStateToProps, { updateObjectState, editInternalWorkOrderItem })(POEdit);
