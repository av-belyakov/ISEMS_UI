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
import reducerDomainNamePatternSTIXObjects from "../reducer_handlers/reducerDomainNameSTIXObject.js";
import CreateDomainNamePatternElements from "../type_elements_stix/domainNamePatternElements.jsx";
import CreateElementAdditionalTechnicalInformationCO from "../createElementAdditionalTechnicalInformationCO.jsx";

export default function CreateDomainNamePatternNewSTIXObject(props){
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
        currentObjectId={`domain-name--${uuidv4()}`}
        buttonChangeClick={buttonChangeClick}
        buttonAddIsDisabled={buttonAddIsDisabled}
        projectPatterElement={projectPatterElement}
        handlerAddSTIXObject={handlerAddSTIXObject}
        handlerChangeButtonAdd={handlerChangeButtonAdd}
        handlerChangeNewSTIXObject={handlerChangeNewSTIXObject}
    />;
}
     
CreateDomainNamePatternNewSTIXObject.propTypes = {
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

    const [ state, dispatch ] = useReducer(reducerDomainNamePatternSTIXObjects, {});
    useEffect(() => {
        if(projectPatterElement.type === "domain-name"){
            dispatch({ type: "newAll", data: projectPatterElement });
        }
    }, [ projectPatterElement ]);
    useEffect(() => {
        if(buttonAddClick){
            let stateTmp = Object.assign(state);
            stateTmp.id = currentObjectId;
            stateTmp.type = "domain-name";
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
    }, [ buttonChangeClick ]);

    const handlerCheckStateButtonIsDisabled = (value) => {
        if(typeof value !== "undefined"){
            if(helpers.checkInputValidation({ name: "domanName", value: value })){
                return handlerChangeButtonAdd(false);
            }
            
            return handlerChangeButtonAdd(true);
        }

        if(state && (typeof state.value !== "undefined") && helpers.checkInputValidation({ name: "domanName", value: state.value })){
            handlerChangeButtonAdd(false);
        } else {
            handlerChangeButtonAdd(true);
        }
    };

    const handlerDialogElementAdditionalThechnicalInfo = (obj) => {    
        if(obj.modalType === "granular_markings") {
            dispatch({ type: "updateGranularMarkings", data: obj.data });
            handlerCheckStateButtonIsDisabled();
        }
    
        if(obj.modalType === "extensions") {
            dispatch({ type: "updateExtensions", data: obj.data });
            handlerCheckStateButtonIsDisabled();
        }
    };

    return (<Paper elevation={3} style={{ width: "100%" }}>
        <Box m={2} pb={2}>
            <Grid container direction="row">
                <Grid item container md={8} justifyContent="flex-start">
                    <Typography variant="overline" display="block" gutterBottom>
                        {`${helpers.getLinkImageSTIXObject("domain-name").description}`}
                    </Typography> 
                </Grid>
            </Grid>

            <Grid container direction="row" spacing={3}>
                <Grid item container md={4} justifyContent="flex-end"><span className="text-muted">Уникальный идентификатор (ID):</span></Grid>
                <Grid item container md={8}>{state.id? state.id: currentObjectId}</Grid>
            </Grid>

            <CreateDomainNamePatternElements
                isDisabled={false}
                campaignPatterElement={state}
                handlerValue={(e) => { dispatch({ type: "updateValue", data: e.target.value }); handlerCheckStateButtonIsDisabled(e.target.value); }}
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