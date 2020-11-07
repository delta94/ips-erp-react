import React, { useRef } from "react";
import { connect } from "react-redux";
import { Table, Button, Descriptions } from "antd";
import ReactToPrint from "react-to-print";
import Barcode from "react-barcode";
import { PrinterOutlined } from "@ant-design/icons";

const { Column, ColumnGroup } = Table;

class ComponentToPrint extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: [] };
  }

  render() {
    return (
      <div>
        <Descriptions title="工艺流程表">
          <Descriptions.Item label="交期">
            {new Date(this.props.workOrder.internal_deadline).toLocaleString("zh-cn", {
              hour12: false,
            })}
          </Descriptions.Item>
          <Descriptions.Item label="下单数量">{this.props.workOrder.work_order_items.qty}</Descriptions.Item>
          <Descriptions.Item label="材质（硬度）">
            {this.props.selected_material.name} ({this.props.selected_material.hardness})
          </Descriptions.Item>
        </Descriptions>
        <Barcode
          value={
            this.props.workOrder.work_order_items.sub_work_order_num !== undefined
              ? this.props.workOrder.work_order_items.sub_work_order_num
              : "PLACEHOLDER"
          }
          width={2}
          height={50}
          fontSize={18}
        />
        <Table dataSource={this.props.crafts} rowKey="id" pagination={false}>
          <Column title="工序" render={(text, record, index) => <div>{index + 1}</div>} />
          <Column title="部门" dataIndex="department" key="department" />
          <Column title="数量" dataIndex="qty" key="qty" />
          <Column title="工时" dataIndex="estimate" key="estimate" />
          <ColumnGroup title="预计工时">
            <Column title="开始" dataIndex="start_time_display" key="start_time_display" />
            <Column title="完成" dataIndex="end_time_display" key="end_time_display" />
          </ColumnGroup>
          <ColumnGroup title="实际工时">
            <Column title="日期" />
            <Column title="日期" />
          </ColumnGroup>
          <Column title="加工者" />
          <Column title="品检" />
        </Table>
      </div>
    );
  }
}

const SOPForm = props => {
  const componentRef = useRef();
  return (
    <React.Fragment>
      <ReactToPrint
        trigger={() => (
          <Button type="primary" icon={<PrinterOutlined />}>
            打印
          </Button>
        )}
        content={() => componentRef.current}
      />

      <div style={{ display: "none" }}>
        <ComponentToPrint ref={componentRef} {...props} />
      </div>
    </React.Fragment>
  );
};

const mapStateToProps = ({ CraftScheduleReducer }) => {
  return {
    data: CraftScheduleReducer.data,
    crafts: CraftScheduleReducer.crafts,
    selected_material: CraftScheduleReducer.selected_material,
  };
};

export default connect(mapStateToProps, null)(SOPForm);
