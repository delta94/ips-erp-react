import React from "react";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { Paper, Grid, Typography, TextField, Button } from "@material-ui/core";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";

import ImportBtn from "../common/import_btn";

import {
  UpdateWorkOrderItem,
  AddWorkOrderItem,
  PostInternalWorkOrderItems,
  PrintLabel,
  uploadFile,
} from "../../actions/po_actions";

const useStyle = makeStyles(() => ({
  root: {
    margin: 10,
    padding: 10,
  },
  tableHeader: {
    paddingTop: 10,
    paddingBottom: 10,
  },
  tableRow: {
    paddingBottom: 4,
  },
}));

function POItems(props) {
  // vars from reducer
  const { work_order_items, total_price, work_order_created } = props;
  // methods from actions
  const { UpdateWorkOrderItem, AddWorkOrderItem, PostInternalWorkOrderItems, PrintLabel, uploadFile } = props;

  const classes = useStyle();
  const renderTotal = () => {
    return (
      <Grid container justify="space-around" className={classes.tableHeader} spacing={2}>
        <Grid item xs={2}></Grid>
        <Grid item xs={4}></Grid>
        <Grid item xs={1}></Grid>
        <Grid item xs={1}></Grid>
        <Grid item xs={1}></Grid>
        <Grid item xs={1}>
          <Typography color="primary">金额总计: {total_price}</Typography>
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
        {/* <Grid item xs={2}>
          <Typography color="primary">CAD图档</Typography>
        </Grid> */}
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
          <Grid item xs={4}>
            <TextField
              name="item_num"
              value={item.item_num}
              fullWidth
              onChange={e => UpdateWorkOrderItem(index, e.target.name, e.target.value)}
            />
          </Grid>
          <Grid item xs={1}>
            <TextField
              name="qty"
              value={item.qty}
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
              name="unit_price"
              value={item.unit_price}
              onChange={e => UpdateWorkOrderItem(index, e.target.name, e.target.value)}
            />
          </Grid>
          <Grid item xs={1}>
            <TextField name="total_price" value={item.unit_price * item.qty ? item.unit_price * item.qty : ""} />
          </Grid>
        </Grid>
      );
    });
  };
  return (
    <>
      {work_order_created && (
        <>
          <Paper className={classes.root}>
            {renderHeader()}
            {renderItems()}
            {renderTotal()}
          </Paper>
          <Grid container className={classes.root}>
            <Grid item xs={8}></Grid>
            <Grid item xs={1}>
              <Button variant="contained" color="primary" onClick={() => AddWorkOrderItem()}>
                添加
              </Button>
            </Grid>
            <Grid item xs={1}>
              <ImportBtn btnText="上传文件" startIcon={<CloudUploadIcon />} uploadFile={uploadFile} />
            </Grid>
            <Grid item xs={1}>
              <Button variant="contained" color="primary" onClick={() => PrintLabel()}>
                打印标签
              </Button>
            </Grid>
            <Grid item xs={1}>
              <Button variant="contained" color="primary" onClick={() => PostInternalWorkOrderItems()}>
                提交
              </Button>
            </Grid>
          </Grid>
        </>
      )}
    </>
  );
}

const mapStateToProps = ({ POReducer }) => {
  return {
    work_order_created: POReducer.work_order_created,
    work_order_items: POReducer.work_order_items,
    total_price: POReducer.total_price,
  };
};

export default connect(mapStateToProps, {
  UpdateWorkOrderItem,
  AddWorkOrderItem,
  PostInternalWorkOrderItems,
  PrintLabel,
  uploadFile,
})(POItems);
