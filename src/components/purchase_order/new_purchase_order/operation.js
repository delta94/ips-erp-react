import React, { useState } from "react";
import { connect } from "react-redux";
import { Button, Row, Col, Checkbox } from "antd";
import ImportBtn from "../../common/import_btn_antd";

import { PostWorkOrder, uploadFile, PrintLabel, resetState, GetCustomers } from "../../../actions/po_actions";

const NewPOOperation = props => {
  const [printPartNum, setPrintPartNum] = useState(true);
  const { work_order_created } = props;
  const { headerForm, contentForm } = props;
  const { PostWorkOrder, uploadFile, resetState, PrintLabel, GetCustomers } = props;
  return (
    <Row gutter={[16, 16]}>
      <Col span={3}>
        <ImportBtn type="primary" btnText="上传Excel" uploadFile={uploadFile} form={contentForm} />
      </Col>
      <Col span={3}>
        <Button
          block
          type="primary"
          onClick={async () => {
            try {
              await contentForm.validateFields();
              const work_order = await headerForm.validateFields();
              PostWorkOrder(work_order, contentForm);
            } catch (err) {
              console.log(err);
            }
          }}
        >
          提交订单
        </Button>
      </Col>
      <Col span={6}>
        <Row>
          <Col span={12}>
            <Button block type="primary" disabled={!work_order_created} onClick={() => PrintLabel(printPartNum)}>
              打印标签
            </Button>
          </Col>
          <Col span={12} align="center" style={{ alignSelf: "center" }}>
            <Checkbox
              checked={printPartNum}
              onChange={() => setPrintPartNum(!printPartNum)}
              disabled={!work_order_created}
            >
              打印图号
            </Checkbox>
          </Col>
        </Row>
      </Col>
      <Col span={3}>
        <Button
          type="primary"
          block
          // TODO clear the form and reducer
          // need a flag to indicated whether information is already enter
          onClick={async () => {
            try {
              headerForm.resetFields();
              contentForm.resetFields();
              resetState();
              GetCustomers();
              // PostWorkOrder(values);
            } catch (err) {
              console.log(err);
            }
          }}
        >
          新订单
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ POReducer }) => {
  return {
    work_order_created: POReducer.work_order_created,
  };
};

export default connect(mapStateToProps, { PostWorkOrder, uploadFile, PrintLabel, resetState, GetCustomers })(
  NewPOOperation
);
