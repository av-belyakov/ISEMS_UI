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
import reducerCampaignSTIXObjects from "../reducer_handlers/reducerCampaignSTIXObject.js";
import CreateCampaingPatternElements from "../type_elements_stix/campaingPatternElements.jsx";
import CreateElementAdditionalTechnicalInformationDO from "../createElementAdditionalTechnicalInformationDO.jsx";

export default function CreateCampaignPatternNewSTIXObject(props){
    let { 
        isNotDisabled,
        parentIdSTIXObject,
        projectPatterElement,
        handlerAddSTIXObject,
    } = props;
    
    return <CreateMajorElements
        isNotDisabled={isNotDisabled}
        currentObjectId={`campaign--${uuidv4()}`}
        parentIdSTIXObject={parentIdSTIXObject}
        projectPatterElement={projectPatterElement}
        handlerAddSTIXObject={handlerAddSTIXObject}
    />;
}
    
CreateCampaignPatternNewSTIXObject.propTypes = {
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

    const [ state, dispatch ] = useReducer(reducerCampaignSTIXObjects, projectPatterElement);
    const [ buttonIsDisabled, setButtonIsDisabled ] = useState(true);

    console.log("func CreateCourseOfActionPatternNewSTIXObject projectPatterElement: ", projectPatterElement);
     
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
                setButtonIsDisabled(true);

                return;
            }
        
            if(!buttonIsDisabled){
                return;
            }

            setButtonIsDisabled(false);
        },
        handlerButtonSaveChangeTrigger = () => {
            //        setButtonSaveChangeTrigger((prevState) => !prevState);
        };

    return (<Paper elevation={3} style={{ width: "100%" }}>
        <Box m={2} pb={2}>
            <Grid container direction="row">
                <Grid item container md={8} justifyContent="flex-start">
                    <Typography variant="overline" display="block" gutterBottom>
                        {`${helpers.getLinkImageSTIXObject("campaign").description}`}
                    </Typography> 
                </Grid>
                <Grid item container md={4} justifyContent="flex-end">
                    <Button 
                        onClick={() => {
                            let stateTmp = Object.assign(state);
                            stateTmp.id = currentObjectId;
                            stateTmp.type = "campaign";
                            stateTmp.spec_version = "2.1";
                            stateTmp.lang = "RU";

                            setButtonIsDisabled(true);
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
            <CreateCampaingPatternElements 
                isDisabled={false}
                campaignPatterElement={state}
                handlerName={(e) => { dispatch({ type: "updateName", data: e.target.value }); handlerButtonIsDisabled(e.target.value); }}
                handlerObjective={(e) => { dispatch({ type: "updateObjective", data: e.target.value }); handlerButtonIsDisabled(); }}
                handlerDescription={(e) => { dispatch({ type: "updateDescription", data: e.target.value }); handlerButtonIsDisabled(); }}
                handlerTokenValuesChange={(e) => { dispatch({ type: "updateTokenValuesChange", data: e }); handlerButtonIsDisabled(); }}
                handlerChangeDateTimeFirstSeen={(e) => { dispatch({ type: "updateDateTimeFirstSeen", data: e }); handlerButtonIsDisabled(); }}
                handlerChangeDateTimeLastSeen={(e) => { dispatch({ type: "updateDateTimeLastSeen", data: e }); handlerButtonIsDisabled(); }}
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
     
