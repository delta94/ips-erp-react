import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Card } from "antd";
import StatisticsPOHeader from "./header";
import { resetState } from "../../../actions/po_actions";

const StatisticsPO = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(resetState());
    };
  }, []);
  return (
    <Card>
      <StatisticsPOHeader />
    </Card>
  );
};

export default StatisticsPO;
