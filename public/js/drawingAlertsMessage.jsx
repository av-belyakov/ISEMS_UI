"use strict";

import React from "react";
import PropTypes from "prop-types";
import { Snackbar } from "material-ui-core";
import { Alert } from "material-ui-lab";

export default function DrawingAlertMessage(props) {
    let { show, onHide, notiyMsg } = props;
    let level = (notiyMsg.type === "danger")? "error": notiyMsg.type;

    const titleObj = {
        "success": {
            title: "Успешно выполненное действие.",
            severity: "success",
        },
        "info": {
            title: "Информация.",
            severity: "info",
        },
        "warning": {
            title: "Внимание!",
            severity: "warning",
        },
        "error": {
            title: "Ошибка!!!",
            severity: "error",
        },
    };
            
    const handleClose = (event, reason) => {
        onHide();
    };

    console.log("DrawingAlertMessage show:", show);
    console.log("level: ", level);
    console.log(notiyMsg);

    if(typeof titleObj[level] === "undefined"){
        return null;
    }

    return (<Snackbar 
        open={show}
        onClose={handleClose} 
        autoHideDuration={9000} 
        anchorOrigin={{ vertical: "top", horizontal: "right" }}>
        <Alert onClose={handleClose} severity={titleObj[level].severity}>
            {notiyMsg.message}
        </Alert>
    </Snackbar>);
}    

DrawingAlertMessage.propTypes = {
    show: PropTypes.bool.isRequired,
    onHide: PropTypes.func.isRequired,
    notiyMsg: PropTypes.object.isRequired,
};


