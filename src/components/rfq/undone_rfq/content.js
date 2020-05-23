import React, { useEffect } from "react";
import { connect, useDispatch } from "react-redux";
import { Table, Input, InputNumber, Row, Col, Button, Checkbox, Descriptions, Form, message } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import {
  updateRFQItems,
  updateObjectState,
  PatchRFQ,
  updateState,
  GetRFQs,
  MatchRFQPrice,
} from "../../../actions/rfq_actions";

const EditableCell = ({ edit, dataIndex, title, inputType, record, index, children, ...restProps }) => {
  // const inputNode =
  // inputType === "number" ? <InputNumber value={record[dataIndex]} /> : <Input value={record[dataIndex]} />;
  const dispatch = useDispatch();
  const inputNode = () => {
    if (inputType === "checkbox") {
      return (
        <Checkbox
          checked={record[dataIndex]}
          onChange={e => dispatch(updateRFQItems(record.seq, dataIndex, e.target.checked))}
        />
      );
    } else if (inputType === "text") {
      if (record[dataIndex]) {
        return (
          <Input
            disabled={!record.no_price}
            value={record[dataIndex]}
            onChange={e => dispatch(updateRFQItems(record.seq, dataIndex, e.target.value))}
          />
        );
      }
      return (
        <Form.Item
          name={`${record.seq}-${dataIndex}`}
          rules={[{ required: record.no_price, message: "必填" }]}
          style={{ margin: 0 }}
          initialvalue={record[dataIndex]}
        >
          <Input
            disabled={!record.no_price}
            value={record[dataIndex]}
            onChange={e => dispatch(updateRFQItems(record.seq, dataIndex, e.target.value))}
          />
        </Form.Item>
      );
    } else if (inputType === "number") {
      return (
        <InputNumber
          disabled={record.no_price}
          value={record[dataIndex] === 0 ? "" : record[dataIndex]}
          onChange={value => dispatch(updateRFQItems(record.seq, dataIndex, value))}
        />
      );
    }
  };
  return <td {...restProps}>{edit ? <>{inputNode()}</> : children}</td>;
};

const RFQUndoneContent = props => {
  const [form] = Form.useForm();
  const { rfq, rfq_items } = props;
  const { updateObjectState, PatchRFQ, updateState, GetRFQs, MatchRFQPrice } = props;
  const columns = [
    {
      title: "序号",
      dataIndex: "seq",
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
    {
      title: "单价(RMB)",
      dataIndex: "unit_price_rmb",
      variant: "number",
      edit: true,
    },
    {
      title: "不报价",
      dataIndex: "no_price",
      variant: "checkbox",
      edit: true,
    },
    {
      title: "理由",
      dataIndex: "reason",
      variant: "text",
      edit: true,
    },
  ];

  useEffect(() => {
    MatchRFQPrice(
      rfq_items.map(el => el.part_number),
      rfq_items
    );
  }, []);

  const mergedColumns = columns.map(col => {
    return {
      ...col,
      onCell: record => ({
        record,
        // inputType: col.dataIndex === "age" ? "number" : "text",
        inputType: col.variant,
        dataIndex: col.dataIndex,
        title: col.title,
        edit: col.edit,
      }),
    };
  });

  return (
    <>
      {rfq.customer && (
        <>
          <Row>
            <Col offset={22} span={2}>
              <Button
                onClick={() => {
                  updateState("showContent", false);
                  GetRFQs(JSON.stringify({ $or: [{ delivery_date: 0 }, { price_set: false }] }));
                }}
                block
                icon={<ArrowLeftOutlined />}
              >
                返回
              </Button>
            </Col>
          </Row>
          <Descriptions title="报价信息">
            <Descriptions.Item label="客户代码">{rfq.customer}</Descriptions.Item>
            <Descriptions.Item label="邮件/RFQ">{rfq.email_rfq_num}</Descriptions.Item>
            <Descriptions.Item label="交期(不含运输)">
              <InputNumber
                value={rfq.delivery_date === 0 ? "" : rfq.delivery_date}
                onChange={value => updateObjectState("rfq", "delivery_date", value)}
              />
            </Descriptions.Item>
          </Descriptions>
          <Form form={form}>
            <Table
              rowKey="seq"
              pagination={false}
              columns={mergedColumns}
              components={{
                body: {
                  cell: EditableCell,
                },
              }}
              dataSource={rfq_items}
              style={{ paddingBottom: "16px" }}
            />
          </Form>
          <Row gutter={16}>
            <Col>
              <Button
                onClick={() => {
                  const electron = process.env.NODE_ENV !== "development" && window.require("electron");
                  process.env.NODE_ENV !== "development" && electron.shell.openItem(rfq.rfq_folder);
                }}
              >
                打开文件夹
              </Button>
            </Col>
            <Col>
              <Button
                onClick={async () => {
                  try {
                    await form.validateFields();
                    PatchRFQ();
                  } catch (errInfo) {
                    console.log("Validate Failed:", errInfo);
                  }
                }}
              >
                保存
              </Button>
            </Col>
          </Row>
        </>
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

export default connect(mapStateToProps, { updateObjectState, PatchRFQ, updateState, GetRFQs, MatchRFQPrice })(
  RFQUndoneContent
);
