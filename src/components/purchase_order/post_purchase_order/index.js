import React, { useState } from "react";
import { Card, Row, Col, Input, Divider, Table, Button, Space, Form } from "antd";
import { GetItemsPipelineAPI } from "../../../api";
import { openNotification } from "../../../utils/commons";
import { ERROR, INFO } from "../../../utils/constants";

const PostPO = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);

  const columns = [
    { title: "序号", render: (text, record, index) => <div>{index + 1}</div> },
    { title: "小工号", dataIndex: "sub_work_order_num" },
    { title: "出货日期", render: () => <div>{new Date().toISOString().split("T")[0]}</div> },
  ];

  const GetWorkOrderItem = sub_work_order_num => {
    const query = JSON.stringify([
      {
        $unwind: {
          path: "$work_order_items",
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $match: {
          "work_order_items.sub_work_order_num": sub_work_order_num,
        },
      },
      {
        $replaceRoot: {
          newRoot: "$work_order_items",
        },
      },
    ]);

    GetItemsPipelineAPI("work_orders", query)
      .then(res => {
        if (res.data !== null) {
          setData([...data, ...res.data]);
        } else {
          openNotification(INFO, "小工号不存在");
        }
      })
      .catch(err => openNotification(ERROR, err));
  };

  const onFinish = values => {
    console.log(values);
    const sub_work_order_num = data.map(el => el.sub_work_order_num);
    console.log(sub_work_order_num);
    // from sub_work_order_num, i can derive the work_order_num and thus
    // get request to backend and get the whole document from db
    // update the fields accordingly and post to backend
  };

  return (
    <Card>
      <Space direction="vertical" className="full-width">
        <Divider orientation="left">出货扫描</Divider>
        <Input.Search placeholder="扫描或输入小工号" onSearch={value => GetWorkOrderItem(value)} />
        <Form form={form} onFinish={onFinish}>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item name="invoice_num" rules={[{ required: true, message: "请输入发票号" }]}>
                <Input placeholder="请输入发票号" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="shipping_num" rules={[{ required: true, message: "请输入运单号" }]}>
                <Input placeholder="请输入运单号" />
              </Form.Item>
            </Col>
          </Row>
          <Table rowKey="sub_work_order_num" columns={columns} pagination={false} dataSource={data} />
          <Form.Item>
            <Button type="primary" htmlType="submit">
              保存
            </Button>
          </Form.Item>
        </Form>
      </Space>
    </Card>
  );
};

export default PostPO;
