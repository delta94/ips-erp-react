import React from "react";
import POInfo from "./po_info";
import POItems from "./po_items";

function PurchaseOrder() {
  return (
    <React.Fragment>
      <POInfo />
      <POItems />
    </React.Fragment>
  );
}

export default PurchaseOrder;
