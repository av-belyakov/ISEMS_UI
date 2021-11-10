"use strict";

import React from "react";
import { Col, Row } from "react-bootstrap";
/*import { 
    AppBar,
    Button,
    Container,
    Dialog,
    Toolbar,
    Typography,
} from "@material-ui/core";*/
import { teal, grey } from "@material-ui/core/colors";
import { makeStyles } from "@material-ui/core/styles";
//import { v4 as uuidv4 } from "uuid";
import PropTypes from "prop-types";

const useStyles = makeStyles((theme) => ({
    appBar: {
        position: "fixed",
        color: theme.palette.getContrastText(teal[500]),
        backgroundColor: teal[500],
    },
    appBreadcrumbs: {
        position: "fixed",
        top: "60px",
        color: theme.palette.getContrastText(grey[50]),
        backgroundColor: grey[50],
        paddingLeft: theme.spacing(4),
    },
    buttonSave: {
        color: theme.palette.getContrastText(teal[500]),
        backgroundColor: teal[500],
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
    root: {
        width: "100%",
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
    },
}));

export default function CreateModalWindowAutonomousSystemSTIXObject(props){
    let { listObjectInfo, currentIdSTIXObject, handlerDialog } = props;

    if((listObjectInfo[currentIdSTIXObject] === null) || (typeof listObjectInfo[currentIdSTIXObject] === "undefined")){
        return (<React.Fragment>
            <Row className="mt-2">
                <Col md={12} className="pl-3 pr-3">
                Просмотр и редактирование STIX объекта типа Автономные Системы (Tool DO STIX)
                </Col>
            </Row>
        </React.Fragment>);
    }

    return (<React.Fragment>
        <Row className="mt-2">
            <Col md={12} className="pl-3 pr-3">
                Просмотр и редактирование STIX объекта типа Автономные Системы (Tool DO STIX)
            </Col>
            <Col md={12} className="pt-2 pl-3 pr-3">{JSON.stringify(listObjectInfo[currentIdSTIXObject])}</Col>
        </Row>
    </React.Fragment>);
}

CreateModalWindowAutonomousSystemSTIXObject.propTypes = {
    listObjectInfo: PropTypes.object.isRequired,
    currentIdSTIXObject: PropTypes.string.isRequired,
    handlerDialog: PropTypes.func.isRequired,
};