import React, { useEffect, useReducer } from "react";
import {
    Box, 
    Paper,
    Grid,
    Typography, 
} from "@material-ui/core";
import { v4 as uuidv4 } from "uuid";
import PropTypes from "prop-types";

import { helpers } from "../../../common_helpers/helpers.js";
import reducerInfrastructureSTIXObject from "../reducer_handlers/reducerInfrastructureSTIXObject.js";
import CreateInfrastructurePatternElements from "../type_elements_stix/infrastructurePatternElements.jsx";
import CreateElementAdditionalTechnicalInformationDO from "../createElementAdditionalTechnicalInformationDO.jsx";

let currentTime = helpers.getToISODatetime();

export default function CreateInfrastructurePatternNewSTIXObject(props){
    let { 
        isNotDisabled,
        buttonAddClick,
        buttonChangeClick,
        buttonAddIsDisabled,
        projectPatterElement,
        handlerAddSTIXObject,
        handlerChangeButtonAdd,
        handlerChangeNewSTIXObject,
    } = props;

    return <CreateMajorElements
        isNotDisabled={isNotDisabled}
        buttonAddClick={buttonAddClick}
        currentObjectId={`infrastructure--${uuidv4()}`}
        buttonChangeClick={buttonChangeClick}
        buttonAddIsDisabled={buttonAddIsDisabled}
        projectPatterElement={projectPatterElement}
        handlerAddSTIXObject={handlerAddSTIXObject}
        handlerChangeButtonAdd={handlerChangeButtonAdd}
        handlerChangeNewSTIXObject={handlerChangeNewSTIXObject}
    />;
}
     
CreateInfrastructurePatternNewSTIXObject.propTypes = {
    isNotDisabled: PropTypes.bool.isRequired,
    buttonAddClick: PropTypes.bool.isRequired,
    buttonChangeClick: PropTypes.bool.isRequired,
    buttonAddIsDisabled: PropTypes.bool.isRequired,
    projectPatterElement: PropTypes.object.isRequired,
    handlerAddSTIXObject: PropTypes.func.isRequired,
    handlerChangeButtonAdd: PropTypes.func.isRequired,
    handlerChangeNewSTIXObject: PropTypes.func.isRequired,
};

