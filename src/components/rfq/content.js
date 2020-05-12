import React from "react";
import { connect, useDispatch } from "react-redux";
import { Table, Input, InputNumber, Button, Divider } from "antd";
import { updateRFQItems, addRfqItem } from "../../actions/rfq_actions";

const EditableCell = ({ fix, dataIndex, title, inputType, record, index, children, ...restProps }) => {
  const dispatch = useDispatch();
  const inputNode =
    inputType === "number" ? (
      <InputNumber
        value={record[dataIndex]}
        onChange={value => {
          dispatch(updateRFQItems(record.seq, dataIndex, value));
        }}
      />
    ) : (
      <Input
        value={record[dataIndex]}
        onChange={e => {
          dispatch(updateRFQItems(record.seq, dataIndex, e.target.value));
        }}
      />
    );
  return <td {...restProps}>{fix ? children : <>{inputNode}</>}</td>;
};

const RFQContent = props => {
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
      title: "版本",
      dataIndex: "version",
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
      title: `单价(${rfq.currency})`,
      dataIndex: "unit_price_foreign",
    },
    {
      title: "小计",
      dataIndex: "total_price",
      fix: true,
    },
    {
      title: "单价(RMB)",
      dataIndex: "unit_price_rmb",
      fix: true,
    },
  ];

  const mergedColumns = columns.map(col => {
    return {
      ...col,
      onCell: record => ({
        record,
        inputType: col.dataIndex === "age" ? "number" : "text",
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
        <Table
          rowKey="seq"
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          dataSource={rfq_items}
          columns={mergedColumns}
          rowClassName="editable-row"
          footer={() => <Button onClick={() => addRfqItem()}>添加图号</Button>}
        />
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

export default connect(mapStateToProps, { updateRFQItems, addRfqItem })(RFQContent);
