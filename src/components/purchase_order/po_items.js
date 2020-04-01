import React from "react";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";

import POBarcode from "./po_barcode";

import { UpdateWorkOrderItem, AddWorkOrderItem, PostInternalWorkOrderItems } from "../../actions/po_actions";
import { Button } from "@material-ui/core";

const useStyle = makeStyles(theme => ({
  root: {
    // margin: 20
    padding: 20
  },
  tableHeader: {
    paddingTop: 10,
    paddingBottom: 10
  },
  tableRow: {
    paddingBottom: 4
  }
}));

function POItems(props) {
  // vars from reducer
  const { work_order_items } = props;
  // methods from actions
  const { UpdateWorkOrderItem, AddWorkOrderItem, PostInternalWorkOrderItems } = props;

  const classes = useStyle();
  const renderHeader = () => {
    return (
      <Grid container justify="space-around" className={classes.tableHeader} spacing={2}>
        <Grid item xs={2}>
          <Typography color="primary">工号</Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography color="primary">品名/图号</Typography>
        </Grid>
        <Grid item xs={1}>
          <Typography color="primary">单位</Typography>
        </Grid>
        <Grid item xs={1}>
          <Typography color="primary">数量</Typography>
        </Grid>
        <Grid item xs={1}>
          <Typography color="primary">单价</Typography>
        </Grid>
        <Grid item xs={1}>
          <Typography color="primary">总价</Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography color="primary">CAD图档</Typography>
        </Grid>
      </Grid>
    );
  };

  const renderItems = () => {
    return work_order_items.map((item, index) => {
      return (
        <Grid container justify="space-around" className={classes.tableRow} key={index} spacing={2}>
          <Grid item xs={2}>
            <TextField value={item.item_id} />
          </Grid>
          <Grid item xs={2}>
            <TextField
              name="item_num"
              value={item.item_num}
              onChange={e => UpdateWorkOrderItem(index, e.target.name, e.target.value)}
            />
          </Grid>
          <Grid item xs={1}>
            <TextField
              name="unit"
              value={item.unit}
              onChange={e => UpdateWorkOrderItem(index, e.target.name, e.target.value)}
            />
          </Grid>
          <Grid item xs={1}>
            <TextField
              name="qty"
              type="number"
              value={item.qty}
              onChange={e => UpdateWorkOrderItem(index, e.target.name, e.target.value)}
            />
          </Grid>
          <Grid item xs={1}>
            <TextField
              type="number"
              name="unit_price"
              value={item.unit_price}
              onChange={e => UpdateWorkOrderItem(index, e.target.name, e.target.value)}
            />
          </Grid>
          <Grid item xs={1}>
            <TextField
              // type="number"
              name="total_price"
              value={item.unit_price * item.qty ? item.unit_price * item.qty : ""}
              // onChange={e => UpdateWorkOrderItem(index, e.target.name, e.target.value)}
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              name="cad_dir"
              value={work_order_items[0].cad_dir}
              onChange={e => UpdateWorkOrderItem(index, e.target.name, e.target.value)}
            />
          </Grid>
        </Grid>
      );
    });
  };
  return (
    <React.Fragment>
      <Paper className={classes.root}>
        {renderHeader()}
        {renderItems()}
      </Paper>
      <Grid container className={classes.root}>
        <Grid item xs={9}></Grid>
        <Grid item xs={1}>
          <Button variant="contained" color="primary" onClick={() => AddWorkOrderItem()}>
            添加
          </Button>
        </Grid>
        <Grid item xs={1}>
          <POBarcode />
        </Grid>
        <Grid item xs={1}>
          <Button variant="contained" color="primary" onClick={() => PostInternalWorkOrderItems()}>
            提交
          </Button>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

const mapStateToProps = ({ POReducer }) => {
  return {
    work_order_items: POReducer.work_order_items
  };
};

export default connect(mapStateToProps, { UpdateWorkOrderItem, AddWorkOrderItem, PostInternalWorkOrderItems })(POItems);
