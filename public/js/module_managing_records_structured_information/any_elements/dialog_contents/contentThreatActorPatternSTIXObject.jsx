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
import reducerThreatActorsSTIXObject from "../reducer_handlers/reducerThreatActorsSTIXObject.js";
import CreateThreatActorsPatternElements from "../type_elements_stix/threatActorPatternElements.jsx";
import CreateElementAdditionalTechnicalInformationDO from "../createElementAdditionalTechnicalInformationDO.jsx";

export default function CreateToolPatternNewSTIXObject(props){
    let { 
        isNotDisabled,
        buttonAddClick,
        parentIdSTIXObject,
        buttonAddIsDisabled,
        projectPatterElement,
        handlerAddSTIXObject,
        handlerChangeButtonAdd,
    } = props;

    return <CreateMajorElements
        isNotDisabled={isNotDisabled}
        buttonAddClick={buttonAddClick}
        currentObjectId={`threat-actor--${uuidv4()}`}
        parentIdSTIXObject={parentIdSTIXObject}
        buttonAddIsDisabled={buttonAddIsDisabled}
        projectPatterElement={projectPatterElement}
        handlerAddSTIXObject={handlerAddSTIXObject}
        handlerChangeButtonAdd={handlerChangeButtonAdd}
    />;
}
     
CreateToolPatternNewSTIXObject.propTypes = {
    isNotDisabled: PropTypes.bool.isRequired,
    buttonAddClick: PropTypes.bool.isRequired,
    parentIdSTIXObject: PropTypes.string.isRequired,
    buttonAddIsDisabled: PropTypes.bool.isRequired,
    projectPatterElement: PropTypes.object.isRequired,
    handlerAddSTIXObject: PropTypes.func.isRequired,
    handlerChangeButtonAdd: PropTypes.func.isRequired,
};

function CreateMajorElements(props){
    let { 
        isNotDisabled,
        buttonAddClick,
        currentObjectId,
        parentIdSTIXObject,
        buttonAddIsDisabled,
        projectPatterElement,
        handlerAddSTIXObject,
        handlerChangeButtonAdd,
    } = props;

    const [ state, dispatch ] = useReducer(reducerThreatActorsSTIXObject, projectPatterElement);

    useEffect(() => {
        if(buttonAddClick){
            let stateTmp = Object.assign(state);
            stateTmp.id = currentObjectId;
            stateTmp.type = "threat-actor";
            stateTmp.spec_version = "2.1";
            stateTmp.lang = "RU";

            dispatch({ type: "cleanAll", data: {} });

            handlerAddSTIXObject(stateTmp);
        }
    }, [ buttonAddClick, state, currentObjectId, handlerAddSTIXObject ]);
    
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
        }
        
        if(obj.modalType === "extensions") {
            dispatch({ type: "updateExtensions", data: obj.data });
        }
    };

    return (<Paper elevation={3} style={{ width: "100%" }}>
        <Box m={2} pb={2}>
            <Grid container direction="row">
                <Grid item container md={8} justifyContent="flex-start">
                    <Typography variant="overline" display="block" gutterBottom>
                        {`${helpers.getLinkImageSTIXObject("note").description}`}
                    </Typography> 
                </Grid>
            </Grid>
            <Grid container direction="row" spacing={3}>
                <Grid item container md={4} justifyContent="flex-end"><span className="text-muted">Уникальный идентификатор (ID):</span></Grid>
                <Grid item container md={8}>{currentObjectId}</Grid>
            </Grid>
            <CreateThreatActorsPatternElements 
                isDisabled={false}
                campaignPatterElement={state}
                handlerName={(e) => { dispatch({ type: "updateName", data: e.target.value }); handlerButtonIsDisabled(e.target.value); }}
                //handlerToolTypes={(e) => { dispatch({ type: "updateToolTypes", data: e.target.value }); handlerButtonIsDisabled(); }}
                //handlerDescription={(e) => { dispatch({ type: "updateDescription", data: e.target.value }); handlerButtonIsDisabled(); }}
                //handlerToolVersion={(e) => { dispatch({ type: "updateToolVersion", data: e.target.value }); handlerButtonIsDisabled(); }}
                //handlerDeleteKillChain={(e) => { dispatch({ type: "deleteKillChain", data: e }); handlerButtonIsDisabled(); }}
                //handlerTokenValuesChange={(e) => { dispatch({ type: "updateAliasesTokenValuesChange", data: e }); handlerButtonIsDisabled(); }}
                //handlerAddKillChainPhases={(e) => { dispatch({ type: "updateKillChainPhases", data: e }); handlerButtonIsDisabled(); }}
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
    parentIdSTIXObject: PropTypes.string.isRequired,
    buttonAddIsDisabled: PropTypes.bool.isRequired,
    projectPatterElement: PropTypes.object.isRequired,
    handlerAddSTIXObject: PropTypes.func.isRequired,
    handlerChangeButtonAdd: PropTypes.func.isRequired,
};