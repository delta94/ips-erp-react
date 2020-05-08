import React, { useState, useEffect } from "react";
import { Row, Col } from "antd";
import { Table, Tag, Space, Card, Input, message, Button, Tooltip, notification, Modal, InputNumber } from "antd";
import { Form } from "antd";
import { EditOutlined, DeleteOutlined, SaveOutlined, SearchOutlined } from "@ant-design/icons";

import { GetCurrencyAPI, PatchItemAPI, RemoveItemAPI, InsertItemAPI } from "../../../api";

const Currency = () => {
  const success = () => {
    message.success("This is a success message");
  };

  const openNotification = () => {
    notification.open({
      message: "Notification Title",
      description:
        "This is the content of the notification. This is the content of the notification. This is the content of the notification.",
      onClick: () => {
        console.log("Notification Clicked!");
      },
    });
  };

  const columns = [
    {
      title: "货币",
      dataIndex: "name",
      width: "38%",
    },
    {
      title: "汇率",
      // dataIndex: "rate",
      width: "37%",
      render: data => (
        <>
          {data.edit ? (
            <InputNumber
              className="full-width"
              value={data.rate}
              onChange={value => {
                let index = currencies.findIndex(s => s.id === data.id);
                data.rate = value;
                currencies[index] = data;
                setCurrencies([...currencies]);
              }}
              onPressEnter={async () => {
                let index = currencies.findIndex(s => s.id === data.id);
                data.edit = false;
                const res = await PatchItemAPI(data.id, "currencies", { rate: data.rate });
                console.log(res);
                currencies[index] = data;
                openNotification();
                // success();
                setCurrencies([...currencies]);
              }}
            />
          ) : (
            <Tag color="volcano">{data.rate}</Tag>
          )}
        </>
      ),
    },
    {
      title: "操作",
      key: "action",
      render: data => (
        <Space size="middle">
          <Tooltip title="编辑">
            {!data.edit ? (
              <Button
                type="primary"
                shape="round"
                icon={<EditOutlined />}
                onClick={() => {
                  let index = currencies.findIndex(s => s.id === data.id);
                  data.edit = true;
                  currencies[index] = data;
                  setCurrencies([...currencies]);
                }}
              />
            ) : (
              <Button
                type="primary"
                shape="round"
                icon={<SaveOutlined />}
                onClick={async () => {
                  let index = currencies.findIndex(s => s.id === data.id);
                  data.edit = false;
                  const res = await PatchItemAPI(data.id, "currencies", { rate: parseFloat(data.rate) });
                  console.log(res);
                  currencies[index] = data;
                  setCurrencies([...currencies]);
                }}
              />
            )}
          </Tooltip>
          <Tooltip title="删除">
            <Button
              type="primary"
              danger
              shape="round"
              icon={<DeleteOutlined />}
              onClick={async () => {
                const res = await RemoveItemAPI(data.id, "currencies");
                console.log(res);
                let newCurrencies = currencies.filter(s => s.id !== data.id);
                setCurrencies([...newCurrencies]);
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 8 },
  };
  const tailLayout = {
    wrapperCol: { offset: 8, span: 8 },
  };

  const [orgCurrencies, setOrgCurrencies] = useState([]);
  const [visible, setVisible] = useState(false);
  const [currencies, setCurrencies] = useState([]);
  const [search, setSearch] = useState("");
  const [form] = Form.useForm();

  useEffect(() => {
    GetCurrencyAPI()
      .then(res => {
        res.data.forEach(element => {
          element.edit = false;
        });
        setCurrencies(res.data);
        setOrgCurrencies(res.data);
      })
      .catch(err => console.log(err));
  }, []);
  return (
    <Card>
      <Row gutter={16}>
        <Col span={12}>
          <Input
            placeholder="搜索货币"
            allowClear
            prefix={<SearchOutlined />}
            value={search}
            onChange={e => {
              setSearch(e.target.value);
              let newCurrencies = orgCurrencies.filter(s =>
                s.name.toLowerCase().includes(e.target.value.toLowerCase())
              );
              setCurrencies([...newCurrencies]);
            }}
          />
        </Col>
        <Col span={12}>
          <Button onClick={() => setVisible(true)}>添加新货币</Button>
        </Col>
      </Row>
      <Table rowKey="id" columns={columns} dataSource={currencies} style={{ padding: "16px 0" }} />
      <Modal title="新货币信息" visible={visible} onCancel={() => setVisible(false)} footer={null} destroyOnClose>
        <Form {...layout} name="basic" form={form}>
          <Form.Item label="货币" name="name" rules={[{ required: true, message: "请输入货币名称" }]}>
            <Input />
          </Form.Item>

          <Form.Item label="汇率" name="rate" rules={[{ required: true, message: "请输入汇率" }]}>
            <InputNumber className="full-width" />
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Button
              type="primary"
              htmlType="submit"
              className="full-width"
              onClick={async () => {
                const currency = form.getFieldsValue(["name", "rate"]);
                const res = await InsertItemAPI("currencies", currency);
                if (res) {
                  GetCurrencyAPI()
                    .then(res => {
                      res.data.forEach(element => {
                        element.edit = false;
                      });
                      setCurrencies(res.data);
                      setOrgCurrencies(res.data);
                    })
                    .catch(err => console.log(err));
                  setVisible(false);
                }
              }}
            >
              提交
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default Currency;
