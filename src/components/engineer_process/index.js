import React, { useEffect, useState, useCallback } from "react";
import { connect } from "react-redux";
import { Card, Input, Table, Row, Col, Divider, Tooltip, Button } from "antd";
import { CheckOutlined } from "@ant-design/icons";
import { GetItemsPipelineAPI, PatchItemsAPI } from "../../api";
import { openNotification } from "../../utils/commons";
import { ERROR, SUCCESS } from "../../utils/constants";

const EngineerProcess = props => {
  // username from header reducer
  const { username } = props;

  // local states
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
          method([...res.data]);
        } else {
          method([]);
        }
      })
      .catch(err => openNotification(ERROR, err));
  };

  const FinishSubWorkOrderNum = (data, username, remark) => {
    PatchItemsAPI(
      "work_orders",
      JSON.stringify({ "work_order_items.sub_work_order_num": data.sub_work_order_num.trim() }),
      {
        "work_order_items.$.remark": remark,
        "work_order_items.$.film": data.film,
        "work_order_items.$.process_by": username,
        "work_order_items.$.process_date": new Date().toISOString(),
      }
    )
      .then(res => {
        openNotification(SUCCESS, res);
        Init();
      })
      .catch(err => openNotification(ERROR, err))
      .finally(() => setSearch(""));
  };

  const ProcessSubWorkOrderNum = (data, remark) => {
    PatchItemsAPI("work_orders", JSON.stringify({ "work_order_items.sub_work_order_num": data.trim() }), {
      "work_order_items.$.remark": remark,
    })
      .then(res => {
        openNotification(SUCCESS, res);
        Init();
      })
      .catch(err => openNotification(ERROR, err))
      .finally(() => setSearch(""));
  };

  const Init = useCallback(() => {
    GetSubWorkOrderNum({ "work_order_items.remark": { $nin: ["取消工号", "正在处理", "完成处理"] } }, setUnprocess);
    GetSubWorkOrderNum({ "work_order_items.remark": { $eq: "正在处理" } }, setProcessing);
  }, [setProcessing, setUnprocess]);

  useEffect(() => {
    Init();
  }, [Init]);

  const columns = [
    { title: "下单日期", dataIndex: "submit_date" },
    {
      title: "工号",
      dataIndex: "sub_work_order_num",
      sorter: (a, b) => a.sub_work_order_num.localeCompare(b.sub_work_order_num),
    },
    {
      title: "厂内交期",
      dataIndex: "internal_deadline",
      sorter: (a, b) => a.internal_deadline.localeCompare(b.internal_deadline),
    },
    { title: "状态", dataIndex: "remark" },
  ];

  const processingColumns = [
    ...columns,
    ...[
      {
        title: "胶片号",
        dataIndex: "film",
        render: (data, record) => (
          <Input
            value={data}
            onChange={e => {
              const itemIndex = processing.findIndex(el => el.sub_work_order_num === record.sub_work_order_num);
              processing[itemIndex].film = e.target.value;
              setProcessing([...processing]);
            }}
          />
        ),
      },
      {
        title: "操作",
        render: data => (
          <Tooltip title="完成处理">
            <Button
              type="link"
              icon={<CheckOutlined />}
              onClick={() => {
                // console.log(data);
                // FinishSubWorkOrderNum(data.sub_work_order_num, "完成处理");
                FinishSubWorkOrderNum(data, username, "完成处理");
              }}
            />
          </Tooltip>
        ),
      },
    ],
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

const mapStateToProps = ({ HeaderReducer }) => {
  return {
    username: HeaderReducer.username,
  };
};

export default connect(mapStateToProps, null)(EngineerProcess);
