import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Descriptions, Divider, Table, Row, Col, Button, Space, Select, Checkbox } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { CSVLink } from "react-csv";

import {
  GetWorkOrderStates,
  updateWorkOrderItemRemark,
  InsertWorkOrderItems,
  PrintLabel,
} from "../../../actions/po_actions";

const HistoryPOContent = props => {
  const { setShowContent } = props;
  const [csvData, setCsvData] = useState([]);
  const [printPartNum, setPrintPartNum] = useState(true);
  const { work_order, work_order_states } = props;
  const { GetWorkOrderStates, updateWorkOrderItemRemark, InsertWorkOrderItems, PrintLabel } = props;
  const [selectedRows, setSelectedRows] = useState([]);

  const generateCSVData = () => {
    let data = work_order.work_order_items.map(el => [
      el.sub_work_order_num,
      el.part_number,
      el.qty,
      el.unit,
      el.unit_price,
    ]);
    data.unshift(["小工号", "图号", "数量", "单位", "单价"]);
    return data;
  };

  useEffect(() => {
    setCsvData(generateCSVData());
    GetWorkOrderStates();
  }, [work_order]);

  // const rowSelection = {
  //   onChange: (selectedRowKeys, selectedRows) => {
  //     console.log(`selectedRowKeys: ${selectedRowKeys}`, "selectedRows: ", selectedRows);
  //   },
  // };
  const rowSelection = {
    onChange: selectedRowKeys => {
      setSelectedRows(selectedRowKeys);
    },
  };

  const columns = [
    { title: "小工号", dataIndex: "sub_work_order_num" },
    { title: "图号", dataIndex: "part_number" },
    {
      title: "数量",
      dataIndex: "qty",
    },
    { title: "单位", dataIndex: "unit" },
    { title: "单价", dataIndex: "unit_price" },
    { title: "小计", dataIndex: "total_price" },
    { title: "运单号", dataIndex: "shipping_num" },
    { title: "发票号", dataIndex: "invoice_num" },
    { title: "备注", render: record => <div>{record.remark === "继续加工" ? "" : record.remark}</div> },
  ];

  const Info = (
    <>
      <Divider orientation="left">订单信息</Divider>
      <Descriptions column={5}>
        <Descriptions.Item label="PO#">{work_order.po_num}</Descriptions.Item>
        <Descriptions.Item label="下单日期">{work_order.submit_date.split("T")[0]}</Descriptions.Item>
        <Descriptions.Item label="厂内交期">{work_order.internal_deadline.split("T")[0]}</Descriptions.Item>
        <Descriptions.Item label="运单号">{work_order.shipping_num}</Descriptions.Item>
        <Descriptions.Item label="发票号">{work_order.invoice_num}</Descriptions.Item>
      </Descriptions>
    </>
  );

  const backButton = (
    <Row>
      <Col span={2}>
        <Button block icon={<ArrowLeftOutlined />} onClick={() => setShowContent(false)}>
          返回
        </Button>
      </Col>
    </Row>
  );

  const Ops = (
    <Row gutter={[16, 16]}>
      <Col span={3}>
        <CSVLink data={csvData} filename={`${work_order.work_order_num}.csv`}>
          <Button type="primary" block>
            导出Excel
          </Button>
        </CSVLink>
      </Col>
      <Col span={3}>
        <Select
          // type="primary"
          placeholder="设为"
          className="full-width"
          onChange={value => updateWorkOrderItemRemark(work_order, selectedRows, value)}
        >
          {work_order_states.map(item => (
            <Select.Option key={item._id} value={item.name}>
              {item.name}
            </Select.Option>
          ))}
        </Select>
      </Col>
      <Col span={6}>
        <Row>
          <Col span={12}>
            <Button type="primary" onClick={() => PrintLabel(printPartNum, selectedRows)} block>
              打印标签
            </Button>
          </Col>
          <Col span={12} align="center" style={{ alignSelf: "center" }}>
            <Checkbox checked={printPartNum} onChange={() => setPrintPartNum(!printPartNum)}>
              打印图号
            </Checkbox>
          </Col>
        </Row>
      </Col>
      <Col span={3}>
        <Button type="primary" block onClick={InsertWorkOrderItems}>
          保存
        </Button>
      </Col>
    </Row>
  );

  return (
    <>
      <Space direction="vertical">
        {backButton}
        {Info}
        <Table
          rowSelection={rowSelection}
          rowKey="sub_work_order_num"
          dataSource={work_order.work_order_items}
          columns={columns}
          pagination={false}
        />
        {Ops}
      </Space>
    </>
  );
};

const mapStateToProps = ({ POReducer }) => {
  return {
    work_order: POReducer.work_order,
    work_order_states: POReducer.work_order_states,
  };
};

export default connect(mapStateToProps, {
  GetWorkOrderStates,
  updateWorkOrderItemRemark,
  InsertWorkOrderItems,
  PrintLabel,
})(HistoryPOContent);
