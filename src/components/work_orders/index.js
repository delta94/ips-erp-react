import React, { useState, useEffect } from "react";
import { Card, Input, Row, Col, Table } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import moment from "moment";

import { GetWorkOrderAPI } from "../../api";

function NestedTable() {
  const [workOrders, setWorkOrders] = useState([]);
  const [orgData, setOrgData] = useState([]);
  const [search, setSearch] = useState("");
  const GetWorkOrder = expr => {
    GetWorkOrderAPI(`work_order_state=加工中&internal_deadline=${expr}&internal_deadline=${new Date().toISOString()}`)
      .then(res => {
        res.data.forEach(element => {
          element.days = moment(element.internal_deadline).diff(moment(), "days");
        });
        setOrgData(res.data);
        setWorkOrders(res.data);
      })
      .catch(err => console.log(err));
  };

  useEffect(() => {
    GetWorkOrder("$lte");
  }, []);
  const expandedRowRender = props => {
    const columns = [
      { title: "小工号", dataIndex: "sub_work_order_num", key: "sub_work_order_num" },
      // { title: "完成率", dataIndex: "name", key: "name" },
      { title: "当前部门", dataIndex: "current_department", key: "current_department" },
      { title: "状态", dataIndex: "process_state", key: "process_state" },
    ];

    return <Table rowKey="sub_work_order_num" columns={columns} dataSource={props} pagination={false} />;
  };

  const columns = [
    { title: "工号", dataIndex: "work_order_num", key: "work_order_num" },
    {
      title: "厂内交期",
      dataIndex: "internal_deadline",
      key: "internal_deadline",
      render: value => <>{value.split("T")[0]}</>,
    },
    { title: "剩余天数", dataIndex: "days", key: "days" },
  ];

  return (
    <Card>
      <Row>
        <Col offset={12} span={12}>
          <Input
            value={search}
            placeholder="输入大工号"
            suffix={<SearchOutlined style={{ color: "rgba(0,0,0,.45)" }} />}
            onChange={e => {
              setSearch(e.target.value);
              let data = orgData.filter(s => s.work_order_num.toLowerCase().includes(e.target.value.toLowerCase()));
              setWorkOrders([...data]);
            }}
          />
        </Col>
      </Row>
      <Table
        rowKey="id"
        style={{ paddingTop: 10 }}
        pagination={false}
        className="components-table-demo-nested"
        columns={columns}
        expandable={{ expandedRowRender: record => expandedRowRender(record.work_order_items) }}
        dataSource={workOrders}
      />
      {/* <Table
        style={{ paddingTop: 10 }}
        className="components-table-demo-nested"
        columns={columns}
        expandable={{ expandedRowRender }}
        dataSource={data}
      /> */}
    </Card>
  );
}

export default NestedTable;
