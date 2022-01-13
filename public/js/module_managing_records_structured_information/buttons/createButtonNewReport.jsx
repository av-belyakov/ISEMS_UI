import React from "react";
import { Button } from "@material-ui/core";
import { green } from "@material-ui/core/colors";
import AddIcon from "@material-ui/icons/Add";
import PropTypes from "prop-types";

export function CreateButtonNewReport(props){
    const { buttonIsDisabled, handlerShowModalWindow } = props;

    return (<Button
        size="small"
        style={{ borderColor: green[500] }}
        startIcon={<AddIcon style={{ color: green[500] }} />}
        variant="outlined"
        disabled={buttonIsDisabled}
        onClick={handlerShowModalWindow}>
            создать доклад
    </Button>);
}

CreateButtonNewReport.propTypes = {
    buttonIsDisabled: PropTypes.bool,
    handlerShowModalWindow: PropTypes.func.isRequired,
};