import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import { MuiPickersUtilsProvider, KeyboardTimePicker, KeyboardDatePicker } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

const useStyle = makeStyles(theme => ({
  root: {
    margin: 10
  },
  tableHeader: {
    paddingTop: 10,
    paddingBottom: 10
  },
  tableRow: {
    paddingBottom: 4
  }
}));
export default function POItems() {
  const classes = useStyle();
  const [selectedDate, setSelectedDate] = React.useState(new Date("2020-03-22"));

  const handleDateChange = date => {
    setSelectedDate(date);
  };
  const renderHeader = () => {
    return (
      <Grid container justify="space-around" className={classes.tableHeader}>
        <Grid item xs={1}></Grid>
        <Grid item xs={1}>
          <Typography color="primary">工号</Typography>
        </Grid>
        <Grid item xs={1}>
          <Typography color="primary">品名</Typography>
        </Grid>
        <Grid item xs={1}>
          <Typography color="primary">到仓日期</Typography>
        </Grid>
        <Grid item xs={1}>
          <Typography color="primary">数量</Typography>
        </Grid>
        <Grid item xs={1}>
          <Typography color="primary">单价</Typography>
        </Grid>
        <Grid item xs={1}>
          <Typography color="primary">总价</Typography>
        </Grid>
        <Grid item xs={1}>
          <Typography color="primary">图号</Typography>
        </Grid>
        <Grid item xs={1}>
          <Typography color="primary">CAD图档</Typography>
        </Grid>
        <Grid item xs={1}>
          <Typography color="primary">报价ID</Typography>
        </Grid>
      </Grid>
    );
  };

  const renderItems = () => {
    return (
      <Grid container justify="space-around" className={classes.tableRow}>
        <Grid item xs={1}>
          1
        </Grid>
        <Grid item xs={1}>
          <TextField />
        </Grid>
        <Grid item xs={1}>
          <TextField />
        </Grid>
        <Grid item xs={1}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              disableToolbar
              variant="inline"
              format="dd/MM/yyyy"
              margin="none"
              id="delivery-date"
              value={selectedDate}
              onChange={handleDateChange}
              KeyboardButtonProps={{
                "aria-label": "change date"
              }}
            />
          </MuiPickersUtilsProvider>
        </Grid>
        <Grid item xs={1}>
          <TextField />
        </Grid>
        <Grid item xs={1}>
          <TextField />
        </Grid>
        <Grid item xs={1}>
          <TextField />
        </Grid>
        <Grid item xs={1}>
          <TextField />
        </Grid>
        <Grid item xs={1}>
          <TextField />
        </Grid>
        <Grid item xs={1}>
          <TextField />
        </Grid>
      </Grid>
    );
  };
  return (
    <Paper className={classes.root}>
      {renderHeader()}
      {renderItems()}
    </Paper>
  );
}
