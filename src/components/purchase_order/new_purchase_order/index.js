import React from "react";
import { Form, Card } from "antd";
import moment from "moment";
import NewPOHeader from "./header";
import NewPOContent from "./content";
import NewPOOperation from "./operation";

const NewPO = () => {
  const [headerForm] = Form.useForm();
  const [contentForm] = Form.useForm();
  return (
    <Card>
      <Form
        // layout="inline"
        form={headerForm}
        initialValues={{
          submit_date: moment(),
        }}
        onValuesChange={changedValue => {
          if (changedValue.customer_deadline) {
            headerForm.setFieldsValue({ internal_deadline: moment(changedValue.customer_deadline).add(-7, "days") });
          }
        }}
      >
        <NewPOHeader />
      </Form>
      <Form form={contentForm}>
        <NewPOContent />
      </Form>
      <NewPOOperation headerForm={headerForm} contentForm={contentForm} />
    </Card>
  );
};

export default NewPO;
