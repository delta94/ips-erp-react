import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Checkbox from "@material-ui/core/Checkbox";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Typography from "@material-ui/core/Typography";

import { updateObjectState } from "../../actions/rfq_actions";

const useStyle = makeStyles(() => ({
  root: {
    padding: "0 10px",
  },
  typo: {
    padding: 9,
  },
}));

const inputProps = {
  style: {
    marginBottom: 4,
  },
};

const RFQOption = props => {
  const classes = useStyle();
  // vars from reducer
  const { rfq } = props;

  // methods from actions
  const { updateObjectState } = props;
  return (
    <Container maxWidth="xs">
      <Paper className={classes.root}>
        <Grid container justify="space-around" alignContent="center" spacing={1}>
          <Grid item xs={4} align="center">
            <FormControlLabel
              control={
                <Checkbox
                  value={rfq.shipping_fee_apply}
                  onChange={() => updateObjectState("rfq", "shipping_fee_apply", !rfq.shipping_fee_apply)}
                />
              }
              label="运费"
            />
          </Grid>
          <Grid item xs={4} align="center">
            <FormControlLabel
              control={
                <Checkbox
                  value={rfq.discount_rate_apply}
                  onChange={() => updateObjectState("rfq", "discount_rate_apply", !rfq.discount_rate_apply)}
                />
              }
              label="折扣"
            />
            <TextField
              value={rfq.discount_rate}
              onChange={e => updateObjectState("rfq", "discount_rate", e.target.value)}
              disabled={!rfq.discount_rate_apply}
            />
          </Grid>
          <Grid item xs={4} align="center">
            <Typography className={classes.typo}>备注</Typography>
            <TextField
              inputProps={inputProps}
              value={rfq.remark}
              onChange={e => updateObjectState("rfq", "remark", e.target.value)}
            />
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

const mapStateToProps = ({ RFQReducer }) => {
  return {
    rfq: RFQReducer.rfq,
  };
};

const mapDispatchToProps = dispatch => ({
  updateObjectState: (name, key, value) => dispatch(updateObjectState(name, key, value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RFQOption);
