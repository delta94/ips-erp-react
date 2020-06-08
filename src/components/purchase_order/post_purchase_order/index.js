import React, { useState } from "react";
import { Card, Row, Col, Input, Divider, Table, Button, Space, Form } from "antd";
import { GetItemsPipelineAPI, PatchItemsAPI, UpdateDispatchAPI } from "../../../api";
import { openNotification } from "../../../utils/commons";
import { ERROR, INFO, SUCCESS } from "../../../utils/constants";

const PostPO = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");

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
          includeArrayIndex: "work_order_items.index",
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $match: {
          "work_order_items.sub_work_order_num": sub_work_order_num,
          "work_order_items.shipping_date": "",
        },
      },
      {
        $addFields: {
          "work_order_items._id": "$_id",
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
          openNotification(INFO, "小工号不存在或小工号已出货");
        }
      })
      .catch(err => openNotification(ERROR, err))
      .finally(() => setSearch(""));
  };

  const onFinish = values => {
    const sub_work_order_num = [
      ...new Set(data.map(el => el.sub_work_order_num.slice(0, el.sub_work_order_num.lastIndexOf("-")))),
    ];

    const matchItems = sub_work_order_num.map(el => {
      return { work_order_num: el, index: [], id: "", ...values };
    });

    data.forEach(element => {
      matchItems.forEach(el => {
        if (element.sub_work_order_num.includes(el.work_order_num)) {
          el.index.push(String(element.index));
          el.id = element._id;
          el.shipping_date = new Date().toISOString().split("T")[0];
        }
      });
    });

    UpdateDispatchAPI(matchItems)
      .then(res => openNotification(SUCCESS, res))
      .catch(err => openNotification(ERROR, err));

    // 20200603
    // end up writting specical handler to deal with this
    // const query = JSON.stringify({
    //   $or: matchItems,
    // });

    // PatchItemsAPI("work_orders", query, {
    //   "work_order_items.$[].shipping_num": values.shipping_num,
    //   "work_order_items.$[].invoice_num": values.invoice_num,
    // })
    //   .then(res => openNotification(SUCCESS, res.message))
    //   .catch(err => openNotification(ERROR, err));
    // 20200602
    // end up using work_order_num to match and update
    // 20200601
    // from sub_work_order_num, i can derive the work_order_num and thus
    // get request to backend and get the whole document from db
    // update the fields accordingly and post to backend
  };

  return (
    <Card>
      <Space direction="vertical" className="full-width">
        <Divider orientation="left">出货扫描</Divider>
        <Input.Search
          placeholder="扫描或输入小工号"
          value={search}
          onChange={({ target: { value } }) => setSearch(value)}
          // onSearch={value => GetWorkOrderItem(value)}
          onPressEnter={() => GetWorkOrderItem(search)}
        />
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
