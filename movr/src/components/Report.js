import React, { useState } from "react";
import { Grid, Paper, makeStyles, Collapse } from "@material-ui/core";
import { ExpandMore, ExpandLess } from "@material-ui/icons";

const reportStyles = makeStyles((theme) => ({
  paper: {
    borderRadius: "0px",
    padding: theme.spacing(0),
    paddingBottom: theme.spacing(1),
    color: theme.palette.text.secondary,
    borderTop: "1px solid rgba(54,137,247,0.4)",
  },
  header: {
    display: "flex",
    direction: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingRight: theme.spacing(1),
    paddingBottom: theme.spacing(1),
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
  formControl: {
    margin: theme.spacing(1),
    width: "90%",
  },
  title: {
    fontSize: "12px",
    textTransform: "uppercase",
    margin: `${theme.spacing(2)}px 0px 0px ${theme.spacing(1)}px`,
    color: theme.palette.text.secondary,
  },
  listItem: {
    padding: theme.spacing(1),
    borderBottom: "1px solid rgba(54,137,247,0.15)",
  },
  locName: {
    fontSize: "14px",
    fontWeight: 600,
    margin: 0,
  },
  locStat: {
    fontSize: "12px",
    margin: 0,
  },
  locHeader: {
    // borderRight: "1px solid rgba(54,137,247,0.15)",
  },
  product: {
    fontSize: "12px",
    margin: `${theme.spacing(1)}px 0px ${theme.spacing(1)}px ${theme.spacing(1)}px`,
    padding: theme.spacing(1),
    border: "1px solid rgba(54,137,247,0.15)",
    borderRadius: "4px",
  },
  productContainer: {
    display: "flex",
    direction: "row",
    justifyContent: "flex-start",
  },
}));

export default function Report(props) {
  const classes = reportStyles();
  const [openList, setOpenList] = useState(false);
  return (
    <Paper className={`${classes.paper} ${classes.outerContainer}`} elevation={0}>
      <div className={classes.header}>
        <p className={classes.title}>inventory</p>
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
        {Object.keys(props.report).map((loc, index) => {
          const products = props.report[loc];
          const totalQuantity = products.map((product) => product[1]).reduce((i, a) => a + i);
          return (
            <Grid container className={classes.listItem} key={index}>
              <Grid item container xs={3} className={classes.locHeader}>
                <Grid item xs={12}>
                  <p className={classes.locName}>{loc}</p>
                </Grid>

                <Grid item xs={6}>
                  <p className={classes.locStat}>{`products : ${products.length}`}</p>
                </Grid>
                <Grid item xs={6}>
                  <p className={classes.locStat}>{`total qty. : ${totalQuantity}`}</p>
                </Grid>
              </Grid>

              <Grid item xs={9}>
                <div className={classes.productContainer}>
                  {products
                    .filter((product) => product[1] > 0)
                    .map((product, jndex) => (
                      <p className={classes.product} key={jndex}>{`${jndex + 1}. ${product[0]}, ${product[1]}`}</p>
                    ))}
                </div>
              </Grid>
            </Grid>
          );
        })}
      </Collapse>
    </Paper>
  );
}
