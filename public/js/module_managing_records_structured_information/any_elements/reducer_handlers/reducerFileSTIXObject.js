export default function reducerFilePatternSTIXObjects(state, action){
    let mtime = "";
    let atime = "";
    let currentTimeZoneOffsetInHours = new Date().getTimezoneOffset() / 60;
    let ms = currentTimeZoneOffsetInHours * 3600000;
    let tmp;

    switch(action.type){
    case "newAll":           
        if(action.data.mtime && action.data.atime){
            action.data.mtime = new Date(Date.parse(action.data.mtime)).toISOString();
            action.data.atime = new Date(Date.parse(action.data.atime)).toISOString();
        }

        return action.data;
    case "cleanAll":
        return {};
    case "addId":
        return {...state, id: action.data};
    /*case "updateValue":
        return {...state, value: action.data};
    case "updateResolvesToRefs":
        for(let i = 0; i < state.resolves_to_refs.length; i++){
            if(state.resolves_to_refs[i] === action.data.id){
                state.resolves_to_refs[i] = action.data.value;
            }
        }
    
        return {...state};*/
    case "updateName":
        return {...state, name: action.data};
    case "updateSize":
        return {...state, size: action.data};
    case "updateNameEnc":
        return {...state, name_enc: action.data};
    case "updateMineType":
        return {...state, mime_type: action.data};
    case "updateMagicNumberHex":
        return {...state, magic_number_hex: action.data};
    case "updateDateTimeMtime":
        tmp = Date.parse(action.data);
        //console.log("func 'reducerFilePatternSTIXObjects', action.type:", action.type, " tmp:", tmp);

        if(currentTimeZoneOffsetInHours < 0){
            mtime = new Date(tmp + (ms * -1)).toISOString();
        } else {
            mtime = new Date(tmp - (ms * -1)).toISOString();
        }
    
        //console.log("func 'reducerFilePatternSTIXObjects', action.type:", action.type, " action.data:", action.data, " mtime:", mtime);

        return {...state, mtime: mtime};
    case "updateDateTimeAtime":
        tmp = Date.parse(action.data);
    
        if(currentTimeZoneOffsetInHours < 0){
            atime = new Date(tmp + (ms * -1));
        } else {
            atime = new Date(tmp - (ms * -1));
        }
    
        return {...state, atime: atime};

        /**
            ParentDirectoryRef IdentifierTypeSTIX (string)
            Hashes HashesTypeSTIX         `json:"hashes" bson:"hashes"`
            ParentDirectoryRef IdentifierTypeSTIX
            ContainsRefs []IdentifierTypeSTIX ([]string)
	        ContentRef         IdentifierTypeSTIX
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