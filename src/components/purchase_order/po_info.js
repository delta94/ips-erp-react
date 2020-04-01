import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Paper, Grid, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

import { GetCustomers, UpdateState, PostInternalWorkOrder } from "../../actions/po_actions";

import Alert from "../alert";

const useStyles = makeStyles(theme => ({
  form150: {
    margin: theme.spacing(1)
    // minWidth: 150
  },
  empty: {
    marginTop: theme.spacing(2)
  },
  root: {
    margin: 10
  },
  clearMarginPadding: {
    padding: 0,
    margin: 0
  },
  center: {
    backgroundColor: "#FFDC00",
    width: 100,
    height: 100,
    margin: "0 auto"
  }
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
    internal_dateline,
    delivery_dateline,
    work_order_created,
    openAlert,
    alertMessage,
    alertSeverity
  } = props;

  // methods from actions
  const { GetCustomers, UpdateState, PostInternalWorkOrder } = props;

  useEffect(() => {
    GetCustomers();
    return () => {};
  }, [GetCustomers]);

  return (
    // <Container maxWidth="lg">
    <React.Fragment>
      <Alert
        message={alertMessage}
        severity={alertSeverity}
        open={openAlert}
        onClose={() => UpdateState("openAlert", false)}
      />
      <Paper className={classes.root}>
        <Grid container alignItems="center" justify="space-around">
          <Grid item xs={1}>
            <FormControl className={classes.form150} fullWidth>
              <InputLabel shrink>客户</InputLabel>
              <Select
                value={customer}
                onChange={e => {
                  UpdateState("customer", e.target.value);
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
              {/* <FormHelperText>Label + placeholder</FormHelperText> */}
            </FormControl>
          </Grid>
          <Grid item xs={1}>
            <FormControl className={classes.form150}>
              <InputLabel shrink>客户PO#</InputLabel>
              <TextField
                className={classes.empty}
                value={customer_po}
                onChange={e => UpdateState("customer_po", e.target.value)}
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
                onChange={date => UpdateState("po_submit_date", date)}
                KeyboardButtonProps={{
                  "aria-label": "change date"
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
                value={customer_dateline.setDate(po_submit_date.getDate() - 7)}
                id="customer-dateline"
                onChange={date => UpdateState("customer_dateline", date)}
                KeyboardButtonProps={{
                  "aria-label": "change date"
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
                value={internal_dateline}
                onChange={date => UpdateState("internal_dateline", date)}
                KeyboardButtonProps={{
                  "aria-label": "change date"
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
                label="发货日期"
                id="delivery-dateline"
                value={delivery_dateline}
                onChange={date => UpdateState("delivery_dateline", date)}
                KeyboardButtonProps={{
                  "aria-label": "change date"
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
              // ToggleState("work_order_created");
            }}
          >
            添加订单内容
          </Button>
        </Grid>
      )}
    </React.Fragment>
    // </Container>
  );
}

const mapStateToProps = ({ POReducer }) => {
  return {
    customers: POReducer.customers,
    customer: POReducer.customer,
    customer_po: POReducer.customer_po,
    po_submit_date: POReducer.po_submit_date,
    customer_dateline: POReducer.customer_dateline,
    internal_dateline: POReducer.internal_dateline,
    delivery_dateline: POReducer.delivery_dateline,
    work_order_created: POReducer.work_order_created,
    // for alert
    openAlert: POReducer.openAlert,
    alertMessage: POReducer.alertMessage,
    alertSeverity: POReducer.alertSeverity
  };
};

export default connect(mapStateToProps, { GetCustomers, UpdateState, PostInternalWorkOrder })(POInfo);
