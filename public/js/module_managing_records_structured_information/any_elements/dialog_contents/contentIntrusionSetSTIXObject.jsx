"use strict";

import React, { useEffect, useReducer } from "react";
import { 
    Button,
    DialogActions,
    DialogContent,
    Grid,
} from "@material-ui/core";
import PropTypes from "prop-types";

import CreateListPreviousStateSTIX from "../createListPreviousStateSTIX.jsx";
import CreateIntrusionSetPatternElements from "./intrusionSetPatternElements.jsx";
import CreateElementAdditionalTechnicalInformationDO from "../createElementAdditionalTechnicalInformationDO.jsx";

const reducer = (state, action) => {
    let lastSeen = "";
    let firstSeen = "";
    let currentTimeZoneOffsetInHours = "";

    switch(action.type){
    case "newAll":

        console.log("func 'reducer' ___________, action.type:", action.type, " action.data:", action.data);

        lastSeen = Date.parse(action.data.last_seen);
        firstSeen = Date.parse(action.data.first_seen);
        currentTimeZoneOffsetInHours = new Date(lastSeen).getTimezoneOffset() / 60;

        if(currentTimeZoneOffsetInHours < 0){
            action.data.last_seen = new Date(lastSeen + ((currentTimeZoneOffsetInHours * -1) * 3600000)).toISOString();
            action.data.first_seen = new Date(firstSeen + ((currentTimeZoneOffsetInHours * -1) * 3600000)).toISOString();
        } else {
            action.data.last_seen = new Date(lastSeen - (currentTimeZoneOffsetInHours * 3600000)).toISOString();
            action.data.first_seen = new Date(firstSeen - (currentTimeZoneOffsetInHours * 3600000)).toISOString();
        }

        return action.data;
    case "cleanAll":
        return {};
    case "updateDescription":
        if(state.description === action.data){
            return {...state};
        }

        return {...state, description: action.data};
    case "updateInfrastructureTypes":
        return {...state, infrastructure_types: action.data};
    case "updateAliasesTokenValuesChange":
        return {...state, aliases: action.data};
    case "updateGoalsTokenValuesChange":
        return {...state, goals: action.data};
    case "updateDateTimeFirstSeen":
        return {...state, first_seen: new Date(action.data).toISOString()};
    case "updateDateTimeLastSeen":
        return {...state, last_seen: new Date(action.data).toISOString()};
    case "updateResourceLevelAttack":
        return {...state, resource_level: action.data};
    case "updatePrimaryMotivation":
        return {...state, primary_motivation: action.data};
    case "updateSecondaryMotivations":
        return {...state, secondary_motivations: action.data};
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

export default function CreateDialogContentIntrusionSetSTIXObject(props){
    let { 
        socketIo,
        isNotDisabled,
        parentIdSTIXObject,
        currentAdditionalIdSTIXObject,
        handlerDialogClose,
    } = props;

    let [ buttonIsDisabled, setButtonIsDisabled ] = React.useState(true);
    let [ buttonSaveChangeTrigger, setButtonSaveChangeTrigger ] = React.useState(false);

    const handlerButtonIsDisabled = () => {
            if(!buttonIsDisabled){
                return;
            }

            setButtonIsDisabled();
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

CreateDialogContentIntrusionSetSTIXObject.propTypes = {
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
            console.log("func 'CreateMajorContent', socketIo.emit for STIX object current ID: ", currentIdSTIXObject);

            socketIo.emit("isems-mrsi ui request: send search request, get STIX object for id", { arguments: { 
                searchObjectId: currentIdSTIXObject,
                parentObjectId: parentIdSTIXObject,
            }});
        }
    }, [ socketIo, currentIdSTIXObject, parentIdSTIXObject ]);
    useEffect(() => {
        if(buttonSaveChangeTrigger){
            let data = state;
            let lastSeen = Date.parse(state.last_seen);
            let firstSeen = Date.parse(state.first_seen);
            let currentTimeZoneOffsetInHours = new Date(lastSeen).getTimezoneOffset() / 60;
    
            if(currentTimeZoneOffsetInHours < 0){
                data.last_seen = new Date(lastSeen - ((currentTimeZoneOffsetInHours * -1) * 3600000)).toISOString();
                data.first_seen = new Date(firstSeen - ((currentTimeZoneOffsetInHours * -1) * 3600000)).toISOString();
            } else {
                data.last_seen = new Date(lastSeen + (currentTimeZoneOffsetInHours * 3600000)).toISOString();
                data.first_seen = new Date(firstSeen + (currentTimeZoneOffsetInHours * 3600000)).toISOString();
            }

            socketIo.emit("isems-mrsi ui request: insert STIX object", { arguments: [ data ] });
            handlerButtonSaveChangeTrigger();
            handlerDialogClose();
        }
    }, [ buttonSaveChangeTrigger, handlerButtonSaveChangeTrigger ]);

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
                handlerButtonIsDisabled();

                break;
            case "hashes_delete":
                console.log("external_references - hashes_delete");
                console.log(obj);

                dispatch({ type: "updateExternalReferencesHashesDelete", data: { hashName: obj.hashName, orderNumber: obj.orderNumber }});
                handlerButtonIsDisabled();

                break;
            default:
                console.log("external_references - default");
                console.log("obj.modalType - ", obj.modalType);

                dispatch({ type: "updateExternalReferences", data: obj.data });
                handlerButtonIsDisabled();
            }
        }
    
        if(obj.modalType === "granular_markings") {
            console.log("updateGranularMarkings......");
            console.log(obj);

            dispatch({ type: "updateGranularMarkings", data: obj.data });
            handlerButtonIsDisabled();
        }
    
        if(obj.modalType === "extensions") {
            console.log("obj.modalType === extensions, obj: ", obj);

            dispatch({ type: "updateExtensions", data: obj.data });
            handlerButtonIsDisabled();
        }
    };
    
    return (<Grid item container md={8}>
        <Grid container direction="row" className="pt-3">
            <CreateIntrusionSetPatternElements 
                campaignPatterElement={state}
                handlerDescription={(e) => { dispatch({ type: "updateDescription", data: e.target.value }); handlerButtonIsDisabled(); }}
                handlerPrimaryMotivation={(e) => { dispatch({ type: "updatePrimaryMotivation", data: e.target.value }); handlerButtonIsDisabled(); }}
                handlerResourceLevelAttack={(e) => { dispatch({ type: "updateResourceLevelAttack", data: e.target.value }); handlerButtonIsDisabled(); }}
                handlerSecondaryMotivations={(e) => { dispatch({ type: "updateSecondaryMotivations", data: e.target.value }); handlerButtonIsDisabled(); }}
                handlerGoalsTokenValuesChange={(e) => { dispatch({ type: "updateGoalsTokenValuesChange", data: e }); handlerButtonIsDisabled(); }}
                handlerChangeDateTimeLastSeen={(e) => { dispatch({ type: "updateDateTimeLastSeen", data: e }); handlerButtonIsDisabled(); }}
                handlerChangeDateTimeFirstSeen={(e) => { dispatch({ type: "updateDateTimeFirstSeen", data: e }); handlerButtonIsDisabled(); }}
                handlerAliasesTokenValuesChange={(e) => { dispatch({ type: "updateAliasesTokenValuesChange", data: e }); handlerButtonIsDisabled(); }}
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
            handlerElementConfidence={(e) => { dispatch({ type: "updateConfidence", data: e }); handlerButtonIsDisabled(); }}
            handlerElementDefanged={(e) => { dispatch({ type: "updateDefanged", data: e }); handlerButtonIsDisabled(); }}
            handlerElementLabels={(e) => { dispatch({ type: "updateLabels", data: e }); handlerButtonIsDisabled(); }}
            handlerElementDelete={(e) => { dispatch({ type: "deleteElementAdditionalTechnicalInformation", data: e }); handlerButtonIsDisabled(); }}
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
