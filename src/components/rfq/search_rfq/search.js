import React from "react";
import { connect } from "react-redux";
import { Col, Row, Input, Select, Divider } from "antd";

import { updateState, GetRFQs } from "../../../actions/rfq_actions";

const { Search } = Input;
const { Option } = Select;

const style = {
  divider: {
    color: "#333",
    fontWeight: "normal",
  },
};

const PurchaseOrderHeader = props => {
  // vars from reducer
  const { query_type } = props;

  // methods from actions
  const { updateState, GetRFQs } = props;

  const onSearch = value => {
    let query;
    if (query_type === "email_rfq_num") {
      query = JSON.stringify({
        email_rfq_num: value,

        delivery_date: { $ne: 0 },
        price_set: true,
      });
    } else {
      query = JSON.stringify({
        rfq_items: { $elemMatch: { part_number: value } },
        delivery_date: { $ne: 0 },
        price_set: true,
      });
    }
    GetRFQs(query);
  };
  return (
    <>
      <Divider orientation="left" style={style.divider}>
        搜索信息
      </Divider>
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Select
            // defaultValue="选择大工号或者PO#"
            // value={query_type}
            placeholder="选择邮件/RFQ或图号"
            className="full-width"
            onChange={value => updateState("query_type", value)}
          >
            <Option value="part_number">图号</Option>
            <Option value="email_rfq_num">邮件/RFQ</Option>
          </Select>
        </Col>
        <Col span={8}>
          <Search onSearch={onSearch} />
        </Col>
      </Row>
    </>
  );
};

const mapStateToProps = ({ RFQReducer }) => {
  return {
    query_type: RFQReducer.query_type,
  };
};

export default connect(mapStateToProps, { updateState, GetRFQs })(PurchaseOrderHeader);
