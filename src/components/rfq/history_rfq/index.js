import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Card } from "antd";
import RFQHistoryHeader from "./header";
import Info from "./info";
import Option from "./option";
import Content from "./content";

import { resetState } from "../../../actions/rfq_actions";

const RFQHistory = props => {
  const { showContent } = props;
  const { resetState } = props;

  useEffect(() => {
    return () => {
      resetState();
    };
  }, [resetState]);
  return (
    <Card>
      {!showContent ? (
        <RFQHistoryHeader />
      ) : (
        <>
          <Info />
          <Option />
          <Content />
        </>
      )}
    </Card>
  );
};

const mapStateToProps = ({ RFQReducer }) => {
  return {
    showContent: RFQReducer.showContent,
  };
};

export default connect(mapStateToProps, { resetState })(RFQHistory);
