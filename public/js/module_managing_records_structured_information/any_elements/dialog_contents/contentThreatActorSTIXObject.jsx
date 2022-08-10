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

import CreateThreatActorsPatternElements from "../type_elements_stix/threatActorPatternElements.jsx";

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

export default function CreateDialogContentThreatActorSTIXObject(props){
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
                    поиск информации об STIX объекте типа Исполнитель угроз (Threat actor DO STIX)
                </Grid>
            </Grid>
            <LinearProgress />
        </DialogContent>);
    }

    return (<React.Fragment>
        <DialogContent>
            <Row className="mt-2">
                <Col md={12} className="pl-3 pr-3">
                Просмотр и редактирование STIX объекта типа Исполнитель угроз (Threat actor DO STIX)
                </Col>
                <Col md={12} className="pt-2 pl-3 pr-3">{JSON.stringify(listObjectInfo[currentIdSTIXObject])}</Col>
            </Row>
        </DialogContent>
    </React.Fragment>);
}

CreateDialogContentThreatActorSTIXObject.propTypes = {
    listObjectInfo: PropTypes.object.isRequired,
    currentIdSTIXObject: PropTypes.string.isRequired,
    handlerDialog: PropTypes.func.isRequired,
    handlerDialogClose: PropTypes.func.isRequired,
    isNotDisabled: PropTypes.bool.isRequired,
};

/**
//ThreatActorDomainObjectsSTIX объект "Threat Actor", по терминалогии STIX, содержит информацию о физических лицах или их группах и организациях
//  которые могут действовать со злым умыслом.
// Name - имя используемое для идентификации "Threat Actor" (ОБЯЗАТЕЛЬНОЕ ЗНАЧЕНИЕ)
// Description - более подробное описание
// ThreatActorTypes - заранее определенный (предложенный) перечень типов субъектов угрозы
// Aliases - альтернативные имена используемые для этого субъекта угроз
// FirstSeen - время, в формате "2016-05-12T08:17:27.000Z", когда данный субъект угроз был впервые зафиксирован
// LastSeen - время, в формате "2016-05-12T08:17:27.000Z", когда данный субъект угроз был зафиксирован в последний раз
// Roles - заранее определенный (предложенный) перечень возможных ролей субъекта угроз
// Goals - высокоуровневые цели субъекта угроз.
// Sophistication - один, из заранее определенного (предложенного) перечня навыков, специальных знания, специальной подготовки или опыта,
//  которыми должен обладать субъект угрозы, чтобы осуществить атаку
// ResourceLevel - один, из заранее определенного (предложенного) перечня организационных уровней, на котором обычно работает этот субъект угрозы,
//  который, в свою очередь, определяет ресурсы, доступные этому субъекту угрозы для использования в атаке.
// PrimaryMotivation - одна, из заранее определенного (предложенного) перечня причин, мотиваций или целей стоящих за этим субъектом угрозы
// SecondaryMotivations - заранее определенный (предложенный) перечень возможных вторичных причин, мотиваций или целей стоящих за этим субъектом угрозы
// PersonalMotivations - заранее определенный (предложенный) перечень возможных персональных причин, мотиваций или целей стоящих за этим субъектом угрозы
type ThreatActorDomainObjectsSTIX struct {
	CommonPropertiesObjectSTIX
	CommonPropertiesDomainObjectSTIX
	Name                 string              `json:"name" bson:"name" required:"true"`
	Description          string              `json:"description" bson:"description"`
	ThreatActorTypes     []OpenVocabTypeSTIX `json:"threat_actor_types" bson:"threat_actor_types"`
	Aliases              []string            `json:"aliases" bson:"aliases"`
	FirstSeen            time.Time           `json:"first_seen" bson:"first_seen"`
	LastSeen             time.Time           `json:"last_seen" bson:"last_seen"`
	Roles                []OpenVocabTypeSTIX `json:"roles" bson:"roles"`
	Goals                []string            `json:"goals" bson:"goals"`
	Sophistication       OpenVocabTypeSTIX   `json:"sophistication" bson:"sophistication"`
	ResourceLevel        OpenVocabTypeSTIX   `json:"resource_level" bson:"resource_level"`
	PrimaryMotivation    OpenVocabTypeSTIX   `json:"primary_motivation" bson:"primary_motivation"`
	SecondaryMotivations []OpenVocabTypeSTIX `json:"secondary_motivations" bson:"secondary_motivations"`
	PersonalMotivations  []OpenVocabTypeSTIX `json:"personal_motivations" bson:"personal_motivations"`
}
 */