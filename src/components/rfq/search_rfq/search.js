import React from "react";
import { connect } from "react-redux";
import { Col, Row, Input, Select, Divider } from "antd";

import { updateState, GetRFQs, GetRFQsPipeline } from "../../../actions/rfq_actions";

import { GetItemsPipelineAPI } from "../../../api/";

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
  const { updateState, GetRFQs, GetRFQsPipeline } = props;

  const onSearch = value => {
    let query;
    if (query_type === "email_rfq_num") {
      query = JSON.stringify([
        {
          $match: {
            email_rfq_num: { $regex: value, $options: "$i" },
            price_set: true,
            delivery_date: {
              $ne: 0,
            },
          },
        },
      ]);
      GetRFQsPipeline(query);
    } else {
      query = JSON.stringify([
        {
          $unwind: {
            path: "$rfq_items",
            preserveNullAndEmptyArrays: false,
          },
        },
        {
          $match: {
            "rfq_items.part_number": { $regex: value, $options: "$i" },
            price_set: true,
            delivery_date: {
              $ne: 0,
            },
          },
        },
      ]);
      GetRFQsPipeline(query);
    }
  };
  return (
    <>
      <Divider orientation="left" style={style.divider}>
        搜索信息
      </Divider>
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Select
            // defaultValue="选择系列号或者PO#"
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

export default connect(mapStateToProps, { updateState, GetRFQs, GetRFQsPipeline })(PurchaseOrderHeader);
