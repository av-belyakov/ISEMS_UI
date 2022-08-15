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
import CreateThreatActorElements from "../type_elements_stix/threatActorPatternElements.jsx";
import CreateElementAdditionalTechnicalInformationDO from "../createElementAdditionalTechnicalInformationDO.jsx";

export default function CreateThreatActorPatternNewSTIXObject(props){
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
     
CreateThreatActorPatternNewSTIXObject.propTypes = {
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

            <CreateThreatActorElements 
                isDisabled={false}
                campaignPatterElement={state}
                handlerName={(e) => { dispatch({ type: "updateName", data: e.target.value }); handlerButtonIsDisabled(e.target.value); }}
                handlerRoles={(e) => { dispatch({ type: "updateRoles", data: e.target.value }); handlerButtonIsDisabled(); }}
                // Roles - заранее определенный (предложенный) перечень возможных ролей субъекта угроз
                handlerGoals={(e) => { dispatch({ type: "updateGoals", data: e }); handlerButtonIsDisabled(); }}
                // Goals - высокоуровневые цели субъекта угроз.
                handlerAliases={(e) => { dispatch({ type: "updateAliases", data: e }); handlerButtonIsDisabled(); }}
                // Aliases - альтернативные имена используемые для этого субъекта угроз
                handlerLastSeen={(e) => { dispatch({ type: "updateLastSeen", data: e }); handlerButtonIsDisabled(); }}
                // LastSeen - время, в формате "2016-05-12T08:17:27.000Z", когда данный субъект угроз был зафиксирован в последний раз
                handlerFirstSeen={(e) => { dispatch({ type: "updateFirstSeen", data: e }); handlerButtonIsDisabled(); }}
                // FirstSeen - время, в формате "2016-05-12T08:17:27.000Z", когда данный субъект угроз был впервые зафиксирован
                handlerDescription={(e) => { dispatch({ type: "updateDescription", data: e.target.value }); handlerButtonIsDisabled(); }}
                handlerResourceLevel={(e) => { dispatch({ type: "updateResourceLevel", data: e.target.value }); handlerButtonIsDisabled(); }}
                // ResourceLevel - один, из заранее определенного (предложенного) перечня организационных уровней, на котором обычно работает этот субъект угрозы,
                //  который, в свою очередь, определяет ресурсы, доступные этому субъекту угрозы для использования в атаке.
                handlerSophistication={(e) => { dispatch({ type: "updateSophistication", data: e.target.value }); handlerButtonIsDisabled(); }}
                // Sophistication - один, из заранее определенного (предложенного) перечня навыков, специальных знания, специальной подготовки или опыта,
                //  которыми должен обладать субъект угрозы, чтобы осуществить атаку
                handlerThreatActorTypes={(e) => { dispatch({ type: "updateThreatActorTypes", data: e.target.value }); handlerButtonIsDisabled(); }} 
                // ThreatActorTypes - заранее определенный (предложенный) перечень типов субъектов угрозы                    
                handlerPrimaryMotivation={(e) => { dispatch({ type: "updatePrimaryMotivation", data: e.target.value }); handlerButtonIsDisabled(); }}
                // PrimaryMotivation - одна, из заранее определенного (предложенного) перечня причин, мотиваций или целей стоящих за этим субъектом угроз
                handlerPersonalMotivations={(e) => { dispatch({ type: "updatePersonalMotivations", data: e.target.value }); handlerButtonIsDisabled(); }}
                // PersonalMotivations - заранее определенный (предложенный) перечень возможных персональных причин, мотиваций или целей стоящих за этим субъектом угрозы
                handlerSecondaryMotivations={(e) => { dispatch({ type: "updateSecondaryMotivations", data: e.target.value }); handlerButtonIsDisabled(); }}
                // SecondaryMotivations - заранее определенный (предложенный) перечень возможных вторичных причин, мотиваций или целей стоящих за этим субъектом угрозы
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