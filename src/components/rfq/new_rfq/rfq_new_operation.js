import React from "react";
import { connect } from "react-redux";
import { Divider, Row, Col, Button } from "antd";
import ImportBtn from "../../common/import_btn_antd";

import { uploadFile, PostRFQ, newRFQ } from "../../../actions/rfq_actions";

const RFQOperation = props => {
  const { uploadFile, PostRFQ, newRFQ } = props;
  return (
    <>
      <Divider orientation="left" style={{ color: "#333", fontWeight: "normal" }}>
        操作
      </Divider>
      <Row gutter={16} justify="start">
        <Col>
          <ImportBtn type="primary" btnText="上传Excel" uploadFile={uploadFile} />
        </Col>
        <Col>
          <Button type="primary" onClick={PostRFQ}>
            保存
          </Button>
        </Col>
        <Col>
          <Button type="primary">创建文件夹</Button>
        </Col>
        <Col>
          <Button type="primary" onClick={newRFQ}>
            新报价
          </Button>
        </Col>
      </Row>
    </>
  );
};

export default connect(null, { uploadFile, PostRFQ, newRFQ })(RFQOperation);
