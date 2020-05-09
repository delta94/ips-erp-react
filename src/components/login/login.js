import React, { useState } from "react";
import { connect } from "react-redux";
import { PostLogin, ResetPwd } from "../../actions/login_actions";

import { Form, Input, Button, Card } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

const NormalLoginForm = props => {
  const [reset, setReset] = useState(false);

  // methods from actions
  const { PostLogin, ResetPwd } = props;

  const onFinish = values => {
    if (!reset) {
      PostLogin(values);
    } else {
      ResetPwd(values);
    }
  };

  const layout = {
    wrapperCol: { offset: 6, span: 12 },
  };

  return (
    <Card>
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        {...layout}
      >
        <Form.Item name="username" rules={[{ required: true, message: "请输入用户名!" }]}>
          <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="用户名" />
        </Form.Item>
        {!reset && (
          <Form.Item name="password" rules={[{ required: true, message: "请输入密码!" }]}>
            <Input prefix={<LockOutlined className="site-form-item-icon" />} type="password" placeholder="密码" />
          </Form.Item>
        )}
        <Form.Item>
          <Button type="link" onClick={() => setReset(!reset)}>
            {!reset ? "重置密码" : "返回登录"}
          </Button>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="full-width">
            {!reset ? "登录" : "提交"}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default connect(null, { PostLogin, ResetPwd })(NormalLoginForm);
