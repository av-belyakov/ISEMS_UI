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
import reducerDirectoryPatternSTIXObjects from "../reducer_handlers/reducerDirectorySTIXObject.js";
import CreateDirectoryPatternElements from "../type_elements_stix/directoryPatternElements.jsx";
import CreateElementAdditionalTechnicalInformationCO from "../createElementAdditionalTechnicalInformationCO.jsx";

export default function CreateDirectoryPatternNewSTIXObject(props){
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
     
CreateDirectoryPatternNewSTIXObject.propTypes = {
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
        return `directory--${uuidv4()}`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ buttonAddClick ]);

    const [ state, dispatch ] = useReducer(reducerDirectoryPatternSTIXObjects, { mainObj: {}, refObj: {}, refId: "" });
    useEffect(() => {
        if(projectPatterElement.type === "directory"){
            dispatch({ type: "newAll", data: projectPatterElement });
        }
    }, [ projectPatterElement ]);
    useEffect(() => {
        if(buttonAddClick){
            let stateTmp = Object.assign(state.mainObj);
            stateTmp.id = currentObjectId;
            stateTmp.type = "directory";
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

    const handlerCheckStateButtonIsDisabled = (path) => {
        if(typeof path !== "undefined"){
            if(path.length !== 0){
                return handlerChangeButtonAdd(false);
            }
            
            return handlerChangeButtonAdd(true);
        }

        if(state.mainObj && (typeof state.mainObj.path !== "undefined") && (state.mainObj.path !== "")){
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
                        {`${helpers.getLinkImageSTIXObject("directory").description}`}
                    </Typography> 
                </Grid>
            </Grid>

            <Grid container direction="row" spacing={3}>
                <Grid item container md={4} justifyContent="flex-end"><span className="text-muted">Уникальный идентификатор (ID):</span></Grid>
                <Grid item container md={8}>{state.mainObj.id? state.mainObj.id: currentObjectId}</Grid>
            </Grid>

            <CreateDirectoryPatternElements
                isDisabled={false}
                showRefElement={{}}
                campaignPatterElement={state.mainObj}
                handlerPath={(e) => { dispatch({ type: "updatePath", data: e.target.value }); handlerCheckStateButtonIsDisabled(e.target.value); }}
                handlerClick={() => {}}
            />

            <CreateElementAdditionalTechnicalInformationCO 
                objectId={currentObjectId}
                reportInfo={state.mainObj}
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