import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Card, Row, Col, Input, Descriptions, Select, Form, Button, InputNumber, Table } from "antd";
import { GetMaterials, updateSelectMaterial, updateState } from "../../actions/craft_schedule_actions";
import List from "./list";
import Tmp from "./tmp";

const CraftSchedule = props => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const { GetMaterials, updateSelectMaterial, updateState } = props;

  const { materials, selected_material, dimension, qty, crafts } = props;

  useEffect(() => {
    GetMaterials();
  }, []);

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
          <Input.Search placeholder="扫描工号"></Input.Search>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={6} style={{ borderRight: "1px solid black" }}>
          <Descriptions title="工号信息" column={1}>
            <Descriptions.Item label="数量">5</Descriptions.Item>
            <Descriptions.Item label="厂内交期">2020-08-30</Descriptions.Item>
            <Descriptions.Item label="图号">A039-430DKSJD-JD239</Descriptions.Item>
            <Descriptions.Item label="工程人员">李某某</Descriptions.Item>
            <Descriptions.Item label="库存数量">20</Descriptions.Item>
            <Descriptions.Item label="过往加工记录"></Descriptions.Item>
          </Descriptions>
        </Col>
        <Col span={18}>
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
          <Row gutter={[16, 16]} justify="space-around" style={{ borderBottom: "1px solid black" }}>
            <Col>
              <Button
                type="primary"
                onClick={() => {
                  updateState("crafts", selectedRows);
                  setSelectedRowKeys([]);
                }}
              >
                排序
              </Button>
            </Col>
            <Col>
              <Button type="primary">重新选择</Button>
            </Col>
            <Col>
              <Button type="primary">计算</Button>
            </Col>
            <Col>
              <Button type="primary">保存</Button>
            </Col>
            <Col>
              <Button type="primary">打印</Button>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Table rowKey="id" columns={columns} rowSelection={rowSelection} dataSource={crafts} />
            </Col>
            <Col span={24}>
              <Tmp />
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

export default connect(mapStateToProps, { GetMaterials, updateSelectMaterial, updateState })(CraftSchedule);
