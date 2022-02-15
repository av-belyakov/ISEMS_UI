"use strict";

import React, { useEffect } from "react";
import { 
    Button,
    DialogActions,
    DialogContent,
    TextField,
    Grid,
    LinearProgress,
} from "@material-ui/core";
import TokenInput from "react-customize-token-input";
import DateFnsUtils from "dateIoFnsUtils";
import { DateTimePicker, MuiPickersUtilsProvider } from "material-ui-pickers";
import PropTypes from "prop-types";

import { helpers } from "../../../common_helpers/helpers";
import CreateListPreviousStateSTIXObject from "../createListPreviousStateSTIXObject.jsx";
import CreateElementAdditionalTechnicalInformationDO from "../createElementAdditionalTechnicalInformationDO.jsx";

const minDefaultData = "0001-01-01T00:00:00Z",
    defaultData = "2001-01-01T00:00:01Z";

export default function CreateDialogContentCampaignSTIXObject(props){
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

    //let [ dataPatterElement, setDataPatterElement ] = React.useState(listObjectInfo[currentIdSTIXObject]);
    let [ dataPatterElement, setDataPatterElement ] = React.useState({});
    
    useEffect(() => {
        if(listObjectInfo[currentIdSTIXObject]){
            setDataPatterElement(listObjectInfo[currentIdSTIXObject]);
        }

        return () => {
            setDataPatterElement({});
        };
    }, [ listObjectInfo, currentIdSTIXObject ]);

    const handlerDescription = (obj) => {
            let valueTmp = _.cloneDeep(dataPatterElement);
            valueTmp.description = obj.target.value;
    
            setDataPatterElement(valueTmp);
        }, 
        handlerTokenValuesChange = React.useCallback((newTokenValues) => {    
            let valueTmp = _.cloneDeep(dataPatterElement);
            valueTmp.aliases = newTokenValues;
    
            setDataPatterElement(valueTmp);
        }, [ setDataPatterElement, dataPatterElement ]),
        handlerObjective = (obj) => {
            let valueTmp = _.cloneDeep(dataPatterElement);
            valueTmp.objective = obj.target.value;
    
            setDataPatterElement(valueTmp);
        },
        handlerChangeDateTimeFirstSeen = (obj) => {
            let valueTmp = _.cloneDeep(dataPatterElement);
            valueTmp.first_seen = new Date(obj).toISOString();
    
            setDataPatterElement(valueTmp);
        },
        handlerChangeDateTimeLastSeen = (obj) => {
            let valueTmp = _.cloneDeep(dataPatterElement);
            valueTmp.last_seen = new Date(obj).toISOString();
    
            setDataPatterElement(valueTmp);
        },
        //пункт "уверенность создателя в правильности своих данных от 0 до 100"
        handlerElementConfidence = (obj) => { 
            let valueTmp = _.cloneDeep(dataPatterElement);
            valueTmp.confidence = obj.data;

            setDataPatterElement(valueTmp);
        },
        //пункт "определены ли данные содержащиеся в объекте"
        handlerElementDefanged = (obj) => {
            let valueTmp = _.cloneDeep(dataPatterElement);
            valueTmp.defanged = (obj.data === "true");

            setDataPatterElement(valueTmp);
        },
        //пункт "набор терминов, используемых для описания данного объекта"        
        handlerElementLabels = (obj) => {
            let valueTmp = _.cloneDeep(dataPatterElement);

            if(!Array.isArray(valueTmp.labels)){
                valueTmp.labels = [];
            }

            valueTmp.labels = obj.listTokenValue;

            setDataPatterElement(valueTmp);
        },
        handlerDeleteElementAdditionalTechnicalInformation = (obj) => {
            let valueTmp = _.cloneDeep(dataPatterElement);

            if(obj.itemType === "external_references"){
                if(obj.orderNumber < 0){
                    return;
                }

                valueTmp.external_references.splice(obj.orderNumber, 1);

                setDataPatterElement(valueTmp);
            }

            if(obj.itemType === "granular_markings"){
                if(obj.orderNumber < 0){
                    return;
                }

                valueTmp.granular_markings.splice(obj.orderNumber, 1);

                setDataPatterElement(valueTmp);
            }

            if(obj.itemType === "extensions"){
                delete valueTmp.extensions[obj.item];

                setDataPatterElement(valueTmp);
            }
     
        },
        handlerDialogElementAdditionalThechnicalInfo = (obj) => {
            let valueTmp = _.cloneDeep(dataPatterElement);

            if(obj.modalType === "external_references"){
                if(obj.actionType === "new"){
                    if(!Array.isArray(valueTmp.external_references)){
                        valueTmp.external_references = [];
                    }

                    valueTmp.external_references.push(obj.data);
    
                    setDataPatterElement(valueTmp);        
                }

                if(obj.actionType === "update"){
                    valueTmp.external_references[obj.orderNumber] = obj.data;

                    setDataPatterElement(valueTmp);        
                }

                if(obj.actionType === "hashes_update"){
                    if((valueTmp.external_references[obj.orderNumber].hashes === null) || (typeof valueTmp.external_references[obj.orderNumber].hashes === "undefined")){
                        valueTmp.external_references[obj.orderNumber].hashes = {};
                    }

                    valueTmp.external_references[obj.orderNumber].hashes[obj.data.type] = obj.data.hash;

                    setDataPatterElement(valueTmp);      
                }

                if(obj.actionType === "hashes_delete"){
                    delete valueTmp.external_references[obj.orderNumber].hashes[obj.hashName];
                    
                    setDataPatterElement(valueTmp);  
                }
            }
    
            if((obj.modalType === "granular_markings") && (obj.actionType === "new")) {
                if(!Array.isArray(valueTmp.granular_markings)){
                    valueTmp.granular_markings = [];
                }

                valueTmp.granular_markings.push(obj.data);
    
                setDataPatterElement(valueTmp);  
            }
    
            if(obj.modalType === "extensions") {
                if((valueTmp.extensions === null) || (typeof valueTmp.extensions === "undefined")){
                    valueTmp.extensions = {};
                }

                valueTmp.extensions[obj.data.name] = obj.data.description;

                setDataPatterElement(valueTmp);  
            }
        },
        handlerSave = () => {
            let valueTmp = _.cloneDeep(dataPatterElement);
            valueTmp.lang = "RU";
            
            if(valueTmp.labels === null){
                delete valueTmp.labels;
            }

            if(valueTmp.external_references === null){
                delete valueTmp.external_references;
            }

            if(valueTmp.object_marking_refs === null){
                delete valueTmp.object_marking_refs;
            }

            if(valueTmp.granular_markings === null){
                delete valueTmp.granular_markings;
            }

            if(valueTmp.extensions === null){
                delete valueTmp.extensions;
            }

            if(valueTmp.aliases === null){
                delete valueTmp.aliases;
            }

            if(valueTmp.kill_chain_phases === null){
                delete valueTmp.kill_chain_phases;
            }

            setDataPatterElement(valueTmp);

            socketIo.emit("isems-mrsi ui request: insert STIX object", { arguments: [valueTmp] });

            handlerDialog(valueTmp);  
        };

    if((!listObjectInfo[currentIdSTIXObject]) || (typeof listObjectInfo[currentIdSTIXObject] === "undefined")){
        return (<DialogContent>
            <Grid container direction="row" spacing={3}>
                <Grid item container md={12} justifyContent="center" className="pb-3">
                    поиск информации об STIX объекте типа Кампания (Campaign DO STIX)
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
                        <CreateCampaingPatternElements 
                            campaignPatterElement={dataPatterElement}
                            handlerObjective={handlerObjective}
                            handlerDescription={handlerDescription}
                            handlerTokenValuesChange={handlerTokenValuesChange}
                            handlerChangeDateTimeFirstSeen={handlerChangeDateTimeFirstSeen}
                            handlerChangeDateTimeLastSeen={handlerChangeDateTimeLastSeen}
                        />
                    </Grid> 

                    <Grid container direction="row" className="pt-3">
                        <Grid item container md={12} justifyContent="center">
                            <h3>
                                Здесь нужно разместить область с ссылками на объекты Report с которыми может быть связан данный объект. 
                                При чем нужно ограничить переходы по этим ссылка для непривелегированных пользователей. Это надо доделать.
                            </h3>
                        </Grid>
                    </Grid>

                    <CreateElementAdditionalTechnicalInformationDO 
                        reportInfo={dataPatterElement}
                        objectId={currentIdSTIXObject}
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
                disabled={_.isEqual(dataPatterElement, listObjectInfo[currentIdSTIXObject])}
                onClick={handlerSave}
                color="primary">
                сохранить
            </Button>
        </DialogActions>
    </React.Fragment>);
}

CreateDialogContentCampaignSTIXObject.propTypes = {
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

function CreateCampaingPatternElements(props){
    let { 
        campaignPatterElement, 
        handlerObjective, 
        handlerDescription, 
        handlerTokenValuesChange,
        handlerChangeDateTimeFirstSeen,
        handlerChangeDateTimeLastSeen,
    } = props;

    let firstSeen = (campaignPatterElement.first_seen === minDefaultData)? defaultData: campaignPatterElement.first_seen;
    let lastSeen = (campaignPatterElement.last_seen === minDefaultData)? defaultData: campaignPatterElement.last_seen;

    return (<React.Fragment>
        <Grid container direction="row" spacing={3}>
            <Grid item container md={4} justifyContent="flex-end"><span className="text-muted">Наименование</span>:</Grid>
            <Grid item container md={8} >{campaignPatterElement.name}</Grid>
        </Grid>

        <Grid container direction="row" spacing={3}>
            <Grid item container md={4} justifyContent="flex-end"><span className="text-muted">Дата и время</span>&nbsp;&nbsp;&nbsp;&nbsp;</Grid>
            <Grid item container md={8}></Grid>
        </Grid>      

        <Grid container direction="row" spacing={3}>
            <Grid item container md={4} justifyContent="flex-end"><span className="text-muted">создания</span>:</Grid>
            <Grid item container md={8}>
                {helpers.convertDateFromString(campaignPatterElement.created, { monthDescription: "long", dayDescription: "numeric" })}
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3}>
            <Grid item container md={4} justifyContent="flex-end"><span className="text-muted">последнего обновления</span>:</Grid>
            <Grid item container md={8}>
                {helpers.convertDateFromString(campaignPatterElement.modified, { monthDescription: "long", dayDescription: "numeric" })}
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3} style={{ marginTop: 4 }}>
            <Grid item container md={4} justifyContent="flex-end"><span className="text-muted">Подробное описание</span>:</Grid>
            <Grid item container md={8}>
                <TextField
                    id="outlined-description-static"
                    multiline
                    minRows={3}
                    maxRows={8}
                    fullWidth
                    onChange={handlerDescription}
                    defaultValue={campaignPatterElement.description}
                    variant="outlined"/>
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3} style={{ marginTop: 4 }}>
            <Grid item container md={4} justifyContent="flex-end"><span className="text-muted">Альтернативные имена</span>:</Grid>
            <Grid item md={8}>
                <TokenInput
                    style={{ height: "80px", width: "auto" }}
                    tokenValues={(!campaignPatterElement.aliases) ? []: campaignPatterElement.aliases}
                    onTokenValuesChange={handlerTokenValuesChange} />
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3} style={{ marginTop: 4 }}>
            <Grid item container md={4} justifyContent="flex-end">
                <span className="text-muted">Первое обнаружение</span>:
            </Grid>
            <Grid item container md={8}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <DateTimePicker
                        variant="inline"
                        ampm={false}
                        value={firstSeen}
                        minDate={new Date("2000-01-01")}
                        maxDate={new Date()}
                        onChange={handlerChangeDateTimeFirstSeen}
                        format="dd.MM.yyyy HH:mm"
                    />
                </MuiPickersUtilsProvider>
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3} style={{ marginTop: 4 }}>
            <Grid item container md={4} justifyContent="flex-end">
                <span className="text-muted">Последнее обнаружение</span>:
            </Grid>
            <Grid item container md={8}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <DateTimePicker
                        variant="inline"
                        ampm={false}
                        value={lastSeen}
                        minDate={new Date("2000-01-02")}
                        maxDate={new Date()}
                        onChange={handlerChangeDateTimeLastSeen}
                        format="dd.MM.yyyy HH:mm"
                    />
                </MuiPickersUtilsProvider>
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3} style={{ marginTop: 4 }}>
            <Grid item container md={4} justifyContent="flex-end">
                <span className="text-muted">Основная цель или желаемый результат</span>:
            </Grid>
            <Grid item container md={8}>
                <TextField
                    id="outlined-multiline-static"
                    multiline
                    rows={2}
                    fullWidth
                    onChange={handlerObjective}
                    defaultValue={campaignPatterElement.objective}
                    variant="outlined"/>
            </Grid>
        </Grid>
    </React.Fragment>);
}

CreateCampaingPatternElements.propTypes = {
    campaignPatterElement: PropTypes.object.isRequired,
    handlerObjective: PropTypes.func.isRequired,
    handlerDescription: PropTypes.func.isRequired,
    handlerTokenValuesChange: PropTypes.func.isRequired,
    handlerChangeDateTimeFirstSeen: PropTypes.func.isRequired,
    handlerChangeDateTimeLastSeen: PropTypes.func.isRequired,
};