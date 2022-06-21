import React, { useReducer } from "react";
import {
    Box, 
    Button,
    Paper,
    Grid,
    Typography,
} from "@material-ui/core";
import PropTypes from "prop-types";

import { helpers } from "../../../common_helpers/helpers.js";
import CreateCampaingPatternElements from "../type_elements_stix/campaingPatternElements.jsx";

const reducer = (state, action) => {
    let lastSeen = "";
    let firstSeen = "";
    let currentTimeZoneOffsetInHours = "";

    switch(action.type){
    case "newAll":
        lastSeen = Date.parse(action.data.last_seen);
        firstSeen = Date.parse(action.data.first_seen);
        currentTimeZoneOffsetInHours = new Date(lastSeen).getTimezoneOffset() / 60;

        if(currentTimeZoneOffsetInHours < 0){
            action.data.last_seen = new Date(lastSeen + ((currentTimeZoneOffsetInHours * -1) * 3600000)).toISOString();
            action.data.first_seen = new Date(firstSeen + ((currentTimeZoneOffsetInHours * -1) * 3600000)).toISOString();
        } else {
            action.data.last_seen = new Date(lastSeen - (currentTimeZoneOffsetInHours * 3600000)).toISOString();
            action.data.first_seen = new Date(firstSeen - (currentTimeZoneOffsetInHours * 3600000)).toISOString();
        }

        return action.data;
    case "cleanAll":
        return {};
    case "updateObjective":
        return {...state, objective: action.data};
    case "updateDescription":
        if(state.description === action.data){
            return {...state};
        }

        return {...state, description: action.data};
    case "updateTokenValuesChange":
        return {...state, aliases: action.data};
    case "updateDateTimeFirstSeen":
        return {...state, first_seen: new Date(action.data).toISOString()};
    case "updateDateTimeLastSeen":
        return {...state, last_seen: new Date(action.data).toISOString()};
    case "updateConfidence":
        if(state.confidence === action.data.data){
            return {...state};
        }

        return {...state, confidence: action.data.data};
    case "updateDefanged":
        return {...state, defanged: (action.data === "true")};
    case "updateLabels":
        return {...state, labels: action.data.listTokenValue};
    case "updateExternalReferences":
        if(!state.external_references){
            state.external_references = [];
        }

        for(let key of state.external_references){
            if(key.source_name === action.data.source_name){
                return {...state};
            }
        }

        state.external_references.push(action.data);

        return {...state};
    case "updateExternalReferencesHashesUpdate":
        if((state.external_references[action.data.orderNumber].hashes === null) || (typeof state.external_references[action.data.orderNumber].hashes === "undefined")){
            state.external_references[action.data.orderNumber].hashes = {};
        }

        state.external_references[action.data.orderNumber].hashes[action.data.newHash.hash] = action.data.newHash.type;

        return {...state};
    case "updateExternalReferencesHashesDelete":
        delete state.external_references[action.data.orderNumber].hashes[action.data.hashName];

        return {...state};
    case "updateGranularMarkings":
        if(!state.granular_markings){
            state.granular_markings = [];
        }

        for(let keyGM of state.granular_markings){
            if(!keyGM.selectors){
                return {...state};
            }

            for(let keyS of keyGM.selectors){
                for(let key of action.data.selectors){
                    if(key === keyS){
                        return {...state};
                    }
                }
            }
        }

        state.granular_markings.push(action.data);

        return {...state};
    case "updateExtensions":
        if(!state.extensions){
            state.extensions = {};
        }

        state.extensions[action.data.name] = action.data.description;

        return {...state};
    case "deleteElementAdditionalTechnicalInformation":
        switch(action.data.itemType){
        case "extensions":
            delete state.extensions[action.data.item];

            return {...state};
        case "granular_markings":
            state.granular_markings.splice(action.data.orderNumber, 1);

            return {...state};
        case "external_references":
            state.external_references.splice(action.data.orderNumber, 1);

            return {...state};
        }
    }
};

export default function CreateCampaignPatternNewSTIXObject(props){
    let { 
        isNotDisabled,
        parentIdSTIXObject,
        projectPatterElement,
        handlerAddSTIXObject,
    } = props;
    /**
     * наверное тут надо принимать общий обработчик для всех типов STIX объектов а саму обработку и 
     * добавление данных проводить в contentCreateNewSTIXObject, тогда будет проще обработать доступность
     * кнопки "сохранить" и действие при ее нажатии 
     */

    const [ state, dispatch ] = useReducer(reducer, projectPatterElement);

    let buttonIsDisabled = true;

    const handlerButtonIsDisabled = () => {
        /*if(!buttonIsDisabled){
            return;
        }

        setButtonIsDisabled();*/
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
                    <Button onClick={handlerAddSTIXObject} color="primary" disabled={buttonIsDisabled}>добавить</Button>
                </Grid>
            </Grid>
            <CreateCampaingPatternElements 
                isDisabled={false}
                campaignPatterElement={state}
                handlerName={(e) => {}}
                handlerObjective={(e) => { dispatch({ type: "updateObjective", data: e.target.value }); handlerButtonIsDisabled(); }}
                handlerDescription={(e) => { dispatch({ type: "updateDescription", data: e.target.value }); handlerButtonIsDisabled(); }}
                handlerTokenValuesChange={(e) => { dispatch({ type: "updateTokenValuesChange", data: e }); handlerButtonIsDisabled(); }}
                handlerChangeDateTimeFirstSeen={(e) => { dispatch({ type: "updateDateTimeFirstSeen", data: e }); handlerButtonIsDisabled(); }}
                handlerChangeDateTimeLastSeen={(e) => { dispatch({ type: "updateDateTimeLastSeen", data: e }); handlerButtonIsDisabled(); }}
            />
        </Box>
    </Paper>);
}
     
CreateCampaignPatternNewSTIXObject.propTypes = {
    isNotDisabled: PropTypes.bool.isRequired,
    parentIdSTIXObject: PropTypes.string.isRequired,
    projectPatterElement: PropTypes.object.isRequired,
    handlerAddSTIXObject: PropTypes.func.isRequired,
};
