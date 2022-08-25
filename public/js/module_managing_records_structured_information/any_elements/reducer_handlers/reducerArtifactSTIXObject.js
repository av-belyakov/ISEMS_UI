export default function reducerArtifactPatternSTIXObjects(state, action){
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
        
        /*

                    handlerURL={(e) => { dispatch({ type: "updateURL", data: e }); handlerButtonIsDisabled(); }} //string         `json:"url" bson:"url"`
                    handlerName={(e) => {}}
                    handlerHashes={(e) => { dispatch({ type: "updateHashes", data: e }); handlerButtonIsDisabled(); }} //HashesTypeSTIX `json:"hashes" bson:"hashes"`
                    handlerMimeType={(e) => { dispatch({ type: "updateMimeType", data: e }); handlerButtonIsDisabled(); }} //string         `json:"mime_type" bson:"mime_type"`
                    handlerPayloadBin={(e) => { dispatch({ type: "updatePayloadBin", data: e }); handlerButtonIsDisabled(); }} //string         `json:"payload_bin" bson:"payload_bin"`
                    handlerDescription={(e) => { dispatch({ type: "updateDescription", data: e.target.value }); handlerButtonIsDisabled(); }}
                    handlerDecryptionKey={(e) => { dispatch({ type: "updateDecryptionKey", data: e }); handlerButtonIsDisabled(); }} //string `json:"decryption_key" bson:"decryption_key"`
                    handlerEncryptionAlgorithm={(e) => { dispatch({ type: "updateEncryptionAlgorithm", data: e }); handlerButtonIsDisabled(); }} //EnumTypeSTIX   `json:"encryption_algorithm" bson:"encryption_algorithm"`


    case "updateTokenValuesChange":
        return {...state, aliases: action.data};
    case "updateKillChainPhases":
        if(!state.kill_chain_phases){
            state.kill_chain_phases = [];
        }
            
        state.kill_chain_phases.push(action.data);
    
        return {...state};    
    */

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