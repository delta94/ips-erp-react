import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Row, Col, Select, DatePicker, Button, Divider, Form } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { GetCustomers, GetWOs } from "../../../actions/po_actions";
import StatisticsPOContent from "./content";

const StatisticsPOHeader = props => {
  const [form] = Form.useForm();
  const { customers } = props;
  const { GetCustomers, GetWOs } = props;
  const [variant, setVariant] = useState("");

  useEffect(() => {
    GetCustomers();
  }, []);

  const onFinish = values => {
    let query = "";
    if (values.customer !== undefined && values.customer !== "") {
      query += `customer=${values.customer}&`;
    }
    if (values.query_type === "order_stat") {
      query += `submit_date_$gte=${values.date_range[0].toISOString()}&submit_date_$lte=${values.date_range[1].toISOString()}`;
    } else {
      query += `shipping_date_$gte=${values.date_range[0].toISOString()}&shipping_date_$lte=${values.date_range[1].toISOString()}`;
    }
    GetWOs(query);
  };

  return (
    <>
      <Divider orientation="left">查询信息</Divider>
      <Form form={form} onFinish={onFinish}>
        <Row gutter={[16, 16]}>
          <Col span={4}>
            <Form.Item name="customer">
              <Select placeholder="客户代码" className="full-width">
                <Select.Option value="">空</Select.Option>
                {customers.map(item => (
                  <Select.Option key={item._id} value={item.internal}>
                    {item.internal} {item.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={7}>
            <Form.Item name="query_type" rules={[{ required: true, message: "请选择查询类型" }]}>
              <Select
                className="full-width"
                placeholder="请选择下单统计 | 发货统计"
                onChange={value => setVariant(value)}
              >
                <Select.Option value="order_stat">下单统计</Select.Option>
                <Select.Option value="deliver_stat">发货统计</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={7}>
            <Form.Item name="date_range" rules={[{ required: true, message: "请选择开始与结束日期" }]}>
              <DatePicker.RangePicker className="full-width" />
            </Form.Item>
          </Col>
          <Col span={3}>
            <Form.Item>
              <Button block type="primary" icon={<SearchOutlined />} htmlType="submit">
                查询
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <StatisticsPOContent variant={variant} />
    </>
  );
};
const mapStateToProps = ({ POReducer }) => {
  return {
    customers: POReducer.customers,
  };
};

export default connect(mapStateToProps, { GetCustomers, GetWOs })(StatisticsPOHeader);
