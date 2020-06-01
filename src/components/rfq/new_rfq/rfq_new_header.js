import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Divider, Row, Col, Select, Input, DatePicker, Form } from "antd";
import { GetCustomers, updateObjectState, GetCurrency, updateCustomer } from "../../../actions/rfq_actions";
import moment from "moment";
const { Option } = Select;

const RFQNewHeader = props => {
  const { headerForm } = props;
  // vars from reducer
  const { customers, rfq } = props;
  // methods from action
  const { GetCustomers, updateObjectState, GetCurrency, updateCustomer } = props;
  useEffect(() => {
    GetCustomers();
    GetCurrency();
  }, [GetCustomers, GetCurrency]);

  return (
    <>
      <Divider orientation="left">报价信息</Divider>
      <Form form={headerForm} component={false} initialValues={{ email_rfq_date: moment() }}>
        <Row gutter={16}>
          <Col span={4}>
            <Form.Item name="customer" rules={[{ required: true, message: "必填" }]}>
              <Select placeholder="客户代码" onChange={value => updateCustomer(value)} className="full-width">
                {customers.map(item => (
                  <Option key={item._id} value={item.internal}>
                    {item.internal} {item.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item name="email_rfq_num" rules={[{ required: true, message: "必填" }]}>
              <Input
                placeholder="邮件/RFQ号"
                value={rfq.email_rfq_num}
                onChange={e => updateObjectState("rfq", "email_rfq_num", e.target.value)}
              />
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item name="customer_name" rules={[{ required: true, message: "必填" }]}>
              <Input
                placeholder="姓名"
                value={rfq.customer_name}
                onChange={e => updateObjectState("rfq", "customer_name", e.target.value)}
              />
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item name="email_rfq_date" rules={[{ required: true, message: "必填" }]}>
              <DatePicker
                placeholder="日期"
                className="full-width"
                value={moment(rfq.email_rfq_date)}
                onChange={date => updateObjectState("rfq", "email_rfq_date", date)}
              />
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item name="rfq_num" rules={[{ required: true, message: "必填" }]}>
              <Input
                placeholder="报价单号"
                value={rfq.rfq_num}
                onChange={e => updateObjectState("rfq", "rfq_num", e.target.value)}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </>
  );
};

const mapStateToProps = ({ RFQReducer }) => ({
  customers: RFQReducer.customers,
  rfq: RFQReducer.rfq,
});

export default connect(mapStateToProps, { GetCustomers, updateObjectState, GetCurrency, updateCustomer })(RFQNewHeader);
