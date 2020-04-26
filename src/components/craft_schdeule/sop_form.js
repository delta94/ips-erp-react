import React, { useRef } from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import PrintIcon from "@material-ui/icons/Print";
import ReactToPrint from "react-to-print";
import Barcode from "react-barcode";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

const rows = [
  [
    1,
    "WEDM",
    "加工内容 测试内容 继续测试内容",
    1,
    10,
    "PCS",
    10,
    "2020-04-22 10.30PM",
    "2020-04-22 10.30PM",
    "                  ",
  ],
];

class ComponentToPrint extends React.Component {
  render() {
    return (
      <div>
        <Grid container name="title">
          <Grid item xs={4}>
            <Barcode value="304598549582" width={3} format="CODE128" height={50} fontSize={10} />
          </Grid>
          <Grid item xs={2}></Grid>
          <Grid item xs={6}>
            <Typography variant="h4">工件加工流程表SOP</Typography>
          </Grid>
        </Grid>
        <Grid container name="info">
          <Grid item xs={4}>
            <Typography variant="h6">工号</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h6">下单数量</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h6">发料签章</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h6">材质</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h6">表面处理</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h6">膜厚</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h5">厂内交期</Typography>
          </Grid>
        </Grid>
        {/* <TableContainer style={{ border: "1px solid black" }}> */}
        <Table
          size="small"
          aria-label="a dense table"
          style={{ borderTop: "1px solid black", borderBottom: "1px solid black", tableLayout: "auto" }}
        >
          <TableHead>
            <TableRow>
              <TableCell colSpan={6} />
              <TableCell align="center" colSpan={3}>
                预计工时
              </TableCell>
              <TableCell align="center" colSpan={3}>
                实际工时
              </TableCell>
              <TableCell colSpan={3} />
            </TableRow>
            <TableRow>
              <TableCell>工序</TableCell>
              <TableCell>加工部门</TableCell>
              <TableCell>工艺内容</TableCell>
              <TableCell>等级</TableCell>
              <TableCell>数量</TableCell>
              <TableCell>单位</TableCell>
              <TableCell>总计</TableCell>
              <TableCell>开始</TableCell>
              <TableCell>完成</TableCell>
              <TableCell>日期</TableCell>
              <TableCell>时间</TableCell>
              <TableCell>合计</TableCell>
              <TableCell>加工者</TableCell>
              <TableCell>组长</TableCell>
              <TableCell>品检</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(row => (
              <TableRow key={row[0]}>
                <TableCell component="th" scope="row">
                  {row[0]}
                </TableCell>
                <TableCell>{row[1]}</TableCell>
                <TableCell>{row[2]}</TableCell>
                <TableCell>{row[3]}</TableCell>
                <TableCell>{row[4]}</TableCell>
                <TableCell>{row[5]}</TableCell>
                <TableCell>{row[6]}</TableCell>
                <TableCell>{row[7]}</TableCell>
                <TableCell>{row[8]}</TableCell>
                <TableCell>{row[9]}</TableCell>
                <TableCell>{row[10]}</TableCell>
                <TableCell>{row[11]}</TableCell>
                <TableCell>{row[12]}</TableCell>
                <TableCell>{row[13]}</TableCell>
                <TableCell>{row[14]}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }
}

const SOPForm = () => {
  const componentRef = useRef();
  return (
    <React.Fragment>
      <ReactToPrint
        trigger={() => (
          <Button variant="contained" color="primary" startIcon={<PrintIcon />}>
            打印
          </Button>
        )}
        content={() => componentRef.current}
      />

      <div style={{ display: "none" }}>
        <ComponentToPrint ref={componentRef} />
      </div>
    </React.Fragment>
  );
};

export default SOPForm;
