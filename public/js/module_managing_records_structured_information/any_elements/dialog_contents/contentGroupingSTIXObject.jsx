"use strict";

import React, { useEffect, useReducer } from "react";
import { 
    Button,
    DialogActions,
    DialogContent,
    Grid,
    TextField,
    Typography,
} from "@material-ui/core";
import { red } from "@material-ui/core/colors";
import PropTypes from "prop-types";

import { helpers } from "../../../common_helpers/helpers";

import { CreateListContextGrouping } from "../anyElements.jsx";
import CreateListPreviousStateSTIX from "../createListPreviousStateSTIX.jsx";
import CreateElementAdditionalTechnicalInformationDO from "../createElementAdditionalTechnicalInformationDO.jsx";

const reducer = (state, action) => {
    switch(action.type){
    case "newAll":
        return action.data;
    case "cleanAll":
        return {};
    case "updateContex":
        return {...state, context: action.data};            
    case "updateDescription":
        if(state.description === action.data){
            return {...state};
        }

        return {...state, description: action.data};
    case "updateConfidence":
        if(state.confidence === action.data.data){
            return {...state};
        }

        return {...state, confidence: action.data.data};
    case "updateDefanged":
        return {...state, defanged: (action.data === "true")};
    case "updateLabels":
        return {...state, labels: action.data.listTokenValue};
    case "updateExternalReferences":
        if(!state.external_references){
            state.external_references = [];
        }

        for(let key of state.external_references){
            if(key.source_name === action.data.source_name){
                return {...state};
            }
        }

        state.external_references.push(action.data);

        return {...state};
    case "updateExternalReferencesHashesUpdate":
        if((state.external_references[action.data.orderNumber].hashes === null) || (typeof state.external_references[action.data.orderNumber].hashes === "undefined")){
            state.external_references[action.data.orderNumber].hashes = {};
        }

        state.external_references[action.data.orderNumber].hashes[action.data.newHash.hash] = action.data.newHash.type;

        return {...state};
    case "updateExternalReferencesHashesDelete":
        delete state.external_references[action.data.orderNumber].hashes[action.data.hashName];

        return {...state};
    case "updateGranularMarkings":
        if(!state.granular_markings){
            state.granular_markings = [];
        }

        for(let keyGM of state.granular_markings){
            if(!keyGM.selectors){
                return {...state};
            }

            for(let keyS of keyGM.selectors){
                for(let key of action.data.selectors){
                    if(key === keyS){
                        return {...state};
                    }
                }
            }
        }

        state.granular_markings.push(action.data);

        return {...state};
    case "updateExtensions":
        if(!state.extensions){
            state.extensions = {};
        }

        state.extensions[action.data.name] = action.data.description;

        return {...state};
    case "deleteElementAdditionalTechnicalInformation":
        switch(action.data.itemType){
        case "extensions":
            delete state.extensions[action.data.item];

            return {...state};
        case "granular_markings":
            state.granular_markings.splice(action.data.orderNumber, 1);

            return {...state};
        case "external_references":
            state.external_references.splice(action.data.orderNumber, 1);

            return {...state};
        }
    }
};

export default function CreateDialogContentGroupingSTIXObject(props){
    let { 
        socketIo,
        isNotDisabled,
        parentIdSTIXObject,
        currentAdditionalIdSTIXObject,
        handlerDialogClose,
    } = props;

    let [ buttonIsDisabled, setButtonIsDisabled ] = React.useState(true);
    let [ buttonSaveChangeTrigger, setButtonSaveChangeTrigger ] = React.useState(false);

    const handlerButtonIsDisabled = (valueButton) => {
            setButtonIsDisabled(valueButton);
        },
        handlerButtonSaveChangeTrigger = () => {
            setButtonSaveChangeTrigger((prevState) => !prevState);
        };

    return (<React.Fragment>
        <DialogContent>
            <Grid container direction="row" spacing={3}>
                <CreateMajorContent 
                    socketIo={socketIo}
                    parentIdSTIXObject={parentIdSTIXObject}
                    currentIdSTIXObject={currentAdditionalIdSTIXObject}
                    buttonSaveChangeTrigger={buttonSaveChangeTrigger}
                    isNotDisabled={isNotDisabled}
                    handlerDialogClose={handlerDialogClose}
                    handlerButtonIsDisabled={handlerButtonIsDisabled}
                    handlerButtonSaveChangeTrigger={handlerButtonSaveChangeTrigger}
                />

                <Grid item container md={4} style={{ display: "block" }}>
                    <CreateListPreviousStateSTIX 
                        socketIo={socketIo} 
                        searchObjectId={currentAdditionalIdSTIXObject} 
                    />
                </Grid>
            </Grid>            
        </DialogContent>
        <DialogActions>
            <Button onClick={handlerDialogClose} color="primary">закрыть</Button>            
            {isNotDisabled && <Button
                disabled={buttonIsDisabled} 
                onClick={() => setButtonSaveChangeTrigger(true)}
                color="primary">
                сохранить
            </Button>}
        </DialogActions>
    </React.Fragment>);
}

