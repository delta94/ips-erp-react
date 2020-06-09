import React from "react";
import { connect } from "react-redux";
import { Divider, Row, Col, Button } from "antd";
import ImportBtn from "../../common/import_btn_antd";

import { uploadFile, PostRFQ, newRFQ } from "../../../actions/rfq_actions";

const RFQOperation = props => {
  const { form, headerForm } = props;
  const { uploadFile, PostRFQ, newRFQ } = props;
  return (
    <>
      <Divider orientation="left" style={{ color: "#333", fontWeight: "normal" }}>
        操作
      </Divider>
      <Row gutter={16} justify="start">
        <Col>
          <ImportBtn block type="primary" btnText="上传Excel" uploadFile={uploadFile} form={form} />
        </Col>
        <Col>
          <Button
            block
            type="primary"
            onClick={async () => {
              try {
                await headerForm.validateFields();
                const row = await form.validateFields();
                let rfq_items = [];
                let item = {};
                let counter = 0;
                let seq = 1;
                for (let key in row) {
                  let n = key.split("-")[1];
                  if (n === "remark" && row[key] === undefined) {
                    item[n] = "";
                  } else {
                    item[n] = row[key];
                  }
                  counter += 1;
                  if (counter === 4) {
                    item.seq = seq;
                    rfq_items.push(item);
                    counter = 0;
                    seq += 1;
                    item = {};
                  }
                }
                PostRFQ(rfq_items);
              } catch (errInfo) {
                console.log("Validate Failed:", errInfo);
              }
            }}
          >
            保存
          </Button>
        </Col>
        <Col>
          <Button block type="primary">
            创建文件夹
          </Button>
        </Col>
        <Col>
          <Button block type="primary" onClick={newRFQ}>
            新报价
          </Button>
        </Col>
      </Row>
    </>
  );
};

export default connect(null, { uploadFile, PostRFQ, newRFQ })(RFQOperation);
