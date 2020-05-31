import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Table, Row, Col } from "antd";

const StatisticsPOContent = props => {
  const { variant } = props;
  const [title, setTitle] = useState("下单日期");
  const [columnKey, setColumnKey] = useState("");

  useEffect(() => {
    if (variant === "order_stat") {
      setTitle("下单日期");
      setColumnKey("submit_date");
    } else {
      setTitle("发货日期");
      setColumnKey("shipping_date");
    }
  }, [variant]);

  const { work_orders } = props;
  const columns = [
    // { title: title, dataIndex: columnKey, render: data => <div>{data.split("T")[0]}</div> },
    { title: "大工号", dataIndex: "work_order_num" },
    { title: "厂内交期", dataIndex: "internal_deadline", render: data => <div>{data.split("T")[0]}</div> },
    { title: "项数", render: record => <div>{record.work_order_items.length}</div> },
    {
      title: "金额",
      render: record => <div>{record.work_order_items.reduce((acc, el) => acc + el.total_price, 0)}</div>,
    },
  ];

  return (
    <>
      <Table
        rowKey="_id"
        pagination={false}
        columns={columns}
        dataSource={work_orders}
        footer={() => (
          <Row>
            <Col offset={21} span={3}>
              <div>
                总金额:
                {work_orders &&
                  work_orders.reduce(
                    (acc, el) => acc + el.work_order_items.reduce((accl, ele) => accl + ele.total_price, 0),
                    0
                  )}
              </div>
            </Col>
          </Row>
        )}
      />
    </>
  );
};

const mapStateToProps = ({ POReducer }) => {
  return {
    work_orders: POReducer.work_orders,
  };
};

export default connect(mapStateToProps, null)(StatisticsPOContent);
