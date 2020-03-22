import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Paper, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import TextField from "@material-ui/core/TextField";
import Checkbox from "@material-ui/core/Checkbox";
import Select from "@material-ui/core/Select";
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

import { GetCustomers, UpdateState, GetPurchaser, GetCurrency, ToggleState } from "../../actions/po_actions";

const useStyles = makeStyles(theme => ({
  form100: {
    margin: theme.spacing(1),
    minWidth: 90
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
  }
}));

function POInfo(props) {
  const classes = useStyles();

  // vars from reducers
  const {
    customers,
    selectedCustomer,
    customerPO,
    purchasers,
    selectedPurchaser,
    customerContract,
    currencies,
    selectedCurrency,
    exchangeRate,
    tax,
    taxRate,
    customerSubmitDate,
    deliveryDate
  } = props;

  // methods from actions
  const { GetCustomers, UpdateState, GetPurchaser, GetCurrency, ToggleState } = props;

  useEffect(() => {
    GetCustomers();
    GetCurrency();
    return () => {};
  }, [GetCustomers, GetCurrency]);

  return (
    // <Container maxWidth="lg">
    <Paper className={classes.root}>
      <Grid container alignItems="center" justify="space-around">
        <Grid item xs={1}>
          <FormControl className={classes.form100}>
            <InputLabel shrink>客户</InputLabel>
            <Select
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
                  <MenuItem key={item.id} value={item.internal}>
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
            <InputLabel shrink>客户PO#</InputLabel>
            <TextField
              className={classes.empty}
              value={customerPO}
              onChange={e => UpdateState("customerPO", e.target.value)}
            />
          </FormControl>
        </Grid>
        <Grid item xs={1}>
          <FormControl className={classes.form100}>
            <InputLabel shrink>采购人</InputLabel>
            <Select
              value={selectedPurchaser}
              onChange={e => UpdateState("selectedPurchaser", e.target.value)}
              displayEmpty
              className={classes.empty}
            >
              <MenuItem value="">
                <em>空</em>
              </MenuItem>
              {purchasers.map(item => {
                return (
                  <MenuItem key={item.id} value={item.name}>
                    {item.name}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={1}>
          <FormControl className={classes.form100}>
            <InputLabel shrink>客户合同</InputLabel>
            <TextField
              className={classes.empty}
              value={customerContract}
              onChange={e => UpdateState("customerContract", e.target.value)}
            />
          </FormControl>
        </Grid>
        <Grid item xs={1}>
          <FormControl className={classes.form100}>
            <InputLabel shrink>货币</InputLabel>
            <Select
              value={selectedCurrency}
              onChange={e => UpdateState("selectedCurrency", e.target.value)}
              displayEmpty
              className={classes.empty}
            >
              <MenuItem value="">
                <em>空</em>
              </MenuItem>
              {currencies.map(item => {
                return (
                  <MenuItem key={item.id} value={item.name}>
                    {item.name}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={1}>
          <FormControl className={classes.form100}>
            <InputLabel shrink>汇率</InputLabel>
            <TextField
              className={classes.empty}
              value={exchangeRate}
              onChange={e => UpdateState("exchangeRate", e.target.value)}
            />
          </FormControl>
        </Grid>
        <Grid item xs={1}>
          <FormControlLabel
            className={classes.clearMarginPadding}
            control={
              <Checkbox
                checked={tax}
                size="small"
                color="primary"
                className={classes.clearMarginPadding}
                onChange={() => ToggleState("tax")}
              />
            }
            label="税"
          />
          {tax && (
            <TextField
              value={taxRate}
              onChange={e => UpdateState("taxRate", e.target.value)}
              className={classes.clearMarginPadding}
            />
          )}
        </Grid>
        <Grid item xs={2}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              disableToolbar
              variant="inline"
              format="dd/MM/yyyy"
              margin="none"
              label="客户交期"
              value={customerSubmitDate}
              id="customer-submit-date"
              onChange={date => UpdateState("customerSubmitDate", date)}
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
              id="delivery-date"
              value={deliveryDate}
              onChange={date => UpdateState("deliveryDate", date)}
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
    purchasers: POReducer.purchasers,
    selectedPurchaser: POReducer.selectedPurchaser,
    customerContract: POReducer.customerContract,
    currencies: POReducer.currencies,
    selectedCurrency: POReducer.selectedCurrency,
    exchangeRate: POReducer.exchangeRate,
    tax: POReducer.tax,
    taxRate: POReducer.taxRate,
    customerSubmitDate: POReducer.customerSubmitDate,
    deliveryDate: POReducer.deliveryDate
  };
};

export default connect(mapStateToProps, { GetCustomers, UpdateState, GetPurchaser, GetCurrency, ToggleState })(POInfo);
