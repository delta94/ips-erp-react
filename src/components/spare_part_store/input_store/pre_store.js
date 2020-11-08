import React, { useEffect, useCallback, useRef, useState } from "react";
import { connect } from "react-redux";
import { Form, Input, Table, InputNumber, Button, Tooltip } from "antd";
import { CheckOutlined } from "@ant-design/icons";
import { GetSparePartAPI, PatchSparePartAPI } from "../../../api";
import { openNotification } from "../../../utils/commons";
import { ERROR, INFO } from "../../../utils/constants";

const { Column } = Table;

const FormExample = () => {
  const [form] = Form.useForm();
  const [refresh, setRefresh] = useState(false);
  const intervalRef = useRef(null);

  const GetSparePart = useCallback(() => {
    GetSparePartAPI("pre_store")
      .then(res => {
        if (res.data === null) {
          form.setFieldsValue({ part: [] });
        } else {
          form.setFieldsValue({ part: res.data });
        }
      })
      .catch(err => openNotification(ERROR, err));
  }, [form]);

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

  return (
    <Form form={form}>
      <Form.List name="part">
        {() => (
          <>
            <Table
              dataSource={form.getFieldValue("part")}
              pagination={false}
              className="table-top-align"
              rowKey="sub_work_order_num"
            >
              <Column dataIndex="sub_work_order_num" key="sub_work_order_num" title="工号" width="30%" />
              <Column dataIndex="part_number" key="part_number" title="图号" width="30%" />
              <Column
                dataIndex="qty"
                key="qty"
                title="数量"
                render={(text, record, index) => (
                  <Form.Item name={[index, "qty"]} fieldKey={[index, "qty"]} className="mg-bottom-0">
                    <InputNumber id={[index, "qty", "pre"]} />
                  </Form.Item>
                )}
              />
              <Column
                dataIndex="unit"
                key="unit"
                title="单位"
                render={(text, record, index) => (
                  <Form.Item name={[index, "unit"]} fieldKey={[index, "unit"]} className="mg-bottom-0">
                    <Input id={[index, "unit", "pre"]} />
                  </Form.Item>
                )}
              />
              <Column
                // dataIndex="unit"
                // key="unit"
                title="入库"
                render={(text, record, index) => (
                  <Tooltip title="入库">
                    <Button
                      onClick={() => {
                        // 1. make a copy of ojb
                        // 2. remove the mongo _id field since the obj will be
                        // parse as interface{} in backend and field cannot be remove
                        // there
                        // 3. add the type and date
                        const params = JSON.parse(JSON.stringify(text));
                        delete params["_id"];
                        params.store_type = "in_store";
                        params.date = new Date().toISOString().split("T")[0];
                        PatchSparePartAPI(record._id, params)
                          .then(res => {
                            GetSparePart();
                            openNotification(INFO, res);
                          })
                          .catch(err => openNotification(ERROR, err));
                      }}
                      type="link"
                      icon={<CheckOutlined />}
                    />
                  </Tooltip>
                )}
              />
            </Table>
          </>
        )}
      </Form.List>
      <br />
      <Form.Item wrapperCol={{ span: 6 }}>
        {refresh ? (
          <Button type="primary" block onClick={start}>
            继续刷新
          </Button>
        ) : (
          <Button type="primary" block onClick={stop}>
            停止刷新
          </Button>
        )}
      </Form.Item>
    </Form>
  );
};

const mapStateToProps = ({ CraftScheduleReducer }) => {
  return {
    crafts: CraftScheduleReducer.crafts,
  };
};

export default connect(mapStateToProps, null)(FormExample);
