import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import {
  Drawer,
  AppBar,
  Toolbar,
  // List,
  Typography,
  Divider,
  IconButton,
  // ListItem,
  // ListItemText,
} from "@material-ui/core";
import { DRAWER_WIDTH } from "../../utils/constants";
import MenuIcon from "@material-ui/icons/Menu";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

import Menu from "./menu";

import { toggleState, clickLogout, GetSidebarItems } from "../../actions/header_actions";

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
    width: `calc(100% - ${DRAWER_WIDTH}px)`,
    marginLeft: DRAWER_WIDTH,
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
    width: DRAWER_WIDTH,
    flexShrink: 0,
  },
  drawerPaper: {
    width: DRAWER_WIDTH,
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

function Header(props) {
  // vars from reducers
  const { openSidebar, sidebarItems, department, isAuthenticated, username } = props;

  // methods from actions
  const { toggleState, GetSidebarItems, clickLogout } = props;

  useEffect(() => {
    if (isAuthenticated) {
      GetSidebarItems();
    }
    return () => {};
  }, [GetSidebarItems, isAuthenticated]);

  // const list = () => (
  //   <div className={classes.list} role="presentation">
  //     <List>
  //       {sidebarItems.map(item => {
  //         if (item.allow_department.includes(department)) {
  //           return (
  //             <ListItem key={item.item} button>
  //               {/* <ListItem key={item.item} button onClick={() => ToggleState("openSidebar")}> */}
  //               <Link to={item.url} className={classes.link}>
  //                 <ListItemText primary={item.item} className={classes.listItem} />
  //               </Link>
  //             </ListItem>
  //           );
  //         } else {
  //           return null;
  //         }
  //       })}
  //     </List>
  //     <Divider />
  //   </div>
  // );

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
              onClick={() => toggleState("openSidebar")}
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
        anchor="left"
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
        {/* {list()} */}
        {/* https://medium.com/@modularcoder/reactjs-multi-level-sidebar-navigation-menu-with-typescrip-materialui-251943c12dda */}
        {/* refer to this link */}
        <Menu appMenuItems={sidebarItems} department={department} />
      </Drawer>
    </div>
  );
}

const mapStateToProps = ({ HeaderReducer }) => {
  return {
    openSidebar: HeaderReducer.openSidebar,
    sidebarItems: HeaderReducer.sidebarItems,
    department: HeaderReducer.department,
    isAuthenticated: HeaderReducer.isAuthenticated,
    username: HeaderReducer.username,
  };
};

export default connect(mapStateToProps, { toggleState, GetSidebarItems, clickLogout })(Header);
