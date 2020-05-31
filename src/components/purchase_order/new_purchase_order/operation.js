import React from "react";
import { connect } from "react-redux";
import { Button, Row, Col } from "antd";
import ImportBtn from "../../common/import_btn_antd";

import { PostWorkOrder, InsertWorkOrderItems, uploadFile, PrintLabel } from "../../../actions/po_actions";

const NewPOOperation = props => {
  const { headerForm, contentForm } = props;
  const { PostWorkOrder, InsertWorkOrderItems, uploadFile } = props;
  return (
    <Row gutter={[16, 16]}>
      <Col span={3}>
        <ImportBtn btnText="上传Excel" uploadFile={uploadFile} form={contentForm} />
      </Col>
      <Col span={3}>
        <Button onClick={PrintLabel}>打印标签</Button>
      </Col>
      <Col span={3}>
        <Button
          onClick={async () => {
            try {
              await contentForm.validateFields();
              InsertWorkOrderItems();
            } catch (err) {
              console.log(err);
            }
          }}
        >
          提交订单
        </Button>
      </Col>
      <Col span={3}>
        <Button
          // TODO clear the form and reducer
          // need a flag to indicated whether information is already enter
          onClick={async () => {
            try {
              const values = await headerForm.validateFields();
              PostWorkOrder(values);
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

export default connect(null, { PostWorkOrder, InsertWorkOrderItems, uploadFile, PrintLabel })(NewPOOperation);
