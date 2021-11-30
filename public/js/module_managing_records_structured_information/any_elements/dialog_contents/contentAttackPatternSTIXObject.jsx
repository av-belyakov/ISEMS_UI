"use strict";

import React from "react";
import { Col, Row } from "react-bootstrap";
import { 
    Button,
    DialogActions,
    DialogContent,
    Grid,
    TextField,
    IconButton,
} from "@material-ui/core";
import RemoveCircleOutlineOutlinedIcon from "@material-ui/icons/RemoveCircleOutlineOutlined";
import { red } from "@material-ui/core/colors";
import TokenInput from "react-customize-token-input";
import PropTypes from "prop-types";

import { helpers } from "../../../common_helpers/helpers";
import CreateElementAdditionalTechnicalInformationDO from "../createElementAdditionalTechnicalInformationDO.jsx";

export default function CreateDialogContentAttackPatternSTIXObject(props){
    let { 
        listObjectInfo, 
        currentIdSTIXObject,
        socketIo,
        handlerDialog,
        handelrDialogClose,
        isNotDisabled,
    } = props;

    let [ attackPatterElement, setAttackPatterElement ] = React.useState(listObjectInfo[currentIdSTIXObject]);
    let [ valueNameChain, setValueNameChain ] = React.useState("");
    let [ valueNamePhases, setValueNamePhases ] = React.useState("");
    let [ buttonAddNewKillChain, setButtonAddNewKillChain ] = React.useState(true);
    let [ invalidNameChain, setInvalidNameChain ] = React.useState(true);
    let [ invalidNamePhases, setInvalidNamePhases ] = React.useState(true);

    const handlerAddNewKillChain = () => {
            if(invalidNameChain || invalidNamePhases){
                return;
            }

            let valueAPTmp = _.cloneDeep(attackPatterElement);

            if(!Array.isArray(valueAPTmp.kill_chain_phases)){
                valueAPTmp.kill_chain_phases = [];
            }

            valueAPTmp.kill_chain_phases.push({ kill_chain_name: valueNameChain, phase_name: valueNamePhases });

            setAttackPatterElement(valueAPTmp);
            setInvalidNameChain(true);
            setInvalidNamePhases(true);
            setButtonAddNewKillChain(true);
            setValueNameChain("");
            setValueNamePhases("");
        },
        handlerNameChain = (obj) => {
            setValueNameChain(obj.target.value);

            if(!new RegExp("^[a-zA-Z0-9_-]{3,}$").test(obj.target.value)){
                setInvalidNameChain(true);
                setButtonAddNewKillChain(true);

                return;
            }

            setInvalidNameChain(false);

            if(!invalidNamePhases){
                setButtonAddNewKillChain(false);
            }
        },
        handlerNamePhases = (obj) => {
            setValueNamePhases(obj.target.value);

            if(!new RegExp("^[a-zA-Z0-9_-]{3,}$").test(obj.target.value)){
                setInvalidNamePhases(true);
                setButtonAddNewKillChain(true); 

                return;
            }

            setInvalidNamePhases(false);

            if(!invalidNameChain){
                setButtonAddNewKillChain(false);
            }
        },
        handlerDescription = (obj) => {
            let valueAPTmp = _.cloneDeep(attackPatterElement);
            valueAPTmp.description = obj.target.value;
        
            setAttackPatterElement(valueAPTmp);
        },
        handlerTokenValuesChange = React.useCallback((newTokenValues) => {            
            let valueAPTmp = _.cloneDeep(attackPatterElement);
            valueAPTmp.aliases = newTokenValues;
        
            setAttackPatterElement(valueAPTmp);
        }, [ setAttackPatterElement, attackPatterElement/*, setCurrentSTIXObj, currentSTIXObj */]),
        handlerDeleteKillChain = (num) => {
            let valueAPTmp = _.cloneDeep(attackPatterElement);
            valueAPTmp.kill_chain_phases.splice(num, 1);

            setAttackPatterElement(valueAPTmp);
        },
        //пункт "уверенность создателя в правильности своих данных от 0 до 100"
        handlerElementConfidence = (obj) => { 
            let valueAPTmp = _.cloneDeep(attackPatterElement);
            valueAPTmp.confidence = obj.data;
        
            setAttackPatterElement(valueAPTmp);
        },
        //пункт "определены ли данные содержащиеся в объекте"
        handlerElementDefanged = (obj) => {
            let valueAPTmp = _.cloneDeep(attackPatterElement);
            valueAPTmp.defanged = (obj.data === "true");
        
            setAttackPatterElement(valueAPTmp);
        },
        //пункт "набор терминов, используемых для описания данного объекта"
        handlerElementLabels = (obj) => {
            let valueAPTmp = _.cloneDeep(attackPatterElement);

            if(!Array.isArray(valueAPTmp.labels)){
                valueAPTmp.labels = [];
            }

            valueAPTmp.labels = obj.listTokenValue;
        
            setAttackPatterElement(valueAPTmp);
        },
        handlerDeleteElementAdditionalTechnicalInformation = (obj) => {
            let valueAPTmp = _.cloneDeep(attackPatterElement);

            if(obj.itemType === "external_references"){
                if(obj.orderNumber < 0){
                    return;
                }

                valueAPTmp.external_references.splice(obj.orderNumber, 1);

                setAttackPatterElement(valueAPTmp);
            }

            if(obj.itemType === "granular_markings"){
                if(obj.orderNumber < 0){
                    return;
                }

                valueAPTmp.granular_markings.splice(obj.orderNumber, 1);

                setAttackPatterElement(valueAPTmp);
            }

            if(obj.itemType === "extensions"){
                delete valueAPTmp.extensions[obj.item];

                setAttackPatterElement(valueAPTmp);
            }
             
        },
        handlerDialogElementAdditionalThechnicalInfo = (obj) => {
            //console.log("func 'handlerDialogElementAdditionalThechnicalInfo', START...");
            //console.log(obj);
            //console.log("-------------");

            let valueAPTmp = _.cloneDeep(attackPatterElement);

            if(obj.modalType === "external_references"){
                if(obj.actionType === "new"){
                    if(!Array.isArray(valueAPTmp.external_references)){
                        valueAPTmp.external_references = [];
                    }

                    valueAPTmp.external_references.push(obj.data);
            
                    setAttackPatterElement(valueAPTmp);        
                }

                if(obj.actionType === "update"){
                    valueAPTmp.external_references[obj.orderNumber] = obj.data;
                    setAttackPatterElement(valueAPTmp);        
                }

                if(obj.actionType === "hashes_update"){
                    if((valueAPTmp.external_references[obj.orderNumber].hashes === null) || (typeof valueAPTmp.external_references[obj.orderNumber].hashes === "undefined")){
                        valueAPTmp.external_references[obj.orderNumber].hashes = {};
                    }

                    valueAPTmp.external_references[obj.orderNumber].hashes[obj.data.type] = obj.data.hash;
                    setAttackPatterElement(valueAPTmp);      
                }

                if(obj.actionType === "hashes_delete"){
                    delete valueAPTmp.external_references[obj.orderNumber].hashes[obj.hashName];
                    setAttackPatterElement(valueAPTmp);  
                }
            }
            
            if((obj.modalType === "granular_markings") && (obj.actionType === "new")) {
                if(!Array.isArray(valueAPTmp.granular_markings)){
                    valueAPTmp.granular_markings = [];
                }

                valueAPTmp.granular_markings.push(obj.data);
            
                setAttackPatterElement(valueAPTmp);  
            }
            
            if(obj.modalType === "extensions") {
                if((valueAPTmp.extensions === null) || (typeof valueAPTmp.extensions === "undefined")){
                    valueAPTmp.extensions = {};
                }

                valueAPTmp.extensions[obj.data.name] = obj.data.description;
        
                setAttackPatterElement(valueAPTmp);  
            }
        },
        handlerSave = () => {
            let valueAPTmp = _.cloneDeep(attackPatterElement);
            //valueAPTmp.modified = helpers.getToISODatetime();
            valueAPTmp.lang = "RU";

            
            if(valueAPTmp.labels === null){
                valueAPTmp.labels = [];
            }

            if(valueAPTmp.external_references === null){
                valueAPTmp.external_references = [];
            }

            if(valueAPTmp.object_marking_refs === null){
                valueAPTmp.object_marking_refs = [];
            }

            if(valueAPTmp.granular_markings === null){
                valueAPTmp.granular_markings = [];
            }

            if(valueAPTmp.extensions === null){
                valueAPTmp.extensions = {};
            }

            if(valueAPTmp.aliases === null){
                valueAPTmp.aliases = [];
            }

            if(valueAPTmp.kill_chain_phases === null){
                valueAPTmp.kill_chain_phases = [];
            }
            

            setAttackPatterElement(valueAPTmp);

            //ObjectMarkingRefs  []string       `json:"object_marking_refs" bson:"object_marking_refs"`
            //ObjectMarkingRefs - определяет список ID ссылающиеся на объект "marking-definition", по терминалогии STIX, в котором содержатся значения применяющиеся к этому объекту

            //socketIo.emit("isems-mrsi ui request: insert STIX object", { arguments: [ valueAPTmp ] });
            socketIo.emit("isems-mrsi ui request: insert STIX object", { arguments: [valueAPTmp] });

            handlerDialog(valueAPTmp);
        };

    if((listObjectInfo[currentIdSTIXObject] === null) || (typeof listObjectInfo[currentIdSTIXObject] === "undefined")){
        return (<Grid container direction="row" spacing={3}>
            <Grid item container md={12}>Поиск информации об STIX объекте типа Шаблон атаки (Attack Pattern DO STIX)</Grid>
        </Grid>);
    }

    /**
     * Надо сделать область для вывода ИСТОРИИ ИЗМЕНЕНИЙ и ссылки на объекты Report с которыми может
     * быть связан данный объект
     */

    return (<React.Fragment>
        <DialogContent>
            <CreateAtackPatternElements 
                attackPatterElement={attackPatterElement}
                valueNameChain={valueNameChain}
                valueNamePhases={valueNamePhases}
                buttonAddNewKillChain={buttonAddNewKillChain}
                invalidNameChain={invalidNameChain}
                invalidNamePhases={invalidNamePhases}
                handlerNameChain={handlerNameChain}
                handlerNamePhases={handlerNamePhases}
                handlerDescription={handlerDescription}
                handlerAddNewKillChain={handlerAddNewKillChain}
                handlerTokenValuesChange={handlerTokenValuesChange} 
                handlerDeleteKillChain={handlerDeleteKillChain} />

            <Row className="pt-2"><Col md={12}></Col></Row>

            <CreateElementAdditionalTechnicalInformationDO 
                reportInfo={attackPatterElement}
                objectId={currentIdSTIXObject}
                handlerElementConfidence={handlerElementConfidence}
                handlerElementDefanged={handlerElementDefanged}
                handlerElementLabels={handlerElementLabels}
                handlerElementDelete={handlerDeleteElementAdditionalTechnicalInformation}
                handlerDialogElementAdditionalThechnicalInfo={handlerDialogElementAdditionalThechnicalInfo}
                isNotDisabled={isNotDisabled} /> 
        </DialogContent>
        <DialogActions>
            <Button onClick={handelrDialogClose} color="primary">закрыть</Button>
            <Button 
                disabled={_.isEqual(attackPatterElement, listObjectInfo[currentIdSTIXObject])}
                onClick={handlerSave}
                color="primary">
                сохранить
            </Button>
        </DialogActions>
    </React.Fragment>);
}

