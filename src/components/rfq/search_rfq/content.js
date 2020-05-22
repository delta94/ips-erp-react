import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Table, Divider, Col, Row } from "antd";

const RFQContent = props => {
  const [items, setItems] = useState([]);
  // vars from reducers
  const { rfqs, query_type } = props;

  useEffect(() => {
    if (rfqs !== null) {
      // setRfq(rfqs[0]);
      // setItems(rfqs[0].rfq_items);
      if (query_type === "email_rfq_num") {
        let i = rfqs.map(item => {
          return item.rfq_items.map(el => {
            el.email_rfq_date = item.email_rfq_date.split("T")[0];
            el.email_rfq_num = item.email_rfq_num;
            // el.currency = item.currency;
            el.unit_price_foreign = `${el.unit_price_foreign} ${item.currency}`;
            return el;
          });
        });
        i = i.flat();
        setItems(i);
      } else {
        let i = rfqs.map(item => {
          item.rfq_items.email_rfq_date = item.email_rfq_date.split("T")[0];
          item.rfq_items.email_rfq_num = item.email_rfq_num;
          item.rfq_items.unit_price_foreign = `${item.rfq_items.unit_price_foreign} ${item.currency}`;
          return item.rfq_items;
        });
        setItems([...i]);
      }
    }
    return () => {
      setItems([]);
    };
  }, [rfqs, setItems]);

  // methods from actions

  const columns = [
    {
      title: "日期",
      dataIndex: "email_rfq_date",
      // render: () => <div>{rfq.email_rfq_date.split("T")[0]}</div>,
    },
    {
      title: "邮件/RFQ",
      dataIndex: "email_rfq_num",
      // render: () => <div>{rfq.email_rfq_num}</div>,
    },
    {
      title: "图号",
      dataIndex: "part_number",
    },
    {
      title: "数量",
      dataIndex: "qty",
    },
    {
      title: `单价(外币)`,
      dataIndex: "unit_price_foreign",
    },
    {
      title: "单价(RMB)",
      dataIndex: "unit_price_rmb",
    },
  ];

  return (
    <>
      <Divider orientation="left" style={{ color: "#333", fontWeight: "normal" }}>
        搜索结果
      </Divider>
      <Table rowKey="seq" bordered dataSource={items} columns={columns} rowClassName="editable-row" />
    </>
  );
};

const mapStateToProps = ({ RFQReducer }) => {
  return {
    rfqs: RFQReducer.rfqs,
    query_type: RFQReducer.query_type,
  };
};

export default connect(mapStateToProps, null)(RFQContent);
