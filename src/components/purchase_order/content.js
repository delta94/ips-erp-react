import React, { useRef } from "react";
import { connect, useDispatch } from "react-redux";
import { Table, Input, InputNumber, Divider, Button, Row, Col } from "antd";

import { UpdateWorkOrderItem, addWorkOrderItem } from "../../actions/po_actions";

const EditableCell = ({ editing, dataIndex, title, inputType, record, index, children, onChange, ...restProps }) => {
  const inputRef = useRef();
  const dispatch = useDispatch();
  if (editing !== undefined) {
    const inputNode =
      inputType === "number" ? (
        <InputNumber
          value={record[dataIndex]}
          ref={inputRef}
          onChange={value => {
            dispatch(UpdateWorkOrderItem(record.sub_work_order_num, dataIndex, value));
            inputRef.current.focus();
          }}
        />
      ) : (
        <Input
          value={record[dataIndex]}
          ref={inputRef}
          onChange={e => {
            dispatch(UpdateWorkOrderItem(record.sub_work_order_num, dataIndex, e.target.value));
            inputRef.current.focus();
          }}
        />
      );
    return <td {...restProps}>{editing ? <>{inputNode}</> : children}</td>;
  } else {
    return <td style={{ paddingLeft: 15 }}>{children}</td>;
  }
};

// rowSelection object indicates the need for row selection
const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, "selectedRows: ", selectedRows);
  },
};

const PurchaseOrderContent = props => {
  // vars from reducer
  const { work_order_items, work_order_created, total_price, editing } = props;

  // methods from action
  const { addWorkOrderItem } = props;

  const columns = [
    {
      title: "小工号",
      dataIndex: "sub_work_order_num",
      width: "28%",
      editable: false,
    },
    {
      title: "图号",
      dataIndex: "part_number",
      width: "29%",
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
      title: "总价",
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
        editing: editing,
      }),
    };
  });

  return (
    <>
      {work_order_created ? (
        <>
          <Divider orientation="left" style={{ color: "#333", fontWeight: "normal" }}>
            订单内容
          </Divider>
          <Table
            rowKey="sub_work_order_num"
            size="small"
            rowSelection={rowSelection}
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
      ) : null}
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