function CreateMajorElements(props){
    let { 
        isNotDisabled,
        buttonAddClick,
        currentObjectId,
        buttonChangeClick,
        buttonAddIsDisabled,
        projectPatterElement,
        handlerAddSTIXObject,
        handlerChangeButtonAdd,
        handlerChangeNewSTIXObject,
    } = props;

    const [ state, dispatch ] = useReducer(reducerInfrastructureSTIXObject, {});//projectPatterElement);
    if(state && !state.created){
        dispatch({ type: "updateCreatedTime", data: currentTime });
    }

    if(state && !state.modified){
        dispatch({ type: "updateModifiedTime", data: currentTime });
    }

    if(state && !state.first_seen){
        dispatch({ type: "updateFirstSeenTime", data: currentTime });
    }

    if(state && !state.last_seen){
        dispatch({ type: "updateLastSeenTime", data: currentTime });
    }

    useEffect(() => {
        if(projectPatterElement.type === "infrastructure"){
            dispatch({ type: "newAll", data: projectPatterElement });
        }
    }, [ projectPatterElement ]);

    useEffect(() => {
        if(buttonAddClick){
            let stateTmp = Object.assign(state);
            stateTmp.id = currentObjectId;
            stateTmp.type = "infrastructure";
            stateTmp.spec_version = "2.1";
            stateTmp.lang = "RU";

            dispatch({ type: "cleanAll", data: {} });

            handlerAddSTIXObject(stateTmp);
        }
    }, [ buttonAddClick, state, currentObjectId, handlerAddSTIXObject ]);
     
    useEffect(() => {
        if(buttonChangeClick){
            handlerChangeNewSTIXObject(state);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ buttonChangeClick ]);

    const handlerDialogElementAdditionalThechnicalInfo = (obj) => {
        if(obj.modalType === "external_references"){
            switch(obj.actionType){
            case "hashes_update":
                dispatch({ type: "updateExternalReferencesHashesUpdate", data: { newHash: obj.data, orderNumber: obj.orderNumber }});
                handlerButtonIsDisabled();
    
                break;
            case "hashes_delete":
                dispatch({ type: "updateExternalReferencesHashesDelete", data: { hashName: obj.hashName, orderNumber: obj.orderNumber }});
                handlerButtonIsDisabled();
    
                break;
            default:
                dispatch({ type: "updateExternalReferences", data: obj.data });
                handlerButtonIsDisabled();
            }
        }
        
        if(obj.modalType === "granular_markings") {
            dispatch({ type: "updateGranularMarkings", data: obj.data });
            handlerButtonIsDisabled();
        }
        
        if(obj.modalType === "extensions") {
            dispatch({ type: "updateExtensions", data: obj.data });
            handlerButtonIsDisabled();
        }
    };

    const handlerButtonIsDisabled = (name) => {
        if(name === "" || (!state.name || state.name === "")){
            handlerChangeButtonAdd(true);
            return;
        }
            
        if(!buttonAddIsDisabled){
            return;
        }
    
        handlerChangeButtonAdd(false);
    };

    return (<Paper elevation={3} style={{ width: "100%" }}>
        <Box m={2} pb={2}>
            <Grid container direction="row">
                <Grid item container md={8} justifyContent="flex-start">
                    <Typography variant="overline" display="block" gutterBottom>
                        {`${helpers.getLinkImageSTIXObject("infrastructure").description}`}
                    </Typography> 
                </Grid>
            </Grid>
            <Grid container direction="row" spacing={3}>
                <Grid item container md={4} justifyContent="flex-end"><span className="text-muted">Уникальный идентификатор (ID):</span></Grid>
                <Grid item container md={8}>{state.id? state.id: currentObjectId}</Grid>
            </Grid>
            <CreateInfrastructurePatternElements 
                isDisabled={false}
                campaignPatterElement={state}
                handlerName={(e) => { dispatch({ type: "updateName", data: e.target.value }); handlerButtonIsDisabled(e.target.value); }}
                handlerDescription={(e) => { dispatch({ type: "updateDescription", data: e.target.value }); handlerButtonIsDisabled(); }}
                handlerDeleteKillChain={(e) => { dispatch({ type: "deleteKillChain", data: e }); handlerButtonIsDisabled(); }}
                handlerTokenValuesChange={(e) => { dispatch({ type: "updateTokenValuesChange", data: e }); handlerButtonIsDisabled(); }}
                handlerAddKillChainPhases={(e) => { dispatch({ type: "updateKillChainPhases", data: e }); handlerButtonIsDisabled(); }}
                handlerInfrastructureTypes={(e) => { dispatch({ type: "updateInfrastructureTypes", data: e.target.value }); handlerButtonIsDisabled(); }}
                handlerChangeDateTimeLastSeen={(e) => { dispatch({ type: "updateDateTimeLastSeen", data: e }); handlerButtonIsDisabled(); }}
                handlerChangeDateTimeFirstSeen={(e) => { dispatch({ type: "updateDateTimeFirstSeen", data: e }); handlerButtonIsDisabled(); }}
            />
            <CreateElementAdditionalTechnicalInformationDO
                objectId={currentObjectId}
                reportInfo={state}
                isNotDisabled={isNotDisabled}
                handlerElementConfidence={(e) => { dispatch({ type: "updateConfidence", data: e }); handlerButtonIsDisabled(); }}
                handlerElementDefanged={(e) => { dispatch({ type: "updateDefanged", data: e }); handlerButtonIsDisabled(); }}
                handlerElementLabels={(e) => { dispatch({ type: "updateLabels", data: e }); handlerButtonIsDisabled(); }}
                handlerElementDelete={(e) => { dispatch({ type: "deleteElementAdditionalTechnicalInformation", data: e }); handlerButtonIsDisabled(); }}
                handlerDialogElementAdditionalThechnicalInfo={handlerDialogElementAdditionalThechnicalInfo} 
            />
        </Box>
    </Paper>);
}

CreateMajorElements.propTypes = {
    isNotDisabled: PropTypes.bool.isRequired,
    buttonAddClick: PropTypes.bool.isRequired,
    currentObjectId: PropTypes.string.isRequired,
    buttonChangeClick: PropTypes.bool.isRequired,
    buttonAddIsDisabled: PropTypes.bool.isRequired,
    projectPatterElement: PropTypes.object.isRequired,
    handlerAddSTIXObject: PropTypes.func.isRequired,
    handlerChangeButtonAdd: PropTypes.func.isRequired,
    handlerChangeNewSTIXObject: PropTypes.func.isRequired,
};