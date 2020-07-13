import React, { useState, useEffect } from "react";
import {
  Table,
  Input,
  Form,
  Tooltip,
  Button,
  Space,
  Card,
  Modal,
  Row,
  Col,
  Divider,
  Select,
  // DatePicker,
  InputNumber,
} from "antd";
import { EditOutlined, SearchOutlined } from "@ant-design/icons";
import moment from "moment";
import { GetItemsAPI, InsertItemAPI, PatchItemAPI } from "../../../api";
import { openNotification } from "../../../utils/commons";
import { ERROR, SUCCESS } from "../../../utils/constants";

const EditableCell = ({ editing, dataIndex, title, record, index, number, children, ...restProps }) => {
  const inputNode = number ? <InputNumber /> : <Input />;

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
  const [country, setCountry] = useState();
  const [selectedCustomer, setSelectedCustomer] = useState();

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

  const cancel = () => {
    setEditingKey("");
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
      title: "地址",
      dataIndex: "addr",
      width: "48%",
      editable: true,
    },
    {
      title: "结算币种",
      dataIndex: "currency",
      editable: true,
    },
    {
      title: "汇率",
      dataIndex: "rate",
      editable: true,
      number: true,
    },
    {
      title: "操作",
      dataIndex: "operation",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="编辑">
            <Button
              onClick={() => {
                setVisible(true);
                const selectedCustomer = customers.find(el => el._id === record._id);
                setSelectedCustomer(selectedCustomer);
                newCustomerForm.resetFields();
                newCustomerForm.setFieldsValue({ ...selectedCustomer });
              }}
              type="link"
              icon={<EditOutlined />}
            />
          </Tooltip>
        </Space>
        // );
      ),
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
        number: col.number,
      }),
    };
  });

  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
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
          <Button
            type="primary"
            onClick={() => {
              setVisible(true);
              newCustomerForm.resetFields();
            }}
          >
            添加新客户
          </Button>
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
      <Modal
        title="新客户信息"
        visible={visible}
        onCancel={() => setVisible(false)}
        footer={null}
        destroyOnClose
        width="50%"
      >
        <Form
          {...layout}
          name="basic"
          form={newCustomerForm}
          onFinish={async values => {
            if (selectedCustomer) {
              PatchItemAPI(selectedCustomer._id, "customers", { ...values })
                .then(res => {
                  GetCustomers();
                  openNotification(SUCCESS, res);
                  setVisible(false);
                  setSelectedCustomer("");
                  newCustomerForm.resetFields();
                })
                .catch(err => openNotification(ERROR, err));
            } else {
              InsertItemAPI("customers", values)
                .then(res => {
                  GetCustomers();
                  openNotification(SUCCESS, res);
                  setVisible(false);
                  newCustomerForm.resetFields();
                })
                .catch(err => {
                  openNotification(ERROR, err);
                });
            }
          }}
        >
          <Divider orientation="left">基本信息</Divider>
          <Form.Item label="客户代码" name="internal" rules={[{ required: true, message: "请输入客户代号" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="客户名称" name="name" rules={[{ required: true, message: "请输入名称" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="详细地址" name="addr" rules={[{ required: true, message: "请输入地址" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="国家" name="country" rules={[{ required: true, message: "请输入国家" }]}>
            <Input onChange={e => setCountry(e.target.value === "中国" ? false : true)} />
          </Form.Item>
          <Form.Item label="结算币种" name="currency" rules={[{ required: true, message: "请输入结算货币" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="汇率" name="rate" rules={[{ required: true, message: "请输入汇率" }]}>
            <InputNumber />
          </Form.Item>
          <Form.Item label="业务组别" name="bu_group" rules={[{ required: true, message: "请输入业务组别" }]}>
            <Input />
          </Form.Item>
          <Divider orientation="left">收款信息</Divider>
          {/* <Form.Item label="对账日期" name="reconciliation_date">
            <DatePicker className="full-width" />
          </Form.Item> */}
          <Form.Item
            label="收款天数"
            name="reconciliation_days"
            rules={[{ required: true, message: "请输入收款天数" }]}
          >
            <Select>
              <Select.Option value={30}>30</Select.Option>
              <Select.Option value={60}>60</Select.Option>
              <Select.Option value={90}>90</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="是否报关" name="custom" rules={[{ required: true, message: "请选择是否报关" }]}>
            <Select>
              <Select.Option value={true}>报关</Select.Option>
              <Select.Option value={false}>不报关</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="是否开票" name="invoice" rules={[{ required: true, message: "请选择是否开票" }]}>
            <Select>
              <Select.Option value={true}>开票</Select.Option>
              <Select.Option value={false}>不开票</Select.Option>
            </Select>
          </Form.Item>
          <Divider orientation="left">运输信息</Divider>
          <Form.Item
            label="快递公司"
            name="shipping_company"
            rules={[{ required: country, message: "请输入快递公司" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="快递账号"
            name="shipping_account"
            rules={[{ required: country, message: "请输入快递账号" }]}
          >
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
