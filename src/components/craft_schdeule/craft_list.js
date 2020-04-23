import React from "react";
import clsx from "clsx";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Checkbox from "@material-ui/core/Checkbox";
import TextField from "@material-ui/core/TextField";

import { clickSeqCheckbox, UpdateArrayObjectState } from "../../actions/craft_schedule_actions";

const useStyle = makeStyles(theme => ({
  root: { margin: 10 },
  icon: {
    borderRadius: 3,
    width: 16,
    height: 16,
    boxShadow: "inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)",
    backgroundColor: "#f5f8fa",
    backgroundImage: "linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))",
    "$root.Mui-focusVisible &": {
      outline: "2px auto rgba(19,124,189,.6)",
      outlineOffset: 2,
    },
    "input:hover ~ &": {
      backgroundColor: "#ebf1f5",
    },
    "input:disabled ~ &": {
      boxShadow: "none",
      background: "rgba(206,217,224,.5)",
    },
  },
  checkedIcon: {
    backgroundColor: "#137cbd",
    backgroundImage: "linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))",
    "&:before": {
      display: "block",
      width: 16,
      height: 16,
      backgroundImage:
        "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath" +
        " fill-rule='evenodd' clip-rule='evenodd' d='M12 5c-.28 0-.53.11-.71.29L7 9.59l-2.29-2.3a1.003 " +
        "1.003 0 00-1.42 1.42l3 3c.18.18.43.29.71.29s.53-.11.71-.29l5-5A1.003 1.003 0 0012 5z' fill='%23fff'/%3E%3C/svg%3E\")",
      content: '""',
    },
    "input:hover ~ &": {
      backgroundColor: "#106ba3",
    },
  },
  gridRoot: { margin: 2 },
  gridItemAlign: { marginTop: -7, marginLeft: -2 },
  narrowTextInput: { maxWidth: 40 },
}));

function CraftList(props) {
  const classes = useStyle();

  // vars from reducers
  const { crafts } = props;

  // methods from actions
  const { clickSeqCheckbox, UpdateArrayObjectState } = props;
  const renderHeader = () => {
    return (
      <Grid container justify="space-around" spacing={2} className={classes.gridRoot}>
        <Grid item xs={1}>
          <Typography color="primary">工序/标记</Typography>
        </Grid>
        <Grid item xs={1}>
          <Typography color="primary">部门</Typography>
        </Grid>
        <Grid item xs={1}>
          <Typography color="primary">工艺编号</Typography>
        </Grid>
        <Grid item xs={5}>
          <Typography color="primary">工业内容</Typography>
        </Grid>
        <Grid item xs={1}>
          <Typography color="primary">等级 数量</Typography>
        </Grid>
        <Grid item xs={1}>
          <Typography color="primary">预计工时</Typography>
        </Grid>
        <Grid item xs={1}>
          <Typography color="primary">预计开始</Typography>
        </Grid>
        <Grid item xs={1}>
          <Typography color="primary">预计完成</Typography>
        </Grid>
      </Grid>
    );
  };

  const renderContent = () => {
    return crafts.map((craft, index) => {
      return (
        <Grid container justify="space-around" spacing={2} className={classes.gridRoot} key={craft.id}>
          <Grid item xs={1}>
            <Grid container>
              <Grid item xs={4}>
                <Typography variant="body2">{craft.seq}</Typography>
              </Grid>
              <Grid item xs={8}>
                <Checkbox
                  className={classes.gridItemAlign}
                  checkedIcon={<span className={clsx(classes.icon, classes.checkedIcon)} />}
                  icon={<span className={classes.icon} />}
                  checked={craft.check}
                  onChange={() => {
                    clickSeqCheckbox(craft.id);
                  }}
                  size="small"
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={1}>
            <Typography variant="body2">{craft.department}</Typography>
          </Grid>
          <Grid item xs={1}>
            <Typography variant="body2">{craft.craft_num}</Typography>
          </Grid>
          <Grid item xs={5}>
            <Typography variant="body2">{craft.description}</Typography>
          </Grid>
          <Grid item xs={1}>
            <Grid container direction="row">
              <Grid item xs={6}>
                <TextField
                  disabled={!craft.check}
                  value={craft.level}
                  type="number"
                  onChange={e => UpdateArrayObjectState("crafts", index, "level", e.target.value)}
                  className={clsx(classes.gridItemAlign, classes.narrowTextInput)}
                  size="small"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  disabled={!craft.check}
                  value={craft.qty}
                  type="number"
                  onChange={e => UpdateArrayObjectState("crafts", index, "qty", e.target.value)}
                  className={clsx(classes.gridItemAlign, classes.narrowTextInput)}
                  size="small"
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={1}>
            <TextField
              disabled={!craft.check}
              value={craft.estimate}
              type="number"
              onChange={e => UpdateArrayObjectState("crafts", index, "estimate", e.target.value)}
              className={clsx(classes.gridItemAlign, classes.narrowTextInput)}
              size="small"
            />
          </Grid>
          <Grid item xs={1}>
            <Typography variant="body2">{craft.start_time}</Typography>
          </Grid>
          <Grid item xs={1}>
            <Typography variant="body2">{craft.end_time}</Typography>
          </Grid>
        </Grid>
      );
    });
  };
  return (
    <React.Fragment>
      {crafts.length > 0 ? (
        <Paper className={classes.root}>
          {renderHeader()}
          {renderContent()}
        </Paper>
      ) : null}
    </React.Fragment>
  );
}

const mapStateToProps = ({ CraftScheduleReducer }) => {
  return {
    crafts: CraftScheduleReducer.crafts,
  };
};

export default connect(mapStateToProps, { clickSeqCheckbox, UpdateArrayObjectState })(CraftList);
