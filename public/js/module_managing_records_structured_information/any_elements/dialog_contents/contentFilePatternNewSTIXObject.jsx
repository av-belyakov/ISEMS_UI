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

import reducerFilePatternSTIXObjects from "../reducer_handlers/reducerFileSTIXObject.js";
import CreateFilePatternElements from "../type_elements_stix/filePatternElements.jsx";
import CreateElementAdditionalTechnicalInformationCO from "../createElementAdditionalTechnicalInformationCO.jsx";

let currentTime = helpers.getToISODatetime();

export default function CreateFilePatternNewSTIXObject(props){
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
     
CreateFilePatternNewSTIXObject.propTypes = {
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
        return `file--${uuidv4()}`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ buttonAddClick ]);

    const [ state, dispatch ] = useReducer(reducerFilePatternSTIXObjects, {});
    if(!state.ctime){
        dispatch({ type: "updateCTime", data: currentTime });
    }

    useEffect(() => {
        if(projectPatterElement.type === "file"){
            dispatch({ type: "newAll", data: projectPatterElement });
        }
    }, [ projectPatterElement ]);
    useEffect(() => {
        if(buttonAddClick){
            let stateTmp = Object.assign(state);
            stateTmp.id = currentObjectId;
            stateTmp.type = "file";
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
        if(obj.modalType === "granular_markings") {
            dispatch({ type: "updateGranularMarkings", data: obj.data });
            handlerCheckStateButtonIsDisabled();
        }
    
        if(obj.modalType === "extensions") {
            dispatch({ type: "updateExtensions", data: obj.data });
            handlerCheckStateButtonIsDisabled();
        }
    };

    const handlerCheckStateButtonIsDisabled = (elem, type) => {
        if(typeof state === "undefined"){
            return;
        }

        let isNameExist = (typeof state.name === "undefined");
        let isSizeExist = (typeof state.size === "undefined");

        switch(type){
        case "name":
            if((elem.length !== 0) && !isSizeExist && helpers.checkInputValidation({
                "name": "integer", 
                "value": state.size, 
            })){           
                handlerChangeButtonAdd(false);
            } else {
                handlerChangeButtonAdd(true);
            }

            break;
        case "size":
            if((helpers.checkInputValidation({
                "name": "integer", 
                "value": elem, 
            }) && elem[0] !== "0") && !isNameExist && (state.name.length !== 0)){           
                handlerChangeButtonAdd(false);
            } else {
                handlerChangeButtonAdd(true);
            }

            break;
        default:
            if(!isSizeExist && ((helpers.checkInputValidation({
                "name": "integer", 
                "value": state.size, 
            }) && state.size[0] !== "0") && !isNameExist && (state.name.length !== 0))){           
                handlerChangeButtonAdd(false);
            } else {
                handlerChangeButtonAdd(true);
            }
        }
    };

    return (<Paper elevation={3} style={{ width: "100%" }}>
        <Box m={2} pb={2}>
            <Grid container direction="row">
                <Grid item container md={8} justifyContent="flex-start">
                    <Typography variant="overline" display="block" gutterBottom>
                        {`${helpers.getLinkImageSTIXObject("email-message").description}`}
                    </Typography> 
                </Grid>
            </Grid>

            <Grid container direction="row" spacing={3}>
                <Grid item container md={4} justifyContent="flex-end"><span className="text-muted">Уникальный идентификатор (ID):</span></Grid>
                <Grid item container md={8}>{state.id? state.id: currentObjectId}</Grid>
            </Grid>

            <CreateFilePatternElements 
                isDisabled={false}
                showRefElement={{}}
                campaignPatterElement={state}
                handlerName={(name) => { dispatch({ type: "updateName", data: name }); handlerCheckStateButtonIsDisabled(name, "name"); }}
                handlerSize={(size) => { dispatch({ type: "updateSize", data: size }); handlerCheckStateButtonIsDisabled(size, "size"); }}
                handlerClick={() => {}}
                handlerNameEnc={(e) => { dispatch({ type: "updateNameEnc", data: e.target.value }); handlerCheckStateButtonIsDisabled(); }}
                handlerMimeType={(e) => { dispatch({ type: "updateMineType", data: e.target.value }); handlerCheckStateButtonIsDisabled(); }}
                handlerAddHashes={(hashObj) => {
                    dispatch({ type: "updateAddHashes", data: hashObj }); handlerCheckStateButtonIsDisabled();
                }}
                handlerDelHashes={(elem) => {
                    dispatch({ type: "handlerDelHashes", data: elem }); handlerCheckStateButtonIsDisabled();
                }}
                handlerButtonShowLink={() => {}}
                handlerMagicNumberHex={(e) => { dispatch({ type: "updateMagicNumberHex", data: e.target.value }); handlerCheckStateButtonIsDisabled(); }}
                handlerChangeDateTimeMtime={(e) => { dispatch({ type: "updateDateTimeMtime", data: e }); handlerCheckStateButtonIsDisabled(); }}
                handlerChangeDateTimeAtime={(e) => { dispatch({ type: "updateDateTimeAtime", data: e }); handlerCheckStateButtonIsDisabled(); }}
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
    buttonChangeClick: PropTypes.bool.isRequired,
    buttonAddIsDisabled: PropTypes.bool.isRequired,
    projectPatterElement: PropTypes.object.isRequired,
    handlerAddSTIXObject: PropTypes.func.isRequired,
    handlerChangeButtonAdd: PropTypes.func.isRequired,
    handlerChangeNewSTIXObject: PropTypes.func.isRequired,
};