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
import reducerNetworkTrafficPatternSTIXObjects from "../reducer_handlers/reducerNetworkTrafficSTIXObject.js";
import CreateNetworkTrafficPatternElements from "../type_elements_stix/networkTrafficPatternElements.jsx";
import CreateElementAdditionalTechnicalInformationCO from "../createElementAdditionalTechnicalInformationCO.jsx";

export default function CreateNetworkTrafficPatternNewSTIXObject(props){
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
     
CreateNetworkTrafficPatternNewSTIXObject.propTypes = {
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
        return `network-traffic--${uuidv4()}`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ buttonAddClick ]);

    const [ state, dispatch ] = useReducer(reducerNetworkTrafficPatternSTIXObjects, { 
        start: "1970-01-01T00:00:00.000Z",
        end: "1970-01-01T00:00:00.000Z",
        protocols: [] 
    });
    useEffect(() => {
        if(projectPatterElement.type === "network-traffic"){
            dispatch({ type: "newAll", data: projectPatterElement });
        }
    }, [ projectPatterElement ]);
    useEffect(() => {
        if(buttonAddClick){
            let stateTmp = Object.assign(state);
            stateTmp.id = currentObjectId;
            stateTmp.type = "network-traffic";
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

    const handlerCheckStateButtonIsDisabled = (protocols) => {

        console.log("func 'handlerCheckStateButtonIsDisabled', protocols: ", protocols, " state: ", state);

        if(typeof protocols !== "undefined" && Array.isArray(protocols)){
            if(protocols.length === 0){
                //handlerButtonIsDisabled(true);
                handlerChangeButtonAdd(true);
            } else {
                //handlerButtonIsDisabled(false);
                handlerChangeButtonAdd(false);
            }
        } else {
            if(state.protocols.length === 0){
                //handlerButtonIsDisabled(true);
                handlerChangeButtonAdd(true);
            } else {
                //handlerButtonIsDisabled(false);
                handlerChangeButtonAdd(false);
            }
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
                        {`${helpers.getLinkImageSTIXObject("mutex").description}`}
                    </Typography> 
                </Grid>
            </Grid>

            <Grid container direction="row" spacing={3}>
                <Grid item container md={4} justifyContent="flex-end"><span className="text-muted">Уникальный идентификатор (ID):</span></Grid>
                <Grid item container md={8}>{state.id? state.id: currentObjectId}</Grid>
            </Grid>

            <CreateNetworkTrafficPatternElements 
                isDisabled={false}
                showRefElement={{}}
                campaignPatterElement={state}
                handlerClick={() => {}}
                handlerEndDate={(e) => { dispatch({ type: "updateEndDate", data: e }); handlerCheckStateButtonIsDisabled(); }}
                handlerSrcPort={(e) => { dispatch({ type: "updateSrcPort", data: e.target.value }); handlerCheckStateButtonIsDisabled(); }}
                handlerDstPort={(e) => { dispatch({ type: "updateDstPort", data: e.target.value }); handlerCheckStateButtonIsDisabled(); }}
                handlerIsActive={(e) => { dispatch({ type: "updateIsActive", data: e.target.value }); handlerCheckStateButtonIsDisabled(); }}
                handlerStartDate={(e) => { dispatch({ type: "updateStartDate", data: e }); handlerCheckStateButtonIsDisabled(); }}
                handlerDstPackets={(e) => { dispatch({ type: "updateDstPackets", data: e.target.value }); handlerCheckStateButtonIsDisabled(); }}
                handlerSrcPackets={(e) => { dispatch({ type: "updateSrcPackets", data: e.target.value }); handlerCheckStateButtonIsDisabled(); }}
                handlerDstByteCount={(e) => { dispatch({ type: "updateDstByteCount", data: e.target.value }); handlerCheckStateButtonIsDisabled(); }}
                handlerSrcByteCount={(e) => { dispatch({ type: "updateSrcByteCount", data: e.target.value }); handlerCheckStateButtonIsDisabled(); }}
                handlerListProtocols={(e) => { dispatch({ type: "updateProtocols", data: e }); handlerCheckStateButtonIsDisabled(e); }}
                // это обработчик для ссылок на объекты содержащие ТОЛЬКО одну строчку, подходит только для свойств src_ref и dst_ref которые после 
                //просмотра будет содержать только свойство value STIX объектов: ipv4-addr, ipv6-addr, mac-addr, domain-name
                handlerClickShortRef={() => {}}
                // это обработчик для ссылок на объекты содержащие полную информацию (для визуализации используется CreateShortInformationSTIXObject), 
                //подходит для свойств src_payload_ref и dst_payload_ref содержащие ссылки на STIX объект artifact 
                handlerButtonShowLink={() => {}}
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