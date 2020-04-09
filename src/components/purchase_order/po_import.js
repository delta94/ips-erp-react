import React from "react";
import { useDispatch } from "react-redux";
import { connect, batch } from "react-redux";
import { Button } from "@material-ui/core";

import * as XLSX from "xlsx";

import { UploadedFile } from "../../actions/po_actions";
import { enqueueSnackbar as enqueueSnackbarAction } from "../../actions/notify_actions";

function POImport(props) {
  const dispatch = useDispatch();
  const enqueueSnackbar = (...args) => dispatch(enqueueSnackbarAction(...args));
  // methods from actions
  const { UploadedFile } = props;
  // non redux actions
  const onImportExcel = (file) => {
    // 获取上传的文件对象
    const { files } = file.target;
    // 通过FileReader对象读取文件
    const fileReader = new FileReader();
    fileReader.onload = (event) => {
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
        batch(() => {
          enqueueSnackbar("上传成功! ", "success");
          UploadedFile(data);
        });
      } catch (e) {
        // 这里可以抛出文件类型错误不正确的相关提示
        enqueueSnackbar("文件类型不正确！", "success");
      }
    };
    // 以二进制方式打开文件
    fileReader.readAsBinaryString(files[0]);
  };
  return (
    <React.Fragment>
      <input value="" type="file" accept=".xlsx, .xls" onChange={onImportExcel} hidden id="btn-file" />
      <label htmlFor="btn-file">
        <Button variant="contained" color="primary" component="span">
          上传文件
        </Button>
      </label>
    </React.Fragment>
  );
}

export default connect(null, { UploadedFile })(POImport);
