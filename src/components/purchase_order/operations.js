import React, { useState, useRef, useEffect } from "react";
import { connect } from "react-redux";
import { Col, Row, Select, Button, Divider } from "antd";
import ImportBtn from "../common/import_btn_antd";

import {
  PostWorkOrder,
  InsertWorkOrderItems,
  updateState,
  uploadFile,
  PrintLabel,
  GetWorkOrderStates,
  updateObjectState,
} from "../../actions/po_actions";

const { Option } = Select;
const PurchaseOrderOperation = props => {
  const clipboardArea = useRef(null);
  const [clipboard, setClipboard] = useState("");

  const formatExcel = () => {
    const { customer, submit_date, customer_deadline, po_num } = work_order;
    let clipboard = `${customer}\t${submit_date.format("YYYY/MM/DD")}\t${work_order_items[0].sub_work_order_num}\t${
      work_order_items[0].qty
    }\t${work_order_items[0].unit}\t${customer_deadline.format("YYYY/MM/DD")}\t${
      work_order_items[0].unit_price
    }\t${po_num}\t${work_order_items[0].part_number}`;

    const data = work_order_items.slice(1, work_order_items.length);
    data.forEach(element => {
      clipboard += "\n";
      clipboard += `\t\t${element.sub_work_order_num}\t${element.qty}\t${element.unit}\t${customer_deadline.format(
        "YYYY/MM/DD"
      )}\t${element.unit_price}\t${po_num}\t${element.part_number}`;
    });
    setClipboard(clipboard);
    clipboardArea.current.select();
    document.execCommand("copy");
  };

  // vars from reducer
  const { work_order, work_order_items, work_order_states, reedit } = props;

  // methods from actions
  const {
    GetWorkOrderStates,
    PostWorkOrder,
    InsertWorkOrderItems,
    updateState,
    uploadFile,
    PrintLabel,
    updateObjectState,
  } = props;

  useEffect(() => {
    GetWorkOrderStates();
  }, [GetWorkOrderStates]);

  return (
    <>
      <Divider orientation="left" style={{ color: "#333", fontWeight: "normal" }}>
        操作
      </Divider>
      <Row gutter={[16, 16]}>
        <Col flex={1}>
          <ImportBtn type="primary" btnText="上传Excel" uploadFile={uploadFile} />
        </Col>
        <Col flex={1}>
          <Button type="primary" block onClick={() => InsertWorkOrderItems(true)}>
            提交
          </Button>
        </Col>
        <Col flex={1}>
          <Button type="primary" block onClick={() => formatExcel()}>
            复制Excel
          </Button>
        </Col>
        <Col flex={1}>
          <Button type="primary" block onClick={PrintLabel}>
            打印标签
          </Button>
        </Col>
        <Col flex={1}>
          <Button type="primary" block onClick={PostWorkOrder}>
            新订单
          </Button>
        </Col>
        <Col flex={1}>
          <Button
            type="primary"
            block
            onClick={() => {
              updateState("editing", true);
              updateState("reedit", true);
            }}
          >
            修改订单
          </Button>
        </Col>
        <Col flex={2}>
          <Select
            defaultValue="设为"
            className="full-width"
            disabled={!reedit}
            value={work_order.work_order_state}
            onChange={value => updateObjectState("work_order", "work_order_state", value)}
          >
            <Option value="">设为</Option>
            {work_order_states.map(item => (
              <Option value={item.name} key={item._id}>
                {item.name}
              </Option>
            ))}
          </Select>
        </Col>
      </Row>
      <textarea
        style={{ height: 1, width: 1, borderWidth: 0, padding: 0 }}
        ref={clipboardArea}
        value={clipboard}
        readOnly
      />
    </>
  );
};

const mapStateToProps = ({ POReducer }) => {
  return {
    work_order: POReducer.work_order,
    work_order_items: POReducer.work_order_items,
    work_order_states: POReducer.work_order_states,
    reedit: POReducer.reedit,
  };
};

export default connect(mapStateToProps, {
  GetWorkOrderStates,
  PostWorkOrder,
  InsertWorkOrderItems,
  updateState,
  uploadFile,
  PrintLabel,
  updateObjectState,
})(PurchaseOrderOperation);
