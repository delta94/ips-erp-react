import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Form, Input, Table, InputNumber, Button } from "antd";

const { Column } = Table;

const FormExample = props => {
  // const [form] = Form.useForm();

  const { form } = props;

  const { crafts } = props;

  useEffect(() => {
    form.setFieldsValue({ crafts: crafts });
  }, [crafts]);

  // const onFinish = values => {
  //   console.log("form values", values);
  // };

  return (
    // <Form form={form} onFinish={onFinish}>
    <Form.List name="crafts">
      {() => (
        <>
          <Table dataSource={form.getFieldValue("crafts")} pagination={false} rowKey="id" className="table-top-align">
            <Column title="项数" render={(text, record, index) => <div>{index + 1}</div>} width="10%" />
            <Column dataIndex="department" key="department" title="加工部门" width="15%" />
            <Column
              dataIndex="description"
              key="description"
              title="工艺描述"
              width="30%"
              render={(text, record, index) => (
                <Form.Item name={[index, "description"]} fieldKey={[index, "description"]} className="mg-bottom-0">
                  <Input.TextArea />
                </Form.Item>
              )}
            />
            <Column
              dataIndex="qty"
              key="qty"
              title="加工数量"
              render={(text, record, index) => (
                <Form.Item name={[index, "qty"]} fieldKey={[index, "qty"]} className="mg-bottom-0">
                  <InputNumber />
                </Form.Item>
              )}
            />
            <Column
              dataIndex="unit"
              key="unit"
              title="单位"
              render={(text, record, index) => (
                <Form.Item name={[index, "unit"]} fieldKey={[index, "unit"]} className="mg-bottom-0">
                  <Input />
                </Form.Item>
              )}
            />
            <Column
              dataIndex="estimate"
              key="estimate"
              title="工时"
              render={(text, record, index) => (
                <Form.Item name={[index, "estimate"]} fieldKey={[index, "estimate"]} className="mg-bottom-0">
                  <InputNumber />
                </Form.Item>
              )}
            />
            <Column
              dataIndex="start_time"
              key="start_time"
              title="开始时间"
              render={(text, record, index) => (
                <Form.Item name={[index, "start_time"]} fieldKey={[index, "start_time"]} className="mg-bottom-0">
                  <Input />
                </Form.Item>
              )}
            />
            <Column
              dataIndex="end_time"
              key="end_time"
              title="结束时间"
              render={(text, record, index) => (
                <Form.Item name={[index, "end_time"]} fieldKey={[index, "end_time"]} className="mg-bottom-0">
                  <Input />
                </Form.Item>
              )}
            />
          </Table>
        </>
      )}
    </Form.List>

    // <Button type="primary" onClick={() => console.log(form.getFieldsValue())}>
    //   Print form state
    // </Button>
    // </Form>
  );
};

const mapStateToProps = ({ CraftScheduleReducer }) => {
  return {
    crafts: CraftScheduleReducer.crafts,
  };
};

export default connect(mapStateToProps, null)(FormExample);
