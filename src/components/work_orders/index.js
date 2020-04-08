import React, { useEffect } from "react";
import { connect } from "react-redux";
import MaterialTable from "material-table";

import { GetInternalWorkOrdersItems } from "../../actions/work_orders_actions";
import { WORK_ORDER_STATE_FILTER } from "../../utils/constants";

function WorkOrderStatus(props) {
  // vars from reducers
  const { data } = props;
  console.log(data);
  // methods from actions
  const { GetInternalWorkOrdersItems } = props;

  useEffect(() => {
    GetInternalWorkOrdersItems();
  }, [GetInternalWorkOrdersItems]);
  return (
    <div style={{ maxWidth: "100%" }}>
      <MaterialTable
        columns={[
          { title: "工号", field: "item_id" },
          // { title: "PO#", field: "customer_po" },
          {
            title: "下单日期",
            field: "po_submit_date",
            render: (rowData) => <div>{rowData.po_submit_date.split("T")[0]}</div>,
          },
          {
            title: "厂内交期",
            field: "internal_dateline",
            render: (rowData) => <div>{rowData.internal_dateline.split("T")[0]}</div>,
          },
          {
            title: "下单人",
            field: "submit_by",
          },
          {
            title: "处理人",
            field: "process_by",
          },
          { title: "状态", field: "state", lookup: WORK_ORDER_STATE_FILTER },
        ]}
        options={{ pageSize: 10, filtering: true }}
        localization={{
          body: {
            emptyDataSourceMessage: "无",
          },
          toolbar: {
            searchTooltip: "搜索",
            searchPlaceholder: "搜索",
          },
          pagination: {
            labelRowsSelect: "行每页",
            firstTooltip: "第一页",
            previousTooltip: "上一页",
            nextTooltip: "下一页",
            lastTooltip: "最后页",
          },
        }}
        data={data}
        // detailPanel={rowData => {
        //   return rowData.work_order_items.map(item => {
        //     return (
        //       <div>
        //         {item.item_id} : {item.state}
        //       </div>
        //     );
        //   });
        // }}
        title="订单管理"
      />
    </div>
  );
}

const mapStateToProps = ({ WorkOrderReducer }) => {
  return {
    data: WorkOrderReducer.data,
  };
};

export default connect(mapStateToProps, { GetInternalWorkOrdersItems })(WorkOrderStatus);
