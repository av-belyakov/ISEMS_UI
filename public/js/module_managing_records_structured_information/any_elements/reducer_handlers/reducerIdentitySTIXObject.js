export default function reducerIdentitySTIXObject(state, action){
    switch(action.type){
    case "newAll":
        return action.data;
    case "cleanAll":
        return {};
    case "updateName":
        if(state.name === action.data){
            return {...state};
        }
            
        return {...state, name: action.data};   
    case "updateDescription":
        if(state.description === action.data){
            return {...state};
        }
    
        return {...state, description: action.data};
    case "updateTokenValuesChange":
        return {...state, roles: action.data};
    case "updateIdentityClass":
        return {...state, identity_class: action.data};
    case "updateSectors":
        return {...state, sectors: action.data};
    case "updateContactInformation":
        return {...state, contact_information: action.data};
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