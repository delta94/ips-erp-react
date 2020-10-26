import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Form, Input, Table, InputNumber, Button } from "antd";

import { PostSparePartAPI } from "../../../api";
import { openNotification } from "../../../utils/commons";
import { ERROR, INFO } from "../../../utils/constants";

const { Column } = Table;

const FormExample = props => {
  const { workOrder } = props;
  const [form] = Form.useForm();

  useEffect(() => {
    if (workOrder) {
      let part = form.getFieldValue("part");
      if (part === undefined) {
        part = [];
      }
      form.setFieldsValue({
        part: [
          ...part,
          {
            sub_work_order_num: workOrder.sub_work_order_num,
            part_number: workOrder.part_number,
          },
        ],
      });
    }
  }, [workOrder, form]);

  const onFinish = values => {
    const part = values.part.map(el => {
      el.store_type = "pre_store";
      return el;
    });
    PostSparePartAPI(part)
      .then(() => {
        openNotification(INFO, "录入成功");
        form.resetFields();
      })
      .catch(err => openNotification(ERROR, err));
  };

  return (
    <Form form={form} onFinish={onFinish}>
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
                  <Form.Item
                    name={[index, "qty"]}
                    fieldKey={[index, "qty"]}
                    className="mg-bottom-0"
                    rules={[{ required: true, message: `请输入数量` }]}
                  >
                    <InputNumber />
                  </Form.Item>
                )}
              />
              <Column
                dataIndex="unit"
                key="unit"
                title="单位"
                render={(text, record, index) => (
                  <Form.Item
                    name={[index, "unit"]}
                    fieldKey={[index, "unit"]}
                    className="mg-bottom-0"
                    rules={[{ required: true, message: `请输入单位` }]}
                  >
                    <Input />
                  </Form.Item>
                )}
              />
              <Column
                dataIndex="store_number"
                key="store_number"
                title="存放编号"
                render={(text, record, index) => (
                  <Form.Item
                    name={[index, "store_number"]}
                    fieldKey={[index, "store_number"]}
                    className="mg-bottom-0"
                    rules={[{ required: true, message: `请输入存放编号` }]}
                  >
                    <Input />
                  </Form.Item>
                )}
              />
            </Table>
          </>
        )}
      </Form.List>
      <br />
      <Form.Item wrapperCol={{ span: 6 }}>
        <Button htmlType="submit" block type="primary">
          提交
        </Button>
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
