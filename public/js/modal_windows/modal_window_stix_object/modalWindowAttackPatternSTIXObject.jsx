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
    Grid,
} from "@material-ui/core";
import { teal, grey } from "@material-ui/core/colors";
import { makeStyles } from "@material-ui/core/styles";
//import { v4 as uuidv4 } from "uuid";
import PropTypes from "prop-types";

import { helpers } from "../../common_helpers/helpers";

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

export default function CreateModalWindowAttackPatternSTIXObject(props){
    let { listObjectInfo, currentIdSTIXObject, handlerDialog } = props;

    let [ attackPatterElement, setAttackPatterElement ] = React.useState(listObjectInfo[currentIdSTIXObject]);

    /**
 * при модификации объекта типа Шаблон атаки нужно изменить дату в свойстве modified
 */

    if((listObjectInfo[currentIdSTIXObject] === null) || (typeof listObjectInfo[currentIdSTIXObject] === "undefined")){
        return (<React.Fragment>
            <Row className="mt-2">
                <Col md={12} className="pl-3 pr-3">
                    Поиск информации об STIX объекте типа Шаблон атаки (Attack Pattern DO STIX)
                </Col>
            </Row>
        </React.Fragment>);
    }

    return (<React.Fragment>
        <Row className="mt-2">
            <Col md={12} className="pl-3 pr-3">
                Просмотр и редактирование STIX объекта типа Шаблон атаки (Attack Pattern DO STIX)
            </Col>

            <CreateAtackPatternElements 
                attackPatterElement={attackPatterElement} />

            <Col md={12} className="pt-2 pl-3 pr-3">{JSON.stringify(listObjectInfo[currentIdSTIXObject])}</Col>
        </Row>
    </React.Fragment>);
}

CreateModalWindowAttackPatternSTIXObject.propTypes = {
    listObjectInfo: PropTypes.object.isRequired,
    currentIdSTIXObject: PropTypes.string.isRequired,
    handlerDialog: PropTypes.func.isRequired,
};

function CreateAtackPatternElements(props){
    let { attackPatterElement } = props;

    console.log("func 'CreateAtackPatternElements'");
    console.log(attackPatterElement);
    console.log((new Date).toISOString());

    return (<React.Fragment>
        <Grid container direction="row" className="mt-4">
            <Grid item md={1}></Grid>
            <Grid item md={5}><span className="text-muted">Наименование</span>:</Grid>
            <Grid item md={5} className="text-start">{attackPatterElement.name}</Grid>
            <Grid item md={1}></Grid>
        </Grid>

        <Grid container direction="row">
            <Grid item md={1}></Grid>
            <Grid item md={10}><span className="text-muted">Дата и время</span>:</Grid>
            <Grid item md={1}></Grid>
        </Grid>      

        <Grid container direction="row">
            <Grid item md={1}></Grid>
            <Grid item md={5} className="ml-4"><span className="text-muted">создания</span></Grid>
            <Grid item md={5} className="text-start">
                {helpers.convertDateFromString(attackPatterElement.created, { monthDescription: "long", dayDescription: "numeric" })}
            </Grid>
            <Grid item md={1}></Grid>
        </Grid>

        <Grid container direction="row">
            <Grid item md={1}></Grid>
            <Grid item md={5} className="ml-4"><span className="text-muted">последнего обновления</span></Grid>
            <Grid item md={5} className="text-start">
                {helpers.convertDateFromString(attackPatterElement.modified, { monthDescription: "long", dayDescription: "numeric" })}
            </Grid>
            <Grid item md={1}></Grid>
        </Grid>
    </React.Fragment>);
}

CreateAtackPatternElements.propTypes = {
    attackPatterElement: PropTypes.object.isRequired,
};

/**
//AttackPatternDomainObjectsSTIX объект "Attack Pattern", по терминалогии STIX, описывающий способы компрометации цели
// Name - имя используемое для идентификации "Attack Pattern" (ОБЯЗАТЕЛЬНОЕ ЗНАЧЕНИЕ)
// Description - более подробное описание атаки
// Aliases - альтернативные имена
// KillChainPhases - список цепочки фактов, в которых используется этот шаблон атак
 */