CreateDialogContentGroupingSTIXObject.propTypes = {
    socketIo: PropTypes.object.isRequired,
    isNotDisabled: PropTypes.bool.isRequired,
    parentIdSTIXObject: PropTypes.string.isRequired,
    currentAdditionalIdSTIXObject: PropTypes.string.isRequired,
    handlerDialogClose: PropTypes.func.isRequired,
};

function CreateMajorContent(props){
    let {
        socketIo,
        parentIdSTIXObject,
        currentIdSTIXObject,
        buttonSaveChangeTrigger,
        isNotDisabled,
        handlerDialogClose,
        handlerButtonIsDisabled,
        handlerButtonSaveChangeTrigger,
    } = props;

    const [ state, dispatch ] = useReducer(reducer, {});

    const listener = (data) => {
        if((data.information === null) || (typeof data.information === "undefined")){
            return;
        }

        if((data.information.additional_parameters === null) || (typeof data.information.additional_parameters === "undefined")){
            return;
        }

        if((data.information.additional_parameters.transmitted_data === null) || (typeof data.information.additional_parameters.transmitted_data === "undefined")){
            return;
        }

        if(data.information.additional_parameters.transmitted_data.length === 0){
            return;
        }

        for(let obj of data.information.additional_parameters.transmitted_data){

            console.log("++++++++++++ func 'listener', reseived data: ", obj);

            dispatch({ type: "newAll", data: obj });
        }
    };
    useEffect(() => {
        socketIo.on("isems-mrsi response ui: send search request, get STIX object for id", listener);

        return () => {
            socketIo.off("isems-mrsi response ui: send search request, get STIX object for id", listener);
            dispatch({ type: "newAll", data: {} });
        };
    }, []);
    useEffect(() => {
        if(currentIdSTIXObject !== ""){
            socketIo.emit("isems-mrsi ui request: send search request, get STIX object for id", { arguments: { 
                searchObjectId: currentIdSTIXObject,
                parentObjectId: parentIdSTIXObject,
            }});
        }
    }, [ socketIo, currentIdSTIXObject, parentIdSTIXObject ]);
    useEffect(() => {
        if(buttonSaveChangeTrigger){
            socketIo.emit("isems-mrsi ui request: insert STIX object", { arguments: [ state ] });
            handlerButtonSaveChangeTrigger();
            handlerDialogClose();
        }
    }, [ buttonSaveChangeTrigger, handlerButtonSaveChangeTrigger ]);

    const checkRequiredValue = (content, objectRefs) => {
        if(content !== "" && objectRefs.length > 0){
            return true;
        }

        return false;
    };

    const handlerDialogElementAdditionalThechnicalInfo = (obj) => {
        console.log("func 'handlerDialogElementAdditionalThechnicalInfo', state:");
        console.log(state);
        console.log("func 'handlerDialogElementAdditionalThechnicalInfo', obj:");
        console.log(obj);

        if(obj.modalType === "external_references"){
            switch(obj.actionType){
            case "hashes_update":
                console.log("external_references - hashes_update");

                dispatch({ type: "updateExternalReferencesHashesUpdate", data: { newHash: obj.data, orderNumber: obj.orderNumber }});
                
                if(checkRequiredValue(state.context, state.object_refs)){
                    handlerButtonIsDisabled(false);
                } else {
                    handlerButtonIsDisabled(true);
                }

                break;
            case "hashes_delete":
                console.log("external_references - hashes_delete");
                console.log(obj);

                dispatch({ type: "updateExternalReferencesHashesDelete", data: { hashName: obj.hashName, orderNumber: obj.orderNumber }});
               
                if(checkRequiredValue(state.context, state.object_refs)){
                    handlerButtonIsDisabled(false);
                } else {
                    handlerButtonIsDisabled(true);
                }

                break;
            default:
                console.log("external_references - default");
                console.log("obj.modalType - ", obj.modalType);

                dispatch({ type: "updateExternalReferences", data: obj.data });

                if(checkRequiredValue(state.context, state.object_refs)){
                    handlerButtonIsDisabled(false);
                } else {
                    handlerButtonIsDisabled(true);
                }
            }
        }
    
        if(obj.modalType === "granular_markings") {
            console.log("updateGranularMarkings......");
            console.log(obj);

            dispatch({ type: "updateGranularMarkings", data: obj.data });

            if(checkRequiredValue(state.context, state.object_refs)){
                handlerButtonIsDisabled(false);
            } else {
                handlerButtonIsDisabled(true);
            }
        }
    
        if(obj.modalType === "extensions") {
            console.log("obj.modalType === extensions, obj: ", obj);

            dispatch({ type: "updateExtensions", data: obj.data });

            if(checkRequiredValue(state.context, state.object_refs)){
                handlerButtonIsDisabled(false);
            } else {
                handlerButtonIsDisabled(true);
            }
        }
    };
    
    return (<Grid item container md={8}>
        <Grid container direction="row" className="pt-3">
            <CreateGroupingPatternElements 
                campaignPatterElement={state}
                handlerContext={(e) => { 
                    dispatch({ type: "updateContex", data: e.target.value });

                    if(checkRequiredValue(e.target.value, state.object_refs)){
                        handlerButtonIsDisabled(false);
                    } else {
                        handlerButtonIsDisabled(true);
                    }
                }}
                handlerDescription={(e) => { 
                    dispatch({ type: "updateDescription", data: e.target.value }); 

                    if(checkRequiredValue(state.context, state.object_refs)){
                        handlerButtonIsDisabled(false);
                    } else {
                        handlerButtonIsDisabled(true);
                    }
                }}
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
            objectId={currentIdSTIXObject}
            reportInfo={state}
            isNotDisabled={isNotDisabled}
            handlerElementConfidence={(e) => { 
                dispatch({ type: "updateConfidence", data: e }); 
                
                if(checkRequiredValue(state.context, state.object_refs)){
                    handlerButtonIsDisabled(false);
                } else {
                    handlerButtonIsDisabled(true);
                } 
            }}
            handlerElementDefanged={(e) => { 
                dispatch({ type: "updateDefanged", data: e }); 

                if(checkRequiredValue(state.context, state.object_refs)){
                    handlerButtonIsDisabled(false);
                } else {
                    handlerButtonIsDisabled(true);
                }
            }}
            handlerElementLabels={(e) => { 
                dispatch({ type: "updateLabels", data: e }); 
                if(checkRequiredValue(state.context, state.object_refs)){
                    handlerButtonIsDisabled(false);
                } else {
                    handlerButtonIsDisabled(true);
                }
            }}
            handlerElementDelete={(e) => { 
                dispatch({ type: "deleteElementAdditionalTechnicalInformation", data: e }); 
                if(checkRequiredValue(state.context, state.object_refs)){
                    handlerButtonIsDisabled(false);
                } else {
                    handlerButtonIsDisabled(true);
                } 
            }}
            handlerDialogElementAdditionalThechnicalInfo={handlerDialogElementAdditionalThechnicalInfo} 
        />
    </Grid>);
}

