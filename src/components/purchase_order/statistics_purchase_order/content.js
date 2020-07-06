import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Table, Row, Col } from "antd";

const StatisticsPOContent = props => {
  const { variant } = props;

  const { work_orders } = props;

  const totalPrice = () => {
    if (variant === "order_stat") {
      return work_orders.reduce(
        (acc, el) => acc + el.work_order_items.reduce((accl, ele) => accl + ele.total_price, 0),
        0
      );
    } else {
      return work_orders.reduce((acc, el) => acc + el.work_order_items.total_price, 0);
    }
  };

  const submitDateColumns = [
    { title: "下单日期", dataIndex: "submit_date", render: data => <div>{data.split("T")[0]}</div> },
    { title: "系列号", dataIndex: "work_order_num" },
    {
      title: "厂内交期",
      dataIndex: "internal_deadline",
      render: data => <div>{data.split("T")[0]}</div>,
    },
    { title: "项数", render: record => <div>{record.work_order_items.length}</div> },
    {
      title: "金额",
      render: record => <div>{record.work_order_items.reduce((acc, el) => acc + el.total_price, 0)}</div>,
    },
  ];

  const shippingDateColumns = [
    // still split string in case somewhere i forget and use datetime format again
    {
      title: "发货日期",
      render: data => <div>{data.work_order_items.shipping_date && data.work_order_items.shipping_date}</div>,
      // render: data => <div>{data.work_order_items !== null && data.work_order_items.shipping_date.split("T")[0]}</div>,
    },
    { title: "工号", render: data => <div>{data.work_order_items.sub_work_order_num}</div> },
    {
      title: "厂内交期",
      dataIndex: "internal_deadline",
      render: data => <div>{data.split("T")[0]}</div>,
    },
    {
      title: "金额",
      render: record => <div>{record.work_order_items.total_price}</div>,
    },
  ];

  return (
    <>
      <Table
        rowKey="_id"
        pagination={false}
        columns={variant === "order_stat" ? submitDateColumns : shippingDateColumns}
        dataSource={work_orders}
        footer={() => (
          <Row>
            <Col offset={21} span={3}>
              <div>
                总金额:
                {work_orders && totalPrice()}
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
