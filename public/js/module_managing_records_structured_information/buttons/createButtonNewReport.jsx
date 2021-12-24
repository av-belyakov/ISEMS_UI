import React from "react";
import { Button } from "@material-ui/core";
//import { makeStyles } from "@material-ui/core/styles";
import { green } from "@material-ui/core/colors";
import AddIcon from "@material-ui/icons/Add";
import PropTypes from "prop-types";

/*const useStyles = makeStyles((theme) => ({
    button: {
        margin: theme.spacing(1),
        "&:hover": {
            backgroundColor: blue[700],
        },
        color: theme.palette.getContrastText(blue[500]),
        backgroundColor: blue[500],
    },
}));*/

export function CreateButtonNewReport(props){
    const { buttonIsDisabled, handlerShowModalWindow } = props;
    //const classes = useStyles();

    return (<Button
        size="small"
        style={{ borderColor: green[500] }}
        startIcon={<AddIcon style={{ color: green[500] }} />}
        variant="outlined"
        disabled={buttonIsDisabled}
        onClick={handlerShowModalWindow}>
            новый доклад
    </Button>);
}

CreateButtonNewReport.propTypes = {
    buttonIsDisabled: PropTypes.bool,
    handlerShowModalWindow: PropTypes.func.isRequired,
};