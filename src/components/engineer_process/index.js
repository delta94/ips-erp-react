import React, { useEffect, useState } from "react";
import { Card, Input, Table, Row, Col, Divider, Tooltip, Button } from "antd";
import { CheckOutlined } from "@ant-design/icons";
import { GetItemsPipelineAPI, PatchItemsAPI } from "../../api";
import { openNotification } from "../../utils/commons";
import { ERROR, INFO, SUCCESS } from "../../utils/constants";

const EngineerProcess = () => {
  const [unprocess, setUnprocess] = useState([]);
  const [processing, setProcessing] = useState([]);
  const [search, setSearch] = useState();

  const GetSubWorkOrderNum = (match, method) => {
    const query = JSON.stringify([
      {
        $unwind: {
          path: "$work_order_items",
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $match: match,
      },
      {
        $addFields: {
          "work_order_items.submit_date": "$submit_date",
          "work_order_items.internal_deadline": "$internal_deadline",
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
        if (res.data !== null) {
          res.data.forEach(el => {
            el.submit_date = el.submit_date.split("T")[0];
            el.internal_deadline = el.internal_deadline.split("T")[0];
            if (el.remark === "" || el.remark === undefined) {
              el.remark = "待处理";
            }
          });
          method(res.data);
        }
      })
      .catch(err => openNotification(ERROR, err));
  };

  const ProcessSubWorkOrderNum = (value, remark) => {
    PatchItemsAPI("work_orders", JSON.stringify({ "work_order_items.sub_work_order_num": value.trim() }), {
      "work_order_items.$.remark": remark,
    })
      .then(res => {
        openNotification(SUCCESS, res);
        Init();
      })
      .catch(err => openNotification(ERROR, err))
      .finally(() => setSearch(""));
  };

  const Init = () => {
    GetSubWorkOrderNum({ "work_order_items.remark": { $nin: ["取消工号", "正在处理", "完成处理"] } }, setUnprocess);
    GetSubWorkOrderNum({ "work_order_items.remark": { $eq: "正在处理" } }, setProcessing);
  };

  useEffect(() => {
    Init();
  }, []);

  const columns = [
    { title: "下单日期", dataIndex: "submit_date" },
    {
      title: "工号",
      dataIndex: "sub_work_order_num",
      defaultSortOrder: "descend",
      sorter: (a, b) => a.sub_work_order_num.localeCompare(b.sub_work_order_num),
    },
    {
      title: "厂内交期",
      dataIndex: "internal_deadline",
      defaultSortOrder: "descend",
      sorter: (a, b) => a.internal_deadline.localeCompare(b.internal_deadline),
    },
    { title: "状态", dataIndex: "remark" },
  ];

  const processingColumns = [
    ...columns,
    {
      title: "操作",
      render: data => (
        <Tooltip title="完成处理">
          <Button
            type="link"
            icon={<CheckOutlined />}
            onClick={() => {
              ProcessSubWorkOrderNum(data.sub_work_order_num, "完成处理");
            }}
          />
        </Tooltip>
      ),
    },
  ];
  return (
    <Card>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Input.Search
            placeholder="搜索工号"
            onSearch={value => {
              ProcessSubWorkOrderNum(value, "正在处理");
            }}
            onChange={e => setSearch(e.target.value)}
            value={search}
          ></Input.Search>
        </Col>
        <Col span={24}>
          <Divider orientation="left">正在处理</Divider>
          <Table rowKey="sub_work_order_num" pagination={false} columns={processingColumns} dataSource={processing} />
        </Col>
        <Col span={24}>
          <Divider orientation="left">待处理</Divider>
          <Table rowKey="sub_work_order_num" pagination={false} columns={columns} dataSource={unprocess} />
        </Col>
      </Row>
    </Card>
  );
};

export default EngineerProcess;
