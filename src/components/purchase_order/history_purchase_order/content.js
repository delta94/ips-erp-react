import React, { useContext, useState, useEffect, useRef } from "react";
import {
  Table,
  Input,
  Button,
  Popconfirm,
  Form,
  Descriptions,
  Divider,
  Space,
  Row,
  Col,
  Select,
  Checkbox,
  InputNumber,
} from "antd";
import { DeleteOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { CSVLink } from "react-csv";
import { connect } from "react-redux";

import {
  GetWorkOrderStates,
  updateWorkOrderItemRemark,
  InsertWorkOrderItems,
  updateObjectState,
  PrintLabel,
  GetWOs,
} from "../../../actions/po_actions";

const EditableContext = React.createContext();

const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditableCell = ({ title, editable, children, dataIndex, record, handleSave, ...restProps }) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef();
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };

  const save = async e => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log("Save failed:", errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} 必填.`,
          },
        ]}
      >
        {dataIndex === "qty" || dataIndex === "unit_price" ? (
          <InputNumber ref={inputRef} onPressEnter={save} onBlur={save} />
        ) : (
          <Input ref={inputRef} onPressEnter={save} onBlur={save} />
        )}
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

// export default class EditableTable extends React.Component {
const EditableTable = props => {
  const { setShowContent } = props;
  const { work_order, work_order_states } = props;
  const {
    GetWorkOrderStates,
    updateWorkOrderItemRemark,
    InsertWorkOrderItems,
    PrintLabel,
    updateObjectState,
    GetWOs,
  } = props;
  const columns = [
    { title: "工号", dataIndex: "sub_work_order_num" },
    { title: "图号", dataIndex: "part_number", editable: true },
    { title: "数量", dataIndex: "qty", editable: true },
    { title: "单位", dataIndex: "unit", editable: true },
    { title: "单价", dataIndex: "unit_price", editable: true },
    { title: "小计", dataIndex: "total_price" },
    { title: "运单号", dataIndex: "shipping_num" },
    { title: "发票号", dataIndex: "invoice_num" },
    { title: "备注", render: record => <div>{record.remark === "继续加工" ? "" : record.remark}</div> },
    {
      title: "操作",
      // dataIndex: "operation",
      render: record =>
        dataSource.length >= 1 ? (
          <Popconfirm title="确定删除?" onConfirm={() => handleDelete(record.sub_work_order_num)}>
            <Button type="link" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        ) : null,
    },
  ];

  const [dataSource, setDataSource] = useState(work_order.work_order_items);
  const [selectedRows, setSelectedRows] = useState([]);
  const [editable, setEditable] = useState(false);
  const [csvData, setCsvData] = useState([]);
  const [printPartNum, setPrintPartNum] = useState(true);

  useEffect(() => {
    setCsvData(generateCSVData());
    GetWorkOrderStates();
    setEditable(work_order.po_num === "欠PO" || editable);
  }, []);

  const generateCSVData = () => {
    let data = work_order.work_order_items.map(el => [
      el.sub_work_order_num,
      el.part_number,
      el.qty,
      el.unit,
      el.unit_price,
    ]);
    data.unshift(["工号", "图号", "数量", "单位", "单价"]);
    return data;
  };

  const handleDelete = sub_work_order_num => {
    const data = dataSource.filter(item => item.sub_work_order_num !== sub_work_order_num);
    setDataSource(data);
    updateObjectState("work_order", "work_order_items", data);
  };

  const handleAdd = () => {
    const dataCopy = [...dataSource];
    const lastItem = dataCopy.slice(-1)[0].sub_work_order_num.split("-");
    const sub_work_order_num = lastItem.slice(0, 2).join("-");
    const lastIndex = parseInt(lastItem[2]) + 1;
    const newData = {
      sub_work_order_num: `${sub_work_order_num}-${lastIndex}`,
      part_number: "",
      qty: 0,
      unit_price: 0,
      unit: "",
      total_price: 0,
    };
    setDataSource([...dataCopy, newData]);
    updateObjectState("work_order", "work_order_items", [...dataCopy, newData]);
  };

  const handleSave = row => {
    let dataCopy = [...dataSource];
    const index = dataCopy.findIndex(item => row.sub_work_order_num === item.sub_work_order_num);
    let item = dataCopy[index];
    item = { ...item, ...row };
    item.total_price = parseFloat(parseFloat(item.qty) * parseFloat(item.unit_price));
    // dataCopy.splice(index, 1, { ...item, ...row });
    dataCopy[index] = item;
    setDataSource([...dataCopy]);
    updateObjectState("work_order", "work_order_items", dataCopy);
  };

  const Info = (
    <>
      <Divider orientation="left">订单信息</Divider>
      <Descriptions column={3}>
        {editable ? (
          <Descriptions.Item label="PO#">
            <Input
              placeholder="欠PO"
              allowClear
              // prefix={<SearchOutlined />}
              value={work_order.po_num}
              onChange={e => {
                updateObjectState("work_order", "po_num", e.target.value);
              }}
            />
          </Descriptions.Item>
        ) : (
          <Descriptions.Item label="PO#">{work_order.po_num}</Descriptions.Item>
        )}
        <Descriptions.Item label="下单日期">{work_order.submit_date.split("T")[0]}</Descriptions.Item>
        <Descriptions.Item label="厂内交期">{work_order.internal_deadline.split("T")[0]}</Descriptions.Item>
        {/* <Descriptions.Item label="运单号">{work_order.shipping_num}</Descriptions.Item>
        <Descriptions.Item label="发票号">{work_order.invoice_num}</Descriptions.Item> */}
      </Descriptions>
    </>
  );

  const backButton = (
    <Row>
      <Col span={2}>
        <Button
          block
          icon={<ArrowLeftOutlined />}
          onClick={() => {
            setShowContent(false);
            GetWOs();
          }}
        >
          返回
        </Button>
      </Col>
    </Row>
  );

  const Ops = (
    <Row gutter={[16, 16]}>
      <Col span={3}>
        <Button type="primary" block onClick={handleAdd}>
          添加工号
        </Button>
      </Col>
      <Col span={3}>
        <CSVLink data={csvData} filename={`${work_order.work_order_num}.csv`}>
          <Button type="primary" block>
            导出Excel
          </Button>
        </CSVLink>
      </Col>
      <Col span={3}>
        <Select
          // type="primary"
          placeholder="设为"
          className="full-width"
          onChange={value => updateWorkOrderItemRemark(work_order, selectedRows, value)}
        >
          {work_order_states.map(item => (
            <Select.Option key={item._id} value={item.name}>
              {item.name}
            </Select.Option>
          ))}
        </Select>
      </Col>
      <Col span={6}>
        <Row>
          <Col span={12}>
            <Button type="primary" onClick={() => PrintLabel(printPartNum, selectedRows)} block>
              打印标签
            </Button>
          </Col>
          <Col span={12} align="center" style={{ alignSelf: "center" }}>
            <Checkbox checked={printPartNum} onChange={() => setPrintPartNum(!printPartNum)}>
              打印图号
            </Checkbox>
          </Col>
        </Row>
      </Col>
      <Col span={3}>
        <Button type="primary" block onClick={InsertWorkOrderItems}>
          保存
        </Button>
      </Col>
    </Row>
  );

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const rowSelection = {
    onChange: selectedRowKeys => {
      setSelectedRows(selectedRowKeys);
    },
  };
  const mergeColumns = columns.map(col => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: record => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave: handleSave,
      }),
    };
  });
  return (
    <Space direction="vertical">
      {/* <Button
        onClick={handleAdd}
        type="primary"
        style={{
          marginBottom: 16,
        }}
      >
        Add a row
      </Button> */}
      {backButton}
      {Info}
      <Table
        rowSelection={rowSelection}
        rowKey="sub_work_order_num"
        components={components}
        // bordered
        dataSource={dataSource}
        columns={mergeColumns}
        pagination={false}
      />
      {Ops}
    </Space>
  );
};

const mapStateToProps = ({ POReducer }) => {
  return {
    work_order: POReducer.work_order,
    work_order_states: POReducer.work_order_states,
  };
};

export default connect(mapStateToProps, {
  GetWorkOrderStates,
  updateWorkOrderItemRemark,
  InsertWorkOrderItems,
  PrintLabel,
  updateObjectState,
  GetWOs,
})(EditableTable);
