import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Table, Tag } from "antd";
import { GetRFQs, GetCustomers, updateState } from "../../../actions/rfq_actions";

const RFQHistoryHeader = props => {
  const { rfqs } = props;
  const { GetRFQs, updateState, GetCustomers } = props;

  useEffect(() => {
    GetRFQs(JSON.stringify({ $and: [{ delivery_date: { $ne: 0 } }, { price_set: true }] }));
    GetCustomers();
  }, []);
  const columns = [
    { title: "日期", render: record => <div>{record.email_rfq_date.split("T")[0]}</div> },
    { title: "客户代码", dataIndex: "customer" },
    {
      title: "邮件/RFQ",
      render: record => (
        <Tag
          color="#108ee9"
          style={{ fontSize: "0.875rem" }}
          onClick={() => {
            updateState("rfq_items", record.rfq_items);
            updateState("rfq", record);
            updateState("showContent", true);
          }}
        >
          {record.email_rfq_num}
        </Tag>
      ),
    },
  ];
  return <Table pagination={false} rowKey="_id" columns={columns} dataSource={rfqs}></Table>;
};

const mapStateToProps = ({ RFQReducer }) => {
  return {
    rfqs: RFQReducer.rfqs,
  };
};

export default connect(mapStateToProps, { GetRFQs, updateState, GetCustomers })(RFQHistoryHeader);
