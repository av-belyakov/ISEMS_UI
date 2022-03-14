"use strict";

import React, { useEffect } from "react";
import { 
    Button,
    DialogActions,
    DialogContent,
    Grid,
    LinearProgress,
    TextField,
} from "@material-ui/core";
import PropTypes from "prop-types";

import { helpers } from "../../../common_helpers/helpers";
import CreateListPreviousStateSTIXObject from "../createListPreviousStateSTIXObject.jsx";
import CreateElementAdditionalTechnicalInformationDO from "../createElementAdditionalTechnicalInformationDO.jsx";

export default function CreateDialogContentCourseOfActionSTIXObject(props){
    let { 
        listObjectInfo, 
        listPreviousState,
        optionsPreviousState,
        currentIdSTIXObject,
        showListPreviousState,
        socketIo,
        handlerDialog,
        handelrDialogClose,
        isNotDisabled,
    } = props;

    /**
 * 
 * Nеперь осталось переделать только CreateDialogContentCourseOfActionSTIXObject по аналогии с CreateDialogContentAttackPatternSTIXObject
 * и CreateDialogContentCampaignSTIXObject и можно продолжать делать остальные объекты по тому же принципу
 * 
 */

    //let [ currentSTIXObject, setCurrentSTIXObject ] = React.useState(listObjectInfo[currentIdSTIXObject]);
    let [ currentSTIXObject, setCurrentSTIXObject ] = React.useState({});
    
    useEffect(() => {
        if(listObjectInfo[currentIdSTIXObject]){
            setCurrentSTIXObject(listObjectInfo[currentIdSTIXObject]);
        }

        return () => {
            setCurrentSTIXObject({});
        };
    }, [ listObjectInfo, currentIdSTIXObject ]);

    let handlerDescription = (obj) => {
            let currentSTIXObjectTmp = _.cloneDeep(currentSTIXObject);
            currentSTIXObjectTmp.description = obj.target.value;
            setCurrentSTIXObject(currentSTIXObjectTmp);
        },
        //пункт "уверенность создателя в правильности своих данных от 0 до 100"
        handlerElementConfidence = (obj) => { 
            let currentSTIXObjectTmp = _.cloneDeep(currentSTIXObject);
            currentSTIXObjectTmp.confidence = obj.data;
            setCurrentSTIXObject(currentSTIXObjectTmp);
        },
        //пункт "определены ли данные содержащиеся в объекте"
        handlerElementDefanged = (obj) => {
            let currentSTIXObjectTmp = _.cloneDeep(currentSTIXObject);
            currentSTIXObjectTmp.defanged = (obj.data === "true");
            setCurrentSTIXObject(currentSTIXObjectTmp);
        },
        //пункт "набор терминов, используемых для описания данного объекта"        
        handlerElementLabels = (obj) => {
            let currentSTIXObjectTmp = _.cloneDeep(currentSTIXObject);

            if(!Array.isArray(currentSTIXObjectTmp.labels)){
                currentSTIXObjectTmp.labels = [];
            }

            currentSTIXObjectTmp.labels = obj.listTokenValue;
            setCurrentSTIXObject(currentSTIXObjectTmp);
        },
        handlerDeleteElementAdditionalTechnicalInformation = (obj) => {
            let currentSTIXObjectTmp = _.cloneDeep(currentSTIXObject);

            if(obj.itemType === "external_references"){
                if(obj.orderNumber < 0){
                    return;
                }

                currentSTIXObjectTmp.external_references.splice(obj.orderNumber, 1);
                setCurrentSTIXObject(currentSTIXObjectTmp);
            }

            if(obj.itemType === "granular_markings"){
                if(obj.orderNumber < 0){
                    return;
                }

                currentSTIXObjectTmp.granular_markings.splice(obj.orderNumber, 1);
                setCurrentSTIXObject(currentSTIXObjectTmp);
            }

            if(obj.itemType === "extensions"){
                delete currentSTIXObjectTmp.extensions[obj.item];
                setCurrentSTIXObject(currentSTIXObjectTmp);
            }
     
        },
        handlerDialogElementAdditionalThechnicalInfo = (obj) => {
            let currentSTIXObjectTmp = _.cloneDeep(currentSTIXObject);

            if(obj.modalType === "external_references"){
                if(obj.actionType === "new"){
                    if(!Array.isArray(currentSTIXObjectTmp.external_references)){
                        currentSTIXObjectTmp.external_references = [];
                    }

                    currentSTIXObjectTmp.external_references.push(obj.data);
                    setCurrentSTIXObject(currentSTIXObjectTmp);
                }

                if(obj.actionType === "update"){
                    currentSTIXObjectTmp.external_references[obj.orderNumber] = obj.data;
                    setCurrentSTIXObject(currentSTIXObjectTmp);
                }

                if(obj.actionType === "hashes_update"){
                    if((!currentSTIXObjectTmp.external_references[obj.orderNumber].hashes) || (typeof currentSTIXObjectTmp.external_references[obj.orderNumber].hashes === "undefined")){
                        currentSTIXObjectTmp.external_references[obj.orderNumber].hashes = {};
                    }

                    currentSTIXObjectTmp.external_references[obj.orderNumber].hashes[obj.data.type] = obj.data.hash;
                    setCurrentSTIXObject(currentSTIXObjectTmp);
                }

                if(obj.actionType === "hashes_delete"){
                    delete currentSTIXObjectTmp.external_references[obj.orderNumber].hashes[obj.hashName];
                    setCurrentSTIXObject(currentSTIXObjectTmp);
                }
            }
    
            if((obj.modalType === "granular_markings") && (obj.actionType === "new")) {
                if(!Array.isArray(currentSTIXObjectTmp.granular_markings)){
                    currentSTIXObjectTmp.granular_markings = [];
                }

                currentSTIXObjectTmp.granular_markings.push(obj.data);
                setCurrentSTIXObject(currentSTIXObjectTmp);
            }
    
            if(obj.modalType === "extensions") {
                if((!currentSTIXObjectTmp.extensions) || (typeof currentSTIXObjectTmp.extensions === "undefined")){
                    currentSTIXObjectTmp.extensions = {};
                }

                currentSTIXObjectTmp.extensions[obj.data.name] = obj.data.description;
                setCurrentSTIXObject(currentSTIXObjectTmp);
            }
        },
        handlerSave = () => {
            let currentSTIXObjectTmp = _.cloneDeep(currentSTIXObject);
            currentSTIXObjectTmp.lang = "RU";
    
            if(currentSTIXObjectTmp.labels === null){
                delete currentSTIXObjectTmp.labels;
            }

            if(currentSTIXObjectTmp.external_references === null){
                delete currentSTIXObjectTmp.external_references;
            }

            if(currentSTIXObjectTmp.object_marking_refs === null){
                delete currentSTIXObjectTmp.object_marking_refs;
            }

            if(currentSTIXObjectTmp.granular_markings === null){
                delete currentSTIXObjectTmp.granular_markings;
            }

            if(currentSTIXObjectTmp.extensions === null){
                delete currentSTIXObjectTmp.extensions;
            }

            if(currentSTIXObjectTmp.aliases === null){
                delete currentSTIXObjectTmp.aliases;
            }

            if(currentSTIXObjectTmp.kill_chain_phases === null){
                delete currentSTIXObjectTmp.kill_chain_phases;
            }

            setCurrentSTIXObject(currentSTIXObjectTmp);

            socketIo.emit("isems-mrsi ui request: insert STIX object", { arguments: [currentSTIXObjectTmp] });

            handlerDialog(currentSTIXObjectTmp);
        };

    if((!listObjectInfo[currentIdSTIXObject]) || (typeof listObjectInfo[currentIdSTIXObject] === "undefined")){
        return (<DialogContent>
            <Grid container direction="row" spacing={3}>
                <Grid item container md={12} justifyContent="center" className="pb-3">
                    поиск информации об STIX объекте типа Реагирование (Course of Action DO STIX)
                </Grid>
            </Grid>
            <LinearProgress />
        </DialogContent>);
    }

    return (<React.Fragment>
        <DialogContent>
            <Grid container direction="row" spacing={3}>
                <Grid item container md={8}>
                    <Grid container direction="row" className="pt-3">
                        <Grid container direction="row" spacing={3}>
                            <Grid item container md={4} justifyContent="flex-end"><span className="text-muted">Наименование</span>:</Grid>
                            <Grid item container md={8} >{currentSTIXObject.name}</Grid>
                        </Grid>

                        <Grid container direction="row" spacing={3}>
                            <Grid item container md={4} justifyContent="flex-end"><span className="text-muted">Дата и время</span>&nbsp;&nbsp;&nbsp;&nbsp;</Grid>
                            <Grid item container md={8}></Grid>
                        </Grid>      

                        <Grid container direction="row" spacing={3}>
                            <Grid item container md={4} justifyContent="flex-end"><span className="text-muted">создания</span>:</Grid>
                            <Grid item container md={8}>
                                {helpers.convertDateFromString(currentSTIXObject.created, { monthDescription: "long", dayDescription: "numeric" })}
                            </Grid>
                        </Grid>

                        <Grid container direction="row" spacing={3}>
                            <Grid item container md={4} justifyContent="flex-end"><span className="text-muted">последнего обновления</span>:</Grid>
                            <Grid item container md={8}>
                                {helpers.convertDateFromString(currentSTIXObject.modified, { monthDescription: "long", dayDescription: "numeric" })}
                            </Grid>
                        </Grid>

                        <Grid container direction="row" spacing={3} style={{ marginTop: 4 }}>
                            <Grid item container md={4} justifyContent="flex-end"><span className="text-muted">Подробное описание</span>:</Grid>
                            <Grid item container md={8}>
                                <TextField
                                    id="outlined-multiline-static"
                                    multiline
                                    minRows={3}
                                    maxRows={8}
                                    fullWidth
                                    onChange={handlerDescription}
                                    defaultValue={currentSTIXObject.description}
                                    variant="outlined"/>
                            </Grid>
                        </Grid>
                    </Grid> 

                    <Grid container direction="row" className="pt-3">
                        <Grid item container md={12} justifyContent="center">
                            <h3>
                            Здесь нужно разместить область с ссылками на объекты Report с которыми может быть связан данный объект. 
                            При чем нужно ограничить переходы по этим ссылка для непривелегированных пользователей. Это надо доделать.
                            </h3>
                            {/*<Row className="mt-2">
                                <Col md={12} className="pl-3 pr-3">
                                Просмотр и редактирование STIX объекта типа Реагирование (Course of Action DO STIX)
                                </Col>
                                <Col md={12} className="pt-2 pl-3 pr-3">{JSON.stringify(listObjectInfo[currentIdSTIXObject])}</Col>
                            </Row>*/}
                        </Grid>
                    </Grid>

                    <CreateElementAdditionalTechnicalInformationDO 
                        objectId={currentIdSTIXObject}
                        reportInfo={currentSTIXObject}
                        handlerElementConfidence={handlerElementConfidence}
                        handlerElementDefanged={handlerElementDefanged}
                        handlerElementLabels={handlerElementLabels}
                        handlerElementDelete={handlerDeleteElementAdditionalTechnicalInformation}
                        handlerDialogElementAdditionalThechnicalInfo={handlerDialogElementAdditionalThechnicalInfo}
                        isNotDisabled={isNotDisabled} />       
                </Grid>

                <Grid item container md={4} style={{ display: "block" }}>
                    <CreateListPreviousStateSTIXObject 
                        socketIo={socketIo} 
                        searchObjectId={currentIdSTIXObject}
                        optionsPreviousState={optionsPreviousState}
                        showListPreviousState={showListPreviousState}
                        listPreviousState={listPreviousState} /> 
                </Grid>
            </Grid> 
        </DialogContent>
        <DialogActions>
            <Button onClick={handelrDialogClose} color="primary">закрыть</Button>
            <Button 
                disabled={_.isEqual(currentSTIXObject, listObjectInfo[currentIdSTIXObject])}
                onClick={handlerSave}
                color="primary">
                    сохранить
            </Button>
        </DialogActions>
    </React.Fragment>);
}

CreateDialogContentCourseOfActionSTIXObject.propTypes = {
    listObjectInfo: PropTypes.object.isRequired,
    listPreviousState: PropTypes.array.isRequired,
    optionsPreviousState: PropTypes.object.isRequired,
    currentIdSTIXObject: PropTypes.string.isRequired,
    showListPreviousState: PropTypes.bool.isRequired,
    socketIo: PropTypes.object.isRequired,
    handlerDialog: PropTypes.func.isRequired,
    handelrDialogClose: PropTypes.func.isRequired,
    isNotDisabled: PropTypes.bool.isRequired,
};
