import React, { useEffect, useState } from "react";
import { Dropdown, Badge, Menu } from "antd";
import { DownOutlined } from "@ant-design/icons";
import useWebSocket, { ReadyState } from "react-use-websocket";

const Notification = () => {
  const [socketUrl] = useState("ws://192.168.0.54:8080/api/v1/ws");
  const [message, setMessage] = useState({});

  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);

  useEffect(() => {
    if (!readyState) {
      console.log("not connected yet");
    } else {
      console.log("connected");
    }
    console.log(lastMessage);
  }, [lastMessage]);
  const menu = (
    <Menu>
      <Menu.Item key="/admin/currency">
        <Badge count={10}>未完成报价</Badge>
      </Menu.Item>
      <Menu.Item>未完成下单</Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={menu} trigger="click">
      <Badge dot>
        <>
          通知中心
          <span />
          <DownOutlined />
        </>
      </Badge>
    </Dropdown>
  );
};

export default Notification;