CreateDialogContentAttackPatternSTIXObject.propTypes = {
    listObjectInfo: PropTypes.object.isRequired,
    currentIdSTIXObject: PropTypes.string.isRequired,
    socketIo: PropTypes.object.isRequired,
    handlerDialog: PropTypes.func.isRequired,
    handelrDialogClose: PropTypes.func.isRequired,
    isNotDisabled: PropTypes.bool.isRequired,
};

function CreateAtackPatternElements(props){
    let { 
        attackPatterElement,
        valueNameChain,
        valueNamePhases,
        buttonAddNewKillChain,
        invalidNameChain,
        invalidNamePhases,
        handlerNameChain,
        handlerNamePhases,
        handlerDescription,
        handlerAddNewKillChain,
        handlerTokenValuesChange,
        handlerDeleteKillChain,
    } = props;

    return (<React.Fragment>
        <Grid container direction="row" spacing={3}>
            <Grid item container md={4} justifyContent="flex-end"><span className="text-muted">Наименование</span>:</Grid>
            <Grid item container md={8} >{attackPatterElement.name}</Grid>
        </Grid>

        <Grid container direction="row" spacing={3}>
            <Grid item container md={4} justifyContent="flex-end"><span className="text-muted">Дата и время</span>&nbsp;&nbsp;&nbsp;&nbsp;</Grid>
            <Grid item container md={8}></Grid>
        </Grid>      

        <Grid container direction="row" spacing={3}>
            <Grid item container md={4} justifyContent="flex-end"><span className="text-muted">создания</span>:</Grid>
            <Grid item container md={8}>
                {helpers.convertDateFromString(attackPatterElement.created, { monthDescription: "long", dayDescription: "numeric" })}
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3}>
            <Grid item container md={4} justifyContent="flex-end"><span className="text-muted">последнего обновления</span>:</Grid>
            <Grid item container md={8}>
                {helpers.convertDateFromString(attackPatterElement.modified, { monthDescription: "long", dayDescription: "numeric" })}
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3} style={{ marginTop: 4 }}>
            <Grid item container md={4} justifyContent="flex-end"><span className="text-muted">Подробное описание</span>:</Grid>
            <Grid item container md={8}>
                <TextField
                    id="outlined-multiline-static"
                    multiline
                    rows={3}
                    fullWidth
                    onChange={handlerDescription}
                    defaultValue={attackPatterElement.description}
                    variant="outlined"/>
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3} style={{ marginTop: 4 }}>
            <Grid item container md={4} justifyContent="flex-end"><span className="text-muted">Альтернативные имена</span>:</Grid>
            <Grid item md={8}>
                <TokenInput
                    style={{ height: "41px", width: "auto" }}
                    tokenValues={(attackPatterElement.aliases === null) ? []: attackPatterElement.aliases}
                    onTokenValuesChange={handlerTokenValuesChange} />
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3} style={{ marginTop: 4 }}>
            <Grid item container md={12} justifyContent="flex-start">
                <span className="text-muted">Набор элементов цепочки фактов, приведших к какому либо урону</span>
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={1}>
            <Grid item container md={5}>
                <TextField
                    id="input_new_name_kill_chain"
                    fullWidth
                    error={invalidNameChain}
                    label="имя цепочки"
                    value={valueNameChain}
                    onChange={handlerNameChain} />
            </Grid>
            <Grid item container md={5}>
                <TextField
                    id="input_new_name_phases"
                    fullWidth
                    error={invalidNamePhases}
                    label="наименование фазы"
                    value={valueNamePhases}
                    onChange={handlerNamePhases} />
            </Grid>
            <Grid item container md={2} justifyContent="center">
                <Button onClick={handlerAddNewKillChain} disabled={buttonAddNewKillChain}>добавить цепочку</Button>
            </Grid>
        </Grid>

        <CreateKillChainPhasesList 
            listKillChainPhases={(attackPatterElement.kill_chain_phases === null) ? []: attackPatterElement.kill_chain_phases} 
            handlerDeleteItem={handlerDeleteKillChain} />
    </React.Fragment>);
}

