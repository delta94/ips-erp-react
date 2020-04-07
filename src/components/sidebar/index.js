import React, { useEffect } from "react";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Cookies from "js-cookie";

import { ToggleState } from "../../actions/header_actions";
import { GetSidebarItems } from "../../actions/sidebar_actions";

const useStyles = makeStyles({
  list: {
    width: 250,
  },
  link: {
    textDecoration: "none",
    color: "rgba(0,0,0,0.87)",
  },
  listItem: {
    paddingLeft: 30,
  },
});

function Sidebar(props) {
  const classes = useStyles();

  // vars from reducers
  const { openSidebar, sidebarItems } = props;

  // methods from actions
  const { ToggleState, GetSidebarItems } = props;

  useEffect(() => {
    GetSidebarItems();
    return () => {};
  }, [GetSidebarItems]);
  const list = () => (
    <div className={classes.list} role="presentation">
      <List>
        {sidebarItems.map((item) => {
          if (item.allow_department.includes(Cookies.get("OU"))) {
            return (
              <ListItem key={item.item} button onClick={() => ToggleState("openSidebar")}>
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

  return (
    <div>
      <React.Fragment>
        <Drawer anchor={"left"} open={openSidebar} onClose={() => ToggleState("openSidebar")}>
          {list()}
        </Drawer>
      </React.Fragment>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    openSidebar: state.HeaderReducer.openSidebar,
    sidebarItems: state.SidebarReducer.sidebarItems,
    department: state.HeaderReducer.department,
  };
};

export default connect(mapStateToProps, { ToggleState, GetSidebarItems })(Sidebar);
