import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import CheckIcon from "@material-ui/icons/Check";
import SearchBar from "material-ui-search-bar";
import green from "@material-ui/core/colors/green";
// import { useDebouncedCallback } from "use-debounce";

import {
  UpdateState,
  GetInternalWorkOrderItem,
  PatchInternalWorkOrderItem,
} from "../../actions/engineer_process_actions";

const useStyle = makeStyles((theme) => ({
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
  },
}));

function EngineerProcess(props) {
  const classes = useStyle();

  // vars from reducer
  const { search, data } = props;

  // methods from actions
  const { UpdateState, GetInternalWorkOrderItem, PatchInternalWorkOrderItem } = props;
  // const [debouncedCallback] = useDebouncedCallback(
  //   // function
  //   (value) => {
  //     UpdateState("search", value);
  //   },
  //   // delay in ms
  //   500
  // );

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
          <Grid item xs={2}>
            <Typography color="primary">CAD图档</Typography>
          </Grid>
          <Grid item xs={1}>
            <Typography color="primary">状态</Typography>
          </Grid>
          <Grid item xs={1}></Grid>
        </Grid>
      );
    } else {
      return null;
    }
  };

  const renderData = () => {
    if (data) {
      return (
        <Grid container justify="space-around" spacing={2}>
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
          <Grid item xs={2}>
            <Typography>{data.cad_dir}</Typography>
          </Grid>
          <Grid item xs={1}>
            <Typography>{data.state}</Typography>
          </Grid>
          <Grid item xs={1}>
            <IconButton
              edge="start"
              style={{ marginTop: -12, color: green[500] }}
              onClick={() => {
                PatchInternalWorkOrderItem(data.item_id);
              }}
            >
              <CheckIcon />
            </IconButton>
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
        // onChange={(e) => debouncedCallback(e)}
        placeholder="输入工号"
        onChange={(v) => UpdateState("search", v)}
        onRequestSearch={() => GetInternalWorkOrderItem(search)}
      />
      <Paper className={classes.paperRoot}>
        {renderHeader()}
        {renderData()}
      </Paper>
    </React.Fragment>
  );
}

const mapStateToProps = ({ EngineerProcessReducer }) => {
  return {
    search: EngineerProcessReducer.search,
    data: EngineerProcessReducer.data,
  };
};

export default connect(mapStateToProps, { UpdateState, GetInternalWorkOrderItem, PatchInternalWorkOrderItem })(
  EngineerProcess
);
