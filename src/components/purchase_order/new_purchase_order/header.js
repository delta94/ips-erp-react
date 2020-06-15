import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Col, Row, Input, Select, DatePicker, Divider, Form, Alert, Typography } from "antd";
import { CheckCircleTwoTone } from "@ant-design/icons";

import { GetCustomers } from "../../../actions/po_actions";

const { Option } = Select;

const PurchaseOrderInfo = props => {
  // vars from reducer
  const { customers, work_order, work_order_created } = props;

  // methods from action
  const { GetCustomers } = props;

  useEffect(() => {
    GetCustomers();
  }, [GetCustomers]);

  return (
    <>
      {work_order_created && (
        <Alert
          message={
            <>
              <Row gutter={16}>
                <Col style={{ alignSelf: "center" }}>
                  <CheckCircleTwoTone style={{ fontSize: "1rem" }} twoToneColor="#52c41a" />
                </Col>
                <Col>
                  <Typography.Title level={4}> 下单工号为: {work_order.work_order_num} </Typography.Title>
                </Col>
              </Row>
            </>
          }
          type="info"
          // showIcon
        />
      )}
      <Divider orientation="left" style={{ color: "#333", fontWeight: "normal" }}>
        订单信息
      </Divider>
      <Row gutter={[16, 16]}>
        <Col span={4}>
          <Form.Item name="customer" rules={[{ required: true, message: "必填" }]}>
            <Select placeholder="客户" className="full-width">
              {customers.map(item => (
                <Option key={item._id} value={item.internal}>
                  {item.internal} {item.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={5}>
          <Form.Item name="po_num" rules={[{ required: true, message: "必填" }]}>
            <Input placeholder="客户PO#" />
          </Form.Item>
        </Col>
        <Col span={5}>
          <Form.Item name="submit_date" rules={[{ required: true, message: "必填" }]}>
            <DatePicker className="full-width" placeholder="下单日期" />
          </Form.Item>
        </Col>
        <Col span={5}>
          <Form.Item name="customer_deadline" rules={[{ required: true, message: "必填" }]}>
            <DatePicker className="full-width" placeholder="客户交期" />
          </Form.Item>
        </Col>
        <Col span={5}>
          <Form.Item name="internal_deadline" rules={[{ required: true, message: "必填" }]}>
            <DatePicker className="full-width" placeholder="厂内交期" />
          </Form.Item>
        </Col>
      </Row>
    </>
  );
};

const mapStateToProps = ({ POReducer }) => {
  return {
    customers: POReducer.customers,
    work_order: POReducer.work_order,
    work_order_created: POReducer.work_order_created,
  };
};

export default connect(mapStateToProps, { GetCustomers })(PurchaseOrderInfo);
