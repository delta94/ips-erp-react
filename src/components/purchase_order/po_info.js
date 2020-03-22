import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Container, Paper, Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import TextField from "@material-ui/core/TextField";
import Checkbox from "@material-ui/core/Checkbox";
import Select from "@material-ui/core/Select";
import { MuiPickersUtilsProvider, KeyboardTimePicker, KeyboardDatePicker } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

import { GetCustomers, UpdateState, GetPurchaser } from "../../actions/po_actions";

const useStyles = makeStyles(theme => ({
  form100: {
    margin: theme.spacing(1),
    minWidth: 100
  },
  empty: {
    marginTop: theme.spacing(2)
  },

  root: {
    margin: 10
  }
}));

function POInfo(props) {
  const classes = useStyles();

  // vars from reducers
  const { customers, selectedCustomer, customerPO, purchasers } = props;

  // methods from actions
  const { GetCustomers, UpdateState, GetPurchaser } = props;

  const [age, setAge] = React.useState("");
  const [selectedDate, setSelectedDate] = React.useState(new Date("2020-03-22"));

  useEffect(() => {
    GetCustomers();
    return () => {};
  }, [GetCustomers]);

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
            <InputLabel shrink id="demo-simple-select-placeholder-label-label">
              客户
            </InputLabel>
            <Select
              labelId="demo-simple-select-placeholder-label-label"
              id="demo-simple-select-placeholder-label"
              value={selectedCustomer}
              onChange={e => {
                UpdateState("selectedCustomer", e.target.value);
                GetPurchaser(e.target.value);
              }}
              displayEmpty
              className={classes.empty}
            >
              <MenuItem value="">
                <em>空</em>
              </MenuItem>
              {customers.map(item => {
                return (
                  <MenuItem key={item.internal} value={item.internal}>
                    {item.internal}
                  </MenuItem>
                );
              })}
            </Select>
            {/* <FormHelperText>Label + placeholder</FormHelperText> */}
          </FormControl>
        </Grid>
        <Grid item xs={1}>
          <FormControl className={classes.form100}>
            <InputLabel shrink id="demo-simple-select-placeholder-label-label">
              客户PO#
            </InputLabel>
            <TextField
              className={classes.empty}
              value={customerPO}
              onChange={e => UpdateState("customerPO", e.target.value)}
            />
            {/* <FormHelperText>Label + placeholder</FormHelperText> */}
          </FormControl>
        </Grid>
        <Grid item xs={1}>
          <FormControl className={classes.form100}>
            <InputLabel shrink id="demo-simple-select-placeholder-label-label">
              采购人
            </InputLabel>
            <Select
              labelId="demo-simple-select-placeholder-label-label"
              id="demo-simple-select-placeholder-label"
              // value="10"
              onChange={handleChange}
              displayEmpty
              className={classes.empty}
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
            <InputLabel shrink id="demo-simple-select-placeholder-label-label">
              客户合同
            </InputLabel>
            <Select
              labelId="demo-simple-select-placeholder-label-label"
              id="demo-simple-select-placeholder-label"
              // value="10"
              onChange={handleChange}
              displayEmpty
              className={classes.empty}
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
            <InputLabel shrink id="demo-simple-select-placeholder-label-label">
              货币
            </InputLabel>
            <Select
              labelId="demo-simple-select-placeholder-label-label"
              id="demo-simple-select-placeholder-label"
              // value="10"
              onChange={handleChange}
              displayEmpty
              className={classes.empty}
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
            <InputLabel shrink id="demo-simple-select-placeholder-label-label">
              汇率
            </InputLabel>
            <Select
              labelId="demo-simple-select-placeholder-label-label"
              id="demo-simple-select-placeholder-label"
              // value="10"
              onChange={handleChange}
              displayEmpty
              className={classes.empty}
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
            <TextField id="standard-basic" label="税率" />
          </FormControl>
        </Grid>
        <Grid item xs={1}>
          <FormControl className={classes.form100}>
            <InputLabel shrink id="demo-simple-select-placeholder-label-label">
              汇率
            </InputLabel>
            <Select
              labelId="demo-simple-select-placeholder-label-label"
              id="demo-simple-select-placeholder-label"
              // value="10"
              onChange={handleChange}
              displayEmpty
              className={classes.empty}
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
              id="客户交期"
              label="客户交期"
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
              id="delivery-date"
              label="发货日期"
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

const mapStateToProps = ({ POReducer }) => {
  return {
    customers: POReducer.customers,
    selectedCustomer: POReducer.selectedCustomer,
    customerPO: POReducer.customerPO,
    purchasers: POReducer.purchasers
  };
};

export default connect(mapStateToProps, { GetCustomers, UpdateState, GetPurchaser })(POInfo);
