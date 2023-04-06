export default function reducerNetworkTrafficPatternSTIXObjects(state, action){
    let dateTime = "";
    let defaultData = "0001-01-01T00:00:00Z";
    let minDefaultData = "1970-01-01T00:00:00.000Z";
    let currentTimeZoneOffsetInHours = new Date().getTimezoneOffset() / 60;
    let ms = currentTimeZoneOffsetInHours * 3600000;

    let tmp = "";

    switch(action.type){
    case "newAll":
        if(action.data.start && action.data.end){
            if(action.data.start === defaultData){
                action.data.start = minDefaultData;
            } else {
                action.data.start = new Date(Date.parse(action.data.start)).toISOString();
            }
        }

        if(action.data.end){
            if(action.data.end === defaultData){
                action.data.end = minDefaultData;
            } else {
                action.data.end = new Date(Date.parse(action.data.end)).toISOString();
            }
        }

        return action.data;
    case "cleanAll":
        return {};
    case "addId":
        return {...state, id: action.data};
    case "addShortRef":
        state[action.data.propName] = action.data.value;

        return {...state};
    case "updateStartDate":
        tmp = Date.parse(action.data);

        if(currentTimeZoneOffsetInHours < 0){
            dateTime = new Date(tmp + (ms * -1));
        } else {
            dateTime = new Date(tmp - (ms * -1));
        }

        state.start = new Date(Date.parse(dateTime)).toISOString();

        return {...state};
    case "updateEndDate":
        tmp = Date.parse(action.data);

        if(currentTimeZoneOffsetInHours < 0){
            dateTime = new Date(tmp + (ms * -1));
        } else {
            dateTime = new Date(tmp - (ms * -1));
        }

        state.end = new Date(Date.parse(dateTime)).toISOString();

        return {...state};
    case "updateSrcPort":
        if(action.data < 0 || action.data > 65535){
            return {...state};
        }

        return {...state, src_port: +action.data};
    case "updateDstPort":
        if(action.data < 0 || action.data > 65535){
            return {...state};
        }

        return {...state, dst_port: +action.data};
    case "updateIsActive":
        return {...state, is_active: (action.data === "true")};
    case "updateSrcPackets":
        return {...state, src_packets: +action.data};
    case "updateDstPackets":
        return {...state, dst_packets: +action.data};
    case "updateSrcByteCount":
        return {...state, src_byte_count: +action.data};
    case "updateDstByteCount":
        return {...state, dst_byte_count: +action.data};
    case "updateProtocols":
        return {...state, protocols: action.data};
    case "updateConfidence":
        if(state.confidence === action.data.data){
            return {...state};
        }
    
        return {...state, confidence: action.data.data};
    case "updateDefanged":
        return {...state, defanged: (action.data.data === "true")};
    case "updateLabels":
        return {...state, labels: action.data.listTokenValue};
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
    case "deleteReceivedLines":
        state.received_lines.splice(action.data, 1);
    
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