import React, { useEffect } from "react";
// import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
// import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
// import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

import { connect } from "react-redux";
import { Link } from "react-router-dom";

import { ToggleState, clickLogout, GetSidebarItems } from "../../actions/header_actions";
// import { GetSidebarItems } from "../../actions/sidebar_actions";

const drawerWidth = 136;

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
  },
  appBar: {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
  },
  link: {
    textDecoration: "none",
    color: "rgba(0,0,0,0.87)",
  },
  listItem: {
    paddingLeft: 20,
  },
  title: {
    flexGrow: 1,
  },
  headerLink: {
    color: "white",
    textDecoration: "none",
  },
}));

function Sidebar(props) {
  // vars from reducers
  const { openSidebar, sidebarItems, department, isAuthenticated, username } = props;

  // methods from actions
  const { ToggleState, GetSidebarItems, clickLogout } = props;

  useEffect(() => {
    // console.log("ddd");
    if (isAuthenticated) {
      GetSidebarItems();
    }
    return () => {};
  }, [GetSidebarItems, isAuthenticated]);

  const list = () => (
    <div className={classes.list} role="presentation">
      <List>
        {sidebarItems.map(item => {
          if (item.allow_department.includes(department)) {
            return (
              <ListItem key={item.item} button>
                {/* <ListItem key={item.item} button onClick={() => ToggleState("openSidebar")}> */}
                <Link to={item.url} className={classes.link}>
                  <ListItemText primary={item.item} className={classes.listItem} />
                </Link>
              </ListItem>
            );
          } else {
            return null;
          }
        })}
      </List>
      <Divider />
    </div>
  );
  const classes = useStyles();
  const theme = useTheme();

  return (
    <div className={classes.root}>
      <AppBar
        position="fixed"
        // className={clsx(classes.appBar, {
        //   [classes.appBarShift]: openSidebar,
        // })}
        style={{ zIndex: theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          {isAuthenticated && (
            <IconButton
              // className={clsx(classes.menuButton, openSidebar && classes.hide)}
              color="inherit"
              aria-label="open drawer"
              onClick={() => ToggleState("openSidebar")}
              edge="start"
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" className={classes.title}>
            <Link to="/" className={classes.headerLink}>
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
            <Link className={classes.headerLink} to="/login">
              登录
            </Link>
          )}
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        // variant="permanent"
        anchor="left"
        // style={{ display: openSidebar ? "block" : "none" }}
        open={openSidebar}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          {/* <IconButton onClick={() => ToggleState("openSidebar")}>
            {theme.direction === "ltr" ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton> */}
        </div>
        <Divider />
        {list()}
      </Drawer>
    </div>
  );
}

const mapStateToProps = state => {
  return {
    openSidebar: state.HeaderReducer.openSidebar,
    sidebarItems: state.HeaderReducer.sidebarItems,
    department: state.HeaderReducer.department,
    isAuthenticated: state.HeaderReducer.isAuthenticated,
    username: state.HeaderReducer.username,
  };
};

export default connect(mapStateToProps, { ToggleState, GetSidebarItems, clickLogout })(Sidebar);
