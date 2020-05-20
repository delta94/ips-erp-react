import React from "react";
import { connect } from "react-redux";
import { Divider, Row, Col, InputNumber, Input, Checkbox } from "antd";
import { updateObjectState, updateRFQ, updateRFQItems } from "../../../actions/rfq_actions";

export const RFQOption = props => {
  // vars from reducer
  const { rfq } = props;

  // methods from actions
  const { updateObjectState, updateRFQ } = props;
  return (
    <>
      <Divider orientation="left">可选信息</Divider>
      <Row gutter={16}>
        <Col offset={6} span={4} align="center">
          <Row gutter={[0, 16]}>
            <Col span={24}>
              <Checkbox
                checked={rfq.shipping_fee_apply}
                onChange={() => updateObjectState("rfq", "shipping_fee_apply", !rfq.shipping_fee_apply)}
              >
                运费
              </Checkbox>
            </Col>
            <Col span={24}>
              <InputNumber
                size="small"
                formatter={value => value && `¥${value}`}
                parser={value => value && value.replace("¥", "")}
                value={rfq.shipping_fee}
                onChange={value => {
                  updateObjectState("rfq", "shipping_fee", value);
                  updateRFQ();
                }}
                disabled={!rfq.shipping_fee_apply}
              />
            </Col>
          </Row>
        </Col>
        <Col span={4} align="center">
          <Row gutter={[0, 16]}>
            <Col span={24}>
              <Checkbox
                checked={rfq.discount_rate_apply}
                onChange={() => updateObjectState("rfq", "discount_rate_apply", !rfq.discount_rate_apply)}
              >
                折扣
              </Checkbox>
            </Col>
            <Col span={24}>
              <InputNumber
                size="small"
                min={0}
                max={100}
                formatter={value => value && `${value}%`}
                parser={value => value && value.replace("%", "")}
                value={rfq.discount_rate}
                onChange={value => {
                  updateObjectState("rfq", "discount_rate", value);
                  updateRFQ();
                }}
                disabled={!rfq.discount_rate_apply}
              />
            </Col>
          </Row>
        </Col>
        <Col span={4} align="center">
          <Row gutter={[0, 16]}>
            <Col span={24}>
              <div>备注</div>
            </Col>
            <Col span={24}>
              <Input
                size="small"
                value={rfq.remark}
                onChange={e => updateObjectState("rfq", "remark", e.target.value)}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
};

const mapStateToProps = ({ RFQReducer }) => {
  return {
    rfq: RFQReducer.rfq,
  };
};

export default connect(mapStateToProps, { updateObjectState, updateRFQ })(RFQOption);
