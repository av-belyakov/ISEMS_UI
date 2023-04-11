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
import reducerIndicatorSTIXObjects from "../reducer_handlers/reducerIndicatorSTIXObject.js";
import CreateIndicatorPatternElements from "../type_elements_stix/indicatorPatternElements.jsx";
import CreateElementAdditionalTechnicalInformationCO from "../createElementAdditionalTechnicalInformationCO.jsx";

export default function CreateIndicatorPatternNewSTIXObject(props){
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
        buttonChangeClick={buttonChangeClick}
        buttonAddIsDisabled={buttonAddIsDisabled}
        projectPatterElement={projectPatterElement}
        handlerAddSTIXObject={handlerAddSTIXObject}
        handlerChangeButtonAdd={handlerChangeButtonAdd}
        handlerChangeNewSTIXObject={handlerChangeNewSTIXObject}
    />;
}
     
CreateIndicatorPatternNewSTIXObject.propTypes = {
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
        buttonChangeClick,
        buttonAddIsDisabled,
        projectPatterElement,
        handlerAddSTIXObject,
        handlerChangeButtonAdd,
        handlerChangeNewSTIXObject,
    } = props;

    let currentObjectId = React.useMemo(() => {
        return `indicator--${uuidv4()}`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ buttonAddClick ]);

    /*let currentTime = helpers.getToISODatetime();
    const [ state, dispatch ] = useReducer(reducerIdentitySTIXObject, {
        created: currentTime,
        modified: currentTime,
    });*/

    console.log("func 'CreateIdentityPatternNewSTIXObject', state:", state, " --------");

    let currentTime = helpers.getToISODatetime();
    const [ state, dispatch ] = useReducer(reducerIndicatorSTIXObjects, { 
        pattern: "",
        pattern_type: "",
        created: currentTime,
        modified: currentTime,
        valid_from: currentTime, 
    });
    if(state && !state.created){
        dispatch({ type: "updateCreatedTime", data: currentTime });
    }

    if(state && !state.modified){
        dispatch({ type: "updateModifiedTime", data: currentTime });
    }

    useEffect(() => {
        if(projectPatterElement.type === "indicator"){
            dispatch({ type: "newAll", data: projectPatterElement });
        }
    }, [ projectPatterElement ]);
    useEffect(() => {
        if(buttonAddClick){
            let stateTmp = Object.assign(state);
            stateTmp.id = currentObjectId;
            stateTmp.type = "indicator";
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

    const handlerCheckStateButtonIsDisabled = (type, elem) => {
        if(typeof type !== "undefined" && (type === "pattern" || type === "pattern_type")){
            if(typeof elem === "undefined" || elem === ""){
                handlerChangeButtonAdd(true);

                return;
            } else {
                if(type === "pattern" && state.pattern_type !== ""){               
                    handlerChangeButtonAdd(false);
                } else if(type === "pattern_type" && state.pattern !== ""){
                    handlerChangeButtonAdd(false);
                } else {                
                    handlerChangeButtonAdd(true);

                }

                return;
            }
        }

        if(state.pattern !== "" && state.pattern_type !== ""){
            handlerChangeButtonAdd(false);
        
            return;
        }

        handlerChangeButtonAdd(true);
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
                        {`${helpers.getLinkImageSTIXObject("indicator").description}`}
                    </Typography> 
                </Grid>
            </Grid>

            <Grid container direction="row" spacing={3}>
                <Grid item container md={4} justifyContent="flex-end"><span className="text-muted">Уникальный идентификатор (ID):</span></Grid>
                <Grid item container md={8}>{state.id? state.id: currentObjectId}</Grid>
            </Grid>

            <CreateIndicatorPatternElements 
                isDisabled={false}
                campaignPatterElement={state}
                handlerName={(e) => { dispatch({ type: "updateName", data: e.target.value }); handlerCheckStateButtonIsDisabled(); }}
                handlerPattern={(e) => { dispatch({ type: "updatePattern", data: e.target.value }); handlerCheckStateButtonIsDisabled("pattern", e.target.value); }}
                handlerIndicator={(e) => { dispatch({ type: "updateIndicator", data: e.target.value }); handlerCheckStateButtonIsDisabled(); }}
                handlerValidFrom={(e) => { dispatch({ type: "updateValidFrom", data: e }); handlerCheckStateButtonIsDisabled(); }}
                handlerValidUntil={(e) => { dispatch({ type: "updateValidUntil", data: e }); handlerCheckStateButtonIsDisabled(); }}
                handlerDescription={(e) => { dispatch({ type: "updateDescription", data: e.target.value }); handlerCheckStateButtonIsDisabled(); }}
                handlerPatternType={(e) => { dispatch({ type: "updatePatternType", data: e.target.value }); handlerCheckStateButtonIsDisabled("pattern_type", e.target.value); }}
                handlerPatternVersion={(e) => { dispatch({ type: "updatePatternVersion", data: e.target.value }); handlerCheckStateButtonIsDisabled(); }}
                handlerDeleteKillChain={(e) => { dispatch({ type: "deleteKillChainPhases", data: e }); handlerCheckStateButtonIsDisabled(); }}
                handlerAddKillChainPhases={(e) => { dispatch({ type: "updateAddKillChainPhases", data: e }); handlerCheckStateButtonIsDisabled(); }}
            />

            {/*<CreateSoftwarePatternElements 
                isDisabled={false}
                campaignPatterElement={state}
                handlerCPE={(e) => { dispatch({ type: "updateCPE", data: e.target.value }); handlerCheckStateButtonIsDisabled(); }}
                handlerName={(e) => { let name = e.target.value; dispatch({ type: "updateName", data: name }); handlerCheckStateButtonIsDisabled(name); }}
                handlerSWID={(e) => { dispatch({ type: "updateSWID", data: e.target.value }); handlerCheckStateButtonIsDisabled(); }}
                handlerVendor={(e) => { dispatch({ type: "updateVendor", data: e.target.value }); handlerCheckStateButtonIsDisabled(); }}
                handlerVersion={(e) => { dispatch({ type: "updateVersion", data: e.target.value }); handlerCheckStateButtonIsDisabled(); }}
                handlerLanguages={(e) => { dispatch({ type: "updateLanguages", data: e.target.value }); handlerCheckStateButtonIsDisabled(); }}
/>*/}

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
    buttonChangeClick: PropTypes.bool.isRequired,
    buttonAddIsDisabled: PropTypes.bool.isRequired,
    projectPatterElement: PropTypes.object.isRequired,
    handlerAddSTIXObject: PropTypes.func.isRequired,
    handlerChangeButtonAdd: PropTypes.func.isRequired,
    handlerChangeNewSTIXObject: PropTypes.func.isRequired,
};