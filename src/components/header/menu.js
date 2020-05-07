import React, { forwardRef } from "react";
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

  const MenuItemRoot = () => {
    return (
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
  };

  const MenuItemChildren = () => {
    if (isExpandable) {
      return (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <Divider />
          <List component="div" disablePadding>
            {items.map((item, index) => (
              <AppMenuItem {...item} key={index} />
            ))}
          </List>
        </Collapse>
      );
    } else {
      return null;
    }
  };

  return (
    <>
      {MenuItemRoot()}
      {MenuItemChildren()}
    </>
  );
};

// const appMenuItems = [
//   {
//     name: "工号状态",
//     link: "/work_orders",
//     allow_department: ["IT", "管理层"],
//     icon: "dashboard",
//   },
//   {
//     name: "下单操作",
//     allow_department: ["IT", "管理层"],
//     icon: "dashboard",
//     items: [
//       {
//         name: "业务下单",
//         link: "/work_orders",
//         icon: "dashboard",
//       },
//     ],
//   },
// ];

// const department = "IT";
const AppMenu = props => {
  const { appMenuItems, department } = props;
  const classes = useStyles();

  return (
    // <List component="nav" className={classes.appMenu} disablePadding>
    //   {appMenuItems.map((item, index) => (
    //     <AppMenuItem {...item} key={index} />
    //   ))}
    // </List>
    <List component="nav" className={classes.appMenu} disablePadding>
      {appMenuItems.map((item, index) => {
        if (item.allow_department.includes(department)) {
          return <AppMenuItem {...item} key={index} />;
        } else {
          return null;
        }
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

export default AppMenu;
