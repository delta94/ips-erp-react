import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { ListItem, ListItemText, ListItemIcon } from "@material-ui/core";
import { Link } from "react-router-dom";
import ShoppingBasketIcon from "@material-ui/icons/ShoppingBasket";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  link: {
    textDecoration: "none",
    color: "rgba(0,0,0,0.87)",
  },
  listItem: {
    paddingLeft: 20,
  },
}));

export default function SimpleExpansionPanel() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <ExpansionPanel square>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
          <ListItem>
            <ListItemIcon>
              <ShoppingBasketIcon />
            </ListItemIcon>
            <ListItemText primary="下单操作" />
          </ListItem>
        </ExpansionPanelSummary>
        <ListItem button>
          <ListItemIcon>
            <ShoppingBasketIcon />
          </ListItemIcon>
          <Link to="/" className={classes.link}>
            <ListItemText primary="下单" />
          </Link>
        </ListItem>
      </ExpansionPanel>
      <ExpansionPanel square>
        <ExpansionPanelSummary aria-controls="panel1a-content" id="panel1a-header">
          <ListItem>
            <ListItemIcon>
              <ShoppingBasketIcon />
            </ListItemIcon>
            <Link to="/" className={classes.link}>
              <ListItemText primary="下单" />
            </Link>
          </ListItem>
        </ExpansionPanelSummary>
      </ExpansionPanel>
      <ExpansionPanel square>
        <ExpansionPanelSummary aria-controls="panel1a-content" id="panel1a-header">
          <ListItem>
            <ListItemIcon>
              <ShoppingBasketIcon />
            </ListItemIcon>
            <Link to="/" className={classes.link}>
              <ListItemText primary="下单" />
            </Link>
          </ListItem>
        </ExpansionPanelSummary>
      </ExpansionPanel>
    </div>
  );
}
