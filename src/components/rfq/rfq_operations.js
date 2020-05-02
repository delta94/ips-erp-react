import React from "react";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Button } from "@material-ui/core/";
import AddIcon from "@material-ui/icons/Add";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import SaveIcon from "@material-ui/icons/Save";

import ImportBtn from "../common/import_btn";

import { addRfqItem, uploadFile } from "../../actions/rfq_actions";
const useStyle = makeStyles(() => ({
  root: {
    margin: 10,
    padding: 10,
    marginRight: 40,
  },
}));

const RFQOperations = props => {
  const classes = useStyle();

  const { rfq } = props;

  const { addRfqItem, uploadFile } = props;

  const renderOperation = () => {
    if (rfq.customer) {
      return (
        <Grid container alignItems="center" justify="flex-end" spacing={4}>
          <Grid item>
            <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={addRfqItem}>
              添加内容
            </Button>
          </Grid>
          <Grid item>
            {/* <Button variant="contained" color="primary" startIcon={<CloudUploadIcon />}>
              上传文件
            </Button> */}
            <ImportBtn btnText="上传文件" startIcon={<CloudUploadIcon />} uploadFile={uploadFile} />
          </Grid>
          <Grid>
            <Button variant="contained" color="primary" startIcon={<SaveIcon />}>
              提交
            </Button>
          </Grid>
        </Grid>
      );
    } else {
      return null;
    }
  };

  return <div className={classes.root}>{renderOperation()}</div>;
};

const mapStateToProps = ({ RFQReducer }) => {
  return {
    rfq: RFQReducer.rfq,
  };
};

export default connect(mapStateToProps, { addRfqItem, uploadFile })(RFQOperations);
