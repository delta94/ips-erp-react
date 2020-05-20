import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Table, Tag } from "antd";
import { GetRFQs, GetCurrency, updateState } from "../../../actions/rfq_actions";

const RFQUndoneHeader = props => {
  const { rfqs } = props;
  const { GetRFQs, updateState, GetCurrency } = props;

  const determineUndonePart = record => {
    if (!record.delivery_date) {
      return "交期";
    }
    if (!record.price_set) {
      return "单价";
    }
  };
  useEffect(() => {
    GetRFQs(JSON.stringify({ $or: [{ delivery_date: 0 }, { price_set: false }] }));
    GetCurrency();
  }, []);
  const columns = [
    { title: "日期", render: record => <div>{record.email_rfq_date.split("T")[0]}</div> },
    { title: "客户代码", dataIndex: "customer" },
    {
      title: "邮件/RFQ",
      render: record => (
        <Tag
          color="#108ee9"
          onClick={() => {
            updateState("rfq_items", record.rfq_items);
            updateState("rfq", record);
            updateState("showContent", true);
          }}
          style={{ fontSize: "0.875rem" }}
        >
          {record.email_rfq_num}
        </Tag>
      ),
    },
    { title: "未完成项", render: record => <div>{determineUndonePart(record)}</div> },
  ];
  return <Table rowKey="_id" columns={columns} dataSource={rfqs}></Table>;
};

const mapStateToProps = ({ RFQReducer }) => {
  return {
    rfqs: RFQReducer.rfqs,
  };
};

export default connect(mapStateToProps, { GetRFQs, updateState, GetCurrency })(RFQUndoneHeader);
