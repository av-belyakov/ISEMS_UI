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

import CreateObservedDataPatternElements from "./observedDataPatternElements.jsx";

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

export default function CreateDialogContentObservedDataSTIXObject(props){
    let { 
        listObjectInfo, 
        currentIdSTIXObject,
        handlerDialog,
        handlerDialogClose,
        isNotDisabled,
    } = props;

    if((listObjectInfo[currentIdSTIXObject] === null) || (typeof listObjectInfo[currentIdSTIXObject] === "undefined")){
        return (<DialogContent>
            <Grid container direction="row" spacing={3}>
                <Grid item container md={12} justifyContent="center" className="pb-3">
                    поиск информации об STIX объекте типа Наблюдение (Observed Data DO STIX)
                </Grid>
            </Grid>
            <LinearProgress />
        </DialogContent>);
    }

    return (<React.Fragment>
        <DialogContent>
            <Row className="mt-2">
                <Col md={12} className="pl-3 pr-3">
                Просмотр и редактирование STIX объекта типа Наблюдение (Observed Data DO STIX)
                </Col>
                <Col md={12} className="pt-2 pl-3 pr-3">{JSON.stringify(listObjectInfo[currentIdSTIXObject])}</Col>
            </Row>
        </DialogContent>
    </React.Fragment>);
}

CreateDialogContentObservedDataSTIXObject.propTypes = {
    listObjectInfo: PropTypes.object.isRequired,
    currentIdSTIXObject: PropTypes.string.isRequired,
    handlerDialog: PropTypes.func.isRequired,
    handlerDialogClose: PropTypes.func.isRequired,
    isNotDisabled: PropTypes.bool.isRequired,
};

/**
//ObservedDataDomainObjectsSTIX объект "Observed Data", по терминалогии STIX, содержит информацию о сущностях связанных с кибер безопасностью, таких как файлы,
//  системы или сети. Наблюдаемые данные это не результат анализа или заключение искусственного интеллекта, это просто сырая информация без какого-либо контекста.
// FirstObserved - время, в формате "2016-05-12T08:17:27.000Z", начала временного окна, в течение которого были замечены данные (ОБЯЗАТЕЛЬНОЕ ЗНАЧЕНИЕ)
// LastObserved - время, в формате "2016-05-12T08:17:27.000Z", окончание временного окна, в течение которого были замечены данные (ОБЯЗАТЕЛЬНОЕ ЗНАЧЕНИЕ)
// NumberObserved - количество раз, когда фиксировался каждый наблюдаемый кибер объект SCO, представленный в свойстве ObjectRef (ОБЯЗАТЕЛЬНОЕ ЗНАЧЕНИЕ)
// ObjectRefs - список идентификаторов на другие наблюдаемые кибер объекты SCO
type ObservedDataDomainObjectsSTIX struct {
	CommonPropertiesObjectSTIX
	CommonPropertiesDomainObjectSTIX
	FirstObserved  time.Time            `json:"first_observed" bson:"first_observed" required:"true"`
	LastObserved   time.Time            `json:"last_observed" bson:"last_observed" required:"true"`
	NumberObserved int                  `json:"number_observed" bson:"number_observed" required:"true"`
	ObjectRefs     []IdentifierTypeSTIX `json:"object_refs" bson:"object_refs"`
}
 */