"use strict";

import React from "react";
import { Col, Row } from "react-bootstrap";
import { 
    //AppBar,
    //Button,
    //Container,
    //Dialog,
    DialogContent,
    Grid,
    //Toolbar,
    //Typography,
    LinearProgress,
} from "@material-ui/core";
import { teal, grey } from "@material-ui/core/colors";
import { makeStyles } from "@material-ui/core/styles";
//import { v4 as uuidv4 } from "uuid";
import PropTypes from "prop-types";

import CreateArtifactPatternElements from "../type_elements_stix/artifactPatternElements.jsx";

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

export default function CreateDialogContentArtifactSTIXObject(props){
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
                    поиск информации об STIX объекте типа Артефакт (Artifact СO STIX)
                </Grid>
            </Grid>
            <LinearProgress />
        </DialogContent>);
    }

    return (<React.Fragment>
        <DialogContent>
            <Row className="mt-2">
                <Col md={12} className="pl-3 pr-3">
                    Просмотр и редактирование STIX объекта типа Артефакт (Artifact СO STIX)
                </Col>
                <Col md={12} className="pt-2 pl-3 pr-3">{JSON.stringify(listObjectInfo[currentIdSTIXObject])}</Col>
            </Row>
        </DialogContent>
    </React.Fragment>);
}

CreateDialogContentArtifactSTIXObject.propTypes = {
    listObjectInfo: PropTypes.object.isRequired,
    currentIdSTIXObject: PropTypes.string.isRequired,
    handlerDialog: PropTypes.func.isRequired,
    handlerDialogClose: PropTypes.func.isRequired,
    isNotDisabled: PropTypes.bool.isRequired,
};

/**
//ArtifactCyberObservableObjectSTIX объект "Artifact", по терминалогии STIX, позволяет захватывать массив байтов (8 бит) в виде строки в кодировке base64
//  или связывать его с полезной нагрузкой, подобной файлу. Обязательно должен быть заполнено одно из полей PayloadBin или URL
// MimeType - по возможности это значение ДОЛЖНО быть одним из значений, определенных в реестре типов носителей IANA. В универсальном каталоге
//  всех существующих типов файлов.
// PayloadBin - бинарные данные в base64
// URL - унифицированный указатель ресурса (URL)
// Hashes - словарь хешей для URL или PayloadBin
// EncryptionAlgorithm - тип алгоритма шифрования для бинарных данных
// DecryptionKey - определяет ключ для дешифрования зашифрованных данных
type ArtifactCyberObservableObjectSTIX struct {
	CommonPropertiesObjectSTIX
	OptionalCommonPropertiesCyberObservableObjectSTIX
	MimeType            string         `json:"mime_type" bson:"mime_type"`
	PayloadBin          string         `json:"payload_bin" bson:"payload_bin"`
	URL                 string         `json:"url" bson:"url"`
	Hashes              HashesTypeSTIX `json:"hashes" bson:"hashes"`
	EncryptionAlgorithm EnumTypeSTIX   `json:"encryption_algorithm" bson:"encryption_algorithm"`
	DecryptionKey       string         `json:"decryption_key" bson:"decryption_key"`
}
 */