import React, { useEffect } from "react";
import moment from "moment";
import { connect } from "react-redux";
import { Col, Row, Input, Select, DatePicker, Divider } from "antd";

import { GetCustomers, updateObjectState } from "../../actions/po_actions";

const { Option } = Select;

const PurchaseOrderInfo = props => {
  // vars from reducer
  const { customers, work_order } = props;

  // methods from action
  const { GetCustomers, updateObjectState } = props;

  useEffect(() => {
    GetCustomers();
  }, [GetCustomers]);

  return (
    <>
      <Divider orientation="left" style={{ color: "#333", fontWeight: "normal" }}>
        订单信息
      </Divider>
      <Row gutter={[16, 16]}>
        <Col span={4}>
          <Select
            defaultValue="客户"
            value={work_order.customer}
            className="full-width"
            onChange={value => updateObjectState("work_order", "customer", value)}
          >
            <Option value="">客户</Option>
            {customers.map(item => (
              <Option key={item._id} value={item.internal}>
                {item.internal} {item.name}
              </Option>
            ))}
          </Select>
        </Col>
        <Col span={5}>
          <Input
            placeholder="客户PO#"
            value={work_order.po_num}
            onChange={e => updateObjectState("work_order", "po_num", e.target.value)}
          />
        </Col>
        <Col span={5}>
          <DatePicker
            placeholder="下单日期"
            value={work_order.submit_date}
            onChange={date => updateObjectState("work_order", "submit_date", date)}
          />
        </Col>
        <Col span={5}>
          <DatePicker
            placeholder="客户交期"
            value={work_order.customer_deadline}
            onChange={date => {
              updateObjectState("work_order", "customer_deadline", date);
              updateObjectState("work_order", "internal_deadline", moment(date).add(-7, "days"));
            }}
          />
        </Col>
        <Col span={5}>
          <DatePicker placeholder="厂内交期" value={work_order.internal_deadline} />
        </Col>
      </Row>
    </>
  );
};

const mapStateToProps = ({ POReducer }) => {
  return {
    customers: POReducer.customers,
    work_order: POReducer.work_order,
  };
};

export default connect(mapStateToProps, { GetCustomers, updateObjectState })(PurchaseOrderInfo);
