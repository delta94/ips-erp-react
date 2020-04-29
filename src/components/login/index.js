import React from "react";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Link from "@material-ui/core/Link";
import { Grid, Container, Paper, Typography } from "@material-ui/core";
import { TextField, Button } from "@material-ui/core";
import { UpdateState, PostLogin, ResetPwd } from "../../actions/login_actions";

const useStyle = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(10),
  },
}));
function Login(props) {
  const classes = useStyle();

  // vars from reducer
  const { username, password, error, reset } = props;
  // methods from actions
  const { UpdateState, PostLogin, ResetPwd } = props;

  const renderBtn = () => {
    if (reset) {
      return (
        <React.Fragment>
          <Grid item xs={8}>
            <Link
              component="button"
              onClick={() => {
                UpdateState("reset", false);
              }}
            >
              返回登陆
            </Link>
          </Grid>
          <Grid item xs={8}>
            <Button variant="contained" fullWidth color="primary" onClick={() => ResetPwd()}>
              提交
            </Button>
          </Grid>
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
          <Grid item xs={8}>
            <Link
              component="button"
              onClick={() => {
                UpdateState("reset", true);
              }}
            >
              重置密码
            </Link>
          </Grid>
          <Grid item xs={8}>
            <Button variant="contained" fullWidth color="primary" onClick={() => PostLogin()}>
              登录
            </Button>
          </Grid>
        </React.Fragment>
      );
    }
  };

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
                "aria-label": "用户名",
              }}
              onChange={(e) => UpdateState("username", e.target.value)}
              helperText={error && username.length < 3 && "用户名不能小于3位"}
            />
          </Grid>
          {!reset && (
            <Grid item xs={8}>
              <TextField
                error={password.length < 8 && error}
                value={password}
                fullWidth
                label="密码"
                type="password"
                required
                inputProps={{
                  "aria-label": "密码",
                }}
                onChange={(e) => UpdateState("password", e.target.value)}
                helperText={error && password.length < 8 && "密码不能小于8位"}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    PostLogin();
                  }
                }}
              />
            </Grid>
          )}
          {renderBtn()}
        </Grid>
      </Paper>
    </Container>
  );
}

const mapStateToProps = ({ LoginReducer }) => {
  return {
    username: LoginReducer.username,
    password: LoginReducer.password,
    error: LoginReducer.error,
    reset: LoginReducer.reset,
  };
};

// const mapDispatchToprops = dispatch => ({
//   UpdateState: (name, value) => {
//     dispatch(UpdateState(name, value));
//   }
// });

export default connect(mapStateToProps, { UpdateState, PostLogin, ResetPwd })(Login);
