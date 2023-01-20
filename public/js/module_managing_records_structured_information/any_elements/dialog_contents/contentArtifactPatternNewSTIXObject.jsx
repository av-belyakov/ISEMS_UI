import React, { useEffect, useReducer } from "react";
import { 
    Box,
    Grid,
    Paper,
    Typography,
} from "@material-ui/core";
import { v4 as uuidv4 } from "uuid";
import PropTypes from "prop-types";
import validatorjs from "validatorjs";

import { helpers } from "../../../common_helpers/helpers.js";
import reducerArtifactPatternSTIXObjects from "../reducer_handlers/reducerArtifactSTIXObject.js";
import CreateArtifactPatternElements from "../type_elements_stix/artifactPatternElements.jsx";
import CreateElementAdditionalTechnicalInformationCO from "../createElementAdditionalTechnicalInformationCO.jsx";

export default function CreateDialogContentArtifactPatternNewSTIXObject(props){
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
        currentObjectId={`artifact--${uuidv4()}`}
        buttonChangeClick={buttonChangeClick}
        buttonAddIsDisabled={buttonAddIsDisabled}
        projectPatterElement={projectPatterElement}
        handlerAddSTIXObject={handlerAddSTIXObject}
        handlerChangeButtonAdd={handlerChangeButtonAdd}
        handlerChangeNewSTIXObject={handlerChangeNewSTIXObject}
    />;
}
     
CreateDialogContentArtifactPatternNewSTIXObject.propTypes = {
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

    const [ state, dispatch ] = useReducer(reducerArtifactPatternSTIXObjects, {});
    useEffect(() => {
        if(projectPatterElement.type === "artifact"){
            dispatch({ type: "newAll", data: projectPatterElement });
        }
    }, [ projectPatterElement ]);
    useEffect(() => {
        if(buttonAddClick){
            let stateTmp = Object.assign(state);
            stateTmp.id = currentObjectId;
            stateTmp.type = "artifact";
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
                handlerCheckStateButtonIsDisabled();
    
                break;
            case "hashes_delete":
                dispatch({ type: "updateExternalReferencesHashesDelete", data: { hashName: obj.hashName, orderNumber: obj.orderNumber }});
                handlerCheckStateButtonIsDisabled();
    
                break;
            default:
                dispatch({ type: "updateExternalReferences", data: obj.data });
                handlerCheckStateButtonIsDisabled();
            }
        }
        
        if(obj.modalType === "granular_markings") {
            dispatch({ type: "updateGranularMarkings", data: obj.data });
            handlerCheckStateButtonIsDisabled();
        }
        
        if(obj.modalType === "extensions") {
            dispatch({ type: "updateExtensions", data: obj.data });
            handlerCheckStateButtonIsDisabled();
        }
    };

    const handlerCheckStateButtonIsDisabled = (typeElem, value) => {
        if(typeElem === "url"){
            console.log("func handlerCheckStateButtonIsDisabled validatorjs.isURL(value):", validatorjs.isURL(value));

            if(validatorjs.isURL(value)){
                return handlerChangeButtonAdd(false);
            }

            return handlerChangeButtonAdd(true);
        } else if(typeElem === "payload_bin"){
            console.log("func handlerCheckStateButtonIsDisabled validatorjs.isBase64(value):", validatorjs.isBase64(value));

            if(validatorjs.isBase64(value)){
                return handlerChangeButtonAdd(false);  
            }

            return handlerChangeButtonAdd(true);
        } else {
            //console.log("func handlerCheckStateButtonIsDisabled validatorjs.isBase64(value):", validatorjs.isBase64(state.payload_bin), " validatorjs.isURL(state.url):", validatorjs.isURL(state.url));

            if((state.url && state.url !== "" && !validatorjs.isURL(state.url)) || (state.payload_bin && state.payload_bin !== "" && !validatorjs.isBase64(state.payload_bin))){
                console.log("func handlerCheckStateButtonIsDisabled ||||||||||||");               
                
                return handlerChangeButtonAdd(true);  
            }

            handlerChangeButtonAdd(false);
        }
    };

    return (<Paper elevation={3} style={{ width: "100%" }}>
        <Box m={2} pb={2}>
            <Grid container direction="row">
                <Grid item container md={8} justifyContent="flex-start">
                    <Typography variant="overline" display="block" gutterBottom>
                        {`${helpers.getLinkImageSTIXObject("artifact").description}`}
                    </Typography> 
                </Grid>
            </Grid>

            <Grid container direction="row" spacing={3}>
                <Grid item container md={4} justifyContent="flex-end"><span className="text-muted">Уникальный идентификатор (ID):</span></Grid>
                <Grid item container md={8}>{state.id? state.id: currentObjectId}</Grid>
            </Grid>

            <CreateArtifactPatternElements 
                isDisabled={false}
                campaignPatterElement={state}
                handlerURL={(e) => { dispatch({ type: "updateURL", data: e.target.value }); handlerCheckStateButtonIsDisabled("url", e.target.value); }}
                handlerMimeType={(e) => { dispatch({ type: "updateMimeType", data: e.target.value }); handlerCheckStateButtonIsDisabled(); }}
                handlerAddHashes={(e) => { dispatch({ type: "updateAddHashes", data: e }); handlerCheckStateButtonIsDisabled(); }}
                handlerPayloadBin={(e) => { dispatch({ type: "updatePayloadBin", data: e.target.value }); handlerCheckStateButtonIsDisabled("payload_bin", e.target.value); }}
                handlerDeleteHashe={(e) => { dispatch({ type: "updateDeleteHashes", data: e }); handlerCheckStateButtonIsDisabled(); }}
                handlerDecryptionKey={(e) => { dispatch({ type: "updateDecryptionKey", data: e.target.value }); handlerCheckStateButtonIsDisabled(); }}
                handlerEncryptionAlgorithm={(e) => { dispatch({ type: "updateEncryptionAlgorithm", data: e.target.value }); handlerCheckStateButtonIsDisabled(); }}
            />

            <CreateElementAdditionalTechnicalInformationCO 
                objectId={currentObjectId}
                reportInfo={state}
                isNotDisabled={isNotDisabled}
                handlerElementDefanged={(e) => { dispatch({ type: "updateDefanged", data: e }); handlerCheckStateButtonIsDisabled(); }}
                handlerElementDelete={(e) => { dispatch({ type: "deleteElementAdditionalTechnicalInformation", data: e }); handlerCheckStateButtonIsDisabled(); }}
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