import React from "react";
import { notification } from "antd";
import { Button, Upload } from "antd";

import * as XLSX from "xlsx";

import { ERROR, SUCCESS } from "../../utils/constants";

export const openNotification = (type, msg) => {
  notification[type]({
    message: msg,
  });
};

export default function ImportBtn(props) {
  const { btnText, uploadFile, ...rest } = props;

  const options = {
    // 这里我们只接受excel2007以后版本的文件，accept就是指定文件选择框的文件类型
    accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    name: "file",
    headers: {
      authorization: "authorization-text",
    },
    showUploadList: false,
    // 把excel的处理放在beforeUpload事件，否则要把文件上传到通过action指定的地址去后台处理
    // 这里我们没有指定action地址，因为没有传到后台
    beforeUpload: (file, fileList) => {
      var rABS = true;
      const f = fileList[0];
      // onImportExcel(f);
      var reader = new FileReader();
      reader.onload = function (event) {
        try {
          const { result } = event.target;
          // 以二进制流方式读取得到整份excel表格对象
          const workbook = XLSX.read(result, { type: "binary" });
          // 存储获取到的数据
          let data = [];
          // 遍历每张工作表进行读取（这里默认只读取第一张表）
          for (const sheet in workbook.Sheets) {
            // esline-disable-next-line
            if (workbook.Sheets.hasOwnProperty(sheet)) {
              // 利用 sheet_to_json 方法将 excel 转成 json 数据
              data = data.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]));
              // break; // 如果只取第一张表，就取消注释这行
            }
          }
          // 最终获取到并且格式化后的 json 数据
          openNotification(SUCCESS, "上传成功! ");
          uploadFile(data);
        } catch (e) {
          // 这里可以抛出文件类型错误不正确的相关提示
          openNotification(ERROR, e);
        }
      };
      if (rABS) reader.readAsBinaryString(f);
      else reader.readAsArrayBuffer(f);
      return false;
    },
  };

  return (
    <Upload {...options} className="full-width-upload">
      <Button {...rest} block>
        {btnText}
      </Button>
    </Upload>
  );
}
