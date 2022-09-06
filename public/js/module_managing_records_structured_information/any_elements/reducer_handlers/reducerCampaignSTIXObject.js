export default function reducerCampaignSTIXObjects(state, action){
    let lastSeen = "";
    let firstSeen = "";
    let currentTimeZoneOffsetInHours = new Date().getTimezoneOffset() / 60;

    switch(action.type){
    case "newAll":

        console.log("func 'reducerCampaignSTIXObjects', BEFORE action.type:", action.type, " action.data:", action.data, " action.data.first_seen:", action.data.first_seen);

        if(action.data.first_seen && action.data.last_seen){
            lastSeen = Date.parse(action.data.last_seen);
            firstSeen = Date.parse(action.data.first_seen);
    
            console.log("func 'reducerCampaignSTIXObjects', AFTER parse firstSeen:", firstSeen, " new Date().toISOString(): ", new Date(firstSeen).toISOString());

            action.data.last_seen = new Date(Date.parse(action.data.last_seen)).toISOString();
            action.data.first_seen = new Date(Date.parse(action.data.first_seen)).toISOString();

            /*
            currentTimeZoneOffsetInHours = new Date(lastSeen).getTimezoneOffset() / 60;

            if(currentTimeZoneOffsetInHours < 0){
                action.data.last_seen = new Date(lastSeen + ((currentTimeZoneOffsetInHours * -1) * 3600000)).toISOString();
                action.data.first_seen = new Date(firstSeen + ((currentTimeZoneOffsetInHours * -1) * 3600000)).toISOString();
            } else {
                action.data.last_seen = new Date(lastSeen - (currentTimeZoneOffsetInHours * 3600000)).toISOString();
                action.data.first_seen = new Date(firstSeen - (currentTimeZoneOffsetInHours * 3600000)).toISOString();
            }
            */    
        }

        console.log("func 'reducerCampaignSTIXObjects', AFTER action.type:", action.type, " action.data:", action.data, " action.data.first_seen:", action.data.first_seen);

        return action.data;
    case "cleanAll":
        return {};
    case "updateCreatedTime":
        return {...state, created: action.data};
    case "updateModifiedTime":
        return {...state, modified: action.data};
    case "updateFirstSeenTime":
        return {...state, first_seen: action.data};
    case "updateLastSeenTime":
        return {...state, last_seen: action.data};
    case "addId":
        return {...state, id: action.data};
    case "updateName":
        if(state.name === action.data){
            return {...state};
        }
    
        return {...state, name: action.data};    
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

        console.log("func 'reducerCampaignSTIXObjects', AFTER action.type:", action.type, " action.data:", action.data, " new Date(action.data).toISOString():", new Date(action.data).toISOString(), " state.first_seen:", state.first_seen);
        console.log("currentTimeZoneOffsetInHours = ", currentTimeZoneOffsetInHours);

        return {...state, first_seen: new Date(action.data).toISOString()};
    case "updateDateTimeLastSeen":
        return {...state, last_seen: new Date(action.data).toISOString()};
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