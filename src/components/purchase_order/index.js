import React from "react";
import { connect } from "react-redux";
import POInfo from "./po_info";
import POItems from "./po_items";

function PurchaseOrder(props) {
  // vars from reducer
  const { work_order_created } = props;

  return (
    <React.Fragment>
      {/* <Alert
        message={alertMessage}
        severity={alertSeverity}
        open={openAlert}
        autoHideDuration={3000}
        onClose={() => UpdateState("openAlert", false)}
      /> */}
      <POInfo />
      {work_order_created && <POItems />}
    </React.Fragment>
  );
}

const mapStateToProps = ({ POReducer }) => {
  return {
    work_order_created: POReducer.work_order_created,
    // for alert
  };
};

export default connect(mapStateToProps, null)(PurchaseOrder);
