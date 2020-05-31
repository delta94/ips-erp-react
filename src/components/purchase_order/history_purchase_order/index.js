import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Col, Row, Input, Select, Divider, Table, Card } from "antd";
import POHistoryContent from "./content";

import { updateState, GetWOPipeline, resetState } from "../../../actions/po_actions";

const { Search } = Input;
const { Option } = Select;

const style = {
  divider: {
    color: "#333",
    fontWeight: "normal",
  },
};

const POHistory = props => {
  const [showContent, setShowContent] = useState(false);
  // vars from reducer
  const { query_type, work_orders } = props;

  // methods from actions
  const { updateState, GetWOPipeline, resetState } = props;
  useEffect(() => {
    return () => {
      resetState();
    };
  }, []);

  const GetWO = value => {
    const query = JSON.stringify([
      {
        $match: {
          [query_type]: { $regex: value, $options: "$i" },
        },
      },
    ]);
    GetWOPipeline(query);
  };
  const columns = [
    {
      title: "大工号",
      dataIndex: "work_order_num",
      render: (dataIndex, record) => (
        <div
          onClick={() => {
            setShowContent(true);
            updateState("work_order", record);
          }}
          style={{ cursor: "pointer" }}
        >
          {dataIndex}
        </div>
      ),
    },
    { title: "PO#", dataIndex: "po_num" },
    { title: "厂内交期", dataIndex: "internal_deadline", render: dataIndex => <div>{dataIndex.split("T")[0]}</div> },
    { title: "发票号", dataIndex: "invoice_num" },
    { title: "运单号", dataIndex: "shipping_num" },
  ];
  return (
    <Card>
      {!showContent ? (
        <>
          <Divider orientation="left" style={style.divider}>
            搜索信息
          </Divider>
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <Select
                placeholder="请选择PO# | 运单号 | 发票号"
                className="full-width"
                onChange={value => updateState("query_type", value)}
              >
                <Option value="work_order_num">大工号</Option>
                <Option value="shipping_num">运单号</Option>
                <Option value="invoice_num">发票号</Option>
              </Select>
            </Col>
            <Col span={8}>
              <Search onSearch={value => GetWO(value)} />
            </Col>
          </Row>
          <Table rowKey="_id" dataSource={work_orders} columns={columns} pagination={false} />
        </>
      ) : (
        <POHistoryContent setShowContent={setShowContent} />
      )}
    </Card>
  );
};

const mapStateToProps = ({ POReducer }) => {
  return {
    query_type: POReducer.query_type,
    work_orders: POReducer.work_orders,
  };
};

export default connect(mapStateToProps, { updateState, GetWOPipeline, resetState })(POHistory);
