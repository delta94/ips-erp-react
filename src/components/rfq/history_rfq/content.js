import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Table, Divider, Col, Row, Button } from "antd";
import { CSVLink } from "react-csv";
import { PatchRFQ } from "../../../actions/rfq_actions";

const RFQContent = props => {
  const [csvData, setCsvData] = useState([]);
  // vars from reducers
  const { rfq, rfq_items } = props;

  const { PatchRFQ } = props;

  const generateCSVData = () => {
    let data = rfq_items.map(el => [el.seq, el.part_number, el.qty, el.unit, el.unit_price_foreign]);
    data.unshift(["序号", "图号", "数量", "单位", "单价"]);
    return data;
  };

  useEffect(() => {
    setCsvData(generateCSVData());
  }, []);

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
      render: value => <div>{value === 0 ? "无单价" : value}</div>,
    },
    {
      title: "小计",
      dataIndex: "total_price",
      render: value => <div>{value === 0 ? "无小计" : value}</div>,
    },
    {
      title: "业务备注",
      dataIndex: "remark",
    },
    {
      title: "工程备注",
      dataIndex: "reason",
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
            pagination={false}
            dataSource={rfq_items}
            columns={columns}
            rowClassName="editable-row"
            footer={() => (
              <Row>
                <Col offset={22} span={2}>
                  <div>合计金额: {rfq_items.reduce((acc, el) => acc + el.total_price, 0)}</div>
                </Col>
              </Row>
            )}
            style={{ paddingBottom: "16px" }}
          />
          <Row gutter={16}>
            <Col span={3}>
              <Button
                type="primary"
                block
                onClick={() => {
                  const electron = process.env.NODE_ENV !== "development" && window.require("electron");
                  process.env.NODE_ENV !== "development" && electron.shell.openItem(rfq.rfq_folder);
                }}
              >
                打开文件夹
              </Button>
            </Col>
            <Col span={3}>
              <CSVLink data={csvData} filename={`${rfq.email_rfq_num}.csv`}>
                <Button block type="primary">
                  导出Excel
                </Button>
              </CSVLink>
            </Col>
            <Col span={3}>
              <Button block type="primary" onClick={PatchRFQ}>
                保存
              </Button>
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
