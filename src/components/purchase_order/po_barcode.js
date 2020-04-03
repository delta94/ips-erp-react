import React, { useRef } from "react";
import { connect } from "react-redux";
import { div, Button } from "@material-ui/core";
import Barcode from "react-barcode";
import ReactToPrint from "react-to-print";
import "./style.css";

class POBarcodeContent extends React.PureComponent {
  render() {
    const { work_order_items, customer_dateline, internal_dateline } = this.props;
    return (
      <React.Fragment>
        <div style={{ width: 150 }} className="print-source">
          {work_order_items.map(item => {
            return (
              <React.Fragment key={item.item_id}>
                <div align="center">管制章</div>
                <Barcode value={item.item_id} width={1} height={10} fontSize={10} />
                <div>
                  数量: {item.qty} {item.unit}
                </div>
                <div>交期: {internal_dateline.toISOString().split("T")[0]}</div>

                <div>下单: {customer_dateline.toISOString().split("T")[0]}</div>
                <div>图号: {item.item_num}</div>
                <hr />
              </React.Fragment>
            );
          })}
        </div>
      </React.Fragment>
    );
  }
}

function POBarcode(props) {
  const componentRef = useRef();

  return (
    <div>
      <ReactToPrint
        trigger={() => (
          <Button variant="contained" color="primary">
            打印标签
          </Button>
        )}
        content={() => componentRef.current}
      />
      <POBarcodeContent {...props} ref={componentRef} />
    </div>
  );
}

const mapStateToProps = ({ POReducer }) => {
  return {
    work_order_items: POReducer.work_order_items,
    customer_dateline: POReducer.customer_dateline,
    internal_dateline: POReducer.internal_dateline
  };
};

export default connect(mapStateToProps, null)(POBarcode);
