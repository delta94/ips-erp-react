import React, { useState } from "react";
import { Card, Row, Col, Input, Divider } from "antd";
import InputStore from "./input_store";
import PreStore from "./pre_store";

import { GetItemsPipelineAPI } from "../../../api";

import { openNotification } from "../../../utils/commons";
import { ERROR, INFO } from "../../../utils/constants";

const SparePartStore = () => {
  const [workOrder, setWorkOrder] = useState();
  const [search, setSearch] = useState();
  const GetWorkOrderItem = sub_work_order_num => {
    const query = JSON.stringify([
      {
        $unwind: {
          path: "$work_order_items",
          includeArrayIndex: "work_order_items.index",
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $match: {
          "work_order_items.sub_work_order_num": sub_work_order_num,
        },
      },
    ]);

    GetItemsPipelineAPI("work_orders", query)
      .then(res => {
        if (res.data !== null) {
          setWorkOrder(res.data[0].work_order_items);
        } else {
          openNotification(INFO, "工号不存在");
        }
      })
      .catch(err => openNotification(ERROR, err));
  };

  return (
    <Card>
      <Row gutter={[16, 16]}>
        <Col span={14}>
          <Input.Search
            placeholder="搜索工号"
            value={search}
            onChange={({ target: { value } }) => setSearch(value)}
            onPressEnter={() => GetWorkOrderItem(search)}
          />
        </Col>
        <Divider orientation="left">备件录入</Divider>
        <Col span={24}>
          <InputStore workOrder={workOrder} />
        </Col>
        <Divider orientation="left">待入库</Divider>
        <Col span={24}>
          <PreStore />
        </Col>
      </Row>
    </Card>
  );
};

export default SparePartStore;
