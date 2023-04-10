export default function reducerFilePatternSTIXObjects(state, action){
    let dateTime = "";
    let currentTimeZoneOffsetInHours = new Date().getTimezoneOffset() / 60;
    let ms = currentTimeZoneOffsetInHours * 3600000;
    let tmp;

    switch(action.type){
    case "newAll":           
        if(action.data.mtime){
            action.data.mtime = new Date(Date.parse(action.data.mtime)).toISOString();
        }

        if(action.data.atime){
            action.data.atime = new Date(Date.parse(action.data.atime)).toISOString();
        }

        return action.data;
    case "cleanAll":
        return {};
    case "addId":
        return {...state, id: action.data};
    case "updateName":
        return {...state, name: action.data};
    case "updateSize":
        return {...state, size: +action.data};
    case "updateCTime":
        return {...state, ctime: action.data};
    case "updateNameEnc":
        return {...state, name_enc: action.data};
    case "updateMineType":
        return {...state, mime_type: action.data};
    case "updateMagicNumberHex":
        return {...state, magic_number_hex: action.data};
    case "updateDateTimeMtime":
        tmp = Date.parse(action.data);

        if(currentTimeZoneOffsetInHours < 0){
            dateTime = new Date(tmp + (ms * -1)).toISOString();
        } else {
            dateTime = new Date(tmp - (ms * -1)).toISOString();
        }

        return {...state, mtime: new Date(Date.parse(dateTime)).toISOString()};
    case "updateDateTimeAtime":
        tmp = Date.parse(action.data);
    
        if(currentTimeZoneOffsetInHours < 0){
            dateTime = new Date(tmp + (ms * -1));
        } else {
            dateTime = new Date(tmp - (ms * -1));
        }
    
        return {...state, atime: new Date(Date.parse(dateTime)).toISOString()};
    case "updateAddHashes":       
        if(!state.hashes){
            state.hashes = {};
        }

        state.hashes[action.data.type] = action.data.description;

        return {...state};
    case "handlerDelHashes":
        delete state.hashes[action.data];

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