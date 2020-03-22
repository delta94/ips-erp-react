import React, { useState } from "react";
import { Container, Paper, Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import TextField from "@material-ui/core/TextField";
import Checkbox from "@material-ui/core/Checkbox";
import Select from "@material-ui/core/Select";
import { MuiPickersUtilsProvider, KeyboardTimePicker, KeyboardDatePicker } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

const useStyles = makeStyles(theme => ({
  form100: {
    margin: theme.spacing(1),
    minWidth: 100
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  },
  root: {
    margin: 10
  }
}));

export default function POInfo() {
  const classes = useStyles();
  const [age, setAge] = React.useState("");
  const [selectedDate, setSelectedDate] = React.useState(new Date("2020-03-22"));

  const handleChange = event => {
    setAge(event.target.value);
  };

  const handleDateChange = date => {
    setSelectedDate(date);
  };
  return (
    // <Container maxWidth="lg">
    <Paper className={classes.root}>
      <Grid container alignItems="center" justify="space-around">
        <Grid item xs={1}>
          <FormControl className={classes.form100}>
            <InputLabel shrink>厂内工号</InputLabel>
            <Select
              // value="10"
              onChange={handleChange}
              displayEmpty
              className={classes.selectEmpty}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value={10}>Ten</MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem>
            </Select>
            {/* <FormHelperText>Label + placeholder</FormHelperText> */}
          </FormControl>
        </Grid>
        <Grid item xs={1}>
          <FormControl className={classes.form100}>
            <InputLabel shrink>快递公司</InputLabel>
            <Select
              // value="10"
              onChange={handleChange}
              displayEmpty
              className={classes.selectEmpty}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value={10}>Ten</MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem>
            </Select>
            {/* <FormHelperText>Label + placeholder</FormHelperText> */}
          </FormControl>
        </Grid>
        <Grid item xs={1}>
          <FormControl className={classes.form100}>
            <InputLabel shrink>出货工厂</InputLabel>
            <Select
              // value="10"
              onChange={handleChange}
              displayEmpty
              className={classes.selectEmpty}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value={10}>Ten</MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem>
            </Select>
            {/* <FormHelperText>Label + placeholder</FormHelperText> */}
          </FormControl>
        </Grid>
        <Grid item xs={1}>
          <FormControl className={classes.form100}>
            <InputLabel shrink>收货人</InputLabel>
            <Select
              // value="10"
              onChange={handleChange}
              displayEmpty
              className={classes.selectEmpty}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value={10}>Ten</MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem>
            </Select>
            {/* <FormHelperText>Label + placeholder</FormHelperText> */}
          </FormControl>
        </Grid>
        <Grid item xs={1}>
          <FormControl className={classes.form100}>
            <InputLabel shrink>联系</InputLabel>
            <Select
              // value="10"
              onChange={handleChange}
              displayEmpty
              className={classes.selectEmpty}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value={10}>Ten</MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem>
            </Select>
            {/* <FormHelperText>Label + placeholder</FormHelperText> */}
          </FormControl>
        </Grid>
        <Grid item xs={1}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              disableToolbar
              variant="inline"
              format="dd/MM/yyyy"
              margin="normal"
              id="dd"
              label="下单日期"
              value={selectedDate}
              onChange={handleDateChange}
              KeyboardButtonProps={{
                "aria-label": "change date"
              }}
            />
          </MuiPickersUtilsProvider>
        </Grid>
        <Grid item xs={1}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              disableToolbar
              variant="inline"
              format="dd/MM/yyyy"
              margin="normal"
              id="ddd"
              label="厂内交期"
              value={selectedDate}
              onChange={handleDateChange}
              KeyboardButtonProps={{
                "aria-label": "change date"
              }}
            />
          </MuiPickersUtilsProvider>
        </Grid>
      </Grid>
    </Paper>
    // </Container>
  );
}
