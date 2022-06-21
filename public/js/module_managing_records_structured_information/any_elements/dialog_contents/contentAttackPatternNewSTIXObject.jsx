import React, { useReducer } from "react";
import { 
    Box,
    Button,
    Grid,
    Paper,
    Typography,
} from "@material-ui/core";
import PropTypes from "prop-types";

import { helpers } from "../../../common_helpers/helpers.js";
import CreateAttackPatternElements from "../type_elements_stix/attackPatternElements.jsx";

const reducer = (state, action) => {
    switch(action.type){
    case "newAll":
        return action.data;
    case "cleanAll":
        return {};
    case "updateDescription":
        if(state.description === action.data){
            return {...state};
        }

        return {...state, description: action.data};
    case "updateTokenValuesChange":
        return {...state, aliases: action.data};
    case "updateKillChainPhases":
        if(!state.kill_chain_phases){
            state.kill_chain_phases = [];
        }
        
        state.kill_chain_phases.push(action.data);

        return {...state};    
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
    case "deleteKillChain":
        state.kill_chain_phases.splice(action.data, 1);

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

export default function CreateDialogContentAttackPatternNewSTIXObject(props){
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
                        {`${helpers.getLinkImageSTIXObject("attack-pattern").description}`}
                    </Typography> 
                </Grid>
                <Grid item container md={4} justifyContent="flex-end">
                    <Button onClick={handlerAddSTIXObject} color="primary" disabled={buttonIsDisabled}>добавить</Button>
                </Grid>
            </Grid>
            <CreateAttackPatternElements 
                isDisabled={false}
                campaignPatterElement={state}
                handlerName={(e) => {}}
                handlerDescription={(e) => { dispatch({ type: "updateDescription", data: e.target.value }); handlerButtonIsDisabled(); }}
                handlerDeleteKillChain={(e) => { dispatch({ type: "deleteKillChain", data: e }); handlerButtonIsDisabled(); }}
                handlerTokenValuesChange={(e) => { dispatch({ type: "updateTokenValuesChange", data: e }); handlerButtonIsDisabled(); }}
                handlerAddKillChainPhases={(e) => { dispatch({ type: "updateKillChainPhases", data: e }); handlerButtonIsDisabled(); }}
            />
        </Box>
    </Paper>);
}

CreateDialogContentAttackPatternNewSTIXObject.propTypes = {
    isNotDisabled: PropTypes.bool.isRequired,
    parentIdSTIXObject: PropTypes.string.isRequired,
    projectPatterElement: PropTypes.object.isRequired,
    handlerAddSTIXObject: PropTypes.func.isRequired,
};