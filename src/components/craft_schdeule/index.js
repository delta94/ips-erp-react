import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Card, Row, Col, Input, Descriptions, Select, Form, Button, InputNumber, Table } from "antd";
import { GetItemsPipelineAPI, GetSpareNumAPI } from "../../api";
import {
  GetMaterials,
  updateSelectMaterial,
  updateState,
  GetCrafts,
  clickCalWorkHour,
  clickSubmitCraftSchedule,
} from "../../actions/craft_schedule_actions";
import { openNotification } from "../../utils/commons";
import { ERROR, INFO } from "../../utils/constants";
import CraftList from "./craft_list";
import PrintForm from "./print_form";

const CraftSchedule = props => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [sorted, setSorted] = useState(false);
  const [search, setSearch] = useState("");
  const [sparePartNum, setSparePartNum] = useState("");
  const [workOrder, setWorkOrder] = useState({ work_order_items: { qty: "" }, internal_deadline: "" });
  const {
    GetMaterials,
    updateSelectMaterial,
    updateState,
    GetCrafts,
    clickCalWorkHour,
    clickSubmitCraftSchedule,
  } = props;

  const { materials, selected_material, dimension, qty, crafts } = props;

  const [form] = Form.useForm();

  const resetUseState = () => {
    setSelectedRowKeys([]);
    setSelectedRows([]);
    setSorted(false);
    setSearch("");
    setWorkOrder({ work_order_items: { qty: "" }, internal_deadline: "" });
    form.resetFields();
  };

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
        },
      },
    ]);

    GetItemsPipelineAPI("work_orders", query)
      .then(res => {
        if (res.data !== null) {
          setWorkOrder(res.data[0]);
          const partNumber = res.data[0].work_order_items.part_number;
          GetSpareNumAPI(partNumber)
            .then(res => setSparePartNum(res.data))
            .catch(err => openNotification(ERROR, err));
        } else {
          openNotification(INFO, "工号不存在");
        }
      })
      .catch(err => openNotification(ERROR, err));
  };

  useEffect(() => {
    GetMaterials();
  }, [GetMaterials]);

  const columns = [
    { title: "加工部门", dataIndex: "department" },
    { title: "工艺描述", dataIndex: "description" },
  ];

  // rowSelection object indicates the need for row selection
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      // console.log(`selectedRowKeys: ${selectedRowKeys}`, "selectedRows: ", selectedRows);
      setSelectedRows(selectedRows);
      setSelectedRowKeys(selectedRowKeys);
    },
    selectedRowKeys: selectedRowKeys,
  };

  return (
    <Card>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Input.Search
            placeholder="扫描工号"
            value={search}
            onChange={({ target: { value } }) => setSearch(value)}
            onPressEnter={() => GetWorkOrderItem(search)}
          />
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={4} style={{ borderRight: "1px solid black" }}>
          <Descriptions title="工号信息" column={1}>
            <Descriptions.Item label="数量">{workOrder.work_order_items.qty}</Descriptions.Item>
            <Descriptions.Item label="厂内交期">{workOrder.internal_deadline.split("T")[0]}</Descriptions.Item>
            <Descriptions.Item label="图号">{workOrder.work_order_items.part_number}</Descriptions.Item>
            <Descriptions.Item label="工程人员">{workOrder.work_order_items.process_by}</Descriptions.Item>
            <Descriptions.Item label="库存数量">{sparePartNum}</Descriptions.Item>
            <Descriptions.Item label="过往加工记录"></Descriptions.Item>
          </Descriptions>
        </Col>
        <Col span={20}>
          <Form>
            <Row gutter={16}>
              <Col span={6}>
                <Form.Item>
                  <Select placeholder="加工材料" onChange={updateSelectMaterial}>
                    {materials.map(el => (
                      <Select.Option key={el.id} value={el.id}>
                        {el.category} - {el.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item>
                  {selected_material ? (
                    <Select value={selected_material.hardness}></Select>
                  ) : (
                    <Select placeholder="硬度"></Select>
                  )}
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item>
                  <Input
                    placeholder="备料尺寸 (长x宽x高)"
                    value={dimension}
                    onChange={e => updateState("dimension", e.target.value)}
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item>
                  <InputNumber
                    // className="full-width"
                    style={{ width: "100%" }}
                    placeholder="备料数量"
                    value={qty}
                    onChange={value => updateState("qty", value)}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <Form form={form}>
            <Row gutter={[16, 16]} justify="space-around" style={{ borderBottom: "1px solid black" }}>
              <Col>
                <Button
                  type="primary"
                  onClick={() => {
                    updateState("crafts", selectedRows);
                    setSelectedRowKeys([]);
                    setSorted(true);
                  }}
                >
                  排序
                </Button>
              </Col>
              <Col>
                <Button
                  type="primary"
                  onClick={() => {
                    GetCrafts(selected_material.category);
                    setSorted(false);
                  }}
                >
                  重新选择
                </Button>
              </Col>
              <Col>
                <Button type="primary" onClick={() => clickCalWorkHour(workOrder, form)}>
                  计算
                </Button>
              </Col>
              <Col>
                <Button type="primary" onClick={() => clickSubmitCraftSchedule(workOrder, resetUseState)}>
                  保存
                </Button>
              </Col>
              <Col>
                {/* <Button type="primary">打印</Button> */}
                <PrintForm workOrder={workOrder} />
              </Col>
            </Row>
          </Form>
          <Row>
            <Col span={24}>
              {sorted ? (
                <CraftList form={form} workOrder={workOrder} />
              ) : (
                <Table
                  rowKey="id"
                  columns={columns}
                  rowSelection={rowSelection}
                  dataSource={crafts}
                  pagination={false}
                />
              )}
            </Col>
          </Row>
        </Col>
      </Row>
    </Card>
  );
};

const mapStateToProps = ({ CraftScheduleReducer }) => {
  return {
    materials: CraftScheduleReducer.materials,
    selected_material: CraftScheduleReducer.selected_material,
    dimension: CraftScheduleReducer.dimension,
    qty: CraftScheduleReducer.qty,
    crafts: CraftScheduleReducer.crafts,
  };
};

export default connect(mapStateToProps, {
  GetMaterials,
  updateSelectMaterial,
  updateState,
  GetCrafts,
  clickCalWorkHour,
  clickSubmitCraftSchedule,
})(CraftSchedule);
