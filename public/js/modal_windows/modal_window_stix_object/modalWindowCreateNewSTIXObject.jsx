"use strict";

import React from "react";
import { Col, Row } from "react-bootstrap";
import { 
    AppBar,
    Button,
    Container,
    Dialog,
    Toolbar,
    Typography,
} from "@material-ui/core";
import { teal, grey } from "@material-ui/core/colors";
import { makeStyles } from "@material-ui/core/styles";
import { v4 as uuidv4 } from "uuid";
import PropTypes from "prop-types";

import CreateBreadcrumbsObjects from "../../module_managing_records_structured_information/any_elements/createBreadcrumbsObjects.jsx";

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

export default function CreateModalWindowNewSTIXObject(props){
    let { modalShow,
        firstObjectId,
        secondObjectId,
        handlerDialogAdd,
        handlerChangeCurrentObjectId } = props;

    return (<Dialog 
        fullScreen 
        open={modalShow} >

        <CreateAppBar handlerDialogAdd={handlerDialogAdd} />

        <CreateBreadcrumbsObjects 
            firstObjectId={firstObjectId}
            secondObjectId={secondObjectId}
            handlerChangeCurrentObjectId={handlerChangeCurrentObjectId} />

        <Container maxWidth={false} style={{ backgroundColor: "#fafafa", position: "absolute", top: "80px" }}>
            <Col md={12} className="pl-3 pr-3">
                <Row>
                    Добавление какого либо нового STIX объекта. При это можно как добавить новый STIX объект, так и выполнить поиск
                    уже существующих STIX объектов по их типам, времени создания, идентификатору и т.д.
                </Row>
            </Col>
        </Container>
    </Dialog>);
}

CreateModalWindowNewSTIXObject.propTypes = {
    modalShow: PropTypes.bool.isRequired,
    firstObjectId: PropTypes.string.isRequired,
    secondObjectId: PropTypes.string.isRequired,
    handlerDialogAdd: PropTypes.func.isRequired,
    handlerChangeCurrentObjectId: PropTypes.func.isRequired,
};

function CreateAppBar(props){
    const classes = useStyles();
    const { handlerDialogAdd } = props;
    
    return (<AppBar className={classes.appBar}>
        <Toolbar>
            <Typography variant="h6" className={classes.title}>Добавление объекта с новой информацией</Typography>
            <Button size="small" className={classes.buttonSave} onClick={handlerDialogAdd}>добавить</Button>
        </Toolbar>
    </AppBar>);
}

CreateAppBar.propTypes = {
    handlerDialogAdd: PropTypes.func.isRequired,
};