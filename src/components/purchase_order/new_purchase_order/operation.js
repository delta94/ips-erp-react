import React from "react";
import { connect } from "react-redux";
import { Button, Row, Col } from "antd";
import ImportBtn from "../../common/import_btn_antd";

import { PostWorkOrder, uploadFile, PrintLabel, resetState } from "../../../actions/po_actions";

const NewPOOperation = props => {
  const { work_order_created } = props;
  const { headerForm, contentForm } = props;
  const { PostWorkOrder, uploadFile, resetState, PrintLabel } = props;
  return (
    <Row gutter={[16, 16]}>
      <Col span={3}>
        <ImportBtn type="primary" btnText="上传Excel" uploadFile={uploadFile} form={contentForm} />
      </Col>
      <Col span={3}>
        <Button
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
      <Col span={3}>
        <Button type="primary" disabled={!work_order_created} onClick={PrintLabel}>
          打印标签
        </Button>
      </Col>
      <Col span={3}>
        <Button
          type="primary"
          // TODO clear the form and reducer
          // need a flag to indicated whether information is already enter
          onClick={async () => {
            try {
              headerForm.resetFields();
              contentForm.resetFields();
              resetState();
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

export default connect(mapStateToProps, { PostWorkOrder, uploadFile, PrintLabel, resetState })(NewPOOperation);
