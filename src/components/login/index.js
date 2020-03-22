import React from "react";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Container, Paper, Typography } from "@material-ui/core";
import { TextField, Button } from "@material-ui/core";
import { UpdateState, PostLogin } from "../../actions/login_actions";

const useStyle = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(10)
  }
}));
function Login(props) {
  // vars from reducer
  const { username, password, error } = props;
  // methods from actions
  const { UpdateState, PostLogin } = props;
  const classes = useStyle();
  return (
    <Container maxWidth="xs" classes={{ root: classes.root }}>
      <Paper>
        <Grid container spacing={4} justify="center">
          <Grid item xs={8}>
            <Typography variant="h4" component="h4" align="center" color="primary">
              欢迎回来
            </Typography>
          </Grid>
          <Grid item xs={8}>
            <TextField
              error={username.length < 3 && error}
              value={username}
              fullWidth
              label="用户名"
              required
              inputProps={{
                "aria-label": "用户名"
              }}
              onChange={e => UpdateState("username", e.target.value)}
              helperText={error && username.length < 3 && "用户名不能小于3位"}
            />
          </Grid>
          <Grid item xs={8}>
            <TextField
              error={password.length < 8 && error}
              value={password}
              fullWidth
              label="密码"
              type="password"
              required
              inputProps={{
                "aria-label": "密码"
              }}
              onChange={e => UpdateState("password", e.target.value)}
              helperText={error && password.length < 8 && "密码不能小于8位"}
            />
          </Grid>
          <Grid item xs={8}>
            <Button variant="contained" fullWidth color="primary" onClick={() => PostLogin(props.history)}>
              登录
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}

const mapStateToProps = ({ LoginReducer }) => {
  return {
    username: LoginReducer.username,
    password: LoginReducer.password,
    error: LoginReducer.error
  };
};

// const mapDispatchToprops = dispatch => ({
//   UpdateState: (name, value) => {
//     dispatch(UpdateState(name, value));
//   }
// });

export default connect(mapStateToProps, { UpdateState, PostLogin })(Login);
