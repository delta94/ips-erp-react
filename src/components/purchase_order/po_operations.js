import React, { useState, useRef } from "react";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Button } from "@material-ui/core";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import {
  AddWorkOrderItem,
  PostInternalWorkOrderItems,
  PrintLabel,
  uploadFile,
  newWorkOrder,
} from "../../actions/po_actions";

import ImportBtn from "../common/import_btn";

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
  clip: {
    height: 1,
    width: 1,
    borderWidth: 0,
    padding: 0,
  },
}));

const POOperations = props => {
  const classes = useStyle();

  const clipboardArea = useRef(null);

  const [clipboard, setClipboard] = useState("");

  const formatExcel = () => {
    let clipboard = `${customer}\t${po_submit_date.toLocaleDateString()}\t${work_order_items[0].item_id}\t${
      work_order_items[0].qty
    }\t${work_order_items[0].unit}\t${customer_dateline.toLocaleDateString()}\t${
      work_order_items[0].unit_price
    }\t${customer_po}\t${work_order_items[0].item_num}`;

    const data = work_order_items.slice(1, work_order_items.length);
    data.forEach(element => {
      clipboard += "\n";
      clipboard += `\t\t${element.item_id}\t${element.qty}\t${
        element.unit
      }\t${customer_dateline.toLocaleDateString()}\t${element.unit_price}\t${customer_po}\t${element.item_num}`;
    });
    setClipboard(clipboard);
    clipboardArea.current.select();
    document.execCommand("copy");
  };

  const { customer, customer_po, customer_dateline, po_submit_date, work_order_items } = props;
  const { newOrder } = props;
  const { AddWorkOrderItem, uploadFile, PrintLabel, PostInternalWorkOrderItems, newWorkOrder } = props;

  const renderNormal = () => {
    return (
      <>
        <Grid item xs={6}></Grid>
        <Grid item xs={2}>
          <Button variant="contained" color="primary" onClick={() => AddWorkOrderItem()}>
            添加
          </Button>
        </Grid>
        <Grid item xs={2}>
          <ImportBtn btnText="上传文件" startIcon={<CloudUploadIcon />} uploadFile={uploadFile} />
        </Grid>
        <Grid item xs={2}>
          <Button variant="contained" color="primary" onClick={() => PostInternalWorkOrderItems()}>
            提交
          </Button>
        </Grid>
      </>
    );
  };

  const renderAfterSubmit = () => {
    return (
      <>
        <Grid item xs={6}></Grid>
        <Grid item xs={2}>
          <Button variant="contained" color="primary" onClick={() => PrintLabel()}>
            打印标签
          </Button>
        </Grid>
        <Grid item xs={2}>
          <Button variant="contained" color="primary" onClick={() => formatExcel()}>
            复制到Excel
          </Button>
        </Grid>
        <Grid item xs={2}>
          <Button variant="contained" color="primary" onClick={newWorkOrder}>
            新下单
          </Button>
        </Grid>
      </>
    );
  };

  return (
    <Grid container className={classes.root}>
      {!newOrder ? renderNormal() : renderAfterSubmit()}
      <textarea className={classes.clip} ref={clipboardArea} value={clipboard} readOnly />
    </Grid>
  );
};

const mapStateToProps = ({ POReducer }) => {
  return {
    customer: POReducer.customer,
    customer_po: POReducer.customer_po,
    customer_dateline: POReducer.customer_dateline,
    po_submit_date: POReducer.po_submit_date,
    work_order_items: POReducer.work_order_items,
    newOrder: POReducer.newOrder,
  };
};

export default connect(mapStateToProps, {
  AddWorkOrderItem,
  PostInternalWorkOrderItems,
  PrintLabel,
  uploadFile,
  newWorkOrder,
})(POOperations);
