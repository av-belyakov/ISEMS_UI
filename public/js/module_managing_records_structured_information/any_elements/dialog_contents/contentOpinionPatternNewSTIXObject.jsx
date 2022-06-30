import React, { useState, useReducer } from "react";
import {
    Box, 
    Button,
    Paper,
    Grid,
    Typography, 
} from "@material-ui/core";
import { v4 as uuidv4 } from "uuid";
import PropTypes from "prop-types";

import { helpers } from "../../../common_helpers/helpers.js";
import reducerOpinionSTIXObjects from "../reducer_handlers/reducerOpinionSTIXObject.js";
import CreateOpinionPatternElements from "../type_elements_stix/opinionPatternElements.jsx";
import CreateElementAdditionalTechnicalInformationDO from "../createElementAdditionalTechnicalInformationDO.jsx";

export default function CreateOpinionPatternNewSTIXObject(props){
    let { 
        isNotDisabled,
        parentIdSTIXObject,
        projectPatterElement,
        handlerAddSTIXObject,
    } = props;

    return <CreateMajorElements
        isNotDisabled={isNotDisabled}
        currentObjectId={`opinion--${uuidv4()}`}
        parentIdSTIXObject={parentIdSTIXObject}
        projectPatterElement={projectPatterElement}
        handlerAddSTIXObject={handlerAddSTIXObject}
    />;
}
     
CreateOpinionPatternNewSTIXObject.propTypes = {
    isNotDisabled: PropTypes.bool.isRequired,
    parentIdSTIXObject: PropTypes.string.isRequired,
    projectPatterElement: PropTypes.object.isRequired,
    handlerAddSTIXObject: PropTypes.func.isRequired,
};

function CreateMajorElements(props){
    let { 
        isNotDisabled,
        currentObjectId,
        parentIdSTIXObject,
        projectPatterElement,
        handlerAddSTIXObject,
    } = props;

    const [ state, dispatch ] = useReducer(reducerOpinionSTIXObjects, projectPatterElement);
    const [ buttonIsDisabled, setButtonIsDisabled ] = useState(true);
    
    const handlerButtonIsDisabled = (opinion) => {
        if(opinion === "" || (!state.opinion || state.opinion === "")){
            setButtonIsDisabled(true);

            return;
        }
    
        if(!buttonIsDisabled){
            return;
        }

        setButtonIsDisabled(false);
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
            handlerButtonIsDisabled();
        }
        
        if(obj.modalType === "extensions") {
            dispatch({ type: "updateExtensions", data: obj.data });
            handlerButtonIsDisabled();
        }
    };

    return (<Paper elevation={3} style={{ width: "100%" }}>
        <Box m={2} pb={2}>
            <Grid container direction="row">
                <Grid item container md={8} justifyContent="flex-start">
                    <Typography variant="overline" display="block" gutterBottom>
                        {`${helpers.getLinkImageSTIXObject("opinion").description}`}
                    </Typography> 
                </Grid>
                <Grid item container md={4} justifyContent="flex-end">
                    <Button 
                        onClick={() => {
                            let stateTmp = Object.assign(state);
                            stateTmp.id = currentObjectId;
                            stateTmp.type = "opinion";
                            stateTmp.spec_version = "2.1";
                            stateTmp.lang = "RU";

                            dispatch({ type: "cleanAll", data: {} });

                            handlerAddSTIXObject(stateTmp);
                        }}
                        disabled={buttonIsDisabled} 
                        color="primary">
                            добавить
                    </Button>
                </Grid>
            </Grid>
            <Grid container direction="row" spacing={3}>
                <Grid item container md={4} justifyContent="flex-end"><span className="text-muted">Уникальный идентификатор (ID):</span></Grid>
                <Grid item container md={8}>{currentObjectId}</Grid>
            </Grid>
            <CreateOpinionPatternElements 
                isDisabled={false}
                campaignPatterElement={state}
                handlerAuthors={(value) => { 
                    dispatch({ type: "updateAuthors", data: value }); 
                    handlerButtonIsDisabled();
                }}
                handlerOpinion={(e) => { 
                    dispatch({ type: "updateOpinion", data: e.target.value }); 
                    handlerButtonIsDisabled(e.target.value);
                }}
                handlerExplanation={(e) => { 
                    dispatch({ type: "updateExplanation", data: e.target.value }); 
                    handlerButtonIsDisabled();
                }}
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
    currentObjectId: PropTypes.string.isRequired,
    parentIdSTIXObject: PropTypes.string.isRequired,
    projectPatterElement: PropTypes.object.isRequired,
    handlerAddSTIXObject: PropTypes.func.isRequired,
};