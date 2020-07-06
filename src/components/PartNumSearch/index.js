import React, { useState } from "react";
import { Card, Divider, Row, Col, Input, Table } from "antd";
import { GetItemsPipelineAPI } from "../../api";
import { openNotification } from "../../utils/commons";
import { ERROR, INFO } from "../../utils/constants";

const style = {
  divider: {
    color: "#333",
    fontWeight: "normal",
  },
};

const PartNumSearch = () => {
  const [data, setData] = useState([]);
  const columns = [
    { title: "下单日期", dataIndex: "submit_date" },
    { title: "工号", dataIndex: "sub_work_order_num" },
    { title: "数量", dataIndex: "qty" },
    { title: "单位", dataIndex: "unit" },
    { title: "单价", dataIndex: "unit_price" },
    { title: "发货日期", dataIndex: "shipping_date" },
  ];

  const GetPartNums = value => {
    const query = JSON.stringify([
      {
        $unwind: {
          path: "$work_order_items",
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $match: {
          "work_order_items.part_number": { $regex: value, $options: "$i" },
        },
      },
      {
        $addFields: {
          "work_order_items.submit_date": "$submit_date",
        },
      },
      {
        $replaceRoot: {
          newRoot: "$work_order_items",
        },
      },
    ]);

    GetItemsPipelineAPI("work_orders", query)
      .then(res => {
        if (res.data === null) {
          openNotification(INFO, "搜索不到该图号!");
        } else {
          res.data.forEach(el => (el.submit_date = el.submit_date.split("T")[0]));
          setData(res.data);
        }
      })
      .catch(err => openNotification(ERROR, err));
  };

  return (
    <Card>
      <Divider orientation="left" style={style.divider}>
        搜索图号
      </Divider>
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Input.Search placeholder="图号" onSearch={value => GetPartNums(value)} />
        </Col>
      </Row>
      <Table rowKey="sub_work_order_num" columns={columns} dataSource={data} pagination={false} />
    </Card>
  );
};

export default PartNumSearch;
