export default function reducerX509CertificatePatternSTIXObjects(state, action){
    let dateTime = "";
    let currentTimeZoneOffsetInHours = new Date().getTimezoneOffset() / 60;
    let ms = currentTimeZoneOffsetInHours * 3600000;

    let tmp = "";

    switch(action.type){
    case "newAll":
        if(action.data.validity_not_after){
            action.data.validity_not_after = new Date(Date.parse(action.data.validity_not_after)).toISOString();
        }

        if(action.data.validity_not_before){
            action.data.validity_not_before = new Date(Date.parse(action.data.validity_not_before)).toISOString();
        }

        if(action.data.x509_v3_extensions){
            if(action.data.x509_v3_extensions.private_key_usage_period_not_after){
                action.data.x509_v3_extensions.private_key_usage_period_not_after = new Date(Date.parse(action.data.x509_v3_extensions.private_key_usage_period_not_after)).toISOString();
            }

            if(action.data.x509_v3_extensions.private_key_usage_period_not_before){
                action.data.x509_v3_extensions.private_key_usage_period_not_before = new Date(Date.parse(action.data.x509_v3_extensions.private_key_usage_period_not_before)).toISOString();
            }
        }

        return action.data;
    case "cleanAll":
        return {};
    case "addId":
        return {...state, id: action.data};
    case "updateHashes":
        return {...state, hashes: action.data};
    case "updateIssuer":
        //console.log("func 'reducerX509CertificatePatternSTIXObjects', action.type:", action.type, " action.data:", action.data, " state:", state);

        return {...state, issuer: action.data};
    case "updateSubject":
        return {...state, subject: action.data};
    case "updateVersion":
        return {...state, version: action.data};
    case "updateIsSelfSigned":
        return {...state, is_self_signed: (action.data === "true")};
    case "updateSerialNumber":
        return {...state, serial_number: action.data};
    case "updateValidityNotAfter":
        tmp = Date.parse(action.data);
    
        if(currentTimeZoneOffsetInHours < 0){
            dateTime = new Date(tmp + (ms * -1));
        } else {
            dateTime = new Date(tmp - (ms * -1));
        }
        
        state.validity_not_after = new Date(Date.parse(dateTime)).toISOString();

        return {...state};
    case "updateValidityNotBefore":
        tmp = Date.parse(action.data);

        if(currentTimeZoneOffsetInHours < 0){
            dateTime = new Date(tmp + (ms * -1));
        } else {
            dateTime = new Date(tmp - (ms * -1));
        }
    
        state.validity_not_before = new Date(Date.parse(dateTime)).toISOString();

        return {...state};
    case "updateSignatureAlgorithm":
        return {...state, signature_algorithm: action.data};
    case "updateSubjectPublicKeyModulus":
        return {...state, subject_public_key_modulus: action.data};
    case "updateSubjectPublicKeyExponent":
        return {...state, subject_public_key_exponent: +action.data};
    case "updateSubjectPublicKeyAlgorithm":
        return {...state, subject_public_key_algorithm: action.data};

    case "updateExtensions":
        //        console.log("func 'reducerWindowsRegistryKeyPatternSTIXObjects', action.type:", action.type, " action.data:", action.data, " state:", state);

        if(action.data.type === "private_key_usage_period_not_before" || action.data.type === "private_key_usage_period_not_after"){
            tmp = Date.parse(action.data.elem);
    
            if(currentTimeZoneOffsetInHours < 0){
                dateTime = new Date(tmp + (ms * -1));
            } else {
                dateTime = new Date(tmp - (ms * -1));
            }
        
            state.x509_v3_extensions[action.data.type] = new Date(Date.parse(dateTime)).toISOString();

            return {...state};
        }

        state.x509_v3_extensions[action.data.type] = action.data.elem.target.value;

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