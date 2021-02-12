import React, { useState } from "react";
import { Grid, Paper, makeStyles, Select, MenuItem, InputLabel, TextField, IconButton, FormControl, Collapse } from "@material-ui/core";
import { Send } from "@material-ui/icons";

const moveBarStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(0),
    color: theme.palette.text.secondary,
  },
  outerContainer: {
    borderRadius: "0px",
    borderTop: "1px solid rgba(54,137,247,0.4)",
  },
  formControl: {
    margin: theme.spacing(1),
    width: "90%",
    fontSize: "14px",
  },
  icon: {
    color: "rgba(54,137,247,1)",
  },
  title: {
    fontSize: "12px",
    textTransform: "uppercase",
    margin: `${theme.spacing(2)}px 0px 0px ${theme.spacing(1)}px`,
    color: theme.palette.text.secondary,
  },
  message: {
    fontSize: "10px",
    width: "100%",
    textAlign: "center",
    textTransform: "uppercase",
  },
  error: {
    color: theme.palette.error.main,
  },
  success: {
    color: theme.palette.success.main,
  },
}));

export default function MoveBar(props) {
  const [state, setState] = useState({
    product: "",
    from: "",
    to: "",
    quantity: 0,
    error: "",
  });

  const nullify = (val) => (val === undefined || val === "" ? null : val);
  const handleStateChange = (event) => {
    const { name, value } = event.target;
    console.log(event, name, value);
    console.log(state);
    setState({ ...state, [name]: value, error: "" });
  };

  const handleSendClick = () => {
    if (state.product === "") {
      setState({ ...state, error: "select a product" });
    } else if (state.from[0] === state.to[0]) {
      setState({ ...state, error: "from and to can't be the same" });
    } else if (state.quantity === 0) {
      setState({ ...state, error: "quantity has to be greater than 0" });
    } else {
      const { product, from, to, quantity } = state;
      const transactionData = {
        product_id: product[0],
        from: nullify(from[0]),
        to: nullify(to[0]),
        quantity: quantity,
      };
      console.log("moving", transactionData);
      props.handleMovement(transactionData);
    }
  };

  const classes = moveBarStyles();
  return (
    <Paper className={`${classes.paper} ${classes.outerContainer}`} elevation={0}>
      <Grid container alignItems="center">
        <Grid item xs={12}>
          <p className={classes.title}>move products</p>
        </Grid>

        <Grid item xs={3}>
          <FormControl className={classes.formControl}>
            <InputLabel>Product</InputLabel>
            <Select value={state.product[1]} onChange={handleStateChange} name="product">
              {props.products.map((item, index) => {
                return (
                  <MenuItem value={item} key={index}>
                    {item[1]}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={3}>
          <FormControl className={classes.formControl}>
            <InputLabel>From</InputLabel>
            <Select value={state.from[1]} onChange={handleStateChange} name="from">
              <MenuItem value={["", ""]}>
                <em>Elsewhere</em>
              </MenuItem>
              {props.locations.map((item, index) => {
                return (
                  <MenuItem value={item} key={index}>
                    {item[1]}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={3}>
          <FormControl className={classes.formControl}>
            <InputLabel>To</InputLabel>
            <Select value={state.to[1]} onChange={handleStateChange} name="to">
              <MenuItem value={["", ""]}>
                <em>Elsewhere</em>
              </MenuItem>
              {props.locations.map((item, index) => {
                return (
                  <MenuItem value={item} key={index}>
                    {item[1]}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={2}>
          <FormControl className={classes.formControl}>
            <TextField
              label="Quantity"
              variant="standard"
              type="number"
              onChange={handleStateChange}
              InputProps={{ inputProps: { min: 0 } }}
              value={state.quantity}
              name="quantity"
            ></TextField>
          </FormControl>
        </Grid>
        <Grid item xs={1}>
          <IconButton className={classes.icon} onClick={handleSendClick}>
            <Send />
          </IconButton>
        </Grid>
      </Grid>
      <Collapse in={state.error !== ""}>
        <p className={`${classes.error}  ${classes.message}`}>{state.error}</p>
      </Collapse>
    </Paper>
  );
}
