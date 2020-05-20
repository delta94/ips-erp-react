import React from "react";
import { connect } from "react-redux";
import { Table, Divider, Col, Row, Button } from "antd";
import { CSVLink } from "react-csv";
import { PatchRFQ } from "../../../actions/rfq_actions";

const csvData = [
  ["firstname", "lastname", "email"],
  ["Ahmed", "Tomi", "ah@smthing.co.com"],
  ["Raed", "Labes", "rl@smthing.co.com"],
  ["Yezzi", "Min l3b", "ymin@cocococo.com"],
];

const RFQContent = props => {
  // vars from reducers
  const { rfq, rfq_items } = props;

  const { PatchRFQ } = props;

  const columns = [
    {
      title: "序号",
      dataIndex: "seq",
    },
    {
      title: "图号",
      dataIndex: "part_number",
    },
    {
      title: "版本",
      dataIndex: "version",
    },
    {
      title: "数量",
      dataIndex: "qty",
    },
    {
      title: "单位",
      dataIndex: "unit",
    },
    {
      title: `单价(${rfq.currency})`,
      dataIndex: "unit_price_foreign",
    },
    {
      title: "小计",
      dataIndex: "total_price",
    },
    {
      title: "备注",
      dataIndex: "remark",
    },
  ];

  return (
    <>
      <Divider orientation="left" style={{ color: "#333", fontWeight: "normal" }}>
        报价内容
      </Divider>
      {rfq.customer && (
        <>
          <Table
            rowKey="seq"
            bordered
            dataSource={rfq_items}
            columns={columns}
            rowClassName="editable-row"
            footer={() => (
              <Row>
                <Col offset={18}>
                  <div>合计金额: 40</div>
                </Col>
              </Row>
            )}
          />
          <Row gutter={16}>
            <Col span={2}>
              <CSVLink data={csvData}>
                <Button>导出Excel</Button>
              </CSVLink>
            </Col>
            <Col span={2}>
              <Button onClick={PatchRFQ}>保存</Button>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

const mapStateToProps = ({ RFQReducer }) => {
  return {
    rfq: RFQReducer.rfq,
    rfq_items: RFQReducer.rfq_items,
  };
};

export default connect(mapStateToProps, { PatchRFQ })(RFQContent);
