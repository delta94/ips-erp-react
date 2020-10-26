import React, { useState, useCallback, useEffect, useRef } from "react";
import { Card, Col, Row, Input, Divider, Table, Button, Tooltip, Modal, Form, InputNumber } from "antd";
import { CheckOutlined } from "@ant-design/icons";
import { GetSparePartAPI, PatchSparePartAPI, PostSparePartAPI } from "../../../api";
import { openNotification } from "../../../utils/commons";
import { ERROR, INFO } from "../../../utils/constants";

const ListStore = () => {
  const [parts, setParts] = useState([]);
  const [orgParts, setOrgParts] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const intervalRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [selectedPart, setSelectedPart] = useState({});
  const [form] = Form.useForm();

  const GetSparePart = useCallback(() => {
    GetSparePartAPI("in_store")
      .then(res => {
        setParts(res.data);
        setOrgParts(res.data);
      })
      .catch(err => openNotification(ERROR, err));
  }, []);

  const start = useCallback(() => {
    if (intervalRef.current !== null) {
      return;
    }
    intervalRef.current = setInterval(() => {
      GetSparePart();
    }, 1000);
    setRefresh(false);
  }, [GetSparePart]);

  const stop = useCallback(() => {
    if (intervalRef.current === null) {
      return;
    }
    clearInterval(intervalRef.current);
    setRefresh(true);
    intervalRef.current = null;
  }, []);

  useEffect(() => {
    start();

    return () => {
      stop();
    };
  }, [start, stop]);

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 8 },
  };
  const tailLayout = {
    wrapperCol: { offset: 8, span: 8 },
  };

  const columns = [
    { title: "图号", dataIndex: "part_number" },
    { title: "工号", dataIndex: "sub_work_order_num" },
    { title: "数量", dataIndex: "qty" },
    { title: "单位", dataIndex: "unit" },
    { title: "入库日期", dataIndex: "date" },
    {
      title: "出库",
      render: (text, record, index) => (
        <Tooltip title="出库">
          <Button
            onClick={() => {
              setVisible(true);
              setSelectedPart(record);
            }}
            type="link"
            icon={<CheckOutlined />}
          />
        </Tooltip>
      ),
    },
  ];

  return (
    <Card>
      <Row gutter={[16, 16]}>
        <Col span={14}>
          <Input.Search
            placeholder="搜索图号"
            onChange={({ target: { value } }) => {
              if (value === "") {
                start();
              } else {
                stop();
              }
              setParts(orgParts.filter(el => el.part_number.toLowerCase().includes(value.toLowerCase())));
            }}
          />
        </Col>
        <Divider orientation="left">库存列表</Divider>
        <Col span={24}>
          <Table columns={columns} dataSource={parts} rowKey="_id" pagination={false} />
        </Col>
        <Col span={6}>
          {refresh ? (
            <Button type="primary" block onClick={start}>
              继续刷新
            </Button>
          ) : (
            <Button type="primary" block onClick={stop}>
              停止刷新
            </Button>
          )}
        </Col>
      </Row>
      <Modal title="出库信息" visible={visible} onCancel={() => setVisible(false)} footer={null} destroyOnClose>
        <Form
          {...layout}
          name="basic"
          form={form}
          onFinish={async values => {
            if (selectedPart.qty - values.qty === 0) {
              const id = selectedPart._id;
              delete selectedPart._id;
              selectedPart.store_type = "out_store";
              selectedPart.associate_sub_work_order_num = values.associate_sub_work_order_num;
              selectedPart.out_date = new Date().toISOString().split("T")[0];
              PatchSparePartAPI(id, selectedPart)
                .then(() => {
                  GetSparePart();
                  openNotification(INFO, "出库成功!");
                  setVisible(false);
                  form.resetFields();
                })
                .catch(err => openNotification(ERROR, err));
            } else {
              let params = JSON.parse(JSON.stringify(selectedPart));
              const id = params._id;
              delete params._id;
              params.qty = selectedPart.qty - values.qty;
              PatchSparePartAPI(id, params)
                .then(() => {
                  params.qty = values.qty;
                  params.associate_sub_work_order_num = values.associate_sub_work_order_num;
                  params.out_date = new Date().toISOString().split("T")[0];
                  params.store_type = "out_store";
                  // need to package params as list []
                  // backend will only handler []interface{}
                  // and the CreateSparePart cannot handler optional parameters
                  PostSparePartAPI([params])
                    .then(() => {
                      openNotification(INFO, "出库成功!");
                      setVisible(false);
                      form.resetFields();
                    })
                    .catch(err => openNotification(ERROR, err));
                })
                .catch(err => openNotification(ERROR, err))
                .finally(() => GetSparePart());
            }
          }}
        >
          <Form.Item
            label="数量"
            name="qty"
            rules={[
              {
                required: true,
                message: "请输入出库数量",
              },
              ({ getFieldValue }) => ({
                validator(rule, value) {
                  if (value <= selectedPart.qty) {
                    return Promise.resolve();
                  }
                  return Promise.reject("出库数量不得大于库存数量");
                },
              }),
            ]}
          >
            <InputNumber />
          </Form.Item>
          <Form.Item
            label="关联工号"
            name="associate_sub_work_order_num"
            rules={[{ required: true, message: "请输入关联工号" }]}
          >
            <Input className="full-width" />
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

export default ListStore;
