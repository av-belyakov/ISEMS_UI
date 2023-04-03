export default function reducerX509CertificatePatternSTIXObjects(state, action){
    let dateTime = "";
    let defaultData = "0001-01-01T00:00:00Z";
    let minDefaultData = "1970-01-01T00:00:00.000Z";
    let currentTimeZoneOffsetInHours = new Date().getTimezoneOffset() / 60;
    let ms = currentTimeZoneOffsetInHours * 3600000;

    let tmp = "";

    switch(action.type){
    case "newAll":
        if(state.modified_time){
            if(action.data.modified_time === defaultData){
                action.data.modified_time = minDefaultData;
            } else {
                action.data.modified_time = new Date(Date.parse(action.data.modified_time)).toISOString();
            }
        }

        return action.data;
    case "cleanAll":
        return {};
    case "addId":
        return {...state, id: action.data};


        /**
         * 
         * доделать обработчики и X509V3Extensions          X509V3ExtensionsTypeSTIX `json:"x509_v3_extensions" bson:"x509_v3_extensions"`
         * 
         */
    case "updateHashes":
        //return {...state, id: action.data};
        return {...state};
    case "updateIssuer":
        return {...state};
    case "updateSubject":
        return {...state};
    case "updateVersion":
        return {...state};
    case "updateIsSelfSigned":
        return {...state};
    case "updateSerialNumber":
        return {...state};
    case "updateValidityNotAfter":
        return {...state};
    case "updateValidityNotBefore":
        return {...state};
    case "updateSignatureAlgorithm":
        return {...state};
    case "updateSubjectPublicKeyModulus":
        return {...state};
    case "updateSubjectPublicKeyExponent":
        return {...state};
    case "updateSubjectPublicKeyAlgorithm":
        return {...state};


    /*case "updateKey":
        return {...state, key: action.data};
    case "updateModifiedTime":

        console.log("func 'reducerWindowsRegistryKeyPatternSTIXObjects', action.type:", action.type, " action.data:", action.data, " state:", state);

        tmp = Date.parse(action.data);

        if(currentTimeZoneOffsetInHours < 0){
            dateTime = new Date(tmp + (ms * -1));
        } else {
            dateTime = new Date(tmp - (ms * -1));
        }
        
        state.modified_time = new Date(Date.parse(dateTime)).toISOString();
        
        return {...state};
    case "updateNumberOfSubkeys":
        return {...state, number_of_subkeys: +action.data};
    case "addItemElementValues":
        state.values.push(action.data);

        return {...state};
    case "deleteItemElementValues":
        state.values.splice(action.data, 1);

        return {...state};*/
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