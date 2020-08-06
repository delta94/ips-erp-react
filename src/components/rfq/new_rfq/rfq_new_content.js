import React from "react";
import { connect, useDispatch } from "react-redux";
import { Table, Input, InputNumber, Button, Divider, Form } from "antd";
import { addRfqItem, updateRFQItems } from "../../../actions/rfq_actions";

const EditableCell = ({ fix, dataIndex, title, inputType, record, index, children, ...restProps }) => {
  const dispatch = useDispatch();
  const inputNode =
    inputType === "number" ? (
      <Form.Item
        name={`${record.seq}-${dataIndex}`}
        style={{ margin: 0 }}
        rules={[
          {
            required: true,
            message: `请输入 ${title}!`,
          },
        ]}
      >
        <InputNumber
          style={{ width: "100%" }}
          value={record[dataIndex]}
          onChange={value => dispatch(updateRFQItems(record.seq, dataIndex, value))}
        />
      </Form.Item>
    ) : (
      <Form.Item
        name={`${record.seq}-${dataIndex}`}
        style={{ margin: 0 }}
        rules={[
          {
            required: dataIndex !== "remark" && true,
            message: `请输入 ${title}!`,
          },
        ]}
      >
        <Input
          value={record[dataIndex]}
          onChange={e => dispatch(updateRFQItems(record.seq, dataIndex, e.target.value))}
        />
      </Form.Item>
    );
  return <td {...restProps}>{fix ? children : <>{inputNode}</>}</td>;
};

const RFQContent = props => {
  const { form } = props;
  // vars from reducers
  const { rfq, rfq_items } = props;

  // methods from actions
  const { addRfqItem } = props;

  const columns = [
    {
      title: "序号",
      dataIndex: "seq",
      fix: true,
    },
    {
      title: "图号",
      dataIndex: "part_number",
    },
    {
      title: "数量",
      dataIndex: "qty",
    },
    {
      title: "单位",
      dataIndex: "unit",
    },
    {
      title: "备注",
      dataIndex: "remark",
    },
  ];

  const mergedColumns = columns.map(col => {
    return {
      ...col,
      onCell: record => ({
        record,
        inputType: col.dataIndex === "qty" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        fix: col.fix ? true : false,
      }),
    };
  });

  return (
    <>
      <Divider orientation="left" style={{ color: "#333", fontWeight: "normal" }}>
        报价内容
      </Divider>
      {rfq.customer && (
        <Form form={form} component={false}>
          <Table
            rowKey="seq"
            components={{
              body: {
                cell: EditableCell,
              },
            }}
            bordered
            pagination={false}
            dataSource={rfq_items}
            columns={mergedColumns}
            rowClassName="editable-row"
            footer={() => (
              <Button type="primary" onClick={addRfqItem}>
                添加图号
              </Button>
            )}
          />
        </Form>
      )}
    </>
  );
};

const mapStateToProps = ({ RFQReducer }) => {
  return {
    rfq: RFQReducer.rfq,
    rfq_items: RFQReducer.rfq_items,
  };
};

export default connect(mapStateToProps, { addRfqItem })(RFQContent);
