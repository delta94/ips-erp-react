import React from "react";
import { Card } from "antd";
import Search from "./search";
import Content from "./content";

const RFQSearch = () => {
  return (
    <Card>
      <Search />
      <Content />
    </Card>
  );
};

export default RFQSearch;
