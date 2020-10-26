import React, { useState, useCallback, useEffect, useRef } from "react";
import { Card, Col, Row, Input, Divider, Table, Button } from "antd";
import { GetSparePartAPI } from "../../../api";
import { openNotification } from "../../../utils/commons";
import { ERROR } from "../../../utils/constants";

const OutStore = () => {
  const [parts, setParts] = useState([]);
  const [orgParts, setOrgParts] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const intervalRef = useRef(null);

  const GetSparePart = useCallback(() => {
    GetSparePartAPI("out_store")
      .then(res => {
        setParts(res.data);
        setOrgParts(res.data);
      })
      .catch(err => openNotification(ERROR, err));
  }, []);

  const start = useCallback(() => {
    if (intervalRef.current !== null) {
      return;
    }
    intervalRef.current = setInterval(() => {
      GetSparePart();
    }, 1000);
    setRefresh(false);
  }, [GetSparePart]);

  const stop = useCallback(() => {
    if (intervalRef.current === null) {
      return;
    }
    clearInterval(intervalRef.current);
    setRefresh(true);
    intervalRef.current = null;
  }, []);

  useEffect(() => {
    start();

    return () => {
      stop();
    };
  }, [start, stop]);

  const columns = [
    { title: "图号", dataIndex: "part_number" },
    { title: "原始工号", dataIndex: "sub_work_order_num" },
    { title: "关联工号", dataIndex: "associate_sub_work_order_num" },
    { title: "数量", dataIndex: "qty" },
    { title: "单位", dataIndex: "unit" },
    { title: "出库日期", dataIndex: "out_date" },
  ];

  return (
    <Card>
      <Row gutter={[16, 16]}>
        <Col span={14}>
          <Input.Search
            placeholder="搜索图号"
            onChange={({ target: { value } }) => {
              if (value === "") {
                start();
              } else {
                stop();
              }
              setParts(orgParts.filter(el => el.part_number.toLowerCase().includes(value.toLowerCase())));
            }}
          />
        </Col>
        <Divider orientation="left">库存列表</Divider>
        <Col span={24}>
          <Table columns={columns} dataSource={parts} rowKey="_id" pagination={false} />
        </Col>
        <Col span={6}>
          {refresh ? (
            <Button type="primary" block onClick={start}>
              继续刷新
            </Button>
          ) : (
            <Button type="primary" block onClick={stop}>
              停止刷新
            </Button>
          )}
        </Col>
      </Row>
    </Card>
  );
};

export default OutStore;
