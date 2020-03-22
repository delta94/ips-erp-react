import React from "react";
import { connect } from "react-redux";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Sidebar from "../sidebar";

import { ToggleState } from "../../actions/header_actions";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  title: {
    flexGrow: 1
  },
  loginBtn: {
    color: "white",
    textDecoration: "none"
  }
}));

function Header(props) {
  const classes = useStyles();

  // vars from reducer
  const { displayName, isAuthenticated } = props;
  // methods from action
  const { ToggleState } = props;
  return (
    <div className={classes.root}>
      <Sidebar />
      <AppBar position="static">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={() => ToggleState("openSidebar")}
            // onClick={handleDrawerOpen}
            edge="start"
            // className={clsx(classes.menuButton, open && classes.hide)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            主页
          </Typography>
          {isAuthenticated ? (
            <Typography>{displayName}</Typography>
          ) : (
            <Link className={classes.loginBtn} to="/login">
              登录
            </Link>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
}

const mapStateToProps = ({ HeaderReducer }) => {
  return {
    displayName: HeaderReducer.displayName,
    isAuthenticated: HeaderReducer.isAuthenticated
  };
};

export default connect(mapStateToProps, { ToggleState })(Header);
