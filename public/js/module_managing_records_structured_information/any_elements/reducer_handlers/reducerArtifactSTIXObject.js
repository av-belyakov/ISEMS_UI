export default function reducerArtifactPatternSTIXObjects(state, action){
    switch(action.type){
    case "newAll":
        return action.data;
    case "cleanAll":
        return {};
    case "addId":
        return {...state, id: action.data};
    case "updateName":
        if(state.name === action.data){
            return {...state};
        }
    
        return {...state, name: action.data};    
    case "updateURL":
        return {...state, url: action.data};
    case "updateMimeType":
        return {...state, mime_type: action.data};
    case "updatePayloadBin":
        return {...state, payload_bin: action.data};
    case "updateAddHashes":
        if(!state.hashes){
            state.hashes = {};
        }

        for(let key in action.data){
            state.hashes[key] = action.data[key];
        }

        return {...state};  
    case "updateDeleteHashes":
        delete state.hashes[action.data];

        return {...state};
    case "updateDecryptionKey":
        return {...state, decryption_key: action.data};
    case "updateEncryptionAlgorithm":
        return {...state, encryption_algorithm: action.data};
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
}