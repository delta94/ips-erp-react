import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { Grid, Typography, MenuItem, Select, Paper, TextField } from "@material-ui/core";

import { GetMaterials, updateObjectState, updateSelectMaterial } from "../../actions/craft_schedule_actions";

const useStyle = makeStyles(theme => ({
  paperRoot: {
    margin: 30,
  },
  empty: {
    marginTop: 10,
  },
  gridRoot: {
    margin: 2,
  },
}));

function Material(props) {
  const classes = useStyle();
  // vars from reducers
  const { data, materials, selected_material, dimension } = props;

  // methods from actions
  const { GetMaterials, updateObjectState, updateSelectMaterial } = props;

  useEffect(() => {
    GetMaterials();
  }, [GetMaterials]);

  const renderMateril = () => {
    if (data) {
      return (
        <Grid container alignItems="center" justify="space-around" spacing={4} className={classes.gridRoot}>
          <Grid item xs={6}>
            <Grid container>
              <Typography color="primary">材质</Typography>
              <Grid container spacing={4}>
                <Grid item xs={2}>
                  <Typography className={classes.empty}>编号</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Select
                    fullWidth
                    value={selected_material.name}
                    onChange={e => {
                      updateSelectMaterial(e.target.value);
                    }}
                    name="selected_material"
                    // displayEmpty
                  >
                    <MenuItem value="">
                      <em>空</em>
                    </MenuItem>
                    {materials.map(item => (
                      <MenuItem key={item.id} value={item.name}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
                <Grid item xs={2}>
                  <Typography className={classes.empty}>硬度</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography className={classes.empty}>{selected_material.hardness}</Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={6}>
            <Grid container direction="column">
              <Typography color="primary">零件规格</Typography>
              <Grid container spacing={4}>
                <Grid item xs={3}>
                  <TextField
                    style={{ maxWidth: 50 }}
                    placeholder="长"
                    value={dimension.length}
                    onChange={e => updateObjectState("dimension", "length", e.target.value)}
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    style={{ maxWidth: 50 }}
                    placeholder="宽"
                    value={dimension.width}
                    onChange={e => updateObjectState("dimension", "width", e.target.value)}
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    style={{ maxWidth: 50 }}
                    placeholder="高"
                    value={dimension.height}
                    onChange={e => updateObjectState("dimension", "height", e.target.value)}
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    placeholder="数量"
                    style={{ maxWidth: 50 }}
                    value={dimension.qty}
                    onChange={e => updateObjectState("dimension", "qty", e.target.value)}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      );
    } else {
      return null;
    }
  };
  return <Paper className={classes.paperRoot}>{renderMateril()}</Paper>;
}

const mapStateToProps = ({ CraftScheduleReducer }) => {
  return {
    data: CraftScheduleReducer.data,
    materials: CraftScheduleReducer.materials,
    selected_material: CraftScheduleReducer.selected_material,
    dimension: CraftScheduleReducer.dimension,
  };
};

export default connect(mapStateToProps, { GetMaterials, updateObjectState, updateSelectMaterial })(Material);
