import React, { useState, useEffect } from "react";
import { Row, Col } from "antd";
import { Table, Tag, Space, Card, Input, Button, Tooltip, Modal, InputNumber } from "antd";
import { Form } from "antd";
import { EditOutlined, DeleteOutlined, SaveOutlined, SearchOutlined } from "@ant-design/icons";

import { openNotification } from "../../../utils/commons";
import { GetItemsAPI, PatchItemAPI, RemoveItemAPI, InsertItemAPI } from "../../../api";
import { ERROR, SUCCESS } from "../../../utils/constants";

const Currency = () => {
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
                let index = currencies.findIndex(s => s._id === data._id);
                data.rate = value;
                currencies[index] = data;
                setCurrencies([...currencies]);
              }}
              onPressEnter={async () => {
                patchCurrency(data);
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
                type="link"
                icon={<EditOutlined />}
                onClick={() => {
                  let index = currencies.findIndex(s => s._id === data._id);
                  data.edit = true;
                  currencies[index] = data;
                  setCurrencies([...currencies]);
                }}
              />
            ) : (
              <Button
                type="link"
                icon={<SaveOutlined />}
                onClick={async () => {
                  patchCurrency(data);
                }}
              />
            )}
          </Tooltip>
          <Tooltip title="删除">
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              onClick={async () => {
                const res = await RemoveItemAPI(data._id, "currencies");
                openNotification(SUCCESS, res.message);
                let newCurrencies = currencies.filter(s => s._id !== data._id);
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

  const GetCurrencies = () => {
    GetItemsAPI("currencies")
      .then(res => {
        res.data.forEach(element => {
          element.edit = false;
        });
        setCurrencies(res.data);
        setOrgCurrencies(res.data);
      })
      .catch(err => console.log(err));
  };

  const patchCurrency = async data => {
    let index = currencies.findIndex(s => s._id === data._id);
    data.edit = false;
    const res = await PatchItemAPI(data._id, "currencies", { rate: data.rate });
    currencies[index] = data;
    openNotification(SUCCESS, res.message);
    setCurrencies([...currencies]);
  };

  useEffect(() => {
    GetCurrencies();
  }, []);
  return (
    <Card>
      <Row gutter={[16, 16]}>
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
      <Table rowKey="_id" columns={columns} dataSource={currencies} />
      <Modal title="新货币信息" visible={visible} onCancel={() => setVisible(false)} footer={null} destroyOnClose>
        <Form
          {...layout}
          name="basic"
          form={form}
          onFinish={async values => {
            const res = await InsertItemAPI("currencies", values);
            if (res) {
              GetCurrencies();
              openNotification(SUCCESS, res.message);
              setVisible(false);
            } else {
              openNotification(ERROR, res.message);
            }
          }}
        >
          <Form.Item label="货币" name="name" rules={[{ required: true, message: "请输入货币名称" }]}>
            <Input />
          </Form.Item>

          <Form.Item label="汇率" name="rate" rules={[{ required: true, message: "请输入汇率" }]}>
            <InputNumber className="full-width" />
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit" block>
              提交
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default Currency;
