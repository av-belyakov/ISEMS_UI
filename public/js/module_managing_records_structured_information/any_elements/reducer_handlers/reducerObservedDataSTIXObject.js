export default function reducerObservedDataSTIXObjects(state, action){
    let lastObserved = "";
    let firstObserved = "";
    let currentTimeZoneOffsetInHours = new Date().getTimezoneOffset() / 60;
    let ms = currentTimeZoneOffsetInHours * 3600000;

    let tmp = "";

    switch(action.type){
    case "newAll":
        if(action.data.first_observed && action.data.last_observed){
            action.data.last_observed = new Date(Date.parse(action.data.last_observed)).toISOString();
            action.data.first_observed = new Date(Date.parse(action.data.first_observed)).toISOString();
        }

        return action.data;
    case "cleanAll":
        return {};
    case "updateCreatedTime":
        return {...state, created: action.data};
    case "updateModifiedTime":
        return {...state, modified: action.data};
    case "updateFirstObservedTime":
        return {...state, first_observed: action.data};
    case "updateLastObservedTime":
        return {...state, last_observed: action.data};
    case "updateDateTimeFirstObserved":
        tmp = Date.parse(action.data);

        if(currentTimeZoneOffsetInHours < 0){
            firstObserved = new Date(tmp + (ms * -1));
        } else {
            firstObserved = new Date(tmp - (ms * -1));
        }

        return {...state, first_observed: firstObserved};
    case "updateDateTimeLastObserved":
        tmp = Date.parse(action.data);

        if(currentTimeZoneOffsetInHours < 0){
            lastObserved = new Date(tmp + (ms * -1));
        } else {
            lastObserved = new Date(tmp - (ms * -1));
        }

        return {...state, last_observed: lastObserved};
    case "updateNumberObserved":
        return {...state, number_observed: +action.data};
    case "updateObjectRefs":
        for(let i = 0; i < state.object_refs.length; i++){
            if(state.object_refs[i] === action.data.id){
                state.object_refs[i] = action.data.value;
            }
        }

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