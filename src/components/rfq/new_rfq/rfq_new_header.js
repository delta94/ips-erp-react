import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Divider, Row, Col, Select, Input, DatePicker } from "antd";
import { GetCustomers, updateObjectState, GetCurrency, updateCustomer } from "../../../actions/rfq_actions";
const { Option } = Select;

const RFQNewHeader = props => {
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
      <Row gutter={16}>
        <Col span={4}>
          <Select placeholder="客户代码" onChange={value => updateCustomer(value)} className="full-width">
            {customers.map(item => (
              <Option key={item._id} value={item.internal}>
                {item.internal} {item.name}
              </Option>
            ))}
          </Select>
        </Col>
        <Col span={5}>
          <Input
            placeholder="邮件/RFQ号"
            value={rfq.email_rfq_num}
            onChange={e => updateObjectState("rfq", "email_rfq_num", e.target.value)}
          />
        </Col>
        <Col span={5}>
          <Input
            placeholder="姓名"
            value={rfq.customer_name}
            onChange={e => updateObjectState("rfq", "customer_name", e.target.value)}
          />
        </Col>
        <Col span={5}>
          <DatePicker
            placeholder="日期"
            className="full-width"
            value={rfq.email_rfq_date}
            onChange={date => updateObjectState("rfq", "email_rfq_date", date)}
          />
        </Col>
        <Col span={5}>
          <Input
            placeholder="报价单号"
            value={rfq.rfq_num}
            onChange={e => updateObjectState("rfq", "rfq_num", e.target.value)}
          />
        </Col>
      </Row>
    </>
  );
};

const mapStateToProps = ({ RFQReducer }) => ({
  customers: RFQReducer.customers,
  rfq: RFQReducer.rfq,
});

export default connect(mapStateToProps, { GetCustomers, updateObjectState, GetCurrency, updateCustomer })(RFQNewHeader);
