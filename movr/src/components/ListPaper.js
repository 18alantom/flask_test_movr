import React, { useEffect, useState } from "react";
import { Paper, Collapse, makeStyles, TextField } from "@material-ui/core";
import { Add, ExpandMore, ExpandLess, Remove } from "@material-ui/icons";

const entryListStyles = makeStyles((theme) => ({
  listContainer: {
    padding: theme.spacing(1),
    paddingBottom: 0,
  },
  listText: {
    fontSize: "14px",
    margin: "0px",
    color: theme.palette.text.secondary,
    border: 0,
  },
  listItem: {
    display: "flex",
    direction: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: theme.spacing(2),
  },
  button: {
    border: "0px",
    background: "none",
    width: "16px",
    height: "16px",
    padding: "0px",
    margin: "0px",
  },
  icon: {
    width: "16px",
    height: "16px",
    // color: theme.palette.warning.main,
    color: theme.palette.text.secondary,
  },
}));

function EntryList(props) {
  const clone = (obj) => JSON.parse(JSON.stringify(obj));
  const classes = entryListStyles();
  const [state, setState] = useState({
    list: [],
    hasChanged: false,
  });

  useEffect(() => {
    setState((s) => ({ ...s, list: clone(props.list) }));
  }, [props.list]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    const list = state.list;
    list[name][1] = value;
    setState({ list, hasChanged: true });
  };

  const handleKeyPress = (event) => {
    const { name, value } = event.target;
    if (event.charCode === 13 && value !== "") {
      const transactionData = {
        table: props.listName,
        id: state.list[name][0],
        value: state.list[name][1],
      };
      // TODO: POST the change
      console.log("updating :", transactionData);
      props.handleUpdate(transactionData);
    }
  };

  const handleBlur = (_) => {
    console.log("blurred", props.list);
    if (state.hasChanged) {
      setState({ list: clone(props.list), hasChanged: false });
    }
  };

  const handleRemove = (_, id) => {
    // TODO: POST the change
    const transactionData = {
      table: props.listName,
      id: id,
    };
    console.log("removing :", transactionData);
    props.handleDelete(transactionData);
  };

  return (
    <div className={classes.listContainer}>
      {state.list.map((item, index) => {
        return (
          <div className={classes.listItem} key={index}>
            <input
              className={classes.listText}
              type="text"
              value={item[1]}
              name={index}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              onBlur={handleBlur}
            />
            <button className={classes.button} onClick={(event) => handleRemove(event, item[0])}>
              <Remove className={classes.icon} />
            </button>
          </div>
        );
      })}
    </div>
  );
}

const listPaperStyles = makeStyles((theme) => ({
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
    padding: theme.spacing(1),
  },

  buttonGroup: {
    display: "flex",
    direction: "row",
    alignItems: "center",
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
  inputField: {
    fontSize: "12px",
    margin: theme.spacing(1),
  },
  root: {
    borderRight: "1px solid rgba(54,137,247,0.4)",
  },
  limiter: {
    maxHeight: "200px",
    overflow: "scroll",
  },
}));

export default function ListPaper(props) {
  const [value, setValue] = useState("");
  const [openList, setOpenList] = useState(false);
  const [openEntry, setOpenEntry] = useState(false);
  const classes = listPaperStyles();
  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.charCode === 13 && value !== "") {
      // TODO: POST the change
      const transactionData = {
        table: props.listName,
        value: value,
      };
      console.log("adding :", transactionData);
      props.handleInsert(transactionData, props.title);
      setValue("");
    }
  };

  const handleBlur = (event) => {
    setValue("");
  };

  return (
    <div className={classes.root}>
      <Paper elevation={0}>
        <div className={classes.header}>
          <p className={classes.title}>{props.title}</p>
          <div className={classes.buttonGroup}>
            <button
              className={classes.button}
              onClick={() => {
                setOpenEntry(!openEntry);
              }}
            >
              <Add className={classes.icon} />
            </button>

            <button
              className={classes.button}
              onClick={() => {
                setOpenList(!openList);
              }}
            >
              {openList ? <ExpandLess className={classes.icon} /> : <ExpandMore className={classes.icon} />}
            </button>
          </div>
        </div>
        <div className={classes.limiter}>
          <Collapse in={openEntry}>
            <TextField
              label={`Add ${props.title}`}
              variant="standard"
              className={classes.inputField}
              size="small"
              value={value}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              onBlur={handleBlur}
            />
          </Collapse>

          <Collapse in={openList}>
            <EntryList
              list={props.list}
              listName={props.listName}
              handleDelete={props.handleDelete}
              handleUpdate={(td) => props.handleUpdate(td, props.title)}
            />
          </Collapse>
        </div>
      </Paper>
    </div>
  );
}
