import React from "react";
import { connect } from "react-redux";
import { Divider, Descriptions, Row, Col, Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { updateState } from "../../../actions/rfq_actions";

const RFQHeader = props => {
  // vars from reducer
  const { rfq } = props;
  const { updateState } = props;
  return (
    <>
      <Row>
        <Col span={2}>
          <Button block icon={<ArrowLeftOutlined />} onClick={() => updateState("showContent", false)}>
            返回
          </Button>
        </Col>
      </Row>
      <Divider orientation="left" style={{ color: "#333", fontWeight: "normal" }}>
        报价信息
      </Divider>
      <Descriptions>
        <Descriptions.Item label="客户代码">{rfq.customer}</Descriptions.Item>
        <Descriptions.Item label="邮件/RFQ">{rfq.email_rfq_num}</Descriptions.Item>
        <Descriptions.Item label="姓名">{rfq.customer_name}</Descriptions.Item>
        <Descriptions.Item label="报价单号">{rfq.rfq_num}</Descriptions.Item>
        <Descriptions.Item label="交期不含运输">{rfq.delivery_date}</Descriptions.Item>
      </Descriptions>
    </>
  );
};

const mapStateToProps = ({ RFQReducer }) => ({
  rfq: RFQReducer.rfq,
});

export default connect(mapStateToProps, { updateState })(RFQHeader);
