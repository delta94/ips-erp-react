import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Paper, Grid, Button, InputLabel, FormControl, MenuItem, TextField, Select } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

import { GetCustomers, updateState, PostInternalWorkOrder } from "../../actions/po_actions";

const useStyles = makeStyles(theme => ({
  form150: {
    margin: theme.spacing(1),
    // minWidth: 150
  },
  empty: {
    marginTop: theme.spacing(2),
  },
  root: {
    margin: 10,
  },
  clearMarginPadding: {
    padding: 0,
    margin: 0,
  },
  center: {
    backgroundColor: "#FFDC00",
    width: 100,
    height: 100,
    margin: "0 auto",
  },
}));

function POInfo(props) {
  const classes = useStyles();

  // vars from reducers
  const {
    customers,
    customer,
    customer_po,
    po_submit_date,
    customer_dateline,
    // internal_dateline,
    work_order_created,
  } = props;

  // methods from actions
  const { GetCustomers, updateState, PostInternalWorkOrder } = props;

  useEffect(() => {
    GetCustomers();
  }, [GetCustomers]);

  return (
    <React.Fragment>
      <Paper className={classes.root}>
        <Grid container alignItems="center" justify="space-around">
          <Grid item xs={2}>
            <FormControl className={classes.form150} fullWidth>
              <InputLabel shrink>客户</InputLabel>
              <Select
                value={customer}
                onChange={e => {
                  updateState("customer", e.target.value);
                }}
                displayEmpty
                className={classes.empty}
              >
                <MenuItem value="">
                  <em>空</em>
                </MenuItem>
                {customers.map(item => (
                  <MenuItem key={item.id} value={item.internal}>
                    {item.internal}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={2}>
            <FormControl className={classes.form150}>
              <InputLabel shrink>客户PO#</InputLabel>
              <TextField
                className={classes.empty}
                value={customer_po}
                onChange={e => updateState("customer_po", e.target.value)}
              />
            </FormControl>
          </Grid>

          <Grid item xs={2}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                disableToolbar
                variant="inline"
                format="dd/MM/yyyy"
                margin="none"
                label="下单日期"
                value={po_submit_date}
                id="po-submit-date"
                onChange={date => updateState("po_submit_date", date)}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
              />
            </MuiPickersUtilsProvider>
          </Grid>
          <Grid item xs={2}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                disableToolbar
                variant="inline"
                format="dd/MM/yyyy"
                margin="none"
                label="客户交期"
                value={customer_dateline}
                id="customer-dateline"
                onChange={date => updateState("customer_dateline", date)}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
              />
            </MuiPickersUtilsProvider>
          </Grid>

          <Grid item xs={2}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                disableToolbar
                variant="inline"
                format="dd/MM/yyyy"
                margin="none"
                label="厂内交期"
                id="internal-dateline"
                readOnly
                // value={internal_dateline.setDate(customer_dateline.getDate() - 7)}
                value={new Date().setDate(customer_dateline.getDate() - 7)}
                // onChange={date => updateState("internal_dateline", date)}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
              />
            </MuiPickersUtilsProvider>
          </Grid>
        </Grid>
      </Paper>
      {!work_order_created && (
        <Grid container justify="center">
          <Button
            variant="contained"
            color="primary"
            style={{ justifyContent: "center" }}
            onClick={() => {
              PostInternalWorkOrder();
            }}
          >
            添加订单内容
          </Button>
        </Grid>
      )}
    </React.Fragment>
  );
}

const mapStateToProps = ({ POReducer }) => {
  return {
    customers: POReducer.customers,
    customer: POReducer.customer,
    customer_po: POReducer.customer_po,
    po_submit_date: POReducer.po_submit_date,
    customer_dateline: POReducer.customer_dateline,
    // internal_dateline: POReducer.internal_dateline,
    work_order_created: POReducer.work_order_created,
  };
};

export default connect(mapStateToProps, { GetCustomers, updateState, PostInternalWorkOrder })(POInfo);
