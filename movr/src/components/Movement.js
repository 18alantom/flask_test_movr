import React, { useState } from "react";
import { Grid, Paper, makeStyles, Collapse, Tooltip } from "@material-ui/core";
import { ExpandMore, ExpandLess } from "@material-ui/icons";

const movementStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(0),
    color: theme.palette.text.secondary,
  },

  title: {
    fontSize: "12px",
    textTransform: "uppercase",
    margin: `${theme.spacing(1)}px 0px`,
    color: theme.palette.text.secondary,
  },

  header: {
    display: "flex",
    direction: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.spacing(1),
  },

  button: {
    border: "0px",
    background: "none",
    width: "16px",
    height: "16px",
    padding: "0px",
    margin: "0px",
    marginLeft: "4px",
    cursor: "pointer",
  },

  icon: {
    width: "16px",
    height: "16px",
    color: theme.palette.text.secondary,
  },

  titleBarText: {},
  rowText: {
    maxWidth: "80px",
    fontSize: "14px",
    wordWrap: "break-word",
  },

  movementList: {
    maxHeight: "200px",
    overflow: "scroll",
  },
}));

export default function Movement(props) {
  const replaceNull = (val) => (val == null ? <em>Elsewhere</em> : val);
  const classes = movementStyles();
  const [openList, setOpenList] = useState(false);
  return (
    <Paper className={classes.paper} elevation={0}>
      <div className={classes.header}>
        <p className={classes.title}>transactions</p>
        <button
          className={classes.button}
          onClick={() => {
            setOpenList(!openList);
          }}
        >
          {openList ? <ExpandLess className={classes.icon} /> : <ExpandMore className={classes.icon} />}
        </button>
      </div>
      <Collapse in={openList}>
        <div className={classes.movementList}>
          <Grid container className={classes.titleBar}>
            <Grid item xs={1}>
              <p className={classes.titleBarText}>#</p>
            </Grid>
            <Grid item xs={3}>
              <p className={classes.titleBarText}>product</p>
            </Grid>
            <Grid item xs={3}>
              <p className={classes.titleBarText}>from</p>
            </Grid>
            <Grid item xs={3}>
              <p className={classes.titleBarText}>to</p>
            </Grid>
            <Grid item xs={2}>
              <p className={classes.titleBarText}>qty.</p>
            </Grid>
          </Grid>

          {props.movements.map((row, index) => (
            <Tooltip title={`${row[4]}`} placement="left">
              <Grid container className={classes.row} key={index}>
                <Grid item xs={1}>
                  <p className={classes.rowText}>{index + 1}</p>
                </Grid>
                <Grid item xs={3}>
                  <p className={classes.rowText}>{row[0]}</p>
                </Grid>
                <Grid item xs={3}>
                  <p className={classes.rowText}>{replaceNull(row[1])}</p>
                </Grid>
                <Grid item xs={3}>
                  <p className={classes.rowText}>{replaceNull(row[2])}</p>
                </Grid>
                <Grid item xs={2}>
                  <p className={classes.rowText}>{row[3]}</p>
                </Grid>
              </Grid>
            </Tooltip>
          ))}
        </div>
      </Collapse>
    </Paper>
  );
}
