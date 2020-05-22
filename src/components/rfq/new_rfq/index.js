import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Card, Form } from "antd";
import RFQNewHeader from "./rfq_new_header";
import RFQNewContent from "./rfq_new_content";
import RFQNewOperation from "./rfq_new_operation";

import { resetState } from "../../../actions/rfq_actions";

const RFQNew = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(resetState());
    };
  }, [dispatch]);
  return (
    <Card>
      <RFQNewHeader />
      <RFQNewContent form={form} />
      <RFQNewOperation form={form} />
    </Card>
  );
};

export default RFQNew;
