import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { Paper, Grid, Typography } from "@material-ui/core";
import SearchBar from "material-ui-search-bar";

import Material from "./material";
import CraftList from "./craft_list";
import CraftOperations from "./craft_operations";

import { updateState, GetInternalWorkOrderItem } from "../../actions/craft_schedule_actions";

const useStyle = makeStyles(() => ({
  root: {
    margin: "0 auto",
    marginTop: 10,
    maxWidth: 600,
  },
  paperRoot: {
    margin: 30,
  },
  tableHeader: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
  },
  tableRow: {
    paddingLeft: 10,
  },
  btn: {
    marginTop: -12,
  },
}));

function EngineerProcess(props) {
  const classes = useStyle();

  // vars from reducer
  const { search, data } = props;

  // methods from actions
  const { updateState, GetInternalWorkOrderItem } = props;

  const renderHeader = () => {
    if (data) {
      return (
        <Grid container justify="space-around" className={classes.tableHeader} spacing={2}>
          <Grid item xs={2}>
            <Typography color="primary">工号</Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography color="primary">品名/图号</Typography>
          </Grid>
          <Grid item xs={1}>
            <Typography color="primary">数量</Typography>
          </Grid>
          <Grid item xs={1}>
            <Typography color="primary">单位</Typography>
          </Grid>
          <Grid item xs={1}>
            <Typography color="primary">下单日期</Typography>
          </Grid>
          <Grid item xs={1}>
            <Typography color="primary">厂内交期</Typography>
          </Grid>
          <Grid item xs={1}>
            <Typography color="primary">下单人</Typography>
          </Grid>
          <Grid item xs={1}>
            <Typography color="primary">处理人</Typography>
          </Grid>
          <Grid item xs={1}>
            <Typography color="primary">状态</Typography>
          </Grid>
        </Grid>
      );
    } else {
      return null;
    }
  };

  const renderData = () => {
    if (data) {
      return (
        <Grid container justify="space-around" spacing={2} className={classes.tableRow}>
          <Grid item xs={2}>
            <Typography>{data.item_id}</Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography>{data.item_num}</Typography>
          </Grid>
          <Grid item xs={1}>
            <Typography>{data.qty}</Typography>
          </Grid>
          <Grid item xs={1}>
            <Typography>{data.unit}</Typography>
          </Grid>
          <Grid item xs={1}>
            <Typography>{data.po_submit_date.split("T")[0]}</Typography>
          </Grid>
          <Grid item xs={1}>
            <Typography>{data.internal_dateline.split("T")[0]}</Typography>
          </Grid>
          <Grid item xs={1}>
            <Typography>{data.submit_by}</Typography>
          </Grid>
          <Grid item xs={1}>
            <Typography>{data.process_by}</Typography>
          </Grid>
          <Grid item xs={1}>
            <Typography>{data.state}</Typography>
          </Grid>
        </Grid>
      );
    } else {
      return null;
    }
  };

  return (
    <React.Fragment>
      <SearchBar
        className={classes.root}
        value={search}
        placeholder="输入工号"
        onChange={v => updateState("search", v)}
        onRequestSearch={() => GetInternalWorkOrderItem(search)}
      />
      <Paper className={classes.paperRoot}>
        {renderHeader()}
        {renderData()}
      </Paper>
      <Material />
      <CraftList />
      <CraftOperations />
    </React.Fragment>
  );
}

const mapStateToProps = ({ CraftScheduleReducer }) => {
  return {
    search: CraftScheduleReducer.search,
    data: CraftScheduleReducer.data,
  };
};

export default connect(mapStateToProps, { updateState, GetInternalWorkOrderItem })(EngineerProcess);
