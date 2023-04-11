const defaultData = "0001-01-01T00:00";

export default function reducerIndicatorSTIXObjects(state, action){
    let dateTime = "";
    let currentTimeZoneOffsetInHours = new Date().getTimezoneOffset() / 60;
    let ms = currentTimeZoneOffsetInHours * 3600000;
 
    let tmp = "";

    switch(action.type){
    case "newAll":   
        console.log("func 'reducerIndicatorSTIXObjects', action.type:", action.type, " action.data:", action.data);

        if(action.data.valid_from && action.data.valid_from.slice(0, 16) !== defaultData){
            action.data.valid_from = new Date(Date.parse(action.data.valid_from)).toISOString();
        } else {
            if(currentTimeZoneOffsetInHours > 0){
                action.data.valid_from = Date.now() + ms;
            } else {
                action.data.valid_from = Date.now() - (ms * -1);
            }
        }

        if(action.data.valid_until){
            action.data.valid_until = new Date(Date.parse(action.data.valid_until)).toISOString();
        }

        return action.data;
    case "cleanAll":
        return {}; 
    case "updateCreatedTime":
        return {...state, created: action.data};
    case "updateModifiedTime":
        return {...state, modified: action.data};
    case "updateName":
        return {...state, name: action.data};
    case "updatePattern":
        return {...state, pattern: action.data};
    case "updateIndicator":
        return {...state, indicator_types: action.data};
    case "updateDescription":
        return {...state, description: action.data};
    case "updatePatternType":
        return {...state, pattern_type: action.data};
    case "updatePatternVersion":
        return {...state, pattern_version: action.data};
    case "updateValidFrom":
        tmp = Date.parse(action.data);

        if(currentTimeZoneOffsetInHours < 0){
            dateTime = new Date(tmp + (ms * -1));
        } else {
            dateTime = new Date(tmp - (ms * -1));
        }

        return {...state, valid_from: new Date(Date.parse(dateTime)).toISOString()};
    case "updateValidUntil":
        tmp = Date.parse(action.data);

        if(currentTimeZoneOffsetInHours < 0){
            dateTime = new Date(tmp + (ms * -1));
        } else {
            dateTime = new Date(tmp - (ms * -1));
        }

        return {...state, valid_until: new Date(Date.parse(dateTime)).toISOString()};
    case "updateAddKillChainPhases":
        if(!state.kill_chain_phases){
            state.kill_chain_phases = [];
        }
                
        state.kill_chain_phases.push(action.data);

        return {...state};   
    case "deleteKillChainPhases":
        state.kill_chain_phases.splice(action.data, 1);
            
        return {...state};
    case "updateConfidence":
        if(state.confidence === action.data.data){
            return {...state};
        }
    
        return {...state, confidence: action.data.data};
    case "updateDefanged":
        return {...state, defanged: (action.data.data === "true")};
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
    case "deleteKillChainPhases":
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
}