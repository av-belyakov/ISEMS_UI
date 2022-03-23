"use strict";

import React from "react";
import { Col, Row } from "react-bootstrap";
import { 
    //AppBar,
    //Button,
    //Container,
    //Dialog,
    DialogContent,
    LinearProgress,
    Grid,
    //Toolbar,
    //Typography,
} from "@material-ui/core";
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

export default function CreateDialogContentLocationSTIXObject(props){
    let { 
        listObjectInfo, 
        currentIdSTIXObject,
        handlerDialog,
        handelrDialogClose,
        isNotDisabled,
    } = props;

    if((listObjectInfo[currentIdSTIXObject] === null) || (typeof listObjectInfo[currentIdSTIXObject] === "undefined")){
        return (<DialogContent>
            <Grid container direction="row" spacing={3}>
                <Grid item container md={12} justifyContent="center" className="pb-3">
                    поиск информации об STIX объекте типа Местоположение (Location DO STIX)
                </Grid>
            </Grid>
            <LinearProgress />
        </DialogContent>);
    }

    return (<React.Fragment>
        <DialogContent>
            <Row className="mt-2">
                <Col md={12} className="pl-3 pr-3">
                Просмотр и редактирование STIX объекта типа Местоположение (Location DO STIX)
                </Col>
                <Col md={12} className="pt-2 pl-3 pr-3">{JSON.stringify(listObjectInfo[currentIdSTIXObject])}</Col>
            </Row>
        </DialogContent>
    </React.Fragment>);
}

CreateDialogContentLocationSTIXObject.propTypes = {
    listObjectInfo: PropTypes.object.isRequired,
    currentIdSTIXObject: PropTypes.string.isRequired,
    handlerDialog: PropTypes.func.isRequired,
    handelrDialogClose: PropTypes.func.isRequired,
    isNotDisabled: PropTypes.bool.isRequired,
};

/**
//LocationDomainObjectsSTIX объект "Location", по терминалогии STIX, содержит описание географического местоположения
// Name - имя используемое для идентификации "Location"
// Description - более подробное описание
// Latitude - широта
// Longitude - долгота
// Precision - определяет точность координат, заданных свойствами широта и долгота (измеряется в метрах)
// Region - один, из заранее определенного (предложенного) перечня регионов
// Country - наименование страны
// AdministrativeArea - административный округ
// City - наименование города
// StreetAddress - физический адрес
// PostalCode - почтовый адрес
type LocationDomainObjectsSTIX struct {
	CommonPropertiesObjectSTIX
	CommonPropertiesDomainObjectSTIX
	Name               string            `json:"name" bson:"name"`
	Description        string            `json:"description" bson:"description"`
	Latitude           float32           `json:"latitude" bson:"latitude"`
	Longitude          float32           `json:"longitude" bson:"longitude"`
	Precision          float32           `json:"precision" bson:"precision"`
	Region             OpenVocabTypeSTIX `json:"region" bson:"region"`
	Country            string            `json:"country" bson:"country"`
	AdministrativeArea string            `json:"administrative_area" bson:"administrative_area"`
	City               string            `json:"city" bson:"city"`
	StreetAddress      string            `json:"street_address" bson:"street_address"`
	PostalCode         string            `json:"postal_code" bson:"postal_code"`
}
 */