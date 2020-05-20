import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Card } from "antd";
import RFQUndoneHeader from "./header";
import RFQUndoneContent from "./content";

import { resetState } from "../../../actions/rfq_actions";

const RFQUndone = props => {
  const { showContent } = props;
  const { resetState } = props;

  useEffect(() => {
    return () => {
      resetState();
    };
  }, [resetState]);
  return <Card>{!showContent ? <RFQUndoneHeader /> : <RFQUndoneContent />}</Card>;
};

const mapStateToProps = ({ RFQReducer }) => {
  return {
    showContent: RFQReducer.showContent,
  };
};

export default connect(mapStateToProps, { resetState })(RFQUndone);
