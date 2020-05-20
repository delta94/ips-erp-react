import React from "react";
import { Card } from "antd";
import RFQHeader from "./header";
import RFQOPtion from "./option";
import RFQContent from "./content";
import RFQOperation from "./operation";

const RFQ = () => {
  return (
    <Card>
      <RFQHeader />
      <RFQOPtion />
      <RFQContent />
      <RFQOperation />
    </Card>
  );
};

export default RFQ;
