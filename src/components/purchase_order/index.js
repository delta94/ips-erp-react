import React from "react";
import { Card } from "antd";
import PurchaseOrderHeader from "./header";
import PurchaseOrderInfo from "./info";
import PurchaseOrderContent from "./content";
import PurchaseOrderOperation from "./operations";

const PurchaseOrder = () => {
  return (
    <Card>
      <PurchaseOrderHeader />
      <PurchaseOrderInfo />
      <PurchaseOrderContent />
      <PurchaseOrderOperation />
    </Card>
  );
};

export default PurchaseOrder;
