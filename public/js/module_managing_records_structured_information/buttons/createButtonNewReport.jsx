import React from "react";
import { Button } from "@material-ui/core";
import { green } from "@material-ui/core/colors";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import PropTypes from "prop-types";

export function CreateButtonNewReport(props){
    const { 
        message,
        buttonIsDisabled, 
        handlerShowModalWindow 
    } = props;

    return (<Button
        size="small"
        style={{ color: green[500] }}
        startIcon={<AddCircleOutlineIcon style={{ color: green[400] }} />}
        disabled={buttonIsDisabled}
        onClick={handlerShowModalWindow}>
        {message}
    </Button>);
}

CreateButtonNewReport.propTypes = {
    message: PropTypes.string.isRequired,
    buttonIsDisabled: PropTypes.bool,
    handlerShowModalWindow: PropTypes.func.isRequired,
};