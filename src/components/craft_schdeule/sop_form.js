import React, { useRef } from "react";
import { connect } from "react-redux";
import { Grid, Typography, Button, Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import PrintIcon from "@material-ui/icons/Print";
import ReactToPrint from "react-to-print";
import Barcode from "react-barcode";

class ComponentToPrint extends React.Component {
  render() {
    return (
      <div>
        <Grid container name="title">
          <Grid item xs={4}>
            <Barcode value={this.props.data.item_id} width={2} height={50} fontSize={18} />
          </Grid>
          <Grid item xs={2}></Grid>
          <Grid item xs={6}>
            <Typography variant="h4">工艺流程表</Typography>
          </Grid>
        </Grid>
        <Grid container name="info">
          <Grid item xs={4}>
            <Typography variant="h6">
              交期: {new Date(this.props.data.internal_dateline).toLocaleString("zh-cn", { hour12: false })}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h6">下单数量: {this.props.data.qty}</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h6">
              材质( 硬度 ): {this.props.selected_material.name} ({this.props.selected_material.hardness})
            </Typography>
          </Grid>
        </Grid>
        <Table
          size="small"
          aria-label="a dense table"
          style={{ borderTop: "1px solid black", borderBottom: "1px solid black", tableLayout: "auto" }}
        >
          <TableHead>
            <TableRow>
              <TableCell colSpan={3} />
              <TableCell align="center" colSpan={3}>
                预计工时
              </TableCell>
              <TableCell align="center" colSpan={2}>
                实际工时
              </TableCell>
              <TableCell colSpan={2} />
            </TableRow>
            <TableRow>
              <TableCell>工序</TableCell>
              <TableCell>部门</TableCell>
              <TableCell>数量</TableCell>
              <TableCell>工时</TableCell>
              <TableCell>开始</TableCell>
              <TableCell>完成</TableCell>
              <TableCell>日期</TableCell>
              <TableCell>日期</TableCell>
              <TableCell>加工者</TableCell>
              <TableCell>品检</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.props.crafts.map(craft => (
              <TableRow key={craft.id}>
                <TableCell component="th" scope="row">
                  {craft.seq}
                </TableCell>
                <TableCell>{craft.department}</TableCell>
                <TableCell>{craft.qty}</TableCell>
                <TableCell>{craft.estimate}</TableCell>
                <TableCell>{craft.start_time.toLocaleString("zh-cn", { hour12: false })}</TableCell>
                <TableCell>{craft.end_time.toLocaleString("zh-cn", { hour12: false })}</TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }
}

const SOPForm = props => {
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
        <ComponentToPrint ref={componentRef} {...props} />
      </div>
    </React.Fragment>
  );
};

const mapStateToProps = ({ CraftScheduleReducer }) => {
  return {
    data: CraftScheduleReducer.data,
    crafts: CraftScheduleReducer.crafts,
    selected_material: CraftScheduleReducer.selected_material,
  };
};

export default connect(mapStateToProps, null)(SOPForm);
