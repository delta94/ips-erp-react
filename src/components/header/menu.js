import React, { forwardRef, useEffect } from "react";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Icon from "@material-ui/core/Icon";

import { NavLink } from "react-router-dom";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import Collapse from "@material-ui/core/Collapse";

import IconExpandLess from "@material-ui/icons/ExpandLess";
import IconExpandMore from "@material-ui/icons/ExpandMore";

import { GetSidebarItems } from "../../actions/header_actions";

const AppMenuItemComponent = props => {
  const { className, onClick, link, children } = props;

  // If link is not set return the orinary ListItem
  if (!link || typeof link !== "string") {
    return <ListItem button className={className} children={children} onClick={onClick} />;
  }

  // Return a LitItem with a link component
  return (
    <ListItem
      button
      className={className}
      children={children}
      component={forwardRef((props, ref) => (
        <NavLink exact {...props} innerRef={ref} />
      ))}
      to={link}
    />
  );
};

const AppMenuItem = props => {
  const { name, icon, items = [] } = props;
  const isExpandable = items && items.length > 0;
  const [open, setOpen] = React.useState(false);

  function handleClick() {
    setOpen(!open);
  }

  const MenuItemRoot = (
    // <ListItem component={!isExpandable ? NavLink : "div"} button onClick={handleClick}>
    <AppMenuItemComponent link={props.link} onClick={handleClick}>
      {/* Display an icon if any */}
      {!!icon && (
        <ListItemIcon>
          {/* <Icon /> */}
          <Icon>{icon}</Icon>
        </ListItemIcon>
      )}
      <ListItemText primary={name} inset={!Icon} />
      {/* Display the expand menu if the item has children */}
      {isExpandable && !open && <IconExpandMore />}
      {isExpandable && open && <IconExpandLess />}
      {/* </ListItem> */}
    </AppMenuItemComponent>
  );

  const MenuItemChildren = isExpandable ? (
    <Collapse in={open} timeout="auto" unmountOnExit>
      <Divider />
      <List component="div" disablePadding>
        {items.map((item, index) => (
          <AppMenuItem {...item} key={index} />
        ))}
      </List>
    </Collapse>
  ) : null;

  return (
    <>
      {MenuItemRoot}
      {MenuItemChildren}
    </>
  );
};

const AppMenu = props => {
  const classes = useStyles();

  const { sidebarItems, department, isAuthenticated } = props;
  const { GetSidebarItems } = props;

  useEffect(() => {
    if (isAuthenticated) {
      GetSidebarItems();
    }
    return () => {};
  }, [GetSidebarItems, isAuthenticated]);

  return (
    <List component="nav" className={classes.appMenu} disablePadding>
      {sidebarItems.map((item, index) => {
        if (item.allow_department.includes(department)) {
          return <AppMenuItem {...item} key={index} />;
        }
        return null;
      })}
    </List>
  );
};

const drawerWidth = 230;

const useStyles = makeStyles(() => ({
  appMenu: {
    width: "100%",
  },
  navList: {
    width: drawerWidth,
  },
}));

const mapStateToProps = ({ HeaderReducer }) => {
  return {
    sidebarItems: HeaderReducer.sidebarItems,
    department: HeaderReducer.department,
    isAuthenticated: HeaderReducer.isAuthenticated,
  };
};

export default connect(mapStateToProps, { GetSidebarItems })(AppMenu);
