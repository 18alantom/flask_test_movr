import React from "react";
import { Box, Grid, withStyles, Snackbar } from "@material-ui/core";
import logo from "./logo.svg";
import ListPaper from "./components/ListPaper";
import MoveBar from "./components/MoveBar";
import Report from "./components/Report";
import Movement from "./components/Movement";

const API_URL = process.env.REACT_APP_API_URL;
const ALL = ["products", "locations", "movements", "report"];

const appStyles = (theme) => ({
  root: {
    margin: "0 auto",
    width: "80%",
    display: "flex",
    direction: "row",
    alignItems: "center",
    height: "100vh",
  },
  logo: {
    margin: theme.spacing(3),
    padding: theme.spacing(5),
    marginRight: 0,
    paddingLeft: 0,
    width: "150px",
  },
  container: {
    padding: `${theme.spacing(1)}px ${theme.spacing(3)}px`,
    borderLeft: "1px solid rgba(54,137,247,0.4)",
  },
});

// const toObject = (data) => data.map((p) => ({ id: p[0], name: p[1] }));
const toObject = (data) =>
  data.reduce((obj, p) => {
    obj[p[0]] = p[1];
    return obj;
  }, {});

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      locations: [],
      movements: [],
      report: [],
      message: "",
      openSnackBar: false,
      // error: "",
    };
    this.fetchAndUpdateState = this.fetchAndUpdateState.bind(this);
    this.handleOnClose = this.handleOnClose.bind(this);
    this.fetchForCRUD = this.fetchForCRUD.bind(this);
    this.moveProduct = this.moveProduct.bind(this);
    this.deleteRow = this.deleteRow.bind(this);
    this.updateRow = this.updateRow.bind(this);
    this.insertRow = this.insertRow.bind(this);
  }

  componentDidMount() {
    this.fetchAndUpdateState(ALL);
  }

  fetchAndUpdateState(fetchList) {
    const url = API_URL + "data";
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(fetchList),
    };

    fetch(url, options)
      .then((res) => res.json())
      .then((data) => {
        Object.keys(data).forEach((key) => {
          const [success, stuff] = data[key];
          if (success && key in this.state) {
            this.setState(() => ({ [key]: stuff }));
          }
        });
      })
      .catch((err) => {
        console.error(err);
      });
  }

  handleOnClose(type) {
    this.setState(() => ({ [type]: "" }));
  }

  fetchForCRUD(endpoint, method, transactionData, updateList, successMessage) {
    const url = API_URL + endpoint;
    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transactionData),
    };
    fetch(url, options)
      .then((res) => res.json())
      .then((data) => {
        const [success, message] = data;
        if (!success) {
          this.setState(() => ({ message, openSnackBar: true }));
        } else {
          this.fetchAndUpdateState(updateList);
          this.setState(() => ({ message: successMessage, openSnackBar: true }));
        }
      })
      .catch((err) => {
        console.error(err);
        this.setState(() => ({ message: err, openSnackBar: true }));
      });
  }

  deleteRow(transactionData) {
    this.fetchForCRUD("data", "DELETE", transactionData, ALL, "Item removed.");
  }

  updateRow(transactionData, name) {
    this.fetchForCRUD("data", "PATCH", transactionData, [name], "Item updated.");
  }

  insertRow(transactionData, name) {
    this.fetchForCRUD("data", "PUT", transactionData, [name], "Item added.");
  }

  moveProduct(transactionData) {
    this.fetchForCRUD("move", "PUT", transactionData, ["movements", "report"], "Product moved.");
  }

  render() {
    const { products, locations, movements, report, message, openSnackBar } = this.state;
    const { classes } = this.props;

    return (
      <Box className={classes.root}>
        <img src={logo} alt="logo" className={classes.logo} />
        <Grid container spacing={2} className={classes.container}>
          <Grid item xs={3}>
            <ListPaper
              list={products}
              title={"products"}
              listName={"product"}
              handleDelete={this.deleteRow}
              handleUpdate={this.updateRow}
              handleInsert={this.insertRow}
            />
          </Grid>

          <Grid item xs={3}>
            <ListPaper
              list={locations}
              title={"locations"}
              listName={"location"}
              handleDelete={this.deleteRow}
              handleUpdate={this.updateRow}
              handleInsert={this.insertRow}
            />
          </Grid>

          <Grid item xs={6}>
            <Movement movements={movements} />
          </Grid>

          <Grid item xs={12}>
            <MoveBar locations={toObject(locations)} products={toObject(products)} handleMovement={this.moveProduct} />
          </Grid>

          <Grid item xs={12}>
            <Report report={report} />
          </Grid>
        </Grid>
        <Snackbar open={openSnackBar} autoHideDuration={2000} message={message} onClose={() => this.setState({ openSnackBar: false, message: "" })} />
      </Box>
    );
  }
}

export default withStyles(appStyles)(App);
