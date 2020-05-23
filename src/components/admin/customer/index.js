import React, { useState, useEffect } from "react";
import { Table, Input, Form, Tooltip, Button, Space, Card, Modal, Row, Col } from "antd";
import { EditOutlined, DeleteOutlined, UndoOutlined, SaveOutlined, SearchOutlined } from "@ant-design/icons";
import { GetItemsAPI, InsertItemAPI, RemoveItemAPI } from "../../../api";
import { openNotification } from "../../../utils/commons";
import { ERROR, SUCCESS } from "../../../utils/constants";

const EditableCell = ({ editing, dataIndex, title, record, index, children, ...restProps }) => {
  const inputNode = <Input />;

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `请输入 ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const EditableTable = () => {
  const [form] = Form.useForm();
  const [newCustomerForm] = Form.useForm();
  const [editingKey, setEditingKey] = useState("");
  const [customers, setCustomers] = useState([]);
  const [orgCustomers, setOrgCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [visible, setVisible] = useState(false);

  const GetCustomers = () => {
    GetItemsAPI("customers")
      .then(res => {
        setCustomers(res.data);
        setOrgCustomers(res.data);
      })
      .catch(err => console.log(err));
  };

  useEffect(() => {
    GetCustomers();
  }, []);

  const isEditing = record => record._id === editingKey;

  const edit = record => {
    form.setFieldsValue({ name: "", age: "", address: "", ...record });
    setEditingKey(record._id);
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async _id => {
    try {
      const row = await form.validateFields();

      const newData = [...customers];
      const index = newData.findIndex(item => _id === item._id);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setCustomers(newData);
        setEditingKey("");
      } else {
        newData.push(row);
        setCustomers(newData);
        setEditingKey("");
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const columns = [
    {
      title: "客户代码",
      dataIndex: "internal",
    },
    {
      title: "名称",
      dataIndex: "name",
      editable: true,
    },
    {
      title: "结算货币",
      dataIndex: "currency",
      editable: true,
    },
    {
      title: "地址",
      dataIndex: "addr",
      width: "48%",
      editable: true,
    },
    {
      title: "区域",
      dataIndex: "area",
      editable: true,
    },
    {
      title: "操作",
      dataIndex: "operation",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <Space size="small">
            <Tooltip title="保存">
              <Button onClick={() => save(record._id)} type="primary" shape="round" icon={<SaveOutlined />} />
            </Tooltip>
            <Tooltip title="取消">
              <Button onClick={cancel} type="primary" danger shape="round" icon={<UndoOutlined />} />
            </Tooltip>
          </Space>
        ) : (
          <Space size="small">
            <Tooltip title="编辑">
              <Button
                disabled={editingKey !== ""}
                onClick={() => edit(record)}
                type="primary"
                shape="round"
                icon={<EditOutlined />}
              />
            </Tooltip>
            <Tooltip title="删除">
              <Button
                type="primary"
                danger
                shape="round"
                onClick={async () => {
                  const res = await RemoveItemAPI(record._id, "customers");
                  openNotification(SUCCESS, res.message);
                  let newCustomers = customers.filter(s => s._id !== record._id);
                  setCustomers([...newCustomers]);
                }}
                icon={<DeleteOutlined />}
              />
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  const mergedColumns = columns.map(col => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: record => ({
        record,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 8 },
  };
  const tailLayout = {
    wrapperCol: { offset: 8, span: 8 },
  };

  return (
    <Card>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Input
            placeholder="搜索客户"
            allowClear
            prefix={<SearchOutlined />}
            value={search}
            onChange={e => {
              setSearch(e.target.value);
              let newCustomers = orgCustomers.filter(s =>
                s.internal.toLowerCase().includes(e.target.value.toLowerCase())
              );
              setCustomers([...newCustomers]);
            }}
          />
        </Col>
        <Col span={12}>
          <Button onClick={() => setVisible(true)}>添加新客户</Button>
        </Col>
      </Row>
      <Form form={form} component={false}>
        <Table
          rowKey="_id"
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          dataSource={customers}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={{
            onChange: cancel,
          }}
        />
      </Form>
      <Modal title="新客户信息" visible={visible} onCancel={() => setVisible(false)} footer={null} destroyOnClose>
        <Form
          {...layout}
          name="basic"
          form={newCustomerForm}
          onFinish={async values => {
            const res = await InsertItemAPI("customers", values);
            if (res) {
              GetCustomers();
              openNotification(SUCCESS, res.message);
              setVisible(false);
            } else {
              openNotification(ERROR, res.message);
            }
          }}
        >
          <Form.Item label="客户代号" name="internal" rules={[{ required: true, message: "请输入客户代号" }]}>
            <Input />
          </Form.Item>

          <Form.Item label="名称" name="name" rules={[{ required: true, message: "请输入名称" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="结算货币" name="currency" rules={[{ required: true, message: "请输入结算货币" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="地址" name="addr" rules={[{ required: true, message: "请输入地址" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="区域" name="area" rules={[{ required: true, message: "请输入区域" }]}>
            <Input />
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

export default EditableTable;