CreateMajorContent.propTypes = {
    socketIo: PropTypes.object.isRequired,
    parentIdSTIXObject: PropTypes.string.isRequired,
    currentIdSTIXObject: PropTypes.string.isRequired,
    buttonSaveChangeTrigger: PropTypes.bool.isRequired,
    isNotDisabled: PropTypes.bool.isRequired,
    handlerDialogClose: PropTypes.func.isRequired,
    handlerButtonIsDisabled: PropTypes.func.isRequired,
    handlerButtonSaveChangeTrigger: PropTypes.func.isRequired,
};

function CreateGroupingPatternElements(props){
    let { 
        campaignPatterElement,
        handlerContext,
        handlerDescription,
    } = props;

    console.log("func 'CreateInfrastructurePatternElements', campaignPatterElement: ", campaignPatterElement);
    console.log("_______________________________________");

    return (<React.Fragment>
        <Grid container direction="row" spacing={3}>
            <Grid item container md={4} justifyContent="flex-end"><span className="text-muted">Наименование:</span></Grid>
            <Grid item container md={8} >{campaignPatterElement.name}</Grid>
        </Grid>

        <Grid container direction="row" spacing={3}>
            <Grid item container md={4} justifyContent="flex-end"><span className="text-muted">Дата и время</span>&nbsp;&nbsp;&nbsp;&nbsp;</Grid>
            <Grid item container md={8}></Grid>
        </Grid>      

        <Grid container direction="row" spacing={3}>
            <Grid item container md={4} justifyContent="flex-end"><span className="text-muted">создания:</span></Grid>
            <Grid item container md={8}>
                {helpers.convertDateFromString(campaignPatterElement.created, { monthDescription: "long", dayDescription: "numeric" })}
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3}>
            <Grid item container md={4} justifyContent="flex-end"><span className="text-muted">последнего обновления:</span></Grid>
            <Grid item container md={8}>
                {helpers.convertDateFromString(campaignPatterElement.modified, { monthDescription: "long", dayDescription: "numeric" })}
            </Grid>
        </Grid>

        <Grid container direction="row" spacing={3} style={{ marginTop: 4 }}>
            <Grid item container md={4} justifyContent="flex-end"><span className="text-muted">Подробное описание:</span></Grid>
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
            <Grid item container md={12} justifyContent="flex-start">
                <CreateListContextGrouping
                    campaignPatterElement={campaignPatterElement}
                    handlerContext={handlerContext}
                />
            </Grid>
        </Grid>

        {campaignPatterElement.object_refs && (() => {
            return (campaignPatterElement.object_refs.length === 0)? 
                <Typography variant="caption">
                    <span  style={{ color: red[800] }}>
                        * необходимо добавить хотя бы один идентификатор любого STIX объекта, связанного с данным Отчётом
                    </span>
                </Typography>:
                campaignPatterElement.object_refs.map((item, key) => {
                    let type = item.split("--");
                    let objectElem = helpers.getLinkImageSTIXObject(type[0]);
        
                    if(typeof objectElem === "undefined" ){
                        return "";
                    }

                    return (<Grid container direction="row" key={`key_object_ref_${key}`}>
                        <Grid item container md={12} justifyContent="flex-start">
                            <Button onClick={() => {}} disabled>
                                <img 
                                    key={`key_object_ref_type_${key}`} 
                                    src={`/images/stix_object/${objectElem.link}`} 
                                    width="35" 
                                    height="35" />
                                    &nbsp;{item}&nbsp;
                            </Button>
                        </Grid>
                    </Grid>);
                });
        })()}

    </React.Fragment>);
}

