import React from "react";
import { connect, useDispatch } from "react-redux";
import { Table, Input, InputNumber, Form, Button } from "antd";

import { updateArrayObjectState } from "../../actions/craft_schedule_actions";

const EditableCell = ({ editable, dataIndex, title, inputType, record, index, children, onChange, ...restProps }) => {
  const dispatch = useDispatch();
  if (editable !== undefined) {
    const inputNode =
      inputType === "number" ? (
        <Form.Item
          name={`${record.id}-${dataIndex}`}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `请输入 ${title}!`,
            },
          ]}
          initialValue={record[dataIndex]}
        >
          <InputNumber
          // value={record[dataIndex]}
          // onChange={value => {
          //   dispatch(updateArrayObjectState(record.sub_work_order_num, dataIndex, value));
          // }}
          />
        </Form.Item>
      ) : (
        <Form.Item
          name={`${record.id}-${dataIndex}`}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `请输入 ${title}!`,
            },
          ]}
          initialValue={record[dataIndex]}
        >
          <Input
          // value={record[dataIndex]}
          // onChange={e => {
          //   dispatch(updateArrayObjectState(record.sub_work_order_num, dataIndex, e.target.value));
          // }}
          />
        </Form.Item>
      );
    return <td {...restProps}>{editable ? <>{inputNode}</> : children}</td>;
  } else {
    return <td {...restProps}>{children}</td>;
  }
};

const PurchaseOrderContent = props => {
  const [form] = Form.useForm();
  // vars from reducer
  const { crafts } = props;

  const columns = [
    {
      title: "项数",
      dataIndex: "index",
      width: "5%",
      render: (data, record, index) => <div>{index + 1}</div>,
      editable: false,
    },
    {
      title: "加工部门",
      dataIndex: "department",
      width: "10%",
      editable: false,
    },
    {
      title: "工艺描述",
      dataIndex: "description",
      width: "35%",
      editable: true,
    },
    {
      title: "加工数量",
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
      title: "工时",
      dataIndex: "estimate",
      width: "10%",
      editable: true,
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
        inputType: col.dataIndex === "qty" || col.dataIndex === "estimate" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editable: col.editable,
      }),
    };
  });

  return (
    <>
      <Form form={form}>
        <Table
          pagination={false}
          rowKey="id"
          size="small"
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          dataSource={crafts}
          columns={mergedColumns}
          rowClassName="editable-row"
        />
        <Button
          onClick={() => {
            const rows = form.getFieldsValue();
            let arr = [];
            for (let [key, value] of Object.entries(rows)) {
              console.log(key, value);
            }
          }}
        >
          Validate
        </Button>
      </Form>
    </>
  );
};

const mapStateToProps = ({ CraftScheduleReducer }) => {
  return {
    crafts: CraftScheduleReducer.crafts,
  };
};

export default connect(mapStateToProps, null)(PurchaseOrderContent);
