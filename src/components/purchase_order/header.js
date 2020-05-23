import React from "react";
import { connect } from "react-redux";
import { Col, Row, Input, Select, Divider } from "antd";

import { updateState, GetWorkOrder } from "../../actions/po_actions";

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
  const { updateState, GetWorkOrder } = props;
  return (
    <>
      <Divider orientation="left" style={style.divider}>
        搜索信息
      </Divider>
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Select
            defaultValue="选择大工号或者PO#"
            value={query_type}
            className="full-width"
            onChange={value => updateState("query_type", value)}
          >
            <Option value="">选择大工号或者PO#</Option>
            <Option value="work_order_num">大工号</Option>
            <Option value="po_num">PO#</Option>
          </Select>
        </Col>
        <Col span={8}>
          <Search onSearch={value => GetWorkOrder(`${query_type}=${value}`)} />
        </Col>
      </Row>
    </>
  );
};

const mapStateToProps = ({ POReducer }) => {
  return {
    query_type: POReducer.query_type,
  };
};

export default connect(mapStateToProps, { updateState, GetWorkOrder })(PurchaseOrderHeader);