CreateGroupingPatternElements.propTypes = {
    campaignPatterElement: PropTypes.object.isRequired,
    handlerContext: PropTypes.func.isRequired,
    handlerDescription: PropTypes.func.isRequired, 
};

/**
 //GroupingDomainObjectsSTIX объект "Grouping", по терминалогии STIX, объединяет различные объекты STIX в рамках какого то общего контекста
// Name - имя используемое для идентификации "Grouping" (ОБЯЗАТЕЛЬНОЕ ЗНАЧЕНИЕ)
// Description - более подробное описание
// Context - краткий дескриптор конкретного контекста, совместно используемого содержимым, на которое ссылается группа. Должно быть одно, из
//  заранее определенных (предложенных) значений (ОБЯЗАТЕЛЬНОЕ ЗНАЧЕНИЕ)
// ObjectRefs - указывает на список объектов STIX, на которые ссылается эта группировка (ОБЯЗАТЕЛЬНОЕ ЗНАЧЕНИЕ)
type GroupingDomainObjectsSTIX struct {
	CommonPropertiesObjectSTIX
	CommonPropertiesDomainObjectSTIX
	Name        string               `json:"name" bson:"name" required:"true"`
	Description string               `json:"description" bson:"description"`
	Context     OpenVocabTypeSTIX    `json:"context" bson:"context" required:"true"`
	ObjectRefs  []IdentifierTypeSTIX `json:"object_refs" bson:"object_refs" required:"true"`
}
 */