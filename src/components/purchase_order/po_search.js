import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import SearchBar from "material-ui-search-bar";

import { updateState, GetInternalWorkOrderItem } from "../../actions/po_actions";

const useStyle = makeStyles(() => ({
  root: {
    margin: "0 auto",
    marginTop: 10,
    maxWidth: 600,
  },
}));

function POSearch(props) {
  const classes = useStyle();

  // vars from reducer
  const { search } = props;

  // methods from actions
  const { updateState, GetInternalWorkOrderItem } = props;

  return (
    <React.Fragment>
      <SearchBar
        className={classes.root}
        value={search}
        placeholder="输入工号"
        onChange={v => updateState("search", v)}
        onRequestSearch={() => GetInternalWorkOrderItem(search)}
      />
    </React.Fragment>
  );
}

const mapStateToProps = ({ POReducer }) => {
  return {
    search: POReducer.search,
  };
};

export default connect(mapStateToProps, { updateState, GetInternalWorkOrderItem })(POSearch);
