export default function reducerEmailMessagePatternSTIXObjects(state, action){
    let dateSend = "";
    let currentTimeZoneOffsetInHours = new Date().getTimezoneOffset() / 60;
    let ms = currentTimeZoneOffsetInHours * 3600000;

    let tmp = "";

    switch(action.type){
    case "newAll":
        if(action.data.date && action.data.date){
            action.data.date = new Date(Date.parse(action.data.date)).toISOString();
        }

        return action.data;
    case "cleanAll":
        return {};
    case "addId":
        return {...state, id: action.data};
    case "updateBody":
        return {...state, body: action.data};
    case "updateSubject":
        return {...state, subject: action.data};
    case "updateDate":
        return {...state, date: action.data};
    case "updateDateSend":
        tmp = Date.parse(action.data);

        if(currentTimeZoneOffsetInHours < 0){
            dateSend = new Date(tmp + (ms * -1));
        } else {
            dateSend = new Date(tmp - (ms * -1));
        }

        return {...state, date: dateSend};
    case "updateMessageId":
        return {...state, message_id: action.data};
    case "updateContentType":
        return {...state, content_type: action.data};
    case "updateIsMultipart":
        return {...state, is_multipart: action.data};
    case "updateReceivedLines":
        if(!state.received_lines){
            state.received_lines = [];
        }
                
        state.received_lines.push(action.data);
        
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