CreateAtackPatternElements.propTypes = {
    attackPatterElement: PropTypes.object.isRequired,
    valueNameChain: PropTypes.string.isRequired,
    valueNamePhases: PropTypes.string.isRequired,
    buttonAddNewKillChain: PropTypes.bool.isRequired,
    invalidNameChain: PropTypes.bool.isRequired,
    invalidNamePhases: PropTypes.bool.isRequired,
    handlerNameChain: PropTypes.func.isRequired,
    handlerNamePhases: PropTypes.func.isRequired,
    handlerDescription: PropTypes.func.isRequired,
    handlerAddNewKillChain: PropTypes.func.isRequired,
    handlerTokenValuesChange: PropTypes.func.isRequired,
    handlerDeleteKillChain: PropTypes.func.isRequired,
};

function CreateKillChainPhasesList(props){
    let { listKillChainPhases, handlerDeleteItem } = props;

    if(listKillChainPhases.length === 0){
        return "";
    }

    return (<Grid container direction="row" className="mt-3">
        <Grid item container md={12} justifyContent="flex-start">
            <ol>
                {listKillChainPhases.map((item, num) => {
                    return (<li key={`key_item_kill_phases_${num}`}>
                        <span className="text-muted">наименование</span>: {item.kill_chain_name}, <span className="text-muted">фаза</span>: {item.phase_name}&nbsp;
                        <IconButton aria-label="delete-hash" onClick={() => handlerDeleteItem.call(null, num)}>
                            <RemoveCircleOutlineOutlinedIcon style={{ color: red[400] }} />
                        </IconButton>
                    </li>);
                })}
            </ol>
        </Grid>
    </Grid>);
}

CreateKillChainPhasesList.propTypes = {
    listKillChainPhases: PropTypes.array.isRequired,
    handlerDeleteItem: PropTypes.func.isRequired,
};
