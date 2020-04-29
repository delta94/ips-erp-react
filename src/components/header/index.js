import React, { useEffect } from "react";
import { connect } from "react-redux";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import Sidebar from "../sidebar";
import Cookies from "js-cookie";

import { ToggleState, clickLogout } from "../../actions/header_actions";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
  link: {
    color: "white",
    textDecoration: "none",
  },
}));

function Header(props) {
  const classes = useStyles();

  // methods from action
  const { ToggleState, clickLogout, isAuthenticated, username, department } = props;
  return (
    <div className={classes.root}>
      {isAuthenticated && <Sidebar />}
      <AppBar position="static">
        <Toolbar>
          {isAuthenticated && (
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
          )}
          <Typography variant="h6" className={classes.title}>
            <Link to="/" className={classes.link}>
              主页
            </Link>
          </Typography>
          {department ? (
            <React.Fragment>
              <Typography>
                {username} - {department}
              </Typography>
              <IconButton color="inherit" aria-label="logout" onClick={() => clickLogout()}>
                <ExitToAppIcon />
              </IconButton>
            </React.Fragment>
          ) : (
              <Link className={classes.link} to="/login">
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
    isAuthenticated: HeaderReducer.isAuthenticated,
    username: HeaderReducer.username,
    department: HeaderReducer.department,
  };
};

export default connect(mapStateToProps, { ToggleState, clickLogout })(Header);
