import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { Paper, Grid } from "@material-ui/core";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";

const useStyle = makeStyles(theme => ({
  root: { margin: 10 }
}));

function CraftSchedule(props) {
  const classes = useStyle();
  return (
    <React.Fragment>
      <Paper className={classes.root}>
        <Grid container>
          <Grid item xs={1}>
            工号
          </Grid>
          <Grid item xs={1}>
            <Select value="" displayEmpty className={classes.empty}>
              <MenuItem value="">
                <em>空</em>
              </MenuItem>
            </Select>
          </Grid>
          <Grid item xs={1}>
            <Select value="" displayEmpty className={classes.empty}>
              <MenuItem value="">
                <em>空</em>
              </MenuItem>
            </Select>
          </Grid>
          <Grid item xs={1}>
            <Select value="" displayEmpty className={classes.empty}>
              <MenuItem value="">
                <em>空</em>
              </MenuItem>
            </Select>
          </Grid>
        </Grid>
      </Paper>
    </React.Fragment>
  );
}

export default connect(null, null)(CraftSchedule);
