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
import { teal, grey } from "@material-ui/core/colors";
import { makeStyles } from "@material-ui/core/styles";
import RemoveCircleOutlineOutlinedIcon from "@material-ui/icons/RemoveCircleOutlineOutlined";
import { red } from "@material-ui/core/colors";
import TokenInput from "react-customize-token-input";
import PropTypes from "prop-types";

import { helpers } from "../../../common_helpers/helpers";
import CreateElementAdditionalTechnicalInformationDO from "../createElementAdditionalTechnicalInformationDO.jsx";

//import { nextTick } from "async";

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
    columeLeft: {
        alignContent: "text-right",
        marginRight: theme.spacing(2),
    },
}));

export default function CreateDialogContentAttackPatternSTIXObject(props){
    let { 
        listObjectInfo, 
        currentIdSTIXObject,
        handlerDialog,
        handelrDialogClose,
        isNotDisabled,
    } = props;

    console.log("func 'CreateDialogContentAttackPatternSTIXObject', START...");

    let [ attackPatterElement, setAttackPatterElement ] = React.useState(listObjectInfo[currentIdSTIXObject]);
    let [ valueNameChain, setValueNameChain ] = React.useState("");
    let [ valueNamePhases, setValueNamePhases ] = React.useState("");
    let [ buttonAddNewKillChain, setButtonAddNewKillChain ] = React.useState(true);
    let [ invalidNameChain, setInvalidNameChain ] = React.useState(true);
    let [ invalidNamePhases, setInvalidNamePhases ] = React.useState(true);

    const handlerAddNewKillChain = () => {
            console.log("func 'handlerAddNewKillChain', START...");

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
        handlerDeleteElementAdditionalTechnicalInformation = () => {
            console.log("func 'handlerDeleteElementAdditionalTechnicalInformation', START...");

            /**
            let externalReferences = [];
        let listObjectTmp = _.cloneDeep(this.state.listObjectInfo);

        if(obj.itemType === "external_references"){
            externalReferences = listObjectTmp[obj.objectId].external_references.filter((item) => item.source_name !== obj.item);
            listObjectTmp[obj.objectId].external_references = externalReferences;

            this.setState({ listObjectInfo: listObjectTmp });
        }

        if(obj.itemType === "granular_markings"){
            if(obj.orderNumber < 0){
                return;
            }

            listObjectTmp[obj.objectId].granular_markings.splice(obj.orderNumber, 1);

            this.setState({ listObjectInfo: listObjectTmp });
        }

        if(obj.itemType === "extensions"){
            delete listObjectTmp[obj.objectId].extensions[obj.item];

            this.setState({ listObjectInfo: listObjectTmp });
        }
             */
        },
        showDialogElementAdditionalThechnicalInfo = () => {
            console.log("func 'showDialogElementAdditionalThechnicalInfo', START...");

            /**
            console.log("func 'showDialogElementAdditionalThechnicalInfo', START...");
        console.log(obj);

        this.setState({
            uuidValue: uuidv4(),
            showDialogElementAdditionalThechnicalInfo: true,
            objectDialogElementAdditionalThechnicalInfo: { 
                actionType: obj.actionType,
                modalType: obj.modalType, 
                objectId: obj.objectId,
                sourceName: obj.sourceName,
                orderNumber: obj.orderNumber,
            },
        });
             */
        },
        handlerSave = () => {
            let valueAPTmp = _.cloneDeep(attackPatterElement);
            valueAPTmp.modified = (new Date).toISOString();
        
            setAttackPatterElement(valueAPTmp);

            handlerDialog(attackPatterElement);
        };

    if((listObjectInfo[currentIdSTIXObject] === null) || (typeof listObjectInfo[currentIdSTIXObject] === "undefined")){
        return (<Grid container direction="row" spacing={3}>
            <Grid item container md={12}>Поиск информации об STIX объекте типа Шаблон атаки (Attack Pattern DO STIX)</Grid>
        </Grid>);
    }

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

            <Row className="pt-2">
                <Col md={12} ></Col>
            </Row>

            <CreateElementAdditionalTechnicalInformationDO 
                reportInfo={attackPatterElement}
                objectId={currentIdSTIXObject}
                handlerElementConfidence={handlerElementConfidence}
                handlerElementDefanged={handlerElementDefanged}
                handlerElementLabels={handlerElementLabels}
                handlerElementDelete={handlerDeleteElementAdditionalTechnicalInformation}
                showDialogElementAdditionalThechnicalInfo={showDialogElementAdditionalThechnicalInfo}
                isNotDisabled={isNotDisabled} /> 

            <Col md={12} className="pt-2 pl-3 pr-3">{JSON.stringify(listObjectInfo[currentIdSTIXObject])}</Col>
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
    handlerDialog: PropTypes.func.isRequired,
    handelrDialogClose: PropTypes.func.isRequired,
    isNotDisabled: PropTypes.bool.isRequired,
};

/**
//CommonPropertiesDomainObjectSTIX свойства общие, для всех объектов STIX
// SpecVersion - версия спецификации STIX используемая для представления текущего объекта (ОБЯЗАТЕЛЬНОЕ ЗНАЧЕНИЕ)
// Created - время создания объекта, в формате "2016-05-12T08:17:27.000Z" (ОБЯЗАТЕЛЬНОЕ ЗНАЧЕНИЕ)
// Modified - время модификации объекта, в формате "2016-05-12T08:17:27.000Z" (ОБЯЗАТЕЛЬНОЕ ЗНАЧЕНИЕ)
// CreatedByRef - содержит идентификатор источника создавшего данный объект
// Revoked - вернуть к текущему состоянию
// Labels - определяет набор терминов, используемых для описания данного объекта
// Сonfidence - определяет уверенность создателя в правильности своих данных. Доверительное значение ДОЛЖНО быть числом
//  в диапазоне 0-100. Если 0 - значение не определено.
// Lang - содержит текстовый код языка, на котором написан контент объекта. Для английского это "en" для русского "ru"
// ExternalReferences - список внешних ссылок не относящихся к STIX информации
// ObjectMarkingRefs - определяет список ID ссылающиеся на объект "marking-definition", по терминалогии STIX, в котором содержатся значения применяющиеся к этому объекту
// GranularMarkings - определяет список "гранулярных меток" (granular_markings) относящихся к этому объекту
// Defanged - определяет были ли определены данные содержащиеся в объекте
// Extensions - может содержать дополнительную информацию, относящуюся к объекту
type CommonPropertiesDomainObjectSTIX struct {
	SpecVersion        string                     `json:"spec_version" bson:"spec_version" required:"true"`
	Created            time.Time                  `json:"created" bson:"created" required:"true"`
	Modified           time.Time                  `json:"modified" bson:"modified" required:"true"`
	CreatedByRef       IdentifierTypeSTIX         `json:"created_by_ref" bson:"created_by_ref"`
	Revoked            bool                       `json:"revoked" bson:"revoked"`
	Labels             []string                   `json:"labels" bson:"labels"`
	Сonfidence         int                        `json:"confidence" bson:"confidence"`
	Lang               string                     `json:"lang" bson:"lang"`
	ExternalReferences ExternalReferencesTypeSTIX `json:"external_references" bson:"external_references"`
	ObjectMarkingRefs  []IdentifierTypeSTIX       `json:"object_marking_refs" bson:"object_marking_refs"`
	GranularMarkings   []GranularMarkingsTypeSTIX `json:"granular_markings" bson:"granular_markings"`
	Defanged           bool                       `json:"defanged" bson:"defanged"`
	Extensions         map[string]string          `json:"extensions" bson:"extensions"`
}
 */

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

    //    console.log("func 'CreateAtackPatternElements'");
    //    console.log(attackPatterElement);
    //    console.log((new Date).toISOString());
    //    console.log(`valueNameChain: '${valueNameChain}'`);
    //    console.log(`valueNamePhases: '${valueNamePhases}'`);

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
