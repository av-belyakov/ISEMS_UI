const listFieldEmailMessageRef = [
    "to_refs",
    "cc_refs",
    "bcc_refs",
];

export default function reducerGroupingSTIXObject(state, action){
    switch(action.type){
    case "newAll":
        return {...state, mainObj: action.data};
    case "cleanAll":
        return {...state, mainObj: {}};
    case "updateRefId":
        //console.log("action.type:", action.type, " action.data:", action.data);

        state.refId = action.data;

        return {...state};
    case "updateRefObj":
        //console.log("action.type:", action.type, " action.data:", action.data);

        state.refObj = action.data;

        return {...state};
    case "updateRefObjEmailMessageRef":
        console.log("func 'reducerGroupingSTIXObject' action.type:", action.type, " action.data:", action.data);
        //console.log("state = ", state);

        if(state.refObj["from_ref"] && state.refObj["from_ref"] === action.data.id){
            state.refObj["from_ref"] = action.data.value;
        }

        if(state.refObj["sender_ref"] && state.refObj["sender_ref"] === action.data.id){
            state.refObj["sender_ref"] = action.data.value;
        }

        for(let value of listFieldEmailMessageRef){
            if(state.refObj[value] && state.refObj[value].length > 0){
                for(let i = 0; i <  state.refObj[value].length; i++){
                    if(state.refObj[value][i] !== action.data.id){
                        continue;
                    }

                    state.refObj[value][i] = action.data.value;
                }
            }
        }

        return {...state};
    case "updateRefObjNetworkTrafficRef":
        console.log("func 'reducerGroupingSTIXObject' action.type:", action.type, " action.data:", action.data);

        if(state.refObj.src_ref === action.data.id){
            state.refObj.src_ref = action.data.value;
        }

        if(state.refObj.dst_ref === action.data.id){
            state.refObj.dst_ref = action.data.value;
        }

        return {...state};
    case "updateRefObjFileRef":
        console.log("func 'reducerGroupingSTIXObject' action.type:", action.type, " action.data:", action.data);

        state.refObj.content_ref = action.data;

        return {...state};
    case "updateResolvesToRefs":
        console.log("@@#$  func 'reducerGroupingSTIXObject' action.type:", action.type, " action.data:", action.data, " state:", state);
        console.log("%%%%%%%% state.refObj.resolves_to_refs: ", state.refObj.resolves_to_refs, " action.data.id: ", action.data.id);
        //resolves_to_refs

        /**
         * 
         * тут надо разобратся, что то не то с циклом
         * 
         */

        for(let i = 0; i < state.refObj.resolves_to_refs; i++){
            console.log("**************** state.refObj.resolves_to_refs[i]: ", state.refObj.resolves_to_refs[i], " action.data.id: ", action.data.id);

            if(state.refObj.resolves_to_refs[i] === action.data.id){
                state.refObj.resolves_to_refs[i] = action.data.value;
            }
        }

        return {...state};
    case "updateName":
        if(state.mainObj.name === action.data){
            return {...state};
        }
    
        state.mainObj.name = action.data;

        //return {...state, name: action.data};
        return {...state};    
    case "updateContex":

        console.log("action.type:", action.type, " action.data:", action.data);

        state.mainObj.context = action.data;

        //return {...state, context: action.data};            
        return {...state};
    case "updateDescription":

        console.log("action.type:", action.type, " action.data:", action.data);

        if(state.mainObj.description === action.data){
            return {...state};
        }
    
        state.mainObj.description = action.data;

        //return {...state, description: action.data};
        return {...state};
    case "updateConfidence":

        console.log("action.type:", action.type, " action.data:", action.data);

        if(state.mainObj.confidence === action.data.data){
            return {...state};
        }
    
        state.mainObj.confidence = action.data.data;

        //return {...state, confidence: action.data.data};
        return {...state};
    case "updateDefanged":

        console.log("action.type:", action.type, " action.data:", action.data);

        state.mainObj.defanged = (action.data.data === "true");

        //return {...state, defanged: (action.data.data === "true")};
        return {...state};
    case "updateLabels":

        console.log("action.type:", action.type, " action.data:", action.data);

        state.mainObj.labels = action.data.listTokenValue;

        //return {...state, labels: action.data.listTokenValue};
        return {...state};
    case "updateExternalReferences":

        console.log("action.type:", action.type, " action.data:", action.data);

        if(!state.mainObj.external_references){
            state.mainObj.external_references = [];
        }
    
        for(let key of state.mainObj.external_references){
            if(key.source_name === action.data.source_name){
                return {...state};
            }
        }
    
        state.mainObj.external_references.push(action.data);
    
        return {...state};
    case "updateExternalReferencesHashesUpdate":

        console.log("action.type:", action.type, " action.data:", action.data);

        if((state.mainObj.external_references[action.data.orderNumber].hashes === null) || (typeof state.mainObj.external_references[action.data.orderNumber].hashes === "undefined")){
            state.mainObj.external_references[action.data.orderNumber].hashes = {};
        }
    
        state.mainObj.external_references[action.data.orderNumber].hashes[action.data.newHash.hash] = action.data.newHash.type;
    
        return {...state};
    case "updateExternalReferencesHashesDelete":

        console.log("action.type:", action.type, " action.data:", action.data);

        delete state.mainObj.external_references[action.data.orderNumber].hashes[action.data.hashName];
    
        return {...state};
    case "updateGranularMarkings":

        console.log("action.type:", action.type, " action.data:", action.data);

        if(!state.mainObj.granular_markings){
            state.mainObj.granular_markings = [];
        }
    
        for(let keyGM of state.mainObj.granular_markings){
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
    
        state.mainObj.granular_markings.push(action.data);
    
        return {...state};
    case "updateExtensions":

        console.log("action.type:", action.type, " action.data:", action.data);

        if(!state.mainObj.extensions){
            state.mainObj.extensions = {};
        }
    
        state.mainObj.extensions[action.data.name] = action.data.description;
    
        return {...state};
    case "deleteElementAdditionalTechnicalInformation":

        console.log("action.type:", action.type, " action.data:", action.data, " action.data.itemType:", action.data.itemType);

        switch(action.data.itemType){
        case "extensions":
            delete state.mainObj.extensions[action.data.item];
    
            return {...state};
        case "granular_markings":
            state.mainObj.granular_markings.splice(action.data.orderNumber, 1);
    
            return {...state};
        case "external_references":
            state.mainObj.external_references.splice(action.data.orderNumber, 1);
    
            return {...state};
        }
    }
}

/*export default function reducerGroupingSTIXObject(state, action){
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
    case "updateContex":
        return {...state, context: action.data};            
    case "updateDescription":
        if(state.description === action.data){
            return {...state};
        }
    
        return {...state, description: action.data};
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
}*/