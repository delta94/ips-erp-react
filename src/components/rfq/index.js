import React from "react";
import RFQHeader from "./rfq_header";
import RFQContent from "./rfq_content";
import RFQOption from "./rfq_option";
import RFQOperations from "./rfq_operations";

function RFQ(props) {
  return (
    <>
      <RFQHeader />
      <RFQOption />
      <RFQContent />
      <RFQOperations />
    </>
  );
}

export default RFQ;
