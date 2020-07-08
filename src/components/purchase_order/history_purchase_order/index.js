import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Col, Row, Input, Select, Divider, Table, Card } from "antd";

import { updateState, GetWOPipeline, resetState, GetWOs } from "../../../actions/po_actions";
import POHistoryContent from "./content";

const { Search } = Input;
const { Option } = Select;

const style = {
  divider: {
    color: "#333",
    fontWeight: "normal",
  },
};

const POHistory = props => {
  const [showContent, setShowContent] = useState(false);
  // vars from reducer
  const { query_type, work_orders } = props;

  // methods from actions
  const { updateState, GetWOPipeline, resetState, GetWOs } = props;
  useEffect(() => {
    GetWOs();
    return () => {
      resetState();
    };
  }, []);

  const GetWO = value => {
    if (query_type !== "") {
      const query = JSON.stringify([
        {
          $match: {
            [query_type]: { $regex: value, $options: "$i" },
          },
        },
      ]);
      GetWOPipeline(query);
    } else {
      GetWOs();
    }
  };
  const columns = [
    {
      title: "系列号",
      dataIndex: "work_order_num",
      sorter: (a, b) => a.work_order_num.localeCompare(b.work_order_num),
      render: (dataIndex, record) => (
        <div
          onClick={() => {
            setShowContent(true);
            updateState("work_order", record);
          }}
          style={{ cursor: "pointer" }}
        >
          {dataIndex}
        </div>
      ),
    },
    {
      title: "PO#",
      dataIndex: "po_num",
      sorter: (a, b) => a.po_num.localeCompare(b.po_num),
    },
    {
      title: "厂内交期",
      dataIndex: "internal_deadline",
      render: dataIndex => <div>{dataIndex.split("T")[0]}</div>,

      sorter: (a, b) => a.internal_deadline.localeCompare(b.internal_deadline),
    },
    {
      title: "出货完成",
      render: record => (
        <div>
          {record.work_order_items.reduce((flag, el) => flag && el.shipping_num !== "", true) ? "完成" : "未完成"}
        </div>
      ),
      // defaultSortOrder: "descend",
      // sorter: (a, b) => a.shipping_num - b.shipping_num,
    },
    // { title: "发票号", dataIndex: "invoice_num" },
    // { title: "运单号", dataIndex: "shipping_num" },
  ];
  return (
    <Card>
      {!showContent ? (
        <>
          <Divider orientation="left" style={style.divider}>
            搜索信息
          </Divider>
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <Select placeholder="请选择" className="full-width" onChange={value => updateState("query_type", value)}>
                <Option value="work_order_num">系列号</Option>
                <Option value="po_num">PO#</Option>
                <Option value="shipping_num">运单号</Option>
                <Option value="invoice_num">发票号</Option>
              </Select>
            </Col>
            <Col span={8}>
              <Search onSearch={value => GetWO(value)} />
            </Col>
          </Row>
          <Table rowKey="_id" dataSource={work_orders} columns={columns} pagination={false} />
        </>
      ) : (
        <>
          <POHistoryContent setShowContent={setShowContent} />
        </>
      )}
    </Card>
  );
};

const mapStateToProps = ({ POReducer }) => {
  return {
    query_type: POReducer.query_type,
    work_orders: POReducer.work_orders,
  };
};

export default connect(mapStateToProps, { updateState, GetWOPipeline, resetState, GetWOs })(POHistory);
