import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Container, Paper, Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import Checkbox from "@material-ui/core/Checkbox";
import Select from "@material-ui/core/Select";
import { MuiPickersUtilsProvider, KeyboardTimePicker, KeyboardDatePicker } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

import {
  UpdateState,
  GetBUEmployee,
  GetShippingCompany,
  GetOutFactory,
  GetDeliverContact
} from "../../actions/po_actions";

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

function POInternal(props) {
  const classes = useStyles();

  // vars from reducers
  const {
    buEmployees,
    selectedBUEmployee,
    shippingCompanies,
    selectedShipping,
    outFactories,
    selectedOutFactory,
    deliverContacts,
    selectedDeliverContact
  } = props;

  // methods from actions
  const { UpdateState, GetBUEmployee, GetShippingCompany, GetOutFactory, GetDeliverContact } = props;

  const [age, setAge] = React.useState("");
  const [selectedDate, setSelectedDate] = React.useState(new Date("2020-03-22"));

  const handleChange = event => {
    setAge(event.target.value);
  };

  const handleDateChange = date => {
    setSelectedDate(date);
  };

  useEffect(() => {
    GetBUEmployee();
    GetShippingCompany();
    GetOutFactory();
    GetDeliverContact();
    return () => {};
  }, [GetBUEmployee, GetShippingCompany, GetOutFactory, GetDeliverContact]);
  return (
    // <Container maxWidth="lg">
    <Paper className={classes.root}>
      <Grid container alignItems="center" justify="space-around">
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

const mapStateToProps = ({ POReducer }) => {
  return {
    buEmployees: POReducer.buEmployees,
    selectedBUEmployee: POReducer.selectedBUEmployee,
    shippingCompanies: POReducer.shippingCompanies,
    selectedShipping: POReducer.selectedShipping,
    outFactories: POReducer.outFactories,
    selectedOutFactory: POReducer.selectedOutFactory,
    deliverContacts: POReducer.deliverContacts,
    selectedDeliverContact: POReducer.selectedDeliverContact
  };
};

export default connect(mapStateToProps, {
  GetBUEmployee,
  GetShippingCompany,
  UpdateState,
  GetOutFactory,
  GetDeliverContact
})(POInternal);
