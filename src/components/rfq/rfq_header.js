import React, { useEffect } from "react";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
// import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

import { GetCustomers, GetCurrency, updateObjectState } from "../../actions/rfq_actions";

const useStyles = makeStyles(theme => ({
  form150: {
    margin: theme.spacing(1),
    minWidth: 70,
  },
  empty: {
    marginTop: theme.spacing(2),
  },
  root: {
    margin: 10,
    padding: 10,
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

const RFQHeader = props => {
  const classes = useStyles();

  // vars from reducer
  const { customers, rfq } = props;

  // methods from actions
  const { GetCustomers, updateObjectState, GetCurrency } = props;

  useEffect(() => {
    GetCustomers();
    GetCurrency();
  }, [GetCustomers, GetCurrency]);

  return (
    <Paper className={classes.root}>
      <Grid container alignItems="center" justify="space-around">
        <Grid item xs={4} md={1}>
          <FormControl className={classes.form150}>
            <InputLabel shrink>客户代码</InputLabel>
            <Select
              value={rfq.customer}
              onChange={e => updateObjectState("rfq", "customer", e.target.value)}
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
        <Grid item xs={4} md={2}>
          <FormControl className={classes.form150}>
            <InputLabel shrink>邮件/RFQ号</InputLabel>
            <TextField
              className={classes.empty}
              value={rfq.email_rfq_num}
              onChange={e => updateObjectState("rfq", "email_rfq_num", e.target.value)}
            />
          </FormControl>
        </Grid>
        <Grid item xs={4} md={2}>
          <FormControl className={classes.form150}>
            <InputLabel shrink>姓名</InputLabel>
            <TextField
              className={classes.empty}
              value={rfq.customer_name}
              onChange={e => updateObjectState("rfq", "customer_name", e.target.value)}
            />
          </FormControl>
        </Grid>
        <Grid item xs={4} md={2}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              disableToolbar
              variant="inline"
              format="dd/MM/yyyy"
              margin="none"
              label="日期"
              value={rfq.email_rfq_date}
              id="po-submit-date"
              onChange={date => updateObjectState("rfq", "email_rfq_date", date)}
              KeyboardButtonProps={{
                "aria-label": "change date",
              }}
            />
          </MuiPickersUtilsProvider>
        </Grid>
        <Grid item xs={4} md={2}>
          <FormControl className={classes.form150}>
            <InputLabel shrink>报价单号</InputLabel>
            <TextField
              className={classes.empty}
              value={rfq.rfq_num}
              onChange={e => updateObjectState("rfq", "rfq_num", e.target.value)}
            />
          </FormControl>
        </Grid>
        <Grid item xs={4} md={2}>
          <FormControl className={classes.form150}>
            <InputLabel shrink>交期 ( 含运输 )</InputLabel>
            <TextField
              className={classes.empty}
              value={rfq.delivery_date}
              onChange={e => updateObjectState("rfq", "delivery_date", e.target.value)}
            />
          </FormControl>
        </Grid>
        {/* <Grid item xs={2}>
              <Button size="small" color="primary" fullWidth variant="contained">
                创建文件夹
              </Button>
              <Button size="small" color="primary" fullWidth variant="contained">
                保存
              </Button>
            </Grid> */}
      </Grid>
    </Paper>
  );
};

const mapStateToProps = ({ RFQReducer }) => {
  return {
    customers: RFQReducer.customers,
    rfq: RFQReducer.rfq,
  };
};

const mapDispatchToProps = dispatch => ({
  GetCustomers: () => dispatch(GetCustomers()),
  updateObjectState: (name, key, value) => dispatch(updateObjectState(name, key, value)),
  GetCurrency: () => dispatch(GetCurrency()),
});

export default connect(mapStateToProps, mapDispatchToProps)(RFQHeader);
