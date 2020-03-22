import React, { useEffect } from "react";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import MailIcon from "@material-ui/icons/Mail";

import { ToggleState } from "../../actions/header_actions";
import { GetSidebarItems } from "../../actions/sidebar_actions";

const useStyles = makeStyles({
  list: {
    width: 250
  }
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
        {sidebarItems.map((item, index) => (
          <ListItem button key={item.item} onClick={() => ToggleState("openSidebar")}>
            <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
            <ListItemText primary={item.item} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {["All mail", "Trash", "Spam"].map((text, index) => (
          <ListItem
            button
            key={text}
            onClick={() => {
              window.open("file://c:\\Windows", "explorer");
            }}
          >
            <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
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

const mapStateToProps = state => {
  return {
    openSidebar: state.HeaderReducer.openSidebar,
    sidebarItems: state.SidebarReducer.sidebarItems
  };
};

export default connect(mapStateToProps, { ToggleState, GetSidebarItems })(Sidebar);