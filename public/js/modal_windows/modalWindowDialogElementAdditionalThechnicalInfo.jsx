"use strict";

import React from "react";
import { Col, Row } from "react-bootstrap";
import { 
    Button,
    Dialog,
    DialogActions,
    DialogTitle,
    DialogContent,
    DialogContentText,
    TextField,
} from "@material-ui/core";
import PropTypes from "prop-types";

export default function DialogElementAdditionalThechnicalInfo(props){
    let { show, onHide, objInfo } = props;
    let listTitle = {
        "external_references": "управление внешними ссылками",
        "granular_markings": "управление \"гранулярными метками\"",
        "extensions": "управление дополнительной информацией",
    };

    console.log("func 'DialogElementAdditionalThechnicalInfo'");
    console.log(objInfo);

    return (<Dialog
        aria-labelledby="form-dialog-element-additional-thechnical-info" 
        open={show} 
        onClose={onHide}>
        <DialogTitle id="form-dialog-title">{listTitle[objInfo.modalType]}</DialogTitle>
        <DialogContent>
            <DialogContentText>
                {JSON.stringify(objInfo)}
            </DialogContentText>
            <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Email Address"
                type="email"
                fullWidth />
        </DialogContent>
        <DialogActions>
            <Button onClick={onHide} color="primary">
                закрыть
            </Button>
            <Button onClick={() => { console.log("handler button Subscribe"); }} color="primary">
                сохранить
            </Button>
        </DialogActions>
    </Dialog>);
}

DialogElementAdditionalThechnicalInfo.propTypes = {
    show: PropTypes.bool,
    onHide: PropTypes.func.isRequired,
    objInfo: PropTypes.object.isRequired,
};