export default function reducerThreatActorSTIXObjects(state, action){
    switch(action.type){
    case "newAll":
        return action.data;
    case "cleanAll":
        return {};
    case "updateName":

        console.log("func 'reducerToolSTIXObjects', action.type:", action.type, " action.data:", action.data);

        if(state.name === action.data){
            return {...state};
        }
        
        return {...state, name: action.data};    
    case "updateDescription":
        if(state.description === action.data){
            return {...state};
        }
    
        return {...state, description: action.data};
    case "updateThreatActorTypes":

        console.log("func 'reducerToolSTIXObjects', action.type:", action.type, " action.data:", action.data);

        return {...state, threat_actor_types: action.data};        
    case "updateAliases":
        return {...state, aliases: action.data};
    case "updateFirstSeen":
        return {...state, first_seen: new Date(action.data).toISOString()};
    case "updateLastSeen":
        return {...state, last_seen: new Date(action.data).toISOString()};
    case "updateRoles":
        return {...state, roles: action.data};
    case "updateGoals":
        return {...state, goals: action.data};
    case "updateSophistication":
        return {...state, sophistication: action.data};
    case "updateResourceLevel":
        return {...state, resource_level: action.data};
    case "updatePrimaryMotivation":
        return {...state, primary_motivation: action.data};
    case "updateSecondaryMotivations":
        return {...state, secondary_motivations: action.data};
    case "updatePersonalMotivations":
        return {...state, personal_motivations: action.data};
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
}