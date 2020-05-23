import React from "react";
import { createFromIconfontCN } from "@ant-design/icons";
const IconFont = createFromIconfontCN({
  // 线上
  // scriptUrl: '//at.alicdn.com/t/font_1539921_oyuifh2qujq.js',
  // 本地
  scriptUrl: "iconfont.js",
});

export default function (props) {
  return <IconFont {...props} />;
}
