import React from "react";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import RestoreIcon from "@material-ui/icons/Restore";
import SortByAlphaIcon from "@material-ui/icons/SortByAlpha";
import FunctionsIcon from "@material-ui/icons/Functions";
import PublishIcon from "@material-ui/icons/Publish";

import {
  clickSortCraftSchedule,
  clickCalWorkHour,
  GetCrafts,
  clickSubmitCraftSchedule,
} from "../../actions/craft_schedule_actions";
import SOPForm from "./sop_form";

const useStyle = makeStyles(() => ({
  root: {
    margin: 10,
    marginRight: 40,
  },
  gridRoot: {
    margin: 2,
  },
}));

function CraftOperations(props) {
  const classes = useStyle();

  // vars from reducers
  const { crafts, selected_material } = props;

  // methods from actions
  const { clickSortCraftSchedule, clickCalWorkHour, GetCrafts, clickSubmitCraftSchedule } = props;

  const renderOperation = () => {
    if (crafts.length > 0) {
      return (
        <Grid container alignItems="center" justify="flex-end" spacing={4} className={classes.gridRoot}>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              startIcon={<RestoreIcon />}
              onClick={() => GetCrafts(selected_material.category)}
            >
              重置
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              startIcon={<SortByAlphaIcon />}
              onClick={() => clickSortCraftSchedule(crafts)}
            >
              排序
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              startIcon={<FunctionsIcon />}
              onClick={() => clickCalWorkHour(crafts)}
            >
              工时
            </Button>
          </Grid>
          <Grid item>
            <SOPForm />
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              startIcon={<PublishIcon />}
              onClick={() => clickSubmitCraftSchedule()}
            >
              提交
            </Button>
          </Grid>
        </Grid>
      );
    } else {
      return null;
    }
  };
  return <div className={classes.root}>{renderOperation()}</div>;
}
const mapStateToProps = ({ CraftScheduleReducer }) => {
  return {
    crafts: CraftScheduleReducer.crafts,
    selected_material: CraftScheduleReducer.selected_material,
  };
};

export default connect(mapStateToProps, {
  clickSortCraftSchedule,
  clickCalWorkHour,
  GetCrafts,
  clickSubmitCraftSchedule,
})(CraftOperations);
