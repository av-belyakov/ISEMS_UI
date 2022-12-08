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
        currentObjectId={`file--${uuidv4()}`}
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
        currentObjectId,
        buttonChangeClick,
        buttonAddIsDisabled,
        projectPatterElement,
        handlerAddSTIXObject,
        handlerChangeButtonAdd,
        handlerChangeNewSTIXObject,
    } = props;

    const [ state, dispatch ] = useReducer(reducerFilePatternSTIXObjects, {});
    if(!state.date){
        dispatch({ type: "updateDate", data: currentTime });
    }

    useEffect(() => {
        if(projectPatterElement.type === "email-message"){
            dispatch({ type: "newAll", data: projectPatterElement });
        }
    }, [ projectPatterElement ]);
    useEffect(() => {
        if(buttonAddClick){
            let stateTmp = Object.assign(state);
            stateTmp.id = currentObjectId;
            stateTmp.type = "email-message";
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

    //const handlerCheckStateButtonIsDisabled = () => {
    //    handlerChangeButtonAdd(false);
    //};

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
        switch(type){
        case "name":
            if((elem.length !== 0) && state && helpers.checkInputValidation({
                "name": "integer", 
                "value": state.size, 
            })){           
                handlerChangeButtonAdd(false);
            } else {
                handlerChangeButtonAdd(true);
            }

            break;
        case "size":
            /*if(typeof elem !== "undefined"){
                if(helpers.checkInputValidation({
                    "name": "integer", 
                    "value": elem, 
                }) && elem[0] !== "0"){
                    return handlerChangeButtonAdd(false);
                }

                return handlerChangeButtonAdd(true);
            }*/

            if((helpers.checkInputValidation({
                "name": "integer", 
                "value": elem, 
            }) && elem[0] !== "0") && state && (state.name.length !== 0)){           
                handlerChangeButtonAdd(false);
            } else {
                handlerChangeButtonAdd(true);
            }

            break;
        default:
            if(state && ((helpers.checkInputValidation({
                "name": "integer", 
                "value": state.size, 
            }) && state.size[0] !== "0") && (state.name.length !== 0))){           
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

            {/**
             * 
                Доделать здесь и обратить внимание на доделки в contentFileSTIXObject.jsx
             *
            */}

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
            {/*<CreateEmailMessagePatternElements
                isDisabled={false}
                showRefElement={{}}
                campaignPatterElement={state}
                handlerBody={(e) => { dispatch({ type: "updateBody", data: e.target.value }); handlerCheckStateButtonIsDisabled(); }}
                handlerSubject={(e) => { dispatch({ type: "updateSubject", data: e.target.value }); handlerCheckStateButtonIsDisabled(); }}
                handlerDateSend={(e) => { dispatch({ type: "updateDateSend", data: e }); handlerCheckStateButtonIsDisabled(); }}
                handlerMessageId={(e) => { dispatch({ type: "updateMessageId", data: e.target.value }); handlerCheckStateButtonIsDisabled(); }}
                handlerContentType={(e) => { dispatch({ type: "updateContentType", data: e.target.value }); handlerCheckStateButtonIsDisabled(); }}
                handlerIsMultipart={(e) => { dispatch({ type: "updateIsMultipart", data: e.target.value }); handlerCheckStateButtonIsDisabled(); }}
                handlerButtonShowLink={() => {}}
                handlerAddReceivedLines={(e) => { dispatch({ type: "updateReceivedLines", data: e }); handlerCheckStateButtonIsDisabled(); }}
                handlerDeleteReceivedLines={(e) => { dispatch({ type: "deleteReceivedLines", data: e }); handlerCheckStateButtonIsDisabled(); }}
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
    currentObjectId: PropTypes.string.isRequired,
    buttonChangeClick: PropTypes.bool.isRequired,
    buttonAddIsDisabled: PropTypes.bool.isRequired,
    projectPatterElement: PropTypes.object.isRequired,
    handlerAddSTIXObject: PropTypes.func.isRequired,
    handlerChangeButtonAdd: PropTypes.func.isRequired,
    handlerChangeNewSTIXObject: PropTypes.func.isRequired,
};