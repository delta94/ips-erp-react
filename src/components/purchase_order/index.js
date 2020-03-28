import React from "react";
import { connect } from "react-redux";
import POInfo from "./po_info";
import POItems from "./po_items";

function PurchaseOrder(props) {
  // vars from reducer
  const { work_order_created } = props;

  return (
    <React.Fragment>
      <POInfo />
      {work_order_created && <POItems />}
    </React.Fragment>
  );
}

const mapStateToProps = ({ POReducer }) => {
  return {
    work_order_created: POReducer.work_order_created
  };
};

export default connect(mapStateToProps, null)(PurchaseOrder);
