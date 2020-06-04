import React from "react";
import { connect, useDispatch } from "react-redux";
import { Table, Input, InputNumber, Divider, Button, Row, Col, Form } from "antd";

import { UpdateWorkOrderItem, addWorkOrderItem } from "../../../actions/po_actions";

const EditableCell = ({ editable, dataIndex, title, inputType, record, index, children, onChange, ...restProps }) => {
  const dispatch = useDispatch();
  if (editable !== undefined) {
    const inputNode =
      inputType === "number" ? (
        <Form.Item
          name={`${record.sub_work_order_num}-${dataIndex}`}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `请输入 ${title}!`,
            },
          ]}
        >
          <InputNumber
            value={record[dataIndex]}
            onChange={value => {
              dispatch(UpdateWorkOrderItem(record.sub_work_order_num, dataIndex, value));
            }}
          />
        </Form.Item>
      ) : (
        <Form.Item
          name={`${record.sub_work_order_num}-${dataIndex}`}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `请输入 ${title}!`,
            },
          ]}
        >
          <Input
            value={record[dataIndex]}
            onChange={e => {
              dispatch(UpdateWorkOrderItem(record.sub_work_order_num, dataIndex, e.target.value));
            }}
          />
        </Form.Item>
      );
    return <td {...restProps}>{editable ? <>{inputNode}</> : children}</td>;
  } else {
    return <td {...restProps}>{children}</td>;
  }
};

const PurchaseOrderContent = props => {
  // vars from reducer
  const { work_order_items, work_order_created, total_price } = props;

  // methods from action
  const { addWorkOrderItem } = props;

  const columns = [
    {
      title: "序号",
      width: "5%",
      render: (data, record, index) => <div>{index + 1}</div>,
      editable: false,
    },
    {
      title: "图号",
      dataIndex: "part_number",
      width: "35%",
      editable: true,
    },
    {
      title: "数量",
      dataIndex: "qty",
      width: "10%",
      editable: true,
    },
    {
      title: "单位",
      dataIndex: "unit",
      width: "10%",
      editable: true,
    },
    {
      title: "单价",
      dataIndex: "unit_price",
      width: "10%",
      editable: true,
    },
    {
      title: "小计",
      dataIndex: "total_price",
      width: "10%",
      editable: false,
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
        inputType: col.dataIndex === "qty" || col.dataIndex === "unit_price" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editable: col.editable,
      }),
    };
  });

  return (
    <>
      <Divider orientation="left" style={{ color: "#333", fontWeight: "normal" }}>
        订单内容
      </Divider>
      <Table
        pagination={false}
        rowKey="sub_work_order_num"
        size="small"
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        bordered
        dataSource={work_order_items}
        columns={mergedColumns}
        rowClassName="editable-row"
        footer={() => (
          <Row justify="space-between" align="middle">
            <Col>
              <Button onClick={addWorkOrderItem}>添加小工号</Button>
            </Col>
            <Col>
              <div>总金额: {total_price}</div>
            </Col>
          </Row>
        )}
      />
    </>
  );
};

const mapStateToProps = ({ POReducer }) => {
  return {
    work_order_items: POReducer.work_order_items,
    work_order_created: POReducer.work_order_created,
    total_price: POReducer.total_price,
    editing: POReducer.editing,
  };
};

export default connect(mapStateToProps, { addWorkOrderItem, UpdateWorkOrderItem })(PurchaseOrderContent);
