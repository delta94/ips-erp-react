import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";

import { GetMaterials, UpdateState, filterHardness, UpdateObjectState } from "../../actions/craft_schedule_actions";

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
  const {
    data,
    materials,
    selected_material,
    filter_hardness,
    filter_replacement_hardness,
    selected_hardness,
    selected_replacement_material,
    selected_replacement_hardness,
    dimension,
  } = props;

  // methods from actions
  const { GetMaterials, UpdateState, filterHardness, UpdateObjectState } = props;

  useEffect(() => {
    GetMaterials();
  }, [GetMaterials]);

  const renderMateril = () => {
    if (data) {
      return (
        <Grid container alignItems="center" justify="space-around" spacing={4} className={classes.gridRoot}>
          <Grid item xs={6}>
            <Grid container direction="column">
              <Typography color="primary">材质</Typography>
              <Grid container spacing={4}>
                <Grid item xs={2}>
                  <Typography className={classes.empty}>编号</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Select
                    fullWidth
                    value={selected_material}
                    onChange={e => {
                      UpdateState("selected_material", e.target.value);
                      filterHardness(e.target.name);
                    }}
                    name="selected_material"
                    displayEmpty
                  >
                    <MenuItem value="">
                      <em>空</em>
                    </MenuItem>
                    {materials.map(item => (
                      <MenuItem key={item} value={item}>
                        {item.split("^")[0]}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
                <Grid item xs={2}>
                  <Typography className={classes.empty}>硬度</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Select
                    fullWidth
                    displayEmpty
                    value={selected_hardness}
                    onChange={e => {
                      UpdateState("selected_hardness", e.target.value);
                    }}
                  >
                    <MenuItem value="">
                      <em>空</em>
                    </MenuItem>
                    {filter_hardness.map(item => (
                      <MenuItem key={item} value={item}>
                        {item.split("^")[0]}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          {/* <Grid item xs={4}>
          <Grid container direction="column">
            <Typography>代替材质</Typography>
            <Grid container spacing={4}>
              <Grid item xs={2}>
                <Typography className={classes.empty}>种类</Typography>
              </Grid>
              <Grid item xs={4}>
                <Select
                  fullWidth
                  value={selected_replacement_material}
                  onChange={e => {
                    UpdateState("selected_replacement_material", e.target.value);
                    filterHardness(e.target.name);
                  }}
                  name="selected_replacement_material"
                  displayEmpty
                >
                  <MenuItem value="">
                    <em>空</em>
                  </MenuItem>
                  {materials.map(item => (
                    <MenuItem key={item} value={item}>
                      {item.split("^")[0]}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
              <Grid item xs={2}>
                <Typography className={classes.empty}>硬度</Typography>
              </Grid>
              <Grid item xs={4}>
                <Select
                  fullWidth
                  displayEmpty
                  value={selected_replacement_hardness}
                  onChange={e => {
                    UpdateState("selected_replacement_hardness", e.target.value);
                  }}
                >
                  <MenuItem value="">
                    <em>空</em>
                  </MenuItem>
                  {filter_replacement_hardness.map(item => (
                    <MenuItem key={item} value={item}>
                      {item.split("^")[0]}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
            </Grid>
          </Grid>
        </Grid> */}
          <Grid item xs={6}>
            <Grid container direction="column">
              <Typography color="primary">零件规格</Typography>
              <Grid container spacing={4}>
                <Grid item xs={3}>
                  <TextField
                    style={{ maxWidth: 50 }}
                    placeholder="长"
                    value={dimension.length}
                    onChange={e => UpdateObjectState("dimension", "length", e.target.value)}
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    style={{ maxWidth: 50 }}
                    placeholder="宽"
                    value={dimension.width}
                    onChange={e => UpdateObjectState("dimension", "width", e.target.value)}
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    style={{ maxWidth: 50 }}
                    placeholder="高"
                    value={dimension.height}
                    onChange={e => UpdateObjectState("dimension", "height", e.target.value)}
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    placeholder="数量"
                    style={{ maxWidth: 50 }}
                    value={dimension.qty}
                    onChange={e => UpdateObjectState("dimension", "qty", e.target.value)}
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
    filter_hardness: CraftScheduleReducer.filter_hardness,
    filter_replacement_hardness: CraftScheduleReducer.filter_replacement_hardness,
    selected_hardness: CraftScheduleReducer.selected_hardness,
    selected_replacement_material: CraftScheduleReducer.selected_replacement_material,
    selected_replacement_hardness: CraftScheduleReducer.selected_replacement_hardness,
    dimension: CraftScheduleReducer.dimension,
  };
};

export default connect(mapStateToProps, { GetMaterials, UpdateState, filterHardness, UpdateObjectState })(Material);
